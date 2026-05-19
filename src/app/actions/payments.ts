"use server";

import Stripe from "stripe";
import { createBooking } from "./bookings";
import { getSupabaseService } from "@/lib/supabaseService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createConsultingCheckoutSession(bookingData: {
  fullName: string;
  email: string;
  platform: "Zoom" | "Google Meet";
  duration: 30 | 60;
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
      success_url: `${origin}/consulting?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/consulting?payment_cancelled=true`,
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
      .like("notes", `%stripe_session_id: ${sessionId}%`)
      .maybeSingle();

    if (existingBooking) {
      console.log(`Booking for stripe session ${sessionId} already exists.`);
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
      message: `stripe_session_id: ${sessionId}\n\n${meta.notes || ""}`,
      date: meta.date,
      time_slot: meta.time_slot,
      platform: meta.platform as "Zoom" | "Google Meet",
      duration: parseInt(meta.duration) as 30 | 60,
      service: "Professional Consultation",
    });

    return result;
  } catch (error: any) {
    console.error("Error confirming booking:", error);
    return { success: false, error: error.message || "Failed to confirm your booking." };
  }
}
