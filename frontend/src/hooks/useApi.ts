import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api';
import { ApiResponse } from '@/types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for API calls with loading, error, and success states
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: {
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
  } = {}
): UseApiReturn<T> {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      // Don't execute on server side
      if (typeof window === 'undefined') {
        return null;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState(prev => ({ ...prev, data: result, loading: false }));

        if (showSuccessToast) {
          toast.success(successMessage);
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        return null;
      }
    },
    // Remove apiFunction from dependencies to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showSuccessToast, showErrorToast, successMessage]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for health check
 */
export function useHealthCheck() {
  return useApi(() => apiClient.healthCheck(), {
    showErrorToast: false,
  });
}

/**
 * Hook for configuration
 */
export function useConfig() {
  return useApi(() => apiClient.getConfig(), {
    showErrorToast: true,
  });
}

/**
 * Hook for Excel upload
 */
export function useExcelUpload() {
  return useApi((file: File) => apiClient.uploadExcel(file), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Excel file uploaded and processed successfully!',
  });
}

/**
 * Hook for JSON generation
 */
export function useJsonGeneration() {
  return useApi((data: any) => apiClient.generateJson(data), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'JSON generated successfully!',
  });
}

/**
 * Hook for API connection testing
 */
export function useConnectionTest() {
  return useApi((endpoint?: string) => apiClient.testConnection(endpoint), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Connection test successful!',
  });
}

/**
 * Hook for sending data to API
 */
export function useApiSend() {
  return useApi((jsonData: any, apiConfig?: any, dryRun?: boolean) => apiClient.sendToApi(jsonData, apiConfig, dryRun), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Data sent to API successfully!',
  });
}

/**
 * Hook for getting sample data
 */
export function useSampleData() {
  return useApi(() => apiClient.getSampleData(), {
    showSuccessToast: false,
    showErrorToast: true,
  });
}

/**
 * Hook for OAuth login
 */
export function useOAuthLogin() {
  return useApi((credentials: any) => apiClient.oauthLogin(credentials), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Login successful!',
  });
}

/**
 * Hook for OAuth refresh
 */
export function useOAuthRefresh() {
  return useApi(() => apiClient.oauthRefresh(), {
    showSuccessToast: false,
    showErrorToast: true,
  });
}

/**
 * Hook for OAuth status
 */
export function useOAuthStatus() {
  return useApi(() => apiClient.oauthStatus(), {
    showSuccessToast: false,
    showErrorToast: false,
  });
}

/**
 * Hook for OAuth config
 */
export function useOAuthConfigApi() {
  return useApi(() => apiClient.getOAuthConfig(), {
    showSuccessToast: false,
    showErrorToast: true,
  });
}
