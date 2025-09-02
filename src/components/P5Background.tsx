import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
}

export const P5Background = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let particles: Particle[] = [];
      let mouseInfluence = 100;
      
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(containerRef.current!);
        
        // Initialize particles
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            vx: p.random(-1, 1),
            vy: p.random(-1, 1),
            size: p.random(2, 8),
            hue: p.random(0, 30) // Red spectrum
          });
        }
        
        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.background(0, 0, 0, 0);
      };

      p.draw = () => {
        p.background(0, 0, 0, 0.05); // Slight trail effect
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];
          
          // Mouse interaction
          const mouseDistance = p.dist(p.mouseX, p.mouseY, particle.x, particle.y);
          if (mouseDistance < mouseInfluence && p.mouseX > 0 && p.mouseY > 0) {
            const force = (mouseInfluence - mouseDistance) / mouseInfluence;
            const angle = p.atan2(particle.y - p.mouseY, particle.x - p.mouseX);
            particle.vx += p.cos(angle) * force * 0.1;
            particle.vy += p.sin(angle) * force * 0.1;
          }
          
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Boundary wrapping
          if (particle.x < 0) particle.x = p.width;
          if (particle.x > p.width) particle.x = 0;
          if (particle.y < 0) particle.y = p.height;
          if (particle.y > p.height) particle.y = 0;
          
          // Damping
          particle.vx *= 0.99;
          particle.vy *= 0.99;
          
          // Add slight random movement
          particle.vx += p.random(-0.02, 0.02);
          particle.vy += p.random(-0.02, 0.02);
          
          // Draw particle
          p.fill(particle.hue, 80, 90, 0.8);
          p.noStroke();
          p.ellipse(particle.x, particle.y, particle.size);
          
          // Connect nearby particles
          for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            const distance = p.dist(particle.x, particle.y, other.x, other.y);
            
            if (distance < 80) {
              const alpha = p.map(distance, 0, 80, 0.3, 0);
              p.stroke(particle.hue, 60, 70, alpha);
              p.strokeWeight(1);
              p.line(particle.x, particle.y, other.x, other.y);
            }
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};