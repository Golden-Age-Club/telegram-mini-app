import { useState, useEffect } from 'react';
import { Home, Gamepad2, Wallet, User } from 'lucide-react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLayout } from '../contexts/LayoutContext';
import Navbar from './Navbar';
import SignInModal from './auth/SignInModal';
import SignUpModal from './auth/SignUpModal';

const Layout = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const tg = window.Telegram?.WebApp;
  
  const { user } = useAuth();
  const { title, showBack, onBack } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Determine current screen from path
  const currentScreen = location.pathname === '/' ? 'home' : location.pathname.substring(1);

  useEffect(() => {
    if (tg) {
      // Only set colors if supported
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#000000');
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#000000');
      }
    }
  }, [tg]);

  const navigation = [
    { id: 'home', label: 'Home', icon: Home, screen: '/' },
    { id: 'games', label: 'Games', icon: Gamepad2, screen: '/game' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, screen: '/wallet' },
    { id: 'profile', label: 'Profile', icon: User, screen: '/profile' },
  ];

  const handleNavigation = (screen) => {
    navigate(screen);
  };

  const modalType = searchParams.get('modal');

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="app flex flex-col pt-16 pb-20 min-h-screen w-full max-w-[480px] mx-auto relative shadow-2xl">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {modalType === 'sign-in' && <SignInModal onClose={closeModal} />}

      {modalType === 'sign-up' && <SignUpModal onClose={closeModal} />}

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 border-t border-emerald-500/30 bg-[var(--bg-elevated)]/95 backdrop-blur-md">
        <div className="flex max-w-md mx-auto px-2 py-1.5 gap-1">
          {navigation.map((item) => {
            const isActive = item.screen === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.screen);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.screen)}
                className={`flex-1 flex flex-col items-center justify-center rounded-xl px-2 py-1.5 text-[11px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600/80 text-gold shadow-[0_0_18px_rgba(16,185,129,0.45)] border border-emerald-400/60'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <item.icon 
                  size={20}
                  className={isActive ? 'text-gold' : 'text-gray-400'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={isActive ? 'text-gold mt-0.5' : 'text-gray-400 mt-0.5'}>
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
