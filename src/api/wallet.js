import api from './axios';
import { API_ENDPOINTS } from './config';

/**
 * Wallet API Service Functions
 * Based on Golden Age USDT Wallet API
 */

// ==================== GET ENDPOINTS ====================

/**
 * Get wallet balance
 */
export const getBalance = async () => {
  try {
    console.log('📡 Wallet API: Get balance');
    const response = await api.get(API_ENDPOINTS.WALLET.BALANCE);
    console.log('✅ Wallet API Response - Balance:', response);
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Balance:', error);
    throw error;
  }
};

/**
 * Get transaction history
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @param {string} type - Transaction type filter (optional)
 */
export const getTransactions = async (page = 1, limit = 20, type = null, startDate = null, endDate = null) => {
  try {
    console.log('📡 Wallet API: Get transactions');
    const params = { page, limit };
    if (type) params.type = type;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(API_ENDPOINTS.WALLET.TRANSACTIONS, { params });
    console.log('✅ Wallet API Response - Transactions:', response);
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Transactions:', error);
    throw error;
  }
};

/**
 * Get specific transaction details
 * @param {string} transactionId - Transaction ID
 */
export const getTransaction = async (transactionId) => {
  try {
    console.log('📡 Wallet API: Get transaction', transactionId);
    const response = await api.get(`${API_ENDPOINTS.WALLET.TRANSACTION}/${transactionId}`);
    console.log('✅ Wallet API Response - Transaction:', response);
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Transaction:', error);
    throw error;
  }
};

/**
 * Get available deposit currencies
 */
export const getDepositCurrencies = async () => {
  try {
    console.log('📡 Wallet API: Get deposit currencies');
    const response = await api.get(`${API_ENDPOINTS.WALLET.DEPOSIT}/currencies`);
    console.log('✅ Wallet API Response - Deposit Currencies:', response);
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Deposit Currencies:', error);
    // Return default currencies as fallback
    return {
      currencies: [
        { code: 'USDT.TRC20', name: 'USDT (TRC20)', minAmount: 0.0001, maxAmount: 10000 },
        { code: 'USDT.ERC20', name: 'USDT (ERC20)', minAmount: 0.0001, maxAmount: 10000 }
      ]
    };
  }
};

/**
 * Get available withdrawal currencies
 */
export const getWithdrawalCurrencies = async () => {
  try {
    console.log('📡 Wallet API: Get withdrawal currencies');
    const response = await api.get(`${API_ENDPOINTS.WALLET.WITHDRAW}/currencies`);
    console.log('✅ Wallet API Response - Withdrawal Currencies:', response);
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Withdrawal Currencies:', error);
    // Return default currencies as fallback
    return {
      currencies: [
        { code: 'USDT.TRC20', name: 'USDT (TRC20)', minAmount: 0.0001, maxAmount: 10000, fee: 0.0001 },
        { code: 'USDT.ERC20', name: 'USDT (ERC20)', minAmount: 0.0001, maxAmount: 10000, fee: 0.0001 }
      ]
    };
  }
};

// ==================== POST ENDPOINTS ====================

/**
 * Create deposit order
 * @param {number} amount - Deposit amount
 * @param {string} currency - Currency code (default: 'USDT.TRC20')
 */
export const createDeposit = async (amount, currency = 'USDT.TRC20') => {
  try {
    console.log('📡 Wallet API: Create deposit', { amount, currency });
    const response = await api.post(API_ENDPOINTS.WALLET.DEPOSIT, {
      amount,
      currency
    });
    console.log('✅ Wallet API Response - Create Deposit:', response);
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Create Deposit:', error);
    throw error;
  }
};

/**
 * Create withdrawal request
 * @param {number} amount - Withdrawal amount
 * @param {string} walletAddress - Recipient wallet address
 * @param {string} currency - Currency code (default: 'USDT.TRC20')
 */
export const createWithdrawal = async (amount, walletAddress, currency = 'USDT.TRC20') => {
  try {
    console.log('📡 Wallet API: Create withdrawal', { amount, walletAddress, currency });
    const response = await api.post(API_ENDPOINTS.WALLET.WITHDRAW, {
      amount,
      wallet_address: walletAddress,
      currency
    });
    console.log('✅ Wallet API Response - Create Withdrawal:', response);
    return response;
  } catch (error) {
    console.error('❌ Wallet API Error - Create Withdrawal:', error);
    throw error;
  }
};

/**
 * Get withdrawal fee
 * @param {string} network - Network (TRC20, ERC20, BEP20)
 */
export const getWithdrawFee = async (network) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.WALLET.WITHDRAW}-fee`, { params: { network } });
    return response.data || response;
  } catch (error) {
    console.error('❌ Wallet API Error - Withdraw Fee:', error);
    throw error;
  }
};

/**
 * Validate wallet address
 * @param {string} address - Address to validate
 * @param {string} network - Network (TRC20, ERC20, BEP20)
 */
export const validateAddress = async (address, network) => {
  try {
    const response = await api.post('/api/wallet/validate-address', { address, network });
    return response.data || response;
  } catch (error) {
    console.error('❌ Wallet API Error - Validate Address:', error);
    throw error;
  }
};

// Export all functions as default object
export default {
  getBalance,
  getTransactions,
  getTransaction,
  getDepositCurrencies,
  getWithdrawalCurrencies,
  createDeposit,
  createWithdrawal,
  getWithdrawFee,
  validateAddress
};