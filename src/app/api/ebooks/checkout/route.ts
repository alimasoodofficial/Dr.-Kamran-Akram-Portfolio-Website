import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { slugify } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15" as any, // standard version overrides
});

export async function POST(req: Request) {
  try {
    const { ebookId, email, promoCode } = await req.json();

    if (!ebookId || !email) {
      return NextResponse.json({ error: "Missing ebookId or email" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    
    // Fetch the ebook to verify existence and get the price
    const { data: ebook, error } = await supabase
      .from("ebooks")
      .select("*")
      .eq("id", ebookId)
      .single();

    if (error || !ebook) {
      return NextResponse.json({ error: "Ebook not found" }, { status: 404 });
    }

    // Determine target checkout base price (discounted vs regular)
    let targetPrice = ebook.price !== null ? Number(ebook.price) : 9.99;
    
    const now = new Date();
    const hasActiveDiscount = 
      ebook.discount_price !== null && 
      Number(ebook.discount_price) > 0 && 
      ebook.discount_expires_at && 
      new Date(ebook.discount_expires_at) > now;
      
    if (hasActiveDiscount) {
      targetPrice = Number(ebook.discount_price);
    }

    // Apply promo code if provided
    let promoApplied = false;
    let discountPercent = 0;
    if (promoCode) {
      const { data: promo } = await supabase
        .from("promo_codes")
        .select("*")
        .ilike("code", promoCode.trim())
        .single();
        
      if (promo && promo.is_active && (!promo.expires_at || new Date(promo.expires_at) > now)) {
        discountPercent = Number(promo.discount_percent);
        targetPrice = targetPrice * (1 - discountPercent / 100);
        promoApplied = true;
      }
    }

    const priceAmount = Math.round(targetPrice * 100);

    // Verify charge threshold
    if (priceAmount > 0 && priceAmount < 50) {
      return NextResponse.json({ error: "Stripe requires a minimum charge of $0.50 USD." }, { status: 400 });
    }

    // Get origin for redirection
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: ebook.title,
              description: ebook.description ? ebook.description.substring(0, 100) + "..." : "Premium Educational E-Book & Guide",
              images: ebook.cover_url ? [ebook.cover_url] : [],
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        ebookId: ebook.id,
        customerEmail: email,
        promoCodeApplied: promoApplied ? promoCode : "",
        discountPercentApplied: String(discountPercent),
      },
      success_url: `${origin}/ebooks/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/ebooks/${slugify(ebook.title)}`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message || "Failed to create payment session" }, { status: 500 });
  }
}
