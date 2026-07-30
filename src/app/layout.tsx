import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const domain = "https://waguy02.github.io/PHD-Research-Website";

export const metadata: Metadata = {
  title: {
    default: "Guy Stephane Waffo Dzuyo — PhD Research",
    template: "%s — Guy Stephane Waffo Dzuyo",
  },
  description:
    "PhD candidate at LORIA / Forvis Mazars. Research in NLP for Auditing, Financial NLP, and Financial Fraud Detection using LLMs.",
  authors: [{ name: "Guy Stephane Waffo Dzuyo" }],
  creator: "Guy Stephane Waffo Dzuyo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: domain,
    siteName: "Guy Stephane Waffo Dzuyo — PhD Research",
    title: "Guy Stephane Waffo Dzuyo — PhD Research",
    description:
      "PhD candidate at LORIA / Forvis Mazars. Research in NLP for Auditing, Financial NLP, and Financial Fraud Detection using LLMs.",
    images: [
      {
        url: `${domain}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Guy Stephane Waffo Dzuyo — PhD Research",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@waguy02",
    title: "Guy Stephane Waffo Dzuyo — PhD Research",
    description:
      "PhD candidate at LORIA / Forvis Mazars. Research in NLP for Auditing, Financial NLP, and Financial Fraud Detection using LLMs.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    other: {
      "google-site-verification": "",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/favicon.svg" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}