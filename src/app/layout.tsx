import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DR.KAMRAN",
  description: "Personal website built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // ✅ typed children
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen p-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
