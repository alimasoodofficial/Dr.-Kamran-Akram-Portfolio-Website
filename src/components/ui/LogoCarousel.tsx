import React from "react";

interface Skill {
  name: string;
  icon: string;
}

interface LogoCarouselProps {
  items: Skill[];
  speed?: number;      // Speed in seconds (e.g., 20 for fast, 60 for slow)
  size?: number;       // Size in pixels for the icon (e.g., 40, 64)
  direction?: "left" | "right"; 
}

const LogoCarousel = ({ 
  items, 
  speed = 50, 
  size = 64, 
  direction = "left" 
}: LogoCarouselProps) => {
  
  const animationClass = direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

  return (
    <div className="relative overflow-hidden w-full  py-8">
      {/* Gradient Fades for a professional edge-to-edge look */}
      {/* <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-secondary to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-secondary to-transparent z-10"></div> */}

      {/* The Scrolling Container */}
      <div 
        className={`${animationClass} flex w-max hover:[animation-play-state:paused]`}
        style={{ 
          animationDuration: `${speed}s`,
        }}
      >
        {/* Doubling items for a seamless loop */}
        {[...items, ...items].map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex-shrink-0 rounded-2xl mx-6 p-4 bg-background border-2 border-primary shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center"
          >
            <img
              src={item.icon || "/placeholder-logo.png"} // Fallback if icon is missing
              alt={item.name}
              style={{ width: `${size}px`, height: `${size}px` }}
              className="object-contain"
            />
            {/* Optional: Add name below icon if it's a niche startup logo */}
            <span className="text-[10px] mt-2 font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity">
               {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoCarousel;