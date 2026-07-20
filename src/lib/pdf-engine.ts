import { PDFDocument } from 'pdf-lib';

function parseRanges(ranges: string): number[] {
  const pages: number[] = [];
  for (const part of ranges.split(',')) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(Number);
      for (let i = start; i <= end; i++) pages.push(i);
    } else {
      pages.push(Number(trimmed));
    }
  }
  return [...new Set(pages)].sort((a, b) => a - b);
}

async function readFileAsBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

function toBlob(bytes: Uint8Array): Blob {
  const buf = new ArrayBuffer(bytes.length);
  const view = new Uint8Array(buf);
  view.set(bytes);
  return new Blob([buf], { type: 'application/pdf' });
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await readFileAsBytes(file);
    const doc = await PDFDocument.load(bytes);
    const copiedPages = await merged.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => merged.addPage(page));
  }
  const pdfBytes = await merged.save();
  return toBlob(pdfBytes);
}

export async function splitPdf(file: File, ranges: string[]): Promise<Blob> {
  const bytes = await readFileAsBytes(file);
  const doc = await PDFDocument.load(bytes);
  const newDoc = await PDFDocument.create();
  const pageIndices = parseRanges(ranges.join(',')).map((p) => p - 1);
  const copiedPages = await newDoc.copyPages(doc, pageIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));
  const pdfBytes = await newDoc.save();
  return toBlob(pdfBytes);
}

export async function compressPdf(file: File): Promise<Blob> {
  const bytes = await readFileAsBytes(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(doc, doc.getPageIndices());
  copiedPages.forEach((page) => newDoc.addPage(page));
  const pdfBytes = await newDoc.save({ useObjectStreams: true });
  return toBlob(pdfBytes);
}

export async function rotatePages(
  file: File,
  rotations: { pageIndex: number; degrees: number }[]
): Promise<Blob> {
  const bytes = await readFileAsBytes(file);
  const doc = await PDFDocument.load(bytes);
  for (const { pageIndex, degrees } of rotations) {
    const page = doc.getPage(pageIndex);
    const current = page.getRotation().angle;
    page.setRotation(((current + degrees) % 360) as never);
  }
  const pdfBytes = await doc.save();
  return toBlob(pdfBytes);
}

export async function deletePages(file: File, pageIndices: number[]): Promise<Blob> {
  const bytes = await readFileAsBytes(file);
  const doc = await PDFDocument.load(bytes);
  const remaining = doc.getPageIndices().filter((i) => !pageIndices.includes(i));
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(doc, remaining);
  copiedPages.forEach((page) => newDoc.addPage(page));
  const pdfBytes = await newDoc.save();
  return toBlob(pdfBytes);
}

export async function getPdfPageCount(file: File): Promise<number> {
  const bytes = await readFileAsBytes(file);
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

export async function extractPages(file: File, pageIndices: number[]): Promise<Blob> {
  const bytes = await readFileAsBytes(file);
  const doc = await PDFDocument.load(bytes);
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(doc, pageIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));
  const pdfBytes = await newDoc.save();
  return toBlob(pdfBytes);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
