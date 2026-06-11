"use server";

import Stripe from "stripe";
import { createBooking } from "./bookings";
import { getSupabaseService } from "@/lib/supabaseService";
import { sendEbookPurchaseConfirmation, sendEbookAdminNotification } from "@/lib/mail";
import { slugify } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createConsultingCheckoutSession(bookingData: {
  fullName: string;
  email: string;
  platform: "Zoom" | "Google Meet";
  duration: 15 | 30 | 60;
  notes: string;
  date: string;
  time_slot: string;
  packageName: string;
}, origin: string) {
  try {
    let priceAmount = 6000; // default for 30 min ($60)
    if (bookingData.packageName === "Quick Chat") {
      priceAmount = 0;
    } else if (bookingData.packageName === "Quick-Fire") {
      priceAmount = 6000; // $60
    } else if (bookingData.packageName === "Deep-Dive") {
      priceAmount = 11000; // $110
    } else if (bookingData.packageName === "Mentorship") {
      priceAmount = 45000; // $450
    } else {
      priceAmount = bookingData.duration === 60 ? 11000 : 6000;
    }

    if (priceAmount === 0) {
      return { success: false, error: "Cannot create checkout session for a free package." };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${bookingData.packageName} Consultation Call`,
              description: `Meeting on ${bookingData.date} at ${bookingData.time_slot} via ${bookingData.platform} (${bookingData.duration} Mins)`,
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/consulting/status?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/consulting/status?success=false`,
      metadata: {
        fullName: bookingData.fullName,
        email: bookingData.email,
        platform: bookingData.platform,
        duration: String(bookingData.duration),
        notes: bookingData.notes,
        date: bookingData.date,
        time_slot: bookingData.time_slot,
      },
    });

    return { success: true, url: session.url };
  } catch (error: any) {
    console.error("Error creating stripe session:", error);
    return { success: false, error: error.message || "Failed to initiate payment session." };
  }
}

export async function confirmStripeBooking(sessionId: string) {
  try {
    const supabase = getSupabaseService();

    // 1. Check if a booking with this stripe session ID already exists to prevent duplicate bookings/charges
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id")
      .or(`message.eq.${sessionId},notes.like.%stripe_session_id: ${sessionId}%`)
      .maybeSingle();

    if (existingBooking) {
      console.log(`Booking for stripe session ${sessionId} already exists.`);
      
      const { data: bookingDetails } = await supabase
        .from("bookings")
        .select(`
          id,
          user_name,
          user_email,
          meeting_platform,
          duration,
          meeting_link,
          time_slots (
            start_time
          )
        `)
        .eq("id", existingBooking.id)
        .maybeSingle();

      if (bookingDetails) {
        const slots = bookingDetails.time_slots as any;
        const startTime = Array.isArray(slots) ? slots[0]?.start_time : slots?.start_time;
        const startDate = startTime ? new Date(startTime) : new Date();
        return {
          success: true,
          alreadyCreated: true,
          booking: {
            id: bookingDetails.id,
            fullName: bookingDetails.user_name,
            email: bookingDetails.user_email,
            date: startTime ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}` : "",
            timeSlot: startTime ? `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}` : "",
            platform: bookingDetails.meeting_platform,
            duration: bookingDetails.duration,
            meetingLink: bookingDetails.meeting_link
          }
        };
      }
      return { success: true, alreadyCreated: true };
    }

    // 2. Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return { success: false, error: "Payment has not been completed." };
    }

    const meta = session.metadata;
    if (!meta) {
      return { success: false, error: "Session metadata is missing." };
    }

    // 3. Create the booking in Supabase
    const result = await createBooking({
      full_name: meta.fullName,
      email: meta.email,
      phone: "",
      message: meta.notes || "",
      stripe_session_id: sessionId,
      date: meta.date,
      time_slot: meta.time_slot,
      platform: meta.platform as "Zoom" | "Google Meet",
      duration: parseInt(meta.duration) as 15 | 30 | 60,
      service: "Professional Consultation",
    });

    if (result.success) {
      // 4. Log the transaction in the database (just like ebooks!)
      const { data: existingTx } = await supabase
        .from("transactions")
        .select("id")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();

      if (!existingTx) {
        const pricePaid = (session.amount_total || 0) / 100;
        const { error: insertTxError } = await supabase
          .from("transactions")
          .insert([{
            stripe_session_id: sessionId,
            customer_name: meta.fullName,
            customer_email: meta.email,
            promocode_used: null,
            price_paid: pricePaid,
            item_type: "booking",
            item_name: `Consultation Call - ${meta.date} ${meta.time_slot}`
          }]);

        if (insertTxError) {
          console.error("Failed to insert booking transaction record in confirmStripeBooking:", insertTxError);
        } else {
          console.log(`Successfully logged transaction in confirmStripeBooking for ${meta.email}`);
        }
      }
    }

    return result;
  } catch (error: any) {
    console.error("Error confirming booking:", error);
    return { success: false, error: error.message || "Failed to confirm your booking." };
  }
}

export async function confirmEbookPurchase(sessionId: string, origin: string) {
  try {
    const supabase = getSupabaseService();

    // 1. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return { success: false, error: "Payment has not been completed." };
    }

    const ebookId = session.metadata?.ebookId;
    if (!ebookId) {
      return { success: false, error: "Session metadata is missing ebookId." };
    }

    const customerEmail = session.metadata?.customerEmail || session.customer_details?.email || session.customer_email;
    const customerName = session.customer_details?.name || session.metadata?.fullName || "Customer";

    if (!customerEmail) {
      return { success: false, error: "Customer email is missing." };
    }

    // 2. Check if a transaction with this stripe session ID already exists (idempotency!)
    const { data: existingTx } = await supabase
      .from("transactions")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (existingTx) {
      console.log(`Transaction for session ${sessionId} already exists. Returning details.`);
      
      // Fetch ebook for display
      const { data: ebook } = await supabase
        .from("ebooks")
        .select("id, title, cover_url, file_url")
        .eq("id", ebookId)
        .single();

      if (!ebook) {
        return { success: false, error: "Ebook not found" };
      }

      return {
        success: true,
        alreadyCreated: true,
        purchaseDetails: {
          receiptNo: (session.payment_intent as string) || "",
          amountPaid: (session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00"),
          email: customerEmail,
          ebook: {
            id: ebook.id,
            title: ebook.title,
            cover_url: ebook.cover_url || null,
            file_url: ebook.file_url || null,
          }
        }
      };
    }

    // 3. Get the ebook details from the database
    const { data: ebook, error: fetchError } = await supabase
      .from("ebooks")
      .select("*")
      .eq("id", ebookId)
      .single();

    if (fetchError || !ebook) {
      console.error("Ebook purchased but not found in DB:", fetchError);
      return { success: false, error: "Ebook not found" };
    }

    // 4. Increment the download count by +1 in Supabase
    const currentDownloads = Number(ebook.downloads || 0);
    await supabase
      .from("ebooks")
      .update({ downloads: currentDownloads + 1 })
      .eq("id", ebookId);

    // 5. Construct download URL and flipbook URL
    const downloadUrl = ebook.file_url || "";
    const flipbookUrl = `${origin}/ebooks/${slugify(ebook.title)}/read`;

    // 6. Send premium receipt and download details email
    await sendEbookPurchaseConfirmation({
      to: customerEmail,
      ebookTitle: ebook.title,
      ebookCover: ebook.cover_url || "",
      downloadUrl,
      flipbookUrl,
    });

    const promocodeUsed = session.metadata?.promoCodeApplied || "";
    const pricePaid = (session.amount_total || 0) / 100; // Stripe amount is in cents

    // 7. Send admin sales notification email
    await sendEbookAdminNotification({
      customerName,
      customerEmail,
      ebookTitle: ebook.title,
      pricePaid,
      promocodeUsed,
    });

    // 8. Log the transaction in the database
    const { error: insertTxError } = await supabase
      .from("transactions")
      .insert([{
        stripe_session_id: sessionId,
        customer_name: customerName,
        customer_email: customerEmail,
        promocode_used: promocodeUsed || null,
        price_paid: pricePaid,
        item_type: "ebook",
        item_name: ebook.title
      }]);

    if (insertTxError) {
      console.error("Failed to insert ebook transaction record:", insertTxError);
      return { success: false, error: "Failed to save transaction details." };
    }

    // 9. Resolve user_id if they already have a profile with this email, and log purchase
    let purchasedUserId = null;
    try {
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("id")
        .ilike("email", customerEmail)
        .maybeSingle();

      if (userProfile) {
        purchasedUserId = userProfile.id;
      }
    } catch (profileErr) {
      console.error("Failed to resolve profile for email in confirmEbookPurchase:", customerEmail, profileErr);
    }

    const { error: insertPurchaseError } = await supabase
      .from("purchases")
      .insert([{
        user_id: purchasedUserId,
        user_email: customerEmail,
        ebook_id: ebookId,
        stripe_checkout_id: sessionId
      }]);

    if (insertPurchaseError) {
      console.error("Failed to insert ebook purchase record in confirmEbookPurchase:", insertPurchaseError);
    } else {
      console.log(`Logged eBook purchase for ${customerEmail} in confirmEbookPurchase`);
    }

    console.log(`Successfully completed ebook purchase for ${customerEmail} via success page callback.`);

    return {
      success: true,
      purchaseDetails: {
        receiptNo: (session.payment_intent as string) || "",
        amountPaid: pricePaid.toFixed(2),
        email: customerEmail,
        ebook: {
          id: ebook.id,
          title: ebook.title,
          cover_url: ebook.cover_url || null,
          file_url: ebook.file_url || null,
        }
      }
    };
  } catch (error: any) {
    console.error("Error processing ebook purchase success:", error);
    return { success: false, error: error.message || "Failed to process ebook purchase." };
  }
}

