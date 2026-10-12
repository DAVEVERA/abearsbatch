'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Character } from '@/lib/flavors';
import type { LandingCopy } from '@/lib/landing-copy';

export type SliderFlavor = {
  slug: string;
  name: string;
  character: Character;
  tagline: string;
  description: string;
  href: string;
  cutout: { src: string; width: number; height: number };
  glow: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: 'spring', stiffness: 160, damping: 24, mass: 0.9 } as const;

/* ---------- Eén fles op de bühne ---------- */
function Bottle({
  f,
  index,
  progress,
  spacing,
  active,
  onSelect,
}: {
  f: SliderFlavor;
  index: number;
  progress: MotionValue<number>;
  spacing: number;
  active: boolean;
  onSelect: (i: number) => void;
}) {
  const d = useTransform(progress, (p) => index - p);
  const x = useTransform(d, (v) => v * spacing);
  const scale = useTransform(d, (v) => 1 - Math.min(Math.abs(v), 2.2) * 0.2);
  const rotateY = useTransform(d, (v) => Math.max(-1.6, Math.min(1.6, v)) * -24);
  const y = useTransform(d, (v) => Math.min(Math.abs(v), 2) * 18);
  const opacity = useTransform(d, (v) => Math.max(0, 1 - Math.max(0, Math.abs(v) - 0.25) * 0.55));
  const zIndex = useTransform(d, (v) => 100 - Math.round(Math.abs(v) * 10));
  const shade = useTransform(d, (v) => Math.min(Math.abs(v), 1) * 0.6);

  return (
    <motion.div
      style={{ x, y, scale, rotateY, opacity, zIndex }}
      className="absolute bottom-[14%] left-1/2 -ml-[var(--bw-half)] w-[var(--bw)] will-change-transform"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => onSelect(index)}
        className={`relative block w-full ${active ? 'cursor-grab' : 'cursor-pointer'}`}
      >
        <span className={`block ${active ? 'motion-safe:animate-[float_6s_ease-in-out_infinite]' : ''}`}>
          <Image
            src={f.cutout.src}
            alt=""
            width={f.cutout.width}
            height={f.cutout.height}
            draggable={false}
            sizes="(max-width: 640px) 45vw, 300px"
            className="pointer-events-none h-auto w-full select-none drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)]"
          />
          {/* Donker voor niet-actieve flessen (goedkoper dan een CSS-filter) */}
          <motion.span
            aria-hidden="true"
            style={{
              opacity: shade,
              WebkitMaskImage: `url(${f.cutout.src})`,
              maskImage: `url(${f.cutout.src})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
            }}
            className="absolute inset-0 bg-char"
          />
          {/* Lichtstreep, alleen op de actieve fles */}
          {active && (
            <span
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden"
              style={{ WebkitMaskImage: `url(${f.cutout.src})`, maskImage: `url(${f.cutout.src})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' }}
            >
              <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent motion-safe:animate-[sheen_5s_ease-in-out_0.4s_infinite]" />
            </span>
          )}
        </span>
        {/* Reflectie op de vloer */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-full block w-full origin-top -scale-y-100 opacity-25 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.6),transparent_45%)]"
        >
          <Image src={f.cutout.src} alt="" width={f.cutout.width} height={f.cutout.height} sizes="(max-width: 640px) 45vw, 300px" className="h-auto w-full" />
        </span>
      </button>
    </motion.div>
  );
}

/* ---------- Grote naam op de achtergrond (beweegt trager: diepte) ---------- */
function BackName({ name, index, progress, spacing }: { name: string; index: number; progress: MotionValue<number>; spacing: number }) {
  const x = useTransform(progress, (p) => (index - p) * spacing * 0.6);
  const opacity = useTransform(progress, (p) => Math.max(0, 1 - Math.abs(index - p) * 1.1));
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[6%] flex justify-center">
      <motion.span
        style={{ x, opacity }}
        className="text-outline whitespace-nowrap font-display text-[clamp(110px,32vw,320px)] font-semibold italic leading-none tracking-[-0.04em]"
      >
        {name}
      </motion.span>
    </div>
  );
}

export function FlavorSlider({
  flavors,
  copy,
  characterLabels,
  volume,
}: {
  flavors: SliderFlavor[];
  copy: LandingCopy['slider'];
  characterLabels: Record<Character, string>;
  volume: string;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [spacing, setSpacing] = useState(220);
  const progress = useMotionValue(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; t: number; start: number; moved: boolean; lastX: number; lastT: number } | null>(null);
  const count = flavors.length;
  const current = flavors[active];

  // Afstand tussen flessen schaalt mee met de bühne (mobile first).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      const bh = Math.round(Math.min(h * 0.66, 540));
      const bw = Math.round(bh * 0.54);
      setSpacing(Math.round(Math.max(bw * 1.15, Math.min(w * 0.55, 420))));
      el.style.setProperty('--bw', `${bw}px`);
      el.style.setProperty('--bw-half', `${Math.round(bw / 2)}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(count - 1, i));
      setDir(next >= active ? 1 : -1);
      setActive(next);
      if (reduce) progress.set(next);
      else animate(progress, next, SPRING);
    },
    [active, count, progress, reduce],
  );

  // Houd `active` gelijk aan de dichtstbijzijnde fles tijdens het slepen (voor de gloedkleur).
  const [glowIndex, setGlowIndex] = useState(0);
  useMotionValueEvent(progress, 'change', (v) => {
    const r = Math.max(0, Math.min(count - 1, Math.round(v)));
    if (r !== glowIndex) setGlowIndex(r);
  });

  /* ---- Slepen / swipen (horizontaal; verticaal scrollen blijft werken) ---- */
  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, t: performance.now(), start: progress.get(), moved: false, lastX: e.clientX, lastT: performance.now() };
  }
  function onPointerMove(e: React.PointerEvent) {
    const s = drag.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (!s.moved && Math.abs(dx) > 6) {
      s.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (!s.moved) return;
    let next = s.start - dx / spacing;
    // Rubberband aan de randen
    if (next < 0) next = next * 0.35;
    if (next > count - 1) next = count - 1 + (next - (count - 1)) * 0.35;
    progress.set(next);
    s.lastX = e.clientX;
    s.lastT = performance.now();
  }
  function onPointerUp(e: React.PointerEvent) {
    const s = drag.current;
    drag.current = null;
    if (!s || !s.moved) return;
    const dt = Math.max(1, performance.now() - s.t);
    const velocity = (e.clientX - s.x) / dt; // px per ms
    const projected = progress.get() - velocity * 0.35 * (300 / spacing);
    goTo(Math.round(projected));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(active - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(count - 1);
    }
  }

  const glow = flavors[glowIndex].glow;

  return (
    <section
      id="collectie"
      aria-roledescription={copy.roledescription}
      aria-label={copy.title}
      className="relative isolate scroll-mt-16 overflow-hidden pb-16 pt-20 text-bone sm:pt-28"
    >
      {/* Kleur van de vloeistof als gloed */}
      <motion.div
        aria-hidden="true"
        animate={{ backgroundColor: glow }}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute left-1/2 top-[18%] -z-10 h-[64%] w-[120vw] -translate-x-1/2 rounded-[50%] opacity-[0.28] blur-[90px] sm:w-[80vw]"
      />

      <div className="container-site">
        <h2 className="max-w-[16ch] font-display text-[clamp(40px,9vw,80px)] font-semibold leading-[0.95] tracking-[-0.02em]">{copy.title}</h2>
      </div>

      {/* Bühne */}
      <div
        ref={stageRef}
        role="group"
        tabIndex={0}
        aria-label={`${current.name}, ${active + 1} ${copy.of} ${count}`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative mt-4 h-[min(60svh,600px)] min-h-[420px] touch-pan-y select-none outline-none [perspective:1400px] focus-visible:ring-2 focus-visible:ring-amber/60 sm:mt-8"
      >
        {flavors.map((f, i) => (
          <BackName key={`n-${f.slug}`} name={f.name} index={i} progress={progress} spacing={spacing} />
        ))}
        {/* Vloer */}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-[14%] h-px bg-gradient-to-r from-transparent via-bone/25 to-transparent" />
        <span aria-hidden="true" className="absolute bottom-[10%] left-1/2 h-16 w-[70%] max-w-[520px] -translate-x-1/2 rounded-[50%] bg-ember/25 blur-3xl" />
        {flavors.map((f, i) => (
          <Bottle key={f.slug} f={f} index={i} progress={progress} spacing={spacing} active={i === active} onSelect={goTo} />
        ))}
      </div>

      {/* Info + bediening */}
      <div className="container-site mt-2 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div aria-live="polite" className="min-h-[220px] sm:min-h-[200px]">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={current.slug}
              custom={dir}
              initial={reduce ? false : { opacity: 0, x: 24 * dir }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 * dir, transition: { duration: 0.2 } }}
              className="flex max-w-xl flex-col gap-3"
            >
              <h3 className="font-display text-[clamp(44px,11vw,72px)] font-semibold leading-none tracking-[-0.02em]">
                {current.name.split('').map((ch, i) => (
                  <motion.span
                    key={`${current.slug}-${i}`}
                    className="inline-block"
                    initial={reduce ? false : { opacity: 0, y: '0.4em', filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: 0.04 * i, duration: 0.5, ease: EASE } }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </h3>
              <p className="font-display text-xl italic text-bone/85">{current.tagline}</p>
              <p className="max-w-[46ch] text-[15px] leading-relaxed text-bone/65">{current.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href={current.href} className="btn-on-dark">
                  {copy.view} {current.name}
                </Link>
                <span className="text-[15px] text-bone/70">
                  {characterLabels[current.character]} · {volume}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label={copy.prev}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-bone/25 text-xl transition-colors hover:border-bone hover:bg-bone hover:text-char disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-bone"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === count - 1}
              aria-label={copy.next}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-bone/25 text-xl transition-colors hover:border-bone hover:bg-bone hover:text-char disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-bone"
            >
              →
            </button>
          </div>
          {/* Voortgang: elk segment is een directe sprong */}
          <div className="flex gap-1.5" role="group" aria-label={copy.title}>
            {flavors.map((f, i) => (
              <button
                key={f.slug}
                type="button"
                aria-current={i === active ? 'true' : undefined}
                aria-label={f.name}
                onClick={() => goTo(i)}
                className="group flex h-11 flex-1 items-center sm:w-9 sm:flex-none"
              >
                <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-bone/15">
                  <motion.span
                    className="absolute inset-0 origin-left rounded-full"
                    style={{ backgroundColor: f.glow === '#E6D6B8' ? '#EDE6DA' : '#F0A35C' }}
                    initial={false}
                    animate={{ scaleX: i === active ? 1 : i < active ? 0.35 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
