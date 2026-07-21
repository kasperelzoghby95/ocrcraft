"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScanText, Menu, X, LogIn, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/convert", label: "Convert" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<{ user: { name?: string | null; email?: string | null } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setSession(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl">
          <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
            <ScanText className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            OCRcraft
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm font-medium transition-colors hover:text-foreground",
                pathname === link.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!loading && !session && (
            <>
              <Link
                href="/signin"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
          {!loading && session && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "block text-sm font-medium transition-colors",
                pathname === link.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border pt-3 flex flex-col gap-2">
            {!session ? (
              <>
                <Link href="/signin" onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium">
                  <LogIn className="h-4 w-4" /> Sign In
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white">
                  Sign Up
                </Link>
              </>
            ) : (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
