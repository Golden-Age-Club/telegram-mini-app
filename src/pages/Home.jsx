import { useState, useEffect } from 'react';
import { ChevronRight, Flame, Star, Sparkles, Gift, X } from 'lucide-react';
import SpinWheel from '../components/SpinWheel';
import ScratchCard from '../components/ScratchCard';
import Confetti from '../components/Confetti';

const Home = ({ user, navigate }) => {
  const tg = window.Telegram?.WebApp;
  const [showWheel, setShowWheel] = useState(false);
  const [showScratch, setShowScratch] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState('pg');

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#0f1923');
      tg.setBackgroundColor('#0f1923');
    }
  }, [tg]);

  const featuredGames = [
    { id: 'high-wins', name: '裸公车区', subtitle: 'High Wins (PG)', gradient: 'from-amber-600 to-red-700' },
    { id: 'steady-wins', name: '规定车区', subtitle: 'Steady Wins (EGT)', gradient: 'from-emerald-600 to-teal-700' },
  ];

  const providers = [
    { id: 'pg', name: 'PG Slots', icon: '🎰' },
    { id: 'egt', name: 'EGT Slots', icon: '🎲' },
  ];

  const todaysPicks = [
    { id: 1, gradient: 'from-red-600 to-orange-500' },
    { id: 2, gradient: 'from-amber-500 to-yellow-400' },
    { id: 3, gradient: 'from-purple-600 to-pink-500' },
    { id: 4, gradient: 'from-blue-600 to-cyan-500' },
    { id: 5, gradient: 'from-green-600 to-emerald-500' },
  ];

  const games = [
    { id: 'fortune-tiger', name: 'Fortune Tiger', provider: 'PG Soft', hot: true },
    { id: 'wild-bounty', name: 'Wild Bounty Showdown', provider: 'PG Soft', hot: true },
    { id: 'mahjong-ways', name: 'Mahjong Ways', provider: 'PG Soft', hot: false },
    { id: 'lucky-neko', name: 'Lucky Neko', provider: 'PG Soft', hot: false },
  ];

  const handleWheelComplete = () => {
    setShowConfetti(true);
    tg?.HapticFeedback?.notificationOccurred('success');
    setTimeout(() => setShowWheel(false), 2500);
  };

  const handleScratchComplete = () => {
    setShowConfetti(true);
    tg?.HapticFeedback?.notificationOccurred('success');
    setTimeout(() => setShowScratch(false), 2500);
  };

  return (
    <div className="page">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <div className="header-bar">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0088cc] flex items-center justify-center">
            <span className="text-white text-sm">✈</span>
          </div>
          <span className="font-semibold text-sm text-white">Telegram Mini App</span>
        </div>
        <div className="balance-chip">
          <div className="coin-icon">$</div>
          <span className="text-[var(--gold)]">{user?.balance?.toLocaleString() || '2,368.50'}</span>
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Featured Games - Big Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {featuredGames.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                tg?.HapticFeedback?.impactOccurred('medium');
                navigate('game', { game: game.name });
              }}
              className={`game-card bg-gradient-to-br ${game.gradient}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl animate-float">💰</div>
              </div>
              <div className="game-card-overlay">
                <div className="flex items-center gap-1 mb-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-bold text-lg">{game.name}</span>
                </div>
                <span className="text-xs text-gray-300">{game.subtitle}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Provider Tabs */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setActiveTab(provider.id)}
              className={`card p-3 flex items-center gap-3 ${
                activeTab === provider.id ? 'border-[var(--gold)]' : ''
              }`}
            >
              <span className="text-2xl">{provider.icon}</span>
              <div className="text-left">
                <p className="font-bold text-white text-sm">{provider.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{provider.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Picks */}
      <div className="section-title">
        <span>Today's Picks</span>
      </div>
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {todaysPicks.map((pick) => (
            <button
              key={pick.id}
              onClick={() => {
                tg?.HapticFeedback?.impactOccurred('light');
                navigate('game');
              }}
              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pick.gradient} flex-shrink-0 flex items-center justify-center`}
            >
              <span className="text-2xl">🎰</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Bonus */}
      <div className="px-4 pb-4">
        <div className="flex gap-3">
          <button 
            onClick={() => setShowWheel(true)}
            className="card flex-1 p-4 flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-white text-sm">Spin Wheel</p>
              <p className="text-xs text-[var(--gold)]">Win up to $1,000</p>
            </div>
          </button>
          <button 
            onClick={() => setShowScratch(true)}
            className="card flex-1 p-4 flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-white text-sm">Scratch Card</p>
              <p className="text-xs text-[var(--gold)]">Instant prizes</p>
            </div>
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="tab-container pb-3">
        <span className="filter-pill hot"><Flame className="w-3 h-3" /> High Wins</span>
        <span className="filter-pill"><span className="text-blue-400">●</span> New Games</span>
        <span className="filter-pill"><span className="text-green-400">$</span> Buy Free</span>
        <span className="filter-pill"><Star className="w-3 h-3 text-yellow-400" /> Favorites</span>
      </div>

      {/* Game List */}
      <div className="mx-4 mb-4 rounded-2xl overflow-hidden">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => {
              tg?.HapticFeedback?.impactOccurred('medium');
              navigate('game', { game: game.name });
            }}
            className="game-list-item w-full"
          >
            <div className="game-thumb">
              <span className="text-2xl">🎰</span>
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white">{game.name}</h3>
                {game.hot && <Flame className="w-4 h-4 text-orange-400" />}
              </div>
              <p className="text-xs text-[var(--text-muted)]">{game.provider}</p>
            </div>
            <button className="btn-play">Play Now</button>
          </button>
        ))}
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
            <h2 className="text-xl font-bold text-center mb-2 text-white">🎡 Lucky Spin</h2>
            <p className="text-sm text-[var(--text-muted)] text-center mb-4">Spin to win prizes!</p>
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
            <h2 className="text-xl font-bold text-center mb-2 text-white">🎫 Scratch & Win</h2>
            <p className="text-sm text-[var(--text-muted)] text-center mb-4">Reveal your prize!</p>
            <ScratchCard onComplete={handleScratchComplete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
