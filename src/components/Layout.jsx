import { useState, useEffect } from 'react';
import { Home, Dices, Wallet, User } from 'lucide-react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLayout } from '../contexts/LayoutContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import Navbar from './Navbar.jsx';
import SignInModal from './auth/SignInModal.jsx';
import SignUpModal from './auth/SignUpModal.jsx';

const Layout = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const tg = window.Telegram?.WebApp;
  
  const { user } = useAuth();
  const { t } = useLanguage();
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
    { id: 'home', label: t('home'), icon: Home, screen: '/' },
    { id: 'slots', label: t('slots'), icon: Dices, screen: '/slots' },
    { id: 'wallet', label: t('wallet'), icon: Wallet, screen: '/wallet' },
    { id: 'profile', label: t('profile'), icon: User, screen: '/profile' },
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
    <div className="app bg-gradient-primary flex flex-col pt-16 pb-20 min-h-screen w-full max-w-[480px] mx-auto relative shadow-[0_0_60px_rgba(0,0,0,0.9)] border-x border-[var(--border)]">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {modalType === 'sign-in' && <SignInModal onClose={closeModal} />}

      {modalType === 'sign-up' && <SignUpModal onClose={closeModal} />}

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 border-t border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-md">
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
                    ? 'bg-[var(--bg-card)] text-[var(--gold)] border border-[var(--gold)]/45 shadow-[0_0_22px_rgba(212,175,55,0.45)]'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <item.icon 
                  size={20}
                  className={isActive ? 'text-[var(--gold)]' : 'text-gray-400'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={isActive ? 'text-[var(--gold)] mt-0.5' : 'text-gray-400 mt-0.5'}>
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
