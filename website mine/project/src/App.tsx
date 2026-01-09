import React, { useState } from 'react';
import { 
  FileImage, 
  FileText, 
  File, 
  Combine, 
  Minimize2, 
  Image as ImageIcon,
  FileX
} from 'lucide-react';
import ConversionOption from './components/ConversionOption';
import ConversionInterface from './components/ConversionInterface';
import DownloadPage from './components/DownloadPage';
import { ConversionType, ProcessedFile } from './types';

type AppState = 'home' | 'converter' | 'download';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [selectedConversion, setSelectedConversion] = useState<ConversionType>('image-to-pdf');
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);

  const conversionOptions = [
    {
      icon: FileImage,
      title: 'Images to PDF',
      description: 'Convert single or multiple images into a PDF document',
      type: 'image-to-pdf' as ConversionType,
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      icon: FileText,
      title: 'PDF to Images',
      description: 'Extract pages from PDF as individual image files',
      type: 'pdf-to-image' as ConversionType,
      gradient: 'from-purple-600 to-purple-800'
    },
    {
      icon: File,
      title: 'Word to PDF',
      description: 'Convert Word documents to PDF format',
      type: 'word-to-pdf' as ConversionType,
      gradient: 'from-green-600 to-green-800'
    },
    {
      icon: FileText,
      title: 'PDF to Word',
      description: 'Convert PDF files to editable Word documents',
      type: 'pdf-to-word' as ConversionType,
      gradient: 'from-indigo-600 to-indigo-800'
    },
    {
      icon: File,
      title: 'PowerPoint to PDF',
      description: 'Convert presentations to PDF format',
      type: 'ppt-to-pdf' as ConversionType,
      gradient: 'from-orange-600 to-orange-800'
    },
    {
      icon: FileText,
      title: 'PDF to PowerPoint',
      description: 'Convert PDF files to PowerPoint presentations',
      type: 'pdf-to-ppt' as ConversionType,
      gradient: 'from-red-600 to-red-800'
    },
    {
      icon: Combine,
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into a single document',
      type: 'pdf-merge' as ConversionType,
      gradient: 'from-teal-600 to-teal-800'
    },
    {
      icon: Minimize2,
      title: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      type: 'pdf-compress' as ConversionType,
      gradient: 'from-pink-600 to-pink-800'
    },
    {
      icon: ImageIcon,
      title: 'Compress Images',
      description: 'Optimize image files to reduce their size',
      type: 'image-compress' as ConversionType,
      gradient: 'from-cyan-600 to-cyan-800'
    }
  ];

  const handleConversionSelect = (type: ConversionType) => {
    setSelectedConversion(type);
    setCurrentState('converter');
  };

  const handleConversionComplete = (files: ProcessedFile[]) => {
    setProcessedFiles(files);
    setCurrentState('download');
  };

  const handleBackToHome = () => {
    setCurrentState('home');
    setProcessedFiles([]);
  };

  if (currentState === 'download') {
    return (
      <DownloadPage 
        files={processedFiles}
        onBack={handleBackToHome}
      />
    );
  }

  if (currentState === 'converter') {
    return (
      <ConversionInterface
        type={selectedConversion}
        onBack={handleBackToHome}
        onComplete={handleConversionComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileX className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">FileConverter Pro</h1>
            </div>
            <div className="text-sm text-gray-600">
              Free & Secure File Conversion
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Convert, Compress & Edit Files
            <span className="block text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
              With Professional Quality
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your documents and images with our comprehensive suite of conversion tools. 
            Fast, secure, and completely free to use.
          </p>
        </div>
      </section>

      {/* Conversion Options Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Conversion</h3>
            <p className="text-lg text-gray-600">Select the type of conversion you need</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {conversionOptions.map((option) => (
              <ConversionOption
                key={option.type}
                icon={option.icon}
                title={option.title}
                description={option.description}
                gradient={option.gradient}
                onClick={() => handleConversionSelect(option.type)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FileConverter Pro?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileX className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Fast Processing</h4>
              <p className="text-gray-600">Lightning-fast conversions with optimized algorithms</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Minimize2 className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Smart Compression</h4>
              <p className="text-gray-600">Advanced compression technology to reduce file sizes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Combine className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Batch Processing</h4>
              <p className="text-gray-600">Convert multiple files at once to save time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileX className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">FileConverter Pro</span>
          </div>
          <p className="text-gray-400">
            © 2025 FileConverter Pro. All rights reserved. Built with modern web technologies.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;