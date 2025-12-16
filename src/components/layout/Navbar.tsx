"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/data/navLinks";
import { freeResources } from "@/data/freeResourcesMenu";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button";
import "../../app/globals.css";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="
      fixed top-4 left-1/2 -translate-x-1/2
      w-11/12 max-w-7xl
      z-50
      backdrop-blur-xl backdrop-saturate-150
      bg-white/10 dark:bg-[#0b0c12]/40
      border border-white/10
      text-[var(--foreground)]
      rounded-full
      shadow-[0_0_20px_rgba(0,0,0,0.25)]
      transition-all duration-500
      -mb-20
    "
    >
      <div className="flex items-center justify-between px-5 py-3 md:py-4 ">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-heading font-bold flex items-center gap-1"
        >
          <span className="text-2xl text-[var(--foreground)]">mk.</span>
          <span className="hidden md:block text-orange-500 dark:text-purple-500 transition-colors duration-300">
            |
          </span>
          <span className="font-extralight font-body hidden md:block ">
            Dr M Kamran
          </span>
        </Link>

        {/* 🌐 Desktop Navigation */}
        <div className="hidden lg:flex gap-8 font-body font-medium ml-auto mr-8 items-center relative">
          {/* Free Resources Dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 transition-colors hover:text-orange-500">
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

            {/* Dropdown Menu */}
            <div
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100
              transition-all duration-300 ease-in-out
              absolute top-full left-0 mt-4 w-80
              bg-white dark:bg-[#0b0c12]/90 border border-gray-200 dark:border-gray-700 
              rounded-2xl shadow-xl backdrop-blur-lg p-4 z-50"
            >
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Explore Free Resources
              </h3>

              <div className="flex flex-col gap-3 ">
                {freeResources.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-3 p-2 rounded-xl  hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-6 h-6 opacity-80"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Other Links */}
          {navLinks
            .filter((link) => link.label !== "Free Resources")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-orange-500 "
              >
                {link.label}
              </Link>
            ))}
        </div>

        {/* 🎛 Right Controls */}
        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />

          <Button
            type="button"
            href="/newsletter"
            className="hidden lg:block comic-button "
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
            fixed top-0 right-0  z-50
            h-screen w-full rounded-3xl
            flex flex-col items-center justify-center
            space-y-8
            px-6 py-10
             font-body
            bg-white/95
            dark:bg-blue-950
            text-[var(--foreground)]
            backdrop-blur-3xl
            animate-fadeIn
          "
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 p-2 rounded-full bg-black/10 dark:bg-white/10 hover:scale-105 transition-transform"
            onClick={() => setIsOpen(false)}
            aria-label="Close Menu"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Navigation Links */}
          <div className="flex flex-col items-center space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium hover:text-orange-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            href="/newsletter"
            onClick={() => setIsOpen(false)}
            className="comic-button"
          >
            Join 1000+ Subscribers
          </Button>
        </div>
      )}
    </nav>
  );
}
