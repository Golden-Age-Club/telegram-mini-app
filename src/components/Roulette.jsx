import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, Circle, FabricText as Text, Group, Line } from 'fabric';

// European Roulette Numbers (more professional than American)
const NUMBERS = [
  { num: 0, color: 'green' },
  { num: 32, color: 'red' }, { num: 15, color: 'black' }, { num: 19, color: 'red' }, { num: 4, color: 'black' },
  { num: 21, color: 'red' }, { num: 2, color: 'black' }, { num: 25, color: 'red' }, { num: 17, color: 'black' },
  { num: 34, color: 'red' }, { num: 6, color: 'black' }, { num: 27, color: 'red' }, { num: 13, color: 'black' },
  { num: 36, color: 'red' }, { num: 11, color: 'black' }, { num: 30, color: 'red' }, { num: 8, color: 'black' },
  { num: 23, color: 'red' }, { num: 10, color: 'black' }, { num: 5, color: 'red' }, { num: 24, color: 'black' },
  { num: 16, color: 'red' }, { num: 33, color: 'black' }, { num: 1, color: 'red' }, { num: 20, color: 'black' },
  { num: 14, color: 'red' }, { num: 31, color: 'black' }, { num: 9, color: 'red' }, { num: 22, color: 'black' },
  { num: 18, color: 'red' }, { num: 29, color: 'black' }, { num: 7, color: 'red' }, { num: 28, color: 'black' },
  { num: 12, color: 'red' }, { num: 35, color: 'black' }, { num: 3, color: 'red' }, { num: 26, color: 'black' }
];

// Professional Casino Betting Options
const BETS = [
  { id: 'red', label: 'Red', payout: 2, color: '#dc2626', icon: '🔴' },
  { id: 'black', label: 'Black', payout: 2, color: '#1f2937', icon: '⚫' },
  { id: 'even', label: 'Even', payout: 2, color: '#3b82f6', icon: '2️⃣' },
  { id: 'odd', label: 'Odd', payout: 2, color: '#8b5cf6', icon: '1️⃣' },
  { id: 'low', label: '1-18', payout: 2, color: '#16a34a', icon: '📉' },
  { id: 'high', label: '19-36', payout: 2, color: '#f59e0b', icon: '📈' },
];

const Roulette = ({ onWin, onLose, disabled = false }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const wheelRef = useRef(null);
  const ballRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [bets, setBets] = useState({});
  const [totalBet, setTotalBet] = useState(0);
  const [lastWin, setLastWin] = useState(null);

  const SIZE = 320;
  const CENTER = SIZE / 2;
  const RADIUS = 140;

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: SIZE,
      height: SIZE,
      backgroundColor: '#0a0a0a',
      selection: false,
    });

    fabricRef.current = canvas;
    createProfessionalWheel(canvas);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  const createProfessionalWheel = (canvas) => {
    const wheelParts = [];
    const segmentAngle = 360 / NUMBERS.length;

    // Create professional wheel segments
    NUMBERS.forEach((number, i) => {
      const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
      
      // Create segment with casino-quality appearance
      const segmentPath = `M ${CENTER} ${CENTER} L ${CENTER + RADIUS * Math.cos(startAngle)} ${CENTER + RADIUS * Math.sin(startAngle)} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER + RADIUS * Math.cos(endAngle)} ${CENTER + RADIUS * Math.sin(endAngle)} Z`;
      
      // Segment colors with professional casino styling
      const segmentColor = number.color === 'red' ? '#dc2626' : 
                          number.color === 'black' ? '#1f2937' : '#16a34a';
      
      // Create multiple arcs for depth effect
      for (let r = RADIUS; r > RADIUS - 30; r -= 3) {
        const opacity = (RADIUS - r) / 30;
        const arcRadius = r;
        
        for (let a = startAngle; a < endAngle; a += 0.02) {
          const dot = new Circle({
            left: CENTER + arcRadius * Math.cos(a),
            top: CENTER + arcRadius * Math.sin(a),
            radius: 1.5,
            fill: segmentColor,
            opacity: 1 - opacity * 0.3,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
          });
          wheelParts.push(dot);
        }
      }

      // Number text with casino styling
      const midAngle = (startAngle + endAngle) / 2;
      const textRadius = RADIUS - 20;
      const numberText = new Text(number.num.toString(), {
        left: CENTER + textRadius * Math.cos(midAngle),
        top: CENTER + textRadius * Math.sin(midAngle),
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Inter, sans-serif',
        fill: '#ffffff',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        shadow: {
          color: 'rgba(0, 0, 0, 0.8)',
          blur: 4,
          offsetX: 1,
          offsetY: 1,
        },
      });
      wheelParts.push(numberText);

      // Separator lines
      const separatorLine = new Line([
        CENTER + (RADIUS - 35) * Math.cos(startAngle),
        CENTER + (RADIUS - 35) * Math.sin(startAngle),
        CENTER + RADIUS * Math.cos(startAngle),
        CENTER + RADIUS * Math.sin(startAngle)
      ], {
        stroke: '#fbbf24',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      wheelParts.push(separatorLine);
    });

    // Outer rim with casino gold
    const outerRim = new Circle({
      left: CENTER,
      top: CENTER,
      radius: RADIUS,
      fill: 'transparent',
      stroke: '#fbbf24',
      strokeWidth: 6,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      shadow: {
        color: 'rgba(251, 191, 36, 0.6)',
        blur: 15,
        offsetX: 0,
        offsetY: 0,
      },
    });

    // Middle rim
    const middleRim = new Circle({
      left: CENTER,
      top: CENTER,
      radius: RADIUS - 35,
      fill: 'transparent',
      stroke: '#d97706',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });

    // Inner circle with professional finish
    const innerCircle = new Circle({
      left: CENTER,
      top: CENTER,
      radius: RADIUS - 50,
      fill: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      stroke: '#475569',
      strokeWidth: 3,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      shadow: {
        color: 'rgba(0, 0, 0, 0.8)',
        blur: 20,
        offsetX: 0,
        offsetY: 0,
      },
    });

    // Center hub
    const centerHub = new Circle({
      left: CENTER,
      top: CENTER,
      radius: 15,
      fill: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      stroke: '#92400e',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      shadow: {
        color: 'rgba(251, 191, 36, 0.8)',
        blur: 10,
        offsetX: 0,
        offsetY: 0,
      },
    });

    const wheelGroup = new Group([innerCircle, ...wheelParts, middleRim, outerRim, centerHub], {
      left: CENTER,
      top: CENTER,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });

    canvas.add(wheelGroup);
    wheelRef.current = wheelGroup;

    // Professional casino ball
    const ball = new Circle({
      left: CENTER + RADIUS - 25,
      top: CENTER,
      radius: 6,
      fill: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
      stroke: '#9ca3af',
      strokeWidth: 1,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      shadow: {
        color: 'rgba(0, 0, 0, 0.8)',
        blur: 8,
        offsetX: 2,
        offsetY: 2,
      },
    });

    canvas.add(ball);
    ballRef.current = ball;

    canvas.renderAll();
  };

  const placeBet = (betType, amount = 5) => {
    if (isSpinning) return;
    
    setBets(prev => ({
      ...prev,
      [betType]: (prev[betType] || 0) + amount
    }));
    setTotalBet(prev => prev + amount);
  };

  const clearBets = () => {
    setBets({});
    setTotalBet(0);
    setLastWin(null);
  };

  const spin = useCallback(async () => {
    if (isSpinning || disabled || totalBet === 0) return;

    setIsSpinning(true);
    setResult(null);
    setLastWin(null);

    // Deduct total bet
    onLose?.(totalBet);

    const canvas = fabricRef.current;
    const wheel = wheelRef.current;
    const ball = ballRef.current;
    
    if (!canvas || !wheel || !ball) return;

    // Random winning number with casino-style selection
    const winningIndex = Math.floor(Math.random() * NUMBERS.length);
    const winningNumber = NUMBERS[winningIndex];
    
    // Professional casino spin physics
    const segmentAngle = 360 / NUMBERS.length;
    const baseRotations = 8 + Math.random() * 6; // 8-14 rotations
    const targetAngle = baseRotations * 360 + winningIndex * segmentAngle;
    
    const duration = 4500; // Longer, more dramatic spin
    const startTime = Date.now();
    const startAngle = wheel.angle || 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Professional casino easing (slow start, fast middle, slow end)
      const eased = progress < 0.1 
        ? progress * 5 // Slow start
        : progress < 0.8 
        ? 0.5 + (progress - 0.1) * 0.714 // Fast middle
        : 1 - Math.pow((1 - progress) / 0.2, 3) * 0.2; // Dramatic slow end
      
      const currentAngle = startAngle + targetAngle * eased;
      
      wheel.set('angle', currentAngle);
      
      // Ball physics - opposite direction with realistic bounce
      const ballProgress = Math.min(progress * 1.2, 1);
      const ballAngle = -currentAngle * 1.3 * (Math.PI / 180);
      const ballRadius = RADIUS - 25 - Math.sin(ballProgress * Math.PI * 2) * 15;
      const ballBounce = progress > 0.8 ? Math.sin((progress - 0.8) * 50) * 3 : 0;
      
      ball.set({
        left: CENTER + (ballRadius + ballBounce) * Math.cos(ballAngle),
        top: CENTER + (ballRadius + ballBounce) * Math.sin(ballAngle),
      });
      
      canvas.renderAll();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Final ball position with precision
        const finalAngle = (winningIndex * segmentAngle - 90) * (Math.PI / 180);
        ball.set({
          left: CENTER + (RADIUS - 30) * Math.cos(finalAngle),
          top: CENTER + (RADIUS - 30) * Math.sin(finalAngle),
        });
        canvas.renderAll();
        
        setResult(winningNumber);
        setIsSpinning(false);
        calculateWinnings(winningNumber);
      }
    };

    requestAnimationFrame(animate);
  }, [isSpinning, disabled, totalBet, bets, onLose]);

  const calculateWinnings = (winningNumber) => {
    let totalWin = 0;
    const winningBets = [];

    Object.entries(bets).forEach(([betType, amount]) => {
      let won = false;
      
      switch (betType) {
        case 'red':
          won = winningNumber.color === 'red';
          break;
        case 'black':
          won = winningNumber.color === 'black';
          break;
        case 'even':
          won = winningNumber.num !== 0 && winningNumber.num % 2 === 0;
          break;
        case 'odd':
          won = winningNumber.num !== 0 && winningNumber.num % 2 === 1;
          break;
        case 'low':
          won = winningNumber.num >= 1 && winningNumber.num <= 18;
          break;
        case 'high':
          won = winningNumber.num >= 19 && winningNumber.num <= 36;
          break;
      }

      if (won) {
        const bet = BETS.find(b => b.id === betType);
        const winAmount = amount * bet.payout;
        totalWin += winAmount;
        winningBets.push({ type: betType, amount: winAmount });
      }
    });

    if (totalWin > 0) {
      setLastWin({ amount: totalWin, bets: winningBets });
      onWin?.(totalWin, 'roulette');
    }

    // Clear bets after showing results
    setTimeout(() => {
      clearBets();
    }, 4000);
  };

  return (
    <div className="casino-game-container">
      {/* Casino Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gold mb-2" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>
          🎯 EUROPEAN ROULETTE 🎯
        </h2>
        <div className="text-sm text-zinc-400 uppercase tracking-wider">
          Professional Casino Table
        </div>
      </div>

      {/* Roulette Wheel - Professional Casino Design */}
      <div className="relative mb-8 flex justify-center">
        <div className="relative">
          {/* Outer Casino Frame */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-full shadow-2xl transform scale-110"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-zinc-900 to-black rounded-full transform scale-105"></div>
          
          {/* Wheel Container */}
          <div className="relative p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full border-4 border-amber-500/50 shadow-2xl">
            <canvas ref={canvasRef} className="rounded-full" />
          </div>

          {/* Casino Pointer */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-amber-400 shadow-lg z-10"></div>
        </div>
      </div>

      {/* Result Display */}
      {result && !isSpinning && (
        <div className="mb-6 text-center animate-bounce">
          <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${
            result.color === 'red' ? 'bg-gradient-to-r from-red-600 to-red-700' : 
            result.color === 'black' ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 
            'bg-gradient-to-r from-green-600 to-green-700'
          } border-2 border-amber-400/50`}>
            <span className="text-4xl font-black">{result.num}</span>
            <div className="text-left">
              <div className="text-sm text-white/80 uppercase tracking-wider">Winner</div>
              <div className="text-lg font-bold text-white capitalize">{result.color}</div>
            </div>
          </div>
        </div>
      )}

      {/* Win Display */}
      {lastWin && (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl animate-pulse">
            <span className="text-2xl">🎉</span>
            <div>
              <div className="font-bold text-lg">WINNER!</div>
              <div className="text-xl font-black">${lastWin.amount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Betting Grid */}
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {BETS.map((bet) => (
            <button
              key={bet.id}
              onClick={() => placeBet(bet.id)}
              disabled={isSpinning}
              className={`relative p-4 rounded-xl font-bold text-white transition-all duration-300 ${
                isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
              } shadow-lg border-2 border-transparent hover:border-amber-400/50`}
              style={{ 
                background: `linear-gradient(135deg, ${bet.color} 0%, ${bet.color}dd 100%)`,
                boxShadow: isSpinning ? 'none' : `0 6px 20px ${bet.color}40`
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">{bet.icon}</span>
                <div className="text-center">
                  <div className="text-sm font-bold">{bet.label}</div>
                  <div className="text-xs opacity-90">{bet.payout}:1</div>
                </div>
              </div>
              {bets[bet.id] && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-white shadow-lg">
                  ${bets[bet.id]}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Bet Controls */}
        <div className="flex items-center justify-between mb-6 bg-black/40 rounded-xl p-4 border border-amber-500/30">
          <div className="text-sm">
            <div className="text-zinc-400 uppercase tracking-wider text-xs">Total Bet</div>
            <div className="text-amber-400 font-bold text-lg">${totalBet}</div>
          </div>
          <button
            onClick={clearBets}
            disabled={isSpinning || totalBet === 0}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Clear Bets
          </button>
        </div>

        {/* Spin Button - Professional Casino Style */}
        <button
          onClick={spin}
          disabled={isSpinning || disabled || totalBet === 0}
          className={`w-full py-6 rounded-2xl font-black text-xl transition-all duration-300 ${
            isSpinning || disabled || totalBet === 0
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-2 border-zinc-700'
              : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:shadow-[0_0_40px_rgba(251,191,36,0.8)] active:scale-98 hover:from-amber-300 hover:to-amber-500 border-2 border-amber-300'
          } uppercase tracking-wider`}
          style={{
            textShadow: isSpinning || disabled || totalBet === 0 ? 'none' : '0 2px 4px rgba(0,0,0,0.5)',
            boxShadow: isSpinning || disabled || totalBet === 0 ? 'none' : '0 8px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
        >
          {isSpinning ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin">🎯</span>
              SPINNING...
            </span>
          ) : totalBet === 0 ? (
            '🎲 PLACE BETS 🎲'
          ) : (
            `🎯 SPIN - $${totalBet} 🎯`
          )}
        </button>
      </div>
    </div>
  );
};

export default Roulette;