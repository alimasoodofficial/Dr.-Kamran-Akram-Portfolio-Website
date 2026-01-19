import ProjectPage from "@/components/ui/ProjectPage";
import ProfileStatsSection, { StatItem } from "@/components/ui/ProfileStatsSection";
import ScrollRevealText from "@/components/ui/ScrollRevealText";

export default function ProjectsPage() {
  const paragraphText = "A multilingual agricultural scientist and data analyst dedicated to clear, impactful science communication and extension across agriculture and animal sciences. With experience as an MLA Red Meat Industry Ambassador and Young Science Ambassador, focused on translating complex research into practical knowledge for farmers, students, and communities. Skilled in research, data analysis, and public speaking, with a passion for empowering others through education and outreach. Committed to fostering innovation and sustainability in agriculture through effective communication and collaboration.";
  
  const statsData: StatItem[] = [
    { number: "113+", label: "Research Outputs" },
    { number: "50+", label: "Conference Contributions" },
    { number: "4+", label: "Journal Publications" },
    { number: "17+", label: "Books Authored" },
  ];

  return (
    <div className="pt-20 md:pt-32 space-y-20 pb-20">
      <ProjectPage />
      
      <div className="container mx-auto px-6">
        <div className="border-t border-border/30 pt-20">
          <ProfileStatsSection
            imageSrc="https://imkamran.com/wp-content/uploads/2023/09/kamran-dvm.jpeg"
            imageAlt="Portrait of Dr. Kamran"
            eyebrowText="Academic Excellence"
            title="Research, Publications & Intellectual Contributions"
            description="Advancing scientific knowledge through reviewed publications, books, and research across AI, data science, and agricultural domains."
            stats={statsData}
          />

          <div className="max-w-4xl mx-auto py-16">
            <ScrollRevealText 
              text={paragraphText} 
              className="text-lg md:text-xl text-justify text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
