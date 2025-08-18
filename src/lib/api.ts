const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    emailVerified: boolean;
    discountCode?: string;
    referralPoints?: number;
    lettersUsed?: number;
    subscriptionPlan?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

interface RegisterData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'remote_employee' | 'admin';
  discountCode?: string;
}

interface LoginData {
  email: string;
  password: string;
  role: 'user' | 'remote_employee' | 'admin';
}

interface PasswordResetData {
  email: string;
  role: 'user' | 'remote_employee' | 'admin';
}

interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'remote_employee' | 'admin';
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('accessToken');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
      
      // Add CSRF token for state-changing operations
      if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method)) {
        const csrfToken = Buffer.from(this.token).toString('base64').substring(0, 32);
        (config.headers as Record<string, string>)['X-CSRF-Token'] = csrfToken;
      }
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          this.clearToken();
          window.location.href = '/';
        }
        
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Authentication methods
  async register(userData: RegisterData): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginData): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.clearToken();
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: any }>> {
    return this.request('/auth/me');
  }

  async requestPasswordReset(data: PasswordResetData): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return fetch(`${this.baseUrl.replace('/api', '')}/health`)
      .then(response => response.json());
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Export types for use in components
export type {
  ApiResponse,
  LoginResponse,
  RegisterData,
  LoginData,
  PasswordResetData,
  ResetPasswordData,
  ChangePasswordData
};