import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import BannerSlider from '../components/Landing/BannerSlider';
import QuickActions from '../components/Landing/QuickActions';
import JackpotTicker from '../components/Landing/JackpotTicker';
import GameCategories from '../components/Landing/GameCategories';
import LiveTransactions from '../components/Landing/LiveTransactions';
import RecommendedGames from '../components/Landing/RecommendedGames';
import ProvidersCarousel from '../components/Landing/ProvidersCarousel';

const Landing = () => {
  const { t } = useLanguage();
  const tg = window.Telegram?.WebApp;
  const [showFallbackButton, setShowFallbackButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're in Telegram environment
    const isInTelegram = tg && tg.initData && tg.initData.length > 0;
    
    if (isInTelegram) {
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
      tg.expand?.();
      tg.ready?.();

      tg.MainButton?.setText(t('landing.telegram_enter'));
      tg.MainButton?.show();
      tg.MainButton?.onClick(() => navigate('/home'));
      setShowFallbackButton(false);
    } else {
      // Not in Telegram, show fallback button
      setShowFallbackButton(true);
    }


    return () => {
      if (isInTelegram) {
        tg?.MainButton?.hide();
        tg?.MainButton?.offClick();
      }
    };
  }, [tg, navigate, t]);


  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1a1c20] relative overflow-x-hidden pb-24 pt-6">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-900/30 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-[var(--gold)]/15 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <BannerSlider />
      <QuickActions />
      <JackpotTicker />
      <GameCategories />
      <LiveTransactions />
      <RecommendedGames />
      <ProvidersCarousel />

    </div>
  );
};

export default Landing;
