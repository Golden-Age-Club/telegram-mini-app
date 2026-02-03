/**
 * API Configuration
 */

// API Base URL - Update this to match your server
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login/telegram',
    REFRESH: '/api/auth/refresh',
    ME: '/api/users/me'
  },

  // Wallet endpoints
  WALLET: {
    BALANCE: '/api/wallet/balance',
    DEPOSIT: '/api/wallet/deposit',
    WITHDRAW: '/api/wallet/withdraw',
    TRANSACTIONS: '/api/transactions/me',
    TRANSACTION: '/api/wallet/transaction'
  },

  // Health check
  HEALTH: '/health'
};

// Request timeout (30 seconds)
export const REQUEST_TIMEOUT = 30000;

// Token storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data'
};