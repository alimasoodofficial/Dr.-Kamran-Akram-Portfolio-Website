"use client";
import { useState, useEffect } from "react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="p-4 border-t text-center mt-8">
      <p>
        © {year ?? ""} My Website. All rights reserved.
      </p>
    </footer>
  );
}
