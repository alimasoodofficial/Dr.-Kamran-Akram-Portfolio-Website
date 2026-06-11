"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

type Ebook = {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  file_url?: string;
};

const FlipbookClient = dynamic(() => import("./FlipbookClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-slate-500">
      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      <p className="font-semibold text-slate-600 dark:text-slate-400">Loading reader interface...</p>
    </div>
  ),
});

interface FlipbookWrapperProps {
  ebook: Ebook;
}

export default function FlipbookWrapper({ ebook }: FlipbookWrapperProps) {
  return <FlipbookClient ebook={ebook} />;
}
