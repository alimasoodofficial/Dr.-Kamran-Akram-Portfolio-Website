import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email, code, hash, expirationTime } = await req.json();

    if (!email || !code || !hash || !expirationTime) {
      return NextResponse.json({ error: "Missing required verification details." }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // 1. Verify code expiration
    if (Date.now() > Number(expirationTime)) {
      return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
    }

    // 2. Compute the expected HMAC signature and verify match
    const secret = process.env.JWT_SECRET || process.env.STRIPE_SECRET_KEY || "kamran_secret_key_123_abc";
    const dataToSign = `${sanitizedEmail}:${code}:${expirationTime}`;
    const expectedHash = crypto.createHmac("sha256", secret).update(dataToSign).digest("hex");

    if (hash !== expectedHash) {
      return NextResponse.json({ error: "Invalid verification code. Please check and try again." }, { status: 400 });
    }

    // 3. Code verified! Generate a stateless library session token
    // Token structure: email:issuedAtTimestamp.signature
    const issuedAt = Date.now();
    const tokenData = `${sanitizedEmail}:${issuedAt}`;
    const tokenSignature = crypto.createHmac("sha256", secret).update(tokenData).digest("hex");
    const libraryToken = `${tokenData}.${tokenSignature}`;

    return NextResponse.json({
      success: true,
      email: sanitizedEmail,
      libraryToken,
    });
  } catch (err: any) {
    console.error("verify-code API error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred." }, { status: 500 });
  }
}
