'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ExcelUploadComponentProps {
  onFileUpload: (file: File) => void;
  loading?: boolean;
  error?: string | null;
  maxSize?: number; // in bytes
  className?: string;
}

export function ExcelUploadComponent({
  onFileUpload,
  loading = false,
  error = null,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
}: ExcelUploadComponentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateExcelFile = (file: File): string | null => {
    // Check file extension
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!validExtensions.includes(fileExtension)) {
      return 'Invalid file type. Please upload .xlsx or .xls files only.';
    }

    // Check file size
    if (file.size > maxSize) {
      return `File is too large. Maximum size is ${formatFileSize(maxSize)}.`;
    }

    // Check if file is empty
    if (file.size === 0) {
      return 'File is empty. Please upload a valid Excel file.';
    }

    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        return; // Error will be shown by react-dropzone
      }
      if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        return; // Error will be shown by react-dropzone
      }
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const validationError = validateExcelFile(file);
      if (validationError) {
        // Don't set the file if validation fails
        return;
      }
      setSelectedFile(file);
    }
  }, [maxSize]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    maxSize,
    disabled: loading,
  });

  const handleUpload = () => {
    if (selectedFile && !loading) {
      setUploadProgress(0);
      onFileUpload(selectedFile);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getErrorMessage = () => {
    if (error) return error;
    
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        return `File is too large. Maximum size is ${formatFileSize(maxSize)}.`;
      }
      if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        return 'Invalid file type. Please upload .xlsx or .xls files only.';
      }
      return 'File upload failed. Please try again.';
    }
    
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <div className={cn('w-full', className)}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upload Excel File
        </h3>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive && !isDragReject && 'border-primary-500 bg-primary-50',
            isDragReject && 'border-red-500 bg-red-50',
            !isDragActive && !selectedFile && 'border-gray-300 hover:border-gray-400',
            selectedFile && 'border-green-500 bg-green-50',
            loading && 'cursor-not-allowed opacity-50'
          )}
        >
          <input {...getInputProps()} />
          
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-lg font-medium text-gray-900">Processing file...</p>
              <p className="text-sm text-gray-600">Please wait while we parse your Excel data</p>
            </div>
          ) : selectedFile ? (
            <div className="flex flex-col items-center">
              <FileSpreadsheet className="w-12 h-12 text-green-600 mb-4" />
              <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Process File
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  disabled={loading}
                  className="btn btn-ghost"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop your Excel file here' : 'Upload Excel File'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop your .xlsx or .xls file here, or click to browse
              </p>
              <div className="text-xs text-gray-500">
                Maximum file size: {formatFileSize(maxSize)}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Upload Progress */}
        {loading && uploadProgress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Processing file...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* File Requirements */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">File Requirements:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Supported formats: .xlsx, .xls</li>
            <li>• Maximum file size: {formatFileSize(maxSize)}</li>
            <li>• Use the provided template for best results</li>
            <li>• Ensure all required fields are filled</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
