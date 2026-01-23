"use client";
import React from "react";
// Import the components. Note: Renamed ProjectsPage import to ProjectsList to avoid conflict
import { ProjectsPage as ProjectsList, ProjectBanner } from "@/components/ui/ProjectPage";
import ProfileStatsSection, { StatItem } from "@/components/ui/ProfileStatsSection";
import ScrollRevealText from "@/components/ui/ScrollRevealText";
import Banner from "@/components/sections/Banner";

export default function ProjectsEntryPage() {
  const paragraphText = "A multilingual agricultural scientist and data analyst dedicated to clear, impactful science communication and extension across agriculture and animal sciences. With experience as an MLA Red Meat Industry Ambassador and Young Science Ambassador, focused on translating complex research into practical knowledge for farmers, students, and communities. Skilled in research, data analysis, and public speaking, with a passion for empowering others through education and outreach. Committed to fostering innovation and sustainability in agriculture through effective communication and collaboration.";
  
  const statsData: StatItem[] = [
    { number: "113+", label: "Research Outputs" },
    { number: "50+", label: "Conference Contributions" },
    { number: "4+", label: "Journal Publications" },
    { number: "17+", label: "Books Authored" },
  ];

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      {/* 1. Hero Banner */}
      {/* <ProjectBanner /> */}
      <Banner/>

      {/* 2. Academic Profile Section */}
      <div className="container mx-auto px-6 py-20">
        <ProfileStatsSection
          imageSrc="https://imkamran.com/wp-content/uploads/2023/09/kamran-dvm.jpeg"
          imageAlt="Portrait of Dr. Kamran"
          eyebrowText="Academic Excellence"
          title="Research, Publications & Intellectual Contributions"
          description="Advancing scientific knowledge through reviewed publications, books, and research across AI, data science, and agricultural domains."
          stats={statsData}
        />

        {/* 3. Narrative Impact Statement */}
        <div className="max-w-5xl mx-auto py-24 border-t border-border/50 mt-20">
          <ScrollRevealText 
            text={paragraphText} 
            className="text-lg md:text-3xl  font-light  text-justify transition-all  "
          />
        </div>
      </div>

      {/* 4. Practical Projects & Ventures */}
      <section className="bg-muted/30 dark:bg-muted/10 max-w-11/12 mx-auto">
        <ProjectsList />
      </section>
    </main>
  );
}