'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { LogIn, User, Lock, Eye, EyeOff, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOAuth } from '@/hooks/useOAuth';
import { OAuthLoginRequest } from '@/types';

interface OAuthLoginProps {
  onSuccess?: () => void;
  className?: string;
}

export default function OAuthLogin({ onSuccess, className = '' }: OAuthLoginProps) {
  const [credentials, setCredentials] = useState<OAuthLoginRequest>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, error, clearError } = useOAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error('Please enter both username and password');
      return;
    }

    const success = await login(credentials);
    if (success) {
      onSuccess?.();
      // Clear form
      setCredentials({ username: '', password: '' });
    }
  };

  const handleInputChange = (field: keyof OAuthLoginRequest, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) {
      clearError();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}
    >
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Key className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">OAuth 2.0 Login</h2>
        <p className="text-sm text-gray-600 mt-1">
          Sign in with your CEISA 4.0 credentials
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your CEISA 4.0 username"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 border border-red-200 rounded-md p-3"
          >
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading || !credentials.username || !credentials.password}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <div className="text-xs text-gray-500">
          <p>This will authenticate with the CEISA 4.0 API using OAuth 2.0</p>
          <p className="mt-1">Your credentials are securely transmitted and not stored locally</p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Compact OAuth Login Component for use in headers or sidebars
 */
export function CompactOAuthLogin({ onSuccess, className = '' }: OAuthLoginProps) {
  const [credentials, setCredentials] = useState<OAuthLoginRequest>({
    username: '',
    password: '',
  });
  const [showForm, setShowForm] = useState(false);

  const { isAuthenticated, login, logout, loading, tokenInfo } = useOAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error('Please enter both username and password');
      return;
    }

    const success = await login(credentials);
    if (success) {
      onSuccess?.();
      setCredentials({ username: '', password: '' });
      setShowForm(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowForm(false);
  };

  if (isAuthenticated) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center text-sm text-green-600">
          <Key className="w-4 h-4 mr-1" />
          <span>Authenticated</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
        >
          Logout
        </button>
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className={`flex items-center text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 ${className}`}
      >
        <LogIn className="w-4 h-4 mr-1" />
        OAuth Login
      </button>
    );
  }

  return (
    <div className={`bg-white border rounded-lg p-3 shadow-lg ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={credentials.username}
          onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Username"
          required
          disabled={loading}
        />
        <input
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Password"
          required
          disabled={loading}
        />
        <div className="flex space-x-1">
          <button
            type="submit"
            disabled={loading || !credentials.username || !credentials.password}
            className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
