import ConsultancyForm from "@/components/forms/ConsultancyForm";
import CalendlyEmbed from "@/components/forms/Calendly";
import { packages } from "@/data/consultancyPackages";
// import { motion } from "framer-motion";

import Banner from "@/components/sections/Banner";
import Button from "@/components/ui/Button";
import { CreativePricing } from "@/components/ui/creative-pricing";
import { CreativePricingDemo } from "@/components/ui/PricingPlan";
import ConsultationGrid from "@/components/ui/BentoCard";
import WorkTimeline from "@/components/sections/WorkTimeline";

export default function ConsultingPage() {
  return (
    <>
     <Banner
        title="One-on-One Consultation Calls with Dr Muhammad Kamran"
        description="Get tailored guidance for your research, career, or move abroad. Learn from real-world experience in academia, data analytics, and life in Australia."
        showLottie={true}
        lottieSrc="/lotties/meeting.lottie"
        showBreadcrumb={true}  
      />

      {/* ✳️ What You Can Ask */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-5xl font-heading font-bold mb-8">
          What You Can Ask
        </h2>
        {/* <div className="grid md:grid-cols-2 gap-6 text-left font-body">
          <ul className="list-disc list-inside space-y-2">
            <li>How to shortlist universities or supervisors</li>
            <li>Scholarship opportunities and expected funding</li>
            <li>Budgeting and living in Australia</li>
            <li>Accommodation and part-time work</li>
          </ul>
          <ul className="list-disc list-inside space-y-2">
            <li>Skills and certifications for employability</li>
            <li>Building a research or LinkedIn profile</li>
            <li>Career roadmap and future planning</li>
          </ul>
        </div> */}
        <ConsultationGrid 
        containerClassName="max-w-[1200px] mx-auto px-5 py-20"
        headingClassName="font-extrabold tracking-tight"
        descriptionClassName="text-slate-500"
        iconClassName="" // Add extra icon classes if needed
      />
      </section>

      {/* 💬 How It Works */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16  text-center pr-4 md:px-0">
        <h2 className="text-5xl font-heading font-bold mb-8 text-gray-900 dark:text-white">
         💬 How It Works
        </h2>
        <p className="py-2">A seamless, 4-step journey to your academic and professional goals.</p>

       
      <WorkTimeline />

      </section>

    

      <section>
        <CreativePricingDemo />
      </section>

      {/* 📅 Embedded Calendly Widget */}
      <section className="pt-20 dark:bg-[#0b0c12]    ">
        <h2 className="text-4xl py-5 font-heading font-bold text-center ">
          Ready to Start?
        </h2>
        <CalendlyEmbed url="https://calendly.com/dataexperts360/30min" />
      </section>
    </>
  );
}
