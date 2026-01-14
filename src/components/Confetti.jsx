import { useEffect, useRef, useState } from 'react';
import { Canvas, Rect, Circle } from 'fabric';

const Confetti = ({ active = false, duration = 3000, onComplete }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;

    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: 'transparent',
      selection: false,
      renderOnAddRemove: false,
    });

    const colors = [
      '#f59e0b', // amber
      '#ef4444', // red
      '#22c55e', // green
      '#3b82f6', // blue
      '#ec4899', // pink
      '#8b5cf6', // purple
      '#06b6d4', // cyan
      '#fbbf24', // yellow
    ];

    const particles = [];
    const particleCount = 150;

    // Create confetti particles
    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isRect = Math.random() > 0.3;
      const size = Math.random() * 8 + 4;

      let particle;
      if (isRect) {
        particle = new Rect({
          left: width / 2 + (Math.random() - 0.5) * 100,
          top: height + 20,
          width: size,
          height: size * (Math.random() * 0.5 + 0.5),
          fill: color,
          angle: Math.random() * 360,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        });
      } else {
        particle = new Circle({
          left: width / 2 + (Math.random() - 0.5) * 100,
          top: height + 20,
          radius: size / 2,
          fill: color,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        });
      }

      canvas.add(particle);

      particles.push({
        obj: particle,
        vx: (Math.random() - 0.5) * 15,
        vy: -(Math.random() * 20 + 15), // Initial upward velocity
        vr: (Math.random() - 0.5) * 15,
        gravity: 0.3,
        friction: 0.99,
        delay: Math.random() * 200,
      });
    }

    const startTime = Date.now();
    let animationId;

    const animate = () => {
      const elapsed = Date.now() - startTime;

      particles.forEach((p) => {
        if (elapsed < p.delay) return;

        const obj = p.obj;
        
        // Apply physics
        p.vy += p.gravity;
        p.vx *= p.friction;
        
        const left = obj.left + p.vx;
        const top = obj.top + p.vy;
        const angle = (obj.angle || 0) + p.vr;

        // Fade out as it falls
        const opacity = Math.max(0, 1 - (top - height / 2) / (height / 2));

        obj.set({
          left,
          top,
          angle,
          opacity,
        });
      });

      canvas.renderAll();

      if (elapsed < duration) {
        animationId = requestAnimationFrame(animate);
      } else {
        setIsVisible(false);
        onComplete?.();
      }
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      canvas.dispose();
    };
  }, [active, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] pointer-events-none z-[100]"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Confetti;
