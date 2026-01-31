import React from "react";

// --- Types ---
interface BentoCardProps {
  title: string;
  description: string;
  icon: string; // FontAwesome class string (e.g., "fa-solid fa-graduation-cap")
  spanClass?: string; // Grid span logic (e.g., "col-span-1 md:col-span-2")
  bgClass: string; // Tailwind background color class
  accentColor: string; // Hex or Tailwind text color class for the icon/hover

  // Props passed down from parent for consistent styling
  headingClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
}

interface ConsultationGridProps {
  containerClassName?: string;
  headingClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
}

// --- Child Component: Individual Bento Card ---
const BentoCard: React.FC<BentoCardProps> = ({
  title,
  description,
  icon,
  spanClass = "col-span-1",
  bgClass,
  accentColor,
  headingClassName,
  descriptionClassName,
  iconClassName,
}) => {
  return (
    <div
      className={`
        ${spanClass} ${bgClass}
        relative overflow-hidden rounded-3xl border border-slate-100 p-8 shadow-[0_4px_15px_rgba(0,0,0,0.02)]
        dark:border-white/10 dark:shadow-[0_4px_15px_rgba(0,0,0,0.2)]
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:-translate-y-2 hover:border-slate-200 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]
        dark:hover:border-white/20 dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]
        group flex flex-col justify-between
        /* Floating Circle Decoration via Tailwind arbitrary values */
        after:content-[''] after:absolute after:-bottom-5 after:-right-5 after:w-20 after:h-20 
        after:bg-current after:opacity-[0.05] after:rounded-full after:pointer-events-none
      `}
      // We apply the accent color dynamically to the text/icon wrapper
      style={{ color: accentColor }}
    >
      <div>
        <i
          className={`
            ${icon} ${iconClassName}
            mb-5 block text-3xl transition-transform duration-300 ease-in-out
            group-hover:scale-110 group-hover:-rotate-3
          `}
        />
        <div className={`mb-2.5 text-xl font-bold  ${headingClassName}`}>
          {title}
        </div>
        <p
          className={`text-[0.95rem] leading-relaxed text-slate-600 dark:text-white/70 ${descriptionClassName}`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

// --- Main Parent Component ---
const ConsultationGrid: React.FC<ConsultationGridProps> = ({
  containerClassName = "max-w-7xl mx-auto px-5 py-16",
  headingClassName = "",
  descriptionClassName = "",
  iconClassName = "",
}) => {
  // Data Definition
  const gridItems = [
    {
      title: "Academic Strategy",
      description:
        "Learn how to shortlist high-ranking universities and identify research supervisors who align with your PhD or Master's goals.",
      icon: "fa-solid fa-graduation-cap",
      bgClass: "bg-[#f0f7ff] dark:bg-blue-950/90", // Light Blue
      accentColor: "#2563eb", // Blue-600
      spanClass: "col-span-1 lg:col-span-2",
    },
    {
      title: "Scholarships",
      description:
        "Funding opportunities, eligibility criteria, and exactly how much support you can expect.",
      icon: "fa-solid fa-award",
      bgClass: "bg-[#fdf2f8] dark:bg-rose-950/90", // Light Rose
      accentColor: "#f43f5e", // Rose-500
      spanClass: "col-span-1",
    },
    {
      title: "Financial Planning",
      description:
        "Prepare a realistic monthly budget for living, rent, and transport in major Australian cities.",
      icon: "fa-solid fa-piggy-bank",
      bgClass: "bg-[#ecfdf5] dark:bg-emerald-950/90", // Light Green
      accentColor: "#10b981", // Emerald-500
      spanClass: "col-span-1",
    },
    {
      title: "Relocation Guide",
      description:
        "Essential checklist: what to pack, document folders, and first-week essentials for new students.",
      icon: "fa-solid fa-plane-arrival",
      bgClass: "bg-[#fffbeb] dark:bg-amber-950/90", // Light Amber
      accentColor: "#f59e0b", // Amber-500
      spanClass: "col-span-1",
    },
    {
      title: "Jobs & Survival",
      description:
        "How to find part-time work and secure student-friendly accommodation before or after you land.",
      icon: "fa-solid fa-briefcase",
      bgClass: "bg-[#f5f3ff] dark:bg-violet-950/90", // Light Violet
      accentColor: "#8b5cf6", // Violet-500
      spanClass: "col-span-1",
    },
    {
      title: "Career & Brand Building",
      description:
        "Optimize your LinkedIn profile, build a research portfolio, and identify the certifications that make you job-ready in the Australian market.",
      icon: "fa-solid fa-chart-line",
      bgClass: "bg-[#fafaf9] dark:bg-stone-900/90", // Light Stone
      accentColor: "#06b6d4", // Cyan-500
      spanClass: "col-span-1 lg:col-span-2",
    },
  ];

  return (
    <section className={containerClassName}>
      {/* Responsive Grid Logic:
        - Default: 1 column (grid-cols-1)
        - Medium screens (md): 2 columns
        - Large screens (lg): 4 columns
      */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {gridItems.map((item, index) => (
          <BentoCard
            key={index}
            {...item}
            headingClassName={headingClassName}
            descriptionClassName={descriptionClassName}
            iconClassName={iconClassName}
          />
        ))}
      </div>
    </section>
  );
};

export default ConsultationGrid;
