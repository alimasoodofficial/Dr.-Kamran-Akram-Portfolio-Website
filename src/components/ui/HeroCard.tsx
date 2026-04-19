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
    className={`rounded-3xl p-6 relative overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${className}`}
    style={style}
  >
    {children}
  </div>
);

// --- 1. Standard Stat/Info Card (e.g., Society Relief) ---
interface InfoCardProps {
  title: string;
  subtitle: string;
  desc: string;
  btnText: string;
  bgClass: string;
  textColor?: string;
  href?: string;
}

export const InfoCard = ({
  title,
  subtitle,
  desc,
  btnText,
  bgClass,
  textColor = "text-white",
  href = "#",
}: InfoCardProps) => (
  <CardWrapper
    className={`${bgClass} ${textColor} min-h-[320px] flex flex-col justify-between`}
  >
    
    <div className="flex flex-col justify-between text-white">
      <h3 className="text-lg md:text-4xl  font-bold mb-2 !text-white">{title}</h3>
      <h3 className="text-2xl  font-heading mb-3 !text-white">{subtitle}</h3>
      <p className="text-sm md:text-lg  leading-relaxed text-white/90">{desc}</p>
    </div>
    <div className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm p-3 rounded-full flex justify-between items-center px-5 font-semibold text-sm cursor-pointer mt-4">
      <Link
        href={href}
        className="text-white w-full h-full flex items-center"
      >
       <i className="fa-solid fa-arrow-right px-2"></i>
        {btnText}
      </Link>
    </div>
  </CardWrapper>
);

// --- 2. Strip Card (e.g., Relentless Love) ---
export const  StripCard = ({
  icon,
  text,
  bgClass,
}: {
  icon: string;
  text: string;
  bgClass: string;
}) => (
  <CardWrapper
    className={`${bgClass} min-h-[120px] flex flex-col md:flex-row items-center gap-4 text-white `}
  >
    <div className="border-2 border-white/30 rounded-full p-3 w-12 h-12 flex items-center justify-center shrink-0">
      <i className={`${icon} text-xl`}></i>
    </div>
    <h3 className="text-lg font-semibold !text-white">{text}</h3>
  </CardWrapper>
);

// --- 3. Image Background Card (e.g., Health, Education) ---
export const ImageCard = ({
  category,
  title,
  bgImage,
  overlayColor,
  heightClass = "h-[460px]",
  imgSrc,
}: any) => (
  
  <CardWrapper
    className={`${heightClass} bg-cover bg-center flex flex-col justify-end text-white`}
    // Using inline style for dynamic background images
    style={{
      backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url('${bgImage}')`,
    }}
  >
      <Link href="/free-resources/articles" className="text-white">

    <div className="relative z-10 text-white">
      <span className="block text-lg font-medium mb-1 opacity-90 text-white">
        {category}
      </span>
      <h3 className="text-xl font-bold leading-tight !text-white">{title}</h3>
    </div>
    </Link>
  </CardWrapper>
);

// --- 4. Center Stat Card (Action) ---
export const CenterStatCard = () => (
  <CardWrapper className="bento-card-dark flex flex-col justify-center items-center text-center text-white">
    <h3 className="text-4xl font-bold mb-1 !text-white">10+</h3>
    <p className="font-medium mb-6 text-white/90">Years of Experience</p>
    <div className="bg-white/10 hover:bg-white/20 transition-colors w-full py-3 rounded-full font-semibold text-sm flex justify-center items-center gap-2 cursor-pointer">
    <Link href="/consulting" className="text-white">
      <i className="fa-solid fa-hand-holding-dollar"></i> Hire for Consulting
    </Link>
    </div>
  </CardWrapper>
);
