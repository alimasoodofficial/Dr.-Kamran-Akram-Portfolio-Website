import React from 'react';
import { TimelineEvent } from '../../data/timelineData';

const TimelineCard: React.FC<TimelineEvent> = ({ date, title, description }) => {
  return (
    // timeline-card-wrapper class is used by the parent to calculate scroll distance
    <div className="timeline-card-wrapper flex-shrink-0 w-[280px] md:w-[350px] flex flex-col items-center">
      
      {/* Date Pill */}
      <div className="mb-6 px-5 py-1.5 border border-white/30 rounded-full text-sm font-medium text-white bg-[#1a332f] z-20">
        {date}
      </div>

      {/* Connection Dot - shadow color must match bg-color to hide the line */}
      <div className="w-3.5 h-3.5 rounded-full bg-[#d4e157] mb-10 z-20 shadow-[0_0_0_8px_#1a332f]" />

      {/* White Content Card */}
      <div className="w-full bg-white rounded-xl p-8 h-[320px] md:h-[350px] flex flex-col shadow-2xl text-left">
        <h3 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
};

export default TimelineCard;