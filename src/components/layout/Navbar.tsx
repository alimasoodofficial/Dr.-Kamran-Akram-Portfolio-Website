"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/data/navLinks";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[var(--background)] text-[var(--foreground)] z-50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-heading font-bold flex items-center gap-1"
        >
          <span className="text-2xl text-[var(--foreground)]">mk.</span>
          <span className="hidden md:block text-orange-500 dark:text-purple-500 transition-colors duration-300">
            |
          </span>
          <span className="font-extralight font-body hidden md:block">
            Kamran Akram
          </span>
        </Link>

        {/* Centered Desktop Nav */}
        <div className="hidden lg:flex gap-8 font-body font-medium ml-auto mr-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-orange-500"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side Controls (Always aligned right) */}
        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />

          <Button
            type="button"
            href="/newsletter"
            className="hidden lg:block btn-gradient text-white   font-medium transition-transform duration-700 hover:scale-105"
          >
            Join 1000+ Subscribers
          </Button>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0  bg-white dark:bg-[linear-gradient(177.6deg,_rgba(20,0,113,1)_15.3%,_rgba(1,0,62,1)_91.3%)] text-[var(--foreground)] flex flex-col items-center justify-center space-y-8 text-lg font-body z-50 transition-colors duration-300">
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 p-2"
            onClick={() => setIsOpen(false)}
            aria-label="Close Menu"
          >
            <X className="h-7 w-7" />
          </button>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="transition-colors text-2xl font-medium hover:text-orange-500"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
