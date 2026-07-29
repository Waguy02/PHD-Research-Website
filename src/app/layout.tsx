import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guy Stephane Waffo Dzuyo — PhD Research",
  description:
    "PhD candidate at LORIA / Forvis Mazars. Research in NLP for Auditing, Financial Fraud Detection, and Multimodal Time-Series Forecasting.",
  openGraph: {
    title: "Guy Stephane Waffo Dzuyo — PhD Research",
    description:
      "PhD candidate at LORIA / Forvis Mazars. Research in NLP for Auditing, Financial Fraud Detection, and Multimodal Time-Series Forecasting.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
