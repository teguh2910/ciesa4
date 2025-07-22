'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Settings, TestTube, Save, AlertCircle, CheckCircle, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConfig } from '@/hooks/useApi';
import { AppConfig } from '@/types';

const defaultConfig: AppConfig = {
  api_endpoint: '',
  api_timeout: 30,
  has_api_key: false,
  has_username: false,
  has_password: false,
  max_file_size: 16777216, // 16MB
};

export default function ApiConfigPage() {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { execute: loadConfig, loading: configLoading } = useConfig();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadConfiguration();
    }
  }, [mounted]);

  const loadConfiguration = async () => {
    try {
      const result = await loadConfig();
      if (result) {
        // Merge with default config to ensure all fields have values
        setConfig({
          ...defaultConfig,
          ...result,
          api_timeout: result.api_timeout || defaultConfig.api_timeout,
          max_file_size: result.max_file_size || defaultConfig.max_file_size,
        });
      }
    } catch (error) {
      console.error('Failed to load configuration:', error);
      toast.error('Failed to load API configuration');
    }
  };

  const handleTestConnection = async () => {
    if (!config.api_endpoint) return;
    
    setLoading(true);
    setTestResult(null);
    
    try {
      // Simulate API test - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test result
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResult({
        success,
        message: success 
          ? 'API connection successful! All endpoints are responding correctly.'
          : 'API connection failed. Please check your configuration and try again.'
      });
      
      toast[success ? 'success' : 'error'](
        success ? 'API test successful!' : 'API test failed!'
      );
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection test failed. Please check if the backend server is running.'
      });
      toast.error('Connection test failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!config.api_endpoint) return;
    
    try {
      // Simulate save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configuration saved successfully!');
    } catch (error) {
      toast.error('Failed to save configuration');
    }
  };

  if (!mounted || configLoading) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Configuration</h1>
          <p className="mt-2 text-gray-600">
            Configure and test your Indonesian customs API connection
          </p>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <Settings className="w-5 h-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">API Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Endpoint
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={config.api_endpoint}
                    onChange={(e) => setConfig({ ...config, api_endpoint: e.target.value })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://api.customs.go.id"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  value={config.api_timeout || 30}
                  onChange={(e) => setConfig({ ...config, api_timeout: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="1"
                  max="300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  value={Math.round((config.max_file_size || 16777216) / (1024 * 1024))}
                  onChange={(e) => setConfig({ ...config, max_file_size: (parseInt(e.target.value) || 16) * 1024 * 1024 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="1"
                  max="100"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Authentication
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.has_api_key}
                      onChange={(e) => setConfig({ ...config, has_api_key: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">API Key Required</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.has_username}
                      onChange={(e) => setConfig({ ...config, has_username: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Username Required</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.has_password}
                      onChange={(e) => setConfig({ ...config, has_password: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Password Required</span>
                  </label>
                </div>
              </div>
            </div>

          <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleTestConnection}
              disabled={loading || !config.api_endpoint}
              className="btn btn-secondary"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {loading ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              onClick={handleSaveConfig}
              disabled={!config.api_endpoint}
              className="btn btn-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </button>
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              testResult.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              )}
              <p className={`text-sm ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.message}
              </p>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Configuration Notes
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure your API endpoint is accessible and supports CORS</li>
                <li>• Test the connection before processing large files</li>
                <li>• Authentication settings depend on your API requirements</li>
                <li>• File size limits help prevent server overload</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
