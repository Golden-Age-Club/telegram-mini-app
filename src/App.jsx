import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastContainer, useToast } from './components/Toast';
import LandingPage from './pages/Landing';
import Home from './pages/Home';
import Game from './pages/Game';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [screen, setScreen] = useState('landing');
  const [screenData, setScreenData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const tg = window.Telegram?.WebApp;

  // Initialize Telegram WebApp
  useEffect(() => {
    const initializeApp = async () => {
      if (tg) {
        tg.ready();
        tg.expand();
        
        // Set Golden Age Cash theme colors
        tg.setHeaderColor('#000000');
        tg.setBackgroundColor('#000000');
        
        // Get user from Telegram
        if (tg.initDataUnsafe?.user) {
          const tgUser = tg.initDataUnsafe.user;
          setUser({
            id: tgUser.id,
            name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
            username: tgUser.username || `user${tgUser.id}`,
            avatar: tgUser.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tgUser.id}`,
            balance: 2368.50,
            level: 'Gold',
            joinDate: new Date().toISOString().split('T')[0],
          });
          
          // Welcome message
          setTimeout(() => {
            toast.success(`Welcome to Golden Age Cash, ${tgUser.first_name}!`);
          }, 1000);
          
          // Auto-navigate to home if user is logged in via Telegram
          setScreen('home');
        }
      }
      
      // Mock user for development outside Telegram
      if (!tg?.initDataUnsafe?.user) {
        setUser({
          id: 123456789,
          name: 'Golden Player',
          username: 'player',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player',
          balance: 2368.50,
          level: 'Gold',
          joinDate: '2024-01-01',
        });
        
        setTimeout(() => {
          toast.info('Welcome to Golden Age Cash! Demo mode active.');
        }, 1000);
      }
      
      setIsLoading(false);
    };

    initializeApp();
  }, []);

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

  const updateBalance = (amount) => {
    const newBalance = user.balance + amount;
    setUser(prev => prev ? { ...prev, balance: newBalance } : prev);
    
    // Show toast notifications for balance changes
    if (amount > 0) {
      toast.success(`+$${amount.toLocaleString()} added to your balance!`);
    } else if (amount < 0) {
      toast.warning(`-$${Math.abs(amount).toLocaleString()} deducted from balance`);
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

  return (
    <LanguageProvider>
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
    </LanguageProvider>
  );
}

export default App;
