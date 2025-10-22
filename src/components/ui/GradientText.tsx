interface GradientTextProps {
  colors: string[];
  animationSpeed?: number;
  className?: string;
  children: React.ReactNode;
}

export default function GradientText({
  colors,
  animationSpeed = 5,
  className = "",
  children,
}: GradientTextProps) {
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;

  return (
    <span
      className={`bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient ${className}`}
      style={{
        backgroundImage: gradient,
        animationDuration: `${animationSpeed}s`,
      }}
    >
      {children}
    </span>
  );
}
