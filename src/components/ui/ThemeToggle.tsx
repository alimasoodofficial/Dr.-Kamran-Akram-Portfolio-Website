"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  // ✅ Apply theme early on mount (avoids flicker)
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // ✅ Handle toggle
  const toggleTheme = () => {
    if (!theme) return;
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // ⏳ Prevent rendering before theme is known (fixes hydration mismatch)
  if (!theme) return null;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:scale-110"
    >
      {theme === "light" ? (
        <Moon size={20} className="transition-transform duration-300" />
      ) : (
        <Sun size={20} className="transition-transform duration-300 rotate-180" />
      )}
    </button>
  );
}
