import api from './axios';

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

export const loginWithEmail = async (payload) => {
  try {
    console.log('📡 Auth API: Email login', payload.email);
    const response = await api.post('/api/auth/login/email', payload);
    console.log('✅ Auth API Response - Login Email:', response);
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Login Email:', error);
    throw error;
  }
};

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

export const registerWithEmail = async (payload) => {
  try {
    console.log('📡 Auth API: Email register', payload);
    const response = await api.post('/api/auth/register/email', payload);
    console.log('✅ Auth API Response - Register Email:', response);
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Register Email:', error);
    throw error;
  }
};

export default {
  login,
  loginWithEmail,
  refreshToken,
  getCurrentUser,
  registerWithEmail
};
