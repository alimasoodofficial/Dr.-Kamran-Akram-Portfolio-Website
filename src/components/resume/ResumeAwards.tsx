"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, FileText } from "lucide-react";
import { getAwards } from "@/app/actions/resume";

export default function ResumeAwards() {
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const data = await getAwards();
        setAwards(data);
      } catch (error) {
        console.error("Failed to fetch awards", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAwards();
  }, []);

  return (
    <section id="awards" className="mb-20">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
          <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Awards & Certifications
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : awards.length === 0 ? (
        <p className="text-slate-500">No awards details available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, index) => (
            <div
              key={award.id || index}
              className="group relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 hover:-translate-y-1 flex flex-col h-full overflow-hidden"
            >
              {/* Background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-colors duration-500 z-0"></div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Image Container */}
                <div className="w-full h-32 mb-6 relative rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 p-4 flex items-center justify-center overflow-hidden">
                  <Image
                    src={award.image || "/images/logos/uaf.png"}
                    alt={award.title}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Hover Overlay Button inside Image Container */}
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <a 
                       href={award.link || "#"}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                     >
                       <ExternalLink className="w-4 h-4" />
                       View Certificate
                     </a>
                  </div>
                </div>

                <div className="flex-1 flex flex-col text-center">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {award.title}
                  </h4>
                  
                  {award.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: award.description || '' }}>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
