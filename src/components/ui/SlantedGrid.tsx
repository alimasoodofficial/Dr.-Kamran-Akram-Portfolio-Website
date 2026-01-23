"use client";

import React, { useEffect, useState, useRef } from "react";

// --- Types ---
interface Achievement {
  id: number;
  value: number; // e.g., 10
  suffix: string; // e.g., "+"
  label: string;
  bgClass: string;
  icon: string; // FontAwesome class
}

// --- 1. Single Digit Component (The Vertical Strip) ---
const OdometerDigit = ({
  digit,
  isVisible,
  delayIndex,
}: {
  digit: string;
  isVisible: boolean;
  delayIndex: number;
}) => {
  // If it's not a number (like a comma), render statically
  if (isNaN(parseInt(digit)))
    return <span className="inline-block">{digit}</span>;

  const target = parseInt(digit);

  // We create a vertical strip of numbers 0-9
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    // Window: distinct height (1em), hidden overflow to show only one number
    <div className="relative inline-block h-[1em] overflow-hidden align-bottom">
      {/* Strip: slides up based on the target number */}
      <div
        className="flex flex-col transition-transform duration-[2000ms] ease-[cubic-bezier(0.2,0,0,1)]"
        style={{
          // Move up by 10% per number (since there are 10 numbers)
          transform: isVisible
            ? `translateY(-${target * 10}%)`
            : "translateY(0)",
          // Add slight stagger delay based on position for extra polish
          transitionDelay: `${delayIndex * 100}ms`,
        }}
      >
        {numbers.map((num) => (
          <span key={num} className="h-[1em] flex items-center justify-center">
            {num}
          </span>
        ))}
      </div>
    </div>
  );
};

// --- 2. Odometer Wrapper (Splits number into digits) ---
const OdometerNumber = ({ value }: { value: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Trigger animation when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Split number into array of strings (e.g. 15 -> ['1', '5'])
  const digits = value.toString().split("");

  return (
    <div ref={ref} className="inline-flex leading-none overflow-hidden">
      {digits.map((digit, index) => (
        <OdometerDigit
          key={index}
          digit={digit}
          isVisible={isVisible}
          delayIndex={index}
        />
      ))}
    </div>
  );
};

// --- 3. Card Component ---
const AchievementCard: React.FC<Achievement> = ({
  value,
  suffix,
  label,
  bgClass,
  icon,
}) => {
  return (
    <div
      className={`
        relative p-8 h-full min-h-[280px] flex flex-col items-center justify-center text-center
        ${bgClass} text-white
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-2xl
        /* Slanted Cut-out Logic */
        [clip-path:polygon(0_0,100%_0,100%_85%,0_100%)]
        hover:[clip-path:polygon(0_0,100%_0,100%_95%,0_100%)]
      `}
    >
      {/* Icon */}
      <div className="mb-4 text-4xl opacity-80">
        <i className={icon}></i>
      </div>

      {/* The Odometer Number + Suffix */}
      <div className="flex items-baseline font-extrabold leading-none mb-3">
        {/* We fix the height here (text-6xl/7xl) so the strip knows 1em = this height */}
        <span className="text-6xl md:text-7xl tracking-tighter flex items-center h-[1em]">
          <OdometerNumber value={value} />
        </span>
        <span className="text-4xl md:text-5xl text-white/80 ml-1 translate-y-[-10%]">
          {suffix}
        </span>
      </div>

      {/* Label */}
      <h3 className="text-lg text-white md:text-xl font-bold uppercase tracking-widest opacity-90">
        {label}
      </h3>

      {/* Decorative Line */}
      <div className="w-12 h-1 bg-white/40 mt-6 rounded-full"></div>
    </div>
  );
};

// --- 4. Main Grid Component ---
const AchievementGrid = () => {
  const achievements: Achievement[] = [
    {
      id: 1,
      value: 10,
      suffix: "+",
      label: "Years of Experience",
      bgClass: "bg-[#064e3b]",
      icon: "fa-solid fa-calendar-check",
    },
    {
      id: 2,
      value: 8,
      suffix: "+",
      label: "Projects Completed",
      bgClass: "bg-[#10b981]",
      icon: "fa-solid fa-list-check",
    },
    {
      id: 3,
      value: 15,
      suffix: "+",
      label: "Courses Taught",
      bgClass: "bg-[#34d399]",
      icon: "fa-solid fa-chalkboard-user",
    },
    {
      id: 4,
      value: 3,
      suffix: "+",
      label: "Volunteer Work",
      bgClass: "bg-[#022c22]",
      icon: "fa-solid fa-hand-holding-heart",
    },
    {
      id: 5,
      value: 7,
      suffix: "+",
      label: "e-Books Published",
      bgClass: "bg-[#10b981]",
      icon: "fa-solid fa-book",
    },
  ];

  return (
    <section className="py-20 px-4 bg-slate-50 dark:bg-gray-900 dark:text-slate-100 ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#10b981] dark:text-[#34d399] font-bold tracking-widest uppercase text-sm">
            Track Record
          </span>
          <h2 className="text-4xl font-heading md:text-5xl font-black text-slate-900 dark:text-slate-100 mt-2">
            Milestones & Impact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-center">
          {achievements.map((item) => (
            <AchievementCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementGrid;
