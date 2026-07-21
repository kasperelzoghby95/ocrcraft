import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

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
    default: "PDFCraft - Free Online PDF Tools",
    template: "%s | PDFCraft",
  },
  description:
    "Free, privacy-first PDF tools. Merge, split, compress, rotate PDFs entirely in your browser. No uploads, no servers.",
  keywords: ["pdf", "merge pdf", "split pdf", "compress pdf", "rotate pdf", "pdf editor", "free pdf tools"],
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} PDFCraft. All processing happens in your browser.</p>
          </footer>
        </ThemeProvider>

        {/* Adsterra Popunder */}
        <Script
          src="https://pl30458916.effectivecpmnetwork.com/8c/4c/7a/8c4c7ac62b5c5de7acfcb03c03e5b5be.js"
          strategy="afterInteractive"
        />

        {/* Adsterra Social Bar */}
        <Script
          src="https://pl30458917.effectivecpmnetwork.com/4c/22/85/4c228521585c23f34ae4eb829f1e7193.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
