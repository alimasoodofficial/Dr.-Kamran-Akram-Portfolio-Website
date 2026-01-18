"use client";
import React from 'react';

const awards = [
    {
        title: "Innovation HDR Award",
        subtitle: "Red Meat Industry",
        icon: "fa-award",
        color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-500"
    },
    {
        title: "3MT Finalist 2021",
        subtitle: "QAAFI",
        icon: "fa-microphone",
        color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400"
    },
    {
        title: "Young Sci. Ambassador",
        subtitle: "STEM Education",
        icon: "fa-leaf",
        color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-500"
    },
    {
        title: "First Aid Certificate",
        subtitle: "Safety Support",
        icon: "fa-heart-pulse",
        color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-500"
    }
];

export default function ResumeAwards() {
  return (
    <section id="awards">
        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">Awards & Certifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {awards.map((award, index) => (
                <div key={index} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition duration-300 flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 text-xl ${award.color}`}>
                        <i className={`fa-solid ${award.icon}`}></i>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{award.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{award.subtitle}</p>
                </div>
            ))}
        </div>
    </section>
  );
}
