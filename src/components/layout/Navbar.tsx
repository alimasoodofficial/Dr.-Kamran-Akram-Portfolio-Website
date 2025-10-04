"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/data/navLinks";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="  pt-1 md:pt-6 container-bg-color rounded-t-2xl  z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-heading font-bold">
          DR.KAMRAN
        </Link>

        {/* Desktop Nav */}
        <div className="hidden  lg:flex  gap-8 text-medium font-body font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-gray-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
    < Button type="button" href="/newsletter" className="hidden lg:block bg-orange-300">
        Newsletter
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

      {/* Fullscreen Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center space-y-8 text-lg font-body z-50">
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 p-2 "
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
              className="hover:text-gray-600 transition-colors text-2xl font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
