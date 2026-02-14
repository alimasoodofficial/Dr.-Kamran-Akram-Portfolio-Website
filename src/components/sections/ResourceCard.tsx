"use client";

import Link from "next/link";

interface ResourceCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  imagePlaceholder: string;
  gradient: string;
}

export default function ResourceCard({
  title,
  description,
  href,
  icon,
  imagePlaceholder,
  gradient,
}: ResourceCardProps) {
  return (
    <Link href={href} className="group">
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-transparent">
        {/* Animated gradient border on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`}
        ></div>

        <div className="relative bg-white dark:bg-gray-800 rounded-3xl m-[2px]">
          <div className="flex flex-col lg:flex-row gap-8 p-8 lg:p-12">
            {/* Content Section */}
            <div className="flex-1 space-y-6">
              {/* Icon and Title */}
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {icon}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {title}
                </h2>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {description}
              </p>

              {/* CTA Button */}
              <div className="flex items-center gap-3 text-transparent bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text font-semibold group-hover:gap-5 transition-all duration-300">
                <span className="text-lg">Explore Now</span>
                <svg
                  className="w-6 h-6 text-orange-600 group-hover:translate-x-2 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>

            {/* Image Placeholder Section */}
            <div className="lg:w-80 xl:w-96">
              <div
                className={`relative h-64 lg:h-full min-h-[300px] rounded-2xl bg-gradient-to-br ${gradient} p-1 group-hover:scale-105 transition-transform duration-500`}
              >
                <div className="w-full h-full rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {/* Placeholder with animated background */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 animate-pulse`}
                    ></div>
                    <div className="relative text-center space-y-3 p-6">
                      <div
                        className={`text-6xl bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}
                      >
                        {icon}
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                        {imagePlaceholder}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
