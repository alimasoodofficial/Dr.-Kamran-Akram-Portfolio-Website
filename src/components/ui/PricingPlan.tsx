"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check, MessageCircle, Zap, Star, GraduationCap } from "lucide-react";

interface PricingFeature {
  text: string;
}

interface PricingTier {
  name: string;
  subtitle: string;
  price: string;
  unit: string;
  features: string[];
  buttonText: string;
  icon: React.ReactNode;
  popular?: boolean;
}

const pricingData: PricingTier[] = [
  {
    name: "Quick Chat",
    subtitle: "Introduction & Fast Q&A",
    price: "$0",
    unit: "/call",
    icon: <MessageCircle className="w-6 h-6 text-teal-600" />,
    features: ["5-minute call", "Intro session"],
    buttonText: "Select Plan",
  },
  {
    name: "Quick-Fire",
    subtitle: "Students & Professionals",
    price: "$60",
    unit: "/session",
    icon: <Zap className="w-6 h-6 text-teal-600" />,
    features: ["30-min video call", "Document review (1)", "Summary email"],
    buttonText: "Select Plan",
  },
  {
    name: "Deep-Dive",
    subtitle: "Strategic Career Moves",
    price: "$110",
    unit: "/session",
    popular: true,
    icon: <Star className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
    features: ["60-min detailed call", "Review of 2 docs", "Action checklist"],
    buttonText: "Book Now",
  },
  {
    name: "Mentorship",
    subtitle: "Master's & PhD Path",
    price: "$450",
    unit: "/month",
    icon: <GraduationCap className="w-6 h-6 text-teal-600" />,
    features: ["5x 1-hour sessions", "Unlimited email Q&A", "Final Roadmap"],
    buttonText: "Select Plan",
  },
];

const PricingCard = ({ tier }: { tier: PricingTier }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative flex flex-col p-8 rounded-[2.5rem] w-full max-w-[320px] transition-all duration-300 shadow-xl shadow-teal-500/10 hover:shadow-2xl hover:shadow-teal-500/30 ${
        tier.popular
          ? "bg-[#134e4a] text-white border-4 border-teal-500/50 scale-105 z-10"
          : "bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FFD600] text-black px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
          Most Popular
        </div>
      )}

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm ${
          tier.popular ? "bg-white/10" : "bg-teal-50 dark:bg-teal-900/20"
        }`}
      >
        {tier.icon}
      </div>

      {/* Title */}
      <h3 className={`text-2xl font-black mb-1 ${tier.popular ? '!text-white' : 'text-slate-900 dark:text-white'}`}>
        {tier.name}
      </h3>
      <p
        className={`text-sm mb-8 font-medium ${
          tier.popular ? "text-teal-200" : "text-slate-400"
        }`}
      >
        {tier.subtitle}
      </p>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-4xl font-black">{tier.price}</span>
        <span
          className={`text-sm font-medium ${
            tier.popular ? "text-teal-200/60" : "text-slate-400"
          }`}
        >
          {tier.unit}
        </span>
      </div>

      {/* Features */}
      <div className="flex-grow space-y-4 mb-10">
        {tier.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                tier.popular ? "bg-[#FFD600] text-black" : "bg-teal-600 text-white"
              }`}
            >
              <Check className="w-3 h-3 stroke-[4]" />
            </div>
            <span
              className={`text-sm font-medium ${
                tier.popular ? "text-teal-50" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        className={`w-full py-4 rounded-2xl font-black transition-all duration-300 ${
          tier.popular
            ? "bg-white text-[#134e4a] hover:bg-[#FFD600] hover:text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
            : "border-2 border-slate-100 dark:border-slate-800 hover:border-teal-600 hover:text-teal-600 dark:hover:text-teal-400 dark:hover:border-teal-400"
        }`}
      >
        {tier.buttonText}
      </button>
    </motion.div>
  );
};

export function PricingPlanDemo() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-16 px-4 md:px-0">
        <div className="inline-block bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-4 py-2 rounded-xl text-sm font-black tracking-wide mb-6">
           Consultation Packages
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white">
          Choose Your Consultation Package
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Pick the support level that fits your time and budget. Professional guidance tailored to your needs.
        </p>
      </div>

      <div className="flex justify-center gap-6 md:gap-6 mx-auto">
        {pricingData.map((tier, index) => (
          <PricingCard key={index} tier={tier} />
        ))}
      </div>
    </div>
  );
}
