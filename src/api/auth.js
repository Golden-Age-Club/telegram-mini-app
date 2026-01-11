import api from './axios';

/**
 * Authentication API Service Functions
 * Based on Golden Age USDT Wallet API
 */

// ==================== POST ENDPOINTS ====================

/**
 * Login with Telegram WebApp initData
 * @param {string} initData - Telegram WebApp initData string
 */
export const login = async (initData) => {
  try {
    console.log('📡 Auth API: Telegram login');
    const response = await api.post('/api/auth/login', { init_data: initData });
    console.log('✅ Auth API Response - Login:', response);
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Login:', error);
    throw error;
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async () => {
  try {
    console.log('📡 Auth API: Refresh token');
    const response = await api.post('/api/auth/refresh');
    console.log('✅ Auth API Response - Refresh Token:', response);
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Refresh Token:', error);
    throw error;
  }
};

// ==================== GET ENDPOINTS ====================

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  try {
    console.log('📡 Auth API: Get current user');
    const response = await api.get('/api/auth/me');
    console.log('✅ Auth API Response - Get Current User:', response);
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Get Current User:', error);
    throw error;
  }
};

// Export all functions as default object
export default {
  login,
  refreshToken,
  getCurrentUser
};