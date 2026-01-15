import React from "react";
import Link from "next/link";


interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string; // if provided → render Link
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  className = "",
  href,
  onClick,
  type = "button",
}: ButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={`px-8 py-2 rounded-3xl   transition duration-400 hover:scale-105   ${className}`}
        
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-2 rounded-3xl font-medium transition ${className}`}
    >
      {children}
    </button>
  );
}
