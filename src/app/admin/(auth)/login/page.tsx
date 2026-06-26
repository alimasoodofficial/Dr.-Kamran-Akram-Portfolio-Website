"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Lock, Mail, ChevronRight, Loader2,
  ArrowLeft, ShieldCheck, RefreshCw, KeyRound,
} from "lucide-react";

// ─── Step types ─────────────────────────────────────────────────────────────
type Step = "credentials" | "otp";

const RESEND_COOLDOWN = 60; // seconds

export default function AdminLogin() {
  // ── Credentials step
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── 2FA step
  const [step, setStep]             = useState<Step>("credentials");
  const [otp, setOtp]               = useState(["", "", "", "", "", ""]);
  const [accessToken, setAccessToken] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  // ── UI state
  const [err, setErr]               = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router  = useRouter();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Check existing session
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
          const res = await fetch("/api/admin/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: session.access_token }),
          });
          if (res.ok) {
            document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=604800; SameSite=Lax; Secure`;
            router.replace("/admin/dashboard");
            return;
          }
        }
      } catch {}
      finally { setIsVerifying(false); }
    }
    checkSession();
  }, [router]);

  // ── Resend countdown
  const startTimer = useCallback(() => {
    setResendTimer(RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ── Step 1: Sign in with Supabase → validate admin → send OTP
  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setIsLoggingIn(true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const token = data.session?.access_token;
      if (!token) throw new Error("No session token");

      const res = await fetch("/api/admin/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token }),
      });
      if (!res.ok) {
        await supabaseClient.auth.signOut();
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Not authorized as admin");
      }

      // Send OTP
      setIsSendingOtp(true);
      const otpRes = await fetch("/api/admin/2fa/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token }),
      });
      const otpData = await otpRes.json();
      if (!otpRes.ok) throw new Error(otpData.error || "Failed to send OTP");

      setAccessToken(token);
      setMaskedEmail(otpData.maskedEmail || "your admin email");
      setStep("otp");
      startTimer();
      toast.success("Verification code sent!", { icon: "📧" });
    } catch (err: any) {
      setErr(err.message);
      toast.error(err.message);
    } finally {
      setIsLoggingIn(false);
      setIsSendingOtp(false);
    }
  };

  // ── Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setErr("");
    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/admin/2fa/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
      startTimer();
      toast.success("New code sent!", { icon: "📧" });
    } catch (err: any) {
      setErr(err.message);
      toast.error(err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ── OTP digit input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // ── Step 2: Verify OTP → redirect
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setErr("Please enter the full 6-digit code."); return; }
    setErr("");
    setIsVerifyingOtp(true);
    try {
      const res = await fetch("/api/admin/2fa/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");

      document.cookie = `sb-access-token=${accessToken}; path=/; max-age=604800; SameSite=Lax; Secure`;
      toast.success("Welcome back, Dr. Kamran! 👋", { duration: 3000 });
      router.push("/admin/dashboard");
    } catch (err: any) {
      setErr(err.message);
      toast.error(err.message);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // ── Loading spinner
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05060f]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-500 rounded-full animate-spin [animation-duration:2s]" />
          </div>
          <p className="text-slate-400 font-medium tracking-wider">SECURE ACCESS INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/[0.05] blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/[0.05] blur-[120px] rounded-full" />
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group z-50 text-sm font-medium"
      >
        <div className="p-2 bg-white rounded-lg border border-slate-200 group-hover:border-slate-300 shadow-sm">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="hidden sm:inline">Back to Website</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative pt-12 sm:pt-0"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-10" />

        <div className="relative bg-white border border-slate-200 rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-slate-100">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
              animate={{ width: step === "credentials" ? "50%" : "100%" }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {/* ════════════════════════════════ STEP 1 ════ */}
              {step === "credentials" && (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-5 shadow-sm">
                      <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
                      Management Portal
                    </h2>
                    <p className="text-slate-500 text-sm">Step 1 of 2 — Enter your credentials</p>
                  </div>

                  <form onSubmit={handleCredentials} className="space-y-5">
                    <ErrorBanner err={err} />

                    {/* Email */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="Admin Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm sm:text-base"
                      />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Access Key"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-12 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-mono text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-2 right-2 px-3 flex items-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn || isSendingOtp}
                      className="group relative w-full flex items-center justify-center gap-2 py-4 text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoggingIn || isSendingOtp ? (
                        <><Loader2 className="w-5 h-5 animate-spin" />{isSendingOtp ? "Sending Code..." : "Verifying..."}</>
                      ) : (
                        <>CONTINUE TO VERIFICATION<ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </form>

                  <p className="mt-7 text-center text-slate-400 text-xs uppercase tracking-widest font-semibold italic">
                    Authorized Personnel Only
                  </p>
                </motion.div>
              )}

              {/* ════════════════════════════════ STEP 2 ════ */}
              {step === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-5 shadow-sm">
                      <ShieldCheck className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
                      Verify Your Identity
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Step 2 of 2 — A 6-digit code was sent to<br />
                      <span className="font-semibold text-indigo-600">{maskedEmail}</span>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <ErrorBanner err={err} />

                    {/* OTP Digit Boxes */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 text-center">
                        Enter Verification Code
                      </label>
                      <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                        {otp.map((digit, i) => (
                          <motion.input
                            key={i}
                            ref={(el) => { otpRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            autoFocus={i === 0}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all caret-transparent"
                            style={{ width: "clamp(40px, 13vw, 56px)", height: "clamp(52px, 15vw, 64px)" }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Verify button */}
                    <button
                      type="submit"
                      disabled={isVerifyingOtp || otp.join("").length < 6}
                      className="group relative w-full flex items-center justify-center gap-2 py-4 text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isVerifyingOtp ? (
                        <><Loader2 className="w-5 h-5 animate-spin" />Verifying Code...</>
                      ) : (
                        <><KeyRound className="w-4 h-4" />VERIFY & ACCESS PORTAL</>
                      )}
                    </button>

                    {/* Resend row */}
                    <div className="flex items-center justify-center gap-3">
                      {resendTimer > 0 ? (
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <div className="relative w-8 h-8">
                            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                              <circle cx="16" cy="16" r="13" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                              <circle
                                cx="16" cy="16" r="13"
                                fill="none" stroke="#6366f1" strokeWidth="2.5"
                                strokeDasharray={`${2 * Math.PI * 13}`}
                                strokeDashoffset={`${2 * Math.PI * 13 * (1 - resendTimer / RESEND_COOLDOWN)}`}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dashoffset 1s linear" }}
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-indigo-600">
                              {resendTimer}
                            </span>
                          </div>
                          <span>Resend in {resendTimer}s</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={isSendingOtp}
                          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${isSendingOtp ? "animate-spin" : ""}`} />
                          {isSendingOtp ? "Sending..." : "Resend Code"}
                        </button>
                      )}
                    </div>

                    {/* Back link */}
                    <button
                      type="button"
                      onClick={() => { setStep("credentials"); setErr(""); setOtp(["","","","","",""]); }}
                      className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      ← Use different credentials
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ErrorBanner({ err }: { err: string }) {
  return (
    <AnimatePresence mode="wait">
      {err && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          {err}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
