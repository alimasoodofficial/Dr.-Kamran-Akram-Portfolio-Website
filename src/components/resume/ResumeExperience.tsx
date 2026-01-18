"use client";
import React from 'react';

const experiences = [
    {
        title: "Data Specialist",
        company: "Neogen Australasia Pty Limited",
        period: "Present",
        description: "Combining data analysis, research, and industry insights to support real-world decision making.",
        icon: "fa-briefcase",
        active: true
    },
    {
        title: "Outreach Officer",
        company: "ASSAB (Animal Behavior)",
        period: "2022-2023",
        description: (
            <ul className="list-disc pl-4 space-y-1">
                <li>Coordinated outreach activities across Australia & NZ.</li>
                <li>Developed science communication content.</li>
            </ul>
        ),
        icon: "fa-bullhorn",
        active: false
    },
    {
        title: "Research Placement",
        company: "CSIRO (Agriculture and Food)",
        period: "2021",
        description: "Project: Flystrike vaccine development.",
        icon: "fa-flask",
        link: "Read Case Study →",
        active: false
    },
    {
        title: "Dairy Trainer",
        company: "FrieslandCampina®",
        period: "2017-2018",
        description: "Trained 18,000+ farmers. Won Commonwealth Company of the Year Award.",
        icon: "fa-cow",
        active: false
    }
];

export default function ResumeExperience() {
  return (
    <section id="experience" className="mb-20">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Experience</h2>
            <div className="w-16 h-1 bg-sky-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="relative space-y-12">
            {/* Center Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2"></div>
            
            {experiences.map((exp, index) => {
                const isEven = index % 2 === 0;
                return (
                    <div key={index} className={`relative md:flex justify-between items-center group ${isEven ? 'md:flex-row-reverse' : ''}`}>
                        {/* Space Holder */}
                        <div className="hidden md:block w-[calc(50%-2rem)]"></div>
                        
                        {/* Icon */}
                        <div className={`absolute left-[20px] md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center z-10 
                            ${exp.active ? 'bg-sky-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${exp.icon} text-sm`}></i>
                        </div>
                        
                        {/* Content Card */}
                        <div className="ml-12 md:ml-0 md:w-[calc(50%-2rem)] bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{exp.title}</h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${exp.active ? 'text-sky-600 bg-sky-600/10' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
                                    {exp.period}
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">{exp.company}</p>
                            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                {exp.description}
                            </div>
                            {exp.link && (
                                <a href="#" className="text-sky-600 text-xs font-semibold mt-2 inline-block hover:underline">{exp.link}</a>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    </section>
  );
}
