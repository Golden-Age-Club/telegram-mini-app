import { useEffect } from 'react';
import { Play, Shield, Zap, Star, Crown, Sparkles } from 'lucide-react';

const Landing = ({ navigate }) => {
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#0a0a0f');
      tg.setBackgroundColor('#0a0a0f');
    }
  }, [tg]);

  useEffect(() => {
    if (tg?.MainButton) {
      tg.MainButton.setText('🎰 START PLAYING');
      tg.MainButton.color = '#ffd700';
      tg.MainButton.textColor = '#000000';
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.HapticFeedback?.impactOccurred('heavy');
        navigate('home');
      });
    }
    return () => {
      tg?.MainButton?.hide();
      tg?.MainButton?.offClick();
    };
  }, [tg, navigate]);

  const features = [
    { icon: Zap, title: 'Instant Wins', desc: 'Real-time payouts' },
    { icon: Crown, title: 'VIP Rewards', desc: 'Exclusive bonuses' },
    { icon: Shield, title: '100% Secure', desc: 'Bank-level encryption' },
  ];

  return (
    <div className="page">
      {/* Hero Section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4 text-center">
        {/* Logo */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-2xl animate-pulse-gold">
            <Crown className="w-12 h-12 text-black" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
            VIP
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-4xl font-black mb-2">
          <span className="text-gold">ROYALE</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] mb-2">Premium Casino</p>
        
        {/* Tagline */}
        <div className="flex items-center gap-2 text-[var(--gold)] text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Play • Win • Withdraw</span>
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-gold">$2.5M+</p>
            <p className="text-xs text-[var(--text-muted)]">Won Today</p>
          </div>
          <div className="w-px bg-[var(--border)]" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gold">50K+</p>
            <p className="text-xs text-[var(--text-muted)]">Players</p>
          </div>
          <div className="w-px bg-[var(--border)]" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gold">99.9%</p>
            <p className="text-xs text-[var(--text-muted)]">Uptime</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 space-y-3 mb-8">
        {features.map((feat, i) => (
          <div 
            key={i}
            className="card card-gold flex items-center gap-4 p-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 flex items-center justify-center border border-[var(--border-gold)]">
              <feat.icon className="w-7 h-7 text-[var(--gold)]" />
            </div>
            <div>
              <h3 className="font-bold text-white">{feat.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{feat.desc}</p>
            </div>
            <Star className="w-5 h-5 text-[var(--gold)] ml-auto opacity-50" />
          </div>
        ))}
      </div>

      {/* Jackpot Banner */}
      <div className="px-4 mb-8">
        <div className="card p-4 text-center bg-gradient-to-r from-purple-900/50 via-[var(--bg-secondary)] to-red-900/50 border-purple-500/30">
          <p className="text-xs text-purple-400 font-semibold mb-1">🎰 MEGA JACKPOT</p>
          <p className="text-3xl font-black text-gold animate-pulse">$127,849.50</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Growing every second...</p>
        </div>
      </div>

      {/* CTA for non-Telegram */}
      {!tg?.MainButton && (
        <div className="px-4 pb-8">
          <button 
            onClick={() => navigate('home')}
            className="btn-primary w-full py-4 text-base"
          >
            <Play className="w-5 h-5" />
            START PLAYING
          </button>
        </div>
      )}

      {/* Trust badges */}
      <div className="px-4 pb-8 text-center">
        <p className="text-xs text-[var(--text-muted)] mb-3">Trusted Partners</p>
        <div className="flex justify-center gap-4 opacity-40">
          <span className="text-xs font-bold">PG SOFT</span>
          <span className="text-xs font-bold">PRAGMATIC</span>
          <span className="text-xs font-bold">EGT</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
