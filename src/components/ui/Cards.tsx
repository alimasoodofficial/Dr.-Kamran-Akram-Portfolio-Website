import Image from "next/image";
import Link from "next/link";

interface CardProps {
  title: string;
  description?: string;
  link?: string;
  svgSrc?: string; // path or URL of your SVG (local or external)
  className?: string;
  buttonText?: string;
}

export default function Cards({
  title,
  description,
  link,
  svgSrc,
  className = "",
  buttonText = "Learn more",
}: CardProps) {
  return (
    <div
      className={`group bg-container
  transition-colors
  duration-1000  
     flex flex-col items-start gap-4 px-6 py-10 rounded-lg shadow-sm hover:shadow-md    ${className}`}
    >
      {/* SVG/Icon */}
      {svgSrc && (
        <div className="w-12 h-12 mb-2">
          {/* Use Image for optimization */}
          <Image
            src={svgSrc}
            alt={`${title} icon`}
            width={48}
            height={48}
            className="w-12 h-12 object-contain   group-hover:rotate-[15deg] duration-700"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="font-heading text-2xl md:text-4xl font-bold">{title}</h3>

      {/* Description */}
      <p className="font-body  ">{description}</p>

      {/* Link (optional) */}
      {link && (
        <Link href={link} className="  mt-2 inline-flex items-center gap-1">
          {buttonText} <span className=" ">→</span>
        </Link>
      )}
    </div>
  );
}
