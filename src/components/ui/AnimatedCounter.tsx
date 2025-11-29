"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  label?: string;
  suffix?: string;
  prefix?: string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value = 100,
  duration = 2,
  delay = 0,
  label = "Projects Completed",
  suffix = "+",
  prefix = "",
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    duration: duration * 1000,
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        motionValue.set(value);
      }, delay * 1000);

      return () => clearTimeout(timeout);
    }
  }, [isInView, value, delay, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });

    return () => unsubscribe();
  }, [springValue]);

  return (
    <div ref={ref} className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: delay }}
        className="text-center"
      >
        <div className="text-6xl font-bold  mb-2">
          {prefix}
          {displayValue}
          {suffix}
        </div>
        <div className="text-lg text-muted-foreground">{label}</div>
      </motion.div>
    </div>
  );
};

interface ProjectCounterGridProps {
  counters?: Array<{
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
  }>;
}

const ProjectCounterGrid: React.FC<ProjectCounterGridProps> = ({
  counters = [
    { value: 150, label: "Projects Completed", suffix: "+" },
    { value: 50, label: "Happy Clients", suffix: "+" },
    { value: 25, label: "Team Members", suffix: "" },
    { value: 98, label: "Success Rate", suffix: "%", prefix: "" },
  ],
}) => {
  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Achievements
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Numbers that speak for themselves. We're proud of what we've accomplished together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((counter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 h-full flex items-center justify-center">
                <AnimatedCounter
                  value={counter.value}
                  label={counter.label}
                  suffix={counter.suffix}
                  prefix={counter.prefix}
                  duration={2.5}
                  delay={index * 0.2}
                />
              </div>
              <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCounterGrid;
