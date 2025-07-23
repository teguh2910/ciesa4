'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Key, User, Lock, Globe, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOAuth, useOAuthConfig } from '@/hooks/useOAuth';
import { OAuthConfig, OAuthLoginRequest } from '@/types';

interface OAuthConfigProps {
  className?: string;
}

export default function OAuthConfigComponent({ className = '' }: OAuthConfigProps) {
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [configForm, setConfigForm] = useState<OAuthConfig>({
    token_url: '',
    refresh_url: '',
    username: '',
    password: '',
  });

  const { 
    isAuthenticated, 
    tokenInfo, 
    status, 
    loading: authLoading, 
    error: authError,
    login, 
    logout, 
    refresh, 
    checkStatus,
    clearError 
  } = useOAuth();

  const {
    config,
    loading: configLoading,
    error: configError,
    getConfig,
    saveConfig,
    getDefaultConfig,
  } = useOAuthConfig();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadConfig();
    }
  }, [mounted]);

  useEffect(() => {
    if (config) {
      setConfigForm(config);
    } else {
      setConfigForm(getDefaultConfig());
    }
  }, [config, getDefaultConfig]);

  const loadConfig = async () => {
    await getConfig();
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!configForm.token_url || !configForm.refresh_url || !configForm.username || !configForm.password) {
      toast.error('All fields are required');
      return;
    }

    const success = await saveConfig(configForm);
    if (success) {
      // After saving config, check status
      setTimeout(() => {
        checkStatus();
      }, 1000);
    }
  };

  const handleLogin = async () => {
    if (!configForm.username || !configForm.password) {
      toast.error('Username and password are required');
      return;
    }

    const credentials: OAuthLoginRequest = {
      username: configForm.username,
      password: configForm.password,
    };

    const success = await login(credentials);
    if (success) {
      setTimeout(() => {
        checkStatus();
      }, 1000);
    }
  };

  const handleRefresh = async () => {
    const success = await refresh();
    if (success) {
      setTimeout(() => {
        checkStatus();
      }, 1000);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const formatTimeLeft = (seconds: number): string => {
    if (seconds <= 0) return 'Expired';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!mounted) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* OAuth Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Key className="w-5 h-5 mr-2 text-blue-600" />
            OAuth 2.0 Status
          </h3>
          <button
            onClick={checkStatus}
            disabled={authLoading}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${authLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            {isAuthenticated ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className={`font-medium ${isAuthenticated ? 'text-green-700' : 'text-red-700'}`}>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>

          {status && isAuthenticated && (
            <div className="bg-green-50 p-3 rounded-md">
              <div className="text-sm text-green-800">
                <p><strong>Token Type:</strong> {status.token_type}</p>
                <p><strong>Scope:</strong> {status.scope}</p>
                {status.time_left && (
                  <p><strong>Time Left:</strong> {formatTimeLeft(status.time_left)}</p>
                )}
                {status.expires_at && (
                  <p><strong>Expires At:</strong> {new Date(status.expires_at).toLocaleString()}</p>
                )}
              </div>
            </div>
          )}

          {authError && (
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm text-red-800">{authError}</p>
              <button
                onClick={clearError}
                className="text-xs text-red-600 hover:text-red-800 mt-1"
              >
                Clear Error
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleRefresh}
                disabled={authLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {authLoading ? 'Refreshing...' : 'Refresh Token'}
              </button>
              <button
                onClick={handleLogout}
                disabled={authLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              disabled={authLoading || !configForm.username || !configForm.password}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {authLoading ? 'Logging in...' : 'Login'}
            </button>
          )}
        </div>
      </motion.div>

      {/* OAuth Configuration Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-600" />
          OAuth 2.0 Configuration
        </h3>

        <form onSubmit={handleConfigSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token URL
            </label>
            <input
              type="url"
              value={configForm.token_url}
              onChange={(e) => setConfigForm(prev => ({ ...prev, token_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://apis-gw.beacukai.go.id/nle-oauth/v1/user/login"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refresh URL
            </label>
            <input
              type="url"
              value={configForm.refresh_url}
              onChange={(e) => setConfigForm(prev => ({ ...prev, refresh_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://apis-gw.beacukai.go.id/nle-oauth/v1/user/update-token"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={configForm.username}
                onChange={(e) => setConfigForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your CEISA 4.0 username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={configForm.password}
                onChange={(e) => setConfigForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your CEISA 4.0 password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {configError && (
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm text-red-800">{configError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={configLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {configLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Globe className="w-4 h-4 mr-2" />
            )}
            {configLoading ? 'Saving...' : 'Save Configuration'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
