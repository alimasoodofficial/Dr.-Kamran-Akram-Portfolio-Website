'use client';

import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import React, { useRef } from 'react';

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export default function ScrollRevealText({ text, className = "" }: ScrollRevealTextProps) {
  const element = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: element,
    offset: ['start 0.9', 'start 0.25'],
  });

  const words = text.split(' ');

  return (
    <p
      ref={element}
      className={`leading-relaxed transition-colors duration-300 ${className}`}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        
        return (
          <React.Fragment key={i}>
            <Word range={[start, end]} progress={scrollYProgress}>
              {word}
            </Word>
            {i < words.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </p>
  );
}

interface WordProps {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}

const Word = ({ children, range, progress }: WordProps) => {
  const characters = children.split('');
  const amount = range[1] - range[0];
  const step = amount / characters.length;

  return (
    <span className="relative inline-block">
      {characters.map((char, i) => {
        const start = range[0] + i * step;
        const end = range[0] + (i + 1) * step;
        
        return (
          <Char key={i} range={[start, end]} progress={progress}>
            {char}
          </Char>
        );
      })}
    </span>
  );
};

interface CharProps {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}

const Char = ({ children, range, progress }: CharProps) => {
  // Instead of animating color directly, we animate opacity.
  // 0.2 opacity makes the text look gray (faded) regardless of the background color.
  // 1.0 opacity makes it fully visible in the active theme color.
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <motion.span style={{ opacity }}>
      {children}
    </motion.span>
  );
};