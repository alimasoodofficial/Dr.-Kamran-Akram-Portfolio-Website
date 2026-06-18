"use client";
import React from "react";
import {
  ProjectsPage as ProjectsList,
} from "@/components/ui/ProjectPage";
import ProfileStatsSection, {
  StatItem,
} from "@/components/ui/ProfileStatsSection";
import ScrollRevealText from "@/components/ui/ScrollRevealText";
import ProjectDashboard from "@/components/sections/ProjectDashboard";
import GradientText from "@/components/ui/GradientText";
import Squares from "@/components/ui/Squares";
import { motion } from "framer-motion";

export default function ProjectsEntryPage() {
  const paragraphText =
    "A multilingual agricultural scientist and data analyst dedicated to clear, impactful science communication and extension across agriculture and animal sciences. With experience as an MLA Red Meat Industry Ambassador and Young Science Ambassador, focused on translating complex research into practical knowledge for farmers, students, and communities. Skilled in research, data analysis, and public speaking, with a passion for empowering others through education and outreach. Committed to fostering innovation and sustainability in agriculture through effective communication and collaboration.";

  const statsData: StatItem[] = [
    { number: "15+", label: "Clients Globally" },
    { number: "12+", label: "Strategic Projects" },
    { number: "5+", label: "Global Ventures" },
    { number: "4+", label: "Agri-Tech Solutions" },
  ];

  return (
    <main className="min-h-screen  transition-colors duration-300 overflow-hidden">
      {/* Hero Section */}
     

      {/* Project Dashboard - Interactive Hub */}
      <section className="relative z-10 -mt-10 md:-mt-20">
        <ProjectDashboard />
      </section>

      {/* 2. Academic Profile Section */}
      <div className="container mx-auto px-6 py-20">
          <ProfileStatsSection
            imageSrc="https://rqrnzfuvgmnjkjqaahve.supabase.co/storage/v1/object/public/website%20images%20&%20videos/gallery-1770970058055-90109221_4252689171423173_5485921251409002496_n.webp"
            imageAlt="Portrait of Dr. Kamran"
            eyebrowText="Project Excellence"
            title="Strategic Leadership & Multi-Domain Ventures"
            description="Leading a diverse portfolio of impactful projects that integrate cutting-edge technology with sustainable practices—from AI-driven analytics to global agri-tech innovation."
            stats={statsData}
          />

        {/* Narrative Impact Statement */}
        <div className="max-w-5xl mx-auto py-24 border-t border-border/50 mt-20 relative">
          <div className="absolute -left-10 top-20 text-9xl font-serif text-emerald-500/10 pointer-events-none select-none">
            &ldquo;
          </div>
          <ScrollRevealText
            text={paragraphText}
            className="text-lg md:text-3xl font-light text-justify leading-relaxed transition-all"
          />
          <div className="absolute -right-10 bottom-20 text-9xl font-serif text-emerald-500/10 pointer-events-none select-none">
            &rdquo;
          </div>
        </div>
      </div>

      {/* Practical Projects & Ventures List */}
      <section className="relative py-20 ">
        <div className="container mx-auto px-6 mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Detailed Case Studies</h2>
          <p className="text-muted-foreground text-lg">Exploring the impact and implementation of key initiatives.</p>
        </div>
        <div className="max-w-7xl mx-auto">
          <ProjectsList />
        </div>
      </section>
    </main>
  );
}
