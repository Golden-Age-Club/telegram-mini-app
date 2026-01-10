/**
 * API Service for Golden Age Club
 * Handles all HTTP requests to the backend API
 */

import { API_CONFIG, REQUEST_CONFIG, HTTP_STATUS } from '../config/api.js';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = REQUEST_CONFIG.TIMEOUT;
  }

  /**
   * Make HTTP request with error handling and retry logic
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      timeout: this.timeout,
      ...options
    };

    let lastError;
    
    for (let attempt = 1; attempt <= REQUEST_CONFIG.RETRY_ATTEMPTS; attempt++) {
      try {
        console.log(`🌐 API Request (Attempt ${attempt}): ${config.method} ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ API Success: ${config.method} ${url}`, data);
        
        return {
          success: true,
          data,
          status: response.status,
          statusText: response.statusText
        };
        
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ API Error (Attempt ${attempt}): ${error.message}`);
        
        if (attempt < REQUEST_CONFIG.RETRY_ATTEMPTS) {
          await this.delay(REQUEST_CONFIG.RETRY_DELAY * attempt);
        }
      }
    }
    
    console.error(`❌ API Failed after ${REQUEST_CONFIG.RETRY_ATTEMPTS} attempts:`, lastError);
    
    return {
      success: false,
      error: lastError.message,
      status: lastError.status || 0
    };
  }

  /**
   * Delay utility for retry logic
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Authentication Methods
  async login(credentials) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async logout() {
    return this.makeRequest(API_CONFIG.ENDPOINTS.LOGOUT, {
      method: 'POST'
    });
  }

  async register(userData) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // User Methods
  async getUserProfile(userId) {
    return this.makeRequest(`${API_CONFIG.ENDPOINTS.USER_PROFILE}/${userId}`);
  }

  async getUserBalance(userId) {
    return this.makeRequest(`${API_CONFIG.ENDPOINTS.USER_BALANCE}/${userId}`);
  }

  async getUserTransactions(userId, limit = 10) {
    return this.makeRequest(`${API_CONFIG.ENDPOINTS.USER_TRANSACTIONS}/${userId}?limit=${limit}`);
  }

  // Game Methods
  async getGamesList() {
    return this.makeRequest(API_CONFIG.ENDPOINTS.GAMES_LIST);
  }

  async startGame(gameData) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.GAME_START, {
      method: 'POST',
      body: JSON.stringify(gameData)
    });
  }

  async endGame(gameResult) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.GAME_END, {
      method: 'POST',
      body: JSON.stringify(gameResult)
    });
  }

  async getGameResult(gameId) {
    return this.makeRequest(`${API_CONFIG.ENDPOINTS.GAME_RESULT}/${gameId}`);
  }

  // Wallet Methods
  async deposit(depositData) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.DEPOSIT, {
      method: 'POST',
      body: JSON.stringify(depositData)
    });
  }

  async withdraw(withdrawData) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.WITHDRAW, {
      method: 'POST',
      body: JSON.stringify(withdrawData)
    });
  }

  async getWalletHistory(userId, limit = 20) {
    return this.makeRequest(`${API_CONFIG.ENDPOINTS.WALLET_HISTORY}/${userId}?limit=${limit}`);
  }

  // Configuration Methods
  async getDemoCredentials() {
    return this.makeRequest(API_CONFIG.ENDPOINTS.DEMO_CREDENTIALS);
  }

  async getProductConfig() {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PRODUCT_CONFIG);
  }

  async getSystemConfig() {
    return this.makeRequest(API_CONFIG.ENDPOINTS.SYSTEM_CONFIG);
  }

  // Callback Method
  async handleCallback(callbackData) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.CALLBACK, {
      method: 'POST',
      body: JSON.stringify(callbackData)
    });
  }

  // Test Connection
  async testConnection() {
    try {
      const response = await this.makeRequest('/');
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Fetch Demo Credentials
  async fetchDemoCredentials() {
    console.log('🔍 Fetching demo credentials...');
    
    // Try multiple endpoints to find demo credentials
    const endpoints = [
      API_CONFIG.ENDPOINTS.DEMO_CREDENTIALS,
      API_CONFIG.ENDPOINTS.PRODUCT_CONFIG,
      API_CONFIG.ENDPOINTS.SYSTEM_CONFIG,
      '/demo',
      '/config'
    ];

    for (const endpoint of endpoints) {
      const result = await this.makeRequest(endpoint);
      
      if (result.success && result.data) {
        // Look for demo credentials in various response formats
        const data = result.data;
        
        if (data.demo) {
          return {
            username: data.demo.username || data.demo.user,
            password: data.demo.password || data.demo.pass
          };
        }
        
        if (data.demoUsername && data.demoPassword) {
          return {
            username: data.demoUsername,
            password: data.demoPassword
          };
        }
        
        if (data.credentials) {
          return {
            username: data.credentials.username,
            password: data.credentials.password
          };
        }
      }
    }
    
    console.warn('⚠️ Could not fetch demo credentials from API');
    return null;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;