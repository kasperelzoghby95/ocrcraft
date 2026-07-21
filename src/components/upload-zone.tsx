"use client";

import { useState, useCallback } from "react";
import { Upload, File, X, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface UploadZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

export function UploadZone({ file, onFileSelect, onFileRemove }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && ACCEPTED_TYPES.includes(droppedFile.type)) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  if (file) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              {file.type === "application/pdf" ? (
                <FileText className="h-5 w-5 text-blue-500" />
              ) : (
                <File className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[400px]">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={onFileRemove}
            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
        dragging
          ? "border-blue-500 bg-blue-500/5"
          : "border-border hover:border-blue-500/50 hover:bg-muted/50"
      }`}
    >
      <input
        type="file"
        onChange={handleFileInput}
        accept=".png,.jpg,.jpeg,.webp,.pdf"
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-xl bg-blue-500/10 p-4">
          <Upload className="h-8 w-8 text-blue-500" />
        </div>
        <div>
          <p className="text-base font-medium">
            Drag & drop or click to upload
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            PNG, JPG, WEBP or PDF (up to 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
