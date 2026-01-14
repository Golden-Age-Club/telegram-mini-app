import React, { useEffect, useState } from 'react';
import { Globe, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ onNavigate }) => {
  const { currentLanguage, changeLanguage, languages, t } = useLanguage();
  const { isAuthenticated, loginWithDemo, logout } = useAuth();
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

          {/* Auth Buttons */}
          {!isAuthenticated ? (
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
          ) : (
             <div className="flex items-center gap-2">
                 {/* If logged in, maybe show profile icon or logout? 
                     User didn't explicitly ask for this, but good to have.
                 */}
             </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
