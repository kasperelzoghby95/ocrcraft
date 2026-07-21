import Link from 'next/link';
import {
  Merge,
  Scissors,
  Minimize2,
  RotateCw,
  Workflow,
  Shield,
  Zap,
  Globe,
  ArrowRight,
} from 'lucide-react';
import AdBanner from '@/components/ad-banner';

const tools = [
  {
    href: '/merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into a single document instantly.',
    icon: Merge,
    color: 'from-blue-500 to-blue-600',
  },
  {
    href: '/split-pdf',
    title: 'Split PDF',
    description: 'Extract specific pages or split a PDF into multiple files.',
    icon: Scissors,
    color: 'from-purple-500 to-purple-600',
  },
  {
    href: '/compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality.',
    icon: Minimize2,
    color: 'from-green-500 to-green-600',
  },
  {
    href: '/rotate-pdf',
    title: 'Rotate PDF',
    description: 'Rotate PDF pages to any angle with precision.',
    icon: RotateCw,
    color: 'from-orange-500 to-orange-600',
  },
  {
    href: '/workflow-editor',
    title: 'Workflow Editor',
    description: 'Chain multiple PDF operations into automated workflows.',
    icon: Workflow,
    color: 'from-pink-500 to-pink-600',
  },
];

const features = [
  {
    icon: Shield,
    title: '100% Private',
    description: 'All processing happens in your browser. Files never leave your device.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Client-side WebAssembly engine for zero-latency PDF operations.',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'No installation needed. Works on any modern browser, any OS.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Top Ad Banner */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-4">
        <AdBanner slot="top" />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <Zap className="h-3.5 w-3.5 text-yellow-500" />
            100% client-side processing
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            PDF Tools that
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              respect your privacy
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Merge, split, compress, rotate, and transform your PDF files entirely in your browser.
            No uploads. No servers. Complete privacy.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/merge-pdf"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-colors"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/workflow-editor"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
            >
              Try Workflow Editor
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => {
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

      {/* Tools Grid */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">All PDF Tools</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all hover:border-blue-500/30"
                >
                  <div className={`inline-flex rounded-xl bg-gradient-to-br ${tool.color} p-3 mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-blue-500 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
                  <ArrowRight className="absolute right-6 top-6 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inline Ad */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <AdBanner slot="inline" />
      </div>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-muted-foreground">
            No account required. Pick a tool and start working with your PDFs.
          </p>
          <Link
            href="/merge-pdf"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-colors"
          >
            Launch PDFCraft
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
