'use client';

import { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  files: File[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
}

export function FileUpload({
  files,
  onFilesAdd,
  onFileRemove,
  multiple = true,
  maxFiles = 20,
  label = 'Drop PDF files here or click to browse',
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const pdfFiles = Array.from(newFiles).filter(
        (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf')
      );
      const remaining = maxFiles - files.length;
      onFilesAdd(pdfFiles.slice(0, remaining));
    },
    [files.length, maxFiles, onFilesAdd]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        className={clsx(
          'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all cursor-pointer',
          dragActive
            ? 'border-blue-500 bg-blue-500/5'
            : 'border-border hover:border-blue-400 hover:bg-muted/50'
        )}
      >
        <Upload className={clsx('h-10 w-10 mb-3', dragActive ? 'text-blue-500' : 'text-muted-foreground')} />
        <p className="text-sm text-muted-foreground text-center">{label}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">PDF files only, max {maxFiles} files</p>
        <input
          id="file-input"
          type="file"
          accept=".pdf,application/pdf"
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      <AnimatePresence>
        {files.map((file, index) => (
          <motion.div
            key={`${file.name}-${index}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <File className="h-5 w-5 text-red-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onFileRemove(index); }}
              className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
