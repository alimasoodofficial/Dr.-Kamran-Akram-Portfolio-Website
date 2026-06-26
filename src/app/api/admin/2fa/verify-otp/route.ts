import { NextResponse } from "next/server";
import { otpStore } from "../send-otp/route";

const MAX_ATTEMPTS = 5;

// ---------------------------------------------------------------------------
// POST /api/admin/2fa/verify-otp
// Body: { accessToken: string; otp: string }
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { accessToken, otp } = await req.json();

    if (!accessToken || !otp) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const entry = otpStore.get(accessToken);

    if (!entry) {
      return NextResponse.json({ error: "No OTP found. Please request a new code." }, { status: 400 });
    }

    // --- Expired? ---
    if (Date.now() > entry.expiresAt) {
      otpStore.delete(accessToken);
      return NextResponse.json({ error: "OTP has expired. Please request a new code." }, { status: 400 });
    }

    // --- Too many attempts? ---
    entry.attempts += 1;
    if (entry.attempts > MAX_ATTEMPTS) {
      otpStore.delete(accessToken);
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new code." },
        { status: 429 }
      );
    }

    // --- Verify ---
    if (otp.trim() !== entry.otp) {
      const remaining = MAX_ATTEMPTS - entry.attempts;
      return NextResponse.json(
        { error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` },
        { status: 400 }
      );
    }

    // --- Success: clean up OTP ---
    otpStore.delete(accessToken);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[2fa/verify-otp] Error:", err.message);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
