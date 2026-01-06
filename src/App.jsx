import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { TelegramProvider, useTelegram } from './contexts/TelegramContext.jsx';
import LandingPage from './components/LandingPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import HomePage from './components/HomePage.jsx';
import GameListPage from './components/GameListPage.jsx';
import GameWebView from './components/GameWebView.jsx';
import WalletPage from './components/WalletPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import './App.css';

function AppContent() {
  const { user: tgUser, isReady, isTelegram, showBackButton, hideBackButton, hapticFeedback } = useTelegram();
  
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [gameData, setGameData] = useState(null);

  // Auto-login if we have Telegram user data
  useEffect(() => {
    if (isReady && tgUser && isTelegram) {
      // Auto-login with Telegram user
      setUser({
        id: tgUser.id,
        name: `${tgUser.firstName} ${tgUser.lastName}`.trim(),
        username: tgUser.username || `user${tgUser.id}`,
        avatar: tgUser.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tgUser.id}`,
        balance: 2368.50, // This would come from your backend
        isAgent: false,
        isPremium: tgUser.isPremium,
      });
      setCurrentPage('home');
    }
  }, [isReady, tgUser, isTelegram]);

  // Handle back button
  useEffect(() => {
    const pagesWithBack = ['login', 'games', 'gameView', 'wallet', 'profile'];
    
    if (pagesWithBack.includes(currentPage)) {
      showBackButton(() => {
        hapticFeedback('impact');
        handleNavigation(getBackPage(currentPage));
      });
    } else {
      hideBackButton();
    }
  }, [currentPage, showBackButton, hideBackButton, hapticFeedback]);

  const getBackPage = (page) => {
    switch (page) {
      case 'login': return 'landing';
      case 'gameView': return 'games';
      case 'games':
      case 'wallet':
      case 'profile':
        return 'home';
      default:
        return 'home';
    }
  };

  const handleNavigation = (page, data = null) => {
    hapticFeedback('selection');
    setCurrentPage(page);
    if (data) {
      setGameData(data);
    }
  };

  const handleLogin = (userData) => {
    hapticFeedback('notification');
    setUser(userData);
  };

  const handleLogout = () => {
    hapticFeedback('impact');
    setUser(null);
    setCurrentPage('landing');
  };

  // Show loading while Telegram SDK initializes
  if (!isReady) {
    return (
      <div className="min-h-screen bg-[--bg-base] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[--text-muted]">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigation} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigation} onLogin={handleLogin} />;
      case 'home':
        return <HomePage user={user} onNavigate={handleNavigation} />;
      case 'games':
        return <GameListPage user={user} onNavigate={handleNavigation} />;
      case 'gameView':
        return <GameWebView user={user} onNavigate={handleNavigation} gameData={gameData} />;
      case 'wallet':
        return <WalletPage user={user} onNavigate={handleNavigation} />;
      case 'profile':
        return <ProfilePage user={user} onNavigate={handleNavigation} onLogout={handleLogout} />;
      case 'dashboard':
        return <HomePage user={user} onNavigate={handleNavigation} />;
      default:
        return <LandingPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

function App() {
  return (
    <TelegramProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </TelegramProvider>
  );
}

export default App;
