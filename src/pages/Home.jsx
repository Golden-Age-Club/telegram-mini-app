import { useState } from 'react';
import { X } from 'lucide-react';
import Layout from '../components/Layout';
import SpinWheel from '../components/SpinWheel';
import ScratchCard from '../components/ScratchCard';
import Confetti from '../components/Confetti';
import Carousel from '../components/Carousel';

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
      image: '/games/golden age slots.png',
      isHot: true,
      gradient: 'from-amber-600 to-orange-700'
    },
    { 
      id: 'emerald-roulette', 
      name: 'Emerald Roulette', 
      subtitle: 'European Casino Style', 
      icon: '🎯',
      image: '/games/emerald roulette.png',
      isLive: true,
      gradient: 'from-emerald-600 to-emerald-700'
    },
    { 
      id: 'royal-blackjack', 
      name: 'Royal Blackjack', 
      subtitle: 'Classic Card Game', 
      icon: '🃏',
      image: '/games/royal blackjack.png',
      isNew: true,
      gradient: 'from-purple-600 to-purple-700'
    },
    { 
      id: 'diamond-poker', 
      name: 'Diamond Poker', 
      subtitle: 'High Stakes Poker', 
      icon: '💎',
      image: '/games/diamond poker.png',
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

  const handleWheelWin = () => {
    setShowWheel(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const filteredGames = featuredGames.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSlideClick = (slideIndex) => {
    const tg = window.Telegram?.WebApp;
    tg?.HapticFeedback?.impactOccurred('medium');
    
    // Handle different slide actions
    switch (slideIndex) {
      case 0: // VIP Program
        // Navigate to VIP section or show VIP modal
        console.log('VIP Program clicked');
        break;
      case 1: // Daily Bet
        navigate('game', { gameType: 'daily-special' });
        break;
      case 2: // Daily Cashback
        navigate('wallet');
        break;
      case 3: // First Deposit Bonus
        navigate('wallet');
        break;
      case 4: // Weekend Special
        // Show weekend special offers
        console.log('Weekend Special clicked');
        break;
      default:
        break;
    }
  };

  return (
    <Layout title="Casino" user={user} navigate={navigate} currentScreen="home">
      <div className="page p-4 space-y-6">
        <Carousel onSlideClick={handleSlideClick} />
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

        {/* Quick Actions - Mobile Optimized */}
        <div className="px-4 pb-4">
          <h2 className="text-lg font-semibold text-white tracking-tight mb-3">Quick Actions</h2>
          <div className="grid-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`card hover:scale-105 transition-all duration-300 bg-gradient-to-br ${action.gradient} border border-white/20 relative overflow-hidden group p-3`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10 group-hover:from-white/5 group-hover:via-white/5 transition-all duration-300"></div>
                <div className="text-center relative z-10">
                  <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                  <div className="font-bold text-white text-xs mb-1">{action.title}</div>
                  <div className="text-xs text-white/90 font-medium">{action.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Game Categories - Mobile Scroll */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`casino-tab flex items-center gap-2 whitespace-nowrap ${
                  activeCategory === category.id ? 'active' : ''
                }`}
              >
                <span className="text-base">{category.icon}</span>
                <span className="font-semibold text-sm">{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeCategory === category.id 
                    ? 'bg-white/30 text-white' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Games List - Simple Clickable Images */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-4 gap-3">
            {featuredGames.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameClick(game)}
                className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-2xl">
                  {game.icon}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Big Wins - Mobile Card */}
        <div className="px-4 pb-6">
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-white mb-4 tracking-tight flex items-center gap-2">
              <span className="text-xl">🏆</span>
              Recent Big Wins
            </h3>
            <div className="space-y-3">
              {[
                { player: 'Player***123', game: 'Golden Age Slots', amount: 15000 },
                { player: 'Lucky***789', game: 'Emerald Roulette', amount: 8500 },
                { player: 'Winner***456', game: 'Diamond Poker', amount: 25000 }
              ].map((win, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-white/5 via-white/3 to-white/5 rounded-xl border border-white/10 hover:border-gold/30 transition-all duration-300 group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-black font-bold text-xs group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white text-sm truncate">{win.player}</div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate">{win.game}</div>
                    </div>
                  </div>
                  <div className="text-emerald-400 font-bold text-base tracking-tight flex-shrink-0">
                    +${win.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modals */}
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
              <ScratchCard onWin={() => {
                setShowScratch(false);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
              }} />
            </div>
          </div>
        )}

        {showConfetti && <Confetti />}
      </div>
    </Layout>
  );
};

export default Home;