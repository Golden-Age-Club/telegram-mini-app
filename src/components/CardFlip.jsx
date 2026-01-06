import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, Rect, Text, Group } from 'fabric';

const CARD_VALUES = [
  { symbol: '💎', value: 100, color: '#3b82f6' },
  { symbol: '⭐', value: 50, color: '#fbbf24' },
  { symbol: '🍀', value: 25, color: '#22c55e' },
  { symbol: '🔔', value: 10, color: '#f59e0b' },
  { symbol: '💰', value: 200, color: '#a855f7' },
  { symbol: '7️⃣', value: 500, color: '#ef4444' },
];

const CardFlip = ({ onComplete, cardCount = 6 }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const cardsRef = useRef([]);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [totalWin, setTotalWin] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = Math.floor(cardCount * 0.75);

  const CARD_WIDTH = 70;
  const CARD_HEIGHT = 90;
  const GAP = 10;
  const COLS = 3;
  const ROWS = Math.ceil(cardCount / COLS);
  const CANVAS_WIDTH = COLS * CARD_WIDTH + (COLS - 1) * GAP + 40;
  const CANVAS_HEIGHT = ROWS * CARD_HEIGHT + (ROWS - 1) * GAP + 40;

  // Generate card pairs
  const generateCards = useCallback(() => {
    const pairCount = cardCount / 2;
    const selectedValues = [];
    
    for (let i = 0; i < pairCount; i++) {
      const value = CARD_VALUES[i % CARD_VALUES.length];
      selectedValues.push(value, value);
    }
    
    // Shuffle
    for (let i = selectedValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selectedValues[i], selectedValues[j]] = [selectedValues[j], selectedValues[i]];
    }
    
    return selectedValues;
  }, [cardCount]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#09090b',
      selection: false,
    });

    fabricRef.current = canvas;

    const cardValues = generateCards();
    const cards = [];

    cardValues.forEach((cardValue, index) => {
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const x = 20 + col * (CARD_WIDTH + GAP) + CARD_WIDTH / 2;
      const y = 20 + row * (CARD_HEIGHT + GAP) + CARD_HEIGHT / 2;

      // Card back (visible initially)
      const cardBack = new Rect({
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        fill: '#27272a',
        rx: 8,
        ry: 8,
        stroke: '#3f3f46',
        strokeWidth: 2,
      });

      const backPattern = new Text('?', {
        fontSize: 32,
        fontWeight: 'bold',
        fill: '#52525b',
        originX: 'center',
        originY: 'center',
      });

      const backGroup = new Group([cardBack, backPattern], {
        left: x,
        top: y,
        originX: 'center',
        originY: 'center',
        selectable: false,
      });

      // Card front (hidden initially)
      const cardFront = new Rect({
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        fill: '#18181b',
        rx: 8,
        ry: 8,
        stroke: cardValue.color,
        strokeWidth: 2,
      });

      const symbol = new Text(cardValue.symbol, {
        fontSize: 36,
        originX: 'center',
        originY: 'center',
        top: -8,
      });

      const valueText = new Text(`$${cardValue.value}`, {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Inter, sans-serif',
        fill: cardValue.color,
        originX: 'center',
        originY: 'center',
        top: 25,
      });

      const frontGroup = new Group([cardFront, symbol, valueText], {
        left: x,
        top: y,
        originX: 'center',
        originY: 'center',
        selectable: false,
        visible: false,
      });

      canvas.add(backGroup);
      canvas.add(frontGroup);

      cards.push({
        index,
        value: cardValue,
        backGroup,
        frontGroup,
        isFlipped: false,
        isMatched: false,
        x,
        y,
      });
    });

    cardsRef.current = cards;

    // Handle card clicks
    canvas.on('mouse:down', (e) => {
      if (gameState !== 'playing') return;
      
      const pointer = canvas.getPointer(e.e);
      const clickedCard = cards.find(card => {
        if (card.isFlipped || card.isMatched) return false;
        const dx = Math.abs(pointer.x - card.x);
        const dy = Math.abs(pointer.y - card.y);
        return dx < CARD_WIDTH / 2 && dy < CARD_HEIGHT / 2;
      });

      if (clickedCard) {
        flipCard(clickedCard);
      }
    });

    canvas.renderAll();

    return () => canvas.dispose();
  }, [generateCards, gameState]);

  const flipCard = useCallback((card) => {
    if (flippedCards.length >= 2) return;
    
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Animate flip
    card.isFlipped = true;
    card.backGroup.set('visible', false);
    card.frontGroup.set('visible', true);
    canvas.renderAll();

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(prev => prev + 1);
      
      const [first, second] = newFlipped;
      
      if (first.value.symbol === second.value.symbol) {
        // Match found!
        first.isMatched = true;
        second.isMatched = true;
        
        const winAmount = first.value.value;
        setTotalWin(prev => prev + winAmount);
        setMatchedPairs(prev => [...prev, first.value.symbol]);
        
        // Highlight matched cards
        first.frontGroup.item(0).set('stroke', '#22c55e');
        second.frontGroup.item(0).set('stroke', '#22c55e');
        canvas.renderAll();
        
        setFlippedCards([]);
        
        // Check win condition
        const allMatched = cardsRef.current.every(c => c.isMatched);
        if (allMatched) {
          setGameState('won');
          onComplete?.(totalWin + winAmount, 'won');
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          first.isFlipped = false;
          second.isFlipped = false;
          first.backGroup.set('visible', true);
          first.frontGroup.set('visible', false);
          second.backGroup.set('visible', true);
          second.frontGroup.set('visible', false);
          canvas.renderAll();
          setFlippedCards([]);
          
          // Check lose condition
          if (attempts + 1 >= maxAttempts) {
            setGameState('lost');
            onComplete?.(totalWin, 'lost');
          }
        }, 800);
      }
    }
  }, [flippedCards, attempts, maxAttempts, totalWin, onComplete]);

  const resetGame = () => {
    setGameState('playing');
    setFlippedCards([]);
    setMatchedPairs([]);
    setTotalWin(0);
    setAttempts(0);
    
    // Re-initialize canvas
    if (fabricRef.current) {
      fabricRef.current.dispose();
      fabricRef.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Stats */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="bg-[--bg-card] border border-[--border] rounded-lg px-3 py-2">
          <span className="text-[--text-muted]">Attempts: </span>
          <span className="font-bold">{attempts}/{maxAttempts}</span>
        </div>
        <div className="bg-[--bg-card] border border-[--border] rounded-lg px-3 py-2">
          <span className="text-[--text-muted]">Won: </span>
          <span className="font-bold text-amber-500">${totalWin}</span>
        </div>
      </div>

      {/* Game board */}
      <div className="relative bg-[--bg-card] rounded-2xl p-2 border border-[--border]">
        <canvas ref={canvasRef} className="rounded-xl" />
        
        {/* Game over overlay */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <h3 className={`text-2xl font-bold mb-2 ${gameState === 'won' ? 'text-emerald-500' : 'text-red-500'}`}>
                {gameState === 'won' ? '🎉 You Won!' : '😔 Game Over'}
              </h3>
              <p className="text-lg mb-4">
                Total: <span className="text-amber-500 font-bold">${totalWin}</span>
              </p>
              <button
                onClick={resetGame}
                className="btn btn-primary"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="mt-4 text-sm text-[--text-muted] text-center max-w-xs">
        Match pairs to win! Find all pairs before running out of attempts.
      </p>
    </div>
  );
};

export default CardFlip;
