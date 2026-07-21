'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import { mergePdfs, downloadBlob } from '@/lib/pdf-engine';
import { Merge, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AdBanner from '@/components/ad-banner';

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const blob = await mergePdfs(files);
      downloadBlob(blob, 'merged.pdf');
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
      <AdBanner slot="top" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3">
            <Merge className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Merge PDF</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Combine multiple PDF files into a single document. Drag to reorder before merging.
        </p>

        <FileUpload
          files={files}
          onFilesAdd={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
          onFileRemove={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
          multiple
          maxFiles={20}
          label="Drop PDF files here to merge them"
        />

        {files.length >= 2 && (
          <AdBanner slot="inline" />
        )}

        {files.length >= 2 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleMerge}
            disabled={processing}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {processing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : done ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <>
                Merge {files.length} PDFs
                <ArrowRight className="h-4 w-4" />
              </>
            )}
            {processing ? 'Processing...' : done ? 'Downloaded!' : ''}
          </motion.button>
        )}

        {files.length > 0 && files.length < 2 && (
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Add at least 2 PDF files to merge.
          </p>
        )}
      </motion.div>
    </div>
  );
}
