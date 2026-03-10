// src/components/TimelineCarousel.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

// -- Types --
interface TimelineItem {
  yearRange: string;
  title: string;
  description: string;
  icon: React.ReactNode; // Accepts any SVG or Icon Component
}

// Example Icons (You can replace these with Lucide, Heroicons, or FontAwesome)
const GlobalIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const ImpactIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);
const BookIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);
const FutureIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    />
  </svg>
);

const TIMELINE_DATA: TimelineItem[] = [
  {
    yearRange: "2009 – 2012",
    title: "Global Exposure",
    description:
      "Selected for prestigious international fellowships, including Fulbright and Eisenhower. Broadened global perspective.",
    icon: <GlobalIcon />,
  },
  {
    yearRange: "2013 – 2016",
    title: "Global Impact",
    description:
      "Collaborated with governments and private sector teams on projects in AI, analytics, and policy innovation.",
    icon: <ImpactIcon />,
  },
  {
    yearRange: "2017 – 2025",
    title: "Sharing Knowledge",
    description:
      "Focused on teaching, writing, and mentoring. Launched learning initiatives and authored research books.",
    icon: <BookIcon />,
  },
  {
    yearRange: "2025 – 2030",
    title: "Future Vision",
    description:
      "Advancing AI and human centered systems for public good. Building ethical frameworks and global collaborations.",
    icon: <FutureIcon />,
  },
  {
    yearRange: "2030 – 2035",
    title: "Next Horizon",
    description:
      "Exploring quantum computing applications in social sciences and establishing new educational paradigms.",
    icon: <ImpactIcon />,
  },
  {
    yearRange: "2035+",
    title: "Legacy",
    description:
      "Creating sustainable foundations for future generations to build upon digital infrastructure.",
    icon: <GlobalIcon />,
  },
];

export default function TimelineCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll to a specific index (synced with year click)
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Calculate width of one card (including gap)
      // We assume the first child exists to get width
      const firstCard = container.firstElementChild as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 24; // 24 is the gap-6 (1.5rem)

        container.scrollTo({
          left: index * cardWidth,
          behavior: "smooth",
        });
        setActiveIndex(index);
      }
    }
  };

  // Handle manual scroll to update active index state
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstCard = container.firstElementChild as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 24;
        const currentScroll = container.scrollLeft;
        // Simple calculation to find nearest index
        const index = Math.round(currentScroll / cardWidth);
        // Only update if changed to avoid too many re-renders
        if (
          index !== activeIndex &&
          index >= 0 &&
          index < TIMELINE_DATA.length
        ) {
          setActiveIndex(index);
        }
      }
    }
  };

  // Arrow button handlers
  const scrollLeft = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = Math.min(TIMELINE_DATA.length - 1, activeIndex + 1);
    scrollToIndex(newIndex);
  };

  return (
    <section className="p-4 md:p-8 min-h-screen flex items-center justify-center ">
      <div className="max-w-7xl w-full bg-gradient-to-br from-[#161f27] to-[#0d273d] rounded-[30px] overflow-hidden shadow-2xl flex flex-col">
        {/* 1. Hero Image Section */}
        <div className="relative w-full h-[300px] md:h-[400px] shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
            alt="Team collaboration"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#161b27] via-[#172716]/60 to-transparent" />
        </div>

        {/* 2. Timeline Logic */}
        <div className="flex flex-col flex-1 py-8 relative">
          {/* Navigation Arrows */}
          <div className="flex items-center justify-between px-4 md:px-12 mb-6 gap-4">
            {/* Left Arrow */}
            <button
              onClick={scrollLeft}
              disabled={activeIndex === 0}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-lg z-20 hover:scale-110 flex-shrink-0 ${
                activeIndex === 0
                  ? "bg-gray-600 opacity-50 cursor-not-allowed"
                  : "bg-[#f59e0b] hover:bg-[#d97706] cursor-pointer"
              }`}
            >
              <svg
                className="h-5 w-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              disabled={activeIndex === TIMELINE_DATA.length - 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-lg z-20 hover:scale-110 flex-shrink-0 ${
                activeIndex === TIMELINE_DATA.length - 1
                  ? "bg-gray-600 opacity-50 cursor-not-allowed"
                  : "bg-[#172716]/50 hover:bg-[#f59e0b] text-white hover:text-black cursor-pointer"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* B. Cards Scrollable Area */}
          <div className="px-4 md:px-12 w-full flex-1">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 h-full"
            >
              {TIMELINE_DATA.map((item, index) => (
                <div
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className="shrink-0 snap-center rounded-xl p-6 flex flex-col shadow-lg transition-all duration-500 border w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white/100 dark:bg-[#111319]/60 border-transparent hover:border-[#f59e0b]/30"
                >
                  {/* Year Badge + Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="px-3 py-1 rounded-full border text-xs font-medium tracking-wide backdrop-blur-sm transition-all duration-300 whitespace-nowrap border-[#10b981]/50 bg-blue-600  text-gray-200">
                      {item.yearRange}
                    </div>
                    <div className="p-2 rounded-lg transition-all duration-300  bg-yellow-600 text-white">
                      {item.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold leading-snug mb-3 text-gray-700 dark:text-gray-100">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-200">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
