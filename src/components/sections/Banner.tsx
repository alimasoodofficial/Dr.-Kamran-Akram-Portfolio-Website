"use client";
import "../../app/globals.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Breadcrumb from "../ui/Breadcrumb";
import LottiePlayer from "../ui/LottiePlayer";

interface BannerProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  lottieSrc?: string;
  showImage?: boolean;
  showLottie?: boolean;
  showBreadcrumb?: boolean; // 🆕 toggle breadcrumb
  className?: string;
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
}: BannerProps) {
  const pathname = usePathname();
  const isHome = pathname === "/"; // 🏠 Auto hide breadcrumb on home

  const finalImageSrc = imageSrc || "/images/dummy.webp";
  const isExternal = finalImageSrc.startsWith("http");

  return (
    <section className="container-bg-color pt-28 pb-16 px-4 md:px-28">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* 🧭 Left side: text */}
        <div className="md:w-1/2">
          {/* ✅ Conditional Breadcrumb */}
          {showBreadcrumb && !isHome && <Breadcrumb />}

          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
            {title}
          </h1>
          <p className="text-lg md:text-xl font-body">{description}</p>
        </div>

        {/* 🎨 Right side: conditional Lottie or Image */}
        <div className="md:w-1/2 flex justify-center items-center">
          {showLottie ? (
            <LottiePlayer src={lottieSrc} height={300} width={300} />
          ) : (
            showImage && (
              <>
                {isExternal ? (
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
                )}
              </>
            )
          )}
        </div>
      </div>
    </section>
  );
}
