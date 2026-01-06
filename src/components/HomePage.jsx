import { useState } from 'react';
import { Home, Gamepad2, Wallet, User, Plus, TrendingUp, Flame, Crown, Sparkles, Gift, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SpinWheel from './SpinWheel';
import ScratchCard from './ScratchCard';
import Confetti from './Confetti';

const HomePage = ({ user, onNavigate }) => {
  const { t } = useLanguage();
  const [showWheel, setShowWheel] = useState(false);
  const [showScratch, setShowScratch] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [balance, setBalance] = useState(user?.balance || 2368.50);

  const quickActions = [
    { icon: TrendingUp, label: 'Hot Games', color: 'text-red-500', bg: 'bg-red-500/10', action: () => onNavigate('games') },
    { icon: Crown, label: 'VIP', color: 'text-amber-500', bg: 'bg-amber-500/10', action: () => {} },
    { icon: Sparkles, label: 'New', color: 'text-cyan-500', bg: 'bg-cyan-500/10', action: () => onNavigate('games') },
  ];

  const bonusGames = [
    { icon: '🎡', label: 'Spin Wheel', desc: 'Daily bonus', action: () => setShowWheel(true) },
    { icon: '🎫', label: 'Scratch Card', desc: 'Instant win', action: () => setShowScratch(true) },
  ];

  const featuredGames = [
    { name: 'Fortune Tiger', provider: 'PG Soft', players: '2.1k', hot: true, gradient: 'from-orange-500 to-red-600' },
    { name: 'Sweet Bonanza', provider: 'Pragmatic', players: '1.8k', hot: true, gradient: 'from-pink-500 to-rose-600' },
  ];

  const popularGames = [
    { name: 'Lucky Neko', provider: 'PG Soft', gradient: 'from-pink-400 to-purple-500' },
    { name: 'Shining Crown', provider: 'EGT', gradient: 'from-amber-400 to-orange-500' },
    { name: '40 Super Hot', provider: 'EGT', gradient: 'from-red-500 to-orange-600' },
    { name: 'Mahjong Ways', provider: 'PG Soft', gradient: 'from-emerald-400 to-teal-500' },
  ];

  const handleWheelComplete = (result) => {
    setBalance(prev => prev + result.value);
    setShowConfetti(true);
    setTimeout(() => setShowWheel(false), 2000);
  };

  const handleScratchComplete = (prize) => {
    setBalance(prev => prev + prize.value);
    setShowConfetti(true);
    setTimeout(() => setShowScratch(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[--bg-base] text-white pb-24">
      {/* Confetti Effect */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-[--border] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-xs text-[--text-muted] font-medium">Welcome back</p>
              <p className="font-semibold">{user?.name?.split(' ')[0] || 'Player'}</p>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('wallet')}
            className="flex items-center gap-2 bg-[--bg-card] border border-[--border] rounded-full pl-4 pr-2 py-2"
          >
            <span className="text-sm font-semibold text-gradient">
              ${balance.toLocaleString()}
            </span>
            <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center">
              <Plus className="w-4 h-4 text-black" />
            </div>
          </button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8">
        {/* Balance Card */}
        <section className="card p-5 bg-gradient-to-br from-amber-500/20 via-[--bg-card] to-[--bg-card] border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[--text-secondary] mb-1">Total Balance</p>
              <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => onNavigate('wallet')}
              className="btn btn-primary flex-1 py-3"
            >
              Deposit
            </button>
            <button 
              onClick={() => onNavigate('wallet')}
              className="btn btn-secondary flex-1 py-3"
            >
              Withdraw
            </button>
          </div>
        </section>

        {/* Bonus Games */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold">Daily Bonuses</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {bonusGames.map((game, i) => (
              <button 
                key={i}
                onClick={game.action}
                className="card p-4 text-left hover:border-amber-500/50 transition-all active:scale-[0.98]"
              >
                <span className="text-3xl mb-2 block">{game.icon}</span>
                <h3 className="font-semibold">{game.label}</h3>
                <p className="text-xs text-[--text-muted]">{game.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex gap-3">
          {quickActions.map((action, i) => (
            <button 
              key={i}
              onClick={action.action}
              className="flex-1 card p-4 flex flex-col items-center gap-2 hover:border-[--border-hover] transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className="text-xs font-medium text-[--text-secondary]">{action.label}</span>
            </button>
          ))}
        </section>

        {/* Featured Games */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{t('todaysPicks')}</h2>
            <button 
              onClick={() => onNavigate('games')}
              className="text-sm text-amber-500 font-medium"
            >
              See All
            </button>
          </div>
          
          <div className="space-y-3">
            {featuredGames.map((game, i) => (
              <button
                key={i}
                onClick={() => onNavigate('gameView', { game: game.name })}
                className={`w-full p-4 rounded-2xl bg-gradient-to-r ${game.gradient} flex items-center justify-between group transition-transform active:scale-[0.98]`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Gamepad2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{game.name}</h3>
                      {game.hot && (
                        <span className="badge badge-hot">
                          <Flame className="w-3 h-3 mr-1" />
                          HOT
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70">{game.provider} • {game.players} playing</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <span className="text-white">▶</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Games Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Popular Games</h2>
            <button 
              onClick={() => onNavigate('games')}
              className="text-sm text-amber-500 font-medium"
            >
              See All
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {popularGames.map((game, i) => (
              <button
                key={i}
                onClick={() => onNavigate('gameView', { game: game.name })}
                className="card p-4 text-left hover:border-[--border-hover] transition-all active:scale-[0.98]"
              >
                <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center mb-3`}>
                  <Gamepad2 className="w-10 h-10 text-white/80" />
                </div>
                <h3 className="font-medium text-sm truncate">{game.name}</h3>
                <p className="text-xs text-[--text-muted]">{game.provider}</p>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Spin Wheel Modal */}
      {showWheel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative bg-[--bg-card] rounded-3xl p-6 border border-[--border] max-w-sm w-full animate-scale-in">
            <button 
              onClick={() => setShowWheel(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[--bg-elevated] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h2 className="text-xl font-bold text-center mb-6">🎡 Daily Spin</h2>
            <SpinWheel onComplete={handleWheelComplete} />
          </div>
        </div>
      )}

      {/* Scratch Card Modal */}
      {showScratch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative bg-[--bg-card] rounded-3xl p-6 border border-[--border] max-w-sm w-full animate-scale-in">
            <button 
              onClick={() => setShowScratch(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[--bg-elevated] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h2 className="text-xl font-bold text-center mb-6">🎫 Scratch & Win</h2>
            <ScratchCard onComplete={handleScratchComplete} />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav currentPage="home" onNavigate={onNavigate} />
    </div>
  );
};

const BottomNav = ({ currentPage, onNavigate }) => {
  const { t } = useLanguage();
  
  const navItems = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'games', icon: Gamepad2, label: t('games') },
    { id: 'wallet', icon: Wallet, label: t('wallet') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
      <div className="glass border border-[--border] rounded-2xl p-2 flex justify-around items-center shadow-lg">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'bg-amber-500 text-black' 
                  : 'text-[--text-muted] hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default HomePage;
