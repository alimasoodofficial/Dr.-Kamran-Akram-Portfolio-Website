import "../../app/globals.css";
import Image from "next/image";

interface BannerProps {
  title: string;
  description: string;
  imageSrc: string; 
  imageAlt?: string;
} 

export default function Banner({
  title,
  description,
  imageSrc,
  imageAlt = "Banner Image",
}: BannerProps) {
  const isExternal = imageSrc.startsWith("http");

  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
        {/* Left side: text */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl text-gray-700">{description}</p>
        </div>

        {/* Right side: image */}
        <div className="md:w-1/2">
          {isExternal ? (
            <img
              src={imageSrc}
              alt={imageAlt}
              className="rounded-lg object-cover w-full h-auto"
            />
          ) : (
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-auto"
            />
          )}
        </div>
      </div>
    </section>
  );
}
