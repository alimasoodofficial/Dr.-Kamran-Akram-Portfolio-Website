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
    className={`rounded-3xl  p-6 relative overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${className}`}
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
  const showGradient = !bgClass.includes("no-gradient");
  const cleanBgClass = bgClass.replace("no-gradient-", "");
  return (
    <CardWrapper
      className={`${cleanBgClass} ${textColor} min-h-[320px] flex flex-col justify-between bg-cover bg-center`}
      style={
        bgImage
          ? {
              backgroundImage: showGradient
                ? `linear-gradient(rgba(1, 28, 22, 0.75) 0%, rgba(5, 150, 105, 0.5) 100%), url('${bgImage}')`
                : `url('${bgImage}')`,
            }
          : undefined
      }
    >
      <div className="flex flex-col justify-between text-white">
        {title && <h3 className="text-lg md:text-4xl font-bold mb-2 !text-white">{title}</h3>}
        {subtitle && <h3 className="text-2xl font-heading mb-3 !text-white">{subtitle}</h3>}
        {desc && <p className="text-sm md:text-lg leading-relaxed text-white/90">{desc}</p>}
      </div>
      {href && (
        <div className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm p-3 rounded-full flex justify-between items-center px-5 font-semibold text-sm cursor-pointer mt-4">
          <Link
            href={href}
            className="text-white w-full h-full flex items-center"
          >
            <i className="fa-solid fa-arrow-right px-2"></i>
            {btnText || "Learn More"}
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
  const showGradient = !bgClass.includes("no-gradient");
  const cleanBgClass = bgClass.replace("no-gradient-", "");
  return (
    <CardWrapper
      className={`${cleanBgClass} min-h-[120px] flex flex-col justify-center text-white p-6 bg-cover bg-center`}
      style={
        bgImage
          ? {
              backgroundImage: showGradient
                ? `linear-gradient(rgba(1, 28, 22, 0.75) 0%, rgba(5, 150, 105, 0.5) 100%), url('${bgImage}')`
                : `url('${bgImage}')`,
            }
          : undefined
      }
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold !text-white leading-tight">{text}</h3>
        {desc && (
          <p className="text-sm text-white/90 text-left font-light leading-relaxed">
            {desc}
          </p>
        )}
      </div>
      {buttonLink && (
        <div className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm p-3 rounded-full flex justify-between items-center px-5 font-semibold text-sm cursor-pointer mt-4">
          <Link href={buttonLink} className="text-white w-full h-full flex items-center">
            <i className="fa-solid fa-arrow-right px-2"></i>
            {buttonText || "Learn More"}
          </Link>
        </div>
      )}
    </CardWrapper>
  );
};

// --- 3. Image Background Card (e.g., Health, Education) ---
export const ImageCard = ({
  category,
  title,
  bgImage,
  bgClass = "bento-card-green",
  heightClass = "h-[240px]",
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
  const overlayGradient = "rgba(1, 28, 22, 0.75) 0%, rgba(5, 150, 105, 0.5) 100%";

  return (
    <CardWrapper
      className={`${cleanBgClass} !bg-cover !bg-no-repeat bg-center flex flex-col justify-end text-white`}
      style={{
        backgroundImage: bgImage
          ? showGradient
            ? `linear-gradient(${overlayGradient}), url('${bgImage}')`
            : `url('${bgImage}')`
          : undefined,
      }}
    >
      <div className="relative z-10 text-white mb-2">
        {category && (
          <span className="block text-2xl font-bold mb-1 opacity-90 text-white font-heading">
            {category}
          </span>
        )}
        {title && <h3 className="text-sm md:text-md font-medium leading-tight !text-white font-body mt-2">{title}</h3>}
      </div>
      {buttonLink && (
        <div className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm p-3 rounded-full flex justify-between items-center px-5 font-semibold text-sm cursor-pointer mt-2 relative z-10">
          <Link href={buttonLink} className="text-white w-full h-full flex items-center font-body">
            <i className="fa-solid fa-arrow-right px-2"></i>
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
      className={`${cleanBgClass} flex flex-col justify-center items-center text-center text-white bg-cover bg-center`}
      style={
        bgImage
          ? {
              backgroundImage: showGradient
                ? `linear-gradient(rgba(1, 28, 22, 0.75) 0%, rgba(5, 150, 105, 0.5) 100%), url('${bgImage}')`
                : `url('${bgImage}')`,
            }
          : undefined
      }
    >
      <h3 className="text-4xl font-bold mb-1 !text-white">{title}</h3>
      {subtitle && <p className="font-medium mb-6 text-white/90">{subtitle}</p>}
      {buttonLink && (
        <div className="bg-white/10 hover:bg-white/20 transition-colors w-full py-3 rounded-full font-semibold text-sm flex justify-center items-center gap-2 cursor-pointer">
          <Link href={buttonLink} className="text-white w-full h-full flex justify-center items-center">
            {buttonText || "Learn More"}
          </Link>
        </div>
      )}
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
  const overlayColor = "rgba(1, 28, 22, 0.85) 0%, rgba(6, 78, 59, 0.6) 35%, rgba(16, 185, 129, 0.4) 100%";

  if (cardType === "text") {
    const bgClass = bgColor || "bento-card-green";
    const cleanBgClass = bgClass.replace("no-gradient-", "");
    return (
      <CardWrapper
        className={`${cleanBgClass}   flex flex-col justify-between text-white`}
      >
        <div className="flex flex-col text-white">
          <span className="block text-2xl font-bold mb-1 opacity-90 text-white font-heading">
            {category}
          </span>
          <h3 className="text-sm md:text-md font-medium leading-snug !text-white mt-4 font-body">
            {title}
          </h3>
        </div>
        
        {buttonLink && (
          <div className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm p-3 rounded-full flex justify-between items-center px-5 font-semibold text-sm cursor-pointer mt-4">
            <Link href={buttonLink} className="text-white w-full h-full flex items-center font-body">
              <i className="fa-solid fa-arrow-right px-2"></i>
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
      className={`${cleanBgColor} h-[460px] flex flex-col justify-end text-white`}
    >
      {/* Image rendered via <img> with object-contain — no scaling/cropping */}
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
          style={{ zIndex: 0 }}
        />
      )}
      {/* Overlay */}
      {bgImage && showGradient && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${overlayColor})`,
            zIndex: 1,
          }}
        />
      )}
      <div className="relative z-10 text-white mb-2">
        {category && (
          <span className="block text-2xl font-bold mb-1 opacity-90 text-white font-heading">
            {category}
          </span>
        )}
        {title && (
          <h3 className="text-sm md:text-md font-medium leading-tight !text-white font-body mt-4 font-normal">
            {title}
          </h3>
        )}
      </div>
      {buttonLink && (
        <div className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm p-3 rounded-full flex justify-between items-center px-5 font-semibold text-sm cursor-pointer mt-2 relative z-10">
          <Link href={buttonLink} className="text-white w-full h-full flex items-center font-body">
            <i className="fa-solid fa-arrow-right px-2"></i>
            {buttonText || "Learn More"}
          </Link>
        </div>
      )}
    </CardWrapper>
  );
};

