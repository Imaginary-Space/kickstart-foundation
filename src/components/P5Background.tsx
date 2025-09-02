import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
}

export const P5Background = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sketch = (p: p5) => {
      let particles: Particle[] = [];
      let mouseInfluence = { x: 0, y: 0 };
      
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(canvasRef.current!);
        
        // Initialize particles
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            vx: p.random(-1, 1),
            vy: p.random(-1, 1),
            size: p.random(20, 80),
            alpha: p.random(0.1, 0.3),
            hue: p.random(350, 370) // Red hues
          });
        }
      };

      p.draw = () => {
        p.clear();
        p.background(0, 0, 0, 0); // Transparent background
        
        // Update mouse influence
        mouseInfluence.x = p.lerp(mouseInfluence.x, p.mouseX, 0.05);
        mouseInfluence.y = p.lerp(mouseInfluence.y, p.mouseY, 0.05);
        
        // Draw swirls
        particles.forEach((particle, i) => {
          // Calculate distance to mouse
          const mouseDistance = p.dist(particle.x, particle.y, mouseInfluence.x, mouseInfluence.y);
          const influence = p.map(mouseDistance, 0, 200, 1, 0);
          
          // Apply mouse influence
          const mouseForceX = (mouseInfluence.x - particle.x) * influence * 0.01;
          const mouseForceY = (mouseInfluence.y - particle.y) * influence * 0.01;
          
          // Add swirl motion
          const angle = p.atan2(particle.y - p.height/2, particle.x - p.width/2);
          const swirlForceX = -p.sin(angle + p.frameCount * 0.01) * 0.5;
          const swirlForceY = p.cos(angle + p.frameCount * 0.01) * 0.5;
          
          // Update velocity
          particle.vx += mouseForceX + swirlForceX;
          particle.vy += mouseForceY + swirlForceY;
          
          // Apply friction
          particle.vx *= 0.95;
          particle.vy *= 0.95;
          
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Wrap around edges
          if (particle.x < -50) particle.x = p.width + 50;
          if (particle.x > p.width + 50) particle.x = -50;
          if (particle.y < -50) particle.y = p.height + 50;
          if (particle.y > p.height + 50) particle.y = -50;
          
          // Draw particle with swirl trail
          p.push();
          p.translate(particle.x, particle.y);
          p.rotate(p.atan2(particle.vy, particle.vx));
          
          // Create gradient effect
          const steps = 10;
          for (let j = 0; j < steps; j++) {
            const alpha = particle.alpha * (1 - j / steps);
            const size = particle.size * (1 - j / steps * 0.8);
            
            p.fill(particle.hue % 360, 70, 80, alpha);
            p.noStroke();
            p.ellipse(-j * 5, 0, size, size * 0.6);
          }
          
          p.pop();
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    sketchRef.current = new p5(sketch);

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
        sketchRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};