"use client";
import React from 'react';

export default function ResumeHeader() {
  return (
    <section className="text-center max-w-3xl mx-auto space-y-6 mb-20 animate-fade-in-up">
        {/* Avatar */}
        <div className="inline-block p-1 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-xl mb-4">
            <img 
                src="https://ui-avatars.com/api/?name=Muhammad+Kamran&background=0f172a&color=fff&size=256&font-size=0.33" 
                alt="Dr. Kamran" 
                className="w-24 h-24 rounded-full"
            />
        </div>
        
        {/* Name & Title */}
        <div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-slate-900 dark:text-white mb-2">
                Dr. Muhammad <span className="text-sky-600">Kamran</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium font-body">
                Agricultural Scientist & Data Analyst
            </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4">
            <a href="https://imkamran.com" target="_blank" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-white hover:bg-sky-600 hover:border-sky-600 transition">
                <i className="fa-solid fa-globe"></i>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition">
                <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="mailto:contact@imkamran.com" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-white hover:bg-red-500 hover:border-red-500 transition">
                <i className="fa-regular fa-envelope"></i>
            </a>
        </div>
    </section>
  );
}
