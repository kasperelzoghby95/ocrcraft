"use client";

import { useState, useCallback } from "react";
import { ScanText, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AdBanner from "@/components/ad-banner";
import { UploadZone } from "@/components/upload-zone";
import { ImagePreview } from "@/components/image-preview";
import { ExtractionResult } from "@/components/extraction-result";
import { HistoryPanel } from "@/components/history-panel";
import type { ExtractionItem } from "@/types";

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setExtractedText(null);
    setError("");
    setStatusMessage("");
  }, []);

  const handleFileRemove = useCallback(() => {
    setFile(null);
    setExtractedText(null);
    setError("");
    setStatusMessage("");
  }, []);

  const handleExtract = async () => {
    if (!file) return;

    setProcessing(true);
    setError("");
    setStatusMessage("Sending file to AI for analysis...");
    setExtractedText(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      setStatusMessage("AI is processing your file...");

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "OCR processing failed");
      }

      setExtractedText(data.text);
      setStatusMessage("Text extracted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatusMessage("");
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveHistory = async () => {
    if (!extractedText || !file) return;

    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          extractedText,
        }),
      });

      if (res.ok) {
        setRefreshKey((k) => k + 1);
      }
    } catch {}
  };

  const handleSelectHistory = useCallback((item: ExtractionItem) => {
    setExtractedText(item.extractedText);
    setFile(null);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <AdBanner slot="top" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3">
            <ScanText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Image & PDF to Text</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Upload an image or PDF to extract text using AI.
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <UploadZone
              file={file}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
            />

            {file && file.type !== "application/pdf" && (
              <ImagePreview file={file} />
            )}

            {file && !processing && !extractedText && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleExtract}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
              >
                Extract Text <ArrowRight className="h-4 w-4" />
              </motion.button>
            )}

            {processing && (
              <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                <p className="text-sm text-muted-foreground">{statusMessage}</p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {extractedText && (
              <ExtractionResult
                text={extractedText}
                fileName={file?.name || "extracted"}
                fileType={file?.type || "text"}
                onSave={handleSaveHistory}
              />
            )}

            <AdBanner slot="inline" />
          </div>

          <div className="lg:col-span-1">
            <HistoryPanel onSelect={handleSelectHistory} refreshKey={refreshKey} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
