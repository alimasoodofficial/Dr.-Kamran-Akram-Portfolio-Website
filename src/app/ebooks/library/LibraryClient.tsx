"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Lock, 
  Mail, 
  Key, 
  Loader2, 
  ArrowRight, 
  LogOut, 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  ShieldCheck,
  ChevronRight,
  Book,
  Sparkles,
  Download
} from "lucide-react";
import toast from "react-hot-toast";
import BookCard from "@/components/ui/BookCard";
import { slugify } from "@/lib/utils";

type Purchase = {
  id: string;
  ebookId: string;
  createdAt: string;
  stripeCheckoutId: string | null;
  ebook: {
    id: string;
    title: string;
    description?: string;
    cover_url?: string;
    is_downloadable?: boolean;
    file_url?: string;
  } | null;
  transaction: {
    customerName: string;
    customerEmail: string;
    pricePaid: number;
    promocodeUsed: string | null;
  } | null;
};

export default function LibraryClient() {
  const router = useRouter();

  // Auth States
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"email" | "code" | "dashboard">("email");
  const [submitting, setSubmitting] = useState(false);
  const [hash, setHash] = useState("");
  const [expirationTime, setExpirationTime] = useState("");

  // Verified Session
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Dashboard Data
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [downloadingBookId, setDownloadingBookId] = useState<string | null>(null);

  // 1. Check for active session in sessionStorage on mount
  useEffect(() => {
    try {
      const cachedEmail = sessionStorage.getItem("kamran_library_email");
      const cachedToken = sessionStorage.getItem("kamran_library_token");
      if (cachedEmail && cachedToken) {
        setVerifiedEmail(cachedEmail);
        setSessionToken(cachedToken);
        setStep("dashboard");
      }
    } catch (e) {
      console.error("Session storage read error:", e);
    }
  }, []);

  // 2. Fetch purchases once session is verified
  useEffect(() => {
    if (step === "dashboard" && verifiedEmail && sessionToken) {
      fetchLibraryPurchases();
    }
  }, [step, verifiedEmail, sessionToken]);

  const fetchLibraryPurchases = async () => {
    setLoadingPurchases(true);
    try {
      const res = await fetch("/api/ebooks/library/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifiedEmail, token: sessionToken }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPurchases(data.purchases || []);
      } else {
        toast.error(data.error || "Failed to fetch purchases.");
        // Clear session on auth error
        handleLogout();
      }
    } catch (err) {
      console.error("Fetch purchases error:", err);
      toast.error("Failed to fetch library content.");
    } finally {
      setLoadingPurchases(false);
    }
  };

  // 3. Request OTP Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    const toastId = toast.loading("Verifying your purchase history...");
    try {
      const res = await fetch("/api/ebooks/library/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setHash(data.hash);
        setExpirationTime(data.expirationTime);
        setStep("code");
        toast.success("Verification code sent to your email!", { id: toastId });
      } else {
        toast.error(data.error || "Failed to request code.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Verify OTP Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || !hash) return;

    setSubmitting(true);
    const toastId = toast.loading("Checking verification code...");
    try {
      const res = await fetch("/api/ebooks/library/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: otpCode.trim(),
          hash,
          expirationTime,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Save to session storage
        try {
          sessionStorage.setItem("kamran_library_email", data.email);
          sessionStorage.setItem("kamran_library_token", data.libraryToken);
        } catch (e) {
          console.error("Storage save failed:", e);
        }
        setVerifiedEmail(data.email);
        setSessionToken(data.libraryToken);
        setStep("dashboard");
        toast.success("Successfully logged in to library!", { id: toastId });
      } else {
        toast.error(data.error || "Incorrect code. Please try again.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to verify code.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  // 5. Launch Reader with cached credential
  const handleReadBook = (ebookId: string, title: string) => {
    router.push(`/ebooks/${slugify(title)}/read`);
  };

  const handleDownloadBook = async (ebookId: string, title: string) => {
    if (downloadingBookId) return;
    setDownloadingBookId(ebookId);
    const toastId = toast.loading("Preparing the PDF...");

    try {
      const res = await fetch("/api/ebooks/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ebookId,
          libraryToken: sessionToken,
          email: verifiedEmail
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to download ebook.");

      toast.success("Download started!", { id: toastId });

      if (data.file_url) {
        const link = document.createElement("a");
        link.href = data.file_url;
        link.target = "_blank";
        link.setAttribute("download", `${title.replace(/\s+/g, "_")}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("No download URL returned.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.", { id: toastId });
    } finally {
      setDownloadingBookId(null);
    }
  };

  // 6. Logout
  const handleLogout = () => {
    try {
      sessionStorage.removeItem("kamran_library_email");
      sessionStorage.removeItem("kamran_library_token");
    } catch (e) {
      console.error("Storage clean error:", e);
    }
    setVerifiedEmail(null);
    setSessionToken(null);
    setPurchases([]);
    setEmail("");
    setOtpCode("");
    setStep("email");
    toast.success("Logged out successfully.");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        
        {/* Step 1: Input Email */}
        {step === "email" && (
          <motion.div
            key="email-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full mx-auto"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
              <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full w-fit mx-auto">
                <Lock className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight font-heading">
                  E-Book Library Access
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Verify the email address used during purchase to access your personalized eBook reader library dashboard.
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
                <form onSubmit={handleSendCode} className="space-y-4 text-left">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Purchaser Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-11 pr-4 py-3.5 border rounded-xl bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                      disabled={submitting}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/60 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/15 flex items-center justify-center gap-2 cursor-pointer"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Request Access Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center">
                <Link 
                  href="/ebooks" 
                  className="text-xs text-slate-400 hover:text-emerald-500 font-bold transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Return to Publications Store</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Input OTP Code */}
        {step === "code" && (
          <motion.div
            key="code-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full mx-auto"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
              <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full w-fit mx-auto animate-pulse">
                <Key className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight font-heading">
                  Enter Verification Code
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  We sent a 6-digit access code to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>. Please enter it below to authorize.
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
                <form onSubmit={handleVerifyCode} className="space-y-4 text-left">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    6-Digit Access Code
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      className="w-full pl-11 pr-4 py-3.5 border rounded-xl bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-sm tracking-[0.25em] font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                      disabled={submitting}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/60 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/15 flex items-center justify-center gap-2 cursor-pointer"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Verify & Access Library</span>
                    )}
                  </button>
                </form>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep("email")}
                  className="text-xs text-slate-400 hover:text-emerald-500 font-bold transition-colors cursor-pointer"
                  disabled={submitting}
                >
                  Change Email
                </button>
                <button
                  onClick={handleSendCode}
                  className="text-xs text-emerald-500 hover:text-emerald-600 font-bold transition-colors cursor-pointer"
                  disabled={submitting}
                >
                  Resend Code
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Library Dashboard */}
        {step === "dashboard" && (
          <motion.div
            key="dashboard-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header Dashboard Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                    My Purchased Bookshelf
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 justify-center md:justify-start mt-1">
                    <span>Authorized as:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{verifiedEmail}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-900/40 text-slate-500 dark:text-slate-400 text-sm font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Library</span>
              </button>
            </div>

            {/* Purchases List */}
            {loadingPurchases ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-3xl" />
                ))}
              </div>
            ) : purchases.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {purchases.map((purchase) => {
                  if (!purchase.ebook) return null;
                  
                  return (
                    <motion.div
                      key={purchase.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row gap-6"
                    >
                      {/* Left: Book Cover */}
                      <div className="shrink-0 flex justify-center sm:justify-start">
                        <BookCard
                          title={purchase.ebook.title}
                          imageSrc={purchase.ebook.cover_url}
                          width={120}
                          height={170}
                          coverColor="bg-slate-800"
                          coverText="PURCHASED"
                          buttonClassName="hidden"
                        />
                      </div>

                      {/* Right: Purchase Details & Read Action */}
                      <div className="flex-1 flex flex-col justify-between text-center sm:text-left space-y-4">
                        <div className="space-y-2">
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight font-heading">
                            {purchase.ebook.title}
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {purchase.ebook.description || "Interactive secure reading edition publication."}
                          </p>
                        </div>

                        {/* Transaction Metadata */}
                        <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5 text-left font-medium text-slate-600 dark:text-slate-400">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Date:</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {new Date(purchase.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          {purchase.transaction && (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-slate-400" /> Paid:</span>
                                <span className="font-bold text-slate-900 dark:text-white">${Number(purchase.transaction.pricePaid).toFixed(2)} USD</span>
                              </div>
                              {purchase.transaction.promocodeUsed && (
                                <div className="flex justify-between items-center">
                                  <span>Coupon:</span>
                                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 text-[10px] font-bold">
                                    {purchase.transaction.promocodeUsed}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                          <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-850">
                            <span className="text-[10px] opacity-70">Checkout Ref:</span>
                            <span className="font-mono text-[9px] truncate max-w-[140px] select-all opacity-85" title={purchase.stripeCheckoutId || ""}>
                              {purchase.stripeCheckoutId || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        {purchase.ebook.is_downloadable ? (
                          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                            <button
                              onClick={() => handleReadBook(purchase.ebookId, purchase.ebook!.title)}
                              className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                            >
                              <BookOpen className="w-4 h-4" />
                              <span>Read Flipbook</span>
                            </button>
                            <button
                              onClick={() => handleDownloadBook(purchase.ebookId, purchase.ebook!.title)}
                              disabled={downloadingBookId === purchase.ebookId}
                              className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              <Download className="w-4 h-4" />
                              <span>{downloadingBookId === purchase.ebookId ? "Downloading..." : "Download PDF"}</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleReadBook(purchase.ebookId, purchase.ebook!.title)}
                            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/15 flex items-center justify-center gap-2 cursor-pointer group"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>Open Flipbook Reader</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto space-y-6 shadow-sm">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 text-slate-350 dark:text-slate-650 rounded-full w-fit mx-auto">
                  <Book className="w-16 h-16" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    No E-Books in Your Library
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    We couldn't find any purchased books associated with this email address in our database records.
                  </p>
                </div>
                <Link
                  href="/ebooks"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/15 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Publications Store</span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
