"use client";

import { useState } from "react";
import { PricingPlanDemo } from "@/components/ui/PricingPlan";
import { MeetingScheduler } from "@/components/forms/MeetingScheduler";
import { AvailabilitySlot, BlockedDate } from "@/app/actions/availability";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  availability: AvailabilitySlot[];
  blockedDates: BlockedDate[];
}

export default function ConsultingPageClient({ availability, blockedDates }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; duration: number } | null>(null);

  const handleSelectPlan = (planName: string, duration: number) => {
    const isFirstSelection = !selectedPlan;
    setSelectedPlan({ name: planName, duration });
    
    if (!isFirstSelection) {
      setTimeout(() => {
        const target = document.getElementById("book-now");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 50);
    }
  };

  return (
    <>
      <section className="py-10 bg-slate-50 dark:bg-slate-900/50">
          <PricingPlanDemo onSelectPlan={handleSelectPlan} />
      </section>

      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
            onAnimationComplete={() => {
              const target = document.getElementById("book-now");
              if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "end" });
              }
            }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
