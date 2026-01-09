export interface ProcessedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  originalSize?: number;
}

export interface ConversionOptions {
  compressionLevel?: number;
  outputFormat?: string;
  quality?: number;
}

export type ConversionType = 
  | 'image-to-pdf'
  | 'pdf-to-image'
  | 'word-to-pdf'
  | 'pdf-to-word'
  | 'ppt-to-pdf'
  | 'pdf-to-ppt'
  | 'pdf-edit'
  | 'pdf-merge'
  | 'pdf-compress'
  | 'image-compress';

export interface ConversionJob {
  id: string;
  type: ConversionType;
  files: File[];
  options: ConversionOptions;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: ProcessedFile[];
  error?: string;
}