import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, Circle, Text as FabricText, Group, Line } from 'fabric';

// European Roulette Numbers (more authentic)
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

// Professional casino betting options
const BETS = [
  { id: 'red', label: 'Red', payout: 2, color: '#dc2626', icon: '🔴' },
  { id: 'black', label: 'Black', payout: 2, color: '#1f2937', icon: '⚫' },
  { id: 'even', label: 'Even', payout: 2, color: '#3b82f6', icon: '2️⃣' },
  { id: 'odd', label: 'Odd', payout: 2, color: '#8b5cf6', icon: '1️⃣' },
  { id: 'low', label: '1-18', payout: 2, color: '#22c55e', icon: '📉' },
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
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  const SIZE = 320;
  const CENTER = SIZE / 2;
  const RADIUS = 140;

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: SIZE,
      height: SIZE,
      backgroundColor: '#0f172a',
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
      
      // Create segment with proper casino colors
      const segmentColor = number.color === 'red' ? '#dc2626' : 
                          number.color === 'black' ? '#1f2937' : '#16a34a';
      
      // Create multiple arcs for smooth segments
      for (let r = 40; r < RADIUS; r += 2) {
        for (let a = startAngle; a < endAngle; a += 0.02) {
          const dot = new Circle({
            left: CENTER + r * Math.cos(a),
            top: CENTER + r * Math.sin(a),
            radius: 1.5,
            fill: segmentColor,
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
      const textRadius = RADIUS - 25;
      const numberText = new FabricText(number.num.toString(), {
        left: CENTER + textRadius * Math.cos(midAngle),
        top: CENTER + textRadius * Math.sin(midAngle),
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Inter, sans-serif',
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 0.5,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        shadow: '1px 1px 2px rgba(0,0,0,0.8)',
      });
      wheelParts.push(numberText);

      // Separator lines
      const separatorLine = new Line([
        CENTER + 40 * Math.cos(startAngle),
        CENTER + 40 * Math.sin(startAngle),
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

    // Outer casino rim with gold
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
    });

    // Inner circle (casino green)
    const innerCircle = new Circle({
      left: CENTER,
      top: CENTER,
      radius: 35,
      fill: '#16a34a',
      stroke: '#fbbf24',
      strokeWidth: 3,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });

    // Casino logo in center
    const centerLogo = new FabricText('🎰', {
      left: CENTER,
      top: CENTER,
      fontSize: 24,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });

    const wheelGroup = new Group([innerCircle, ...wheelParts, outerRim, centerLogo], {
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
      left: CENTER + RADIUS - 20,
      top: CENTER,
      radius: 6,
      fill: '#ffffff',
      stroke: '#fbbf24',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      shadow: '0 3px 6px rgba(0,0,0,0.8)',
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

    // Random winning number with proper casino physics
    const winningIndex = Math.floor(Math.random() * NUMBERS.length);
    const winningNumber = NUMBERS[winningIndex];
    
    // Calculate realistic spin physics
    const segmentAngle = 360 / NUMBERS.length;
    const baseRotations = 8 + Math.random() * 6; // 8-14 rotations
    const targetAngle = baseRotations * 360 + winningIndex * segmentAngle;
    
    const duration = 4500 + Math.random() * 1000; // 4.5-5.5 seconds
    const startTime = Date.now();
    const startAngle = wheel.angle || 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Professional casino easing (slow start, fast middle, slow end)
      const eased = progress < 0.1 
        ? progress * 5 * progress
        : progress < 0.9
        ? 0.05 + 0.85 * (progress - 0.1) / 0.8
        : 0.9 + 0.1 * (1 - Math.pow(1 - (progress - 0.9) / 0.1, 3));
      
      const currentAngle = startAngle + targetAngle * eased;
      
      wheel.set('angle', currentAngle);
      
      // Animate ball with realistic physics
      const ballAngle = -currentAngle * 1.3 * (Math.PI / 180);
      const ballRadius = RADIUS - 20 - Math.sin(progress * Math.PI * 2) * 15;
      const ballBounce = progress > 0.8 ? Math.sin((progress - 0.8) * 50) * 3 : 0;
      
      ball.set({
        left: CENTER + (ballRadius + ballBounce) * Math.cos(ballAngle),
        top: CENTER + (ballRadius + ballBounce) * Math.sin(ballAngle),
      });
      
      canvas.renderAll();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Final ball position
        const finalAngle = (winningIndex * segmentAngle - 90) * (Math.PI / 180);
        ball.set({
          left: CENTER + (RADIUS - 30) * Math.cos(finalAngle),
          top: CENTER + (RADIUS - 30) * Math.sin(finalAngle),
        });
        canvas.renderAll();
        
        setResult(winningNumber);
        setHistory(prev => [winningNumber, ...prev.slice(0, 9)]); // Keep last 10
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
        const payout = amount * bet.payout;
        totalWin += payout;
        winningBets.push({ bet: bet.label, amount: payout });
      }
    });

    if (totalWin > 0) {
      setLastWin({ amount: totalWin, bets: winningBets });
      onWin?.(totalWin, 'roulette');
    }

    // Clear bets after spin
    setTimeout(() => {
      clearBets();
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Roulette Wheel */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl" />
        <div className="relative bg-slate-800 rounded-full p-2 border-4 border-amber-500/50 shadow-2xl">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Result Display */}
      {result && !isSpinning && (
        <div className="mb-4 text-center animate-scale-in">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            result.color === 'red' ? 'bg-red-600' : 
            result.color === 'black' ? 'bg-gray-800' : 'bg-green-600'
          }`}>
            <span className="text-2xl font-bold text-white">{result.num}</span>
            <span className="text-sm text-white uppercase">{result.color}</span>
          </div>
        </div>
      )}

      {/* Betting Grid */}
      <div className="w-full max-w-sm mb-4">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {BETS.map((bet) => (
            <button
              key={bet.id}
              onClick={() => placeBet(bet.id)}
              disabled={isSpinning}
              className={`relative p-3 rounded-lg font-bold text-white transition-all ${
                isSpinning ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
              }`}
              style={{ backgroundColor: bet.color }}
            >
              <div className="text-sm">{bet.label}</div>
              <div className="text-xs opacity-80">{bet.payout}:1</div>
              {bets[bet.id] && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  ${bets[bet.id]}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Bet Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-zinc-400">
            Total Bet: <span className="text-amber-500 font-bold">${totalBet}</span>
          </div>
          <button
            onClick={clearBets}
            disabled={isSpinning || totalBet === 0}
            className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            Clear Bets
          </button>
        </div>

        {/* Spin Button */}
        <button
          onClick={spin}
          disabled={isSpinning || disabled || totalBet === 0}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            isSpinning || disabled || totalBet === 0
              ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] active:scale-95'
          }`}
        >
          {isSpinning ? 'SPINNING...' : totalBet === 0 ? 'PLACE BETS' : `SPIN - $${totalBet}`}
        </button>
      </div>
    </div>
  );
};

export default Roulette;