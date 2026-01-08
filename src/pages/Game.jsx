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
      isHot: true,
      component: SlotMachine
    },
    { 
      id: 'roulette', 
      name: 'Emerald Roulette', 
      icon: '🎯', 
      subtitle: 'European Casino Style',
      isLive: true,
      component: Roulette
    },
    { 
      id: 'cards', 
      name: 'Royal Blackjack', 
      icon: '🃏', 
      subtitle: 'Classic Card Game',
      isNew: true,
      component: CardFlip
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
      showBack={true} 
      onBack={() => navigate('home')}
    >
      <div className="page space-y-6">
        {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}

        {/* Mega Win Display */}
        {lastWin && lastWin >= 100 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="card text-center max-w-sm mx-4 glow-gold">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gradient-gold mb-2">MEGA WIN!</h2>
              <div className="text-4xl font-bold text-gradient-emerald mb-4">
                ${lastWin.toLocaleString()}
              </div>
              <button 
                onClick={() => setLastWin(null)}
                className="btn btn-primary"
              >
                Continue Playing
              </button>
            </div>
          </div>
        )}

        {/* Game Selection Tabs */}
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {gameOptions.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameSwitch(game.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                  activeGame === game.id
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <span className="text-xl">{game.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-sm">{game.name}</div>
                  <div className="text-xs opacity-80">{game.subtitle}</div>
                </div>
                {game.isHot && <span className="text-xs bg-red-500 px-2 py-1 rounded-full">HOT</span>}
                {game.isLive && <span className="text-xs bg-emerald-500 px-2 py-1 rounded-full">LIVE</span>}
                {game.isNew && <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">NEW</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Game Stats */}
        <div className="px-4">
          <div className="grid-2 gap-4">
            <div className="card text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm text-gray-400">Total Wins</div>
              <div className="text-lg font-bold text-gradient-emerald">
                ${gameStats.totalWins.toLocaleString()}
              </div>
            </div>
            <div className="card text-center">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm text-gray-400">Win Streak</div>
              <div className="text-lg font-bold text-gradient-gold">
                {gameStats.winStreak}
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="px-4">
          <div className="card p-6 bg-gradient-to-br from-black via-gray-900 to-black border-amber-500/20">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-gradient-gold mb-2">
                {currentGameData?.name}
              </h2>
              <p className="text-gray-400 text-sm">{currentGameData?.subtitle}</p>
            </div>
            
            {GameComponent && (
              <GameComponent 
                onWin={handleWin} 
                onLose={handleLose}
                user={user}
              />
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
