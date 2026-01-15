"use client";
import Image from "next/image";

import { useState } from "react";

interface Skill {
  name: string;
  logo: string;
}

interface LogoCarouselProps {
  items: Skill[];
  speed?: number; // Speed in seconds
  size?: number; // Icon size (px)
  containerSize?: number; // Circle size (px)
  direction?: "left" | "right";
  mobileSize?: number; // Icon size on mobile
  mobileContainerSize?: number; // Circle size on mobile
}

const LogoCarousel = ({
  items,
  speed = 40,
  size = 40,
  containerSize = 80,
  mobileSize = 32,
  mobileContainerSize = 64,
  direction = "left",
}: LogoCarouselProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const animationClass =
    direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

  // 1. Triple/Quadruple items to ensure the strip is wider than any screen (1920px+)
  //    This prevents the "empty space" glitch at the end of the loop.
  const seamlessItems = [...items, ...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-10 bg-transparent">
      {/* 2. Gradient Overlays for smooth entry/exit */}
      <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />

      {/* 3. The Animated Container */}
      <div
        className="flex w-max"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex w-max ${animationClass}`}
          style={{
            animationDuration: `${speed}s`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {seamlessItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              // 4. Using Margin Right (mr-8) instead of gap ensures
              //    mathematically perfect distribution for the loop.
              className="flex-shrink-0 mr-8 md:mr-12"
            >
              <div
                style={{
                  width: `${mobileContainerSize}px`,
                  height: `${mobileContainerSize}px`,
                }}
                className=" rounded-full bg-white shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center transition-transform duration-300 hover:scale-110"
              >
                <div
                  className="relative"
                  style={{
                    width: `${mobileSize}px`,
                    height: `${mobileSize}px`,
                  }}
                >
                  <Image
                    src={item.logo || "/images/dummy.webp"}
                    alt={item.name}
                    fill
                    sizes={`${mobileSize}px`}
                    className="object-contain "
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel;
