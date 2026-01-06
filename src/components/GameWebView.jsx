import { useState, useEffect } from 'react';
import { ArrowLeft, Home, Gamepad2, Wallet, User, Volume2, VolumeX, Maximize, Loader2, Trophy, Minus, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SlotMachine from './SlotMachine';
import CardFlip from './CardFlip';
import Confetti from './Confetti';

const GameWebView = ({ user, onNavigate, gameData }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [winType, setWinType] = useState('');
  const [balance, setBalance] = useState(user?.balance || 2368.50);
  const [bet, setBet] = useState(1.00);
  const [lastWin, setLastWin] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameType, setGameType] = useState('slots'); // slots, cards

  const gameName = gameData?.game || 'Fortune Tiger';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSpin = () => {
    if (balance >= bet) {
      setBalance(prev => prev - bet);
      setLastWin(0);
    }
  };

  const handleWin = (amount, type) => {
    setWinAmount(amount);
    setWinType(type);
    setLastWin(amount);
    setBalance(prev => prev + amount);
    setShowWin(true);
    setShowConfetti(true);
    
    setTimeout(() => {
      setShowWin(false);
    }, type === 'jackpot' ? 4000 : 2500);
  };

  const handleCardGameComplete = (amount, result) => {
    if (amount > 0) {
      setBalance(prev => prev + amount);
      setLastWin(amount);
      if (result === 'won') {
        setShowConfetti(true);
      }
    }
  };

  const adjustBet = (delta) => {
    setBet(prev => {
      const newBet = prev + delta;
      if (newBet < 0.10) return 0.10;
      if (newBet > 100) return 100;
      return Math.round(newBet * 100) / 100;
    });
  };

  const otherGames = [
    { name: 'Lucky Neko', gradient: 'from-pink-400 to-purple-500' },
    { name: 'Shining Crown', gradient: 'from-amber-400 to-orange-500' },
    { name: '40 Super Hot', gradient: 'from-red-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-[--bg-base] text-white pb-24">
      {/* Confetti */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-[--border] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('games')}
              className="w-10 h-10 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold">{gameName}</h1>
              <p className="text-xs text-[--text-muted]">PG Soft</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-center"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button className="w-10 h-10 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-center">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Game Type Switcher */}
        <div className="flex gap-2 bg-[--bg-card] p-1 rounded-xl border border-[--border]">
          <button
            onClick={() => setGameType('slots')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              gameType === 'slots' ? 'bg-amber-500 text-black' : 'text-[--text-muted]'
            }`}
          >
            🎰 Slots
          </button>
          <button
            onClick={() => setGameType('cards')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              gameType === 'cards' ? 'bg-amber-500 text-black' : 'text-[--text-muted]'
            }`}
          >
            🃏 Card Match
          </button>
        </div>

        {/* Game Container */}
        <div className="relative rounded-2xl overflow-hidden bg-[--bg-card] border border-[--border]">
          {isLoading ? (
            <div className="aspect-[4/3] flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                <p className="font-medium">Loading {gameName}...</p>
                <p className="text-sm text-[--text-muted]">Preparing your game</p>
              </div>
            </div>
          ) : (
            <div className="py-8 flex justify-center">
              {gameType === 'slots' ? (
                <SlotMachine 
                  bet={bet}
                  disabled={balance < bet}
                  onSpin={handleSpin}
                  onWin={handleWin}
                />
              ) : (
                <CardFlip onComplete={handleCardGameComplete} cardCount={6} />
              )}
            </div>
          )}

          {/* Win Overlay */}
          {showWin && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center animate-scale-in z-10">
              <div className="text-center">
                <Trophy className={`w-20 h-20 mx-auto mb-4 animate-float ${winType === 'jackpot' ? 'text-amber-400' : 'text-amber-500'}`} />
                <h2 className={`text-4xl font-bold mb-2 ${winType === 'jackpot' ? 'text-gradient animate-pulse' : 'text-amber-500'}`}>
                  {winType === 'jackpot' ? '🎰 JACKPOT! 🎰' : 'YOU WIN!'}
                </h2>
                <p className="text-5xl font-bold text-white">${winAmount.toFixed(2)}</p>
                {winType === 'jackpot' && (
                  <div className="mt-4 flex justify-center gap-2">
                    {['🎉', '💰', '⭐', '💎', '⭐', '💰', '🎉'].map((emoji, i) => (
                      <span key={i} className="text-2xl animate-float" style={{ animationDelay: `${i * 100}ms` }}>
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Game Stats */}
        <div className="card p-4">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-xs text-[--text-muted] mb-1">Bet</p>
              <p className="font-bold text-lg">${bet.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-[--text-muted] mb-1">Win</p>
              <p className={`font-bold text-lg ${lastWin > 0 ? 'text-amber-500' : ''}`}>
                ${lastWin.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[--text-muted] mb-1">Balance</p>
              <p className="font-bold text-lg">${balance.toFixed(2)}</p>
            </div>
          </div>

          {/* Bet Adjustment */}
          <div className="flex items-center gap-3 bg-[--bg-base] rounded-xl p-2">
            <button 
              onClick={() => adjustBet(-0.50)}
              className="w-12 h-12 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-center hover:bg-[--bg-hover] transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="flex-1 text-center">
              <p className="text-xs text-[--text-muted]">Bet Amount</p>
              <p className="text-xl font-bold">${bet.toFixed(2)}</p>
            </div>
            <button 
              onClick={() => adjustBet(0.50)}
              className="w-12 h-12 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-center hover:bg-[--bg-hover] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Quick bet buttons */}
          <div className="flex gap-2 mt-3">
            {[1, 5, 10, 25].map((amount) => (
              <button
                key={amount}
                onClick={() => setBet(amount)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  bet === amount 
                    ? 'bg-amber-500 text-black' 
                    : 'bg-[--bg-elevated] border border-[--border] hover:border-amber-500/50'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        {/* Paytable */}
        <div className="card p-4">
          <h3 className="font-semibold mb-3">Paytable</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-[--bg-base] rounded-lg">
              <span>7️⃣ 7️⃣ 7️⃣</span>
              <span className="text-amber-500 font-bold">100x</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[--bg-base] rounded-lg">
              <span>💎 💎 💎</span>
              <span className="text-amber-500 font-bold">50x</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[--bg-base] rounded-lg">
              <span>Any 3 Match</span>
              <span className="text-amber-500 font-bold">20x</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[--bg-base] rounded-lg">
              <span>Any 2 Match</span>
              <span className="text-amber-500 font-bold">3x</span>
            </div>
          </div>
        </div>

        {/* Other Games */}
        <section>
          <h3 className="text-sm font-medium text-[--text-muted] mb-3">More Games</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
            {otherGames.map((game, i) => (
              <button
                key={i}
                onClick={() => onNavigate('gameView', { game: game.name })}
                className="flex-shrink-0 w-24"
              >
                <div className={`aspect-square rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center mb-2`}>
                  <Gamepad2 className="w-8 h-8 text-white/80" />
                </div>
                <p className="text-xs font-medium truncate">{game.name}</p>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPage="games" onNavigate={onNavigate} />
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

export default GameWebView;
