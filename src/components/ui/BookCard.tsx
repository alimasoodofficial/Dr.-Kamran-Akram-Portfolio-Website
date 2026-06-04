"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./shadcn/button";

interface BookCardProps {
  title?: string;
  imageSrc?: string;
  width?: number;
  height?: number;
  coverColor?: string;
  coverText?: string;
  children?: React.ReactNode;
  href?: string;
  buttonText?: string;
  buttonClassName?: string;
  onButtonClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  openInNewTab?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  title = "",
  imageSrc = "/images/ebooks/default-book.jpg",
  width = 220,
  height = 300,
  coverColor = "bg-green-300",
  coverText = "",
  children,
  href,
  buttonText = "",
  buttonClassName = "btn-gradient text-white text-sm md:text-base px-6 md:px-8 py-3 rounded-2xl font-medium transition-transform hover:scale-105",
  onButtonClick,
  openInNewTab = false,
}) => {
  return (
    <div className="flex flex-col group w-full items-center" style={{ maxWidth: `${width}px` }}>
      <div 
        className="relative rounded-r-xl rounded-l-sm overflow-hidden shadow-md border border-slate-200/50 dark:border-slate-800/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 group-hover:-translate-y-2 w-full bg-slate-100 dark:bg-slate-800"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title || "book image"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-105 ${coverColor}`}>
            {coverText && <p className="font-heading text-xl md:text-2xl font-bold text-white text-center px-4 uppercase">{coverText}</p>}
          </div>
        )}
        
        {/* Book spine lighting/shading effect */}
        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 via-white/20 to-transparent pointer-events-none mix-blend-overlay" />
        <div className="absolute inset-y-0 left-0 w-[1px] bg-white/30 pointer-events-none" />
        <div className="absolute inset-y-0 left-4 w-[1px] bg-black/10 pointer-events-none" />

        {/* Subtle glass reflection effect across the cover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {(href || buttonText || children) && (
        <div className="mt-5 flex justify-center items-center w-full">
          {href ? (
            <Button asChild className={buttonClassName}>
              <Link
                href={href}
                target={openInNewTab ? "_blank" : undefined}
                rel={openInNewTab ? "noopener noreferrer" : undefined}
                className="w-full text-center"
              >
                {children ?? buttonText}
              </Link>
            </Button>
          ) : (
            <Button onClick={onButtonClick} className={`${buttonClassName} w-full`}>
              {children ?? buttonText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookCard;
