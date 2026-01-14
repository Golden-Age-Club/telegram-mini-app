/**
 * Authentication Context for Golden Age USDT Wallet
 * Manages Telegram-based authentication and JWT tokens
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        // Try to get current user with existing token
        const currentUser = await authApi.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          console.log('✅ User authenticated from existing token');
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('access_token');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.warn('⚠️ Auth check failed:', err.message);
      // Remove invalid token
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithTelegram = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get Telegram WebApp initData
      const tg = window.Telegram?.WebApp;
      if (!tg || !tg.initData) {
        throw new Error('Telegram WebApp not available or no initData');
      }

      const result = await authApi.login(tg.initData);
      
      if (result && result.user && result.access_token) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Store JWT token in localStorage
        localStorage.setItem('access_token', result.access_token);
        
        console.log('✅ User logged in with Telegram successfully');
        return { success: true, user: result.user };
      } else {
        const errorMsg = result?.message || 'Telegram login failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err?.message || 'Telegram login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithTestData = async (telegramId = 123456789) => {
    setIsLoading(true);
    setError(null);

    try {
      // For testing mode, send telegram_id as init_data
      const result = await authApi.login(telegramId.toString());
      
      if (result && result.user && result.access_token) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Store JWT token in localStorage
        localStorage.setItem('access_token', result.access_token);
        
        console.log('✅ User logged in with test data successfully');
        return { success: true, user: result.user };
      } else {
        const errorMsg = result?.message || 'Test login failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err?.message || 'Test login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const result = await authApi.refreshToken();
      
      if (result && result.access_token) {
        localStorage.setItem('access_token', result.access_token);
        if (result.user) {
          setUser(result.user);
        }
        console.log('✅ Token refreshed successfully');
        return { success: true };
      }
      
      return { success: false, error: 'Token refresh failed' };
    } catch (err) {
      console.error('❌ Token refresh failed:', err);
      return { success: false, error: err.message };
    }
  };

  const registerWithEmail = async ({ email, username, password, first_name, last_name }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authApi.registerWithEmail({
        email,
        username,
        password,
        first_name,
        last_name
      });
      console.log(result)

      if (result && result.access_token && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('access_token', result.access_token);
        return { success: true, user: result.user };
      }

      if (result && result.user) {
        setUser(result.user);
        return { success: true, user: result.user };
      }

      return { success: true, user: result };
    } catch (err) {
      const errorMsg = err?.message || 'Email registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // No logout endpoint in the API, just clear local state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      console.log('✅ User logged out successfully');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  // Legacy method for backward compatibility
  const loginWithDemo = async () => {
    // Use test data login for demo purposes
    return await loginWithTestData();
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Methods
    loginWithTelegram,
    loginWithTestData,
    loginWithDemo, // Legacy method
    refreshToken,
    registerWithEmail,
    logout,
    updateUser,
    clearError,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
