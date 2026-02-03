import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalHeader } from "@/components/ui/GlobalHeader";
import { GlobalFooter } from "@/components/ui/GlobalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hardik Bagaria - Java Backend Developer",
  description: "Junior Java Backend Developer building practical applications with Spring Boot, REST APIs, and databases. Open to backend roles and internships.",
  metadataBase: new URL('https://hardikcodes.com'),
  keywords: ["Java Developer", "Spring Boot", "Backend Developer", "REST API", "Junior Developer", "Hardik Bagaria"],
  authors: [{ name: "Hardik Bagaria" }],
  creator: "Hardik Bagaria",
  openGraph: {
    title: "Hardik Bagaria - Java Backend Developer",
    description: "Junior Java Backend Developer building practical applications with Spring Boot, REST APIs, and databases. Open to backend roles and internships.",
    url: "https://hardikcodes.com",
    siteName: "Hardik Bagaria - Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hardik Bagaria - Java Backend Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hardik Bagaria - Java Backend Developer",
    description: "Junior Java Backend Developer building practical applications with Spring Boot, REST APIs, and databases.",
    images: ["/og-image.png"],
    creator: "@hardikbagaria",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalHeader />
        {children}
        <GlobalFooter />
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
