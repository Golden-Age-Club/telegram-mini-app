import { useState, useEffect } from 'react';
import { Wallet, Gamepad2, User, Gift, ChevronRight, Flame, X, Crown, Zap, TrendingUp } from 'lucide-react';
import SpinWheel from '../components/SpinWheel';
import ScratchCard from '../components/ScratchCard';
import Confetti from '../components/Confetti';

const Home = ({ user, navigate }) => {
  const tg = window.Telegram?.WebApp;
  const [showWheel, setShowWheel] = useState(false);
  const [showScratch, setShowScratch] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#0a0a0f');
      tg.setBackgroundColor('#0a0a0f');
    }
  }, [tg]);

  const games = [
    { id: 'fortune-tiger', name: 'Fortune Tiger', provider: 'PG Soft', hot: true, rtp: '96.8%' },
    { id: 'sweet-bonanza', name: 'Sweet Bonanza', provider: 'Pragmatic', hot: true, rtp: '96.5%' },
    { id: 'mahjong-ways', name: 'Mahjong Ways', provider: 'PG Soft', hot: false, rtp: '96.9%' },
    { id: 'gates-olympus', name: 'Gates of Olympus', provider: 'Pragmatic', hot: false, rtp: '96.5%' },
  ];

  const handleWheelComplete = (result) => {
    setShowConfetti(true);
    tg?.HapticFeedback?.notificationOccurred('success');
    setTimeout(() => setShowWheel(false), 2500);
  };

  const handleScratchComplete = (prize) => {
    setShowConfetti(true);
    tg?.HapticFeedback?.notificationOccurred('success');
    setTimeout(() => setShowScratch(false), 2500);
  };

  return (
    <div className="page">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* VIP Balance Card */}
      <div className="px-4 pt-4 pb-6">
        <div className="card card-gold p-5 relative overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[var(--gold)]" />
                <span className="text-sm font-semibold text-[var(--gold)]">VIP MEMBER</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>+12.5%</span>
              </div>
            </div>
            
            <p className="text-sm text-[var(--text-muted)] mb-1">Total Balance</p>
            <p className="text-4xl font-black text-gold mb-6">
              ${user?.balance?.toLocaleString() || '2,368.50'}
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('wallet')}
                className="btn-primary flex-1 py-3"
              >
                <Zap className="w-4 h-4" />
                DEPOSIT
              </button>
              <button 
                onClick={() => navigate('wallet')}
                className="btn-secondary flex-1 py-3"
              >
                WITHDRAW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Wallet, label: 'Wallet', action: () => navigate('wallet'), color: 'from-emerald-500/20 to-emerald-600/20' },
            { icon: Gift, label: 'Bonus', action: () => setShowWheel(true), color: 'from-purple-500/20 to-purple-600/20' },
            { icon: User, label: 'Profile', action: () => navigate('profile'), color: 'from-blue-500/20 to-blue-600/20' },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={item.action}
              className="card p-4 flex flex-col items-center gap-2"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center border border-white/5`}>
                <item.icon className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <span className="text-xs font-semibold text-white">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Bonus */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[var(--gold)] uppercase tracking-wider flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Daily Bonus
          </h2>
          <span className="text-xs text-emerald-400 font-semibold">FREE!</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowWheel(true)}
            className="card card-gold flex-1 p-4 text-center"
          >
            <span className="text-3xl mb-2 block">🎡</span>
            <p className="font-bold text-sm text-white">Spin Wheel</p>
            <p className="text-xs text-[var(--gold)]">Win up to $1,000</p>
          </button>
          <button 
            onClick={() => setShowScratch(true)}
            className="card card-gold flex-1 p-4 text-center"
          >
            <span className="text-3xl mb-2 block">🎫</span>
            <p className="font-bold text-sm text-white">Scratch Card</p>
            <p className="text-xs text-[var(--gold)]">Instant prizes</p>
          </button>
        </div>
      </div>

      {/* Hot Games */}
      <div className="px-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[var(--gold)] uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Hot Games
          </h2>
          <span className="text-xs text-[var(--text-muted)]">See all →</span>
        </div>
        <div className="space-y-3">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                tg?.HapticFeedback?.impactOccurred('medium');
                navigate('game', { game: game.name });
              }}
              className="card w-full p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{game.name}</h3>
                  {game.hot && <span className="badge-hot flex items-center gap-1"><Flame className="w-3 h-3" />HOT</span>}
                </div>
                <p className="text-sm text-[var(--text-muted)]">{game.provider}</p>
                <p className="text-xs text-emerald-400">RTP: {game.rtp}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 border border-[var(--border-gold)] flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-[var(--gold)]" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Spin Wheel Modal */}
      {showWheel && (
        <div className="modal-overlay" onClick={() => setShowWheel(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowWheel(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <h2 className="text-xl font-black text-center mb-2 text-gold">🎡 LUCKY SPIN</h2>
            <p className="text-sm text-[var(--text-muted)] text-center mb-6">Spin to win up to $1,000!</p>
            <SpinWheel onComplete={handleWheelComplete} />
          </div>
        </div>
      )}

      {/* Scratch Card Modal */}
      {showScratch && (
        <div className="modal-overlay" onClick={() => setShowScratch(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowScratch(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <h2 className="text-xl font-black text-center mb-2 text-gold">🎫 SCRATCH & WIN</h2>
            <p className="text-sm text-[var(--text-muted)] text-center mb-6">Reveal your instant prize!</p>
            <ScratchCard onComplete={handleScratchComplete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
