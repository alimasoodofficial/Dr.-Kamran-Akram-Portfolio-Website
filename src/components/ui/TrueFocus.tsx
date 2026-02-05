"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = "True Focus",
  separator = " ",
  manualMode = false,
  blurAmount = 5,
  borderColor = "#10b981",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
}) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex((prev) => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000,
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode && lastActiveIndex !== null) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  return (
    <div className="relative flex gap-4 justify-center items-center flex-wrap">
      <LayoutGroup>
        {words.map((word, index) => {
          const isActive = index === currentIndex;

          return (
            <span
              key={index}
              className="relative text-[3rem] font-black "
              style={{
                filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
                opacity: isActive ? 1 : 0.5, // Added opacity for better focus contrast
                transition: `filter ${animationDuration}s ease, opacity ${animationDuration}s ease`,
                // Hint to browser to promote to GPU layer for smoother blur
                willChange: "filter, opacity",
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {word}

              {/* The "Focus Box" is now a child of the active word.
                 Framer Motion detects the `layoutId` and automatically 
                 animates it from the previous word to this one.
              */}
              {isActive && (
                <motion.div
                  layoutId="focus-box"
                  className="absolute -inset-3 pointer-events-none"
                  transition={{
                    duration: animationDuration,
                    // Use a spring for more natural mechanical movement, or ease for smoothness
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {/* Top Left Corner */}
                  <span
                    className="absolute w-4 h-4 border-[3px] rounded-[3px] top-0 left-0 border-r-0 border-b-0"
                    style={{
                      borderColor: borderColor,
                      boxShadow: `0 0 0 ${borderColor}`, // Cleaner glow using CSS shadow
                    }}
                  />
                  {/* Top Right Corner */}
                  <span
                    className="absolute w-4 h-4  border-[3px] rounded-[3px] top-0 right-0 border-l-0 border-b-0"
                    style={{
                      borderColor: borderColor,
                      boxShadow: `0 0 0 ${borderColor}`,
                    }}
                  />
                  {/* Bottom Left Corner */}
                  <span
                    className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-0 left-0 border-r-0 border-t-0"
                    style={{
                      borderColor: borderColor,
                      boxShadow: `0 0 0 ${borderColor}`,
                    }}
                  />
                  {/* Bottom Right Corner */}
                  <span
                    className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-0 right-0 border-l-0 border-t-0"
                    style={{
                      borderColor: borderColor,
                      boxShadow: `0 0 0 ${borderColor}`,
                    }}
                  />
                </motion.div>
              )}
            </span>
          );
        })}
      </LayoutGroup>
    </div>
  );
};

export default TrueFocus;
