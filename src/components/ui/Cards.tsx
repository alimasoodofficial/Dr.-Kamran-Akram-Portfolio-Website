import Link from "next/link";

interface CardProps {
  title: string;
  description?: string;
  link?: string;
  // Changed svgSrc to iconClassName to better describe its new purpose
  iconClassName?: string; 
  className?: string;
  buttonText?: string;
}

export default function Cards({
  title,
  description,
  link,
  iconClassName,
  className = "",
  buttonText = "Learn more",
}: CardProps) {
  return (
    <div 
      className={`group bg-container transition-colors duration-700 
      flex flex-col items-start gap-4 px-6 py-10 rounded-lg shadow-sm hover:shadow-md ${className}`}
    >
      {/* Font Awesome Icon */}
      {iconClassName && (
        <div className="text-4xl mb-2">
          <i 
            className={`${iconClassName} transition-transform duration-700 group-hover:rotate-[15deg]`}
            aria-hidden="true"
          ></i>
        </div>
      )}

      {/* Title */}
      <h3 className="font-heading text-2xl md:text-4xl font-bold">{title}</h3>

      {/* Description */}
      <p className="font-body">{description}</p>

      {/* Link (optional) */}
      {link && (
        <Link 
          href={link} 
          className="mt-2 border rounded-lg hover:bg-white shadow shadow-black/100 hover:text-black px-2 inline-flex items-center gap-1 transition-all"
        >
          {buttonText} <span className="">→</span>
        </Link>
      )}
    </div>
  );
}