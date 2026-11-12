import React, { useEffect, useRef, useState } from 'react';

interface LiquidSculptureHeroProps {
  height?: number | string;
  theme?: 'light' | 'dark';
  particleDensity?: number;
  reducedMotion?: boolean;
}

export const LiquidSculptureHero: React.FC<LiquidSculptureHeroProps> = ({
  height = 220,
  theme = 'light',
  particleDensity = 0.25,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldReduceMotion = reducedMotion || mediaQuery.matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setHasWebGL(false);
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let h = (canvas.height = typeof height === 'number' ? height : parseInt(height as string, 10) || 220);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      h = canvas.height = typeof height === 'number' ? height : parseInt(height as string, 10) || 220;
    };
    window.addEventListener('resize', handleResize);

    // Liquid particle simulation
    const particleCount = Math.floor(width * particleDensity);
    const particles: Array<{
      x: number;
      y: number;
      baseY: number;
      speed: number;
      radius: number;
      phase: number;
      color: string;
    }> = [];

    const isLight = theme === 'light';
    const bluePalette = isLight
      ? ['rgba(29, 78, 216, 0.65)', 'rgba(37, 99, 235, 0.5)', 'rgba(96, 165, 250, 0.45)', 'rgba(216, 233, 255, 0.8)']
      : ['rgba(45, 212, 191, 0.7)', 'rgba(56, 189, 248, 0.5)', 'rgba(129, 140, 248, 0.45)', 'rgba(15, 23, 42, 0.8)'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: h * 0.45 + (Math.random() - 0.5) * 50,
        baseY: h * 0.5 + (Math.random() - 0.5) * 40,
        speed: 0.008 + Math.random() * 0.015,
        radius: 2 + Math.random() * 4.5,
        phase: Math.random() * Math.PI * 2,
        color: bluePalette[Math.floor(Math.random() * bluePalette.length)],
      });
    }

    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, h);

      // Subtle gradient background
      const bgGrad = ctx.createRadialGradient(width / 2, h / 2, 10, width / 2, h / 2, width * 0.7);
      if (isLight) {
        bgGrad.addColorStop(0, 'rgba(216, 233, 255, 0.6)');
        bgGrad.addColorStop(0.6, 'rgba(240, 246, 255, 0.2)');
        bgGrad.addColorStop(1, 'rgba(246, 249, 255, 0)');
      } else {
        bgGrad.addColorStop(0, 'rgba(45, 212, 191, 0.15)');
        bgGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.3)');
        bgGrad.addColorStop(1, 'rgba(7, 11, 18, 0)');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, h);

      // Draw fluid waves
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const waveOffset = w * 1.3;
        const waveAmp = 18 - w * 4;
        const waveFreq = 0.008 + w * 0.003;
        const baseline = h * 0.52 + (w - 1) * 14;

        ctx.moveTo(0, baseline);
        for (let x = 0; x <= width; x += 6) {
          const y = baseline + Math.sin(x * waveFreq + t + waveOffset) * waveAmp + Math.cos(x * 0.004 + t * 0.7) * (waveAmp * 0.6);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, 0, width, h);
        if (isLight) {
          waveGrad.addColorStop(0, w === 0 ? 'rgba(29, 78, 216, 0.12)' : 'rgba(37, 99, 235, 0.08)');
          waveGrad.addColorStop(1, 'rgba(216, 233, 255, 0.25)');
        } else {
          waveGrad.addColorStop(0, w === 0 ? 'rgba(45, 212, 191, 0.15)' : 'rgba(56, 189, 248, 0.08)');
          waveGrad.addColorStop(1, 'rgba(15, 23, 42, 0.3)');
        }
        ctx.fillStyle = waveGrad;
        ctx.fill();
      }

      // Draw connecting fluid lines between close particles
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 46) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isLight
              ? `rgba(29, 78, 216, ${0.25 * (1 - dist / 46)})`
              : `rgba(45, 212, 191, ${0.3 * (1 - dist / 46)})`;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        if (!shouldReduceMotion) {
          p.phase += p.speed;
          p.y = p.baseY + Math.sin(p.phase + t) * 16 + Math.cos(p.phase * 0.7) * 8;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Draw Central Liquid Orb Glow
      const orbX = width * 0.5;
      const orbY = h * 0.48 + (shouldReduceMotion ? 0 : Math.sin(t * 1.2) * 8);
      const orbGrad = ctx.createRadialGradient(orbX, orbY, 4, orbX, orbY, 52);
      orbGrad.addColorStop(0, isLight ? 'rgba(29, 78, 216, 0.4)' : 'rgba(45, 212, 191, 0.55)');
      orbGrad.addColorStop(0.5, isLight ? 'rgba(96, 165, 250, 0.2)' : 'rgba(56, 189, 248, 0.2)');
      orbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 52, 0, Math.PI * 2);
      ctx.fill();

      if (!shouldReduceMotion) {
        t += 0.02;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [height, theme, particleDensity, reducedMotion]);

  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl select-none pointer-events-none transition-all duration-300"
      style={{ height: heightStyle }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ height: heightStyle }}
      />

      {/* Decorative Brand Watermark / Emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`text-center px-4 py-2 rounded-2xl backdrop-blur-[2px] ${
          theme === 'light'
            ? 'bg-white/40 border border-blue-200/50 text-[#14243A]'
            : 'bg-[#070b12]/40 border border-teal-500/20 text-white'
        }`}>
          <div className="text-[11px] font-mono tracking-widest uppercase opacity-75 font-semibold">
            CRD Project • Liquid Sculpture
          </div>
          <div className="text-xs font-semibold mt-0.5">
            NexusLedger Dual-Key Workspace
          </div>
        </div>
      </div>
    </div>
  );
};
