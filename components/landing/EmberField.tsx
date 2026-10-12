'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
  ember: boolean;
  phase: number;
};

/**
 * Gloeiende vonken die opstijgen en grijze as die neerdwarrelt.
 * Licht: één canvas, DPR max 1.5, pauzeert buiten beeld en bij verborgen tab,
 * staat stil bij prefers-reduced-motion. `tint` kleurt de vonken (per smaak).
 */
export function EmberField({ density = 1, tint = '#F0A35C', className = '' }: { density?: number; tint?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const tintRef = useRef(tint);
  tintRef.current = tint;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const spawn = (initial: boolean): Particle => {
      const ember = Math.random() < 0.62;
      const max = ember ? 220 + Math.random() * 260 : 380 + Math.random() * 420;
      return {
        x: Math.random() * w,
        y: ember ? (initial ? Math.random() * h : h + 10) : initial ? Math.random() * h : -10,
        vx: (Math.random() - 0.5) * 0.25,
        vy: ember ? -(0.35 + Math.random() * 0.9) : 0.12 + Math.random() * 0.3,
        r: ember ? 0.5 + Math.random() * 1.3 : 0.8 + Math.random() * 1.8,
        life: initial ? Math.random() * max : 0,
        max,
        ember,
        phase: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, Math.max(36, (w * h) / 14000)) * density);
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const color = tintRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;
        p.phase += 0.02;
        p.x += p.vx + Math.sin(p.phase + t * 0.0004) * (p.ember ? 0.35 : 0.2);
        p.y += p.vy;
        const k = p.life / p.max;
        if (k >= 1 || p.y < -20 || p.y > h + 20) {
          particles[i] = spawn(false);
          continue;
        }
        const fade = Math.sin(Math.PI * k);
        if (p.ember) {
          const flick = 0.65 + 0.35 * Math.sin(p.phase * 6);
          ctx.globalAlpha = fade * flick;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
          g.addColorStop(0, '#FFF1D6');
          g.addColorStop(0.18, '#FFD9A0');
          g.addColorStop(0.4, color);
          g.addColorStop(1, 'rgba(226,98,43,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = fade * 0.35;
          ctx.fillStyle = '#B9B0A6';
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.phase, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'lighter';
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) {
        draw(0);
        return;
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    resize();
    start();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(canvas);
    const onVis = () => start();
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
