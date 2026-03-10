'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import React, { useRef } from 'react';

// --- Types ---
interface ExperienceItem {
  date: string;
  title: string;
  company: string;
  description: string;
  tech: string[];
}

const experiences: ExperienceItem[] = [
  {
    date: '2024 - Present',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Systems',
    description: 'Leading the migration to Next.js 14 and implementing a new design system using Tailwind CSS.',
    tech: ['Next.js', 'TypeScript', 'Tailwind', 'GraphQL'],
  },
  {
    date: '2022 - 2024',
    title: 'Full Stack Developer',
    company: 'Innovate Digital',
    description: 'Built scalable microservices and optimized database queries reducing load times by 40%.',
    tech: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
  },
  {
    date: '2020 - 2022',
    title: 'UI/UX Designer & Dev',
    company: 'Creative Labs',
    description: 'Designed and developed interactive marketing sites with complex animations.',
    tech: ['Figma', 'React', 'GSAP', 'WebGL'],
  },
  {
    date: '2019 - 2020',
    title: 'Junior Developer',
    company: 'StartUp Inc',
    description: 'Collaborated on the MVP launch and handled critical bug fixes.',
    tech: ['JavaScript', 'HTML/CSS', 'Git'],
  },
];

export default function Roadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const itemHeight = 300; 
  const totalHeight = experiences.length * itemHeight;

  return (
    // THEME CHANGE: Added light/dark backgrounds and text colors
    <div className="w-9/12  mx-auto py-20 px-4 min-h-screen text-slate-900 dark:text-white transition-colors duration-300">
      
      <h2 className="text-4xl font-bold text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
        Career Roadmap
      </h2>

      <div ref={containerRef} className="relative relative-grid">
        
        {/* --- THE ROAD (SVG) --- */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex justify-center">
            <svg 
                width="150" 
                height={totalHeight} 
                viewBox={`0 0 100 ${totalHeight}`} 
                fill="none"
                className="overflow-visible"
            >
                {/* 1. Gray Background Line (The "Unpaved" Road) 
                    THEME CHANGE: Uses stroke-slate-300 (light) and stroke-slate-800 (dark)
                */}
                <path
                  d={generateCurvyPath(experiences.length, itemHeight)}
                  className="stroke-slate-300 dark:stroke-slate-800 transition-colors duration-300"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* 2. Gradient Animated Line (The "Traveled" Road) */}
                <motion.path
                  d={generateCurvyPath(experiences.length, itemHeight)}
                  stroke="url(#road-gradient)" 
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  style={{ pathLength: scrollYProgress }} 
                />
                
                <defs>
                  <linearGradient id="road-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
                    <stop offset="100%" stopColor="#a855f7" /> {/* purple-500 */}
                  </linearGradient>
                </defs>
            </svg>
        </div>

        {/* --- THE ITEMS --- */}
        <div className="relative z-10">
          {experiences.map((exp, index) => (
            <RoadmapItem 
                key={index} 
                data={exp} 
                index={index} 
                height={itemHeight} 
            />
          ))}
        </div>

      </div>
    </div>
  );
}

// --- Helper: Generate the Gentle Curvy Path ---
function generateCurvyPath(count: number, height: number) {
  let path = `M 50 0`; 
  const curveIntensity = 15; // Gentle curve

  for (let i = 0; i < count; i++) {
    const startY = i * height;
    const endY = (i + 1) * height;
    const direction = i % 2 === 0 ? 1 : -1;
    const controlX = 50 + (direction * curveIntensity);
    const controlY = startY + (height / 2);

    path += ` Q ${controlX} ${controlY}, 50 ${endY}`;
  }
  return path;
}

// --- Component: Individual Item ---
function RoadmapItem({ data, index, height }: { data: ExperienceItem; index: number; height: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex items-center justify-center w-full`}
      style={{ height: `${height}px` }}
    >
      <div className="grid grid-cols-[1fr_100px_1fr] w-full items-center">
        
        {/* Left Side */}
        <div className={`text-right pr-8 ${!isEven ? 'invisible' : ''}`}>
           {isEven && <Card content={data} align="right" />}
        </div>

        {/* Center Marker */}
        <div className="flex justify-center relative">
            {/* THEME CHANGE: Center dot matches background color */}
            <div className="w-4 h-4 bg-gray-50 dark:bg-slate-950 border-4 border-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] z-20 transition-colors duration-300"></div>
        </div>

        {/* Right Side */}
        <div className={`text-left pl-8 ${isEven ? 'invisible' : ''}`}>
            {!isEven && <Card content={data} align="left" />}
        </div>

      </div>
    </motion.div>
  );
}

// --- Component: The Card Design ---
function Card({ content, align }: { content: ExperienceItem, align: 'left' | 'right' }) {
    return (
        <motion.div 
            whileHover={{ scale: 1.05 }}
            // THEME CHANGE: 
            // Light: White bg, gray border, subtle shadow
            // Dark: Slate-900 bg, slate border, no shadow (or internal glow)
            className={`
                bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm 
                p-6 rounded-xl 
                border border-slate-200 dark:border-slate-800 
                shadow-lg dark:shadow-none
                hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 
                transition-all duration-300
                group cursor-default
            `}
        >
            <span className="text-blue-600 dark:text-blue-400 font-mono text-sm tracking-widest uppercase mb-1 block font-bold">
                {content.date}
            </span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                {content.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-4">
                @ {content.company}
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                {content.description}
            </p>
            
            <div className={`flex flex-wrap gap-2 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
                {content.tech.map((t, i) => (
                    // THEME CHANGE: Light gray badge vs Dark slate badge
                    <span key={i} className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {t}
                    </span>
                ))}
            </div>
        </motion.div>
    )
}