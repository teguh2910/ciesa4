import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api';
import { OAuthLoginRequest, OAuthConfig, OAuthStatus, OAuthTokenInfo } from '@/types';
import { useLocalStorage } from './useLocalStorage';

interface UseOAuthState {
  isAuthenticated: boolean;
  tokenInfo: OAuthTokenInfo | null;
  status: OAuthStatus | null;
  loading: boolean;
  error: string | null;
}

interface UseOAuthReturn extends UseOAuthState {
  login: (credentials: OAuthLoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  checkStatus: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for OAuth 2.0 authentication
 */
export function useOAuth(): UseOAuthReturn {
  const [state, setState] = useState<UseOAuthState>({
    isAuthenticated: false,
    tokenInfo: null,
    status: null,
    loading: false,
    error: null,
  });

  // Store token info in localStorage for persistence
  const [storedTokenInfo, setStoredTokenInfo] = useLocalStorage<OAuthTokenInfo | null>('oauth_token_info', null);

  // Initialize state from stored token info
  useEffect(() => {
    if (storedTokenInfo) {
      setState(prev => ({
        ...prev,
        tokenInfo: storedTokenInfo,
        isAuthenticated: new Date(storedTokenInfo.expires_at) > new Date(),
      }));
    }
  }, [storedTokenInfo]);

  // Check token status on mount and periodically
  useEffect(() => {
    checkStatus();
    
    // Check status every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const login = useCallback(async (credentials: OAuthLoginRequest): Promise<boolean> => {
    if (typeof window === 'undefined') {
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.oauthLogin(credentials);
      
      if (response.success && response.data) {
        const tokenInfo: OAuthTokenInfo = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token || '',
          expires_at: response.data.expires_at,
          token_type: response.data.token_type || 'Bearer',
          scope: response.data.scope || '',
        };

        setStoredTokenInfo(tokenInfo);
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          tokenInfo,
          loading: false,
        }));

        toast.success('Login successful!');
        return true;
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      toast.error(errorMessage);
      return false;
    }
  }, [setStoredTokenInfo]);

  const logout = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') {
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      await apiClient.oauthLogout();
      setStoredTokenInfo(null);
      setState({
        isAuthenticated: false,
        tokenInfo: null,
        status: null,
        loading: false,
        error: null,
      });
      toast.success('Logged out successfully');
    } catch (error) {
      // Even if logout fails on server, clear local state
      setStoredTokenInfo(null);
      setState({
        isAuthenticated: false,
        tokenInfo: null,
        status: null,
        loading: false,
        error: null,
      });
      toast.success('Logged out');
    }
  }, [setStoredTokenInfo]);

  const refresh = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') {
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.oauthRefresh();
      
      if (response.success && response.data) {
        const tokenInfo: OAuthTokenInfo = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token || storedTokenInfo?.refresh_token || '',
          expires_at: response.data.expires_at,
          token_type: response.data.token_type || 'Bearer',
          scope: response.data.scope || '',
        };

        setStoredTokenInfo(tokenInfo);
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          tokenInfo,
          loading: false,
        }));

        return true;
      } else {
        throw new Error(response.error || 'Token refresh failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      
      // If refresh fails, user needs to login again
      setStoredTokenInfo(null);
      setState(prev => ({ ...prev, isAuthenticated: false, tokenInfo: null }));
      
      return false;
    }
  }, [storedTokenInfo, setStoredTokenInfo]);

  const checkStatus = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const response = await apiClient.oauthStatus();
      
      if (response.success && response.data) {
        const status = response.data;
        setState(prev => ({
          ...prev,
          status,
          isAuthenticated: status.authenticated,
        }));

        // If token is expired or about to expire, try to refresh
        if (status.authenticated && status.time_left && status.time_left < 300) { // 5 minutes
          await refresh();
        }
      }
    } catch (error) {
      // Silently handle status check errors
      console.warn('Failed to check OAuth status:', error);
    }
  }, [refresh]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    logout,
    refresh,
    checkStatus,
    clearError,
  };
}

/**
 * Hook for OAuth 2.0 configuration management
 */
export function useOAuthConfig() {
  const [config, setConfig] = useLocalStorage<OAuthConfig | null>('oauth_config', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConfig = useCallback(async (): Promise<OAuthConfig | null> => {
    if (typeof window === 'undefined') {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getOAuthConfig();
      
      if (response.success && response.data) {
        setConfig(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get OAuth config');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get OAuth config';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setConfig]);

  const saveConfig = useCallback(async (newConfig: OAuthConfig): Promise<boolean> => {
    if (typeof window === 'undefined') {
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.setOAuthConfig(newConfig);
      
      if (response.success) {
        setConfig(newConfig);
        toast.success('OAuth configuration saved successfully');
        return true;
      } else {
        throw new Error(response.error || 'Failed to save OAuth config');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save OAuth config';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setConfig]);

  const getDefaultConfig = useCallback((): OAuthConfig => {
    return {
      token_url: 'https://apis-gw.beacukai.go.id/nle-oauth/v1/user/login',
      refresh_url: 'https://apis-gw.beacukai.go.id/nle-oauth/v1/user/update-token',
      username: '',
      password: '',
    };
  }, []);

  return {
    config,
    loading,
    error,
    getConfig,
    saveConfig,
    getDefaultConfig,
    setConfig,
  };
}
