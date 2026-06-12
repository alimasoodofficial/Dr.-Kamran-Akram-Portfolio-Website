import { NextResponse } from "next/server";
import { getSupabaseService, syncPurchasesForEmail } from "@/lib/supabaseService";
import { sendEbookLibraryVerificationCode } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Auto-sync/backfill any matching ebook transactions to purchases
    await syncPurchasesForEmail(sanitizedEmail);

    // 1. Query Supabase to see if this email has bought any eBooks
    const supabaseService = getSupabaseService();
    const { data: purchase, error: purchaseErr } = await supabaseService
      .from("purchases")
      .select("id")
      .ilike("user_email", sanitizedEmail)
      .limit(1)
      .maybeSingle();

    if (purchaseErr) {
      console.error("Database query error:", purchaseErr);
      return NextResponse.json({ error: "Failed to verify email in our records. Please try again." }, { status: 500 });
    }

    if (!purchase) {
      return NextResponse.json(
        { error: "No purchased eBooks found for this email address. Please make sure you entered the email used during checkout." },
        { status: 404 }
      );
    }

    // 2. Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    console.log(`[EBOOK_LIBRARY_OTP] Verification code generated for ${sanitizedEmail}: ${code}`);

    // 3. Create a secure HMAC signature (hash) of the data
    const secret = process.env.JWT_SECRET || process.env.STRIPE_SECRET_KEY || "kamran_secret_key_123_abc";
    const dataToSign = `${sanitizedEmail}:${code}:${expirationTime}`;
    const hash = crypto.createHmac("sha256", secret).update(dataToSign).digest("hex");

    // 4. Send the verification email
    const mailResult = await sendEbookLibraryVerificationCode({
      to: sanitizedEmail,
      code,
    });

    if (!mailResult.success) {
      return NextResponse.json({ error: "Failed to send verification email. Please try again." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      hash,
      expirationTime,
    });
  } catch (err: any) {
    console.error("send-code API error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred." }, { status: 500 });
  }
}
