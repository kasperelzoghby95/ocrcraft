"use client";

import { useState, useRef, useEffect } from "react";
import { RotateCw, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface ImagePreviewProps {
  file: File;
}

export function ImagePreview({ file }: ImagePreviewProps) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (file.type === "application/pdf") {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">PDF preview not available</p>
        <p className="text-xs text-muted-foreground mt-1">File: {file.name}</p>
      </div>
    );
  }

  if (!previewUrl) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setRotation((r) => r - 90)}
          className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Rotate left"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={() => setRotation((r) => r + 90)}
          className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Rotate right"
        >
          <RotateCw className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(25, z - 25))}
          className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="text-xs text-muted-foreground w-10 text-center">{zoom}%</span>
        <button
          onClick={() => setZoom((z) => Math.min(200, z + 25))}
          className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>
      <div className="flex justify-center rounded-xl border border-border bg-card p-4 overflow-hidden">
        <img
          src={previewUrl}
          alt="Preview"
          className="max-h-[400px] object-contain transition-all"
          style={{ transform: `rotate(${rotation}deg) scale(${zoom / 100})` }}
        />
      </div>
    </div>
  );
}
