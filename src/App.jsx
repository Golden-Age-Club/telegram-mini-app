import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ApiProvider, useApi } from './contexts/ApiContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
  
  // Use API and Auth contexts
  const { 
    isConnected, 
    deposit,
    withdraw
  } = useApi();
  
  const {
    user,
    isAuthenticated,
    loginWithDemo
  } = useAuth();

  // Initialize Telegram WebApp
  useEffect(() => {
    let initializationDone = false;
    
    const initializeApp = async () => {
      if (initializationDone) return;
      initializationDone = true;
      
      // Clear any existing toasts first
      toast.clearAll();
      
      if (tg) {
        tg.ready();
        tg.expand();
        
        // Set Golden Age Cash theme colors (only if supported)
        if (tg.setHeaderColor) {
          tg.setHeaderColor('#000000');
        }
        if (tg.setBackgroundColor) {
          tg.setBackgroundColor('#000000');
        }
        
        // Get user from Telegram or use API user
        if (tg.initDataUnsafe?.user && !user) {
          const tgUser = tg.initDataUnsafe.user;
          
          // Try to login with demo credentials
          const loginResult = await loginWithDemo();
          if (loginResult.success) {
            toast.success(`Welcome to Golden Age Club, ${tgUser.first_name}!`);
          }
          
          // Auto-navigate to home if user is logged in via Telegram
          setScreen('home');
        }
      }
      
      setIsLoading(false);
    };

    // Only initialize when contexts are ready
    if (isLoading) {
      initializeApp();
    }
  }, [isLoading, isConnected, user, loginWithDemo, toast, tg]);

  // Handle Telegram back button
  useEffect(() => {
    if (!tg?.BackButton) return;

    const handleBack = () => {
      // Only use haptic feedback if supported
      if (tg?.HapticFeedback?.impactOccurred) {
        tg.HapticFeedback.impactOccurred('light');
      }
      if (screen === 'game' || screen === 'wallet' || screen === 'profile') {
        navigate('home');
      } else if (screen === 'home') {
        navigate('landing');
      }
      setScreenData(null);
    };

    if (screen !== 'landing' && tg.BackButton.show) {
      tg.BackButton.show();
      tg.BackButton.onClick(handleBack);
    } else if (tg.BackButton.hide) {
      tg.BackButton.hide();
    }

    return () => {
      if (tg.BackButton.offClick) {
        tg.BackButton.offClick(handleBack);
      }
    };
  }, [screen, tg]);

  const navigate = (newScreen, data = null) => {
    // Only use haptic feedback if supported
    if (tg?.HapticFeedback?.impactOccurred) {
      tg.HapticFeedback.impactOccurred('light');
    }
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
      toast.success(`+${amount.toLocaleString()} USDT added to your balance!`);
    } else if (amount < 0) {
      toast.warning(`-${Math.abs(amount).toLocaleString()} USDT deducted from balance`);
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
          <p className="text-gray-400">Initializing Golden Age Club...</p>
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
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;