import React from 'react';
import Image from 'next/image';

interface ImageBackgroundProps {
  backgroundImage?: string;
  subheading?: string;
  headline?: string;
  height?: string; // e.g., 'h-[500px]' or 'h-screen'
  overlayOpacity?: string; // e.g., 'bg-black/20'
}

const ImageBackground = ({
  backgroundImage = "https://images.pexels.com/photos/31427409/pexels-photo-31427409.jpeg",
  subheading = "Our Flagship Ingredient",
  headline = "Heading Here",
  height = "h-[500px]",
  overlayOpacity = "bg-black/10"
}: ImageBackgroundProps) => {
  return (
    <section className={`relative w-full ${height} flex items-center justify-center overflow-hidden font-sans`}>
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Background context"
          fill
          className="object-cover w-full h-full blur-[2px] scale-105"
          priority
        />
        <div className={`absolute inset-0 ${overlayOpacity}`} />
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-[90%] max-w-5xl px-8 py-16 md:py-24 rounded-2xl bg-gray-500/30 backdrop-blur-lg border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center text-center text-white">
          
          {/* Subheading */}
          {subheading && (
            <p className="uppercase tracking-[0.35em] text-[10px] sm:text-xs font-semibold mb-6 opacity-80">
              {subheading}
            </p>
          )}

          {/* Headline */}
          <h3 className="text-2xl text-white md:text-4xl lg:text-5xl font-normal leading-[1.2] tracking-tight max-w-4xl">
            {headline}
          </h3>
          
        </div>
      </div>
    </section>
  );
};

export default ImageBackground;