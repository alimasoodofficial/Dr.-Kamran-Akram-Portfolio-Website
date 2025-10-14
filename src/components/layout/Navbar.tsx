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
      <div className="flex items-center justify-between px-5 py-3 md:py-4">
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

        {/* Desktop Nav */}
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

        {/* Right Controls */}
        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />

          <Button
            type="button"
            href="/newsletter"
            className="hidden lg:block btn-gradient text-white font-medium transition-transform duration-700 hover:scale-105"
          >
            Join 1000+ Subscribers
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="h-6 w-6 " />
          </button>
        </div>
      </div>

      {/* ✅ Fullscreen Mobile Menu */}
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
            className=" btn-gradient text-white text-sm px-8 py-3 rounded-2xl font-medium transition-transform hover:scale-105"
          >
            Join 1000+ Subscribers
          </Button>
        </div>
      )}
    </nav>
  );
}
