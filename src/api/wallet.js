import api from './axios';
<<<<<<< HEAD
import { API_ENDPOINTS } from './config';

/**
 * Wallet API Service Functions
 * Integrates with FastAPI backend server for USDT wallet operations
 */

/**
 * Get current user balance
 * @returns {Promise<{balance: number}>}
 */
const getBalance = async () => {
  try {
    console.log('📡 Wallet API: Get balance');
    const response = await api.get(API_ENDPOINTS.WALLET.BALANCE);
    console.log('✅ Wallet API: Balance retrieved');
=======

/**
 * Wallet API Service Functions
 * Based on Golden Age USDT Wallet API
 */

// ==================== GET ENDPOINTS ====================

/**
 * Get current user's balance
 */
export const getBalance = async () => {
  try {
    console.log('📡 Wallet API: Get balance');
    const response = await api.get('/api/wallet/balance');
    console.log('✅ Wallet API Response - Get Balance:', response);
>>>>>>> 191eb8047438f5763ef34c456631ad09c1d9e03b
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Get Balance:', error);
    throw error;
  }
};

/**
<<<<<<< HEAD
 * Create a deposit order
 * @param {number} amount - Amount to deposit (10-100,000 USDT)
 * @param {string} currency - Currency type (USDT.TRC20, USDT.ERC20, USDT.BEP20)
 * @returns {Promise<{transaction_id: string, payment_url: string, payment_address: string}>}
 */
const createDeposit = async (amount, currency = 'USDT.TRC20') => {
  try {
    console.log('📡 Wallet API: Create deposit', { amount, currency });
    const response = await api.post(API_ENDPOINTS.WALLET.DEPOSIT, {
      amount,
      currency
    });
    console.log('✅ Wallet API: Deposit order created');
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Create Deposit:', error);
    throw error;
  }
};

/**
 * Create a withdrawal request
 * @param {number} amount - Amount to withdraw (10-50,000 USDT)
 * @param {string} walletAddress - Destination wallet address
 * @param {string} currency - Currency type (USDT.TRC20, USDT.ERC20, USDT.BEP20)
 * @returns {Promise<{transaction_id: string, status: string}>}
 */
const createWithdrawal = async (amount, walletAddress, currency = 'USDT.TRC20') => {
  try {
    console.log('📡 Wallet API: Create withdrawal', { amount, walletAddress, currency });
    const response = await api.post(API_ENDPOINTS.WALLET.WITHDRAW, {
      amount,
      wallet_address: walletAddress,
      currency
    });
    console.log('✅ Wallet API: Withdrawal request created');
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Create Withdrawal:', error);
    throw error;
  }
};

/**
 * Get transaction history
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (max: 50, default: 20)
 * @param {string} type - Transaction type filter ('deposit', 'withdrawal', or null for all)
 * @returns {Promise<{transactions: Array, total: number, page: number, limit: number}>}
 */
const getTransactions = async (page = 1, limit = 20, type = null) => {
  try {
    console.log('📡 Wallet API: Get transactions', { page, limit, type });
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (type) {
      params.append('type', type);
    }
    
    const response = await api.get(`${API_ENDPOINTS.WALLET.TRANSACTIONS}?${params}`);
    console.log('✅ Wallet API: Transactions retrieved');
=======
 * Get user's transaction history
 * @param {number} limit - Number of transactions to fetch (default: 50)
 */
export const getTransactions = async (limit = 50) => {
  try {
    console.log('📡 Wallet API: Get transactions', { limit });
    const response = await api.get(`/api/wallet/transactions?limit=${limit}`);
    console.log('✅ Wallet API Response - Get Transactions:', response);
>>>>>>> 191eb8047438f5763ef34c456631ad09c1d9e03b
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Get Transactions:', error);
    throw error;
  }
};

/**
 * Get specific transaction details
 * @param {string} transactionId - Transaction ID
<<<<<<< HEAD
 * @returns {Promise<object>} Transaction details
 */
const getTransaction = async (transactionId) => {
  try {
    console.log('📡 Wallet API: Get transaction', { transactionId });
    const response = await api.get(`${API_ENDPOINTS.WALLET.TRANSACTION}/${transactionId}`);
    console.log('✅ Wallet API: Transaction details retrieved');
=======
 */
export const getTransaction = async (transactionId) => {
  try {
    console.log('📡 Wallet API: Get transaction', { transactionId });
    const response = await api.get(`/api/wallet/transaction/${transactionId}`);
    console.log('✅ Wallet API Response - Get Transaction:', response);
>>>>>>> 191eb8047438f5763ef34c456631ad09c1d9e03b
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Get Transaction:', error);
    throw error;
  }
};

<<<<<<< HEAD
/**
 * Get deposit currencies and their limits
 * @returns {Array} Available currencies with min/max limits
 */
const getDepositCurrencies = () => {
  return [
    {
      code: 'USDT.TRC20',
      name: 'USDT (TRC20)',
      network: 'TRON',
      minAmount: 10,
      maxAmount: 100000,
      fee: 0,
      icon: '₮'
    },
    {
      code: 'USDT.ERC20',
      name: 'USDT (ERC20)',
      network: 'Ethereum',
      minAmount: 10,
      maxAmount: 100000,
      fee: 0,
      icon: '₮'
    },
    {
      code: 'USDT.BEP20',
      name: 'USDT (BEP20)',
      network: 'BSC',
      minAmount: 10,
      maxAmount: 100000,
      fee: 0,
      icon: '₮'
    }
  ];
};

/**
 * Get withdrawal currencies and their limits
 * @returns {Array} Available currencies with min/max limits
 */
const getWithdrawalCurrencies = () => {
  return [
    {
      code: 'USDT.TRC20',
      name: 'USDT (TRC20)',
      network: 'TRON',
      minAmount: 10,
      maxAmount: 50000,
      fee: 1, // 1 USDT fee
      icon: '₮'
    },
    {
      code: 'USDT.ERC20',
      name: 'USDT (ERC20)',
      network: 'Ethereum',
      minAmount: 10,
      maxAmount: 50000,
      fee: 5, // 5 USDT fee (higher due to gas)
      icon: '₮'
    },
    {
      code: 'USDT.BEP20',
      name: 'USDT (BEP20)',
      network: 'BSC',
      minAmount: 10,
      maxAmount: 50000,
      fee: 1, // 1 USDT fee
      icon: '₮'
    }
  ];
};

const walletApi = {
  getBalance,
  createDeposit,
  createWithdrawal,
  getTransactions,
  getTransaction,
  getDepositCurrencies,
  getWithdrawalCurrencies
};

export default walletApi;
=======
// ==================== POST ENDPOINTS ====================

/**
 * Create a deposit order
 * @param {Object} depositData - Deposit request data
 * @param {number} depositData.amount - Amount in USDT (min: 10, max: 100,000)
 * @param {string} depositData.currency - Currency (default: USDT.TRC20)
 * @param {string} depositData.return_url - Optional return URL
 */
export const createDeposit = async (depositData) => {
  try {
    console.log('📡 Wallet API: Create deposit', depositData);
    const response = await api.post('/api/wallet/deposit', {
      amount: depositData.amount,
      currency: depositData.currency || 'USDT.TRC20',
      return_url: depositData.return_url
    });
    console.log('✅ Wallet API Response - Create Deposit:', response);
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Create Deposit:', error);
    throw error;
  }
};

/**
 * Create a withdrawal request
 * @param {Object} withdrawalData - Withdrawal request data
 * @param {number} withdrawalData.amount - Amount in USDT (min: 10, max: 50,000)
 * @param {string} withdrawalData.wallet_address - USDT wallet address
 * @param {string} withdrawalData.currency - Currency (default: USDT.TRC20)
 */
export const createWithdrawal = async (withdrawalData) => {
  try {
    console.log('📡 Wallet API: Create withdrawal', withdrawalData);
    const response = await api.post('/api/wallet/withdraw', {
      amount: withdrawalData.amount,
      wallet_address: withdrawalData.wallet_address,
      currency: withdrawalData.currency || 'USDT.TRC20'
    });
    console.log('✅ Wallet API Response - Create Withdrawal:', response);
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Create Withdrawal:', error);
    throw error;
  }
};

// Export all functions as default object
export default {
  // GET endpoints
  getBalance,
  getTransactions,
  getTransaction,
  
  // POST endpoints
  createDeposit,
  createWithdrawal
};
>>>>>>> 191eb8047438f5763ef34c456631ad09c1d9e03b
