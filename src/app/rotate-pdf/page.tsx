'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import { rotatePages, downloadBlob, getPdfPageCount } from '@/lib/pdf-engine';
import { RotateCw, ArrowRight, Loader2, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdBanner from '@/components/ad-banner';

interface RotationEntry {
  pageIndex: number;
  degrees: number;
}

export default function RotatePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [rotations, setRotations] = useState<RotationEntry[]>([{ pageIndex: 0, degrees: 90 }]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handleFileAdd = async (newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
    if (newFiles[0]) {
      const count = await getPdfPageCount(newFiles[0]);
      setPageCount(count);
    }
  };

  const addRotation = () => {
    setRotations((prev) => [...prev, { pageIndex: 0, degrees: 90 }]);
  };

  const removeRotation = (index: number) => {
    setRotations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRotation = (index: number, field: keyof RotationEntry, value: number) => {
    setRotations((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const handleRotate = async () => {
    if (files.length !== 1) return;
    setProcessing(true);
    try {
      const blob = await rotatePages(files[0], rotations);
      downloadBlob(blob, `rotated-${files[0].name}`);
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
          <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-3">
            <RotateCw className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Rotate PDF</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Rotate specific pages to any angle. Add multiple rotation rules.
        </p>

        <FileUpload
          files={files}
          onFilesAdd={handleFileAdd}
          onFileRemove={() => { setFiles([]); setPageCount(0); }}
          multiple={false}
          maxFiles={1}
          label="Drop a PDF file to rotate pages"
        />

        {files.length === 1 && pageCount > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                PDF has {pageCount} page{pageCount !== 1 ? 's' : ''}
              </p>
              <button
                onClick={addRotation}
                className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Rule
              </button>
            </div>

            <AnimatePresence>
              {rotations.map((rot, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span className="text-sm text-muted-foreground shrink-0">Page</span>
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={rot.pageIndex + 1}
                    onChange={(e) => updateRotation(index, 'pageIndex', Math.max(0, Math.min(pageCount - 1, Number(e.target.value) - 1)))}
                    className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-sm text-center focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <span className="text-sm text-muted-foreground shrink-0">rotate</span>
                  <select
                    value={rot.degrees}
                    onChange={(e) => updateRotation(index, 'degrees', Number(e.target.value))}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value={90}>90° CW</option>
                    <option value={180}>180°</option>
                    <option value={270}>90° CCW</option>
                  </select>
                  {rotations.length > 1 && (
                    <button
                      onClick={() => removeRotation(index)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <AdBanner slot="inline" />

            <button
              onClick={handleRotate}
              disabled={processing}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : done ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <>
                  Apply Rotations
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
