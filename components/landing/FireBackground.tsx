'use client';

import { useEffect, useRef } from 'react';
import {
  ASH,
  EMBER,
  alphaOf,
  defaultConfig,
  isDead,
  spawn,
  stepParticle,
  type FieldConfig,
  type Particle,
  type SpawnArea,
} from '@/lib/fire-field';

/**
 * Vonken en as die opdwarrelen vanuit een vuurbron onder het beeld. Het vuur zelf
 * tekenen we niet; alleen wat eruit opstijgt.
 *
 * Eén vast canvas achter de hele landingspagina, dus één RAF-loop voor de pagina.
 * De natuurkunde zit in `lib/fire-field`; hier staat alleen het tekenwerk.
 *
 * Licht gehouden door:
 * - voorgerenderde sprites in plaats van een gradiënt per deeltje per frame;
 * - vonken en as in twee blokken tekenen, zodat de compositing-stand niet per
 *   deeltje wisselt;
 * - DPR afgetopt, aantal deeltjes geschaald op schermoppervlak;
 * - stilleggen zodra het tabblad verborgen is.
 */

/**
 * Kleurverloop van een afkoelende vonk: heel kort wit-heet, daarna vooral oranje en
 * dieprood. Blijft het wit te lang hangen, dan lezen de deeltjes als sterren.
 */
const HEAT: Array<[number, string]> = [
  [0, '#FFF0D6'],
  [0.08, '#FFC678'],
  [0.3, '#F09646'],
  [0.55, '#E25822'],
  [0.8, '#9E2E14'],
  [1, '#4E180C'],
];

const SPRITE_STEPS = 6;
const SPRITE_PX = 32;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Kleur op positie k van het verloop. */
function heatColor(k: number, tint: [number, number, number]): [number, number, number] {
  let i = 0;
  while (i < HEAT.length - 2 && k > HEAT[i + 1][0]) i++;
  const [k0, c0] = HEAT[i];
  const [k1, c1] = HEAT[i + 1];
  const f = k1 === k0 ? 0 : (k - k0) / (k1 - k0);
  const a = hexToRgb(c0);
  const b = hexToRgb(c1);
  const out: [number, number, number] = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  // Het merkaccent kleurt het midden van het verloop mee, de uitersten blijven staan.
  const pull = Math.sin(Math.PI * Math.min(1, Math.max(0, k))) * 0.45;
  return [out[0] + (tint[0] - out[0]) * pull, out[1] + (tint[1] - out[1]) * pull, out[2] + (tint[2] - out[2]) * pull];
}

function emberSprite(rgb: [number, number, number]): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = SPRITE_PX;
  const g = c.getContext('2d');
  if (!g) return c;
  const m = SPRITE_PX / 2;
  const grad = g.createRadialGradient(m, m, 0, m, m, m);
  const [r, gr, b] = rgb.map(Math.round);
  // Kleine lichte kern, daarna meteen de gloedkleur: een vonk is oranje, geen ster.
  grad.addColorStop(0, `rgba(${Math.min(255, r + 60)},${Math.min(255, gr + 45)},${Math.min(255, b + 30)},0.95)`);
  grad.addColorStop(0.18, `rgba(${r},${gr},${b},0.85)`);
  grad.addColorStop(0.5, `rgba(${r},${gr},${b},0.26)`);
  grad.addColorStop(1, `rgba(${r},${gr},${b},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, SPRITE_PX, SPRITE_PX);
  return c;
}

function ashSprite(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = SPRITE_PX;
  const g = c.getContext('2d');
  if (!g) return c;
  const m = SPRITE_PX / 2;
  const grad = g.createRadialGradient(m, m, 0, m, m, m);
  grad.addColorStop(0, 'rgba(192,184,174,0.85)');
  grad.addColorStop(0.5, 'rgba(160,152,142,0.35)');
  grad.addColorStop(1, 'rgba(140,132,124,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, SPRITE_PX, SPRITE_PX);
  return c;
}

export type FireBackgroundProps = {
  /** Schaalt het aantal deeltjes. */
  density?: number;
  /** Merkaccent in het hart van het kleurverloop. */
  tint?: string;
  /** Horizontaal midden van de bron, 0..1 van de breedte. */
  sourceX?: number;
  /** Breedte van de bron, 0..1. */
  sourceSpread?: number;
  className?: string;
};

export function FireBackground({
  density = 1,
  tint = '#F0A35C',
  sourceX = 0.5,
  sourceSpread = 0.5,
  className = '',
}: FireBackgroundProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const opts = useRef({ density, tint, sourceX, sourceSpread });
  opts.current = { density, tint, sourceX, sourceSpread };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let soft = motionQuery.matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let particles: Particle[] = [];
    // Telefoons hebben vaak DPR 3; dat vierdubbelt het aantal pixels per frame voor
    // deeltjes die toch wazig zijn. Op smalle schermen dus strakker aftoppen.
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1.25 : 1.5);

    const tintRgb = hexToRgb(opts.current.tint);
    const embers = Array.from({ length: SPRITE_STEPS }, (_, i) => emberSprite(heatColor(i / (SPRITE_STEPS - 1), tintRgb)));
    const ash = ashSprite();

    const area: SpawnArea = { cx: opts.current.sourceX, spread: opts.current.sourceSpread, width: 0, height: 0 };

    /**
     * Bij reduced motion niet bevriezen maar temperen: trager veld, geen windvlagen,
     * minder lift en minder deeltjes. Rustig, maar niet dood.
     */
    const configFor = (reduced: boolean): FieldConfig =>
      reduced
        ? { ...defaultConfig, flow: defaultConfig.flow * 0.4, timeScale: defaultConfig.timeScale * 0.35, gustAmp: 0, buoyancy: defaultConfig.buoyancy * 0.4 }
        : defaultConfig;

    let cfg = configFor(soft);
    let timeScale = soft ? 0.55 : 1;

    const targetCount = () => {
      const base = Math.min(190, Math.max(40, (w * h) / 9000));
      return Math.round(base * opts.current.density * (soft ? 0.55 : 1));
    };

    /**
     * Het canvas staat fixed over de viewport, dus meten we de viewport zelf.
     * getBoundingClientRect() is hier onbetrouwbaar: een verborgen tabblad doet geen
     * layout en geeft dan nul terug, waarna het canvas op 1x1 blijft staan.
     */
    const resize = () => {
      const nw = Math.max(1, window.innerWidth);
      const nh = Math.max(1, window.innerHeight);
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      area.width = w;
      area.height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: targetCount() }, () => spawn(area, true));
    };

    const frame = (now: number) => {
      // dt in seconden, afgetopt zodat een haperend of teruggekeerd tabblad
      // geen sprong van meters maakt.
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60) * timeScale;
      last = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, w, h);

      // Vonken: additief, zodat overlappende gloed oplicht.
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        stepParticle(p, cfg, t, dt);
        if (isDead(p, w, h)) {
          particles[i] = spawn(area, false);
          continue;
        }
        if (p.kind !== EMBER) continue;
        const k = p.life / p.max;
        // Flikkeren: een vonk brandt niet gelijkmatig.
        const flick = soft ? 1 : 0.72 + 0.28 * Math.sin(p.phase + t * 7.5);
        ctx.globalAlpha = alphaOf(p) * flick;
        const sprite = embers[Math.min(SPRITE_STEPS - 1, (k * SPRITE_STEPS) | 0)];
        const r = p.size * 5.5;

        // Uitrekken langs de bewegingsrichting: snelle vonken worden streepjes,
        // trage blijven rond. Dat verschil in vorm maakt de snelheid zichtbaar.
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 60) {
          const stretch = 1 + Math.min(2.4, sp / 170);
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.atan2(p.vy, p.vx));
          ctx.drawImage(sprite, -r * stretch, -r, r * 2 * stretch, r * 2);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        } else {
          ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
        }
      }

      // As: gewoon over elkaar, geen gloed.
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.kind !== ASH) continue;
        ctx.globalAlpha = alphaOf(p) * 0.42;
        const r = p.size * 2.4;
        ctx.drawImage(ash, p.x - r, p.y - r * 0.72, r * 2, r * 1.44);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = 0;
      // Een verborgen tabblad krijgt geen frames; bij terugkomst meten we opnieuw,
      // want de layout kan intussen veranderd zijn.
      if (document.hidden) return;
      resize();
      raf = requestAnimationFrame(frame);
    };

    const onMotionChange = () => {
      soft = motionQuery.matches;
      cfg = configFor(soft);
      timeScale = soft ? 0.55 : 1;
      resize();
      start();
    };

    resize();
    start();

    const onResize = () => resize();
    const onVis = () => start();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    document.addEventListener('visibilitychange', onVis);
    motionQuery.addEventListener('change', onMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      document.removeEventListener('visibilitychange', onVis);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none fixed inset-0 h-full w-full ${className}`} />;
}
