import React from 'react';

// --- Types ---

interface TimelineStep {
  title: string;
  description: string;
  icon: string; // FontAwesome class string
}

interface ProcessTimelineProps {
  
  badgeText?: string;
  steps: TimelineStep[];
  
  // Optional Style Overrides
  containerClassName?: string;
  accentColorClass?: string; // e.g., 'text-blue-600'
  accentBgClass?: string;    // e.g., 'bg-blue-100'
}

// --- Child Component: Individual Timeline Item ---

const TimelineItem: React.FC<{
  step: TimelineStep;
  index: number;
  accentColorClass: string;
  accentBgClass: string;
}> = ({ step, index, accentColorClass, accentBgClass }) => {
  
  // Determine if the item is on the Left or Right (Desktop view)
  const isLeft = index % 2 === 0;

  return (
    <div
      className={`
        group relative w-full md:w-1/2 mb-8
        /* Mobile: Always align right of the line */
        pl-12 md:pl-0
        /* Desktop: Alternate sides */
        ${isLeft ? 'md:mr-auto md:pr-12 md:text-right' : 'md:ml-auto md:pl-12 md:text-left'}
        /* Animation Entry */
        opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]
      `}
      style={{ animationDelay: `${(index + 1) * 0.2}s` }}
    >
      {/* Center Bubble (The Dot on the Line) */}
      <div
        className={`
          absolute top-10 w-6 h-6 bg-white  rounded-full border-4 shadow-[0_0_0_5px_rgba(219,234,254,1)] z-10
          /* Mobile Position */
          left-[1.6rem]
          /* Desktop Position: Center line */
          md:left-auto
          ${isLeft ? 'md:-right-3' : 'md:-left-3'}
          border-current ${accentColorClass}
        `}
      ></div>

      {/* Content Card */}
      <div
        className={`
          relative light:bg-white dark:card  p-8 rounded-3xl dark:border-gray-700 dark:border shadow-[0_10px_25px_rgba(0,0,0,0.05)]  
          transition-all duration-300 ease-in-out
          hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(37,99,235,0.1)]
        `}
      >
        {/* Icon Box */}
        <div
          className={`
            inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl text-2xl
            ${accentBgClass} ${accentColorClass}
          `}
        >
          <i className={step.icon}></i>
        </div>

        {/* Text */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {step.title}
        </h3>
        <p className="text-[0.95rem] text-slate-500 dark:text-slate-400 leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
};

// --- Main Parent Component ---

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
 
  steps,
  containerClassName = "w-full mx-auto px-5 py-20",
  accentColorClass = "text-blue-600",
  accentBgClass = "bg-blue-100",
}) => {
  return (
    <section className={` flex items-center justify-center w-full ${containerClassName}`}>
      
      {/* Header Section */}
     

      {/* Timeline Container */}
      <div className="relative  mx-auto">
        
        {/* Vertical Center Line */}
        <div 
            className="absolute top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#fdf2e9] via-[#04ec8f] to-[#e9fdf2] rounded-full
            /* Mobile: Shift line to the left */
            left-8 
            /* Desktop: Center the line */
            md:left-1/2 md:-ml-[3px]"
        ></div>

        {/* Steps Loop */}
        <div className="flex flex-col w-full">
          {steps.map((step, index) => (
            <TimelineItem
              key={index}
              index={index}
              step={step}
              accentColorClass={accentColorClass}
              accentBgClass={accentBgClass}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProcessTimeline;