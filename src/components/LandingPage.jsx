import { useState, useEffect } from 'react';
import { Sparkles, Shield, Zap, ChevronRight, Play, Star } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: Zap, title: 'Instant Play', desc: 'No downloads required' },
    { icon: Star, title: 'VIP Rewards', desc: 'Exclusive bonuses' },
    { icon: Shield, title: 'Secure', desc: 'Bank-level encryption' }
  ];

  const featuredGames = [
    { name: 'Fortune Tiger', provider: 'PG Soft', color: 'from-orange-500 to-red-600' },
    { name: 'Sweet Bonanza', provider: 'Pragmatic', color: 'from-pink-500 to-purple-600' },
    { name: 'Mahjong Ways', provider: 'PG Soft', color: 'from-emerald-500 to-teal-600' },
    { name: 'Gates of Olympus', provider: 'Pragmatic', color: 'from-blue-500 to-indigo-600' }
  ];

  return (
    <div className="min-h-screen bg-[--bg-base] text-white overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">Royale</span>
        </div>
        
        <button 
          onClick={() => onNavigate('login')}
          className="px-4 py-2 text-sm font-medium text-[--text-secondary] hover:text-white transition-colors"
        >
          Sign In
        </button>
      </header>

      {/* Hero */}
      <main className={`relative z-10 px-6 pt-8 pb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Premium Gaming</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-center text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          <span className="block text-white">Play. Win.</span>
          <span className="block text-gradient">Repeat.</span>
        </h1>

        <p className="text-center text-[--text-secondary] max-w-sm mx-auto mb-8">
          Experience premium slots and casino games directly in Telegram. Instant deposits, fast withdrawals.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 max-w-sm mx-auto mb-16">
          <button 
            onClick={() => onNavigate('login')}
            className="btn btn-primary py-4 text-base"
          >
            <Play className="w-5 h-5" />
            Start Playing
          </button>
          
          <button 
            onClick={() => onNavigate('games')}
            className="btn btn-secondary py-4"
          >
            Browse Games
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-16">
          {features.map((feat, i) => (
            <div 
              key={i}
              className="card p-4 text-center"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-[--bg-elevated] flex items-center justify-center mx-auto mb-3">
                <feat.icon className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{feat.title}</h3>
              <p className="text-xs text-[--text-muted]">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Featured Games */}
        <div className="mb-12">
          <h2 className="text-center text-xs font-semibold text-[--text-muted] uppercase tracking-widest mb-6">
            Featured Games
          </h2>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
            {featuredGames.map((game, i) => (
              <button
                key={i}
                onClick={() => onNavigate('games')}
                className="flex-shrink-0 w-36 group"
              >
                <div className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${game.color} p-4 flex flex-col justify-end mb-3 transition-transform group-hover:scale-[1.02] group-active:scale-[0.98]`}>
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-2">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold truncate">{game.name}</h3>
                <p className="text-xs text-[--text-muted]">{game.provider}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <p className="text-xs text-[--text-muted] mb-4">Trusted by 50,000+ players worldwide</p>
          <div className="flex justify-center gap-6 opacity-50">
            <span className="text-xs font-bold">PG SOFT</span>
            <span className="text-xs font-bold">PRAGMATIC</span>
            <span className="text-xs font-bold">EGT</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
