"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CoffeeLoader from "./CoffeeLoader";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    // Simulate loading time for transitions
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Slightly faster for transitions

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white dark:bg-[#050505]"
        >
          <div className="relative">
            <CoffeeLoader size={2} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <h2 className="text-xl font-medium tracking-widest text-[#064e3b] dark:text-emerald-400 font-dm-serif">
                DR. MUHAMMAD KAMRAN
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-poppins uppercase tracking-[0.2em] animate-pulse">
                Brewing Excellence...
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
