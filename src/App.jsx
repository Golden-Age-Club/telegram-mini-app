import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import LandingPage from './components/LandingPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import HomePage from './components/HomePage.jsx';
import GameListPage from './components/GameListPage.jsx';
import GameWebView from './components/GameWebView.jsx';
import WalletPage from './components/WalletPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [gameData, setGameData] = useState(null);

  const handleNavigation = (page, data = null) => {
    setCurrentPage(page);
    if (data) {
      setGameData(data);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

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
      // Legacy routes for backward compatibility
      case 'dashboard':
        return <HomePage user={user} onNavigate={handleNavigation} />;
      default:
        return <LandingPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="App">
        {renderCurrentPage()}
      </div>
    </LanguageProvider>
  );
};

export default App;
