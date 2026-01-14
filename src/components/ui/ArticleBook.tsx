import React from 'react';

interface ArticleBookProps {
  title: string;
  category: string;
  issueNumber?: string | number;
  date?: string;
  summary: string;
  imageUrl: string;
  readTime?: string;
  author?: string;
  className?: string;
  onClick?: () => void;
}

const ArticleBook: React.FC<ArticleBookProps> = ({
  title,
  category,
  issueNumber = '01',
  date = new Date().toLocaleDateString(),
  summary,
  imageUrl,
  readTime = '5 min',
  author,
  className = '',
  onClick,
}) => {
  return (
    // Container: Defines the perspective
    <div 
      className={`group relative w-[150px] h-[225px] md:w-[300px] md:h-[450px] cursor-pointer [perspective:1000px] ${className}`}
      onClick={onClick}
    >
      {/* Book Wrapper: Handles the 3D rotation of the whole unit */}
      <div className="relative w-full h-full transition-transform duration-1000 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-30deg)_translateX(30px)]">
        
        {/* --- THE MOVING COVER (Front & Inner Back) --- */}
        <div className="absolute inset-0 z-20 transition-transform duration-1000 ease-in-out origin-left [transform-style:preserve-3d] group-hover:[transform:rotateY(-150deg)]">
          
          {/* Front of Cover */}
          <div className="absolute inset-0 flex flex-col justify-between p-8 text-white border border-slate-600 rounded-r-md bg-gradient-to-br from-slate-700 to-slate-900 [backface-visibility:hidden] shadow-inner">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <span className="text-[8px] md:text-sm font-mono text-cyan-400 tracking-widest uppercase">
                {date} • {category}
              </span>
            </div>

            {/* Title Card */}
            <div className="mt-4 backdrop-blur-sm bg-white/10 border border-white/20 p-4 rounded-lg">
              <h2 className="text-xs md:text-2xl font-bold font-serif leading-tight mb-2 drop-shadow-md">
                {title}
              </h2>
              <div className="h-1 w-12 bg-cyan-500 rounded" />
              {author && <p className="text-[8px] md:text-xs text-gray-300 mt-2">By {author}</p>}
            </div>

            {/* Footer */}
            <div className="text-right">
              <p className="text-xs text-gray-400 font-mono">Vol. {issueNumber}</p>
            </div>
            
            {/* Lighting overlay for realism */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/10 to-transparent rounded-r-md" />
          </div>

          {/* Back of Cover (The Summary) */}
          <div className="absolute inset-0 flex flex-col justify-center p-8 bg-slate-50 rounded-l-md border-l border-slate-200 text-slate-800 [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-inner">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
              Abstract
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-6">
              {summary}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wide">
                Read Time: {readTime}
              </span>
            </div>
          </div>
        </div>

        {/* --- THE PAGE (Image) --- */}
        <div className="absolute top-1 left-1 w-[calc(100%-8px)] h-[calc(100%-8px)] bg-white rounded-r-md z-10 overflow-hidden shadow-sm border-r border-slate-200">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
          />
          {/* CTA Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 bg-white/90 px-5 py-2 rounded-full text-xs font-bold text-slate-900 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
              Read Article
            </div>
          </div>
        </div>

        {/* --- DECORATIVE ELEMENTS (Spine & Back) --- */}
        
        {/* Actual Back of the whole book (Dark) */}
        <div className="absolute inset-0 bg-slate-900 rounded-r-md z-0 shadow-2xl translate-x-1 translate-y-1" />

        {/* The Spine */}
        <div className="absolute left-0 top-0 h-full w-[40px] bg-slate-800 rounded-l-sm origin-left [transform:rotateY(-90deg)_translateX(-20px)] border-r border-slate-700/50" />
      
      </div>
    </div>
  );
};

export default ArticleBook;