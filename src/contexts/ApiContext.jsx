/**
 * API Context for Golden Age Club
 * Manages API state, authentication, and user data
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { API_CONFIG } from '../config/api';

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [demoCredentials, setDemoCredentials] = useState(null);
  const [error, setError] = useState(null);

  // Initialize API connection and fetch demo credentials
  useEffect(() => {
    initializeApi();
  }, []);

  const initializeApi = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Initializing Golden Age Club API...');
      console.log(`📡 API Base URL: ${API_CONFIG.BASE_URL}`);
      console.log(`🎰 Product: ${API_CONFIG.PRODUCT_NAME}`);
      console.log(`💰 Currency: ${API_CONFIG.CURRENCY}`);

      // Test API connection
      const connectionTest = await apiService.testConnection();
      setIsConnected(connectionTest);

      if (connectionTest) {
        console.log('✅ API connection successful');
        
        // Fetch demo credentials
        const credentials = await apiService.fetchDemoCredentials();
        if (credentials) {
          setDemoCredentials(credentials);
          console.log('✅ Demo credentials fetched successfully');
        }
        
        // Fetch system configuration
        await fetchSystemConfig();
        
      } else {
        console.warn('⚠️ API connection failed');
        setError('Unable to connect to Golden Age Club API');
      }

    } catch (err) {
      console.error('❌ API initialization failed:', err);
      setError(err.message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSystemConfig = async () => {
    try {
      const result = await apiService.getSystemConfig();
      if (result.success) {
        console.log('📋 System config loaded:', result.data);
      }
    } catch (err) {
      console.warn('⚠️ Could not fetch system config:', err.message);
    }
  };

  // Authentication methods
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.login(credentials);
      
      if (result.success) {
        setUser(result.data.user);
        console.log('✅ User logged in successfully');
        return { success: true, user: result.data.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      console.log('✅ User logged out successfully');
    } catch (err) {
      console.warn('⚠️ Logout error:', err.message);
    }
  };

  const loginWithDemo = async () => {
    if (!demoCredentials) {
      setError('Demo credentials not available');
      return { success: false, error: 'Demo credentials not available' };
    }

    return await login(demoCredentials);
  };

  // User data methods
  const updateUserBalance = async (userId) => {
    try {
      const result = await apiService.getUserBalance(userId);
      if (result.success && user) {
        setUser(prev => ({ ...prev, balance: result.data.balance }));
      }
      return result;
    } catch (err) {
      console.warn('⚠️ Could not update user balance:', err.message);
      return { success: false, error: err.message };
    }
  };

  const getUserTransactions = async (userId, limit = 10) => {
    try {
      return await apiService.getUserTransactions(userId, limit);
    } catch (err) {
      console.warn('⚠️ Could not fetch transactions:', err.message);
      return { success: false, error: err.message };
    }
  };

  // Game methods
  const startGame = async (gameData) => {
    try {
      const result = await apiService.startGame({
        ...gameData,
        userId: user?.id,
        currency: API_CONFIG.CURRENCY
      });
      
      if (result.success) {
        console.log('🎮 Game started:', result.data);
      }
      
      return result;
    } catch (err) {
      console.warn('⚠️ Could not start game:', err.message);
      return { success: false, error: err.message };
    }
  };

  const endGame = async (gameResult) => {
    try {
      const result = await apiService.endGame({
        ...gameResult,
        userId: user?.id,
        currency: API_CONFIG.CURRENCY
      });
      
      if (result.success) {
        console.log('🏁 Game ended:', result.data);
        // Update user balance after game
        if (user?.id) {
          await updateUserBalance(user.id);
        }
      }
      
      return result;
    } catch (err) {
      console.warn('⚠️ Could not end game:', err.message);
      return { success: false, error: err.message };
    }
  };

  // Wallet methods
  const deposit = async (amount) => {
    try {
      const result = await apiService.deposit({
        userId: user?.id,
        amount,
        currency: API_CONFIG.CURRENCY
      });
      
      if (result.success && user?.id) {
        await updateUserBalance(user.id);
      }
      
      return result;
    } catch (err) {
      console.warn('⚠️ Deposit failed:', err.message);
      return { success: false, error: err.message };
    }
  };

  const withdraw = async (amount) => {
    try {
      const result = await apiService.withdraw({
        userId: user?.id,
        amount,
        currency: API_CONFIG.CURRENCY
      });
      
      if (result.success && user?.id) {
        await updateUserBalance(user.id);
      }
      
      return result;
    } catch (err) {
      console.warn('⚠️ Withdrawal failed:', err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    // State
    isConnected,
    isLoading,
    user,
    demoCredentials,
    error,
    
    // Configuration
    config: API_CONFIG,
    
    // Methods
    initializeApi,
    login,
    logout,
    loginWithDemo,
    updateUserBalance,
    getUserTransactions,
    startGame,
    endGame,
    deposit,
    withdraw,
    
    // API Service (for direct access if needed)
    apiService
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;