"use client";

import { useState, useEffect } from "react";
import { Clock, Trash2, FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExtractionItem } from "@/types";

interface HistoryPanelProps {
  onSelect: (item: ExtractionItem) => void;
  refreshKey?: number;
}

export function HistoryPanel({ onSelect, refreshKey }: HistoryPanelProps) {
  const [items, setItems] = useState<ExtractionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setItems(data.histories || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {}
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">History</h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No history yet</p>
          </div>
        ) : (
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b border-border last:border-b-0"
              >
                <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors group">
                  <button
                    onClick={() => onSelect(item)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="text-sm font-medium truncate">{item.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()} &middot;{" "}
                      {item.fileType}
                    </p>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
