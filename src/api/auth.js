import api from './axios';

export const login = async (initData) => {
  try {
    const response = await api.post('/api/auth/login', { init_data: initData });
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Login:', error);
    throw error;
  }
};

export const loginWithEmail = async (payload) => {
  try {
    const response = await api.post('/api/auth/login/email', payload);
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Login Email:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post('/api/auth/refresh');
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Refresh Token:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/users/me');
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Get Current User:', error);
    throw error;
  }
};

export const registerWithEmail = async (payload) => {
  try {
    const response = await api.post('/api/auth/register/email', payload);
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Register Email:', error);
    throw error;
  }
};

export const checkUsername = async (username) => {
  try {
    const response = await api.get(`/api/auth/check-username?username=${username}`);
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Check Username:', error);
    throw error;
  }
};

export default {
  login,
  loginWithEmail,
  refreshToken,
  getCurrentUser,
  registerWithEmail,
  checkUsername
};
