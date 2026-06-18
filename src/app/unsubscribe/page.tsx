"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { unsubscribeByEmailAction } from "@/app/actions/newsletter";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
      // Auto-submit if email is in url
      handleUnsubscribe(emailParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (targetEmail: string) => {
    if (!targetEmail) return;
    setStatus("loading");
    try {
      const res = await unsubscribeByEmailAction(targetEmail);
      if (res.success) {
        setStatus("success");
        setMessage(`Successfully unsubscribed ${targetEmail} from our newsletter updates.`);
      } else {
        setStatus("error");
        setMessage(res.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Failed to submit unsubscribe request. Please try again.");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUnsubscribe(email);
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2rem] shadow-xl text-center">
      {status === "idle" && (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 mb-2">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Unsubscribe from Newsletter</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please confirm your email address below to unsubscribe from Dr. Muhammad Kamran's newsletters.
          </p>
          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="w-full px-5 py-3 border border-slate-300 dark:border-slate-700 bg-transparent dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white font-semibold rounded-xl transition"
          >
            Unsubscribe
          </button>
        </form>
      )}

      {status === "loading" && (
        <div className="py-12 space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Processing Request</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Please wait while we update your email preferences...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <div className="inline-flex p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-500 dark:text-emerald-400 mb-2 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Unsubscribed Successfully</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
          <div className="pt-4 space-y-3">
            <Link
              href="/"
              className="inline-block w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <div className="inline-flex p-4 bg-red-50 dark:bg-red-950/30 rounded-2xl text-red-500 dark:text-red-400 mb-2">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Something Went Wrong</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="w-full py-3 px-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-xl transition"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="max-w-md w-full mx-auto p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
