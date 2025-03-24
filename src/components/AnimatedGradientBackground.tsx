import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  speed?: 'slow' | 'medium' | 'fast';
  colorTheme?: 'blockchain' | 'cyberpunk' | 'defi' | 'nft';
  children: React.ReactNode;
}

export const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  className,
  intensity = 'subtle',
  speed = 'medium',
  colorTheme = 'blockchain',
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIdRef = useRef<number | null>(null);
  
  // Color theme definitions
  const colorThemes = {
    blockchain: [
      { r: 50, g: 100, b: 255 },   // Blockchain blue
      { r: 70, g: 50, b: 200 },    // Deep purple
      { r: 20, g: 70, b: 160 }     // Dark blue
    ],
    cyberpunk: [
      { r: 255, g: 0, b: 128 },    // Neon pink
      { r: 0, g: 255, b: 255 },    // Cyan
      { r: 128, g: 0, b: 255 }     // Purple
    ],
    defi: [
      { r: 0, g: 200, b: 83 },     // Finance green
      { r: 0, g: 128, b: 128 },    // Teal
      { r: 0, g: 80, b: 170 }      // Deep blue
    ],
    nft: [
      { r: 255, g: 100, b: 100 },  // Coral
      { r: 130, g: 70, b: 230 },   // Purple
      { r: 255, g: 180, b: 50 }    // Gold
    ]
  };

  // Intensity settings
  const intensitySettings = {
    subtle: { opacity: 0.05, blur: 100 },
    medium: { opacity: 0.12, blur: 80 },
    strong: { opacity: 0.2, blur: 60 }
  };

  // Speed settings
  const speedSettings = {
    slow: 0.001,
    medium: 0.002,
    fast: 0.004
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create gradient animation
    let step = 0;
    const colors = colorThemes[colorTheme];
    const intensitySetting = intensitySettings[intensity];
    const speedSetting = speedSettings[speed];

    const render = () => {
      step += speedSetting;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create blobs
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        const size = Math.min(canvas.width, canvas.height) * 0.8;
        
        // Create radial gradient
        const x = canvas.width * (0.3 + 0.4 * Math.sin(step + i * 2));
        const y = canvas.height * (0.3 + 0.4 * Math.cos(step + i * 2));
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        
        // Set gradient colors
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${intensitySetting.opacity})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        
        // Draw gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      frameIdRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [colorTheme, intensity, speed]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 -z-10" 
        style={{ 
          filter: `blur(${intensitySettings[intensity].blur}px)`,
          transform: 'scale(1.2)' // Expand to cover blur edges
        }}
      />
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}; 