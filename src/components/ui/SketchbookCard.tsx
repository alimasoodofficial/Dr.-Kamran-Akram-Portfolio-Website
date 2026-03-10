"use client";

import React from "react";
import Image from "next/image";

interface SketchbookCardProps {
  id: string | number;
  title: string;
  category: string;
  date?: string;
  summary: string;
  imageUrl: string;
  author?: string;
  issueNumber?: string | number;
  readTime?: string;
  isOpen: boolean;
  onToggle: (id: string | number) => void;
  onRead: () => void;
}

const SketchbookCard: React.FC<SketchbookCardProps> = ({
  id,
  title,
  category,
  date = new Date().toLocaleDateString(),
  summary,
  imageUrl,
  author,
  readTime = "5 min",
  isOpen,
  onToggle,
  onRead,
}) => {
  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(id);
  };

  const handleReadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRead();
  };

  return (
    <div className="relative w-full max-w-[320px] aspect-[3/4] group select-none">
      <div className="perspective-1500 w-full h-full">
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-in-out cursor-pointer [transform-style:preserve-3d] ${
            isOpen ? "open" : ""
          }`}
          onClick={handleInteraction}
        >
          {/* Bottom Page (Content) */}
          <div className="absolute inset-0 bg-[#fdfaf3] rounded-2xl shadow-inner p-6 flex flex-col justify-between border border-slate-200 overflow-hidden">
            <div className="relative z-10 flex flex-col h-full">
              <div className="">
                <span className="text-sm uppercase tracking-widest text-[#E67E22] font-bold">
                  Abstract
                </span>
                <p className="text-slate-600 text-justify  text-xs line-clamp-6 mb-4  leading-relaxed">
                "{summary}"
              </p>
              </div>

              <div className="relative flex-1 w-full min-h-[140px] mb-4 overflow-hidden rounded-xl shadow-md border border-slate-100">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>

              

              <button
                onClick={handleReadClick}
                className="w-full bg-[#34495E] text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:bg-[#2C3E50] transition-colors active:scale-95 transform duration-200"
              >
                Continue Reading
              </button>
            </div>

            {/* Page Binding Detail */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-200/50 rounded-l-2xl border-r border-slate-300/30" />
          </div>

          {/* Top Page (Cover) */}
          <div className="top-page absolute inset-0 bg-[#16293c] rounded-2xl flex flex-col justify-between p-8 cursor-pointer shadow-2xl border-l-[12px] border-[#1A252F] z-20 origin-left transition-transform duration-700 ease-in-out [backface-visibility:hidden]">
            {/* Cover Design Elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" />

            <div className="relative z-10">
              <div className="w-12 h-1 bg-[#E67E22] mb-4" />
              <div className="space-y-1">
                <span className="text-[#E67E22] font-mono text-xs tracking-[0.2em]">
                  {category}
                </span>
                <h2 className="text-md font-inter font-bold text-justify !text-white">
                  {title}
                </h2>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-end justify-between border-t border-white/10 pt-4">
              <div className="text-orange-400">
                <p className="text-[10px] uppercase tracking-widest mb-1">
                  Author
                </p>
                <p className="text-[10px] font-light text-white/90">
                  {author || "Unknown"}
                </p>
              </div>
              <div className="text-right text-white/40">
                <p className="text-[10px] font-mono">{date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1500 {
          perspective: 1500px;
        }

        .open .top-page {
          transform: rotateY(-110deg);
        }

        .top-page {
          box-shadow: 20px 0 50px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default SketchbookCard;
