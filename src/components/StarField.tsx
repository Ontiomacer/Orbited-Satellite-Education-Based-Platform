import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface StarFieldProps {
  density?: number;
  speed?: number;
  depth?: boolean;
  shooting?: boolean;
  color?: 'blue' | 'purple' | 'gold' | 'multi';
}

const StarField = ({ 
  density = 200, 
  speed = 1, 
  depth = true, 
  shooting = true,
  color = 'blue'
}: StarFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Color palettes
    const colorPalettes = {
      blue: ['rgba(224, 247, 255, ', 'rgba(185, 232, 255, ', 'rgba(145, 215, 255, '],
      purple: ['rgba(230, 220, 255, ', 'rgba(210, 190, 255, ', 'rgba(180, 160, 255, '],
      gold: ['rgba(255, 245, 220, ', 'rgba(255, 230, 180, ', 'rgba(255, 215, 140, '],
      multi: ['rgba(224, 247, 255, ', 'rgba(230, 220, 255, ', 'rgba(255, 245, 220, ']
    };

    const selectedPalette = colorPalettes[color];

    // Create stars
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      opacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
      colorIndex: number;
      depth: number;
    }> = [];

    for (let i = 0; i < density; i++) {
      const starDepth = depth ? Math.random() : 0.5;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: depth ? Math.random() * 1.5 + 0.5 * (starDepth + 0.5) : Math.random() * 1.5 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01 * speed,
        twinklePhase: Math.random() * Math.PI * 2,
        colorIndex: Math.floor(Math.random() * selectedPalette.length),
        depth: starDepth
      });
    }

    // Create shooting stars
    const shootingStars: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
      timeToNextActive: number;
    }> = [];

    if (shooting) {
      for (let i = 0; i < 5; i++) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height / 2,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 5 + 10 * speed,
          angle: Math.PI / 4 + Math.random() * Math.PI / 8,
          opacity: 0,
          active: false,
          timeToNextActive: Math.random() * 200
        });
      }
    }

    // Animation loop
    let animationFrameId: number;
    let frameCount = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Draw stars
      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        star.opacity = (Math.sin(star.twinklePhase) + 1) / 2 * 0.7 + 0.3;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        const starColor = selectedPalette[star.colorIndex];
        ctx.fillStyle = `${starColor}${star.opacity})`;
        
        // Add glow for larger stars
        if (star.radius > 1.5 && depth) {
          ctx.shadowColor = `${starColor}1)`;
          ctx.shadowBlur = 6 * star.depth;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw shooting stars
      if (shooting) {
        shootingStars.forEach((star) => {
          if (!star.active) {
            star.timeToNextActive--;
            if (star.timeToNextActive <= 0) {
              star.active = true;
              star.opacity = 1;
              star.x = Math.random() * canvas.width;
              star.y = Math.random() * canvas.height / 3;
              star.angle = Math.PI / 4 + Math.random() * Math.PI / 8;
            }
          } else {
            // Move shooting star
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            star.opacity -= 0.01;
            
            if (star.opacity <= 0 || star.x < 0 || star.x > canvas.width || star.y < 0 || star.y > canvas.height) {
              star.active = false;
              star.timeToNextActive = Math.random() * 200 + 50;
            } else {
              // Draw shooting star
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(star.x - Math.cos(star.angle) * star.length, star.y - Math.sin(star.angle) * star.length);
              
              const gradient = ctx.createLinearGradient(
                star.x, star.y,
                star.x - Math.cos(star.angle) * star.length, star.y - Math.sin(star.angle) * star.length
              );
              
              gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
              gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
              
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 2;
              ctx.stroke();
              
              // Add glow effect
              ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(star.x, star.y, 1, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, speed, depth, shooting, color]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
};

export default StarField;
