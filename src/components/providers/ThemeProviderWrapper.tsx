"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function ThemeProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={true}
      forcedTheme={isAdmin ? "light" : undefined}
    >
      {children}
      {/* Global toast container so any import of toast() will render */}
      <Toaster />
    </ThemeProvider>
  );
}
