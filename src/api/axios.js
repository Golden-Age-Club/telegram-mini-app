import axios from 'axios';
<<<<<<< HEAD
import { API_BASE_URL, REQUEST_TIMEOUT, STORAGE_KEYS } from './config';

/**
 * Axios instance with interceptors for authentication and error handling
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
=======

export const backendUrl = () => {
  // Golden Age USDT Wallet API - always use the provided server
  return "https://server-kl7c.onrender.com";
};

const api = axios.create({
  baseURL: backendUrl(),
  timeout: 50000,
>>>>>>> 191eb8047438f5763ef34c456631ad09c1d9e03b
  headers: {
    'Content-Type': 'application/json',
  },
});

<<<<<<< HEAD
// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
=======
api.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage (not cookies for this API)
    const token = localStorage.getItem('access_token');
>>>>>>> 191eb8047438f5763ef34c456631ad09c1d9e03b
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
<<<<<<< HEAD
    // Add request ID for tracking
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response.data; // Return only the data part
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh_token: refreshToken
          });
          
          const { access_token } = response.data;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        // Clear tokens and redirect to login
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        
        // Emit custom event for app to handle logout
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        type: 'NETWORK_ERROR'
      });
    }

    // Return structured error
    return Promise.reject({
      message: error.response?.data?.detail || error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
      type: 'API_ERROR'
    });
  }
=======
    // Add Telegram initData as fallback authentication
    if (window.Telegram?.WebApp?.initData) {
      config.headers['X-Telegram-Init-Data'] = window.Telegram.WebApp.initData;
    }
    
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    try {
      console.log('[api] response', {
        url: response.config?.url,
        status: response.status,
        data: response.data,
      });
    } catch (e) {}
    return response.data;
  },
  (error) => {
    try {
      console.error('[api] response error', {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        responseData: error.response?.data,
        request: error.request,
      });
    } catch (e) {}
    return Promise.reject(error?.response?.data || error);
  },
>>>>>>> 191eb8047438f5763ef34c456631ad09c1d9e03b
);

export default api;