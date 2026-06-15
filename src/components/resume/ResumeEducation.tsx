"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { getEducation } from '@/app/actions/resume';

export default function ResumeEducation() {
  const [educations, setEducations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const data = await getEducation();
        setEducations(data);
      } catch (error) {
        console.error("Failed to fetch education", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEducations();
  }, []);

  return (
    <section id="education" className="mb-20">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Education</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : educations.length === 0 ? (
          <p className="text-slate-500">No education details available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {educations.map((edu, index) => (
                  <div key={edu.id || index} className={`p-8 rounded-2xl border transition-all duration-300 relative overflow-hidden group flex flex-col h-full
                      ${edu.highlight 
                          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800/50 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1' 
                          : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 hover:shadow-md hover:-translate-y-1'
                      }`}>
                      
                      {/* Background decoration */}
                      <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-600/20 dark:bg-emerald-400/5 rounded-full blur-2xl group-hover:bg-emerald-600/10 dark:group-hover:bg-emerald-400/10 transition-colors duration-500"></div>

                      <div className="flex items-start justify-between mb-6 relative z-10">
                          <div className={`p-3 rounded-xl !bg-white  shadow-sm border ${edu.highlight ? 'border-emerald-100 dark:border-emerald-800' : 'border-slate-100 dark:border-slate-700'}`}>
                              <div className="relative w-20 h-20">
                                  {edu.logo ? (
                                    <Image
                                        src={edu.logo}
                                        alt={edu.institution}
                                        width={200}
                                        height={200}
                                        className="object-cover"
                                    />
                                  ) : (
                                    <GraduationCap className="w-full h-full text-slate-400" />
                                  )}
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                              <Calendar className="w-3.5 h-3.5" />
                              {edu.years}
                          </div>
                      </div>

                      <div className="relative z-10 flex-grow">
                          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {edu.degree}
                          </h3>
                          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500 mb-4 flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              {edu.institution}
                          </p>
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                              {edu.description}
                          </p>
                      </div>
                  </div>
              ))}
          </div>
        )}
    </section>
  );
}
