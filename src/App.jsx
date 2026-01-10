import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ApiProvider, useApi } from './contexts/ApiContext';
import { ToastContainer, useToast } from './components/Toast';
import LandingPage from './pages/Landing';
import Home from './pages/Home';
import Game from './pages/Game';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import './App.css';

function AppContent() {
  const [screen, setScreen] = useState('landing');
  const [screenData, setScreenData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const tg = window.Telegram?.WebApp;
  
  // Use API context
  const { 
    user, 
    isConnected, 
    demoCredentials, 
    config,
    loginWithDemo,
    deposit,
    withdraw
  } = useApi();

  // Initialize Telegram WebApp
  useEffect(() => {
    const initializeApp = async () => {
      if (tg) {
        tg.ready();
        tg.expand();
        
        // Set Golden Age Cash theme colors
        tg.setHeaderColor('#000000');
        tg.setBackgroundColor('#000000');
        
        // Get user from Telegram or use API user
        if (tg.initDataUnsafe?.user && !user) {
          const tgUser = tg.initDataUnsafe.user;
          
          // Try to login with demo credentials if available
          if (demoCredentials) {
            const loginResult = await loginWithDemo();
            if (loginResult.success) {
              toast.success(`Welcome to ${config.PRODUCT_NAME}, ${tgUser.first_name}!`);
            } else {
              toast.warning('Demo login failed, using offline mode');
            }
          }
          
          // Auto-navigate to home if user is logged in via Telegram
          setScreen('home');
        }
      }
      
      // Show connection status
      if (isConnected) {
        toast.success(`Connected to ${config.PRODUCT_NAME} API`);
      } else {
        toast.warning('API offline - using demo mode');
      }
      
      setIsLoading(false);
    };

    // Only initialize when API context is ready
    if (config) {
      initializeApp();
    }
  }, [tg, user, demoCredentials, isConnected, config, loginWithDemo, toast]);

  // Handle Telegram back button
  useEffect(() => {
    if (!tg) return;

    const handleBack = () => {
      tg.HapticFeedback?.impactOccurred('light');
      if (screen === 'game' || screen === 'wallet' || screen === 'profile') {
        navigate('home');
      } else if (screen === 'home') {
        navigate('landing');
      }
      setScreenData(null);
    };

    if (screen !== 'landing') {
      tg.BackButton.show();
      tg.BackButton.onClick(handleBack);
    } else {
      tg.BackButton.hide();
    }

    return () => {
      tg.BackButton.offClick(handleBack);
    };
  }, [screen, tg]);

  const navigate = (newScreen, data = null) => {
    tg?.HapticFeedback?.impactOccurred('light');
    setScreen(newScreen);
    setScreenData(data);
  };

  const updateBalance = async (amount) => {
    if (user && isConnected) {
      // Try to update balance via API
      try {
        if (amount > 0) {
          await deposit(amount);
        } else if (amount < 0) {
          await withdraw(Math.abs(amount));
        }
      } catch (error) {
        console.warn('Balance update via API failed, using local update');
      }
    }
    
    // Show toast notifications for balance changes
    if (amount > 0) {
      toast.success(`+${amount.toLocaleString()} ${config?.CURRENCY || 'USDT'} added to your balance!`);
    } else if (amount < 0) {
      toast.warning(`-${Math.abs(amount).toLocaleString()} ${config?.CURRENCY || 'USDT'} deducted from balance`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center glow-gold overflow-hidden">
            <img 
              src="/casinologo.jpg" 
              alt="Golden Age Cash"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="loading-dots mb-4">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p className="text-gray-400">Initializing {config?.PRODUCT_NAME || 'Golden Age Cash'}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {screen === 'landing' && (
        <LandingPage navigate={navigate} />
      )}
      {screen === 'home' && (
        <Home user={user} navigate={navigate} />
      )}
      {screen === 'game' && (
        <Game 
          user={user} 
          gameData={screenData}
          updateBalance={updateBalance}
          navigate={navigate}
        />
      )}
      {screen === 'wallet' && (
        <Wallet 
          user={user} 
          updateBalance={updateBalance}
          navigate={navigate}
        />
      )}
      {screen === 'profile' && (
        <Profile user={user} navigate={navigate} />
      )}
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  );
}

function App() {
  return (
    <ApiProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ApiProvider>
  );
}

export default App;