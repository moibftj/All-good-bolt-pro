import { useState, useEffect } from 'react';
import { authService } from '../lib/auth';

export function useAuth() {
  const [authState, setAuthState] = useState(authService.getAuthState());

  useEffect(() => {
    // Initialize from stored token on mount
    authService.initializeFromToken();
    
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    login: authService.login.bind(authService),
    register: authService.register.bind(authService),
    logout: authService.logout.bind(authService)
  };
}