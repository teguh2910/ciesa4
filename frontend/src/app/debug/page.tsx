'use client';

import { useState } from 'react';
import apiClient from '@/lib/api';

export default function DebugPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApiClient = async () => {
    setLoading(true);
    setResult('Testing API client...\n');
    
    try {
      // Test 1: Check if apiClient exists
      setResult(prev => prev + 'API Client exists: ' + (apiClient ? 'YES' : 'NO') + '\n');
      
      // Test 2: Check base URL
      setResult(prev => prev + 'Base URL: ' + apiClient.getBaseURL() + '\n');
      
      // Test 3: Test health check
      setResult(prev => prev + 'Testing health check...\n');
      const healthResult = await apiClient.healthCheck();
      setResult(prev => prev + 'Health check result: ' + JSON.stringify(healthResult, null, 2) + '\n');
      
      setResult(prev => prev + 'All tests passed!\n');
    } catch (error: any) {
      setResult(prev => prev + 'Error: ' + error.message + '\n');
      setResult(prev => prev + 'Stack: ' + error.stack + '\n');
    } finally {
      setLoading(false);
    }
  };

  const testExcelUpload = async () => {
    setLoading(true);
    setResult('Testing Excel upload method...\n');
    
    try {
      // Create a dummy file for testing
      const dummyFile = new File(['dummy content'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      setResult(prev => prev + 'Created dummy file\n');
      setResult(prev => prev + 'Testing uploadExcel method...\n');
      
      // This should fail but we want to see the error
      await apiClient.uploadExcel(dummyFile);
      
    } catch (error: any) {
      setResult(prev => prev + 'Expected error: ' + error.message + '\n');
      
      // Check if the error is about ensureClientInitialized
      if (error.message.includes('ensureClientInitialized')) {
        setResult(prev => prev + '❌ FOUND THE BUG: ensureClientInitialized error\n');
      } else {
        setResult(prev => prev + '✅ No ensureClientInitialized error (this is good)\n');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">API Client Debug Page</h1>
      
      <div className="space-y-4">
        <button
          onClick={testApiClient}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test API Client
        </button>
        
        <button
          onClick={testExcelUpload}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Excel Upload Method
        </button>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Results:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 whitespace-pre-wrap">
          {result || 'Click a button to run tests...'}
        </pre>
      </div>
    </div>
  );
}
