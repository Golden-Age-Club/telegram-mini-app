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
    'fixed top-0 left-1/2 -translate-x-1/2 z-50 h-16 w-full max-w-[480px] backdrop-blur-md transition-colors transition-shadow duration-300';
  const themeClasses = isScrolled
    ? 'bg-[var(--bg-elevated)]/95 border-b border-emerald-500/40 shadow-lg shadow-emerald-900/50'
    : 'bg-[var(--bg-primary)]/85 border-b border-[var(--border)]';

  return (
    <nav className={`${baseClasses} ${themeClasses}`}>
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d4af37]">
            <img src="/casinologo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg text-white hidden sm:block">Golden Age</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user?.balance !== undefined && (
            <div className="relative flex items-center gap-3 px-3 py-1.5 rounded-full bg-emerald-600/90 text-white text-xs sm:text-sm font-semibold overflow-hidden">
              <span className="absolute inset-0 flex items-center justify-start opacity-30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 48 48"
                  className="ml-[-4px]"
                >
                  <polygon
                    fill="#4db6ac"
                    points="24,44 2,22.5 10,5 38,5 46,22.5"
                  ></polygon>
                  <path
                    fill="#fff"
                    d="M38,22c0-1.436-4.711-2.635-11-2.929V16h8v-6H13v6h8v3.071C14.711,19.365,10,20.564,10,22	s4.711,2.635,11,2.929V36h6V24.929C33.289,24.635,38,23.436,38,22z M24,24c-6.627,0-12-1.007-12-2.25c0-1.048,3.827-1.926,9-2.176	v3.346c0.96,0.06,1.96,0.08,3,0.08s2.04-0.02,3-0.08v-3.346c5.173,0.25,9,1.128,9,2.176C36,22.993,30.627,24,24,24z"
                  ></path>
                </svg>
              </span>
              <span className="relative z-10 text-sm font-bold">
                {user.balance.toLocaleString()} USDT
              </span>
              <button
                onClick={() => navigate('/wallet')}
                className="relative z-10 px-3 py-0.5 rounded-full bg-emerald-400 text-black text-[11px] sm:text-xs font-bold hover:bg-emerald-300 transition-colors cursor-pointer"
              >
                Deposit
              </button>
            </div>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer"
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
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a2a1a] border border-[#d4af37]/30 rounded-lg shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer ${
                        currentLanguage === lang.code ? 'text-[#d4af37] bg-white/5' : 'text-gray-300'
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
                className="px-3 py-1.5 rounded-full bg-transparent border border-[#d4af37] text-[#d4af37] text-sm font-medium hover:bg-[#d4af37]/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => setModal('sign-up')}
                className="px-3 py-1.5 rounded-full bg-[#d4af37] text-black text-sm font-bold hover:bg-[#b8860b] transition-colors flex items-center gap-1 cursor-pointer"
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
