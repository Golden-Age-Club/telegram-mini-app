import { useState } from 'react';
import { ChevronRight, Search, Filter, X } from 'lucide-react';
import Layout from '../components/Layout';
import { GameGrid } from '../components/GameCard';
import SpinWheel from '../components/SpinWheel';
import ScratchCard from '../components/ScratchCard';
import Confetti from '../components/Confetti';

const Home = ({ user, navigate }) => {
  const [showWheel, setShowWheel] = useState(false);
  const [showScratch, setShowScratch] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeCategory, setActiveCategory] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredGames = [
    { 
      id: 'golden-slots', 
      name: 'Golden Age Slots', 
      subtitle: 'Premium Vegas Experience', 
      icon: '🎰',
      isHot: true,
      stats: { players: '1.2k', lastWin: '15,000' }
    },
    { 
      id: 'emerald-roulette', 
      name: 'Emerald Roulette', 
      subtitle: 'European Casino Style', 
      icon: '🎯',
      isLive: true,
      stats: { players: '856', avgTime: '3m' }
    },
    { 
      id: 'royal-blackjack', 
      name: 'Royal Blackjack', 
      subtitle: 'Classic Card Game', 
      icon: '🃏',
      isNew: true,
      stats: { players: '432', lastWin: '8,500' }
    },
    { 
      id: 'diamond-poker', 
      name: 'Diamond Poker', 
      subtitle: 'High Stakes Poker', 
      icon: '💎',
      stats: { players: '234', lastWin: '25,000' }
    }
  ];

  const gameCategories = [
    { id: 'featured', name: 'Featured', icon: '⭐', count: featuredGames.length },
    { id: 'slots', name: 'Slots', icon: '🎰', count: 12 },
    { id: 'table', name: 'Table Games', icon: '🎯', count: 8 },
    { id: 'live', name: 'Live Casino', icon: '📹', count: 6 },
    { id: 'new', name: 'New Games', icon: '✨', count: 4 }
  ];

  const quickActions = [
    { 
      id: 'daily-bonus', 
      title: 'Daily Bonus', 
      subtitle: 'Spin the wheel', 
      icon: '🎁',
      action: () => setShowWheel(true),
      gradient: 'from-emerald-600 to-emerald-500'
    },
    { 
      id: 'scratch-card', 
      title: 'Scratch Card', 
      subtitle: 'Win instantly', 
      icon: '🎫',
      action: () => setShowScratch(true),
      gradient: 'from-purple-600 to-purple-500'
    },
    { 
      id: 'tournaments', 
      title: 'Tournaments', 
      subtitle: 'Compete now', 
      icon: '🏆',
      action: () => navigate('tournaments'),
      gradient: 'from-amber-600 to-amber-500'
    }
  ];

  const handleGameClick = (game) => {
    navigate('game', { selectedGame: game.id });
  };

  const handleWheelWin = (prize) => {
    setShowWheel(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const filteredGames = featuredGames.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Casino" user={user}>
      <div className="page p-4 space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gradient-gold">
                Welcome to Golden Age Cash
              </h1>
              <p className="text-gray-400 mt-1">
                Premium casino experience awaits
              </p>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/30">
              <img 
                src="/casinologo.jpg" 
                alt="Golden Age Cash"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {user?.balance !== undefined && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 rounded-lg border border-emerald-500/20">
              <div>
                <div className="text-sm text-gray-400">Your Balance</div>
                <div className="text-2xl font-bold text-gradient-emerald">
                  ${user.balance.toLocaleString()}
                </div>
              </div>
              <button className="btn btn-success btn-sm">
                <span>💰</span>
                Deposit
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          <div className="grid-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`card hover:scale-105 transition-transform bg-gradient-to-br ${action.gradient}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="font-semibold text-white">{action.title}</div>
                  <div className="text-xs text-white/80">{action.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <button className="btn btn-secondary">
              <Filter size={18} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Featured Games</h2>
            <button className="text-amber-400 text-sm hover:text-amber-300 transition-colors">
              View All <ChevronRight size={16} className="inline" />
            </button>
          </div>
          
          <GameGrid
            games={filteredGames}
            onGameClick={handleGameClick}
            variant="default"
          />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Big Wins</h3>
          <div className="space-y-3">
            {[
              { player: 'Player***123', game: 'Golden Age Slots', amount: 15000 },
              { player: 'Lucky***789', game: 'Emerald Roulette', amount: 8500 },
              { player: 'Winner***456', game: 'Diamond Poker', amount: 25000 }
            ].map((win, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="font-medium text-white">{win.player}</div>
                  <div className="text-sm text-gray-400">{win.game}</div>
                </div>
                <div className="text-emerald-400 font-bold">
                  +${win.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showWheel && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Daily Bonus Wheel</h3>
              <button onClick={() => setShowWheel(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <SpinWheel onWin={handleWheelWin} />
          </div>
        </div>
      )}

      {showScratch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Scratch Card</h3>
              <button onClick={() => setShowScratch(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <ScratchCard onWin={(prize) => {
              setShowScratch(false);
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3000);
            }} />
          </div>
        </div>
      )}

      {showConfetti && <Confetti />}
    </Layout>
  );
};

export default Home;