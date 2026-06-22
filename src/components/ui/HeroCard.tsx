import Link from "next/link";
import { ReactNode } from "react";

// --- Base Wrapper ---
const CardWrapper = ({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`rounded-3xl p-6 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-white/5 dark:border-white/10 group ${className}`}
    style={style}
  >
    {children}
  </div>
);

// --- 1. Standard Stat/Info Card (e.g., Society Relief / eBooks) ---
interface InfoCardProps {
  title: string;
  subtitle: string;
  desc: string;
  btnText: string;
  bgClass: string;
  textColor?: string;
  href?: string;
  bgImage?: string;
}

export const InfoCard = ({
  title,
  subtitle,
  desc,
  btnText,
  bgClass,
  textColor = "text-white",
  href,
  bgImage,
}: InfoCardProps) => {
  const cleanBgClass = bgClass.replace("no-gradient-", "");
  
  if (bgImage) {
    return (
      <CardWrapper
        className={`${cleanBgClass} ${textColor} min-h-[340px] flex flex-col justify-end`}
      >
        <img
          src={bgImage}
          alt={subtitle || title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          style={{ zIndex: 0 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(1, 15, 12, 0.95) 0%, rgba(1, 15, 12, 0.5) 60%, rgba(1, 15, 12, 0) 100%)",
            zIndex: 1,
          }}
        />

        <div className="relative z-10 flex flex-col mb-2">
          {title && (
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-355 text-emerald-300 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit mb-3 block">
              {title}
            </span>
          )}
          {subtitle && (
            <h3 className="text-xl md:text-2xl font-bold font-heading leading-tight mb-2 !text-white">
              {subtitle}
            </h3>
          )}
          {desc && (
            <p className="text-xs md:text-sm leading-relaxed !text-white/80 mt-1 font-body">
              {desc}
            </p>
          )}
        </div>

        {href && (
          <div className="relative z-10 mt-2">
            <Link
              href={href}
              className="inline-flex items-center justify-between w-full bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 hover:border-white/20 transition-all backdrop-blur-md p-3 px-5 rounded-xl font-semibold text-xs !text-white group/btn shadow-sm"
            >
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover/btn:translate-x-1"></i>
                {btnText || "Learn More"}
              </span>
            </Link>
          </div>
        )}
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      className={`${cleanBgClass} ${textColor} min-h-[340px] flex flex-col justify-between`}
    >
      <div className="flex flex-col z-10">
        {title && (
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit mb-4">
            {title}
          </span>
        )}
        {subtitle && (
          <h3 className="text-xl md:text-2xl font-bold font-heading leading-tight mb-2 !text-white">
            {subtitle}
          </h3>
        )}
        {desc && (
          <p className="text-xs md:text-sm leading-relaxed !text-white/80 mt-1 font-body">
            {desc}
          </p>
        )}
      </div>

      {href && (
        <div className="z-10 mt-auto">
          <Link
            href={href}
            className="inline-flex items-center justify-between w-full bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 hover:border-white/20 transition-all backdrop-blur-md p-3 px-5 rounded-xl font-semibold text-xs !text-white group/btn shadow-sm"
          >
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover/btn:translate-x-1"></i>
              {btnText || "Learn More"}
            </span>
          </Link>
        </div>
      )}
    </CardWrapper>
  );
};

// --- 2. Strip Card (e.g., Relentless Love) ---
export const StripCard = ({
  text,
  bgClass,
  desc,
  buttonText,
  buttonLink,
  bgImage,
}: {
  text: string;
  bgClass: string;
  desc?: string;
  buttonText?: string;
  buttonLink?: string;
  bgImage?: string;
}) => {
  const cleanBgClass = bgClass.replace("no-gradient-", "");

  if (bgImage) {
    return (
      <CardWrapper
        className={`${cleanBgClass} min-h-[140px] flex flex-col justify-end p-6`}
      >
        <img
          src={bgImage}
          alt={text}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          style={{ zIndex: 0 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(1, 15, 12, 0.95) 0%, rgba(1, 15, 12, 0.5) 60%, rgba(1, 15, 12, 0) 100%)",
            zIndex: 1,
          }}
        />

        <div className="relative z-10 flex flex-col mb-2">
          <h3 className="text-lg font-bold !text-white leading-snug">{text}</h3>
          {desc && (
            <p className="text-xs md:text-sm !text-white/80 mt-1.5 font-body leading-relaxed">
              {desc}
            </p>
          )}
        </div>
        {buttonLink && buttonText && (
          <div className="relative z-10 mt-2">
            <Link
              href={buttonLink}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 transition-all backdrop-blur-md py-2 px-4 rounded-xl font-semibold text-xs !text-white group/btn"
            >
              <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover/btn:translate-x-1"></i>
              {buttonText}
            </Link>
          </div>
        )}
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      className={`${cleanBgClass} min-h-[140px] flex items-center justify-between p-6`}
    >
      <div className="flex-1 flex flex-col justify-between h-full z-10">
        <div>
          <h3 className="text-lg font-bold !text-white leading-snug">{text}</h3>
          {desc && (
            <p className="text-xs md:text-sm !text-white/80 mt-1.5 font-body leading-relaxed max-w-[90%]">
              {desc}
            </p>
          )}
        </div>
        {buttonLink && buttonText && (
          <div className="mt-4 w-fit">
            <Link
              href={buttonLink}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 transition-all backdrop-blur-md py-2 px-4 rounded-xl font-semibold text-xs !text-white group/btn"
            >
              <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover/btn:translate-x-1"></i>
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

// --- 3. Image Background Card (e.g., Health, Education) ---
export const ImageCard = ({
  category,
  title,
  bgImage,
  bgClass = "bento-card-green",
  heightClass = "min-h-[260px]",
  buttonText,
  buttonLink,
}: { 
  category: string;
  title: string;
  bgImage?: string;
  bgClass?: string;
  heightClass?: string;
  buttonText?: string;
  buttonLink?: string;
}) => {
  const showGradient = !bgClass.includes("no-gradient");
  const cleanBgClass = bgClass.replace("no-gradient-", "");

  return (
    <CardWrapper
      className={`${cleanBgClass} ${heightClass} flex flex-col justify-end`}
    >
      {bgImage && (
        <img
          src={bgImage}
          alt={category || title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          style={{ zIndex: 0 }}
        />
      )}
      {bgImage && showGradient && (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(1, 15, 12, 0.95) 0%, rgba(1, 15, 12, 0.5) 60%, rgba(1, 15, 12, 0) 100%)",
            zIndex: 1,
          }}
        />
      )}
      
      <div className="relative z-10 mb-2">
        {category && (
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-355 text-emerald-300 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit mb-3 block">
            {category}
          </span>
        )}
        {title && (
          <p className="text-xs md:text-sm leading-relaxed !text-white/95 font-body font-normal">
            {title}
          </p>
        )}
      </div>
      {buttonLink && (
        <div className="relative z-10 mt-2">
          <Link href={buttonLink} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 transition-all backdrop-blur-md py-2 px-4 rounded-xl font-semibold text-xs !text-white group/btn">
            <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover/btn:translate-x-1"></i>
            {buttonText || "Learn More"}
          </Link>
        </div>
      )}
    </CardWrapper>
  );
};

// --- 4. Center Stat Card (Action) ---
export const CenterStatCard = ({
  title = "10+",
  subtitle = "Years of Experience",
  buttonText = "Hire for Consulting",
  buttonLink = "/consulting",
  bgClass = "bento-card-dark",
  bgImage,
}: {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  bgClass?: string;
  bgImage?: string;
}) => {
  const showGradient = !bgClass.includes("no-gradient");
  const cleanBgClass = bgClass.replace("no-gradient-", "");
  return (
    <CardWrapper
      className={`${cleanBgClass} min-h-[200px] flex flex-col justify-center items-center text-center`}
    >
      {bgImage && (
        <img
          src={bgImage}
          alt={subtitle || title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          style={{ zIndex: 0 }}
        />
      )}
      {bgImage && showGradient && (
        <div
          className="absolute inset-0 bg-black/50"
          style={{ zIndex: 1 }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center">
        <span className="text-5xl md:text-6xl font-black font-heading tracking-tight !text-white mb-1 drop-shadow-md">
          {title}
        </span>
        {subtitle && (
          <p className="text-xs md:text-sm font-semibold tracking-wider text-emerald-400 uppercase mb-4 font-body">
            {subtitle}
          </p>
        )}
        {buttonLink && buttonText && (
          <div className="w-full">
            <Link
              href={buttonLink}
              className="inline-flex items-center justify-center bg-white text-slate-955 text-slate-955 text-slate-950 hover:bg-slate-100 hover:scale-[1.02] duration-200 active:scale-95 font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md"
            >
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

// --- 5. Specialization Card (Dynamic Image / Text) ---
export const SpecializationCard = ({
  cardType,
  category,
  title,
  bgImage,
  bgColor,
  buttonText,
  buttonLink,
}: {
  cardType: string;
  category: string;
  title: string;
  bgImage?: string;
  bgColor?: string;
  buttonText?: string;
  buttonLink?: string;
}) => {
  if (cardType === "text") {
    const bgClass = bgColor || "bento-card-green";
    const cleanBgClass = bgClass.replace("no-gradient-", "");
    return (
      <CardWrapper
        className={`${cleanBgClass} flex flex-col justify-between min-h-[460px]`}
      >
        <div className="flex flex-col">
          {category && (
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-355 text-emerald-300 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit mb-4">
              {category}
            </span>
          )}
          <h3 className="text-xl md:text-2xl font-bold leading-tight !text-white font-heading mt-2">
            {title}
          </h3>
        </div>
        
        {buttonLink && (
          <div className="mt-auto">
            <Link href={buttonLink} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 transition-all backdrop-blur-md py-2 px-4 rounded-xl font-semibold text-xs !text-white group/btn">
              <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover/btn:translate-x-1"></i>
              {buttonText || "Learn More"}
            </Link>
          </div>
        )}
      </CardWrapper>
    );
  }

  // Card type 'image'
  const showGradient = bgColor ? !bgColor.includes("no-gradient") : true;
  const cleanBgColor = bgColor ? bgColor.replace("no-gradient-", "") : "bento-card-green";
  return (
    <CardWrapper
      className={`${cleanBgColor} h-[460px] flex flex-col justify-end`}
    >
      {bgImage && (
        <img
          src={bgImage}
          alt={title || category}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          style={{ zIndex: 0 }}
        />
      )}
      {bgImage && showGradient && (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(1, 15, 12, 0.95) 0%, rgba(1, 15, 12, 0.6) 45%, rgba(1, 15, 12, 0) 100%)",
            zIndex: 1,
          }}
        />
      )}
      <div className="relative z-10 mb-2">
        {category && (
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-355 text-emerald-300 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit mb-3 block">
            {category}
          </span>
        )}
        {title && (
          <h3 className="text-xl md:text-2xl font-bold leading-tight !text-white font-heading mt-2">
            {title}
          </h3>
        )}
      </div>
      {buttonLink && (
        <div className="relative z-10 mt-2">
          <Link href={buttonLink} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 transition-all backdrop-blur-md py-2 px-4 rounded-xl font-semibold text-xs !text-white group/btn">
            <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover/btn:translate-x-1"></i>
            {buttonText || "Learn More"}
          </Link>
        </div>
      )}
    </CardWrapper>
  );
};
