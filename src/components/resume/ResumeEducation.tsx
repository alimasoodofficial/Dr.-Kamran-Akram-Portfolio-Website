"use client";
import React from 'react';

const educations = [
    {
        degree: "Ph.D. Veterinary Science",
        institution: "University of Queensland",
        years: "2018 - 2023",
        description: "Research focused on understanding why some cattle are more susceptible to buffalo flies.",
        highlight: true
    },
    {
        degree: "M.Phil. Microbiology",
        institution: "University of Agriculture, Faisalabad",
        years: "2014 - 2017",
        description: "Research on bioplastic producing bacteria in rumen flora.",
        highlight: false
    },
    {
        degree: "Doctor of Veterinary Medicine",
        institution: "University of Agriculture, Faisalabad",
        years: "2009 - 2014",
        description: "Registrable in Australia. Foundation for veterinary science career.",
        highlight: false
    }
];

export default function ResumeEducation() {
  return (
    <section id="education" className="mb-20">
        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {educations.map((edu, index) => (
                <div key={index} className={`p-8 rounded-2xl border shadow-sm transition duration-300 relative overflow-hidden group 
                    ${edu.highlight 
                        ? 'bg-slate-900 text-white border-slate-900 hover:scale-[1.02]' 
                        : 'bg-slate-50   dark:bg-gradient-to-br from-teal-800 to-slate-800 border-slate-200 dark:border-slate-800 hover:border-sky-600/50 hover:shadow-md'
                    }`}>
                    
                    {edu.highlight && (
                         <div className="absolute -right-6 -top-6 w-32 h-32 bg-sky-600/20 rounded-full"></div>
                    )}

                    <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${edu.highlight ? 'text-sky-500' : 'text-slate-400'}`}>
                        {edu.years}
                    </p>
                    <h3 className={`text-xl md:text-2xl font-bold mb-2 ${edu.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {edu.degree}
                    </h3>
                    <p className={`text-sm mb-4 font-medium ${edu.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {edu.institution}
                    </p>
                    <p className={`text-sm leading-relaxed ${edu.highlight ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>
                        {edu.description}
                    </p>
                </div>
            ))}
        </div>
    </section>
  );
}
