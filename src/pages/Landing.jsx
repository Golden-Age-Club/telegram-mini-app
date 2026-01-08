import { useEffect, useState } from 'react';
import { Zap, Crown, Diamond, Star, Sparkles, Trophy, Shield } from 'lucide-react';

const Landing = ({ navigate }) => {
  const tg = window.Telegram?.WebApp;
  const [showFallbackButton, setShowFallbackButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in Telegram environment
    const isInTelegram = tg && tg.initData && tg.initData.length > 0;
    
    if (isInTelegram) {
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
      tg.expand?.();
      tg.ready?.();

      tg.MainButton?.setText('👑 Enter Golden Age Cash 👑');
      tg.MainButton?.show();
      tg.MainButton?.onClick(() => navigate('home'));
      setShowFallbackButton(false);
    } else {
      // Not in Telegram, show fallback button
      setShowFallbackButton(true);
    }

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);

    return () => {
      if (isInTelegram) {
        tg?.MainButton?.hide();
        tg?.MainButton?.offClick();
      }
    };
  }, [tg, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center glow-gold overflow-hidden">
            <img 
              src="/casinologo.jpg" 
              alt="Golden Age Cash"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="loading-dots mb-4">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p className="text-gray-400">Loading Golden Age Cash...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-primary relative overflow-hidden">
      {/* Background Elements - Subtle */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-emerald-500 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-amber-500 blur-3xl"></div>
      </div>

      {/* Logo Area */}
      <div className="text-center mb-12 relative z-10">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-card border-2 border-gold/30 flex items-center justify-center glow-gold overflow-hidden">
          <img 
            src="/casinologo.jpg" 
            alt="Golden Age Cash Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-gradient-gold mb-3">
          Golden Age Cash
        </h1>
        <p className="text-lg text-gray-300 mb-2">
          Premium Casino Experience
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
          <div className="live-dot"></div>
          <span>Live Casino • Instant Payouts</span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-md space-y-4 mb-12 relative z-10">
        {[
          { 
            icon: <Diamond className="w-6 h-6" />, 
            title: 'Premium Slots', 
            desc: 'Golden Age slot machines with massive jackpots', 
            gradient: 'from-emerald-600/20 to-emerald-500/20',
            border: 'border-emerald-500/30'
          },
          { 
            icon: <Crown className="w-6 h-6" />, 
            title: 'Emerald Roulette', 
            desc: 'European roulette with premium experience', 
            gradient: 'from-amber-600/20 to-amber-500/20',
            border: 'border-amber-500/30'
          },
          { 
            icon: <Star className="w-6 h-6" />, 
            title: 'Royal Games', 
            desc: 'Blackjack, poker and exclusive card games', 
            gradient: 'from-purple-600/20 to-purple-500/20',
            border: 'border-purple-500/30'
          },
        ].map((feature, i) => (
          <div key={i} className={`card ${feature.gradient} ${feature.border} hover:scale-105 transition-transform`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-gold flex items-center justify-center text-black">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="w-full max-w-md mb-12 relative z-10">
        <div className="grid-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient-emerald">1.2k+</div>
            <div className="text-xs text-gray-400">Active Players</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient-gold">$2.5M+</div>
            <div className="text-xs text-gray-400">Total Payouts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient-emerald">99.2%</div>
            <div className="text-xs text-gray-400">Payout Rate</div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      {showFallbackButton && (
        <button 
          onClick={() => navigate('home')}
          className="btn btn-primary btn-lg w-full max-w-md mb-8 relative z-10 glow-gold"
        >
          <Crown className="w-6 h-6" />
          Enter Golden Age Cash
          <Sparkles className="w-5 h-5" />
        </button>
      )}

      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-6 text-xs text-gray-500 mb-6 relative z-10">
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4" />
          <span>Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4" />
          <span>Licensed</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span>Trusted</span>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center max-w-sm relative z-10">
        🔞 18+ Only • 🎲 Play Responsibly • 🏆 Premium Gaming Experience
      </p>
    </div>
  );
};

export default Landing;
