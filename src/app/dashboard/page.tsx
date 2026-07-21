"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LogOut, Loader2, ScanText, History, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import type { ExtractionItem } from "@/types";
import { HistoryPanel } from "@/components/history-panel";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; name?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<ExtractionItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.user) {
          router.push("/signin");
          return;
        }
        setUser(data.user);
      } catch {
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleSelectHistory = useCallback((item: ExtractionItem) => {
    setSelectedHistory(item);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name || user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/convert"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              <ScanText className="h-4 w-4" /> New Conversion
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <HistoryPanel onSelect={handleSelectHistory} refreshKey={refreshKey} />
          </div>
          <div className="lg:col-span-2">
            {selectedHistory ? (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{selectedHistory.fileName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selectedHistory.createdAt).toLocaleString()} &middot; {selectedHistory.fileType}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedHistory.extractedText)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <textarea
                  readOnly
                  value={selectedHistory.extractedText}
                  className="w-full min-h-[300px] rounded-xl border border-border bg-background p-4 text-sm font-mono resize-y"
                />
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-border p-16 text-center">
                <History className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Select a history item to view its content</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
