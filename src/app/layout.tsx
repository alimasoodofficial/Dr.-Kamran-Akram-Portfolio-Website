import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

import { DM_Serif_Display, Poppins } from "next/font/google";

// Define fonts
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "DR.KAMRAN",
  description: "Personal website built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${poppins.variable}`}>
      <body className="min-h-screen   antialiased font-body ">
        <div className="" >
        <Navbar />
        </div>
        <main className="  ">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
