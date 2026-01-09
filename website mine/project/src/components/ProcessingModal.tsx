import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  progress: number;
  status: 'processing' | 'completed' | 'error';
  message: string;
  onClose: () => void;
}

export default function ProcessingModal({
  isOpen,
  progress,
  status,
  message,
  onClose
}: ProcessingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing...</h3>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{progress}% complete</p>
            </>
          )}
          
          {status === 'completed' && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Complete!</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Results
              </button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Failed</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}