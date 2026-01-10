/**
 * API Configuration for Golden Age Club
 * Contains all API endpoints and configuration settings
 */

// API Configuration
export const API_CONFIG = {
  // Product Information
  PRODUCT_NAME: 'Golden Age Club',
  
  // Server Configuration
  SERVER_IPS: ['74.220.48.0/24', '74.220.56.0/24'],
  DOMAIN: 'https://server-kl7c.onrender.com',
  
  // API Endpoints
  BASE_URL: 'https://server-kl7c.onrender.com',
  CALLBACK_URL: 'https://server-kl7c.onrender.com/api/callback',
  
  // Demo Configuration
  DEMO_SITE: 'https://pghome.co',
  DEMO_USERNAME: '', // To be filled from API response
  DEMO_PASSWORD: '', // To be filled from API response
  
  // Currency
  CURRENCY: 'USDT',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    
    // User Management
    USER_PROFILE: '/api/user/profile',
    USER_BALANCE: '/api/user/balance',
    USER_TRANSACTIONS: '/api/user/transactions',
    
    // Game Management
    GAMES_LIST: '/api/games',
    GAME_START: '/api/game/start',
    GAME_END: '/api/game/end',
    GAME_RESULT: '/api/game/result',
    
    // Wallet Operations
    DEPOSIT: '/api/wallet/deposit',
    WITHDRAW: '/api/wallet/withdraw',
    WALLET_HISTORY: '/api/wallet/history',
    
    // Demo & Configuration
    DEMO_CREDENTIALS: '/api/demo',
    PRODUCT_CONFIG: '/api/product/config',
    SYSTEM_CONFIG: '/api/config',
    
    // Callback
    CALLBACK: '/api/callback'
  }
};

// Request timeout configuration
export const REQUEST_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};