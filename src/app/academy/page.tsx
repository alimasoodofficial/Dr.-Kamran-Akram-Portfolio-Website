"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GradientText from "@/components/ui/GradientText";

export default function AcademyComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-center px-6">
      <h1 className="text-7xl md:text-9xl font-heading font-black tracking-tighter mb-12">
        <GradientText colors={["#10b981", "#064e3b", "#34d399"]}>
          COMING SOON
        </GradientText>
      </h1>
      
      <Link 
        href="/"
        className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-white/5 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Return to Home
      </Link>
    </div>
  );
}
