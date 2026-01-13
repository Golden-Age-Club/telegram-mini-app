import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastContainer, useToast } from './components/Toast';
import { useAuth } from './hooks/useAuth';
import { useWallet } from './hooks/useWallet';
import LandingPage from './pages/Landing';
import Home from './pages/Home';
import Game from './pages/Game';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [screen, setScreen] = useState('landing');
  const [screenData, setScreenData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const toast = useToast();
  const tg = window.Telegram?.WebApp;

  // Authentication hook
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    updateUserBalance,
    error: authError 
  } = useAuth();

  // Wallet hook
  const { 
    balance, 
    fetchBalance, 
    createDeposit, 
    createWithdrawal, 
    fetchTransactions,
    refreshWallet 
  } = useWallet(updateUserBalance);

  // Initialize Telegram WebApp
  useEffect(() => {
    const initializeApp = async () => {
      if (hasInitialized) return;
      setHasInitialized(true);
      
      if (tg) {
        tg.ready();
        tg.expand();
        
        // Set Golden Age Cash theme colors
        tg.setHeaderColor('#000000');
        tg.setBackgroundColor('#000000');
        
        // Check if we have real Telegram data
        const hasRealTelegramData = tg.initData && tg.initData.length > 0;
        
        if (hasRealTelegramData) {
          try {
            console.log('🔐 Authenticating with real Telegram data...');
            console.log('📱 Telegram initData:', tg.initData);
            console.log('📱 Telegram initDataUnsafe:', tg.initDataUnsafe);
            const response = await login(tg.initData);
            
            if (response.user) {
              console.log('✅ Real Telegram auth successful, user:', response.user);
              // Welcome message with real Telegram user
              setTimeout(() => {
                toast.success(`Welcome back, ${response.user.first_name || 'Player'}!`);
              }, 1000);
              
              // Auto-navigate to home if user is logged in
              setScreen('home');
              
              // Fetch wallet data
              await refreshWallet();
            }
          } catch (error) {
            console.error('❌ Telegram authentication failed:', error);
            toast.error('Authentication failed. Please try again.');
            // Fall back to web mode
            await initWebMode();
          }
        } else if (tg.initDataUnsafe?.user) {
          // Telegram environment but no initData - use initDataUnsafe for mock
          console.log('📱 Telegram environment detected, using mock auth...');
          console.log('📱 Available Telegram user data:', tg.initDataUnsafe.user);
          try {
            const response = await login('telegram_mock');
            
            if (response.user) {
              console.log('📱 Mock Telegram auth successful, user:', response.user);
              console.log('📱 Final user object:', response.user);
              setTimeout(() => {
                toast.success(`Welcome to Golden Age Cash, ${response.user.first_name || 'Player'}!`);
              }, 1000);
              
              setScreen('home');
              await refreshWallet();
            }
          } catch (error) {
            console.error('❌ Telegram mock authentication failed:', error);
            await initWebMode();
          }
        } else {
          // In Telegram but no user data - fall back to web mode
          console.log('🌐 No Telegram user data, using web mode');
          await initWebMode();
        }
      } else {
        // Not in Telegram environment - web mode
        console.log('🌐 Web mode - not in Telegram environment');
        await initWebMode();
      }
      
      setIsLoading(false);
    };

    const initWebMode = async () => {
      try {
        // Try to authenticate with mock data for web mode
        const response = await login('web_mode_user');
        
        if (response.user) {
          setTimeout(() => {
            toast.success(`Welcome to Golden Age Cash, ${response.user.first_name || 'Player'}!`);
          }, 1000);
          
          setScreen('home');
          await refreshWallet();
        }
      } catch (error) {
        console.error('❌ Web mode authentication failed:', error);
        toast.info('Welcome to Golden Age Cash! Click to get started.');
        // Stay on landing page for manual login
      }
    };

    initializeApp();
  }, []); // Empty dependency array to run only once

  // Handle authentication errors
  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError, toast]);

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
    try {
      // For game wins/losses, we'll need to implement game API endpoints
      // For now, just update locally and show toast
      const newBalance = (user?.balance || balance) + amount;
      updateUserBalance(newBalance);
      
      // Show toast notifications for balance changes
      if (amount > 0) {
        toast.success(`+${amount.toLocaleString()} USDT added to your balance!`);
      } else if (amount < 0) {
        toast.warning(`-${Math.abs(amount).toLocaleString()} USDT deducted from balance`);
      }
      
      // In a real implementation, you'd call an API to update the balance on the server
      // await gameApi.updateBalance(amount);
    } catch (error) {
      console.error('❌ Balance update error:', error);
      toast.error('Failed to update balance');
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
          <p className="text-gray-400">Initializing Golden Age Cash...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated && screen !== 'landing') {
    setScreen('landing');
  }

  return (
    <LanguageProvider>
      <div className="app">
        {screen === 'landing' && (
          <LandingPage navigate={navigate} />
        )}
        {screen === 'home' && isAuthenticated && (
          <Home 
            user={{ ...user, balance: user?.balance || balance }} 
            navigate={navigate} 
          />
        )}
        {screen === 'game' && isAuthenticated && (
          <Game 
            user={{ ...user, balance: user?.balance || balance }}
            gameData={screenData}
            updateBalance={updateBalance}
            navigate={navigate}
          />
        )}
        {screen === 'wallet' && isAuthenticated && (
          <Wallet 
            user={{ ...user, balance: user?.balance || balance }}
            updateBalance={updateBalance}
            navigate={navigate}
            walletApi={{
              createDeposit,
              createWithdrawal,
              fetchTransactions,
              refreshWallet
            }}
          />
        )}
        {screen === 'profile' && isAuthenticated && (
          <Profile 
            user={(() => {
              const profileUser = { ...user, balance: user?.balance || balance };
              console.log('📱 Passing user to Profile component:', profileUser);
              return profileUser;
            })()} 
            navigate={navigate}
            onLogout={logout}
          />
        )}
        
        {/* Toast Notifications */}
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      </div>
    </LanguageProvider>
  );
}

export default App;