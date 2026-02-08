import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Gamepad2 } from 'lucide-react';
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
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col">
      <iframe
        src={gameUrl}
        title="Game Session"
        className="w-full h-full border-0 flex-1"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-50 p-2.5 rounded-full bg-black/60 text-white border border-white/10 backdrop-blur-md hover:bg-black/80 transition-all active:scale-95 shadow-lg"
      >
        <Home className="w-5 h-5 text-[var(--gold)]" />
      </button>
    </div>
  );
};

export default StartGame;
