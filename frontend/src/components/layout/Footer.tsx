'use client';

import { FileText, Github, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  JSON Response Generator
                </h3>
                <p className="text-sm text-gray-500">
                  Indonesian Customs API Tool
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              A comprehensive solution for generating and sending JSON responses 
              to Indonesian customs/import API endpoints with support for multiple 
              data input methods.
            </p>
          </div>

          {/* Features section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                <span>Web-based user interface</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                <span>Excel file upload & processing</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                <span>Manual data input forms</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                <span>API configuration & testing</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                <span>JSON preview & validation</span>
              </li>
            </ul>
          </div>

          {/* Support section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Support
            </h4>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">System Requirements:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Python 3.7+ (Backend)</li>
                  <li>• Node.js 18+ (Frontend)</li>
                  <li>• Modern web browser</li>
                </ul>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Supported Formats:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Excel files (.xlsx, .xls)</li>
                  <li>• JSON export/import</li>
                  <li>• Multiple authentication methods</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500">
              © {currentYear} JSON Response Generator. Built for Indonesian customs integration.
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-xs text-gray-400">
                Version 2.0.0
              </div>
              
              <div className="flex items-center space-x-4">
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-primary-600 flex items-center space-x-1 transition-colors"
                >
                  <span>API Status</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
