"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundGridProps {
  className?: string;
}

const BackgroundGrid: React.FC<BackgroundGridProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 h-full w-full",
        // Light theme: white background
        "bg-white dark:bg-black",
        // Grid pattern
        // Light mode: Faint grey lines (#f0f0f0)
        "bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]",
        
        // Dark mode: CHANGED from #ffffff (solid white) to rgba(255,255,255,0.1) (transparent white)
        // This prevents the grid from overpowering the orange glow
        "dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]",
        
        "bg-[size:6rem_4rem]",
        className,
      )}
    >
      {/* Radial gradient overlay */}
      {/* Added pointer-events-none to prevent blocking clicks */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#ffb347,transparent)]" />
    </div>
  );
};

export default BackgroundGrid;