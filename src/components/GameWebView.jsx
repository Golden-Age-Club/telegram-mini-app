import { useState, useEffect } from 'react';
import { ArrowLeft, Home, Gamepad2, Wallet, User, Volume2, VolumeX, Maximize, Settings, Loader2, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const GameWebView = ({ user, onNavigate, gameData }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [balance, setBalance] = useState(user?.balance || 2368.50);
  const [bet, setBet] = useState(1.00);

  const gameName = gameData?.game || 'Fortune Tiger';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const winTimer = setInterval(() => {
        if (Math.random() > 0.75) {
          const amount = Math.floor(Math.random() * 500) + 50;
          setWinAmount(amount);
          setShowWin(true);
          setBalance(prev => prev + amount);
          setTimeout(() => setShowWin(false), 3000);
        }
      }, 10000);
      return () => clearInterval(winTimer);
    }
  }, [isLoading]);

  const handleSpin = () => {
    if (balance >= bet) {
      setBalance(prev => prev - bet);
    }
  };

  const otherGames = [
    { name: 'Lucky Neko', gradient: 'from-pink-400 to-purple-500' },
    { name: 'Shining Crown', gradient: 'from-amber-400 to-orange-500' },
    { name: '40 Super Hot', gradient: 'from-red-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-[--bg-base] text-white pb-24">
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
        {/* Game Container */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-rose-700">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[--bg-card]">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                <p className="font-medium">Loading {gameName}...</p>
                <p className="text-sm text-[--text-muted]">Preparing your game</p>
              </div>
            </div>
          ) : (
            <>
              {/* Game Visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-2 p-4">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-2xl"
                    >
                      {['🍒', '🍋', '🍊', '💎', '7️⃣'][Math.floor(Math.random() * 5)]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Win Overlay */}
              {showWin && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-scale-in">
                  <div className="text-center">
                    <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-float" />
                    <h2 className="text-4xl font-bold text-gradient mb-2">{t('megaWin')}</h2>
                    <p className="text-3xl font-bold text-white">${winAmount.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Game Controls */}
        <div className="card p-4 space-y-4">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-[--text-muted] mb-1">Bet</p>
              <p className="font-semibold">${bet.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-[--text-muted] mb-1">Win</p>
              <p className="font-semibold text-amber-500">${showWin ? winAmount.toFixed(2) : '0.00'}</p>
            </div>
            <div>
              <p className="text-xs text-[--text-muted] mb-1">Balance</p>
              <p className="font-semibold">${balance.toFixed(2)}</p>
            </div>
          </div>

          {/* Bet Adjustment */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setBet(Math.max(0.10, bet - 0.50))}
              className="w-12 h-12 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-center text-xl font-bold"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <p className="text-xs text-[--text-muted]">Bet Amount</p>
              <p className="text-xl font-bold">${bet.toFixed(2)}</p>
            </div>
            <button 
              onClick={() => setBet(Math.min(100, bet + 0.50))}
              className="w-12 h-12 rounded-xl bg-[--bg-elevated] border border-[--border] flex items-center justify-center text-xl font-bold"
            >
              +
            </button>
          </div>

          {/* Spin Button */}
          <button 
            onClick={handleSpin}
            disabled={isLoading || balance < bet}
            className="btn btn-primary w-full py-4 text-lg font-bold disabled:opacity-50"
          >
            SPIN
          </button>
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
