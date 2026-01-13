import { useState, useEffect } from 'react';
import { ChevronRight, Trophy, TrendingUp, Users } from 'lucide-react';
import Layout from '../components/Layout';
import GameCard from '../components/GameCard';
import SlotMachine from '../components/SlotMachine';
import Roulette from '../components/Roulette';
import CardFlip from '../components/CardFlip';
import Confetti from '../components/Confetti';

const Game = ({ user, updateBalance, navigate, gameData }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastWin, setLastWin] = useState(null);
  const [activeGame, setActiveGame] = useState(gameData?.game || 'slots');
  const [gameStats, setGameStats] = useState({
    totalWins: 0,
    biggestWin: 0,
    gamesPlayed: 0,
    winStreak: 0
  });

  const gameOptions = [
    { 
      id: 'slots', 
      name: 'Golden Age Slots', 
      icon: '🎰', 
      subtitle: 'Premium Vegas Experience',
      image: '/games/golden age slots.png',
      isHot: true,
      component: SlotMachine
    },
    { 
      id: 'roulette', 
      name: 'Emerald Roulette', 
      icon: '🎯', 
      subtitle: 'European Casino Style',
      image: '/games/emerald roulette.png',
      isLive: true,
      component: Roulette
    },
    { 
      id: 'cards', 
      name: 'Royal Blackjack', 
      icon: '🃏', 
      subtitle: 'Classic Card Game',
      image: '/games/royal blackjack.png',
      isNew: true,
      component: CardFlip
    },
    { 
      id: 'poker', 
      name: 'Diamond Poker', 
      icon: '💎', 
      subtitle: 'High Stakes Poker',
      image: '/games/diamond poker.png',
      component: CardFlip // Using CardFlip as placeholder for poker
    },
  ];

  const currentGameData = gameOptions.find(g => g.id === activeGame);
  const GameComponent = currentGameData?.component;

  const handleWin = (amount) => {
    setLastWin(amount);
    setShowConfetti(true);
    updateBalance(amount);
    
    setGameStats(prev => ({
      ...prev,
      totalWins: prev.totalWins + amount,
      biggestWin: Math.max(prev.biggestWin, amount),
      gamesPlayed: prev.gamesPlayed + 1,
      winStreak: prev.winStreak + 1
    }));

    // Telegram haptic feedback
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
  };

  const handleLose = (amount) => {
    updateBalance(-amount);
    setGameStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      winStreak: 0
    }));
    
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
  };

  const handleGameSwitch = (gameId) => {
    setActiveGame(gameId);
    setLastWin(null);
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
  };

  return (
    <Layout 
      title={currentGameData?.name} 
      user={user} 
      navigate={navigate}
      currentScreen="game"
      showBack={true} 
      onBack={() => navigate('home')}
      navigate={navigate}
      currentScreen="game"
    >
      <div className="page space-y-6">
        {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}

        {/* Mega Win Display - Premium Casino Style */}
        {lastWin && lastWin >= 100 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="card text-center max-w-sm mx-4 glow-gold border-2 border-gold/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-emerald/10 animate-pulse"></div>
              <div className="relative z-10">
                <div className="text-7xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-3xl font-bold text-gradient-gold mb-3 tracking-tight">MEGA WIN!</h2>
                <div className="text-5xl font-bold text-gradient-emerald mb-6 tracking-tight">
                  ${lastWin.toLocaleString()}
                </div>
                <div className="casino-divider my-4"></div>
                <button 
                  onClick={() => setLastWin(null)}
                  className="btn btn-primary btn-lg font-bold w-full"
                >
                  Continue Playing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Selection Tabs - Premium Casino Style */}
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {gameOptions.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameSwitch(game.id)}
                className={`casino-tab flex items-center gap-3 whitespace-nowrap ${
                  activeGame === game.id ? 'active' : ''
                }`}
              >
                <span className="text-2xl">{game.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-sm tracking-tight">{game.name}</div>
                  <div className="text-xs opacity-80 mt-0.5">{game.subtitle}</div>
                </div>
                {game.isHot && <span className="status-badge-hot text-xs">HOT</span>}
                {game.isLive && <span className="live-indicator text-xs">LIVE</span>}
                {game.isNew && <span className="status-badge-new text-xs">NEW</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Game Stats - Premium Casino Style */}
        <div className="px-4">
          <div className="grid-2 gap-4">
            <div className="card text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">💰</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium">Total Wins</div>
                <div className="text-xl font-bold text-gradient-emerald tracking-tight">
                  ${gameStats.totalWins.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="card text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">🔥</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium">Win Streak</div>
                <div className="text-xl font-bold text-gradient-gold tracking-tight">
                  {gameStats.winStreak}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Area - Premium Casino Style */}
        <div className="px-4">
          <div className="card p-4 sm:p-6 bg-gradient-to-br from-black via-gray-900 to-black border-2 border-amber-500/30 relative overflow-hidden w-full max-w-full box-border">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-emerald/5 opacity-50"></div>
            <div className="casino-ornament mb-4"></div>
            <div className="relative z-10 mb-6 text-center">
              <h2 className="text-2xl font-bold text-gradient-gold mb-2 tracking-tight">
                {currentGameData?.name}
              </h2>
              <p className="text-gray-400 text-sm font-medium">{currentGameData?.subtitle}</p>
            </div>
            
            {GameComponent && (
              <div className="relative z-10">
                <GameComponent 
                  onWin={handleWin} 
                  onLose={handleLose}
                  user={user}
                />
              </div>
            )}
          </div>
        </div>

        {/* Game Statistics */}
        <div className="px-4">
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-400" />
              Your Statistics
            </h3>
            <div className="grid-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-amber-400" />
                  <span className="text-sm text-gray-400">Biggest Win</span>
                </div>
                <span className="font-bold text-amber-400">
                  ${gameStats.biggestWin.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-400">Games Played</span>
                </div>
                <span className="font-bold text-blue-400">
                  {gameStats.gamesPlayed}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Other Games */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Other Games</h3>
            <button 
              onClick={() => navigate('home')}
              className="text-amber-400 text-sm hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-2">
            {gameOptions
              .filter(game => game.id !== activeGame)
              .map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  variant="compact"
                  onClick={() => handleGameSwitch(game.id)}
                />
              ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-8">
          <div className="grid-2 gap-4">
            <button 
              onClick={() => navigate('wallet')}
              className="btn btn-success"
            >
              💰 Deposit
            </button>
            <button 
              onClick={() => navigate('home')}
              className="btn btn-secondary"
            >
              🎮 More Games
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Game;
