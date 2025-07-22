import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ApiConfig, AppConfig, ExcelData, ResponseData } from '@/types';

class ApiClient {
  private client: AxiosInstance | null = null;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    this.initializeClient();
  }

  private initializeClient() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      try {
        this.client = axios.create({
          baseURL: this.baseURL,
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Set up interceptors
        this.setupInterceptors();
      } catch (error) {
        console.error('Failed to create axios client:', error);
        this.client = null;
      }
    }
  }

  private setupInterceptors() {
    if (this.client?.interceptors) {
      // Request interceptor
      this.client.interceptors.request.use(
        (config) => {
          // Add any auth headers here if needed
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // Response interceptor
      this.client.interceptors.response.use(
        (response: AxiosResponse) => {
          return response;
        },
        (error) => {
          // Handle common errors
          if (error.response?.status === 413) {
            throw new Error('File too large. Maximum size is 16MB.');
          }

          if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
          }

          if (error.code === 'ECONNREFUSED') {
            throw new Error('Unable to connect to the API server. Please ensure the backend is running.');
          }

          throw new Error(error.message || 'An unexpected error occurred');
        }
      );
    }
  }

  private ensureClientInitialized(): void {
    if (typeof window === 'undefined') {
      throw new Error('API client can only be used on the client side');
    }

    // Try to initialize if not already done
    if (!this.client) {
      this.initializeClient();
    }

    if (!this.client || !this.client.get) {
      throw new Error('API client not properly initialized. Please check your network connection and try again.');
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    if (typeof window === 'undefined') {
      throw new Error('API client can only be used on the client side');
    }
    this.ensureClientInitialized();
    const response = await this.client!.get('/api/health');
    return response.data;
  }

  // Configuration
  async getConfig(): Promise<AppConfig> {
    if (typeof window === 'undefined') {
      throw new Error('API client can only be used on the client side');
    }
    this.ensureClientInitialized();
    const response = await this.client!.get('/api/config');
    return response.data;
  }

  // Excel operations
  async uploadExcel(file: File): Promise<ApiResponse<ExcelData>> {
    if (typeof window === 'undefined') {
      throw new Error('API client can only be used on the client side');
    }
    this.ensureClientInitialized();
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client!.post('/api/upload-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async downloadTemplate(): Promise<Blob> {
    if (typeof window === 'undefined') {
      throw new Error('API client can only be used on the client side');
    }
    this.ensureClientInitialized();
    const response = await this.client!.get('/api/download-template', {
      responseType: 'blob',
    });

    return response.data;
  }

  // JSON generation
  async generateJson(data: any): Promise<ApiResponse<{ json_data: ResponseData; json_string: string }>> {
    if (typeof window === 'undefined') {
      throw new Error('API client can only be used on the client side');
    }
    this.ensureClientInitialized();
    const response = await this.client!.post('/api/generate-json', data);
    return response.data;
  }

  async getSampleData(): Promise<ApiResponse<{ data: ResponseData; json_string: string }>> {
    if (typeof window === 'undefined') {
      throw new Error('API client can only be used on the client side');
    }
    this.ensureClientInitialized();
    const response = await this.client!.get('/api/sample-data');
    return response.data;
  }

  // API operations
  async testConnection(endpoint?: string): Promise<ApiResponse> {
    if (typeof window === 'undefined') {
      throw new Error('API client can only be used on the client side');
    }
    this.ensureClientInitialized();
    const response = await this.client!.post('/api/test-connection', {
      endpoint,
    });
    return response.data;
  }

  async sendToApi(
    jsonData: ResponseData,
    apiConfig?: ApiConfig,
    dryRun: boolean = false
  ): Promise<ApiResponse> {
    if (typeof window === 'undefined') {
      throw new Error('API client can only be used on the client side');
    }
    this.ensureClientInitialized();
    const response = await this.client!.post('/api/send-to-api', {
      json_data: jsonData,
      api_config: apiConfig,
      dry_run: dryRun,
    });
    return response.data;
  }

  // Utility methods
  getBaseURL(): string {
    return this.baseURL;
  }

  // File download helper
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // JSON download helper
  downloadJson(jsonString: string, filename?: string): void {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const defaultFilename = `customs_data_${new Date().toISOString().split('T')[0]}.json`;
    this.downloadFile(blob, filename || defaultFilename);
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
