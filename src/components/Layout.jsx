import { useState, useEffect } from 'react';
import { ChevronLeft, Menu, X, Home, Gamepad2, Wallet, User, Settings } from 'lucide-react';

const Layout = ({ children, title, showBack = false, onBack, user }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
    }
  }, [tg]);

  const navigation = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'games', label: 'Games', icon: Gamepad2, path: '/game' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, path: '/wallet' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  const handleNavigation = (path) => {
    setShowMobileMenu(false);
    // Handle navigation logic here
    window.location.hash = path;
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header-bar">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
          )}
          
          <div className="app-title">
            <div className="telegram-icon overflow-hidden">
              <img 
                src="/casinologo.jpg" 
                alt="Golden Age Cash"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="font-semibold text-gradient-gold">Golden Age Cash</div>
              {title && <div className="text-xs text-gray-400">{title}</div>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.balance !== undefined && (
            <div className="balance-chip">
              <span className="text-xs">💰</span>
              <span>${user.balance.toLocaleString()}</span>
            </div>
          )}
          
          <button
            onClick={() => setShowMobileMenu(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors md:hidden"
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
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <item.icon size={20} className="text-gray-400" />
                  <span className="text-white">{item.label}</span>
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

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden bg-black/80 backdrop-blur-lg border-t border-white/10">
        <div className="flex">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className="flex-1 flex flex-col items-center gap-1 p-3 hover:bg-white/5 transition-colors"
            >
              <item.icon size={20} className="text-gray-400" />
              <span className="text-xs text-gray-400">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;