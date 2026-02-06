import axios from 'axios';
import { getCookie, removeCookie } from './cookies';

export const backendUrl = () => {
  // Allow overriding via environment variable (e.g. for custom domains to bypass region blocks)
  // We ignore the default localhost value to ensure the fallback logic works if the env var isn't customized for prod
  if (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== 'http://localhost:8000') {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // if (typeof window !== 'undefined') {
  //   const hostname = window.location.hostname;
  //   if (hostname === 'localhost' || hostname === '127.0.0.1') {
  //     return 'http://localhost:8000';
  //   }
  // }
  return 'https://golden-age-club-f8a5bb71b60a.herokuapp.com';
};

const api = axios.create({
  baseURL: backendUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data part
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized
    if (status === 401) {
      removeCookie('access_token');
      localStorage.removeItem('access_token');
      // Optional: Dispatch event for UI to handle (e.g., show login modal)
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    // Standardize error message
    // Backend usually returns { detail: "message" } or { message: "message" }
    const message = data?.detail || data?.message || error.message || 'An unexpected error occurred';
    error.message = message;
    
    // Attach formatted message to response data for components that check err.response.data
    if (error.response && error.response.data) {
       // Ensure complex objects are handled if necessary, but usually strings work best
    }

    return Promise.reject(error);
  }
);

export default api;
