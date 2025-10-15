import React, { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  showBorder = false,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center font-semibold 
        rounded-xl overflow-hidden cursor-pointer select-none
        ${className}`}
    >
      {/* 🔥 Animated gradient border (optional) */}
      {showBorder && (
        <div
          className="absolute inset-0 animate-gradient"
          style={{
            ...gradientStyle,
            backgroundSize: "300% 100%",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "2px",
          }}
        ></div>
      )}

      {/* ✨ Gradient text */}
      <span
        className="relative z-10 bg-clip-text text-transparent animate-gradient"
        style={{
          ...gradientStyle,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundSize: "300% 100%",
        }}
      >
        {children}
      </span>
    </div>
  );
}
