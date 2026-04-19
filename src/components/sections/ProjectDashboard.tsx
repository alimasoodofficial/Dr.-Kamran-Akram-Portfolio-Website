"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Rocket,
  Sparkles,
  CheckCircle2,
  Leaf,
  Database,
  Recycle,
  Wheat,
  GraduationCap,
  Microscope,
  Lightbulb,
  LayoutGrid,
  Users,
  Video,
  ListChecks,
  BarChart3,
  Clock,
  Handshake,
  Package,
  UserCircle,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

// --- Constants ---

const PROJECT_CARDS_DATA = {
  left: [
    {
      title: "TRIISUM",
      subtitle: "Eco-Tourism, Sustainability Focused",
      icon: Leaf,
      accentColor: "bg-green-100",
      iconColor: "text-green-700",
      teamText: "Eco Synergy",
      features: [
        { label: "Task Board", type: "board" },
        { label: "Sustainability", type: "chart" },
        { label: "Deadline", type: "calendar" },
      ],
    },
    {
      title: "DATA EXPERTS 360",
      subtitle: "Data, Analytics, Consulting",
      icon: Database,
      accentColor: "bg-emerald-100",
      iconColor: "text-emerald-700",
      teamText: "Data Insights",
      features: [
        { label: "Data Dashboard", type: "chart" },
        { label: "Progress", type: "progress" },
        { label: "Deadline", type: "calendar" },
      ],
    },
    {
      title: "ECO AMBASSADORS",
      subtitle: "Sustainability, Environment, Outreach",
      icon: Recycle,
      accentColor: "bg-teal-100",
      iconColor: "text-teal-700",
      teamText: "Green Outreach",
      features: [
        { label: "Task Board", type: "board" },
        { label: "Outreach Chart", type: "chart" },
        { label: "Campaign Launch", type: "calendar" },
      ],
    },
  ],
  right: [
    {
      title: "AGRI EXPERTS 360",
      subtitle: "Agriculture, Agri-Tech, Education",
      icon: Wheat,
      accentColor: "bg-green-100",
      iconColor: "text-green-600",
      teamText: "Agri Innovation",
      features: [
        { label: "Task List", type: "board" },
        { label: "Crop Yield", type: "chart" },
        { label: "Tech Adoption", type: "progress" },
      ],
    },
    {
      title: "DATA AMBASSADORS",
      subtitle: "Training, Capacity Building, Youth & Community",
      icon: GraduationCap,
      accentColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      teamText: "Digital Skills",
      features: [
        { label: "Training Modules", type: "progress" },
        { label: "Community", type: "chart" },
        { label: "Deadline", type: "calendar" },
      ],
    },
    {
      title: "BEYOND THE LAB",
      subtitle: "Science Communication, Research Translation",
      icon: Microscope,
      accentColor: "bg-teal-50",
      iconColor: "text-teal-600",
      teamText: "Science Hub",
      features: [
        { label: "Content Calendar", type: "calendar" },
        { label: "Audience Reach", type: "chart" },
        { label: "Deadline", type: "progress" },
      ],
    },
  ],
};

const STEPS = [
  {
    icon: Lightbulb,
    label: "Idea",
    angle: -110,
    color: "bg-green-100 text-green-700",
    radius: 220,
  },
  {
    icon: LayoutGrid,
    label: "Planning",
    angle: -65,
    color: "bg-emerald-100 text-emerald-700",
    radius: 230,
  },
  {
    icon: Users,
    label: "Team Building",
    angle: -30,
    color: "bg-teal-100 text-teal-700",
    radius: 240,
  },
  {
    icon: Video,
    label: "Meetings",
    angle: 5,
    color: "bg-green-50 text-green-600",
    radius: 225,
  },
  {
    icon: ListChecks,
    label: "Task Execution",
    angle: 40,
    color: "bg-emerald-50 text-emerald-600",
    radius: 235,
  },
  {
    icon: BarChart3,
    label: "KPI Tracking",
    angle: 75,
    color: "bg-teal-50 text-teal-600",
    radius: 225,
  },
  {
    icon: Clock,
    label: "Deadlines",
    angle: 110,
    color: "bg-green-100 text-green-800",
    radius: 230,
  },
  {
    icon: Handshake,
    label: "Stakeholder\nManagement",
    angle: 150,
    color: "bg-emerald-100 text-emerald-800",
    radius: 225,
  },
  {
    icon: Package,
    label: "Delivery",
    angle: 200,
    color: "bg-teal-100 text-teal-800",
    radius: 220,
  },
];

const MOBILE_CARDS = [
  {
    title: "TRIISUM",
    subtitle: "Eco-Tourism",
    color: "bg-[#d1fae5]",
    initial: "T",
    teamText: "Eco Synergy",
  },
  {
    title: "DATA EXPERTS 360",
    subtitle: "Analytics",
    color: "bg-[#dbeafe]",
    initial: "D",
    teamText: "Data Insights",
  },
  {
    title: "ECO AMBASSADORS",
    subtitle: "Sustainability",
    color: "bg-[#d1fae5]",
    initial: "E",
    teamText: "Green Outreach",
  },
  {
    title: "AGRI EXPERTS 360",
    subtitle: "Agriculture",
    color: "bg-[#d1fae5]",
    initial: "A",
    teamText: "Agri Innovation",
  },
  {
    title: "DATA AMBASSADORS",
    subtitle: "Training",
    color: "bg-[#ccfbf1]",
    initial: "D",
    teamText: "Digital Skills",
  },
  {
    title: "BEYOND THE LAB",
    subtitle: "Science",
    color: "bg-[#ffedd5]",
    initial: "B",
    teamText: "Science Hub",
  },
];

// --- Sub-components ---

const FeatureBlock = ({ feature }: { feature: any }) => {
  let content = null;
  switch (feature.type) {
    case "board":
      content = (
        <div className="space-y-1">
          <div className="flex gap-1">
            <div className="w-3.5 h-3.5 rounded bg-emerald-600 opacity-20"></div>
            <div className="w-3.5 h-3.5 rounded bg-emerald-500 opacity-30"></div>
            <div className="w-3.5 h-3.5 rounded bg-emerald-500 opacity-40"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-3.5 h-3.5 rounded bg-blue-500 opacity-20"></div>
            <div className="w-3.5 h-3.5 rounded bg-emerald-500 opacity-20"></div>
          </div>
        </div>
      );
      break;
    case "chart":
      content = (
        <div className="flex items-end gap-0.5 h-7">
          <div className="w-2.5 h-2 bg-emerald-600 opacity-30 rounded-sm"></div>
          <div className="w-2.5 h-4 bg-emerald-500 opacity-40 rounded-sm"></div>
          <div className="w-2.5 h-7 bg-emerald-600 opacity-50 rounded-sm"></div>
          <div className="w-2.5 h-3 bg-emerald-500 opacity-40 rounded-sm"></div>
        </div>
      );
      break;
    case "progress":
      content = (
        <div className="space-y-1.5 w-full">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-emerald-600 rounded-full"></div>
          </div>
        </div>
      );
      break;
    case "calendar":
      content = (
        <div className="grid grid-cols-4 gap-0.5">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-sm ${i % 3 === 0 ? "bg-emerald-600 opacity-30" : "bg-muted"}`}
              ></div>
            ))}
        </div>
      );
      break;
  }
  return (
    <div className="bg-muted/50 dark:bg-emerald-950/30 rounded-lg p-2.5 flex-1 min-w-[70px]">
      <p className="text-[9px] font-medium text-muted-foreground dark:text-slate-400 mb-1.5 truncate">
        {feature.label}
      </p>
      {content}
    </div>
  );
};

const ProjectCard = ({ data }: { data: any }) => {
  const Icon = data.icon;
  return (
    <div className="project-card p-4 bg-white dark:bg-emerald-950/40 backdrop-blur-md border border-emerald-100 dark:border-emerald-500/10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 w-[220px] lg:w-[240px] cursor-pointer group hover:scale-105 hover:border-emerald-500/50">
      <div className="flex items-start gap-2.5 mb-3">
        <div
          className={`w-10 h-10 rounded-lg ${data.accentColor} dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner`}
        >
          <Icon className={`w-5 h-5 ${data.iconColor} dark:text-emerald-400`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-foreground dark:text-white leading-tight truncate">
            {data.title}
          </h3>
          <p className="text-[10px] text-muted-foreground dark:text-slate-50 leading-tight line-clamp-2">
            {data.subtitle}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        {data.features.slice(0, 2).map((f: any, i: number) => (
          <FeatureBlock key={i} feature={f} />
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-muted">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[9px] text-muted-foreground dark:text-slate-50">
            {data.teamText || "Team Collaboration"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[9px] text-muted-foreground dark:text-slate-50 truncate max-w-[55px]">
            {data.features[2]?.label || "Deadline"}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function ProjectDashboard() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
        setIsDarkMode(document.documentElement.classList.contains("dark"));
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    // Observer for theme changes
    const observer = new MutationObserver(updateDimensions);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("resize", updateDimensions);
      observer.disconnect();
    };
  }, []);

  const isMobile = dimensions.width < 768;
  const isDesktop = dimensions.width >= 1024;

  return (
    <section className="relative w-full py-10 overflow-hidden">
      <Image
        src="https://rqrnzfuvgmnjkjqaahve.supabase.co/storage/v1/object/public/website%20images%20&%20videos/Dr%20Muhammad%20Kamran%20-%20Projects.jpg"
        alt="Project Management Background"
        fill
        className="object-cover opacity-10 dark:opacity-5 pointer-events-none grayscale"
        priority
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes counter-orbit { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .animate-orbit { animation: orbit 60s linear infinite; }
        .animate-counter-orbit { animation: counter-orbit 60s linear infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `,
        }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center py-12 relative z-10">
        {/* Desktop Side Cards */}
        {isDesktop && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-8 xl:px-12">
            <div className="flex flex-col gap-6 pointer-events-auto z-10">
              {PROJECT_CARDS_DATA.left.map((card, i) => (
                <ProjectCard key={i} data={card} />
              ))}
            </div>
            <div className="flex flex-col gap-6 pointer-events-auto z-10">
              {PROJECT_CARDS_DATA.right.map((card, i) => (
                <ProjectCard key={i} data={card} />
              ))}
            </div>
          </div>
        )}

        {/* Center Hub Section */}
        <div className="relative w-[280px] h-[280px] md:w-[500px] md:h-[500px] lg:w-[620px] lg:h-[620px] flex items-center justify-center mx-auto z-20">
          {/* Orbiting Steps Container */}
          <div className="absolute inset-0 flex items-center justify-center animate-orbit pointer-events-none">
            {STEPS.map((step, i) => {
              const angleRad = (step.angle * Math.PI) / 180;
              let r = step.radius;
              if (isMobile) r = 105;
              else if (dimensions.width < 1024) r = 180;

              const x = Math.cos(angleRad) * r;
              const y = Math.sin(angleRad) * r;
              const StepIcon = step.icon;

              return (
                <div
                  key={i}
                  className="absolute flex flex-col items-center gap-1.5 z-30 pointer-events-auto"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <div className="animate-counter-orbit flex flex-col items-center">
                    <div className="relative group">
                      <div
                        className={`${step.color} w-9 h-9 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-125 cursor-pointer backdrop-blur-sm group-hover:shadow-emerald-500/20`}
                      >
                        <StepIcon className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                      </div>
                    </div>
                    <span className="text-[7px] md:text-[10px] lg:text-xs font-bold text-foreground dark:text-slate-200 whitespace-pre-line text-center leading-tight max-w-[80px] mt-2 block opacity-80">
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Hub */}
          <div className="relative flex items-center justify-center">
            {/* Rings */}
            <div className="absolute w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full border-[3px] border-emerald-500/20 dark:border-emerald-500/10 blur-[1px]" />
            <div className="absolute w-48 h-48 md:w-60 md:h-60 lg:w-68 lg:h-68 rounded-full border-2 border-emerald-500/10 dark:border-emerald-500/5" />

            {/* Inner circle */}
            <div
              className="relative w-36 h-36 md:w-52 md:h-52 lg:w-64 lg:h-64 rounded-full flex items-center justify-center shadow-2xl border-2 border-emerald-500/20 bg-white dark:bg-emerald-950/80 backdrop-blur-xl transition-colors duration-500"
              style={{
                background: isDarkMode 
                  ? "radial-gradient(circle, rgba(6,78,59,0.9) 0%, rgba(2,44,34,0.9) 100%)"
                  : "linear-gradient(180deg, #fff 0%, #f0f9ff 60%, #f0fdf4 100%)",
              }}
            >
              <div className="text-center p-4">
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-950 rounded-3xl flex items-center justify-center shadow-xl animate-float border border-emerald-500/20">
                      <Rocket className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-emerald-500 animate-pulse" />
                  </div>
                </div>
                <h1 className="text-[10px] md:text-sm lg:text-lg font-black text-foreground leading-tight tracking-[0.1em] uppercase">
                  Project
                  <br />
                  Management
                </h1>
                <p className="text-[9px] md:text-[10px] lg:text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 tracking-widest uppercase opacity-80">
                  From Idea to Impact
                </p>
              </div>
            </div>

            {/* Decorative checkmark */}
            <div className="absolute top-8 right-6 md:top-6 md:right-10 lg:top-8 lg:right-12 w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl z-30">
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Mobile Project Cards List */}
        {!isDesktop && (
          <div className="px-6 pb-8 w-full max-w-lg mt-20 grid grid-cols-2 gap-4 z-30 relative">
            {MOBILE_CARDS.map((card, i) => (
              <div
                key={i}
                className="project-card p-4 bg-white/80 dark:bg-emerald-950/40 backdrop-blur-md shadow-lg border border-emerald-100 dark:border-emerald-500/10 rounded-2xl"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${card.color} dark:bg-emerald-500/10 flex items-center justify-center mb-3 shadow-inner`}
                >
                  <span className="text-sm font-black text-foreground dark:text-white">
                    {card.initial}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-foreground dark:text-white leading-tight">
                  {card.title}
                </h3>
                <p className="text-[10px] text-muted-foreground dark:text-slate-400 mt-1">
                  {card.subtitle}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
