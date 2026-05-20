"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmStripeBooking } from "@/app/actions/payments";
import Link from "next/link";
import { 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Mail, 
  ArrowLeft,
  ExternalLink,
  Loader2,
  CalendarCheck
} from "lucide-react";

interface BookingDetails {
  id: string;
  fullName: string;
  email: string;
  date: string;
  timeSlot: string;
  platform: string;
  duration: number;
  meetingLink: string | null;
}

export default function StatusClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isCancellation, setIsCancellation] = useState(false);

  useEffect(() => {
    // Read from search params or fallback to sessionStorage
    const urlSuccessParam = searchParams.get("success");
    const urlSessionId = searchParams.get("session_id");

    let tempSessionId = urlSessionId;
    if (urlSessionId) {
      sessionStorage.setItem("booking_session_id", urlSessionId);
    } else if (typeof window !== "undefined") {
      tempSessionId = sessionStorage.getItem("booking_session_id");
    }

    let tempSuccessParam = urlSuccessParam;
    if (urlSuccessParam) {
      sessionStorage.setItem("booking_success", urlSuccessParam);
    } else if (typeof window !== "undefined") {
      tempSuccessParam = sessionStorage.getItem("booking_success");
    }

    const sessionId = tempSessionId;
    const successParam = tempSuccessParam;

    setIsCancellation(successParam === "false");

    // Clean URL search parameters immediately to hide ID and success params
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // If Stripe was cancelled/failed or parameters are missing
    if (successParam === "false") {
      setLoading(false);
      setError("Your payment session was cancelled or failed. No charges were made.");
      return;
    }

    if (!sessionId) {
      setLoading(false);
      setError("Invalid access. Missing payment session information.");
      return;
    }

    const verifyAndConfirm = async () => {
      try {
        const result = await confirmStripeBooking(sessionId);
        if (result.success) {
          setBooking(result.booking || null);
        } else {
          setError(result.error || "We encountered an issue confirming your booking.");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setError(err.message || "An unexpected error occurred during confirmation.");
      } finally {
        setLoading(false);
      }
    };

    verifyAndConfirm();
  }, [searchParams]);

  // Loading View
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="p-10 max-w-md w-full bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-emerald-500/20 rounded-[2.5rem] text-center shadow-xl dark:shadow-2xl space-y-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
          <div className="space-y-3">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Confirming Booking</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              We are verifying your payment and securing your selected time slot. Please do not refresh or close this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error / Cancellation View
  if (error || !booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="p-10 max-w-xl w-full bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-red-500/20 rounded-[2.5rem] text-center shadow-xl dark:shadow-2xl space-y-8">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/5">
            <XCircle className="w-12 h-12" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {isCancellation ? "Payment Cancelled" : "Booking Action Needed"}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
              {error || "We could not verify your booking details. Please review and try again."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/consulting"
              className="flex-1 h-14 bg-primary hover:bg-[#064e3b] dark:hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-primary/20"
            >
              Try Booking Again
            </Link>
            <Link
              href="/"
              className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all duration-300"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Formatting Date
  let displayDate = booking.date;
  try {
    const dateObj = new Date(booking.date);
    displayDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {}

  // Success View
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="p-8 md:p-12 max-w-2xl w-full bg-white/80 dark:bg-slate-900/30 backdrop-blur-xl border border-emerald-500/15 dark:border-emerald-500/10 rounded-[3rem] shadow-xl dark:shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full"></div>

        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-500/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/5">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Booking Confirmed!</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium max-w-md mx-auto">
            Your payment has been verified, and your meeting with Dr. Muhammad Kamran has been scheduled.
          </p>
        </div>

        {/* Details Card */}
        <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4" /> Meeting Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Attendee</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{booking.fullName}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3 text-slate-400 dark:text-slate-500" /> {booking.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Date</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{displayDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Time & Duration</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{booking.timeSlot} ({booking.duration} mins)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Platform</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{booking.platform}</p>
              </div>
            </div>
          </div>

          {booking.meetingLink && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Video Call Link</p>
              <a 
                href={booking.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-bold hover:underline break-all text-sm group"
              >
                {booking.meetingLink}
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          )}
        </div>

        {/* Email note */}
        <div className="p-5 bg-slate-50/80 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          💡 A calendar invitation and confirmation email with these details have been sent to <span className="text-slate-900 dark:text-white font-bold">{booking.email}</span>.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          {booking.meetingLink && (
            <a
              href={booking.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-14 bg-gradient-to-r from-emerald-600 to-primary hover:from-emerald-500 hover:to-primary/95 text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-primary/10"
            >
              Join Meeting <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <Link
            href="/"
            className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
