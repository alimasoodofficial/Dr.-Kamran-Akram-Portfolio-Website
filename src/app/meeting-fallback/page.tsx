import Banner from "@/components/sections/Banner";
import Button from "@/components/ui/Button";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meeting Link Error | Dr. Muhammad Kamran",
  description: "There is some problem with the meeting link. Please contact the support team.",
};

export default function MeetingFallbackPage() {
  return (
    <>
      <Banner
        title="Meeting Link Error"
        description="There is some problem with the meeting link. Please contact the support team at bookingsimkamran@gmail.com"
        showLottie={true}
        showImage={false}
        lottieSrc="/lotties/meeting.lottie"
        showBreadcrumb={false}
        bannerClass="max-md:flex-col-reverse"
      >
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button href="mailto:hi@imkamran.com" className="!bg-primary text-white hover:opacity-90 font-medium">
            Contact Support
          </Button>
          <Button href="/" className="bg-slate-800 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 font-medium">
            Go to Home
          </Button>
        </div>
      </Banner>
    </>
  );
}
