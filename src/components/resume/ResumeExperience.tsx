"use client";
import React, { useState, useEffect } from "react";

const experiences = [
  {
    title: "Data Specialist",
    company: "Neogen Australasia Pty Limited",
    period: "June 2023 – Present",
    description:
      "Combining data analysis, research, and industry insights to support real-world decision making.",
    icon: "fa-database",
    active: true,
  },
  {
    title: "Outreach Officer",
    company:
      "The Australasian Society for the Study of Animal Behavior (ASSAB)",
    period: "2022-2023",
    description: (
      <ul className="list-disc pl-4 space-y-1">
        <li>
          Coordinated outreach activities to promote public understanding of
          animal behaviour research across Australia and New Zealand.
        </li>
        <li>
          Developed science communication content for social media, newsletters,
          and public engagement platforms.
        </li>
        <li>
          Organised virtual and in-person events, including seminars, student
          engagement sessions, and community awareness initiatives.
        </li>
      </ul>
    ),
    icon: "fa-bullhorn",
    active: false,
  },
  {
    title: "Research Placement",
    company: "CSIRO (Agriculture and Food)",
    period: "June – Sep 2021",
    description: "Project: Flystrike vaccine development.",
    icon: "fa-flask",
    link: "Read Case Study →",
    url: "https://cdf.graduate-school.uq.edu.au/story/3582/find-solutions-real-life-challenges",
    active: false,
  },
  {
    title: "Dairy Trainer",
    company: "FrieslandCampina® (Engro Foods Pakistan Limited)",
    period: "Aug 2017 – May 2018",
    description: (
      <div className="space-y-2">
        <p>
          <strong>Project:</strong> Big push towards rural economy/farmer-based
          training program
        </p>
        <p>
          This project created 18000+ dairy farmers, 600 Female Micro
          Businesses, 300 Female Livestock Extension Entrepreneurs and 300
          Female Village Milk Collectors and won Commonwealth Company of the
          Year Award.
        </p>
        <div>
          <strong>Job Responsibilities:</strong>
          <ul className="list-disc pl-4 mt-1">
            <li>
              Demonstration of basic livestock techniques and farm management
              skills to rural men and women.
            </li>
            <li>
              Coordination with local livestock managers and local producers for
              meetups to improve basic livestock practices.
            </li>
            <li>
              Mobilization of farmer community for professional short courses.
            </li>
          </ul>
        </div>
      </div>
    ),
    icon: "fa-cow",
    // link: "View Award News →",
    // url: "https://www.brecorder.com/news/414266",
    active: false,
  },
  {
    title: "Quality Control Microbiologist",
    company: "Sanna Labs, Veterinary Pharmaceutical Company, Pakistan",
    period: "Jan 2017 – July 2017",
    description:
      "Job Responsibilities: Sample collection, storage and inventory management, sterility testing of veterinary injections and vaccines, development of research protocols, antibiotic assays of veterinary antibiotics, area monitoring to control “Bio burden”, PCR. data management and record maintenance of microbiology section.",
    icon: "fa-vial",
    active: false,
  },
  {
    title: "Visiting Lecturer",
    company: "Government College University, Faisalabad (Pakistan)",
    period: "Feb 2016 – June 2017",
    description: "Visiting Lecturer.",
    icon: "fa-chalkboard-user",
    active: false,
  },
];

export default function ResumeExperience() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
  }, []);

  return (
    <section id="experience" className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Experience
        </h2>
        <div className="w-16 h-1 bg-orange-600 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="relative space-y-12">
        {/* Center Line */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2"></div>

        {experiences.map((exp, index) => {
          const isEven = index % 2 === 0;
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              data-experience-card
              data-index={index}
              className={`relative md:flex justify-between items-center group ${isEven ? "md:flex-row-reverse" : ""}`}
            >
              {/* Space Holder */}
              <div className="hidden md:block w-[calc(50%-2rem)]"></div>

              {/* Icon */}
              <div
                className={`absolute left-[20px] md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center z-10 transition-all duration-300
                            ${isActive ? "bg-orange-600 text-white" : "bg-white dark:bg-slate-800 text-slate-400"}`}
              >
                <i className={`fa-solid ${exp.icon} text-sm`}></i>
              </div>

              {/* Content Card */}
              <div className="ml-12 md:ml-0 md:w-[calc(50%-2rem)] bg-slate-50   dark:bg-gradient-to-br from-teal-950 to-teal-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition hover:-translate-y-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${exp.active ? "text-orange-600 bg-orange-600/10" : "text-slate-400 bg-slate-100 dark:bg-slate-800"}`}
                  >
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  {exp.company}
                </p>
                <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {exp.description}
                </div>
                {(exp.link || exp.url) && (
                  <a
                    href={exp.url || "#"}
                    target={exp.url ? "_blank" : undefined}
                    rel={exp.url ? "noopener noreferrer" : undefined}
                    className="text-orange-600 text-xs font-semibold mt-2 inline-block hover:underline"
                  >
                    {exp.link || "Read More →"}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
