'use client';

import React, { useState } from 'react';
import { X, Copy, Download, Send, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JsonPreviewModalProps {
  jsonString: string;
  onClose: () => void;
  onSend?: () => void;
  title?: string;
}

export function JsonPreviewModal({ 
  jsonString, 
  onClose, 
  onSend,
  title = "Generated JSON Response" 
}: JsonPreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [formatted, setFormatted] = useState(true);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customs-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFormat = () => {
    setFormatted(!formatted);
  };

  const displayJson = formatted 
    ? jsonString 
    : JSON.stringify(JSON.parse(jsonString));

  const jsonSize = new Blob([jsonString]).size;
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Size: {formatSize(jsonSize)} • Lines: {jsonString.split('\n').length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFormat}
                className="btn btn-secondary"
              >
                {formatted ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {formatted ? 'Minify' : 'Format'}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                className={cn(
                  'btn',
                  copied ? 'btn-success' : 'btn-secondary'
                )}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </button>

              <button
                onClick={downloadJson}
                className="btn btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>

              {onSend && (
                <button
                  onClick={onSend}
                  className="btn btn-primary"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send to API
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto p-6">
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-auto">
                <code className="language-json">{displayJson}</code>
              </pre>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              Ready to submit to customs API
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="btn btn-secondary"
              >
                Close
              </button>
              {onSend && (
                <button
                  onClick={onSend}
                  className="btn btn-primary"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send to API
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
