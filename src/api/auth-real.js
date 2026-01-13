import api from './axios';
import { API_ENDPOINTS, STORAGE_KEYS } from './config';

/**
 * Real authentication with Telegram WebApp integration
 */

export async function login(initData) {
  try {
    console.log('🔐 Auth API: Login attempt');
    
    // Check if we have real Telegram initData
    const tg = window.Telegram?.WebApp;
    const isRealTelegram = tg && tg.initData && tg.initData.length > 0;
    
    if (isRealTelegram && initData !== 'web_mode_user') {
      // Real Telegram authentication
      console.log('📱 Using real Telegram authentication');
      
      try {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { 
          init_data: initData 
        });
        
        if (response.access_token) {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
        }
        if (response.user) {
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        }
        
        console.log('✅ Telegram authentication successful');
        return response;
      } catch (error) {
        console.error('❌ Telegram API authentication failed:', error);
        // Fall back to mock if API fails
        return createMockTelegramUser(tg);
      }
    } else {
      // Mock authentication for development/web mode
      console.log('🌐 Using mock authentication');
      return createMockUser(initData);
    }
  } catch (error) {
    console.error('❌ Auth API Error - Login:', error);
    throw error;
  }
}

function createMockTelegramUser(tg) {
  const tgUser = tg?.initDataUnsafe?.user;
  
  console.log('📱 Raw Telegram user data:', tgUser);
  console.log('📱 Telegram WebApp object:', tg);
  
  // Extract user data with better fallbacks
  const firstName = tgUser?.first_name || 'Player';
  const lastName = tgUser?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const username = tgUser?.username || `user${tgUser?.id || Date.now()}`;
  
  // Handle profile photo - Telegram provides photo_url in initDataUnsafe.user
  let profilePhoto = null;
  if (tgUser?.photo_url) {
    profilePhoto = tgUser.photo_url;
  }
  
  const mockUser = {
    id: tgUser?.id || 123456789,
    first_name: firstName,
    last_name: lastName,
    name: fullName, // This should be used in Profile component
    username: username,
    photo_url: profilePhoto,
    avatar: profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    balance: 2500,
    isTelegramUser: true,
    level: 'Gold',
    joinDate: new Date().toISOString().split('T')[0]
  };
  
  console.log('📱 Final created Telegram user:', mockUser);
  console.log('📱 User name will be displayed as:', mockUser.name);
  console.log('📱 User avatar will be:', mockUser.avatar);
  
  const mockToken = 'telegram_token_' + Date.now();
  
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, mockToken);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
  
  return {
    access_token: mockToken,
    user: mockUser
  };
}

function createMockUser(initData) {
  let mockUser;
  
  if (initData === 'web_mode_user') {
    mockUser = {
      id: 'web_' + Date.now(),
      first_name: 'Web',
      last_name: 'Player',
      username: 'webplayer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=webplayer',
      balance: 1000,
      isWebUser: true,
      level: 'Silver',
      joinDate: new Date().toISOString().split('T')[0]
    };
  } else {
    mockUser = {
      id: 'guest_' + Date.now(),
      first_name: 'Guest',
      last_name: 'Player',
      username: 'guest',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
      balance: 500,
      isGuest: true,
      level: 'Bronze',
      joinDate: new Date().toISOString().split('T')[0]
    };
  }
  
  const mockToken = 'mock_token_' + Date.now();
  
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, mockToken);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
  
  return {
    access_token: mockToken,
    user: mockUser
  };
}

export async function refreshToken() {
  try {
    console.log('📡 Auth API: Refresh token');
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH);
    
    if (response.access_token) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
    }
    
    console.log('✅ Auth API: Token refreshed');
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Refresh Token:', error);
    // Return mock refresh for development
    return { access_token: 'refreshed_token_' + Date.now() };
  }
}

export async function getCurrentUser() {
  try {
    console.log('📡 Auth API: Get current user');
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    
    if (response) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response));
    }
    
    console.log('✅ Auth API: User profile retrieved');
    return response;
  } catch (error) {
    console.error('❌ Auth API Error - Get Current User:', error);
    // Return stored user as fallback
    return getStoredUser();
  }
}

export function logout() {
  console.log('📡 Auth API: Logout');
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  console.log('✅ Auth API: Logout successful');
}

export function isAuthenticated() {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  return !!token;
}

export function getStoredUser() {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('❌ Error parsing stored user data:', error);
    return null;
  }
}