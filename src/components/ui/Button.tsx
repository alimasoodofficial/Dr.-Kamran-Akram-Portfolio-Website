import React from "react";

interface ButtonProps {
  children: React.ReactNode; 
  className?: string;        
  onClick?: () => void;      
  type?: "button" | "submit" | "reset"; 
}

export default function Button({children,className = "",onClick,type = "button",}: ButtonProps) {
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
