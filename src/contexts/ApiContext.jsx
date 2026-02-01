/**
 * API Context for Golden Age USDT Wallet
 * Manages wallet operations and API state
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import axios, { backendUrl } from '../api/axios';
import authApi from '../api/auth';
import walletApi from '../api/wallet';
import api from '../api/axios';
import { useAuth } from './AuthContext.jsx';
import { useLanguage } from './LanguageContext.jsx';
import { getCookie } from '../api/cookies';

const ApiContext = createContext();

const PG_CONFIG = {
  APP_NAME: "Golden Age Club",
  APP_ID: "f6710138-8c7e-4200-9d3d-4cd1630e4813",
  API_KEY: "3099a19b-647e-4350-8cf4-33a0e78d27df",
  BASE_URL: "https://resolver.mgcapi.com"
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
  const { currentLanguage } = useLanguage();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [pgOptions, setPgOptions] = useState(null);
  const [pgGames, setPgGames] = useState([]);
  const [liveTransactions, setLiveTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Polling for live transactions (replacing socket)
  useEffect(() => {
    const fetchLiveTransactions = async () => {
      try {
        const response = await api.get('/api/transactions/recent?limit=15');
        if (response) {
          // Ensure response is an array
          const data = Array.isArray(response) ? response : (response.data || []);
          setLiveTransactions(data);
        }
      } catch (err) {
        console.warn('⚠️ Could not fetch live transactions:', err);
      }
    };

    fetchLiveTransactions(); // Initial fetch
    // const interval = setInterval(fetchLiveTransactions, 5000); // Poll every 5s

    // return () => clearInterval(interval);
  }, []);

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
      // 1. Load Games First (Page 1)
      try {
        const gamesResponse = await api.get('/api/casino/pg/games?page=1&limit=18');

        if (gamesResponse && Array.isArray(gamesResponse.data) || Array.isArray(gamesResponse.games)) {
          setPgGames(gamesResponse.games || gamesResponse.data || []);

          setPagination({
            page: gamesResponse.page,
            limit: gamesResponse.limit,
            total: gamesResponse.total,
            totalPages: gamesResponse.total_pages
          });
        } else if (Array.isArray(gamesResponse)) {
          setPgGames(gamesResponse);
        } else {
          setPgGames([]);
        }
      } catch (err) {
        console.warn('⚠️ Could not load PG games:', err.message);
      }

      // 2. Load Options After
      try {
        const options = await api.get('/api/casino/pg/options');
        console.log(options)
        setPgOptions(options);
      } catch (err) {
        console.warn('⚠️ Could not load PG options:', err.message);
      }
    } catch (err) {
      console.error('❌ API initialization failed:', err);
      setError(err.message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetGames = async (limit = 20, provider = null, search = null) => {
    setIsLoading(true);
    try {
      let url = `/api/casino/pg/games?page=1&limit=${limit}`;
      if (provider && provider !== 'all') url += `&provider_id=${encodeURIComponent(provider)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await api.get(url);
      
      const games = response?.games || response?.data || (Array.isArray(response) ? response : null);

      if (Array.isArray(games)) {
        setPgGames(games);
        setPagination({
          page: response.page || 1,
          limit: response.limit || limit,
          total: response.total || games.length,
          totalPages: response.total_pages || Math.ceil(games.length / limit)
        });
      } else {
        setPgGames([]);
        setPagination({
          page: 1,
          limit,
          total: 0,
          totalPages: 1
        });
      }
    } catch (err) {
      console.warn('⚠️ Could not reset games:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreGames = async (provider = null, search = null) => {
    if (pagination.page >= pagination.totalPages) return;

    // Don't set global isLoading to avoid full screen loader, 
    // maybe add a specific loading state for more games if needed.
    // For now we'll just use the existing flow but maybe we shouldn't block UI.
    // let's keep it simple.

    try {
      const offset = pgGames.length;
      const limit = 18;
      // We calculate "page" just for consistency in URL/backend logs if they care, 
      // but we use offset primarily now.
      const nextPage = Math.floor(offset / limit) + 1;
      
      let url = `/api/casino/pg/games?page=${nextPage}&limit=${limit}&offset=${offset}`;
      if (provider && provider !== 'all') url += `&provider_id=${encodeURIComponent(provider)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await api.get(url);
      const newGames = response?.games || response?.data || (Array.isArray(response) ? response : null);

      if (Array.isArray(newGames)) {
        if (newGames.length === 0) {
            // No more games, update totalPages to stop trying
            setPagination(prev => ({ ...prev, page: prev.totalPages, totalPages: prev.page }));
            return;
        }

        setPgGames(prev => [...prev, ...newGames]);
        setPagination({
          page: response.page || nextPage,
          limit: response.limit || limit,
          total: response.total || pagination.total,
          totalPages: response.total_pages || pagination.totalPages
        });
      }
    } catch (err) {
      console.warn('⚠️ Could not load more games:', err.message);
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
      console.warn('⚠️ Deposit failed:', err.response?.data || err.message);
      return { success: false, error: err.response?.data?.detail || err.message };
    }
  };

  const createWithdrawal = async (amount, walletAddress) => {
    try {
      const result = await walletApi.createWithdrawal(amount, walletAddress, 'USDT.TRC20');

      console.log('💸 Withdrawal created:', result);
      return { success: true, data: result };
    } catch (err) {
      console.warn('⚠️ Withdrawal failed:', err.response?.data || err.message);
      return { success: false, error: err.response?.data?.detail || err.message };
    }
  };

  const launchGame = async (gameId) => {
    try {
      // Direct frontend launch logic matching provider sample
      // Note: This exposes the API_KEY in the frontend, which is a security risk but requested by user.
      
      const requestTime = Date.now();
      const baseUrl = window.location.origin;
      const walletUrl = `${baseUrl}/wallet`;
      const exitUrl = `${baseUrl}/`;
      
      const params = {
        exit: exitUrl,
        game_id: parseInt(gameId),
        player_id: user?._id || 'guest',
        player_token: user?.token || 'frontend_token_' + Date.now(), // Use available token or generate one
        app_id: PG_CONFIG.APP_ID,
        language: currentLanguage || 'en',
        currency: 'USD',
        request_time: requestTime,
        urls: {
          base_url: baseUrl,
          wallet_url: walletUrl,
          other_url: `${baseUrl}/support`
        }
      };

      // Signature generation using CryptoJS
      const createSign = (p, apiKey) => {
        const values = Object.entries(p)
          .filter(([key]) => key !== 'sign' && key !== 'urls')
          .map(([, value]) => (value && typeof value === 'object' ? JSON.stringify(value) : value))
          .join('');
        const encoded = encodeURIComponent(values);
        return CryptoJS.HmacMD5(encoded, apiKey).toString(CryptoJS.enc.Hex);
      };

      params.sign = createSign(params, PG_CONFIG.API_KEY);

      console.log('🚀 Launching game directly from frontend:', params);

      // Use fetch to bypass axios instance configuration
      const response = await fetch(`${PG_CONFIG.BASE_URL}/api/v1/launch-game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await response.json();

      if (data.result === false) {
        console.warn('❌ Game launch error from provider:', data.err_desc);
        return {
          success: false,
          error: data.err_desc || 'Game launch failed',
          code: data.err_code
        };
      }

      if (data.url) {
        return { success: true, data: { url: data.url } };
      } else {
        throw new Error(data.message || data.err_desc || 'Failed to get game URL');
      }

    } catch (err) {
      console.warn('⚠️ Could not launch game:', err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    // State
    isConnected,
    isLoading,
    error,
    liveTransactions,

    // Wallet methods
    getBalance,
    getTransactions,
    getTransaction,
    createDeposit,
    createWithdrawal,
    launchGame,
    pgOptions,
    pgGames,
    pagination,
    loadMoreGames,
    resetGames,

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
