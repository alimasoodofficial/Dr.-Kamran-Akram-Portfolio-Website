"use client";
import { useTheme } from "next-themes";
import "../../app/globals.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Breadcrumb from "../ui/Breadcrumb";
import LottiePlayer from "../ui/LottiePlayer";
import GradientText from "../ui/GradientText";
import { useEffect, useState } from "react";
interface BannerProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  lottieSrc?: string;
  showImage?: boolean;
  showLottie?: boolean;
  showBreadcrumb?: boolean;
  className?: string;
  containerClass?: string;
  bannerClass?: string;
  lottieWidth?: number;
  showVideo?: boolean;
  videoSrc?: string;
  videoOverlay?: string; // e.g. "bg-black/40"
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;

  // 🆕 Optional gradient customization props
  gradientColors?: string[];
  animationSpeed?: number;
  children?: React.ReactNode;
}

export default function Banner({
  title = "Title Here",
  description = "Description goes here.",
  imageSrc,
  imageAlt = "Banner Image",
  lottieSrc = "/lotties/animation.lottie",
  showImage = true,
  showLottie = false,
  showBreadcrumb = true,
  className = "",
  containerClass = "",
  bannerClass = "",
  lottieWidth = 300,
  showVideo = false,
  videoSrc = "",
  videoOverlay = "bg-black/40",
  videoProps = {},
  gradientColors,
  animationSpeed,
  children,
}: BannerProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const finalImageSrc = imageSrc || "/images/dummy.webp";
  const isExternal = finalImageSrc.startsWith("http");
  const hasVisual = showImage || showLottie;

  // 🪄 Default gradient settings
 const { theme } = useTheme();
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;

const gradientSettings = {
  colors:
    gradientColors || ["#0b42f5ff", "#7ebcf6ff"],
  animationSpeed: animationSpeed || 6,
};

  return (
    <section className={`relative overflow-hidden container-bg-color pt-28 pb-16 px-4 md:px-28 ${containerClass}`}>
      {/* 📹 Background Video */}
      {showVideo && videoSrc && (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            {...videoProps}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          {videoOverlay && (
            <div className={`absolute inset-0 z-1 ${videoOverlay}`} />
          )}
        </>
      )}

      <div
        className={`relative z-10 container mx-auto flex ${
          hasVisual
            ? "flex-col md:flex-row items-center gap-8"
            : "flex-col items-center text-center lg:w-1/2"
        } ${bannerClass}`}
      >
        {/* 🧭 Text Section */}
        <div
          className={`flex flex-col ${
            hasVisual ? "text-left" : "items-center text-center"
          }`}
        >
          {showBreadcrumb && !isHome && (
            <div className={`${hasVisual ? "text-left" : "text-center"} mb-4`}>
              <Breadcrumb />
            </div>
          )}

          <GradientText
            colors={gradientSettings.colors}
            animationSpeed={gradientSettings.animationSpeed}
            className="text-4xl md:text-5xl font-black pb-4 font-heading"
          >
            {title}
          </GradientText>

          <p className="text-lg md:text-xl font-body">{description}</p>
          {children && <div className="mt-6">{children}</div>}
        </div>

        {/* 🎨 Visual Section */}
        {hasVisual && (
          <div className="md:w-1/2 flex justify-center items-center">
            {showLottie ? (
              <LottiePlayer src={lottieSrc} height={lottieWidth} width={lottieWidth} />
            ) : (
              showImage &&
              (isExternal ? (
                <img
                  src={finalImageSrc}
                  alt={imageAlt}
                  className={`object-cover ${className}`}
                />
              ) : (
                <Image
                  src={finalImageSrc}
                  alt={imageAlt}
                  width={400}
                  height={400}
                  className={`object-cover ${className}`}
                />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
