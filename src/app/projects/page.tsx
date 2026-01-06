import ElectricBorder from "@/components/ui/ElectricBorder";
import Banner from "@/components/sections/Banner";
import { GlowingEffectDemo } from "@/components/sections/GlowingEffectDemo";
import { CreativePricingDemo } from "@/components/ui/PricingPlan";
import { Timeline } from "@/components/ui/Timeline";
import ProjectPage from "../../components/ui/ProjectPage";
import ProfileStatsSection,{StatItem} from "@/components/ui/ProfileStatsSection";
import TimelineCarousel from "@/components/ui/TimelineCarousel";

export default function ProjectsPage() {
  const statsData: StatItem[] = [
    { number: "113+", label: "Research Outputs" },
    { number: "50+", label: "Conference Contributions" },
    { number: "4+", label: "Journal Publications" },
    { number: "17+", label: "Books Authored" },
  ];
  return (
    <>
      <Banner
        title="Welcome to Our Website"
        description="We provide amazing services and solutions for your business."
        imageAlt="Illustration"
        className="w-auto h-100px"
        showLottie={true}
        lottieSrc="lotties/evolution.lottie"
      />

      {/* <div className="flex justify-center">
        <GlowingEffectDemo />
      </div> */}
      <div>
        <ProfileStatsSection
          imageSrc="https://imkamran.com/wp-content/uploads/2023/09/kamran-dvm.jpeg"
          imageAlt="Portrait of the researcher"
          eyebrowText="Scientific Contributions"
          title="Research, Publications & Intellectual Contributions"
          description="Advancing scientific knowledge through reviewed publications, books, and research across AI, data science, blockchain, security studies, and interdisciplinary domains for over two decades."
          stats={statsData}
        />
      </div>
      <div className=" overflow-x-hidden">
        <TimelineCarousel />
      </div>

      <div>
        <Timeline />
      </div>

      <div>
        <ProjectPage />
      </div>
    </>
  );
}
