"use client";

import { useState } from "react";
import { PricingPlanDemo } from "@/components/ui/PricingPlan";
import { MeetingScheduler } from "@/components/forms/MeetingScheduler";
import { AvailabilitySlot, BlockedDate } from "@/app/actions/availability";

interface Props {
  availability: AvailabilitySlot[];
  blockedDates: BlockedDate[];
}

export default function ConsultingPageClient({ availability, blockedDates }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; duration: number } | null>(null);

  const handleSelectPlan = (planName: string, duration: number) => {
    setSelectedPlan({ name: planName, duration });
    const target = document.getElementById("book-now");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

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
