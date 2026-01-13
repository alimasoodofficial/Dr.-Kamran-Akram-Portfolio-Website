"use client";

import "./globals.css"; // 👈 IMPORTANT: Import global CSS for Tailwind
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-6 md:p-24">
          
          {/* Left Side: Visual/Icon */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end md:pr-12 mb-8 md:mb-0">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse blur-xl opacity-50" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-32 h-32 text-red-600 relative z-10"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900">
                500 <span className="text-gray-400 font-light">Error</span>
              </h1>
              <h2 className="text-xl font-semibold text-gray-700">
                System Malfunction
              </h2>
              <p className="text-gray-500 max-w-md mx-auto md:mx-0">
                Our servers encountered a critical issue. The application has crashed to protect your data.
              </p>
            </div>

            {/* Error Code / Digest for Support */}
            {error.digest && (
              <div className="bg-gray-100 border border-gray-200 p-3 rounded-md font-mono text-xs text-gray-600 inline-block">
                Error ID: {error.digest}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => reset()} // Next.js 'soft' reload
                className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-all font-medium shadow-lg shadow-gray-200"
              >
                Try to Recover
              </button>
              <button
                onClick={() => window.location.reload()} // Browser 'hard' reload
                className="px-6 py-3 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}