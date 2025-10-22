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
  bannerClass?: string;

  // 🆕 Optional gradient customization props
  gradientColors?: string[];
  animationSpeed?: number;
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
  bannerClass = "",
  gradientColors,
  animationSpeed,
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
    gradientColors || ["#97ABFF", "#123597"],
  animationSpeed: animationSpeed || 6,
};

  return (
    <section className="container-bg-color pt-28 pb-16 px-4 md:px-28">
      <div
        className={`container mx-auto flex ${
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
            className="text-4xl md:text-5xl font-bold mb-4 font-heading"
          >
            {title}
          </GradientText>

          <p className="text-lg md:text-xl font-body">{description}</p>
        </div>

        {/* 🎨 Visual Section */}
        {hasVisual && (
          <div className="md:w-1/2 flex justify-center items-center">
            {showLottie ? (
              <LottiePlayer src={lottieSrc} height={300} width={300} />
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
