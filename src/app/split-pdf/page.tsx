'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import { splitPdf, downloadBlob } from '@/lib/pdf-engine';
import { Scissors, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdBanner } from '@/components/ad-banner';

export default function SplitPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [ranges, setRanges] = useState('1-3');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handleSplit = async () => {
    if (files.length !== 1 || !ranges.trim()) return;
    setProcessing(true);
    try {
      const blob = await splitPdf(files[0], ranges.split(','));
      downloadBlob(blob, 'split.pdf');
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <AdBanner slot="top" className="mb-8" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3">
            <Scissors className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Split PDF</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Extract specific pages from a PDF. Specify page ranges like &quot;1-3,5,7-9&quot;.
        </p>

        <FileUpload
          files={files}
          onFilesAdd={(f) => setFiles(f.slice(0, 1))}
          onFileRemove={() => setFiles([])}
          multiple={false}
          maxFiles={1}
          label="Drop a PDF file to split"
        />

        {files.length === 1 && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Page Ranges</label>
              <input
                type="text"
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                placeholder="e.g. 1-3,5,7-9"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Separate ranges with commas. Use hyphens for ranges.
              </p>
            </div>
            <AdBanner slot="inline" />
            <button
              onClick={handleSplit}
              disabled={processing || !ranges.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:bg-purple-600 disabled:opacity-50 transition-colors"
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : done ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <>
                  Split PDF
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
              {processing ? 'Processing...' : done ? 'Downloaded!' : ''}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
