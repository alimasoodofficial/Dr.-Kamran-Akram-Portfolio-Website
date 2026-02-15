"use client";
import React from "react";

const awards = [
  {
    title: "Innovation for the red meat industry HDR Award",
    description: null,
    icon: "fa-award",
    color:
      "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-500",
    link: "#", // User said "Click here" but didn't provide URL
  },
  {
    title: "Animal Production Research Open Category Award",
    description: null,
    icon: "fa-trophy",
    color:
      "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-500",
    link: "#", // User said "Click here" but didn't provide URL
  },
  {
    title: "3MT FINALIST 2021",
    description:
      "Queensland Alliance for Agriculture and Food Innovation 3MT Final",
    icon: "fa-microphone",
    color:
      "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
    link: "#", // User said "Click here" but didn't provide URL
  },
  {
    title: "First Aid support Certificate",
    description:
      "A Statement of Attainment is issued by a Registered Training Organisation when an individual has completed one or more accredited units.",
    icon: "fa-heart-pulse",
    color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-500",
    link: "#", // User said "Click here" but didn't provide URL
  },
  {
    title: "Young Science Ambassador Award",
    description:
      "In recognition of dedication and commitment to STEM education",
    icon: "fa-flask",
    color:
      "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-500",
    link: "#", // User said "Click here" but didn't provide URL
  },
  {
    title: "UQ Student Representative",
    description:
      "In recognition of my participation in the UQ Student Reps Bootcamp",
    icon: "fa-user-graduate",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-500",
    link: "#", // User said "Click here" but didn't provide URL
  },
];

export default function ResumeAwards() {
  return (
    <section id="awards">
      <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        Awards & Certifications
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards.map((award, index) => (
          <a
            key={index}
            href={award.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-50   dark:bg-gradient-to-br from-teal-900 to-slate-950 p-6 rounded-xl    shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col group cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center gap-4 ">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl ${award.color}`}
              >
                <i className={`fa-solid ${award.icon}`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-center text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                  {award.title}
                </h4>
              </div>
            </div>
            {award.description && (
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed">
                {award.description}
              </p>
            )}
            {/* <div className="mt-auto pt-3">
              <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold group-hover:underline">
                View Certificate →
              </span>
            </div> */}
          </a>
        ))}
      </div>
    </section>
  );
}
