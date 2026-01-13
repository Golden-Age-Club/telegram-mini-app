import { useState, useEffect, useCallback } from 'react';
import { 
  login, 
  refreshToken, 
  getCurrentUser, 
  logout, 
  isAuthenticated as checkIsAuthenticated, 
  getStoredUser 
} from '../api/auth-real';

/**
 * Custom hook for authentication management
 * Handles login, logout, and user state management
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
    
    // Listen for logout events from axios interceptor
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    };
    
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  /**
   * Initialize authentication state
   */
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user is already authenticated
      if (checkIsAuthenticated()) {
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
          
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            console.warn('Token validation failed, will re-authenticate');
            // Token might be expired, will handle in login
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with Telegram WebApp
   */
  const loginUser = useCallback(async (initData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await login(initData);
      
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        console.log('✅ Login successful:', response.user);
        return response;
      } else {
        throw new Error('No user data received from server');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logoutUser = useCallback(() => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    console.log('✅ Logout successful');
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    try {
      if (!isAuthenticated) return null;
      
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error('❌ Refresh user error:', error);
      setError(error.message);
      throw error;
    }
  }, [isAuthenticated]);

  /**
   * Update user balance locally (for optimistic updates)
   */
  const updateUserBalance = useCallback((newBalance) => {
    setUser(prevUser => prevUser ? { ...prevUser, balance: newBalance } : null);
  }, []);

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    error,
    
    // Actions
    login: loginUser,
    logout: logoutUser,
    refreshUser,
    updateUserBalance,
    
    // Utilities
    initializeAuth
  };
};