"use client";

import React from "react";
import CoffeeLoader from "@/components/loaders/CoffeeLoader";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#050505]">
      <div className="relative">
        <CoffeeLoader size={2} />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
    </div>
  );
}
