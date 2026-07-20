import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      </body>
    </html>
  );
}
