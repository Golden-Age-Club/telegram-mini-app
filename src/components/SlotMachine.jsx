import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, Rect, Text, Group } from 'fabric';

const SYMBOLS = ['🍒', '🍋', '🍊', '💎', '7️⃣', '🍀', '⭐', '🔔'];
const SYMBOL_COLORS = {
  '🍒': '#ef4444',
  '🍋': '#eab308',
  '🍊': '#f97316',
  '💎': '#3b82f6',
  '7️⃣': '#a855f7',
  '🍀': '#22c55e',
  '⭐': '#fbbf24',
  '🔔': '#f59e0b',
};

const SlotMachine = ({ onSpin, onWin, bet = 1, disabled = false }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const reelsRef = useRef([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(['🍒', '🍋', '🍊']);

  const REEL_WIDTH = 90;
  const REEL_HEIGHT = 240;
  const SYMBOL_HEIGHT = 80;
  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 260;

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#18181b',
      selection: false,
    });

    fabricRef.current = canvas;

    // Create reels
    createReels(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const createReels = (canvas) => {
    const reels = [];
    const startX = 15;

    for (let i = 0; i < 3; i++) {
      const reelX = startX + i * (REEL_WIDTH + 10);
      
      // Reel background
      const reelBg = new Rect({
        left: reelX,
        top: 10,
        width: REEL_WIDTH,
        height: REEL_HEIGHT,
        fill: '#09090b',
        rx: 12,
        ry: 12,
        selectable: false,
        evented: false,
      });
      canvas.add(reelBg);

      // Create symbol strip (5 symbols for scrolling effect)
      const symbols = [];
      for (let j = 0; j < 5; j++) {
        const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const symbolText = new Text(symbol, {
          left: reelX + REEL_WIDTH / 2,
          top: 10 + j * SYMBOL_HEIGHT,
          fontSize: 48,
          originX: 'center',
          originY: 'top',
          selectable: false,
          evented: false,
        });
        symbols.push(symbolText);
        canvas.add(symbolText);
      }

      reels.push({ bg: reelBg, symbols, currentY: 0 });
    }

    reelsRef.current = reels;

    // Add frame overlay
    const frame = new Rect({
      left: 0,
      top: REEL_HEIGHT / 2 - SYMBOL_HEIGHT / 2 + 10,
      width: CANVAS_WIDTH,
      height: SYMBOL_HEIGHT,
      fill: 'transparent',
      stroke: '#f59e0b',
      strokeWidth: 3,
      rx: 8,
      ry: 8,
      selectable: false,
      evented: false,
    });
    canvas.add(frame);

    canvas.renderAll();
  };

  const animateReel = useCallback((reelIndex, finalSymbol, duration) => {
    return new Promise((resolve) => {
      const canvas = fabricRef.current;
      const reel = reelsRef.current[reelIndex];
      if (!canvas || !reel) return resolve();

      const startTime = Date.now();
      const totalSpins = 3 + reelIndex; // More spins for later reels
      const totalDistance = totalSpins * SYMBOLS.length * SYMBOL_HEIGHT;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentDistance = eased * totalDistance;

        // Update symbol positions
        reel.symbols.forEach((symbolText, idx) => {
          const baseY = 10 + idx * SYMBOL_HEIGHT;
          let newY = baseY - (currentDistance % (SYMBOLS.length * SYMBOL_HEIGHT));
          
          // Wrap around
          while (newY < -SYMBOL_HEIGHT) {
            newY += SYMBOLS.length * SYMBOL_HEIGHT;
            // Change symbol when it wraps
            if (progress < 0.9) {
              symbolText.set('text', SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
            }
          }
          
          symbolText.set('top', newY);
        });

        canvas.renderAll();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Set final symbols
          const centerIndex = Math.floor(reel.symbols.length / 2);
          reel.symbols.forEach((symbolText, idx) => {
            const offset = idx - centerIndex;
            const symbolIdx = (SYMBOLS.indexOf(finalSymbol) + offset + SYMBOLS.length) % SYMBOLS.length;
            symbolText.set({
              text: SYMBOLS[symbolIdx],
              top: 10 + idx * SYMBOL_HEIGHT,
            });
          });
          
          // Ensure center symbol is correct
          reel.symbols[centerIndex].set('text', finalSymbol);
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
    onSpin?.();

    // Generate random result
    const newResult = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    ];

    // Animate each reel with staggered timing
    await Promise.all([
      animateReel(0, newResult[0], 1000),
      animateReel(1, newResult[1], 1500),
      animateReel(2, newResult[2], 2000),
    ]);

    setResult(newResult);
    setIsSpinning(false);

    // Check for win
    if (newResult[0] === newResult[1] && newResult[1] === newResult[2]) {
      // Jackpot - all three match
      const multiplier = newResult[0] === '7️⃣' ? 100 : newResult[0] === '💎' ? 50 : 20;
      onWin?.(bet * multiplier, 'jackpot');
    } else if (newResult[0] === newResult[1] || newResult[1] === newResult[2] || newResult[0] === newResult[2]) {
      // Two match
      onWin?.(bet * 3, 'match');
    }
  }, [isSpinning, disabled, bet, onSpin, onWin, animateReel]);

  return (
    <div className="flex flex-col items-center">
      {/* Slot Machine Frame */}
      <div className="relative bg-gradient-to-b from-amber-600 to-amber-800 p-3 rounded-2xl shadow-2xl">
        {/* Top decoration */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-1 rounded-full text-black font-bold text-sm shadow-lg">
          ROYALE SLOTS
        </div>
        
        {/* Canvas container with mask */}
        <div className="relative overflow-hidden rounded-xl" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
          <canvas ref={canvasRef} />
          
          {/* Top/bottom gradient masks */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#18181b] to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#18181b] to-transparent pointer-events-none" />
        </div>

        {/* Win line indicator */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-1 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24]" />
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24]" />
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning || disabled}
        className={`mt-6 w-full max-w-[300px] py-4 rounded-2xl font-bold text-lg transition-all ${
          isSpinning || disabled
            ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] active:scale-95'
        }`}
      >
        {isSpinning ? 'SPINNING...' : 'SPIN'}
      </button>
    </div>
  );
};

export default SlotMachine;
