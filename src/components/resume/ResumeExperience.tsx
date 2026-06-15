"use client";
import React, { useState, useEffect } from "react";
import { getExperience } from "@/app/actions/resume";

export default function ResumeExperience() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperience();
        setExperiences(data);
      } catch (error) {
        console.error("Failed to fetch experiences", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperiences();
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // Trigger when element is in the center of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(
            entry.target.getAttribute("data-index") || "-1",
          );
          if (index >= 0) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    // Observe all experience cards
    const cards = document.querySelectorAll("[data-experience-card]");
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, [experiences]); // Re-run when experiences are loaded

  return (
    <section id="experience" className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Experience
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="relative space-y-12">
        {/* Center Line */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2"></div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : experiences.length === 0 ? (
          <p className="text-center text-slate-500 relative z-10">No experience details available yet.</p>
        ) : experiences.map((exp, index) => {
          const isEven = index % 2 === 0;
          const isActive = activeIndex === index;

          return (
            <div
              key={exp.id || index}
              data-experience-card
              data-index={index}
              className={`relative md:flex justify-between items-center group ${isEven ? "md:flex-row-reverse" : ""}`}
            >
              {/* Space Holder */}
              <div className="hidden md:block w-[calc(50%-2rem)]"></div>

              {/* Icon */}
              <div
                className={`absolute left-[20px] md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center z-10 transition-all duration-300
                            ${isActive ? "bg-primary text-white" : "bg-white dark:bg-slate-800 text-slate-400"}`}
              >
                <i className={`fa-solid fa-briefcase text-sm`}></i>
              </div>

              {/* Content Card */}
              <div className="ml-12 md:ml-0 md:w-[calc(50%-2rem)] bg-slate-50   dark:bg-gradient-to-br from-teal-950 to-teal-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition hover:-translate-y-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {exp.position}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${exp.is_active ? "text-primary bg-primary/10" : "text-slate-400 bg-slate-100 dark:bg-slate-800"}`}
                  >
                    {exp.duration}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  {exp.company}
                </p>
                <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: exp.description || '' }}>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
