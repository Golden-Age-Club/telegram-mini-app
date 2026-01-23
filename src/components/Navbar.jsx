import React, { useEffect, useState } from 'react';
import { Globe, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ onNavigate }) => {
  const { currentLanguage, changeLanguage, languages, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsLangOpen(false);
  };

  const setModal = (type) => {
    const params = new URLSearchParams(location.search);
    params.set('modal', type);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const baseClasses =
    'fixed top-0 left-1/2 -translate-x-1/2 z-50 h-16 w-full max-w-[480px] transition-all duration-300';
  const themeClasses = isScrolled
    ? 'bg-[var(--bg-elevated)]/80 backdrop-blur-xl border-b border-[var(--border-light)] shadow-lg'
    : 'bg-transparent border-b border-transparent shadow-[0_0_40px_rgba(0,0,0,0.95)]';

  return (
    <nav className={`${baseClasses} ${themeClasses}`}>
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--gold)] shadow-[0_0_10px_var(--gold-glow)] group-hover:shadow-[0_0_15px_var(--gold-glow)] transition-shadow duration-300">
            <img src="/casinologo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg text-white hidden sm:block tracking-wide">Golden Age</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user?.balance !== undefined && (
            <div className="relative flex items-center gap-3 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-light)] text-white text-xs sm:text-sm font-semibold overflow-hidden shadow-inner">
              <span className="absolute inset-0 flex items-center justify-start opacity-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 48 48"
                  className="ml-[-4px]"
                >
                  <polygon
                    fill="var(--gold)"
                    points="24,44 2,22.5 10,5 38,5 46,22.5"
                  ></polygon>
                </svg>
              </span>
              <span className="relative z-10 text-sm font-bold text-[var(--gold-light)]">
                {user.balance.toLocaleString()} <span className="text-[var(--text-muted)] text-xs">USDT</span>
              </span>
              <button
                onClick={() => navigate('/wallet')}
                className="relative z-10 px-3 py-0.5 rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] text-black text-[11px] sm:text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-[0_0_10px_var(--gold-glow-soft)]"
              >
                Deposit
              </button>
            </div>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-2 rounded-full hover:bg-white/5 transition-colors text-[var(--text-secondary)] hover:text-[var(--gold)] cursor-pointer"
            >
              <Globe size={20} />
            </button>

            {/* Language Dropdown */}
            {isLangOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsLangOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded-lg shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto backdrop-blur-xl">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer ${
                        currentLanguage === lang.code ? 'text-[var(--gold)] bg-white/5' : 'text-gray-300'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModal('sign-in')}
                className="px-3 py-1.5 rounded-full bg-transparent border border-[var(--gold)] text-[var(--gold)] text-sm font-medium hover:bg-[var(--gold)]/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => setModal('sign-up')}
                className="px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-sm font-bold hover:brightness-110 transition-colors flex items-center gap-1 cursor-pointer shadow-[0_0_15px_var(--gold-glow)]"
              >
                <UserPlus size={14} />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
