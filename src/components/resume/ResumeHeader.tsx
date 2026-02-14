"use client";
import Image from "next/image";

const SocialIcon = ({ path }: { path: string }) => (
  <svg
    className="w-5 h-5 text-white transition-colors cursor-pointer"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={path} />
  </svg>
);

export default function ResumeHeader() {
  return (
    <section className="text-center max-w-3xl mx-auto space-y-6 mb-20 animate-fade-in-up">
      {/* Avatar */}
      <div className="inline-flex items-center justify-center p-1 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-xl mb-4 relative w-24 h-24">
        <span className="text-4xl text-black dark:text-white font-heading font-black">mk.</span>
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
      <div className="flex gap-4 mt-6 flex-wrap justify-center items-center">
        {/* Facebook */}
        <a
          className="bg-blue-950 p-3 rounded-full hover:bg-blue-600 transition-colors cursor-pointer hover:scale-110"
          href="https://www.facebook.com/kamran.akram3/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SocialIcon path="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </a>
        {/* YouTube */}
        <a
          className="bg-blue-950 p-3 rounded-full hover:bg-blue-600 transition-colors cursor-pointer hover:scale-110"
          href="https://www.youtube.com/@MKamran09"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SocialIcon path="M21.58 7.24a2.95 2.95 0 00-2.08-2.09C17.67 4.5 12 4.5 12 4.5s-5.67 0-7.5.65a2.95 2.95 0 00-2.09 2.09A31.14 31.14 0 002 12.24a31.14 31.14 0 00.41 5.25 2.95 2.95 0 002.09 2.09C6.33 20 12 20 12 20s5.67 0 7.5-.65a2.95 2.95 0 002.09-2.09 31.14 31.14 0 00.41-5.25 31.14 31.14 0 00-.41-5zM9.75 15.02V8.98l5.25 3.02z" />
        </a>
        {/* Twitter/X */}
        <a
          className="bg-blue-950 p-3 rounded-full hover:bg-blue-600 transition-colors cursor-pointer hover:scale-110"
          href="https://x.com/mkamran09"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SocialIcon path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </a>
        {/* LinkedIn */}
        <a
          className="bg-blue-950 p-3 rounded-full hover:bg-blue-600 transition-colors cursor-pointer hover:scale-110"
          href="https://www.linkedin.com/in/kam09/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SocialIcon path="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 11-2 2 2 2 0 012-2z" />
        </a>
      </div>
    </section>
  );
}
