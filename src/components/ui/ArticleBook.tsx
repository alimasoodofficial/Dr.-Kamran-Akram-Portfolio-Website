import React, { MouseEvent } from 'react';

interface ArticleBookProps {
  id: string | number; // Added ID to track specific book
  title: string;
  category: string;
  issueNumber?: string | number;
  date?: string;
  summary: string;
  imageUrl: string;
  readTime?: string;
  author?: string;
  className?: string;
  isOpen: boolean; // Controlled state
  onToggle: (id: string | number) => void; // Trigger to open/close
  onRead: () => void; // Actual navigation action
}

const ArticleBook: React.FC<ArticleBookProps> = ({
  id,
  title,
  category,
  issueNumber = '01',
  date = new Date().toLocaleDateString(),
  summary,
  imageUrl,
  readTime = '5 min',
  author,
  className = '',
  isOpen,
  onToggle,
  onRead,
}) => {
  
  // Handle the interaction logic
  const handleInteraction = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent closing when clicking the book itself
    onToggle(id);
  };

  const handleReadClick = (e: MouseEvent) => {
    e.stopPropagation();
    onRead();
  };

  // Base rotation classes
  const containerRotation = isOpen 
    ? "[transform:rotateY(-30deg)_translateX(30px)] ms-10 lg:ms-0" 
    : "";
    
  const coverRotation = isOpen 
    ? "[transform:rotateY(-150deg)]" 
    : "";

  const imageScale = isOpen 
    ? "grayscale-0 scale-110" 
    : "grayscale";

  const buttonOpacity = isOpen 
    ? "opacity-100 translate-y-0" 
    : "opacity-0 translate-y-4";

  return (
    <div 
      className={`relative w-[150px] h-[450px] md:w-[350px] md:h-[500px] cursor-pointer  ${className}`}
      onClick={handleInteraction}
    >
      {/* Book Wrapper */}
      <div className={`relative w-full h-full transition-transform duration-1000 ease-in-out [transform-style:preserve-3d] ${containerRotation}`}>
        
        {/* --- THE MOVING COVER --- */}
        <div className={`absolute inset-0 z-20 transition-transform duration-1000 ease-in-out origin-left [transform-style:preserve-3d] ${coverRotation}`}>
          
          {/* Front of Cover */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-8 text-white border border-slate-600 rounded-r-md bg-gradient-to-br from-slate-700 to-slate-900 [backface-visibility:hidden] shadow-inner">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <span className="text-[8px] md:text-xs font-mono text-cyan-400 tracking-widest uppercase">
                {date} • {category}
              </span>
            </div>

            {/* Title Card */}
            <div className="mt-4 backdrop-blur-sm bg-white/10 border border-white/20 p-2 md:p-4 rounded-lg">
              <h3 className="text-[10px] md:text-xs font-inter font-bold   leading-relaxed mb-2 drop-shadow-md">
                {title}
              </h3>
              <div className="h-1 w-8 md:w-12 bg-cyan-500 rounded" />
              {author && <p className="text-[8px] md:text-xs text-gray-300 mt-2">By {author}</p>}
            </div>

            {/* Footer */}
            <div className="text-right">
              {/* <p className="text-[10px] md:text-xs text-gray-400 font-mono">Vol. {issueNumber}</p> */}
            </div>
            
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/10 to-transparent rounded-r-md" />
          </div>

          {/* Back of Cover (Summary) */}
          <div className="absolute inset-0 flex flex-col justify-center p-4 md:p-8 bg-slate-50 rounded-l-md border-l border-slate-200 text-slate-800 [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-inner">
            <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-2 md:mb-4 border-b border-slate-200 pb-2">
              Abstract
            </h3>
            <p className="text-slate-600 text-[10px] md:text-xs text-justify leading-relaxed mb-4 md:mb-6 line-clamp-15">
              {summary}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-[10px] md:text-xs font-bold text-cyan-700 uppercase tracking-wide">
                {/* {readTime} */}
                 <button 
              onClick={handleReadClick}
              className={`bg-[#E67E22] px-5 py-2 rounded-full text-xs font-bold text-white shadow-xl transform transition-all duration-500 delay-100 hover:bg-[#D35400] hover:text-white ${buttonOpacity}`}
            >
              Read More
            </button>

              </span>
            </div>
          </div>
        </div>

        {/* --- THE PAGE (Image & Button) --- */}
        <div className="absolute top-1 left-1 w-[calc(100%-8px)] h-[calc(100%-8px)] bg-white rounded-r-md z-10 overflow-hidden shadow-sm border-r border-slate-200">
          <img 
            src={imageUrl} 
            alt={title} 
            className={`w-full px-7 h-full object-contain object-center transition-all duration-700 ${imageScale}`}
          />
          {/* CTA Overlay - Only clickable when open */}
          <div className={`absolute inset-0 bg-black/10 transition-colors flex items-center justify-center ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <button 
              onClick={handleReadClick}
              className={`bg-[#E67E22] px-5 py-2 rounded-full text-xs font-bold text-white shadow-xl transform transition-all duration-500 delay-100 hover:bg-[#D35400] hover:text-white ${buttonOpacity}`}
            >
              Read Article
            </button>
          </div>
        </div>

        {/* --- SPINE & BACK --- */}
        <div className="absolute inset-0 bg-slate-900 rounded-r-md z-0 shadow-2xl translate-x-1 translate-y-1" />
        <div className="absolute left-0 top-0 h-full w-[20px] md:w-[40px] bg-slate-800 rounded-l-sm origin-left [transform:rotateY(-90deg)_translateX(-10px)] md:[transform:rotateY(-90deg)_translateX(-20px)] border-r border-slate-700/50" />
      
      </div>
    </div>
  );
};

export default ArticleBook;