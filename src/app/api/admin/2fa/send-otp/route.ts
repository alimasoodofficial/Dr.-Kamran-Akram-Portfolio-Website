import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";
import nodemailer from "nodemailer";

// ---------------------------------------------------------------------------
// In-memory OTP store  (process-scoped; works fine for a single admin)
// Each entry: { otp, expiresAt, attempts }
// ---------------------------------------------------------------------------
export const otpStore = new Map<
  string,
  { otp: string; expiresAt: number; attempts: number }
>();

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---------------------------------------------------------------------------
// Email transporter (reuse SMTP config already in the project)
// ---------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_PORT === "465",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

function buildOtpEmailHtml(otp: string, adminEmail: string): string {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Admin 2FA Code</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdf4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Emerald top bar -->
          <tr>
            <td style="height:5px;background:linear-gradient(90deg,#10b981,#059669,#34d399);border-radius:6px 6px 0 0;"></td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border:1px solid #d1fae5;border-top:none;border-radius:0 0 20px 20px;padding:40px 40px 32px;box-shadow:0 4px 24px rgba(16,185,129,0.08);">

              <!-- Shield icon + title -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="display:inline-block;background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:1px solid #a7f3d0;border-radius:20px;padding:18px 22px;margin-bottom:18px;">
                      <span style="font-size:34px;line-height:1;">🛡️</span>
                    </div>
                    <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#064e3b;letter-spacing:-0.5px;">Two-Factor Authentication</h1>
                    <p style="margin:0;font-size:14px;color:#6b7280;">Management Portal &nbsp;·&nbsp; Admin Access</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr><td style="height:1px;background:#e5e7eb;"></td></tr>
              </table>

              <!-- Description -->
              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;text-align:center;">
                Your one-time verification code for <strong style="color:#065f46;">${adminEmail}</strong> is ready.<br/>This code expires in <strong style="color:#10b981;">5 minutes</strong>.
              </p>

              <!-- OTP code box — single span, user-select:all for double-click copy -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #6ee7b7;border-radius:16px;padding:22px 40px;box-shadow:0 4px 20px rgba(16,185,129,0.15),inset 0 1px 0 rgba(255,255,255,0.8);">
                      <span style="display:block;font-size:40px;font-weight:800;color:#059669;font-family:'Courier New',Courier,monospace;letter-spacing:16px;user-select:all;-webkit-user-select:all;-moz-user-select:all;-ms-user-select:all;cursor:text;line-height:1;">${otp}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Copy hint -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <p style="margin:0;font-size:12px;color:#6b7280;letter-spacing:0.3px;">
                      💡 <em>Double-click the code to select it, then press <strong style="color:#059669;">Ctrl&nbsp;+&nbsp;C</strong> to copy</em>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Expiry warning -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;margin-bottom:20px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                      ⏳ &nbsp;<strong>Valid for 5 minutes only.</strong> Do not share this code with anyone. Dr. Muhammad Kamran's team will never ask for it.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:1px;">🔐 Security Notice</p>
                    <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:1.8;">
                      <li>This code was requested from your admin portal login.</li>
                      <li>If you did not attempt to log in, please secure your account immediately.</li>
                      <li>Never share this code via email, phone, or chat.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e5e7eb;padding-top:24px;">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 6px;font-size:12px;color:#6b7280;">Dr. Muhammad Kamran &nbsp;·&nbsp; Management Portal</p>
                    <p style="margin:0;font-size:11px;color:#9ca3af;">© ${year} All rights reserved. This is a secure, automated message.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// POST /api/admin/2fa/send-otp
// Body: { accessToken: string }
// Validates the admin session, generates OTP, emails it, stores in memory.
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();
    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token" }, { status: 400 });
    }

    // --- Verify admin identity ---
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabaseService = getSupabaseService();
    const { data, error } = await supabaseService.auth.getUser(accessToken);
    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileErr } = await supabaseService
      .from("profiles")
      .select("is_admin, email")
      .eq("id", data.user.id)
      .single();

    if (profileErr || !profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const adminEmail = profile.email || data.user.email || process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return NextResponse.json({ error: "Admin email not found" }, { status: 500 });
    }

    // --- Rate-limit: check if an OTP was sent recently (< 60s ago) ---
    const existing = otpStore.get(accessToken);
    const now = Date.now();
    if (existing) {
      const sentAt = existing.expiresAt - OTP_TTL_MS;
      const cooldown = 60_000; // 60 seconds
      if (now - sentAt < cooldown) {
        const waitSec = Math.ceil((cooldown - (now - sentAt)) / 1000);
        return NextResponse.json(
          { error: `Please wait ${waitSec}s before requesting a new code.`, waitSec },
          { status: 429 }
        );
      }
    }

    // --- Generate & store OTP ---
    const otp = generateOtp();
    otpStore.set(accessToken, {
      otp,
      expiresAt: now + OTP_TTL_MS,
      attempts: 0,
    });

    // --- Send email ---
    await transporter.sendMail({
      from: `"Dr. Muhammad Kamran – Security" <${process.env.EMAIL_SERVER_USER}>`,
      to: adminEmail,
      subject: `🔐 Your Admin 2FA Code: ${otp}`,
      html: buildOtpEmailHtml(otp, adminEmail),
      text: `Your 2FA verification code is: ${otp}\n\nThis code expires in 5 minutes. Do not share it with anyone.`,
    });

    return NextResponse.json({
      ok: true,
      maskedEmail: maskEmail(adminEmail),
    });
  } catch (err: any) {
    console.error("[2fa/send-otp] Error:", err.message);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  const visible = user.slice(0, 3);
  const masked = "*".repeat(Math.max(0, user.length - 3));
  return `${visible}${masked}@${domain}`;
}
