import api from './axios';

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
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Get Balance:', error);
    throw error;
  }
};

/**
 * Get user's transaction history
 * @param {number} limit - Number of transactions to fetch (default: 50)
 */
export const getTransactions = async (limit = 50) => {
  try {
    console.log('📡 Wallet API: Get transactions', { limit });
    const response = await api.get(`/api/wallet/transactions?limit=${limit}`);
    console.log('✅ Wallet API Response - Get Transactions:', response);
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Get Transactions:', error);
    throw error;
  }
};

/**
 * Get specific transaction details
 * @param {string} transactionId - Transaction ID
 */
export const getTransaction = async (transactionId) => {
  try {
    console.log('📡 Wallet API: Get transaction', { transactionId });
    const response = await api.get(`/api/wallet/transaction/${transactionId}`);
    console.log('✅ Wallet API Response - Get Transaction:', response);
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Get Transaction:', error);
    throw error;
  }
};

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