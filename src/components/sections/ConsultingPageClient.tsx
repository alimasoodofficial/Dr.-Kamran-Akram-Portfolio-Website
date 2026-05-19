"use client";

import { useState, useEffect } from "react";
import { PricingPlanDemo } from "@/components/ui/PricingPlan";
import { MeetingScheduler } from "@/components/forms/MeetingScheduler";
import { AvailabilitySlot, BlockedDate } from "@/app/actions/availability";
import { confirmStripeBooking } from "@/app/actions/payments";

interface Props {
  availability: AvailabilitySlot[];
  blockedDates: BlockedDate[];
}

export default function ConsultingPageClient({ availability, blockedDates }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; duration: number } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paymentSuccess = searchParams.get("payment_success") === "true";
    const sessionId = searchParams.get("session_id");

    if (paymentSuccess && sessionId) {
      const verifyPayment = async () => {
        setIsVerifying(true);
        setVerificationError(null);
        try {
          const result = await confirmStripeBooking(sessionId);
          if (result.success) {
            setVerificationSuccess(true);
            // Clear URL query parameters so page reload doesn't trigger verification again
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setVerificationError(result.error || "Failed to confirm payment and booking.");
          }
        } catch (err: any) {
          setVerificationError(err.message || "An unexpected error occurred during confirmation.");
        } finally {
          setIsVerifying(false);
        }
      };

      verifyPayment();
    } else if (searchParams.get("payment_cancelled") === "true") {
      // Clear URL query parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      setVerificationError("Your payment was cancelled. Please try booking again.");
    }
  }, []);

  const handleSelectPlan = (planName: string, duration: number) => {
    setSelectedPlan({ name: planName, duration });
    const target = document.getElementById("book-now");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="p-8 max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-xl space-y-6 animate-pulse">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Verifying Payment...</h3>
            <p className="text-sm text-slate-500 font-medium">Please do not close or refresh this page. We are finalizing your booking.</p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20">
        <div className="p-8 md:p-10 max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-xl space-y-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            ✓
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Booking Confirmed!</h2>
            <p className="text-slate-500 font-medium">Your payment has been verified, and your slot is scheduled.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-left border border-slate-100 dark:border-slate-700/50 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Next Steps</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              An invitation email has been sent with meeting details and the videoconference link.
            </p>
          </div>
          <button
            onClick={() => setVerificationSuccess(false)}
            className="w-full h-12 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary/95 transition-all shadow-md"
          >
            Back to Consulting
          </button>
        </div>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20">
        <div className="p-8 md:p-10 max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-xl space-y-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            ✕
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Booking Action Needed</h2>
            <p className="text-slate-500 font-medium">{verificationError}</p>
          </div>
          <button
            onClick={() => setVerificationError(null)}
            className="w-full h-12 bg-slate-800 dark:bg-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 dark:hover:bg-slate-800 transition-all shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="py-10 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Choose Your <span className="text-primary">Plan</span></h2>
            <p className="text-slate-500 font-medium">Select the duration that fits your needs.</p>
          </div>
          <PricingPlanDemo onSelectPlan={handleSelectPlan} />
        </div>
      </section>

      <section id="book-now" className="py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Schedule Your <span className="text-primary">Call</span></h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Book a slot directly into my calendar. You'll receive a meeting link immediately after confirmation.</p>
        </div>
        <MeetingScheduler 
          availability={availability} 
          blockedDates={blockedDates} 
          selectedPlan={selectedPlan}
        />
      </section>
    </>
  );
}
