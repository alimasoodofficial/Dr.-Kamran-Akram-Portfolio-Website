"use client";

import React from "react";
import Image from "next/image";

interface PhotoProps {
  src: string;
  alt: string;
  index: number;
}

const HangingPhoto: React.FC<PhotoProps> = ({ src, alt, index }) => {
  // Logic to vary rotation and vertical offset based on index
  const rotations = [-5, 3, -2, 6];
  // Offsets adjusted so the photos hang relative to the new string position
  const offsets = [5, 25, 30, 10];

  const rotation = rotations[index % rotations.length];
  const offset = offsets[index % offsets.length];

  const handleSwing = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.animate(
      [
        { transform: `rotate(${rotation}deg) translateY(${offset}px)` },
        { transform: `rotate(${rotation + 4}deg) translateY(${offset}px)` },
        { transform: `rotate(${rotation - 4}deg) translateY(${offset}px)` },
        { transform: `rotate(${rotation}deg) translateY(${offset}px)` },
      ],
      {
        duration: 600,
        easing: "ease-in-out",
      },
    );
  };

  return (
    <div
      onClick={handleSwing}
      className="relative bg-white p-1.5 pb-5 shadow-lg cursor-pointer transition-transform hover:scale-105 hover:z-50"
      style={{
        width: "110px",
        transform: `rotate(${rotation}deg) translateY(${offset}px)`,
        transformOrigin: "top center",
      }}
    >
      {/* The Clip - Positioned to touch the string at its dip */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-7 bg-gray-200/90 border border-gray-400 rounded-sm z-10 shadow-sm">
        <div className="absolute inset-0 bg-white/50 blur-[1px]"></div>
      </div>

      <div className="relative w-full h-24 overflow-hidden bg-gray-100">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    </div>
  );
};

export default function HangingGallery({
  images,
}: {
  images: { url: string; alt: string }[];
}) {
  return (
    /* The main container (Banner) starts here */
    <div className="relative w-full max-w-5xl h-[250px] mx-auto overflow-hidden">
      {/* Hanging String SVG - Attached to top: 0 */}
      <svg
        className="absolute top-0 left-0 w-full h-32 pointer-events-none"
        viewBox="0 0 800 100"
        preserveAspectRatio="none"
      >
        {/* M0,0 connects the path to the very top-left corner */}
        <path
          d="M0,0 Q400,100 800,0"
          stroke="#555"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Photos Container - Adjusted pt (padding-top) to align clips with the curve */}
      <div className="flex justify-around items-start pt-8 px-10 relative z-10">
        {images.slice(0, 4).map((img, i) => (
          <div key={i} className={i >= 2 ? "hidden md:block" : ""}>
            <HangingPhoto src={img.url} alt={img.alt} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
