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
      accentColor: "bg-[#d1fae5]", // bg-green-light
      iconColor: "text-[#10b981]", // text-secondary (approx)
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
      accentColor: "bg-[#dbeafe]", // bg-blue-light
      iconColor: "text-[#3b82f6]", // text-blue
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
      accentColor: "bg-[#d1fae5]",
      iconColor: "text-[#10b981]",
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
      accentColor: "bg-[#d1fae5]",
      iconColor: "text-[#10b981]",
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
      accentColor: "bg-[#ccfbf1]", // bg-teal-light
      iconColor: "text-[#0d9488]", // text-primary
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
      accentColor: "bg-[#ffedd5]", // bg-orange-light
      iconColor: "text-[#f97316]", // text-orange
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
    color: "bg-[#fef9c3] text-[#f59e0b]",
    radius: 220,
  },
  {
    icon: LayoutGrid,
    label: "Planning",
    angle: -65,
    color: "bg-[#dbeafe] text-[#3b82f6]",
    radius: 230,
  },
  {
    icon: Users,
    label: "Team Building",
    angle: -30,
    color: "bg-[#ccfbf1] text-[#0d9488]",
    radius: 240,
  },
  {
    icon: Video,
    label: "Meetings",
    angle: 5,
    color: "bg-[#f3e8ff] text-[#a855f7]",
    radius: 225,
  },
  {
    icon: ListChecks,
    label: "Task Execution",
    angle: 40,
    color: "bg-[#d1fae5] text-[#10b981]",
    radius: 235,
  },
  {
    icon: BarChart3,
    label: "KPI Tracking",
    angle: 75,
    color: "bg-[#ffedd5] text-[#f97316]",
    radius: 225,
  },
  {
    icon: Clock,
    label: "Deadlines",
    angle: 110,
    color: "bg-[#ccfbf1] text-[#0d9488]",
    radius: 230,
  },
  {
    icon: Handshake,
    label: "Stakeholder\nManagement",
    angle: 150,
    color: "bg-[#dbeafe] text-[#3b82f6]",
    radius: 225,
  },
  {
    icon: Package,
    label: "Delivery",
    angle: 200,
    color: "bg-[#d1fae5] text-[#10b981]",
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
            <div className="w-3.5 h-3.5 rounded bg-[#0d9488] opacity-20"></div>
            <div className="w-3.5 h-3.5 rounded bg-[#10b981] opacity-30"></div>
            <div className="w-3.5 h-3.5 rounded bg-[#f59e0b] opacity-40"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-3.5 h-3.5 rounded bg-[#3b82f6] opacity-20"></div>
            <div className="w-3.5 h-3.5 rounded bg-[#f97316] opacity-20"></div>
          </div>
        </div>
      );
      break;
    case "chart":
      content = (
        <div className="flex items-end gap-0.5 h-7">
          <div className="w-2.5 h-2 bg-[#0d9488] opacity-30 rounded-sm"></div>
          <div className="w-2.5 h-4 bg-[#10b981] opacity-40 rounded-sm"></div>
          <div className="w-2.5 h-7 bg-[#0d9488] opacity-50 rounded-sm"></div>
          <div className="w-2.5 h-3 bg-[#f59e0b] opacity-40 rounded-sm"></div>
        </div>
      );
      break;
    case "progress":
      content = (
        <div className="space-y-1.5 w-full">
          <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-[#10b981] rounded-full"></div>
          </div>
          <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-[#0d9488] rounded-full"></div>
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
                className={`w-2.5 h-2.5 rounded-sm ${i % 3 === 0 ? "bg-[#0d9488] opacity-30" : "bg-[#f1f5f9]"}`}
              ></div>
            ))}
        </div>
      );
      break;
  }
  return (
    <div className="bg-[#f1f5f9] dark:bg-gray-200 bg-opacity-50 rounded-lg p-2.5 flex-1 min-w-[70px]">
      <p className="text-[9px] font-medium text-[#64748b] dark:text-gray-400 mb-1.5 truncate">
        {feature.label}
      </p>
      {content}
    </div>
  );
};

const ProjectCard = ({ data }: { data: any }) => {
  const Icon = data.icon;
  return (
    <div className="project-card p-4 bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(30,58,138,0.15)] hover:shadow-[0_8px_30px_-4px_rgba(30,58,138,0.2)] transition-all duration-500 w-[220px] lg:w-[240px] cursor-pointer group hover:scale-105 hover:border-2 hover:border-primary ">
      <div className="flex items-start gap-2.5 mb-3">
        <div
          className={`w-10 h-10 rounded-lg ${data.accentColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
        >
          <Icon className={`w-5 h-5 ${data.iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-[#1e293b] leading-tight truncate">
            {data.title}
          </h3>
          <p className="text-[10px] text-[#64748b] leading-tight line-clamp-2">
            {data.subtitle}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        {data.features.slice(0, 2).map((f: any, i: number) => (
          <FeatureBlock key={i} feature={f} />
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#0d9488]" />
          <span className="text-[9px] text-[#64748b]">
            {data.teamText || "Team Collaboration"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
          <span className="text-[9px] text-[#64748b] truncate max-w-[55px]">
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;
  const isDesktop = dimensions.width >= 1024;

  return (
    <section className="relative w-full py-10 overflow-hidden">
      <Image
        src="https://images.pexels.com/photos/9227508/pexels-photo-9227508.jpeg"
        alt="Project Management Background"
        fill
        className="object-cover opacity-20 pointer-events-none"
        priority
      />
      {/* Premium Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc]/60 via-[#f0f9ff]/60 to-[#f0fdf4]/60 backdrop-blur-[2px]" />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes counter-orbit { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .animate-orbit { animation: orbit 60s linear infinite; }
        .animate-counter-orbit { animation: counter-orbit 60s linear infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @media (max-width: 1023px) {
          .animate-orbit { animation: orbit 30s linear infinite; }
          .animate-counter-orbit { animation: counter-orbit 30s linear infinite; }
        }
      `,
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-60 overflow-hidden">
        <div className="absolute top-12 left-8 hidden lg:block">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="25"
              cy="25"
              r="10"
              fill="none"
              stroke="#0d9488"
              strokeWidth="1.5"
            />
            <circle cx="25" cy="25" r="4" fill="#0d9488" opacity="0.6" />
            <line
              x1="35"
              y1="30"
              x2="70"
              y2="55"
              stroke="#0d9488"
              strokeWidth="1"
              opacity="0.4"
            />
            <circle
              cx="75"
              cy="60"
              r="6"
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
            />
            <circle cx="75" cy="60" r="2" fill="#10b981" />
          </svg>
        </div>
        <div className="absolute top-8 right-12 hidden lg:block">
          <svg width="140" height="130" viewBox="0 0 140 130">
            <circle
              cx="120"
              cy="25"
              r="8"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
            />
            <circle cx="120" cy="25" r="3" fill="#10b981" opacity="0.7" />
            <line
              x1="112"
              y1="30"
              x2="75"
              y2="55"
              stroke="#10b981"
              strokeWidth="1"
              opacity="0.4"
            />
          </svg>
        </div>
        {/* Scattered dots */}
        <div className="absolute top-[30%] left-[22%] w-2 h-2 bg-[#0d9488] opacity-25 rounded-full hidden xl:block"></div>
        <div className="absolute top-[25%] right-[20%] w-2.5 h-2.5 bg-[#10b981] opacity-25 rounded-full hidden xl:block"></div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center py-12 relative">
        {/* Desktop Side Cards */}
        {isDesktop && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-8 xl:px-12">
            <div className="flex flex-col gap-5 pointer-events-auto z-10">
              {PROJECT_CARDS_DATA.left.map((card, i) => (
                <ProjectCard key={i} data={card} />
              ))}
            </div>
            <div className="flex flex-col gap-5 pointer-events-auto z-10">
              {PROJECT_CARDS_DATA.right.map((card, i) => (
                <ProjectCard key={i} data={card} />
              ))}
            </div>
          </div>
        )}

        {/* Center Hub Section */}
        <div className="relative w-[280px] h-[280px] md:w-[500px] md:h-[500px] lg:w-[580px] lg:h-[580px] flex items-center justify-center mx-auto z-20">
          {/* Orbiting Steps Container */}
          <div className="absolute inset-0 flex items-center justify-center animate-orbit pointer-events-none">
            {STEPS.map((step, i) => {
              const angleRad = (step.angle * Math.PI) / 180;
              let r = step.radius;
              if (isMobile) r = 105;
              else if (isTablet) r = 180;

              const x = Math.cos(angleRad) * r;
              const y = Math.sin(angleRad) * r;
              const StepIcon = step.icon;

              return (
                <div
                  key={i}
                  className="absolute flex flex-col items-center gap-1.5 z-30 pointer-events-auto"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <div className="animate-counter-orbit">
                    <div className="relative group">
                      <div
                        className={`${step.color} w-9 h-9 md:w-11 md:h-11 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 cursor-pointer`}
                      >
                        <StepIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-7 lg:h-7" />
                      </div>
                    </div>
                    <span className="text-[7px] md:text-[10px] lg:text-xs font-medium text-[#1e293b] whitespace-pre-line text-center leading-tight max-w-[80px] mt-1 block">
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Floating Icons (Desktop only) */}
            {isDesktop && (
              <>
                <div
                  className="absolute z-40"
                  style={{ transform: "translate(180px, -130px)" }}
                >
                  <div className="flex -space-x-1 animate-counter-orbit">
                    <div className="w-5 h-5 rounded-full bg-[#dbeafe] border border-white flex items-center justify-center">
                      <UserCircle className="w-3 h-3 text-[#3b82f6]" />
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#d1fae5] border border-white flex items-center justify-center">
                      <UserCircle className="w-3 h-3 text-[#10b981]" />
                    </div>
                  </div>
                </div>
                <div
                  className="absolute z-40"
                  style={{ transform: "translate(210px, -40px)" }}
                >
                  <div className="animate-counter-orbit bg-white rounded-lg shadow-sm px-2 py-1 border border-[#f1f5f9]">
                    <MessageCircle className="w-3 h-3 text-[#a855f7]" />
                  </div>
                </div>
                <div
                  className="absolute z-40"
                  style={{ transform: "translate(195px, 60px)" }}
                >
                  <div className="animate-counter-orbit bg-white rounded-md shadow-sm px-2 py-1 border border-[#f1f5f9] flex items-center gap-1">
                    <div className="w-8 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-[#10b981] rounded-full"></div>
                    </div>
                    <CheckCircle className="w-3 h-3 text-[#10b981]" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Central Hub */}
          <div className="relative flex items-center justify-center">
            {/* Rings */}
            <div
              className="absolute w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full border-[3px] border-[#0d9488] border-opacity-25"
              style={{
                background:
                  "radial-gradient(circle, rgba(236,253,248,0.8) 0%, rgba(209,250,229,0.6) 100%)",
              }}
            ></div>
            <div className="absolute w-48 h-48 md:w-60 md:h-60 lg:w-68 lg:h-68 rounded-full border-2 border-[#10b981] border-opacity-25"></div>

            {/* Inner circle */}
            <div
              className="relative w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full flex items-center justify-center shadow-lg border-2 border-[#0d9488] border-opacity-20 bg-white"
              style={{
                background:
                  "linear-gradient(180deg, #fff 0%, #f0f9ff 60%, #f0fdf4 100%)",
              }}
            >
              <div className="text-center p-4">
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[#ccfbf1] to-[#d1fae5] dark rounded-full flex items-center justify-center shadow-md animate-float">
                      <Rocket className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-[#0d9488]" />
                    </div>
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-[#f59e0b]" />
                  </div>
                </div>
                <h1 className="text-[10px] md:text-sm lg:text-base font-bold text-[#1e293b] leading-tight tracking-tight">
                  PROJECT
                  <br />
                  MANAGEMENT:
                </h1>
                <p className="text-[9px] md:text-xs lg:text-sm font-semibold text-[#0d9488] mt-1">
                  FROM IDEA
                  <br />
                  TO IMPACT
                </p>
              </div>
            </div>

            {/* Decorative checkmark */}
            <div className="absolute top-8 right-6 md:top-6 md:right-10 lg:top-8 lg:right-12 w-6 h-6 md:w-8 md:h-8 bg-[#10b981] rounded-full flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Mobile Project Cards List */}
        {!isDesktop && (
          <div className="px-4 pb-8 w-full max-w-md mt-12 grid grid-cols-2 gap-3 z-30 relative">
            {MOBILE_CARDS.map((card, i) => (
              <div
                key={i}
                className="project-card p-3 bg-white shadow-sm border border-[#f1f5f9] rounded-xl"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center mb-2`}
                >
                  <span className="text-sm font-bold text-[#1e293b]">
                    {card.initial}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-[#1e293b] leading-tight">
                  {card.title}
                </h3>
                <p className="text-[10px] text-[#64748b] mt-0.5">
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
