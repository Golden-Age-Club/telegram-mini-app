import { createContext, useContext, useEffect, useState } from 'react';

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [webApp, setWebApp] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    // Check if running inside Telegram
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      setIsTelegram(true);
      setWebApp(tg);

      // Initialize the Web App
      tg.ready();
      tg.expand(); // Expand to full height

      // Set theme colors to match our dark theme
      tg.setHeaderColor('#09090b');
      tg.setBackgroundColor('#09090b');

      // Get user data
      if (tg.initDataUnsafe?.user) {
        const tgUser = tg.initDataUnsafe.user;
        setUser({
          id: tgUser.id,
          firstName: tgUser.first_name,
          lastName: tgUser.last_name || '',
          username: tgUser.username || '',
          languageCode: tgUser.language_code || 'en',
          photoUrl: tgUser.photo_url || null,
          isPremium: tgUser.is_premium || false,
        });
      }

      // Enable closing confirmation if user has unsaved data
      tg.enableClosingConfirmation();

      setIsReady(true);
    } else {
      // Running in browser (development mode)
      console.log('Not running in Telegram, using mock data');
      setIsTelegram(false);
      setIsReady(true);
      
      // Mock user for development
      setUser({
        id: 123456789,
        firstName: 'Dev',
        lastName: 'User',
        username: 'devuser',
        languageCode: 'en',
        photoUrl: null,
        isPremium: false,
      });
    }
  }, []);

  // Haptic feedback
  const hapticFeedback = (type = 'impact') => {
    if (!webApp?.HapticFeedback) return;
    
    switch (type) {
      case 'impact':
        webApp.HapticFeedback.impactOccurred('medium');
        break;
      case 'notification':
        webApp.HapticFeedback.notificationOccurred('success');
        break;
      case 'selection':
        webApp.HapticFeedback.selectionChanged();
        break;
      default:
        webApp.HapticFeedback.impactOccurred('light');
    }
  };

  // Show main button
  const showMainButton = (text, onClick) => {
    if (!webApp?.MainButton) return;
    
    webApp.MainButton.setText(text);
    webApp.MainButton.show();
    webApp.MainButton.onClick(onClick);
  };

  // Hide main button
  const hideMainButton = () => {
    if (!webApp?.MainButton) return;
    webApp.MainButton.hide();
  };

  // Show back button
  const showBackButton = (onClick) => {
    if (!webApp?.BackButton) return;
    webApp.BackButton.show();
    webApp.BackButton.onClick(onClick);
  };

  // Hide back button
  const hideBackButton = () => {
    if (!webApp?.BackButton) return;
    webApp.BackButton.hide();
  };

  // Show popup
  const showPopup = (title, message, buttons = []) => {
    if (!webApp?.showPopup) return Promise.resolve(null);
    
    return new Promise((resolve) => {
      webApp.showPopup({
        title,
        message,
        buttons: buttons.length ? buttons : [{ type: 'ok' }],
      }, (buttonId) => {
        resolve(buttonId);
      });
    });
  };

  // Show alert
  const showAlert = (message) => {
    if (!webApp?.showAlert) {
      alert(message);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      webApp.showAlert(message, resolve);
    });
  };

  // Show confirm
  const showConfirm = (message) => {
    if (!webApp?.showConfirm) {
      return Promise.resolve(confirm(message));
    }
    return new Promise((resolve) => {
      webApp.showConfirm(message, resolve);
    });
  };

  // Close the Mini App
  const close = () => {
    if (webApp?.close) {
      webApp.close();
    }
  };

  // Open link
  const openLink = (url, options = {}) => {
    if (webApp?.openLink) {
      webApp.openLink(url, options);
    } else {
      window.open(url, '_blank');
    }
  };

  // Open Telegram link (for channels, users, etc.)
  const openTelegramLink = (url) => {
    if (webApp?.openTelegramLink) {
      webApp.openTelegramLink(url);
    }
  };

  // Send data to bot
  const sendData = (data) => {
    if (webApp?.sendData) {
      webApp.sendData(JSON.stringify(data));
    }
  };

  const value = {
    webApp,
    user,
    isReady,
    isTelegram,
    hapticFeedback,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showPopup,
    showAlert,
    showConfirm,
    close,
    openLink,
    openTelegramLink,
    sendData,
    // Theme info
    colorScheme: webApp?.colorScheme || 'dark',
    themeParams: webApp?.themeParams || {},
    viewportHeight: webApp?.viewportHeight || window.innerHeight,
    viewportStableHeight: webApp?.viewportStableHeight || window.innerHeight,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

export default TelegramContext;
