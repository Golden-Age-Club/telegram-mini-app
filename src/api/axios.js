import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT, STORAGE_KEYS } from './config';

/**
 * Axios instance configured for API requests
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data part
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)}`
          }
        });

        if (refreshResponse.data.access_token) {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshResponse.data.access_token);
          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens and redirect to login if needed
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
    }

    return Promise.reject(error);
  }
);

export default api;