import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeProviderWrapper from "@/components/providers/ThemeProviderWrapper";

import type { Metadata } from "next";

import { DM_Serif_Display, Poppins } from "next/font/google";
import BackgroundGrid from "@/components/ui/BackgroundGrid";

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
  description: "Personal Portfolio of Dr.Muhammad Kamran",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${dmSerif.variable} ${poppins.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="min-h-screen antialiased  font-body ">
        <Navbar />

        <BackgroundGrid className="dark:opacity-5" />

        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>

        <Footer />
      </body>
    </html>
  );
}
