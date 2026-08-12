import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Installbanner from "./component/InstallBanner";
import ScrollProgress from "./component/ScrollProgress";
import ErrorBoundary from "./component/ErrorBoundary";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cssf-funaab.vercel.app"),

  title: {
    default:
      "CSSF FUNAAB – Cherubim and Seraphim Unification Campus Fellowship",
    template: "%s | CSSF FUNAAB",
  },

  description:
    "Official website of the Cherubim and Seraphim Unification Campus Fellowship (CSSF), FUNAAB Chapter. Join our fellowship for worship, spiritual growth, and campus activities in Abeokuta.",

  keywords: [
    "CSSF FUNAAB",
    "Cherubim and Seraphim FUNAAB",
    "Cherubim and Seraphim campus fellowship",
    "C&S fellowship FUNAAB",
    "Christian fellowship Abeokuta",
    "campus fellowship Nigeria",
    "church fellowship FUNAAB",
  ],

  authors: [
    {
      name: "Ayokunle Shittu",
      url: "https://www.ayostack.dev",
    },
  ],
  creator: "Ayokunle Shittu",

  alternates: {
    canonical: "https://cssf-funaab.vercel.app",
  },

  openGraph: {
    title:
      "CSSF FUNAAB – Cherubim and Seraphim Unification Campus Fellowship",
    description:
      "Join CSSF FUNAAB for worship, spiritual growth, and campus fellowship activities.",
    url: "https://cssf-funaab.vercel.app",
    siteName: "CSSF FUNAAB",
    images: [
      {
        url: "/img/CSSF-FUNAAB-LOGO.jpg",
        width: 1200,
        height: 630,
        alt: "CSSF FUNAAB Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "CSSF FUNAAB – Cherubim and Seraphim Unification Campus Fellowship",
    description:
      "Official CSSF FUNAAB portal for worship, fellowship, and events.",
    images: ["/img/CSSF-FUNAAB-LOGO.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  manifest: "/manifest.json",

  icons: {
    icon: "/img/CSSF-FUNAAB-LOGO.jpg",
    apple: "/img/CSSF-FUNAAB-LOGO.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <Toaster position="top-center" richColors closeButton />
          <ScrollProgress />
          {children}
          <Installbanner />
          <Analytics />

          {/* ✅ GOOGLE ANALYTICS */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-PG6L1YWCM7"
            strategy="beforeInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PG6L1YWCM7');
            `}
          </Script>

          {/* 🔥 STRUCTURED DATA */}
          <Script
            id="structured-data"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Church",
                name: "Cherubim and Seraphim Unification Campus Fellowship FUNAAB",
                url: "https://cssf-funaab.vercel.app",
                logo: "https://cssf-funaab.vercel.app/img/CSSF-FUNAAB-LOGO.jpg",
                description:
                  "Cherubim and Seraphim Unification Campus Fellowship (CSSF) FUNAAB focused on worship, spiritual growth, and campus fellowship.",
                sameAs: [
                  "https://instagram.com/",
                  "https://facebook.com/",
                ],
              }),
            }}
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}