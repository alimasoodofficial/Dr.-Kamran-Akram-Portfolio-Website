"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Database, Beaker, Users } from 'lucide-react';

const skillCategories = [
  {
    title: "Data & Analytics",
    icon: <Database className="w-6 h-6 text-emerald-500" />,
    description: "Combining data analysis, predictive modeling, and statistical insights.",
    skills: [
      { name: "R & Biostatistics", level: 95 },
      { name: "Python (Data Analysis)", level: 85 },
      { name: "Data Storytelling & Viz", level: 90 },
      { name: "Bioinformatics", level: 80 }
    ]
  },
  {
    title: "Scientific & Lab Operations",
    icon: <Beaker className="w-6 h-6 text-teal-500" />,
    description: "Experienced in microbiology, molecular diagnostics, and veterinary practice.",
    skills: [
      { name: "Microbiology & Bio-Burden", level: 95 },
      { name: "PCR & Molecular Diagnostics", level: 90 },
      { name: "ELISA & Sterility Testing", level: 90 },
      { name: "Antibiotic Assays", level: 85 },
      { name: "Veterinary Medicine (DVM)", level: 95 },
      { name: "Animal Behaviour Research", level: 90 }
    ]
  },
  {
    title: "Communication & Leadership",
    icon: <Users className="w-6 h-6 text-emerald-400" />,
    description: "Bridging the gap between complex science and practical industry knowledge.",
    skills: [
      { name: "Science Communication", level: 95 },
      { name: "Public Speaking & 3MT", level: 95 },
      { name: "Stakeholder Engagement", level: 90 },
      { name: "Project Management", level: 85 },
      { name: "Rural Community Training", level: 95 },
      { name: "Mentorship & Teaching", level: 90 }
    ]
  }
];

export default function ResumeSkills() {
  return (
    <section id="skills" className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Skills Matrix
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto font-body text-sm md:text-base">
          A visual representation of core competencies across research, analysis, and communications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, catIdx) => (
          <motion.div
            key={catIdx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            className="green-card p-6 flex flex-col h-full bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
          >
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl">
                {category.icon}
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                  {category.title}
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-body">
              {category.description}
            </p>

            {/* Skills Progress Bars */}
            <div className="space-y-4 flex-1">
              {category.skills.map((skill, skillIdx) => (
                <div key={skillIdx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 font-body">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + skillIdx * 0.05 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
