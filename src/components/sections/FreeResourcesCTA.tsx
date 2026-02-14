"use client";

import Link from "next/link";

export default function FreeResourcesCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 p-[2px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 animate-gradient-x"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-12 text-center space-y-6">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Can't find what you're looking for?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a specific request or need personalized guidance? Feel free to
            reach out and I'll be happy to help.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-orange-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </section>
  );
}
