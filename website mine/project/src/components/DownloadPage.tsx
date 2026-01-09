import React, { useState } from 'react';
import { Download, Star, MessageCircle, ArrowLeft } from 'lucide-react';
import { ProcessedFile } from '../types';

interface DownloadPageProps {
  files: ProcessedFile[];
  onBack: () => void;
}

export default function DownloadPage({ files, onBack }: DownloadPageProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleDownload = (file: ProcessedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    files.forEach(file => {
      setTimeout(() => handleDownload(file), 100 * files.indexOf(file));
    });
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send feedback to a backend
    console.log('Feedback submitted:', { rating, feedback });
    setFeedbackSubmitted(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Converter</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Files Are Ready!
          </h1>
          <p className="text-xl text-gray-600">
            Download your processed files below
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Processed Files ({files.length})
              </h2>
              {files.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Download All</span>
                </button>
              )}
            </div>

            <div className="grid gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{file.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.type}</span>
                      {file.originalSize && (
                        <span className="text-green-600 font-medium">
                          {Math.round(((file.originalSize - file.size) / file.originalSize) * 100)}% smaller
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(file)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How was your experience?
            </h2>
            
            {!feedbackSubmitted ? (
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate your experience
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 rounded-full transition-colors ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us more (optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="What did you like? How can we improve?"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Submit Feedback</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Thank you for your feedback!
                </h3>
                <p className="text-gray-600">
                  Your input helps us improve our service.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}