import { NextResponse } from "next/server";
import { getSupabaseService, syncPurchasesForEmail } from "@/lib/supabaseService";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Unauthorized access: missing credentials." }, { status: 401 });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // 1. Verify token signature
    const secret = process.env.JWT_SECRET || process.env.STRIPE_SECRET_KEY || "kamran_secret_key_123_abc";
    const lastDotIndex = token.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return NextResponse.json({ error: "Invalid session token." }, { status: 401 });
    }

    const tokenData = token.substring(0, lastDotIndex);
    const signature = token.substring(lastDotIndex + 1);
    const expectedSignature = crypto.createHmac("sha256", secret).update(tokenData).digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Session verification failed." }, { status: 401 });
    }

    // 2. Parse token content and check email + age
    const [tokenEmail, tokenTimestampStr] = tokenData.split(":");
    if (tokenEmail !== sanitizedEmail) {
      return NextResponse.json({ error: "Session token email mismatch." }, { status: 401 });
    }

    const tokenTimestamp = Number(tokenTimestampStr);
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - tokenTimestamp > sevenDaysMs) {
      return NextResponse.json({ error: "Session has expired. Please log in again." }, { status: 401 });
    }

    // Auto-sync/backfill any matching ebook transactions to purchases
    await syncPurchasesForEmail(sanitizedEmail);

    // 3. Fetch purchase records with ebook info
    const supabaseService = getSupabaseService();
    const { data: purchases, error: purchasesErr } = await supabaseService
      .from("purchases")
      .select("id, user_email, created_at, stripe_checkout_id, ebook_id, ebooks(*)")
      .ilike("user_email", sanitizedEmail)
      .order("created_at", { ascending: false });

    if (purchasesErr) {
      console.error("Error fetching purchases:", purchasesErr);
      return NextResponse.json({ error: "Failed to retrieve purchases." }, { status: 500 });
    }

    if (!purchases || purchases.length === 0) {
      return NextResponse.json({ purchases: [] });
    }

    // 4. Fetch matching transaction details using stripe_checkout_id
    const checkoutIds = purchases.map((p) => p.stripe_checkout_id).filter(Boolean);
    let transactions: any[] = [];
    if (checkoutIds.length > 0) {
      const { data: txData, error: txErr } = await supabaseService
        .from("transactions")
        .select("stripe_session_id, customer_name, customer_email, price_paid, promocode_used")
        .in("stripe_session_id", checkoutIds);

      if (txErr) {
        console.error("Error fetching transactions:", txErr);
      } else if (txData) {
        transactions = txData;
      }
    }

    // 5. Combine purchase, ebook, and transaction details
    const formattedPurchases = purchases.map((purchase) => {
      const tx = transactions.find((t) => t.stripe_session_id === purchase.stripe_checkout_id);
      return {
        id: purchase.id,
        ebookId: purchase.ebook_id,
        createdAt: purchase.created_at,
        stripeCheckoutId: purchase.stripe_checkout_id,
        ebook: purchase.ebooks,
        transaction: tx ? {
          customerName: tx.customer_name,
          customerEmail: tx.customer_email,
          pricePaid: tx.price_paid,
          promocodeUsed: tx.promocode_used,
        } : null,
      };
    });

    return NextResponse.json({
      success: true,
      purchases: formattedPurchases,
    });
  } catch (err: any) {
    console.error("purchases API error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred." }, { status: 500 });
  }
}
