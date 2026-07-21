import Link from "next/link";
import {
  ScanText, Image, ArrowRight,
  Shield, Zap, Edit3, Download, History, FileText,
} from "lucide-react";
import AdBanner from "@/components/ad-banner";

const features = [
  { icon: Image, title: "Images & PDFs", description: "Supports PNG, JPG, WEBP and PDF files." },
  { icon: Zap, title: "AI-Powered", description: "Powered by Hugging Face Inference API for accurate text extraction." },
  { icon: Edit3, title: "Editable Results", description: "Review, edit, and refine extracted text before exporting." },
  { icon: Download, title: "Export Options", description: "Download as TXT or export as PDF with one click." },
  { icon: History, title: "History Tracking", description: "Save and revisit your extraction history anytime." },
  { icon: Shield, title: "Secure Processing", description: "Your files are processed securely and never stored." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 pt-4">
        <AdBanner slot="top" />
      </div>

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <ScanText className="h-3.5 w-3.5 text-blue-500" /> Unlimited AI-powered OCR
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Turn Images & PDFs into<br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Editable Text
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Extract text from images and PDFs instantly using AI. Free, unlimited conversions with support for multiple formats.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/convert"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-colors"
            >
              Start Converting <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            {features.slice(0, 3).map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                    <Icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all hover:border-blue-500/30"
                >
                  <div className="inline-flex rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <AdBanner slot="inline" />
      </div>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold">Ready to extract text?</h2>
          <p className="mt-4 text-muted-foreground">No account required. Just upload and convert.</p>
          <Link
            href="/convert"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-colors"
          >
            Launch OCRcraft <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
