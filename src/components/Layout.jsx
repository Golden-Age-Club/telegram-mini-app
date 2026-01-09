import { useState, useEffect } from 'react';
import { ChevronLeft, Menu, X, Home, Gamepad2, Wallet, User } from 'lucide-react';

const Layout = ({ children, title, showBack = false, onBack, user, navigate, currentScreen = 'home' }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
    }
  }, [tg]);

  const navigation = [
    { id: 'home', label: 'Home', icon: Home, screen: 'home' },
    { id: 'games', label: 'Games', icon: Gamepad2, screen: 'game' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, screen: 'wallet' },
    { id: 'profile', label: 'Profile', icon: User, screen: 'profile' },
  ];

  const handleNavigation = (screen) => {
    setShowMobileMenu(false);
    if (navigate) {
      navigate(screen);
    }
  };

  return (
    <div className="app">
      {/* Mobile Header */}
      <header className="header-bar">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
          )}
          
          <div className="app-title">
            <div className="telegram-icon overflow-hidden relative">
              <img 
                src="/casinologo.jpg" 
                alt="Golden Age Cash"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 pointer-events-none"></div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-gradient-gold tracking-tight text-base truncate">
                Golden Age Cash
              </div>
              {title && (
                <div className="text-xs text-gray-400 mt-0.5 font-medium truncate">
                  {title}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user?.balance !== undefined && (
            <div className="balance-chip">
              <span className="text-xs">💰</span>
              <span className="truncate">${user.balance.toLocaleString()}</span>
            </div>
          )}
          
          <button
            onClick={() => setShowMobileMenu(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Menu size={20} className="text-white" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="modal-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="modal-content w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Navigation</h3>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.screen)}
                  className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-white/5 transition-colors text-left touch-manipulation"
                  style={{ minHeight: '56px' }}
                >
                  <item.icon size={20} className="text-gray-400" />
                  <span className="text-white font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Optimized */}
      <nav className="bottom-nav">
        <div className="flex">
          {navigation.map((item) => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.screen)}
                className={`bottom-nav-item flex-1 ${isActive ? 'active' : ''}`}
              >
                <item.icon 
                  size={20} 
                  className={isActive ? 'text-gold' : 'text-gray-400'} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-xs font-medium ${isActive ? 'text-gold' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;