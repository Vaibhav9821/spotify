// src/utils/fileProcessor.ts
import { ProcessedFile, ConversionOptions } from '../types';

export async function processFiles(
  endpoint: string,
  files: File[],
  extraData?: Record<string, any>
): Promise<Blob> {
  const formData = new FormData();
  files.forEach(f => formData.append("files", f));
  if (extraData) {
    Object.keys(extraData).forEach(k => formData.append(k, extraData[k]));
  }

  const res = await fetch(`http://localhost:8000/${endpoint}`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error(`Processing failed: ${res.statusText}`);
  return await res.blob();
}

export class FileProcessor {
  private static blobToProcessedFile(blob: Blob, name: string, originalSize?: number): ProcessedFile {
    const url = URL.createObjectURL(blob);
    return {
      id: Date.now().toString(),
      name,
      size: blob.size,
      type: blob.type || 'application/octet-stream',
      url,
      originalSize
    };
  }

  static async imagesToPDF(files: File[], options: ConversionOptions = {}): Promise<ProcessedFile> {
    const blob = await processFiles("images-to-pdf", files, options);
    return this.blobToProcessedFile(blob, 'converted.pdf');
  }

  static async pdfToImages(file: File): Promise<ProcessedFile[]> {
    const blob = await processFiles("pdf-to-images", [file]);
    // Backend should return a zip of images
    return [this.blobToProcessedFile(blob, 'pdf-pages.zip')];
  }

  static async mergePDFs(files: File[]): Promise<ProcessedFile> {
    const blob = await processFiles("merge-pdfs", files);
    return this.blobToProcessedFile(blob, 'merged.pdf');
  }

  static async compressPDF(file: File, options: ConversionOptions): Promise<ProcessedFile> {
    const blob = await processFiles("compress-pdf", [file], options);
    return this.blobToProcessedFile(blob, file.name.replace(/\.pdf$/, '-compressed.pdf'), file.size);
  }

  static async compressImage(file: File, options: ConversionOptions): Promise<ProcessedFile> {
    const blob = await processFiles("compress-image", [file], options);
    return this.blobToProcessedFile(blob, file.name.replace(/\.[^/.]+$/, '-compressed.jpg'), file.size);
  }

  static async wordToPDF(file: File): Promise<ProcessedFile> {
    const blob = await processFiles("word-to-pdf", [file]);
    return this.blobToProcessedFile(blob, file.name.replace(/\.[^/.]+$/, '.pdf'));
  }

  static async pdfToWord(file: File): Promise<ProcessedFile> {
    const blob = await processFiles("pdf-to-word", [file]);
    return this.blobToProcessedFile(blob, file.name.replace(/\.pdf$/, '.docx'));
  }

  static async pptToPDF(file: File): Promise<ProcessedFile> {
    const blob = await processFiles("ppt-to-pdf", [file]);
    return this.blobToProcessedFile(blob, file.name.replace(/\.[^/.]+$/, '.pdf'));
  }

  static async pdfToPpt(file: File): Promise<ProcessedFile> {
    const blob = await processFiles("pdf-to-ppt", [file]);
    return this.blobToProcessedFile(blob, file.name.replace(/\.pdf$/, '.pptx'));
  }

  static async editPDF(file: File, edits: Record<string, any>): Promise<ProcessedFile> {
    const blob = await processFiles("edit-pdf", [file], edits);
    return this.blobToProcessedFile(blob, file.name.replace(/\.pdf$/, '-edited.pdf'));
  }
}
