import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, Circle, Triangle, Text, Group } from 'fabric';

const SEGMENTS = [
  { label: '$5', value: 5, color: '#ef4444' },
  { label: '$10', value: 10, color: '#f97316' },
  { label: '$25', value: 25, color: '#eab308' },
  { label: '$50', value: 50, color: '#22c55e' },
  { label: '$100', value: 100, color: '#3b82f6' },
  { label: '$250', value: 250, color: '#8b5cf6' },
  { label: '$500', value: 500, color: '#ec4899' },
  { label: 'JACKPOT', value: 1000, color: '#f59e0b' },
];

const SpinWheel = ({ onComplete, disabled = false }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const wheelRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const SIZE = 300;
  const CENTER = SIZE / 2;
  const RADIUS = 130;

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: SIZE,
      height: SIZE,
      backgroundColor: 'transparent',
      selection: false,
    });

    fabricRef.current = canvas;

    const segmentAngle = 360 / SEGMENTS.length;
    const wheelParts = [];

    // Create colored arc segments around the edge
    SEGMENTS.forEach((segment, i) => {
      const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
      
      // Draw arc using small circles
      for (let a = startAngle; a < endAngle; a += 0.08) {
        const dot = new Circle({
          left: CENTER + RADIUS * Math.cos(a),
          top: CENTER + RADIUS * Math.sin(a),
          radius: 5,
          fill: segment.color,
          originX: 'center',
          originY: 'center',
          selectable: false,
        });
        wheelParts.push(dot);
      }

      // Inner colored dot
      const midAngle = (startAngle + endAngle) / 2;
      const innerDot = new Circle({
        left: CENTER + (RADIUS - 25) * Math.cos(midAngle),
        top: CENTER + (RADIUS - 25) * Math.sin(midAngle),
        radius: 10,
        fill: segment.color,
        originX: 'center',
        originY: 'center',
        selectable: false,
      });
      wheelParts.push(innerDot);

      // Label
      const labelRadius = RADIUS * 0.55;
      const label = new Text(segment.label, {
        left: CENTER + labelRadius * Math.cos(midAngle),
        top: CENTER + labelRadius * Math.sin(midAngle),
        fontSize: segment.label === 'JACKPOT' ? 10 : 14,
        fontWeight: 'bold',
        fontFamily: 'Inter, sans-serif',
        fill: '#ffffff',
        originX: 'center',
        originY: 'center',
        angle: (midAngle * 180 / Math.PI) + 90,
        selectable: false,
      });
      wheelParts.push(label);
    });

    // Base circle
    const baseCircle = new Circle({
      left: CENTER,
      top: CENTER,
      radius: RADIUS - 15,
      fill: '#27272a',
      stroke: '#3f3f46',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
    });

    const wheelGroup = new Group([baseCircle, ...wheelParts], {
      left: CENTER,
      top: CENTER,
      originX: 'center',
      originY: 'center',
      selectable: false,
    });

    canvas.add(wheelGroup);
    wheelRef.current = wheelGroup;

    // Center decoration
    const centerOuter = new Circle({
      left: CENTER,
      top: CENTER,
      radius: 28,
      fill: '#f59e0b',
      originX: 'center',
      originY: 'center',
      selectable: false,
      shadow: '0 4px 12px rgba(0,0,0,0.5)',
    });
    canvas.add(centerOuter);

    const centerInner = new Circle({
      left: CENTER,
      top: CENTER,
      radius: 20,
      fill: '#18181b',
      originX: 'center',
      originY: 'center',
      selectable: false,
    });
    canvas.add(centerInner);

    const centerText = new Text('SPIN', {
      left: CENTER,
      top: CENTER,
      fontSize: 10,
      fontWeight: 'bold',
      fontFamily: 'Inter, sans-serif',
      fill: '#f59e0b',
      originX: 'center',
      originY: 'center',
      selectable: false,
    });
    canvas.add(centerText);

    // Pointer
    const pointer = new Triangle({
      left: CENTER,
      top: 12,
      width: 24,
      height: 28,
      fill: '#f59e0b',
      originX: 'center',
      originY: 'top',
      angle: 180,
      selectable: false,
      shadow: '0 2px 8px rgba(0,0,0,0.5)',
    });
    canvas.add(pointer);

    canvas.renderAll();

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  const spin = useCallback(() => {
    if (isSpinning || disabled || !wheelRef.current || !fabricRef.current) return;

    setIsSpinning(true);
    setResult(null);

    const canvas = fabricRef.current;
    const wheel = wheelRef.current;
    
    // Random result
    const winningIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    
    // Calculate final angle
    const rotations = 5 + Math.random() * 3;
    const targetAngle = rotations * 360 + (360 - winningIndex * segmentAngle - segmentAngle / 2);
    
    const startAngle = wheel.angle || 0;
    const totalRotation = targetAngle - (startAngle % 360);
    const duration = 5000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + totalRotation * eased;
      
      wheel.set('angle', currentAngle);
      canvas.renderAll();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setResult(SEGMENTS[winningIndex]);
        onComplete?.(SEGMENTS[winningIndex]);
      }
    };

    requestAnimationFrame(animate);
  }, [isSpinning, disabled, onComplete]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl" />
        
        {/* Wheel */}
        <div className="relative bg-[--bg-card] rounded-full p-2 border-4 border-amber-500/50 shadow-2xl">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Result display */}
      {result && !isSpinning && (
        <div className="mt-4 text-center animate-scale-in">
          <p className="text-sm text-[--text-muted]">You won</p>
          <p className="text-3xl font-bold text-amber-500">
            {result.label === 'JACKPOT' ? '🎉 $1,000 JACKPOT! 🎉' : `$${result.value}`}
          </p>
        </div>
      )}

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={isSpinning || disabled}
        className={`mt-6 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
          isSpinning || disabled
            ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] active:scale-95'
        }`}
      >
        {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
      </button>
    </div>
  );
};

export default SpinWheel;
