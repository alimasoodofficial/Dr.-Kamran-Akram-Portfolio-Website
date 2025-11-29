"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function ThemeProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      {children}
      {/* Global toast container so any import of toast() will render */}
      <Toaster />
    </ThemeProvider>
  );
}
