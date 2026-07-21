"use client";

import { useState } from "react";
import { Copy, Check, Download, FileText, Save } from "lucide-react";
import { motion } from "framer-motion";

interface ExtractionResultProps {
  text: string;
  fileName: string;
  fileType: string;
  onSave?: () => void;
}

export function ExtractionResult({ text, fileName, fileType, onSave }: ExtractionResultProps) {
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState(text);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([editableText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName.replace(/\.[^.]+$/, "")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>${fileName} - OCR Export</title></head>
        <body>
          <pre style="white-space: pre-wrap; font-family: sans-serif; padding: 20px;">${editableText}</pre>
          <script>
            window.onload = function() { window.print(); };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Extracted Text</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> TXT
          </button>
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
          >
            <FileText className="h-3.5 w-3.5" /> PDF
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors"
            >
              <Save className="h-3.5 w-3.5" /> Save
            </button>
          )}
        </div>
      </div>
      <textarea
        value={editableText}
        onChange={(e) => setEditableText(e.target.value)}
        className="w-full min-h-[250px] rounded-xl border border-border bg-card p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        placeholder="Extracted text will appear here..."
      />
    </motion.div>
  );
}
