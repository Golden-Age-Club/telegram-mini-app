import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Star } from 'lucide-react';
import SlotMachine from '../components/SlotMachine';
import CardFlip from '../components/CardFlip';
import Confetti from '../components/Confetti';

const Game = ({ user, updateBalance, navigate, gameData }) => {
  const tg = window.Telegram?.WebApp;
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastWin, setLastWin] = useState(null);
  const [activeGame, setActiveGame] = useState('slots');

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#0f1923');
      tg.setBackgroundColor('#0f1923');
      
      tg.BackButton?.show();
      tg.BackButton?.onClick(() => navigate('home'));
    }

    return () => {
      tg?.BackButton?.hide();
      tg?.BackButton?.offClick();
    };
  }, [tg, navigate]);

  const relatedGames = [
    { id: 1, name: 'Caishen Wins', gradient: 'from-red-600 to-orange-500' },
    { id: 2, name: 'Lucky Neko', gradient: 'from-amber-500 to-yellow-400' },
    { id: 3, name: 'Shining Crown', gradient: 'from-purple-600 to-pink-500' },
    { id: 4, name: 'Super Hot', gradient: 'from-red-500 to-red-700' },
  ];

  const handleWin = (amount) => {
    setLastWin(amount);
    setShowConfetti(true);
    updateBalance(amount);
    tg?.HapticFeedback?.notificationOccurred('success');
  };

  const handleLose = (amount) => {
    updateBalance(-amount);
    tg?.HapticFeedback?.notificationOccurred('error');
  };

  return (
    <div className="page">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <div className="header-bar">
        <button 
          onClick={() => navigate('home')}
          className="flex items-center gap-1 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="balance-chip">
          <div className="coin-icon">$</div>
          <span className="text-[var(--gold)]">{user?.balance?.toLocaleString() || '2,368.50'}</span>
        </div>
      </div>

      {/* Mega Win Display */}
      {lastWin && lastWin >= 100 && (
        <div className="p-4">
          <div className="mega-win">
            <div className="relative z-10">
              <p className="mega-win-title">MEGA WIN!</p>
              <p className="mega-win-amount">{lastWin.toLocaleString()}.00</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <span className="text-8xl">💰</span>
            </div>
          </div>
        </div>
      )}

      {/* Game Tabs */}
      <div className="tab-container py-3">
        <button 
          onClick={() => setActiveGame('slots')}
          className={`tab ${activeGame === 'slots' ? 'active' : ''}`}
        >
          🎰 Slots
        </button>
        <button 
          onClick={() => setActiveGame('cards')}
          className={`tab ${activeGame === 'cards' ? 'active' : ''}`}
        >
          🃏 Cards
        </button>
      </div>

      {/* Game Area */}
      <div className="px-4 pb-4">
        <div className="card p-4">
          {activeGame === 'slots' ? (
            <SlotMachine onWin={handleWin} onLose={handleLose} />
          ) : (
            <CardFlip onWin={handleWin} onLose={handleLose} />
          )}
        </div>
      </div>

      {/* Related Games */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white">More Games</h3>
          <button className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {relatedGames.map((game) => (
            <button
              key={game.id}
              onClick={() => tg?.HapticFeedback?.impactOccurred('light')}
              className={`w-20 h-20 rounded-xl bg-gradient-to-br ${game.gradient} flex-shrink-0 flex flex-col items-center justify-center gap-1`}
            >
              <span className="text-2xl">🎰</span>
              <span className="text-[10px] text-white font-medium px-1 text-center leading-tight">{game.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-8">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => navigate('wallet')}
            className="btn-primary w-full"
          >
            Deposit
          </button>
          <button 
            onClick={() => navigate('home')}
            className="btn-secondary w-full"
          >
            More Games
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
