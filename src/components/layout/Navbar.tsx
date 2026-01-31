"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navLinks";
import { freeResources } from "@/data/freeResourcesMenu";
import { aboutMeItems } from "@/data/aboutMeMenu";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button";
import "../../app/globals.css";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav
      className="
      fixed top-4 left-1/2 -translate-x-1/2
      w-11/12 
      z-50
      backdrop-blur-xl backdrop-saturate-150
      bg-white/10 dark:bg-[#0b0c12]/40
      border border-white/10
      text-[var(--foreground)]
      rounded-full
      shadow-[0_0_20px_rgba(0,0,0,0.25)]
      transition-all duration-500
      
    "
    >
      <div className="flex items-center justify-between px-5 py-3 md:py-4 ">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-heading font-bold flex items-center gap-1"
        >
          <span className="text-2xl text-black dark:text-white">mk.</span>
          <span className="hidden md:block text-[#E67E22] dark:text-purple-500 transition-colors duration-300">
            |
          </span>
          <span className="font-extralight font-body hidden md:block text-black dark:text-white ">
            Dr M Kamran
          </span>
        </Link>

        {/* 🌐 Desktop Navigation */}
        <div className="hidden lg:flex gap-4 font-body font-medium ml-auto mr-8 items-center relative text-black dark:text-white">
          {/* Free Resources Mega Dropdown */}
          <div className="group relative px-3 py-2">
            <button className="flex items-center gap-1 transition-colors hover:text-[#E67E22]">
              Free Resources
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mt-0.5 transition-transform group-hover:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100
              transition-all duration-300 ease-in-out
              absolute top-full left-0 mt-4 
              bg-white dark:bg-[#1a1b26] border border-gray-100 dark:border-gray-700
              rounded-2xl shadow-2xl backdrop-blur-lg p-6 z-50 min-w-[800px]"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                Explore Free Resources
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {freeResources.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group/item"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform flex-shrink-0">
                      <i
                        className={`${item.icon} text-white text-xl`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* About Me Mega Dropdown */}
          <div className="group relative px-3 py-2">
            <button className="flex items-center gap-1 transition-colors hover:text-[#E67E22] font-medium">
              About Me
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mt-0.5 transition-transform group-hover:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100
              transition-all duration-300 ease-in-out
              absolute top-full left-1/2 -translate-x-1/2 mt-4 
              bg-white dark:bg-[#1a1b26] border border-gray-100 dark:border-gray-700
              rounded-2xl shadow-2xl backdrop-blur-lg p-6 z-50 min-w-[500px]"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                About Dr. Kamran
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {aboutMeItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group/item"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform flex-shrink-0">
                      <i
                        className={`${item.icon} text-white text-xl`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Other Links */}
          {/* Filter out 'Free Resources', 'About Me', 'Resume', 'Projects', 'Gallery' from navigation */}
          {navLinks
            .filter(
              (link) =>
                link.label !== "Free Resources" &&
                link.label !== "About Me" &&
                link.label !== "About" &&
                link.label !== "Resume" &&
                link.label !== "Projects" &&
                link.label !== "Gallery",
            )
            .map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 transition-all hover:text-[#E67E22] hover:scale-110 ${
                    isActive ? "text-blue-600" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
        </div>

        {/* 🎛 Right Controls */}
        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />

          <Button
            type="button"
            href="/newsletter"
            className="hidden lg:block  text-white font-black tracking-wide "
          >
            Join 1000+ Subscribers
          </Button>

          

          {/* 🍔 Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {isOpen && (
        <div
          className="
            fixed top-0 right-0 z-50
            h-screen w-full rounded-3xl
            flex flex-col overflow-y-auto
            space-y-6
            px-6 py-16
            font-body
            bg-white/95
            dark:bg-gray-900
            text-[var(--foreground)]
            backdrop-blur-3xl
            animate-fadeIn
          "
        >
          <button
            className="absolute top-6 right-6 p-2 rounded-full bg-black/10 dark:bg-white/10 hover:scale-105 transition-transform"
            onClick={() => setIsOpen(false)}
            aria-label="Close Menu"
          >
            <X className="h-7 w-7" />
          </button>

          <div className="flex flex-col space-y-8 pt-4">
            {/* Navigation Links */}
            <div className="flex flex-col space-y-4">
              {navLinks
                .filter(
                  (link) =>
                    link.label !== "Free Resources" &&
                    link.label !== "About Me" &&
                    link.label !== "About" &&
                    link.label !== "Resume" &&
                    link.label !== "Projects" &&
                    link.label !== "Gallery",
                )
                .map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname?.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-2xl font-black tracking-wide hover:text-[#E67E22] transition-colors px-2 py-1 ${
                        isActive ? "text-[#E67E22]" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
            </div>

            {/* About Me Section */}
            <div className="flex flex-col space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-2 uppercase tracking-wider">
                About Me
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {aboutMeItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                      <i
                        className={`${item.icon} text-white text-xl`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-base mb-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Free Resources Section */}
            <div className="flex flex-col space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-2">
                Free Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {freeResources.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                      <i
                        className={`${item.icon} text-white text-lg`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <Button
              href="/newsletter"
              onClick={() => setIsOpen(false)}
              className="w-full  tracking-wide text-white text-center text-sm font-black py-3"
            >
              Join 1000+ Subscribers
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
