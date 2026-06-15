"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, MapPin, Printer, Linkedin, Youtube, Facebook, Download } from "lucide-react";
import { getCVUrl } from "@/app/actions/resume";

export default function ResumeHeader() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadCVUrl() {
      const url = await getCVUrl();
      if (url) {
        setCvUrl(url);
      }
    }
    loadCVUrl();
  }, []);

  const handleAction = () => {
    if (cvUrl) {
      window.open(cvUrl, "_blank");
    } else if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <section className="relative w-full mb-16 no-print">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="green-glass p-8 md:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative overflow-hidden">
        {/* Glow overlay */}
        <div className="absolute -right-16 -top-16 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Profile Image & Quick Badges */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-36 h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl group cursor-pointer"
          >
            <Image
              src="/images/original.webp"
              alt="Dr. Muhammad Kamran"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />
            {/* Glowing ring overlay */}
            <div className="absolute inset-0 border-2 border-primary/50 rounded-2xl scale-95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>

          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full tracking-wider uppercase">
            PhD • UQ Alumnus
          </span>
        </div>

        {/* Text Details & Contacts */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-2">
            <motion.h1 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white"
            >
              Dr. Muhammad <span className="text-emerald-500">Kamran</span>
            </motion.h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium font-body">
              Agricultural Scientist & Data Analyst
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-600 dark:text-slate-400 font-body">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <a href="mailto:hi@imkamran.com" className="hover:text-emerald-500 transition-colors">
                hi@imkamran.com
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Brisbane, Australia</span>
            </div>
          </div>

          {/* Social Icons & Print Action */}
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/80">
            {/* Social links */}
            <div className="flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/kam09/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all hover:-translate-y-0.5"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@MKamran09"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all hover:-translate-y-0.5"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>

              {/* Twitter/X */}
              <a
                href="https://x.com/mkamran09"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all hover:-translate-y-0.5"
                title="Twitter/X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/kamran.akram3/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all hover:-translate-y-0.5"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>

            {/* Print / Download PDF */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAction}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 cursor-pointer font-body"
            >
              {cvUrl ? <Download className="w-4 h-4" /> : <Printer className="w-4 h-4" />}
              {cvUrl ? "Download CV" : "Print / Save CV"}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
