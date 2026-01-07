import { useState, useEffect } from 'react';
import { Minus, Plus, Trophy, Zap, Star } from 'lucide-react';
import SlotMachine from '../components/SlotMachine';
import CardFlip from '../components/CardFlip';
import Confetti from '../components/Confetti';

const Game = ({ user, gameData, updateBalance, navigate }) => {
  const tg = window.Telegram?.WebApp;
  const [gameType, setGameType] = useState('slots');
  const [bet, setBet] = useState(1.00);
  const [lastWin, setLastWin] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [winType, setWinType] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const gameName = gameData?.game || 'Fortune Tiger';

  useEffect(() => {
    if (tg) {
      tg.setHeaderColor('#0a0a0f');
      tg.setBackgroundColor('#0a0a0f');
    }
  }, [tg]);

  const handleSpin = () => {
    if (user?.balance >= bet) {
      updateBalance(-bet);
      setLastWin(0);
      tg?.HapticFeedback?.impactOccurred('heavy');
    }
  };

  const handleWin = (amount, type) => {
    setWinAmount(amount);
    setWinType(type);
    setLastWin(amount);
    updateBalance(amount);
    setShowWin(true);
    setShowConfetti(true);
    tg?.HapticFeedback?.notificationOccurred('success');
    
    setTimeout(() => setShowWin(false), type === 'jackpot' ? 5000 : 3000);
  };

  const handleCardGameComplete = (amount, result) => {
    if (amount > 0) {
      updateBalance(amount);
      setLastWin(amount);
      if (result === 'won') {
        setShowConfetti(true);
        tg?.HapticFeedback?.notificationOccurred('success');
      }
    }
  };

  const adjustBet = (delta) => {
    tg?.HapticFeedback?.selectionChanged();
    setBet(prev => {
      const newBet = prev + delta;
      if (newBet < 0.10) return 0.10;
      if (newBet > 100) return 100;
      return Math.round(newBet * 100) / 100;
    });
  };

  return (
    <div className="page">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Game Header */}
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gold">{gameName}</h1>
            <p className="text-sm text-[var(--text-muted)]">PG Soft • RTP 96.8%</p>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">LIVE</span>
          </div>
        </div>
      </div>

      {/* Game Type Switcher */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 p-1.5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)]">
          <button
            onClick={() => setGameType('slots')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              gameType === 'slots' 
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg shadow-amber-500/30' 
                : 'text-[var(--text-muted)]'
            }`}
          >
            🎰 Slots
          </button>
          <button
            onClick={() => setGameType('cards')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              gameType === 'cards' 
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg shadow-amber-500/30' 
                : 'text-[var(--text-muted)]'
            }`}
          >
            🃏 Cards
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="px-4 pb-4">
        <div className="card card-gold p-4 relative overflow-hidden">
          {gameType === 'slots' ? (
            <SlotMachine 
              bet={bet}
              disabled={user?.balance < bet}
              onSpin={handleSpin}
              onWin={handleWin}
            />
          ) : (
            <CardFlip onComplete={handleCardGameComplete} cardCount={6} />
          )}

          {/* Win Overlay */}
          {showWin && (
            <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-10 rounded-2xl">
              <div className="text-center">
                <div className="relative mb-4">
                  <Trophy className={`w-20 h-20 mx-auto ${winType === 'jackpot' ? 'text-[var(--gold)] animate-pulse' : 'text-amber-500'}`} />
                  {winType === 'jackpot' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-[var(--gold)]/20 animate-ping" />
                    </div>
                  )}
                </div>
                <h2 className={`text-3xl font-black mb-2 ${winType === 'jackpot' ? 'text-gold' : 'text-amber-500'}`}>
                  {winType === 'jackpot' ? '🎰 JACKPOT! 🎰' : 'YOU WIN!'}
                </h2>
                <p className="text-5xl font-black text-white">${winAmount.toFixed(2)}</p>
                {winType === 'jackpot' && (
                  <div className="mt-4 flex justify-center gap-1">
                    {['⭐', '💎', '🎉', '💰', '🎉', '💎', '⭐'].map((e, i) => (
                      <span key={i} className="text-2xl animate-float" style={{ animationDelay: `${i * 100}ms` }}>{e}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Stats & Controls */}
      {gameType === 'slots' && (
        <div className="px-4 pb-4">
          <div className="card p-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center mb-4 pb-4 border-b border-[var(--border)]">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">BET</p>
                <p className="font-black text-lg text-white">${bet.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">WIN</p>
                <p className={`font-black text-lg ${lastWin > 0 ? 'text-[var(--gold)]' : 'text-white'}`}>
                  ${lastWin.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">BALANCE</p>
                <p className="font-black text-lg text-emerald-400">${user?.balance?.toFixed(2) || '0.00'}</p>
              </div>
            </div>

            {/* Bet Adjustment */}
            <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={() => adjustBet(-0.50)}
                className="w-14 h-14 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-white font-bold text-xl"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <p className="text-xs text-[var(--text-muted)]">BET AMOUNT</p>
                <p className="text-2xl font-black text-gold">${bet.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => adjustBet(0.50)}
                className="w-14 h-14 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-white font-bold text-xl"
              >
                +
              </button>
            </div>

            {/* Quick Bets */}
            <div className="flex gap-2">
              {[1, 5, 10, 25, 50].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    tg?.HapticFeedback?.selectionChanged();
                    setBet(amount);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    bet === amount 
                      ? 'bg-[var(--gold)] text-black' 
                      : 'bg-[var(--bg-elevated)] text-white border border-[var(--border)]'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Paytable */}
      {gameType === 'slots' && (
        <div className="px-4 pb-8">
          <div className="card p-4">
            <h3 className="font-bold mb-3 text-[var(--gold)] flex items-center gap-2">
              <Star className="w-4 h-4" />
              PAYTABLE
            </h3>
            <div className="space-y-2 text-sm">
              {[
                { symbols: '7️⃣ 7️⃣ 7️⃣', mult: '100x', color: 'text-red-400' },
                { symbols: '💎 💎 💎', mult: '50x', color: 'text-blue-400' },
                { symbols: 'Any 3 Match', mult: '20x', color: 'text-purple-400' },
                { symbols: 'Any 2 Match', mult: '3x', color: 'text-[var(--text-muted)]' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-[var(--bg-elevated)] rounded-xl">
                  <span className="text-white">{row.symbols}</span>
                  <span className={`font-black ${row.color}`}>{row.mult}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
