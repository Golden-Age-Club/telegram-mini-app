import { useEffect, useRef, useState } from 'react';
import { Canvas, Rect, Text, Circle, PencilBrush } from 'fabric';

const PRIZES = [
  { label: '$5', value: 5, probability: 0.3 },
  { label: '$10', value: 10, probability: 0.25 },
  { label: '$25', value: 25, probability: 0.2 },
  { label: '$50', value: 50, probability: 0.12 },
  { label: '$100', value: 100, probability: 0.08 },
  { label: '$500', value: 500, probability: 0.04 },
  { label: '$1000', value: 1000, probability: 0.01 },
];

const ScratchCard = ({ onComplete, onReveal }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [prize, setPrize] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const scratchedPixels = useRef(new Set());

  const WIDTH = 280;
  const HEIGHT = 180;

  // Select prize based on probability
  const selectPrize = () => {
    const rand = Math.random();
    let cumulative = 0;
    for (const p of PRIZES) {
      cumulative += p.probability;
      if (rand <= cumulative) return p;
    }
    return PRIZES[0];
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const selectedPrize = selectPrize();
    setPrize(selectedPrize);

    const canvas = new Canvas(canvasRef.current, {
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: '#18181b',
      selection: false,
      isDrawingMode: true,
    });

    fabricRef.current = canvas;

    // Prize background
    const prizeBg = new Rect({
      left: 0,
      top: 0,
      width: WIDTH,
      height: HEIGHT,
      fill: '#09090b',
      selectable: false,
      evented: false,
    });
    canvas.add(prizeBg);

    // Prize text
    const prizeLabel = new Text('YOU WON!', {
      left: WIDTH / 2,
      top: 50,
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Inter, sans-serif',
      fill: '#a1a1aa',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });
    canvas.add(prizeLabel);

    const prizeAmount = new Text(selectedPrize.label, {
      left: WIDTH / 2,
      top: 100,
      fontSize: 48,
      fontWeight: 'bold',
      fontFamily: 'Inter, sans-serif',
      fill: '#f59e0b',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });
    canvas.add(prizeAmount);

    // Scratch layer (cover)
    const scratchLayer = new Rect({
      left: 0,
      top: 0,
      width: WIDTH,
      height: HEIGHT,
      fill: '#3f3f46',
      selectable: false,
      evented: false,
    });
    canvas.add(scratchLayer);

    // "Scratch here" text
    const scratchText = new Text('SCRATCH TO REVEAL', {
      left: WIDTH / 2,
      top: HEIGHT / 2 - 10,
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Inter, sans-serif',
      fill: '#71717a',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });
    canvas.add(scratchText);

    // Decorative pattern
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * WIDTH;
      const y = Math.random() * HEIGHT;
      const dot = new Circle({
        left: x,
        top: y,
        radius: 2,
        fill: '#52525b',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });
      canvas.add(dot);
    }

    // Configure brush for scratching
    const brush = new PencilBrush(canvas);
    brush.width = 40;
    brush.color = '#09090b';
    canvas.freeDrawingBrush = brush;

    // Use globalCompositeOperation for eraser effect
    canvas.on('path:created', (e) => {
      const path = e.path;
      path.globalCompositeOperation = 'destination-out';
      path.selectable = false;
      path.evented = false;
      
      // Calculate scratch percentage
      const pathBounds = path.getBoundingRect();
      const scratchedArea = pathBounds.width * pathBounds.height;
      const totalArea = WIDTH * HEIGHT;
      const newPercent = Math.min(100, scratchPercent + (scratchedArea / totalArea) * 100);
      setScratchPercent(newPercent);

      // Auto-reveal at 50%
      if (newPercent >= 50 && !isRevealed) {
        setIsRevealed(true);
        onReveal?.(selectedPrize);
        
        // Clear scratch layer
        setTimeout(() => {
          canvas.isDrawingMode = false;
          const objects = canvas.getObjects();
          objects.forEach(obj => {
            if (obj !== prizeBg && obj !== prizeLabel && obj !== prizeAmount) {
              canvas.remove(obj);
            }
          });
          canvas.renderAll();
          onComplete?.(selectedPrize);
        }, 500);
      }
    });

    canvas.renderAll();

    return () => canvas.dispose();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Card frame */}
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-50 blur" />
        <div className="relative bg-[--bg-card] rounded-xl p-1 border border-amber-500/30">
          <canvas 
            ref={canvasRef} 
            className="rounded-lg cursor-crosshair"
          />
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 w-full max-w-[280px]">
        <div className="flex justify-between text-xs text-[--text-muted] mb-1">
          <span>Scratch progress</span>
          <span>{Math.round(scratchPercent)}%</span>
        </div>
        <div className="h-2 bg-[--bg-elevated] rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${scratchPercent}%` }}
          />
        </div>
      </div>

      {/* Result */}
      {isRevealed && prize && (
        <div className="mt-4 text-center animate-scale-in">
          <p className="text-lg font-bold text-amber-500">
            🎉 You won {prize.label}!
          </p>
        </div>
      )}

      {/* Instructions */}
      {!isRevealed && (
        <p className="mt-4 text-sm text-[--text-muted]">
          Scratch the card to reveal your prize!
        </p>
      )}
    </div>
  );
};

export default ScratchCard;
