"use client";
import React from 'react';

export default function ResumeAbout() {
  const tags = ["PhD Animal Sciences", "Data Analysis", "Microbiology", "Science Communication"];

  return (
    <section id="about" className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden mb-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-600/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 font-heading">
            <span className="w-10 h-1 bg-sky-600 rounded-full"></span> About Me
        </h2>
        
        <div className="grid md:grid-cols-1 gap-6 text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-body">
            <p>
                I am a multilingual agricultural scientist, data analyst, and business analyst with a career that spans veterinary practice, dairy training, microbiology, academic lecturing, and advanced research. My journey has taken me from working as a veterinarian and dairy trainer to serving as a quality control microbiologist.
            </p>
            <p>
                Currently working at <strong className="text-slate-900 dark:text-white font-semibold">Neogen Australasia</strong>, I combine data analysis, research, and industry insights to support real-world decision making. As an MLA Red Meat Industry Ambassador and a Young Science Ambassador, I work to translate complex scientific information into practical knowledge.
            </p>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-3">
            {tags.map((tag, index) => (
                <span key={index} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700">
                    {tag}
                </span>
            ))}
        </div>
    </section>
  );
}
