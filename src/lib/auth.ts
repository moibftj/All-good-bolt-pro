import { apiClient, LoginResponse, RegisterData, LoginData } from './api';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  userType: 'user' | 'remote_employee' | 'admin' | null;
  loading: boolean;
  error: string | null;
}

class AuthService {
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    userType: null,
    loading: false,
    error: null
  };

  private listeners: ((state: AuthState) => void)[] = [];

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.authState));
  }

  async login(email: string, password: string, userType: 'user' | 'remote_employee' | 'admin') {
    this.authState.loading = true;
    this.authState.error = null;
    this.notify();

    try {
      const loginData: LoginData = { email, password, role: userType };
      const response = await apiClient.login(loginData);
      
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        // Store tokens
        apiClient.setToken(tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        // Update auth state
        this.authState = {
          user: {
            ...user,
            tenant_id: this.getTenantId(userType)
          },
          isAuthenticated: true,
          userType: user.role as 'user' | 'remote_employee' | 'admin',
          loading: false,
          error: null
        };
        
        this.notify();
        return user;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      this.authState.loading = false;
      this.authState.error = error.message || 'Login failed';
      this.notify();
      throw error;
    }
  }

  async register(email: string, password: string, name: string, userType: 'user' | 'remote_employee', discountCode?: string) {
    this.authState.loading = true;
    this.authState.error = null;
    this.notify();

    try {
      const registerData: RegisterData = {
        email,
        password,
        confirmPassword: password,
        name,
        role: userType,
        discountCode
      };
      
      const response = await apiClient.register(registerData);
      
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        // Store tokens
        apiClient.setToken(tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        // Update auth state
        this.authState = {
          user: {
            ...user,
            tenant_id: this.getTenantId(userType)
          },
          isAuthenticated: true,
          userType: user.role as 'user' | 'remote_employee' | 'admin',
          loading: false,
          error: null
        };
        
        this.notify();
        return user;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      this.authState.loading = false;
      this.authState.error = error.message || 'Registration failed';
      this.notify();
      throw error;
    }
  }

  async logout() {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    apiClient.clearToken();
    this.authState = {
      user: null,
      isAuthenticated: false,
      userType: null,
      loading: false,
      error: null
    };
    this.notify();
  }

  getCurrentUser() {
    return this.authState.user;
  }

  isAuthenticated() {
    return this.authState.isAuthenticated;
  }

  getUserType() {
    return this.authState.userType;
  }

  getAuthState() {
    return this.authState;
  }

  async initializeFromToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    this.authState.loading = true;
    this.notify();

    try {
      apiClient.setToken(token);
      const response = await apiClient.getCurrentUser();
      
      if (response.success && response.data) {
        const { user } = response.data;
        
        this.authState = {
          user: {
            ...user,
            tenant_id: this.getTenantId(user.role)
          },
          isAuthenticated: true,
          userType: user.role as 'user' | 'remote_employee' | 'admin',
          loading: false,
          error: null
        };
        
        this.notify();
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Token initialization failed:', error);
      this.logout();
    }
  }

  private getMockName(email: string) {
    if (email === 'moizj00@gmail.com') return 'Moiz Ahmed';
    return email.split('@')[0].replace(/[0-9]/g, '').charAt(0).toUpperCase() + 
           email.split('@')[0].replace(/[0-9]/g, '').slice(1);
  }

  private getTenantId(userType: string) {
    switch (userType) {
      case 'admin': return '0198b265-2f8e-79af-9186-368498548b31';
      case 'user': return '0198b264-b836-70e5-a48c-5b1ca8928b83';
      case 'remote_employee': return '0198b26b-cbb4-7fab-9bae-2e5cba7a2bcc';
      default: return '';
    }
  }
}

export const authService = new AuthService();