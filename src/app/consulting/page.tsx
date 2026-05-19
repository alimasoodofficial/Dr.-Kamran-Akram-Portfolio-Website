import Banner from "@/components/sections/Banner";
import { PricingPlanDemo } from "@/components/ui/PricingPlan";
import ConsultationGrid from "@/components/ui/BentoCard";
import WorkTimeline from "@/components/sections/WorkTimeline";
import { MeetingScheduler } from "@/components/forms/MeetingScheduler";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

console.log("[CONSULTING PAGE] Module parsed");

async function getBookingData() {
  console.log("[CONSULTING PAGE] getBookingData started");
  const supabase = createSupabaseServerClient();
  
  console.log("[CONSULTING PAGE] Querying Supabase availability and blocked dates...");
  const [availabilityRes, blockedRes] = await Promise.all([
    supabase.from("availability").select("*").eq("is_enabled", true),
    supabase.from("blocked_dates").select("*")
  ]);
  console.log("[CONSULTING PAGE] Supabase queries completed. Availability count:", availabilityRes.data?.length, "Blocked dates count:", blockedRes.data?.length);

  return {
    availability: availabilityRes.data || [],
    blockedDates: blockedRes.data || []
  };
}

export default async function ConsultingPage() {
  console.log("[CONSULTING PAGE] ConsultingPage component starting render");
  const { availability, blockedDates } = await getBookingData();
  console.log("[CONSULTING PAGE] getBookingData finished, rendering JSX...");

  return (
    <>
      <Banner
        title="One-on-One Consultation Calls with Dr Muhammad Kamran"
        description="Get tailored guidance for your research, career, or move abroad. Learn from real-world experience in academia, data analytics, and life in Australia."
        showLottie={false}
        showImage={false}
        showVideo={true}
        showBreadcrumb={true}
        containerClass="!px-0  "
        bannerClass="backdrop-blur-lg p-5  bg-[#0b0c12]/40 transition-all duration-500 ease-in-out shadow-[0_0_20px_rgba(0,0,0,0.25)] rounded-2xl "
        titleClass="!text-white"
        descriptionClass="text-white/90"
        breadcrumbClass="text-white"
        videoSrc="https://www.pexels.com/download/video/8188999/"
        videoOverlay=""
        videoProps={{ autoPlay: true, loop: true, muted: true }}
      />

      {/* ✳️ What You Can Ask */}
      <section className="py-16 w-11/12 mx-auto text-center">
        <h2 className="text-5xl font-heading font-bold mb-8">
          What You Can Ask
        </h2>
       
        <ConsultationGrid
          containerClassName="max-w-[1200px] mx-auto px-5 py-20"
          headingClassName="font-extrabold tracking-tight !text-2xl"
          descriptionClassName="!text-lg"
          iconClassName=""
        />
      </section>

      {/* 💬 How It Works */}
      <section className="w-full py-16 text-center pr-4 md:px-0">
        <h2 className="text-5xl font-heading font-bold mb-8 text-gray-900 dark:text-white">
          💬 How It Works
        </h2>
        <p className="pb-20 text-lg">
          A seamless, 4-step journey to your academic and professional goals.
        </p>

        <WorkTimeline />
      </section>

      <section className="py-10 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Choose Your <span className="text-primary">Plan</span></h2>
            <p className="text-slate-500 font-medium">Select the duration that fits your needs.</p>
          </div>
          <PricingPlanDemo />
        </div>
      </section>

      <section id="book-now" className="py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Schedule Your <span className="text-primary">Call</span></h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Book a slot directly into my calendar. You'll receive a meeting link immediately after confirmation.</p>
        </div>
        <MeetingScheduler availability={availability as any} blockedDates={blockedDates as any} />
      </section>
    </>
  );
}
