"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const SocialIcon = ({ path }: { path: string }) => (
  <svg
    className="w-5 h-5 text-white hover:text-[#d4f238] transition-colors cursor-pointer"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={path} />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#111320] text-white pt-16 pb-8 text-sm font-sans  overflow-hidden">
      {/* Optional: Background gradient effect or overlay if needed */}

      <div className="w-full mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 mb-16">
        {/* --- Column 1: Brand, Bio, & Newsletter (Span 5 columns) --- */}
        <div className="lg:col-span-5 sm:col-span-2 flex flex-col items-start gap-6">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mb-2">
            {/* Using a placeholder for the specific logo in the image, replacing your old logo */}
            <div className="flex flex-col leading-tight">
              <span className="text-xl md:text-2xl font-black tracking-wide text-white">
                MUHAMMAD
              </span>
              <span className="text-xl md:text-2xl font-black tracking-wide text-white">
                KAMRAN
              </span>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed md:pr-8 font-body text-sm md:text-base">
            A multilingual agricultural scientist and data analyst dedicated to
            clear, impactful science communication and extension across
            agriculture and animal sciences. With experience as an MLA Red Meat
            Industry Ambassador and Young Science Ambassador, focused on
            translating complex research into practical knowledge for farmers,
            students, and communities.
          </p>

          {/* Newsletter Section */}
          <div className="w-full mt-2">
            <h4 className="font-bold text-lg mb-3">
              Subscribe to My Newsletter
            </h4>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md min-w-0">
              <input
                type="email"
                aria-label="Email address"
                placeholder="Your Email Address*"
                className="flex-1 bg-white text-gray-800 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#d4f238] w-full sm:w-auto min-w-0"
              />
              <button className="bg-[#d0f238] text-[#1a3028] font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* --- Column 2: Quick Links (Span 2 columns) --- */}
        <div className="lg:col-span-2">
          <h4 className="font-bold text-lg mb-6 text-white font-heading">Quick Links</h4>
          <ul className="space-y-3 text-gray-300">
            {[
              { name: "Home", path: "/" },
              { name: "Resume", path: "/resume" },
              { name: "Projects", path: "/projects" },
              { name: "Gallery", path: "/gallery" },
              { name: "Newsletter", path: "/newsletter" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className="hover:text-[#d4f238] transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Column 3: Work With Me (Span 2 columns) --- */}
        <div className="lg:col-span-2">
          <h4 className="font-bold text-lg mb-6 text-white font-heading">Work With Me</h4>
          <ul className="space-y-3 text-gray-300">
            {[
              { name: "Consulting", path: "/consulting" },
              { name: "Academy", path: "/academy" },
              { name: "Contact Me", path: "mailto:hi@imkamran.com" },
            ].map((item) => (
              <li key={item.name}>
                {item.path.startsWith("mailto") ? (
                  <a
                    href={item.path}
                    className="hover:text-[#d4f238] transition-colors"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    href={item.path}
                    className="hover:text-[#d4f238] transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* --- Column 4: Contact Info (Span 3 columns) --- */}
        <div className="lg:col-span-3 sm:col-span-2">
          <h4 className="font-bold text-lg mb-6 text-white font-heading">Contact Info</h4>
          <div className="space-y-4 text-gray-300">
            {/* Email */}
            <div className="flex items-center gap-3">
              <span className="text-[#d4f238] text-lg">✉</span>
              <a
                href="mailto:hi@imkamran.com"
                className="hover:text-[#d4f238] transition-colors"
              >
                hi@imkamran.com
              </a>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <span className="text-[#d4f238] text-lg mt-0.5">📍</span>
              <span>Brisbane, Australia </span>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6 flex-wrap items-center">
              {/* Facebook */}
              <a href="https://www.facebook.com/kamran.akram3/" target="_blank" rel="noopener noreferrer">
                <SocialIcon path="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </a>
              {/* YouTube */}
              <a href="https://www.youtube.com/@MKamran09" target="_blank" rel="noopener noreferrer">
                <SocialIcon path="M21.58 7.24a2.95 2.95 0 00-2.08-2.09C17.67 4.5 12 4.5 12 4.5s-5.67 0-7.5.65a2.95 2.95 0 00-2.09 2.09A31.14 31.14 0 002 12.24a31.14 31.14 0 00.41 5.25 2.95 2.95 0 002.09 2.09C6.33 20 12 20 12 20s5.67 0 7.5-.65a2.95 2.95 0 002.09-2.09 31.14 31.14 0 00.41-5.25 31.14 31.14 0 00-.41-5zM9.75 15.02V8.98l5.25 3.02z" />
              </a>
              {/* Twitter/X */}
              <a href="https://x.com/mkamran09" target="_blank" rel="noopener noreferrer">
                <SocialIcon path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/kam09/" target="_blank" rel="noopener noreferrer">
                <SocialIcon path="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 11-2 2 2 2 0 012-2z" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="border-t border-gray-700 max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
        {/* Left: Copyright */}
        <div className="text-center md:text-left text-sm">
          © {new Date().getFullYear()} Dr Muhammad Kamran | Developed by{" "}
          <span className="font-bold text-white">DATA EXPERTS 360</span>
        </div>

        {/* Right: Policies removed as requested */}
      </div>
    </footer>
  );
}
