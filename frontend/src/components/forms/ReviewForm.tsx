'use client';

import React, { useState } from 'react';
import { Eye, Download, Send, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { ResponseData } from '@/types';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  data: ResponseData;
  onChange: (data: any) => void;
  errors?: string[];
}

export function ReviewForm({ data, onChange, errors }: ReviewFormProps) {
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [jsonString, setJsonString] = useState('');

  React.useEffect(() => {
    // Generate JSON preview
    try {
      const formatted = JSON.stringify(data, null, 2);
      setJsonString(formatted);
    } catch (error) {
      setJsonString('Error generating JSON preview');
    }
  }, [data]);

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Calculate summary statistics
  const summary = {
    mainDataComplete: !!(data.asalData && data.cif && data.nomorAju),
    barangCount: data.barang?.length || 0,
    entitasCount: data.entitas?.length || 0,
    kemasanCount: data.kemasan?.length || 0,
    kontainerCount: data.kontainer?.length || 0,
    dokumenCount: data.dokumen?.length || 0,
    pengangkutCount: data.pengangkut?.length || 0,
  };

  const totalItems = summary.barangCount + summary.entitasCount + summary.kemasanCount + 
                    summary.kontainerCount + summary.dokumenCount + summary.pengangkutCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Review & Generate JSON</h3>
        <p className="text-sm text-gray-600 mt-1">
          Review your data and generate the final JSON for submission
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
              summary.mainDataComplete ? 'bg-green-100' : 'bg-red-100'
            )}>
              {summary.mainDataComplete ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Main Data</p>
              <p className="text-sm text-gray-500">
                {summary.mainDataComplete ? 'Complete' : 'Incomplete'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Barang Items</p>
              <p className="text-sm text-gray-500">{summary.barangCount} items</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Entitas</p>
              <p className="text-sm text-gray-500">{summary.entitasCount} entities</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Other Items</p>
              <p className="text-sm text-gray-500">
                {summary.kemasanCount + summary.kontainerCount + summary.dokumenCount + summary.pengangkutCount} items
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Data Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Main Information</h5>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Asal Data:</dt>
                <dd className="text-gray-900">{data.asalData || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">CIF:</dt>
                <dd className="text-gray-900">{data.cif ? data.cif.toLocaleString() : '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Nomor AJU:</dt>
                <dd className="text-gray-900">{data.nomorAju || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">ID Pengguna:</dt>
                <dd className="text-gray-900">{data.idPengguna || '-'}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Item Counts</h5>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Barang:</dt>
                <dd className="text-gray-900">{summary.barangCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Entitas:</dt>
                <dd className="text-gray-900">{summary.entitasCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Kemasan:</dt>
                <dd className="text-gray-900">{summary.kemasanCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Kontainer:</dt>
                <dd className="text-gray-900">{summary.kontainerCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Dokumen:</dt>
                <dd className="text-gray-900">{summary.dokumenCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Pengangkut:</dt>
                <dd className="text-gray-900">{summary.pengangkutCount}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* JSON Preview */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h4 className="text-md font-medium text-gray-900">JSON Preview</h4>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setShowJsonPreview(!showJsonPreview)}
              className="btn btn-secondary"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showJsonPreview ? 'Hide' : 'Show'} JSON
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              className="btn btn-secondary"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={downloadJson}
              className="btn btn-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        {showJsonPreview && (
          <div className="p-6">
            <pre className="bg-gray-50 rounded-lg p-4 text-xs overflow-auto max-h-96 border">
              <code className="text-gray-800">{jsonString}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Ready to Generate</h4>
        <p className="text-sm text-gray-600 mb-4">
          Your data is ready to be processed. Click the "Complete" button in the wizard to generate the final JSON response.
        </p>
        
        {!summary.mainDataComplete && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="ml-3">
                <h5 className="text-sm font-medium text-yellow-800">Incomplete Data</h5>
                <p className="text-sm text-yellow-700 mt-1">
                  Some required main data fields are missing. Please go back and complete them.
                </p>
              </div>
            </div>
          </div>
        )}

        {summary.barangCount === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="ml-3">
                <h5 className="text-sm font-medium text-yellow-800">No Barang Items</h5>
                <p className="text-sm text-yellow-700 mt-1">
                  You haven't added any barang items. At least one item is typically required.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error display */}
      {errors && errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
