/**
 * API Context for Golden Age USDT Wallet
 * Manages wallet operations and API state
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import authApi from '../api/auth';
import walletApi from '../api/wallet';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { getCookie } from '../api/cookies';

const ApiContext = createContext();

const PG_CONFIG = {
  APP_NAME: "Golden Age Club",
  APP_ID: "f6710138-8c7e-4200-9d3d-4cd1630e4813",
  API_KEY: "3099a19b-647e-4350-8cf4-33a0e78d27df",
  BASE_URL: "https://mgcbot.mgcapi.com"
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [pgOptions, setPgOptions] = useState(null);
  const [pgGames, setPgGames] = useState(null);

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

      try {
        const options = await api.get('/api/casino/pg/options');
        console.log(options)
        setPgOptions(options);
      } catch (err) {
        console.warn('⚠️ Could not load PG options:', err.message);
      }

      try {
        const games = await api.get('/api/casino/pg/games');
        console.log(games)
        if (games && Array.isArray(games.games)) {
          setPgGames(games.games);
        } else if (Array.isArray(games)) {
          setPgGames(games);
        } else {
          setPgGames([]);
        }
      } catch (err) {
        console.warn('⚠️ Could not load PG games:', err.message);
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

  const launchGame = async (gameId) => {
    try {
      // Get auth token from cookie
      const token = getCookie('access_token');
      
      if (!token || !user) {
        throw new Error('User not authenticated');
      }

      // Sample uses Unix timestamp (seconds), not milliseconds
      const requestTime = Math.floor(Date.now() / 1000);
      
      // Construct payload strictly following the required parameter order
      // exit, game_id, player_id, player_token, app_id, language, currency, request_time, urls
      const payload = {
        exit: window.location.origin + '/',
        game_id: parseInt(gameId, 10), // Ensure integer
        player_id: String(user._id || user.id), // Ensure string
        player_token: token,
        app_id: PG_CONFIG.APP_ID,
        language: user.language_code || 'en',
        currency: 'USD',
        request_time: requestTime,
        urls: {
          base_url: window.location.origin + '/start-game',
          wallet_url: window.location.origin + '/wallet',
          other_url: window.location.origin + '/support'
        }
      };

      console.log('🔑 Payload:', payload);

      // Signature generation function based on provided sample
    const createSign = (params, apiKey) => {
        // 1. Manually define the order to match exactly what the provider expects
        const keys = ['exit', 'game_id', 'player_id', 'player_token', 'app_id', 'language', 'currency', 'request_time'];
        
        // 2. Concatenate values in that specific order
        const signString = keys.map(key => params[key]).join('');
        
        // 3. Match the Python logic: encode the WHOLE string, not individual parts
        const encoded = encodeURIComponent(signString);
        
        return CryptoJS.HmacMD5(encoded, apiKey).toString(CryptoJS.enc.Hex);
      };
      // Generate signature
      payload.sign = createSign(payload, PG_CONFIG.API_KEY);

      console.log('🚀 Launching game with payload:', payload);

      // Use axios as requested
      const response = await axios.post(`${PG_CONFIG.BASE_URL}/api/v1/playGame`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      const data = response.data;
      console.log('🎮 Game launch result:', data);
      
      if (data.result === false || data.err_code !== 0) {
        throw new Error(data.err_desc || 'Game launch failed');
      }

      return { success: true, data: data };
    } catch (err) {
      console.warn('⚠️ Game launch failed:', err.message);
      // Handle axios error structure if available
      const errorMessage = err.response?.data?.err_desc || err.message;
      return { success: false, error: errorMessage };
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
    launchGame,
    pgOptions,
    pgGames,
    
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
