import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OCRcraft - Unlimited Image & PDF to Text Converter",
    template: "%s | OCRcraft",
  },
  description:
    "Convert images and PDFs to text instantly using AI-powered OCR. Free, unlimited image-to-text conversion with support for PNG, JPG, WEBP, and PDF files.",
  keywords: ["ocr", "image to text", "pdf to text", "text extraction", "optical character recognition", "free ocr"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="darkreader-lock" content="none" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </Providers>

        <Script
          id="adsterra-popunder"
          src="https://pl30458916.effectivecpmnetwork.com/8c/4c/7a/8c4c7ac62b5c5de7acfcb03c03e5b5be.js"
          strategy="afterInteractive"
        />

        <Script
          id="adsterra-social-bar"
          src="https://pl30458917.effectivecpmnetwork.com/4c/22/85/4c228521585c23f34ae4eb829f1e7193.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
