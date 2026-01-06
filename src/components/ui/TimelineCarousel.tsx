"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { timelineData } from '../../data/timelineData';
import TimelineCard from './timelineCard';



const TimelineCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDistance, setSlideDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate exact move distance: Card Width + Tailwind Gap (gap-8 = 32px)
  useEffect(() => {
    const calculateDistance = () => {
      if (containerRef.current) {
        const card = containerRef.current.querySelector('.timeline-card-wrapper');
        if (card) {
          const width = card.getBoundingClientRect().width;
          setSlideDistance(width + 32); 
        }
      }
    };

    calculateDistance();
    window.addEventListener('resize', calculateDistance);
    return () => window.removeEventListener('resize', calculateDistance);
  }, []);

  const next = () => {
    if (currentIndex < timelineData.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div className="w-full bg-[#1a332f] min-h-screen">
      
      {/* 1. Hero Image Section */}
      <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" 
          alt="Team collaboration" 
          className="w-full h-full object-cover brightness-90"
        />
        {/* Subtle overlay to blend image into background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a332f]/40" />
      </div>

      {/* 2. Timeline Carousel Section */}
      <div className="relative py-16 md:py-24 overflow-hidden" ref={containerRef}>
        
        {/* The Horizontal Line (Centered behind dots) */}
        <div className="absolute top-[102px] md:top-[118px] left-0 right-0 h-[1px] bg-white/20 z-0" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
          
          {/* Navigation Buttons */}
          <div className="absolute top-[12px] md:top-[28px] left-0 right-0 z-30 flex justify-between pointer-events-none px-4 md:px-0">
            <button 
              onClick={prev}
              disabled={currentIndex === 0}
              className="pointer-events-auto w-10 h-10 rounded-full bg-[#d4e157] flex items-center justify-center disabled:opacity-20 transition-all hover:scale-110 active:scale-90 shadow-lg"
            >
              <ChevronLeft size={20} className="text-[#1a332f]" strokeWidth={3} />
            </button>
            <button 
              onClick={next}
              disabled={currentIndex === timelineData.length - 1}
              className="pointer-events-auto w-10 h-10 rounded-full bg-[#d4e157] flex items-center justify-center disabled:opacity-20 transition-all hover:scale-110 active:scale-90 shadow-lg"
            >
              <ChevronRight size={20} className="text-[#1a332f]" strokeWidth={3} />
            </button>
          </div>

          {/* Sliding Track Area */}
          <div className="relative z-10 w-9/12">
            <motion.div 
              className="flex  gap-8"
              animate={{ x: -(currentIndex * slideDistance) }}
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
            >
              {timelineData.map((item) => (
                <TimelineCard key={item.id} {...item} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineCarousel;