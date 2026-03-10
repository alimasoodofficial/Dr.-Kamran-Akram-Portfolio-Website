import Banner from "@/components/sections/Banner";
import { PricingPlanDemo } from "@/components/ui/PricingPlan";
import ConsultationGrid from "@/components/ui/BentoCard";
import WorkTimeline from "@/components/sections/WorkTimeline";
import Booking from "@/components/forms/Booking";

export default function ConsultingPage() {
  return (
    <>
      <Banner
        title="One-on-One Consultation Calls with Dr Muhammad Kamran"
        description="Get tailored guidance for your research, career, or move abroad. Learn from real-world experience in academia, data analytics, and life in Australia."
        showLottie={false}
        showImage={false}
        showVideo={true}
        showBreadcrumb={true}
        containerClass="!px-0 text-white "
        bannerClass="backdrop-blur-lg p-5 bg-[#0b0c12]/40 transition-all duration-500 ease-in-out shadow-[0_0_20px_rgba(0,0,0,0.25)] rounded-2xl "
        videoSrc="https://www.pexels.com/download/video/8188999/"
        videoOverlay=""
        videoProps={{ autoPlay: true, loop: true, muted: true }}
/>

      {/* ✳️ What You Can Ask */}
      <section className="py-16  w-11/12 mx-auto text-center">
        <h2 className="text-5xl font-heading font-bold mb-8">
          What You Can Ask
        </h2>
       
        <ConsultationGrid
          containerClassName="max-w-[1200px] mx-auto px-5 py-20"
          headingClassName="font-extrabold   tracking-tight !text-2xl"
          descriptionClassName="!text-lg"
          iconClassName="" // Add extra icon classes if needed
        />
      </section>

      {/* 💬 How It Works */}
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-16  text-center pr-4 md:px-0">
        <h2 className="text-5xl font-heading font-bold mb-8 text-gray-900 dark:text-white">
          💬 How It Works
        </h2>
        <p className="pb-20 text-lg">
          A seamless, 4-step journey to your academic and professional goals.
        </p>

        <WorkTimeline />
      </section>

      <section className="py-10">
        <PricingPlanDemo />
      </section>

      <section>
        <Booking />
      </section>

     
    </>
  );
}
