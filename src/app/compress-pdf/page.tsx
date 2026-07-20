'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import { compressPdf, downloadBlob } from '@/lib/pdf-engine';
import { Minimize2, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdBanner } from '@/components/ad-banner';

export default function CompressPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null);

  const handleCompress = async () => {
    if (files.length !== 1) return;
    setProcessing(true);
    setResult(null);
    try {
      const blob = await compressPdf(files[0]);
      setResult({
        original: files[0].size,
        compressed: blob.size,
      });
      downloadBlob(blob, `compressed-${files[0].name}`);
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
          <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3">
            <Minimize2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Compress PDF</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Reduce PDF file size by removing metadata and optimizing structure.
        </p>

        <FileUpload
          files={files}
          onFilesAdd={(f) => setFiles(f.slice(0, 1))}
          onFileRemove={() => { setFiles([]); setResult(null); }}
          multiple={false}
          maxFiles={1}
          label="Drop a PDF file to compress"
        />

        {files.length === 1 && (
          <div className="mt-6 space-y-4">
            <AdBanner slot="inline" />
            <button
              onClick={handleCompress}
              disabled={processing}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-500/25 hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : done ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <>
                  Compress PDF
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
              {processing ? 'Compressing...' : done ? 'Downloaded!' : ''}
            </button>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-green-500/30 bg-green-500/5 p-4"
              >
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Size: {(result.original / 1024).toFixed(1)} KB → {(result.compressed / 1024).toFixed(1)} KB
                  {result.compressed < result.original && (
                    <span className="ml-2">
                      ({((1 - result.compressed / result.original) * 100).toFixed(1)}% smaller)
                    </span>
                  )}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
