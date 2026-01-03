import Image, { StaticImageData } from 'next/image';
import React from 'react';

export interface StatItem {
  number: string;
  label: string;
}

interface ProfileStatsSectionProps {
  imageSrc: string | StaticImageData;
  imageAlt: string;
  eyebrowText: string;
  title: string;
  description: string;
  stats: StatItem[];
}

const ProfileStatsSection: React.FC<ProfileStatsSectionProps> = ({
  imageSrc,
  imageAlt,
  eyebrowText,
  title,
  description,
  stats,
}) => {
  return (
    <section className="py-16  overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column: Image */}
          <div className="w-full lg:w-1/3 flex-shrink-0 relative">
           
            <div className="relative w-full max-w-[400px] mx-auto aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-lg">
               <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 400px, 33vw"
                className="object-cover"
                priority // Loads image quickly for above-the-fold content
              />
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="w-full lg:w-2/3 flex flex-col">
            
            {/* Eyebrow with dot icon */}
            <div className="flex items-center space-x-2 mb-4">
               {/* Simple SVG Dot Icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-800">
                <circle cx="8" cy="8" r="3" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="text-sm font-semibold  tracking-wide uppercase">
                {eyebrowText}
              </span>
            </div>

            {/* Main Title */}
            <h2 className="text-3xl font-heading sm:text-4xl lg:text-5xl font-bold  tracking-wide leading-tight mb-6">
              {title}
            </h2>

            {/* Description */}
            <p className="text-lg   leading-relaxed mb-12 max-w-3xl">
              {description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-[#F3F4F1] card rounded-2xl p-6 lg:p-8 flex flex-col justify-center items-start transition-transform hover:-translate-y-1"
                >
                  <span className="text-3xl sm:text-4xl font-extrabold  block mb-2">
                    {stat.number}
                  </span>
                  <span className="text-sm sm:text-base font-medium  leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileStatsSection;