// src/components/layout/Navbar.js
import Link from "next/link";
import { navLinks } from "@/data/navLinks";

export default function Navbar() {
  return (
    <nav className="p-4 border-b flex gap-6">
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
