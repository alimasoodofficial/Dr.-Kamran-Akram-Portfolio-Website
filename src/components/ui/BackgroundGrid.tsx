"use client";

import React from "react";
import { cn } from "@/lib/utils"; // optional if you're already using cn()

interface BackgroundGridProps {
  className?: string;
}

const BackgroundGrid: React.FC<BackgroundGridProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 h-full w-full ",
        "bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]",
        "bg-[size:6rem_4rem]",
        className
      )}
    />
  );
};

export default BackgroundGrid;
