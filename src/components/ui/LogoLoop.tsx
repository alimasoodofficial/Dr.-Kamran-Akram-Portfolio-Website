"use client";
import React, { useMemo } from "react";
import Image from "next/image";

export type LogoItem =
  | { node: React.ReactNode; href?: string; title?: string }
  | { src: string; alt?: string; href?: string; title?: string };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number; // Higher is slower (duration in seconds)
  direction?: "left" | "right";
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  className?: string;
}

export const LogoLoop = ({
  logos,
  speed = 40,
  direction = "left",
  gap = 40,
  pauseOnHover = true,
  fadeOut = true,
  className,
}: LogoLoopProps) => {
  // We double the logos to ensure the loop is seamless
  const duplicatedLogos = useMemo(() => [...logos, ...logos], [logos]);

  return (
    <div
      className={`group relative overflow-hidden flex ${className}`}
      style={{
        maskImage: fadeOut
          ? "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
          : "none",
        WebkitMaskImage: fadeOut
          ? "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
          : "none",
      }}
    >
      <div
        className={`flex min-w-full shrink-0 items-center justify-around animate-marquee ${
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
        }`}
        style={{
          gap: `${gap}px`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          animationDuration: `${speed}s`,
        }}
      >
        {duplicatedLogos.map((logo, idx) => (
          <div key={idx} className="flex shrink-0 items-center justify-center">
            {"node" in logo ? (
              logo.node
            ) : (
              <Image
                src={logo.src}
                alt={logo.alt || ""}
                width={120}
                height={48}
                unoptimized
                className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
