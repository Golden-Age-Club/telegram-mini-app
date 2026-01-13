import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, Rect, FabricText as Text } from 'fabric';

// Professional casino symbols with proper weights and payouts
const SYMBOLS = [
  { symbol: '🍒', name: 'Cherry', weight: 25, payout: 2, color: '#dc2626' },
  { symbol: '🍋', name: 'Lemon', weight: 20, payout: 3, color: '#fbbf24' },
  { symbol: '🍊', name: 'Orange', weight: 18, payout: 4, color: '#f97316' },
  { symbol: '🍀', name: 'Clover', weight: 15, payout: 5, color: '#16a34a' },
  { symbol: '⭐', name: 'Star', weight: 10, payout: 8, color: '#fbbf24' },
  { symbol: '🔔', name: 'Bell', weight: 8, payout: 15, color: '#f59e0b' },
  { symbol: '💎', name: 'Diamond', weight: 3, payout: 50, color: '#3b82f6' },
  { symbol: '7️⃣', name: 'Lucky Seven', weight: 1, payout: 100, color: '#8b5cf6' },
];

const SlotMachine = ({ onWin, onLose, bet = 10, disabled = false }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const reelsRef = useRef([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(['🍒', '🍋', '🍊']);
  const [currentBet, setCurrentBet] = useState(bet);
  const [lastWin, setLastWin] = useState(null);

  const REEL_WIDTH = 100;
  const REEL_HEIGHT = 280;
  const SYMBOL_HEIGHT = 90;
  const CANVAS_WIDTH = 340;
  const CANVAS_HEIGHT = 300;
  
  // Calculate responsive canvas size
  const getResponsiveCanvasSize = () => {
    if (typeof window !== 'undefined') {
      const maxWidth = Math.min(340, window.innerWidth - 80); // Account for padding
      return { width: maxWidth, height: (maxWidth / 340) * 300 };
    }
    return { width: CANVAS_WIDTH, height: CANVAS_HEIGHT };
  };

  // Initialize canvas with casino styling
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#0a0a0a',
      selection: false,
    });

    fabricRef.current = canvas;
    createCasinoReels(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const createCasinoReels = (canvas) => {
    const reels = [];
    const startX = 20;

    for (let i = 0; i < 3; i++) {
      const reelX = startX + i * (REEL_WIDTH + 10);
      
      // Casino-style reel background with gold trim
      const reelBg = new Rect({
        left: reelX,
        top: 10,
        width: REEL_WIDTH,
        height: REEL_HEIGHT,
        fill: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 50%, #1a1a1a 100%)',
        rx: 16,
        ry: 16,
        stroke: '#fbbf24',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        shadow: {
          color: 'rgba(0, 0, 0, 0.8)',
          blur: 20,
          offsetX: 0,
          offsetY: 10,
        },
      });
      canvas.add(reelBg);

      // Gold inner border
      const innerBorder = new Rect({
        left: reelX + 4,
        top: 14,
        width: REEL_WIDTH - 8,
        height: REEL_HEIGHT - 8,
        fill: 'transparent',
        rx: 12,
        ry: 12,
        stroke: '#d97706',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      canvas.add(innerBorder);

      // Create symbol strip (7 symbols for smooth scrolling)
      const symbols = [];
      for (let j = 0; j < 7; j++) {
        const randomSymbol = getWeightedSymbol();
        const symbolText = new Text(randomSymbol.symbol, {
          left: reelX + REEL_WIDTH / 2,
          top: 10 + j * SYMBOL_HEIGHT,
          fontSize: 56,
          fontFamily: 'Inter, sans-serif',
          originX: 'center',
          originY: 'top',
          selectable: false,
          evented: false,
          shadow: {
            color: randomSymbol.color,
            blur: 8,
            offsetX: 0,
            offsetY: 0,
          },
        });
        symbols.push(symbolText);
        canvas.add(symbolText);
      }

      reels.push({ bg: reelBg, symbols, currentY: 0 });
    }

    reelsRef.current = reels;

    // Casino-style payline indicator
    const payline = new Rect({
      left: 10,
      top: REEL_HEIGHT / 2 - SYMBOL_HEIGHT / 2 + 10,
      width: CANVAS_WIDTH - 20,
      height: SYMBOL_HEIGHT,
      fill: 'transparent',
      stroke: '#fbbf24',
      strokeWidth: 3,
      strokeDashArray: [10, 5],
      rx: 12,
      ry: 12,
      selectable: false,
      evented: false,
      shadow: {
        color: 'rgba(251, 191, 36, 0.5)',
        blur: 15,
        offsetX: 0,
        offsetY: 0,
      },
    });
    canvas.add(payline);

    canvas.renderAll();
  };

  const getWeightedSymbol = () => {
    const totalWeight = SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of SYMBOLS) {
      random -= symbol.weight;
      if (random <= 0) return symbol;
    }
    return SYMBOLS[0];
  };

  const animateReel = useCallback((reelIndex, finalSymbol, duration) => {
    return new Promise((resolve) => {
      const canvas = fabricRef.current;
      const reel = reelsRef.current[reelIndex];
      if (!canvas || !reel) return resolve();

      const startTime = Date.now();
      const totalSpins = 4 + reelIndex * 2; // Staggered stopping
      const totalDistance = totalSpins * SYMBOLS.length * SYMBOL_HEIGHT;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Casino-style easing (bouncy stop)
        const eased = progress < 0.8 
          ? 1 - Math.pow(1 - progress / 0.8, 2)
          : 1 - Math.pow((progress - 0.8) / 0.2, 4) * 0.1;
        
        const currentDistance = eased * totalDistance;

        // Update symbol positions with casino effects
        reel.symbols.forEach((symbolText, idx) => {
          const baseY = 10 + idx * SYMBOL_HEIGHT;
          let newY = baseY - (currentDistance % (SYMBOLS.length * SYMBOL_HEIGHT));
          
          // Wrap around and change symbols
          while (newY < -SYMBOL_HEIGHT) {
            newY += SYMBOLS.length * SYMBOL_HEIGHT;
            if (progress < 0.9) {
              const newSymbol = getWeightedSymbol();
              symbolText.set({
                text: newSymbol.symbol,
                shadow: {
                  color: newSymbol.color,
                  blur: 8,
                  offsetX: 0,
                  offsetY: 0,
                }
              });
            }
          }
          
          symbolText.set('top', newY);
        });

        canvas.renderAll();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Set final symbols with casino precision
          const centerIndex = Math.floor(reel.symbols.length / 2);
          reel.symbols.forEach((symbolText, idx) => {
            const offset = idx - centerIndex;
            let symbolToShow;
            
            if (offset === 0) {
              symbolToShow = finalSymbol;
            } else {
              symbolToShow = getWeightedSymbol();
            }
            
            symbolText.set({
              text: symbolToShow.symbol,
              top: 10 + idx * SYMBOL_HEIGHT,
              shadow: {
                color: symbolToShow.color,
                blur: 8,
                offsetX: 0,
                offsetY: 0,
              }
            });
          });
          
          canvas.renderAll();
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }, []);

  const spin = useCallback(async () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    setLastWin(null);
    
    // Deduct bet amount immediately
    onLose?.(currentBet);

    // Generate result with casino-style weighted probability
    const newResult = [
      getWeightedSymbol(),
      getWeightedSymbol(),
      getWeightedSymbol(),
    ];

    // Animate each reel with professional casino timing
    await Promise.all([
      animateReel(0, newResult[0], 1500),
      animateReel(1, newResult[1], 2000),
      animateReel(2, newResult[2], 2500),
    ]);

    setResult(newResult.map(s => s.symbol));
    setIsSpinning(false);

    // Calculate winnings with casino-style payouts
    const checkWin = () => {
      const [first, second, third] = newResult;
      
      // Jackpot - all three match
      if (first.symbol === second.symbol && second.symbol === third.symbol) {
        const payout = currentBet * first.payout;
        setLastWin({ type: 'jackpot', amount: payout, symbol: first.symbol });
        onWin?.(payout, 'jackpot');
        return;
      }
      
      // Two matching symbols
      if (first.symbol === second.symbol || second.symbol === third.symbol || first.symbol === third.symbol) {
        const matchingSymbol = first.symbol === second.symbol ? first : 
                             (second.symbol === third.symbol ? second : first);
        const payout = Math.floor(currentBet * (matchingSymbol.payout * 0.3));
        setLastWin({ type: 'match', amount: payout, symbol: matchingSymbol.symbol });
        onWin?.(payout, 'match');
        return;
      }
      
      // Special combinations
      const hasLucky = newResult.some(s => s.symbol === '🍀');
      const hasStar = newResult.some(s => s.symbol === '⭐');
      if (hasLucky && hasStar) {
        const payout = currentBet * 3;
        setLastWin({ type: 'special', amount: payout, symbol: '🍀⭐' });
        onWin?.(payout, 'special');
        return;
      }
    };

    checkWin();
  }, [isSpinning, disabled, currentBet, onWin, onLose, animateReel]);

  return (
    <div className="casino-game-container">
      {/* Casino Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gold mb-2" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>
          🎰 ROYAL SLOTS 🎰
        </h2>
        <div className="text-sm text-zinc-400 uppercase tracking-wider">
          Premium Casino Experience
        </div>
      </div>

      {/* Bet Controls - Casino Style */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <button
          onClick={() => setCurrentBet(Math.max(5, currentBet - 5))}
          disabled={isSpinning}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-xl disabled:opacity-50 shadow-lg hover:shadow-red-500/25 transition-all"
        >
          -
        </button>
        <div className="chip-stack text-center px-6 py-3">
          <div className="text-xs text-zinc-400 uppercase tracking-wider">Bet Amount</div>
          <div className="text-2xl font-bold text-gold">${currentBet}</div>
        </div>
        <button
          onClick={() => setCurrentBet(Math.min(100, currentBet + 5))}
          disabled={isSpinning}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-800 text-white font-bold text-xl disabled:opacity-50 shadow-lg hover:shadow-green-500/25 transition-all"
        >
          +
        </button>
      </div>

      {/* Slot Machine Frame - Professional Casino Design */}
      <div className="relative mx-auto mb-6 w-full" style={{ maxWidth: 'min(380px, calc(100vw - 2rem))' }}>
        {/* Outer Casino Frame */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 rounded-3xl shadow-2xl"></div>
        <div className="absolute inset-2 bg-gradient-to-b from-zinc-900 to-black rounded-2xl"></div>
        
        {/* Top Casino Branding */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-3 sm:px-8 py-1.5 sm:py-2 rounded-full text-black font-bold text-[10px] sm:text-sm shadow-lg border-2 border-amber-300 whitespace-nowrap z-10">
          ⭐ VEGAS STYLE ⭐
        </div>
        
        {/* Canvas Container */}
        <div className="relative p-3 sm:p-5" style={{ paddingTop: '2rem', paddingBottom: '1.25rem' }}>
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '340/300' }}>
            <canvas 
              ref={canvasRef} 
              className="rounded-xl absolute inset-0 w-full h-full" 
            />
          
            {/* Gradient Masks for Professional Look */}
            <div className="absolute inset-x-3 sm:inset-x-5 top-3 sm:top-5 h-16 sm:h-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none rounded-t-xl" />
            <div className="absolute inset-x-3 sm:inset-x-5 bottom-3 sm:bottom-5 h-16 sm:h-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none rounded-b-xl" />
          </div>
        </div>

        {/* Side Decorations */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-12 sm:h-16 bg-gradient-to-b from-amber-400 to-amber-600 rounded-r-full shadow-lg"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-12 sm:h-16 bg-gradient-to-b from-amber-400 to-amber-600 rounded-l-full shadow-lg"></div>
      </div>

      {/* Win Display */}
      {lastWin && (
        <div className="mb-6 text-center animate-pulse">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${
            lastWin.type === 'jackpot' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' :
            lastWin.type === 'match' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
            'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
          } shadow-2xl`}>
            <span className="text-2xl">{lastWin.symbol}</span>
            <div>
              <div className="font-bold text-lg">
                {lastWin.type === 'jackpot' ? '🎉 JACKPOT!' : 
                 lastWin.type === 'match' ? '✨ WIN!' : '🌟 BONUS!'}
              </div>
              <div className="text-xl font-black">${lastWin.amount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Paytable - Casino Style */}
      <div className="mb-6 bg-black/40 rounded-2xl p-4 border border-amber-500/30">
        <h3 className="text-center text-amber-400 font-bold mb-3 text-sm uppercase tracking-wider">Paytable</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {SYMBOLS.slice().reverse().map((symbol, idx) => (
            <div key={idx} className="flex items-center justify-between bg-zinc-900/50 rounded-lg px-3 py-2">
              <span className="flex items-center gap-2">
                <span className="text-lg">{symbol.symbol}</span>
                <span className="text-zinc-400">×3</span>
              </span>
              <span className="text-amber-400 font-bold">{currentBet * symbol.payout}x</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spin Button - Professional Casino Style */}
      <button
        onClick={spin}
        disabled={isSpinning || disabled}
        className={`w-full py-6 rounded-2xl font-black text-xl transition-all duration-300 ${
          isSpinning || disabled
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:shadow-[0_0_40px_rgba(251,191,36,0.8)] active:scale-98 hover:from-amber-300 hover:to-amber-500'
        } uppercase tracking-wider border-2 ${
          isSpinning || disabled ? 'border-zinc-700' : 'border-amber-300'
        }`}
        style={{
          textShadow: isSpinning || disabled ? 'none' : '0 2px 4px rgba(0,0,0,0.5)',
          boxShadow: isSpinning || disabled ? 'none' : '0 8px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        {isSpinning ? (
          <span className="flex items-center justify-center gap-3">
            <span className="animate-spin">🎰</span>
            SPINNING...
          </span>
        ) : (
          `🎲 SPIN - $${currentBet} 🎲`
        )}
      </button>
    </div>
  );
};

export default SlotMachine;