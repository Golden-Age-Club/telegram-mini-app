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
    ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl'
    : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent border-b border-transparent';

  return (
    <nav className={`${baseClasses} ${themeClasses}`}>
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="relative w-9 h-9">
             <div className="absolute inset-0 rounded-full bg-[var(--gold)] blur-[8px] opacity-40 group-hover:opacity-60 transition-opacity" />
             <div className="relative w-full h-full rounded-full overflow-hidden border border-[var(--gold)] shadow-sm">
               <img src="/casinologo.jpg" alt="Logo" className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-base text-white leading-none tracking-wide font-display">GOLDEN</span>
            <span className="text-[10px] font-bold text-[var(--gold)] leading-none tracking-[0.2em] mt-0.5">AGE CLUB</span>
          </div>
          <span className="sm:hidden font-bold text-lg text-white tracking-wide">Golden Age</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Auth & Balance Section */}
          {isAuthenticated && user?.balance !== undefined ? (
            <div className="flex items-center gap-2">
                {/* Balance Pill */}
                <div className="flex flex-col items-end mr-1">
                    <span className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">{t('usdtBalance') || 'Balance'}</span>
                    <div className="flex items-baseline gap-1 text-sm font-bold text-[var(--gold)] leading-none">
                        {user.balance.toLocaleString()}
                        <span className="text-[10px] text-white/60 font-normal">USDT</span>
                    </div>
                </div>
                
                {/* Deposit Button (Compact) */}
                <button
                    onClick={() => navigate('/wallet')}
                    className="w-8 h-8 rounded-full bg-gradient-to-b from-[var(--gold)] to-amber-600 flex items-center justify-center text-black shadow-[0_0_12px_rgba(255,215,0,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                    <span className="text-lg font-bold leading-none mb-0.5">+</span>
                </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModal('sign-in')}
                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-[var(--gold)] uppercase tracking-widest transition-colors cursor-pointer"
              >
                {t('login') || 'Log In'}
              </button>
              <button
                onClick={() => setModal('sign-up')}
                className="relative overflow-hidden px-5 py-2 rounded-lg bg-gradient-to-r from-[var(--gold)] to-[#FFA500] text-black text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
                <span className="relative z-10">{t('signup') || 'Sign Up'}</span>
              </button>
            </div>
          )}

          {/* Vertical Divider */}
          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Language Switcher - Last Item */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[var(--gold)] hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/10 transition-all cursor-pointer"
            >
              <Globe size={18} />
            </button>

            {/* Language Dropdown */}
            {isLangOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsLangOpen(false)}
                />
                <div className="absolute right-0 top-full mt-4 w-48 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-[var(--gold)]/20 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-50 max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ring-1 ring-white/5">
                  <div className="py-1">
                    {languages.map((lang) => (
                        <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all cursor-pointer border-b border-white/5 last:border-0 group ${
                            currentLanguage === lang.code 
                            ? 'bg-[var(--gold)]/10 text-[var(--gold)]' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                        >
                        <span className="text-xl leading-none filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-200">{lang.flag}</span>
                        <span className={`text-xs uppercase tracking-widest ${currentLanguage === lang.code ? 'font-bold' : 'font-medium'}`}>{lang.name}</span>
                        {currentLanguage === lang.code && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--gold)] shadow-[0_0_8px_var(--gold)]" />}
                        </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
