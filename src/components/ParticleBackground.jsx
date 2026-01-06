import { useEffect, useRef } from 'react';
import { Canvas, Circle, Rect } from 'fabric';

const ParticleBackground = ({ particleCount = 30, className = '' }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: 'transparent',
      selection: false,
      renderOnAddRemove: false,
    });

    // Create particles
    const particles = [];
    const colors = [
      'rgba(245, 158, 11, 0.3)', // amber
      'rgba(6, 182, 212, 0.2)',  // cyan
      'rgba(139, 92, 246, 0.2)', // purple
      'rgba(236, 72, 153, 0.15)', // pink
    ];

    for (let i = 0; i < particleCount; i++) {
      const isCircle = Math.random() > 0.3;
      const size = Math.random() * 6 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      let particle;
      if (isCircle) {
        particle = new Circle({
          left: Math.random() * width,
          top: Math.random() * height,
          radius: size,
          fill: color,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        });
      } else {
        particle = new Rect({
          left: Math.random() * width,
          top: Math.random() * height,
          width: size * 1.5,
          height: size * 1.5,
          fill: color,
          angle: Math.random() * 360,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        });
      }

      canvas.add(particle);
      
      particles.push({
        obj: particle,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.3 - 0.2, // Slight upward bias
        vr: (Math.random() - 0.5) * 0.5,
        baseOpacity: parseFloat(color.match(/[\d.]+(?=\))/)[0]),
        phase: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = particles;

    // Animation loop
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 16; // Normalize to ~60fps
      lastTime = now;

      particles.forEach((p, i) => {
        const obj = p.obj;
        let left = obj.left + p.vx * delta;
        let top = obj.top + p.vy * delta;

        // Wrap around edges
        if (left < -20) left = width + 20;
        if (left > width + 20) left = -20;
        if (top < -20) top = height + 20;
        if (top > height + 20) top = -20;

        // Gentle floating motion
        const floatOffset = Math.sin(now / 2000 + p.phase) * 0.3;
        
        obj.set({
          left,
          top: top + floatOffset,
          angle: (obj.angle || 0) + p.vr * delta,
        });

        // Pulse opacity
        const opacityPulse = 0.5 + 0.5 * Math.sin(now / 3000 + p.phase);
        obj.set('opacity', p.baseOpacity * opacityPulse);
      });

      canvas.renderAll();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      canvas.setDimensions({ width: newWidth, height: newHeight });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.dispose();
    };
  }, [particleCount]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ParticleBackground;
