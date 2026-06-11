import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseService } from "@/lib/supabaseService";
import { sendEbookPurchaseConfirmation, sendEbookAdminNotification } from "@/lib/mail";
import { slugify } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15" as any,
});

// Disable body parsing so we can read the raw body for signature verification
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const reqText = await req.text();
  const sig = req.headers.get("stripe-signature");
  
  // Accept either STRIPE_WEBHOOK_SECRET or STRIPE_WEBHOOK from env
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK;

  let event: Stripe.Event;

  try {
    if (sig && webhookSecret) {
      event = stripe.webhooks.constructEvent(reqText, sig, webhookSecret);
    } else {
      // Fallback for easy local testing when no webhook secret is set
      console.warn("⚠️ Webhook running WITHOUT signature verification. Enforce in production.");
      const jsonBody = JSON.parse(reqText);
      event = jsonBody as Stripe.Event;
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle completed checkout sessions
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const ebookId = session.metadata?.ebookId;
    const timeSlot = session.metadata?.time_slot;

    // --- CASE 1: E-BOOK TRANSACTION ---
    if (ebookId) {
      const customerEmail = session.metadata?.customerEmail || session.customer_details?.email || session.customer_email;
      const customerName = session.customer_details?.name || session.metadata?.fullName || "Customer";

      if (customerEmail) {
        console.log(`Processing successful purchase of ebook ${ebookId} by ${customerEmail}`);
        
        try {
          const supabase = getSupabaseService();

          // 1. Check if transaction already exists (idempotency!)
          const { data: existingTx } = await supabase
            .from("transactions")
            .select("id")
            .eq("stripe_session_id", session.id)
            .maybeSingle();

          if (existingTx) {
            console.log(`Transaction for session ${session.id} already exists. Ignoring.`);
            return NextResponse.json({ received: true, status: "ignored_duplicate" });
          }

          // 2. Get the ebook details from the database
          const { data: ebook, error: fetchError } = await supabase
            .from("ebooks")
            .select("*")
            .eq("id", ebookId)
            .single();

          if (fetchError || !ebook) {
            console.error("Ebook purchased but not found in DB:", fetchError);
            return NextResponse.json({ received: true, error: "Ebook not found" });
          }

          // 3. Increment the download count by +1 in Supabase
          const currentDownloads = Number(ebook.downloads || 0);
          await supabase
            .from("ebooks")
            .update({ downloads: currentDownloads + 1 })
            .eq("id", ebookId);

          // 4. Construct direct link and browser flipbook link
          const host = req.headers.get("host") || "localhost:3000";
          const protocol = host.startsWith("localhost") ? "http" : "https";
          const origin = `${protocol}://${host}`;
          
          const downloadUrl = ebook.file_url || "";
          const flipbookUrl = `${origin}/ebooks/${slugify(ebook.title)}/read`;

          // 5. Send premium receipt and download details email
          await sendEbookPurchaseConfirmation({
            to: customerEmail,
            ebookTitle: ebook.title,
            ebookCover: ebook.cover_url || "",
            downloadUrl,
            flipbookUrl,
          });

          const promocodeUsed = session.metadata?.promoCodeApplied || "";
          const pricePaid = (session.amount_total || 0) / 100; // Stripe amount is in cents

          // Send admin sales notification email
          await sendEbookAdminNotification({
            customerName,
            customerEmail,
            ebookTitle: ebook.title,
            pricePaid,
            promocodeUsed,
          });
          
          const { error: insertTxError } = await supabase
            .from("transactions")
            .insert([{
              stripe_session_id: session.id,
              customer_name: customerName,
              customer_email: customerEmail,
              promocode_used: promocodeUsed || null,
              price_paid: pricePaid,
              item_type: "ebook",
              item_name: ebook.title
            }]);

          if (insertTxError) {
            console.error("Failed to insert ebook transaction record:", insertTxError);
          } else {
            console.log(`Successfully dispatched ebook download email & logged transaction for ${customerEmail}`);
          }

          // Resolve user_id if they already have a profile with this email
          let purchasedUserId = null;
          try {
            const { data: userProfile } = await supabase
              .from("profiles")
              .select("id")
              .eq("email", customerEmail)
              .maybeSingle();

            if (userProfile) {
              purchasedUserId = userProfile.id;
            }
          } catch (profileErr) {
            console.error("Failed to resolve profile for email:", customerEmail, profileErr);
          }

          // Log the secure eBook purchase
          const { error: insertPurchaseError } = await supabase
            .from("purchases")
            .insert([{
              user_id: purchasedUserId,
              user_email: customerEmail,
              ebook_id: ebookId,
              stripe_checkout_id: session.id
            }]);

          if (insertPurchaseError) {
            console.error("Failed to insert ebook purchase record:", insertPurchaseError);
          } else {
            console.log(`Logged eBook purchase for ${customerEmail}`);
          }
        } catch (err: any) {
          console.error("Failed to process completed checkout session metadata:", err);
        }
      }
    }
    
    // --- CASE 2: CONSULTATION BOOKING TRANSACTION ---
    else if (timeSlot) {
      const fullName = session.metadata?.fullName || session.customer_details?.name || "Customer";
      const email = session.metadata?.email || session.customer_details?.email || session.customer_email;
      const notes = session.metadata?.notes || "";
      const date = session.metadata?.date;
      const platform = session.metadata?.platform;
      const duration = session.metadata?.duration;

      if (email && date) {
        console.log(`Processing successful purchase of booking by ${email}`);
        
        try {
          const supabase = getSupabaseService();
          
          // 1. Check if transaction already exists (idempotency!)
          const { data: existingTx } = await supabase
            .from("transactions")
            .select("id")
            .eq("stripe_session_id", session.id)
            .maybeSingle();
            
          if (existingTx) {
            console.log(`Transaction for booking session ${session.id} already exists. Ignoring.`);
            return NextResponse.json({ received: true, status: "ignored_duplicate" });
          }

          // 2. Check if booking already exists (to avoid duplicate bookings if the user also hit the status page)
          const { data: existingBooking } = await supabase
            .from("bookings")
            .select("id")
            .or(`message.eq.${session.id},notes.like.%stripe_session_id: ${session.id}%`)
            .maybeSingle();

          if (!existingBooking) {
            // 3. Create the booking!
            const { createBooking } = await import("@/app/actions/bookings");
            const bookingResult = await createBooking({
              full_name: fullName,
              email: email,
              phone: "",
              message: notes,
              stripe_session_id: session.id,
              date: date,
              time_slot: timeSlot,
              platform: (platform as any) || "Zoom",
              duration: parseInt(duration || "30") as any,
              service: "Professional Consultation",
            });
            console.log("Booking created via webhook:", bookingResult);
          } else {
            console.log("Booking already exists in database. Skipping creation.");
          }
          
          // 4. Insert into transactions table!
          const pricePaid = (session.amount_total || 0) / 100;
          const { error: insertTxError } = await supabase
            .from("transactions")
            .insert([{
              stripe_session_id: session.id,
              customer_name: fullName,
              customer_email: email,
              promocode_used: null, // Consulting doesn't support promo codes in this version
              price_paid: pricePaid,
              item_type: "booking",
              item_name: `Consultation Call - ${date} ${timeSlot}`
            }]);

          if (insertTxError) {
            console.error("Failed to insert booking transaction record:", insertTxError);
          } else {
            console.log(`Successfully created booking and logged transaction for ${email}`);
          }
        } catch (err: any) {
          console.error("Failed to process booking in webhook:", err);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}

