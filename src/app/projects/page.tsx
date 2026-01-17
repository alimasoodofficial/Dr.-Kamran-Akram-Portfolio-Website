import ElectricBorder from "@/components/ui/ElectricBorder";
import Banner from "@/components/sections/Banner";
import { GlowingEffectDemo } from "@/components/sections/GlowingEffectDemo";
import { Timeline } from "@/components/ui/Timeline";
import ProjectPage from "../../components/ui/ProjectPage";
import ProfileStatsSection,{StatItem} from "@/components/ui/ProfileStatsSection";
import TimelineCarousel from "@/components/ui/TimelineCarousel";
import ScrollRevealText from "@/components/ui/ScrollRevealText";
import Roadmap from "@/components/ui/Roadmap";

export default function ProjectsPage() {
  const paragraphText = "A multilingual agricultural scientist and data analyst dedicated to clear, impactful science communication and extension across agriculture and animal sciences. With experience as an MLA Red Meat Industry Ambassador and Young Science Ambassador, focused on translating complex research into practical knowledge for farmers, students, and communities. Skilled in research, data analysis, and public speaking, with a passion for empowering others through education and outreach. Committed to fostering innovation and sustainability in agriculture through effective communication and collaboration.";
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

        <section>
        <div className=" px-5 md:px-0 mx-auto w-11/12 flex items-center justify-center py-20">
        <ScrollRevealText 
            text={paragraphText} 
            className="text-sm md:text-lg"
        />
      </div>

      {/* Spacer to allow scrolling past the element */}
      {/* <div className="h-[100vh]"></div> */}
        </section>



      </div>
      <div className=" overflow-x-hidden">
        <TimelineCarousel />
      </div>

      <div>
        {/* <Roadmap  /> */}
      </div>

      <div>
        {/* <Timeline /> */}
      </div>

      <div>
        {/* <ProjectPage /> */}
      </div>
    </>
  );
}
