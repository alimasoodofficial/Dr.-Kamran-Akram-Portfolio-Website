import "../../app/globals.css";
import Image from "next/image";
import Breadcrumb from "../ui/Breadcrumb";

interface BannerProps {
  title: string;
  description: string;
  imageSrc: string; 
  imageAlt?: string;
  className?: string;
} 

export default function Banner({
  title,
  description,
  imageSrc,
  imageAlt = "Banner Image",
  className = "",
}: BannerProps) {
  const isExternal = imageSrc.startsWith("http");

  return (
    <section className="w-full container-bg-color py-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
        {/* Left side: text */}
        <div className="md:w-1/2">
        <Breadcrumb />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">{title}</h1>
          <p className="text-lg md:text-xl text-gray-700 font-body ">{description}</p>
        </div>

        {/* Right side: image */}
        <div className="md:w-1/2">  
          {isExternal ? (
            <img
              src={imageSrc}
              alt={imageAlt}
              width={0}
              height={0}
              className={` object-cover  ${className}`}
            />
          ) : (
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={0}
              height={0}
              className={` object-cover  ${className}`}
            />
          )}
        </div>
      </div>
    </section>
  );
}
