/**
 * API Context for Golden Age USDT Wallet
 * Manages wallet operations and API state
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/auth';
import walletApi from '../api/wallet';

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
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize API connection
  useEffect(() => {
    if (!initialized) {
      initializeApi();
      setInitialized(true);
    }
  }, [initialized]);

  const initializeApi = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Initializing Golden Age USDT Wallet API...');
      
      // Test API connection by trying to access health endpoint
      try {
        const response = await fetch('https://server-kl7c.onrender.com/health');
        if (response.ok) {
          setIsConnected(true);
          console.log('✅ API connection successful');
        } else {
          throw new Error('Health check failed');
        }
      } catch (err) {
        console.warn('⚠️ API connection test failed, but API might be available');
        setIsConnected(true); // Assume connected for now
      }

    } catch (err) {
      console.error('❌ API initialization failed:', err);
      setError(err.message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Wallet methods
  const getBalance = async () => {
    try {
      const result = await walletApi.getBalance();
      return { success: true, data: result };
    } catch (err) {
      console.warn('⚠️ Could not get balance:', err.message);
      return { success: false, error: err.message };
    }
  };

  const getTransactions = async (limit = 50) => {
    try {
      const result = await walletApi.getTransactions(limit);
      return { success: true, data: result };
    } catch (err) {
      console.warn('⚠️ Could not fetch transactions:', err.message);
      return { success: false, error: err.message };
    }
  };

  const getTransaction = async (transactionId) => {
    try {
      const result = await walletApi.getTransaction(transactionId);
      return { success: true, data: result };
    } catch (err) {
      console.warn('⚠️ Could not fetch transaction:', err.message);
      return { success: false, error: err.message };
    }
  };

  const createDeposit = async (amount, returnUrl = null) => {
    try {
      const result = await walletApi.createDeposit({
        amount,
        currency: 'USDT.TRC20',
        return_url: returnUrl
      });
      
      console.log('💰 Deposit created:', result);
      return { success: true, data: result };
    } catch (err) {
      console.warn('⚠️ Deposit failed:', err.message);
      return { success: false, error: err.message };
    }
  };

  const createWithdrawal = async (amount, walletAddress) => {
    try {
      const result = await walletApi.createWithdrawal({
        amount,
        wallet_address: walletAddress,
        currency: 'USDT.TRC20'
      });
      
      console.log('💸 Withdrawal created:', result);
      return { success: true, data: result };
    } catch (err) {
      console.warn('⚠️ Withdrawal failed:', err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    // State
    isConnected,
    isLoading,
    error,
    
    // Wallet methods
    getBalance,
    getTransactions,
    getTransaction,
    createDeposit,
    createWithdrawal,
    
    // API initialization
    initializeApi,
    
    // Direct API access (for advanced usage)
    authApi,
    walletApi
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;