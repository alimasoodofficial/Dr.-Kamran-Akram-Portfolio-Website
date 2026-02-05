"use client";

import dynamic from "next/dynamic";

export const TrueFocus = dynamic(() => import("@/components/ui/TrueFocus"), {
  ssr: false,
});

export const SlantedGrid = dynamic(
  () => import("@/components/ui/SlantedGrid"),
  {
    ssr: false,
  },
);

export const CursorReveal = dynamic(
  () => import("@/components/ui/CursorReveal"),
  {
    ssr: false,
  },
);

export const CircularGallery = dynamic(
  () => import("@/components/ui/CircularGallery"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    ),
  },
);
