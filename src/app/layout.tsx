import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeProviderWrapper from "@/components/providers/ThemeProviderWrapper";

import type { Metadata } from "next";

import { DM_Serif_Display, Poppins } from "@next/font/google";

// Define fonts
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "DR.Muhammad Kamran",
  description: "Personal Portfolio of Dr.Muhammad Kamran",};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className={`${dmSerif.variable} ${poppins.variable}`}>
      <body className="min-h-screen antialiased  font-body ">
        <Navbar />
      

        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
            
        <Footer />
      </body>
    </html>
  );
}
