import React, { useState } from 'react';
import { ArrowLeft, Settings, Sliders } from 'lucide-react';
import FileUpload from './FileUpload';
import ProcessingModal from './ProcessingModal';
import { ConversionType, ConversionOptions, ProcessedFile } from '../types';
import { FileProcessor } from '../utils/fileProcessor';

interface ConversionInterfaceProps {
  type: ConversionType;
  onBack: () => void;
  onComplete: (files: ProcessedFile[]) => void;
}

export default function ConversionInterface({
  type,
  onBack,
  onComplete
}: ConversionInterfaceProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<ConversionOptions>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'completed' | 'error'>('processing');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const getConversionConfig = () => {
    const configs = {
      'image-to-pdf': {
        title: 'Images to PDF',
        description: 'Select images to convert to PDF',
        acceptedTypes: 'image/jpeg,image/png,image/gif,image/webp',
        multiple: true
      },
      'pdf-to-image': {
        title: 'PDF to Images',
        description: 'Select PDF files to convert to images',
        acceptedTypes: 'application/pdf',
        multiple: false
      },
      'word-to-pdf': {
        title: 'Word to PDF',
        description: 'Select Word documents to convert to PDF',
        acceptedTypes: '.doc,.docx,application/msword',
        multiple: true
      },
      'pdf-to-word': {
        title: 'PDF to Word',
        description: 'Select PDF files to convert to Word documents',
        acceptedTypes: 'application/pdf',
        multiple: true
      },
      'ppt-to-pdf': {
        title: 'PowerPoint to PDF',
        description: 'Select PowerPoint presentations to convert to PDF',
        acceptedTypes: '.ppt,.pptx,application/vnd.ms-powerpoint',
        multiple: true
      },
      'pdf-to-ppt': {
        title: 'PDF to PowerPoint',
        description: 'Select PDF files to convert to PowerPoint presentations',
        acceptedTypes: 'application/pdf',
        multiple: true
      },
      'pdf-merge': {
        title: 'Merge PDFs',
        description: 'Select multiple PDF files to merge into one',
        acceptedTypes: 'application/pdf',
        multiple: true
      },
      'pdf-compress': {
        title: 'Compress PDF',
        description: 'Select PDF files to compress',
        acceptedTypes: 'application/pdf',
        multiple: true
      },
      'image-compress': {
        title: 'Compress Images',
        description: 'Select images to compress',
        acceptedTypes: 'image/jpeg,image/png,image/gif,image/webp',
        multiple: true
      }
    };
    return configs[type] || configs['image-to-pdf'];
  };

  const config = getConversionConfig();

  const handleProcess = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessingStatus('processing');
    setProcessingMessage('Preparing files for conversion...');

    try {
      let results: ProcessedFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        setProgress(Math.round(((i + 1) / files.length) * 100));
        setProcessingMessage(`Processing file ${i + 1} of ${files.length}...`);
        
        let result: ProcessedFile | ProcessedFile[];
        
        switch (type) {
          case 'image-to-pdf':
            result = await FileProcessor.imagesToPDF(files, options);
            results = [result];
            break;
          case 'pdf-to-image':
            result = await FileProcessor.pdfToImages(files[i], options);
            results.push(...result);
            break;
          case 'pdf-merge':
            if (i === 0) { // Only process once for merge
              result = await FileProcessor.mergePDFs(files);
              results = [result];
            }
            break;
          case 'pdf-compress':
            result = await FileProcessor.compressPDF(files[i], options);
            results.push(result);
            break;
          case 'image-compress':
            result = await FileProcessor.compressImage(files[i], options);
            results.push(result);
            break;
          case 'word-to-pdf':
          case 'pdf-to-word':
          case 'ppt-to-pdf':
          case 'pdf-to-ppt':
            const targetType = type.includes('to-pdf') ? 'pdf' : 
                              type.includes('word') ? 'word' : 'powerpoint';
            result = await FileProcessor.simulateDocumentConversion(files[i], targetType);
            results.push(result);
            break;
        }
        
        if (type === 'pdf-merge') break; // Exit loop for merge operation
      }

      setProgress(100);
      setProcessingMessage('Conversion completed successfully!');
      setProcessingStatus('completed');
      
      setTimeout(() => {
        onComplete(results);
        setIsProcessing(false);
      }, 1500);
      
    } catch (error) {
      setProcessingStatus('error');
      setProcessingMessage('An error occurred during processing. Please try again.');
      console.error('Processing error:', error);
    }
  };

  const renderAdvancedOptions = () => {
    if (!showAdvancedOptions) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        {(type === 'pdf-compress' || type === 'image-compress') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compression Level
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={options.compressionLevel || 0.7}
              onChange={(e) => setOptions({ 
                ...options, 
                compressionLevel: parseFloat(e.target.value) 
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Maximum Compression</span>
              <span>Original Quality</span>
            </div>
          </div>
        )}
        
        {type === 'image-compress' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality
            </label>
            <select
              value={options.quality || 0.8}
              onChange={(e) => setOptions({ 
                ...options, 
                quality: parseFloat(e.target.value) 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0.3}>High Compression (30%)</option>
              <option value={0.5}>Medium Compression (50%)</option>
              <option value={0.7}>Low Compression (70%)</option>
              <option value={0.9}>Minimal Compression (90%)</option>
            </select>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Options</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{config.title}</h1>
            <p className="text-xl text-gray-600">{config.description}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <FileUpload
              title={`Upload ${config.title.split(' ')[0]}`}
              description="Drag and drop your files here, or click to browse"
              acceptedTypes={config.acceptedTypes}
              multiple={config.multiple}
              onFilesSelected={setFiles}
            />

            {files.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Options</h3>
                  <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Advanced Options</span>
                  </button>
                </div>

                {renderAdvancedOptions()}

                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Sliders className="w-5 h-5" />
                  <span>Start Conversion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProcessingModal
        isOpen={isProcessing}
        progress={progress}
        status={processingStatus}
        message={processingMessage}
        onClose={() => setIsProcessing(false)}
      />
    </div>
  );
}