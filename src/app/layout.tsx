import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Installbanner from './component/Installbanner' // 1. Ensure this path is correct

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSSF FUNAAB | Christian Students Fellowship", 
  description: "Official portal for the Christian Students Fellowship, FUNAAB Chapter.",
  manifest: "/manifest.json", 
  icons: {
    icon: "/img/CSSF-FUNAAB-LOGO.jpg",
    apple: "/img/CSSF-FUNAAB-LOGO.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Installbanner /> 
        <Analytics/>
      </body>
    </html>
  );
}