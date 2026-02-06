import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, ShieldCheck, Wifi } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const StartGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [gameUrl, setGameUrl] = useState('');
  const [gameName, setGameName] = useState('');
  
  useEffect(() => {
    // Get URL from navigation state
    if (location.state?.url) {
      setGameUrl(location.state.url);
      // Try to get game name if passed, otherwise default
      setGameName(location.state?.gameName || location.state?.name || t('start_game.session'));
    } else {
      // If no URL provided, redirect back to home
      navigate('/');
    }
  }, [location, navigate, t]);

  if (!gameUrl) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--gold)]/20 blur-xl rounded-full animate-pulse"></div>
          <div className="relative w-16 h-16 border-4 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-[var(--gold)]" />
          </div>
        </div>
        <p className="text-[var(--text-muted)] text-sm font-medium animate-pulse">{t('start_game.initializing')}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 flex flex-col gap-5 animate-in fade-in duration-500 max-w-5xl mx-auto h-screen">
      
      {/* Header Info */}
      <div className="flex items-center justify-between px-1">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--gold)]/30 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          <span className="text-xs font-medium text-gray-300 group-hover:text-white">{t('start_game.back')}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">{t('start_game.live')}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">{t('start_game.secure')}</span>
          </div>
        </div>
      </div>

      {/* Main Game Card */}
      <div className="relative group flex-1 min-h-0">
        {/* Glow Effects */}
        <div className="absolute -inset-0.5 bg-gradient-to-b from-[var(--gold)]/30 to-transparent rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        
        <div className="relative w-full h-full bg-[#121418] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col">
          
          {/* Card Top Bar */}
          <div className="h-10 bg-[#1a1c20] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
             <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-[var(--gold)]" />
                <span className="text-xs font-bold text-gray-300 tracking-wide uppercase truncate max-w-[200px]">
                  {gameName}
                </span>
             </div>
             <div className="flex items-center gap-2">
                <Wifi className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-gray-500 font-mono">12ms</span>
             </div>
          </div>

          {/* Iframe Container */}
          <div className="flex-1 bg-black relative w-full h-full">
            <iframe
              src={gameUrl}
              title="Game Session"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </div>
      
      {/* Footer Hint */}
      <p className="text-center text-[10px] text-gray-600">
        {t('start_game.footer_hint')}
      </p>
    </div>
  );
};

export default StartGame;
