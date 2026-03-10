"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Search,
  ArrowUpRight,
} from "lucide-react";

// 1. Define the interface for the sub-component props
interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}

export default function AboutMegaMenu() {
  return (
    <div className="group relative px-3 py-2">
      {/* Trigger Link */}
      <Link
        href="/about"
        className="flex items-center gap-1 font-medium hover:text-[#E67E22] transition-colors"
      >
        About
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mt-0.5 transition-transform group-hover:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Link>

      {/* Dropdown Container */}
      <div className="absolute top-full -left-20 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-50">
        <div className="w-[850px] bg-white dark:bg-[#1a1b26] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-2 flex overflow-hidden">
          
          {/* Left Column: Grid */}
          <div className="flex-1 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
              About Dr. Kamran
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <MenuItem
                href="/about/story"
                icon={<BookOpen size={20} />}
                title="My Story"
                desc="A life shaped by purpose"
              />
              <MenuItem
                href="/about/education"
                icon={<GraduationCap size={20} />}
                title="Education"
                desc="Learning that fuels growth"
              />
              <MenuItem
                href="/about/experience"
                icon={<Users size={20} />}
                title="Experience"
                desc="Real work solving problems"
              />
              <MenuItem
                href="/about/certificates"
                icon={<Award size={20} />}
                title="Certificates"
                desc="Milestones of learning"
              />
              <MenuItem
                href="/about/research"
                icon={<Search size={20} />}
                title="Research"
                desc="Knowledge built by inquiry"
              />
            </div>
          </div>

          {/* Right Column: CTA */}
          <div className="w-[280px] bg-[#1C2B2D] rounded-xl p-8 flex flex-col justify-center items-center text-center text-white ml-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

            <h4 className="text-xl font-bold leading-tight mb-6 relative z-10">
              Every <span className="text-gray-300">Great Project</span> Begins
              With a <span className="text-[#D4F250]">Conversation</span>
            </h4>

            <Link
              href="/contact"
              className="relative z-10 bg-[#D4F250] hover:bg-[#c2e040] text-black text-sm font-bold py-3 px-5 rounded-full flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              Work With Me
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Typed Helper Component
const MenuItem = ({ icon, title, desc, href }: MenuItemProps) => (
  <Link
    href={href}
    className="flex flex-col gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group/item"
  >
    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 group-hover/item:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">
        {title}
      </h4>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
        {desc}
      </p>
    </div>
  </Link>
);