"use client";
import React from "react";
import { useTheme } from "next-themes";

export default function BlobBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const blobColor =
    theme === "dark" ? "rgba(147, 51, 234, 0.3)" : "rgba(59, 130, 246, 0.3)";

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-3xl" style={{ backgroundColor: blobColor }} />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full blur-3xl" style={{ backgroundColor: blobColor }} />
      <div className="absolute bottom-0 left-40 w-[300px] h-[300px] rounded-full blur-3xl" style={{ backgroundColor: blobColor }} />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
