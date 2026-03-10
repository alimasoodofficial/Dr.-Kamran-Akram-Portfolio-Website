"use client";

import { useRef } from "react";

const RADIUS = 120;

const CursorReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topImageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current || !topImageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    topImageRef.current.style.setProperty("--x", `${x}px`);
    topImageRef.current.style.setProperty("--y", `${y}px`);
    topImageRef.current.style.setProperty("--size", `${RADIUS}px`);
  };

  const handleMouseLeave = () => {
    if (!topImageRef.current) return;
    topImageRef.current.style.setProperty("--size", `0px`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center"
    >
      {/* Bottom image */}
      <img
        src="/images/wordcloud.png"
        alt="Word Cloud"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10 Scard"
      />

      {/* Top image (masked) */}
      <img
        ref={topImageRef}
        src="/images/original.png"
        alt="Original"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-20 mask-effect Scard"
      />
    </div>
  );
};

export default CursorReveal;
