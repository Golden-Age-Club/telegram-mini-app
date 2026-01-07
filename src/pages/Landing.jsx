import { useEffect } from 'react';
import { Sparkles, Zap } from 'lucide-react';

const Landing = ({ navigate }) => {
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#0f1923');
      tg.setBackgroundColor('#0f1923');
      tg.expand?.();
      tg.ready?.();

      tg.MainButton?.setText('🎰 Start Playing');
      tg.MainButton?.show();
      tg.MainButton?.onClick(() => navigate('home'));
    }

    return () => {
      tg?.MainButton?.hide();
      tg?.MainButton?.offClick();
    };
  }, [tg, navigate]);

  return (
    <div className="page items-center justify-center px-6">
      {/* Logo Area */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30 animate-float">
          <span className="text-5xl">🎰</span>
        </div>
        
        <h1 className="text-3xl font-black text-white mb-2">
          MEGA CASINO
        </h1>
        <p className="text-[var(--text-muted)]">
          Play & Win Big Prizes
        </p>
      </div>

      {/* Features */}
      <div className="w-full max-w-xs space-y-3 mb-8">
        {[
          { icon: '💰', title: 'Huge Jackpots', desc: 'Win up to $100,000' },
          { icon: '🎁', title: 'Daily Bonuses', desc: 'Free spins every day' },
          { icon: '⚡', title: 'Instant Payouts', desc: 'Withdraw anytime' },
        ].map((feature, i) => (
          <div key={i} className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
              <span className="text-2xl">{feature.icon}</span>
            </div>
            <div>
              <p className="font-bold text-white">{feature.title}</p>
              <p className="text-sm text-[var(--text-muted)]">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button (fallback for non-Telegram) */}
      {!tg?.MainButton && (
        <button 
          onClick={() => navigate('home')}
          className="btn-primary w-full max-w-xs py-4"
        >
          <Zap className="w-5 h-5" />
          Start Playing
        </button>
      )}

      {/* Footer */}
      <p className="text-xs text-[var(--text-muted)] mt-8 text-center">
        18+ | Play Responsibly
      </p>
    </div>
  );
};

export default Landing;
