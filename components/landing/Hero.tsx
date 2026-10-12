'use client';

import Image from 'next/image';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { LandingCopy } from '@/lib/landing-copy';
import { EmberField } from './EmberField';

export function Hero({ copy, bottle }: { copy: LandingCopy['hero']; bottle: { src: string; width: number; height: number } }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Scroll-parallax: tekst zakt weg, fles stijgt en komt naar voren.
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const bottleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -160]);
  const bottleScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);

  // Pointer-tilt (alleen fijne pointer): fles draait mee met de muis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-1, 1], [-10, 10]), { stiffness: 90, damping: 18 });
  const rotX = useSpring(useTransform(py, [-1, 1], [6, -6]), { stiffness: 90, damping: 18 });

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="grain relative isolate flex min-h-[calc(100svh-96px)] flex-col overflow-hidden bg-char text-bone"
    >
      {/* Vuurgloed en rook */}
      <motion.div aria-hidden="true" style={{ opacity: glowOpacity }} className="absolute inset-0 -z-10">
        <div className="anim-flicker absolute -bottom-[30%] left-1/2 h-[80vh] w-[140vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(226,98,43,0.55),rgba(160,52,18,0.25)_45%,transparent)] lg:left-[68%] lg:w-[90vw]" />
        <div className="anim-drift absolute bottom-[10%] left-[10%] h-[50vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(168,159,148,0.10),transparent)] blur-2xl" />
        <div className="anim-drift absolute bottom-[30%] right-0 h-[40vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(168,159,148,0.08),transparent)] blur-2xl [animation-delay:-7s]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-char to-transparent" />
      </motion.div>
      <EmberField className="-z-10" />

      <div className="container-site relative flex flex-1 flex-col pb-10 pt-12 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-8">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 flex flex-col gap-5">
          <span className="anim-rise text-[12px] font-semibold uppercase tracking-[0.28em] text-amber [animation-delay:0.1s]">{copy.eyebrow}</span>
          <h1 className="font-display text-[clamp(64px,19vw,168px)] font-semibold leading-[0.86] tracking-[-0.03em]">
            {copy.lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span className="anim-rise block" style={{ animationDelay: `${0.18 + i * 0.12}s` }}>
                  {i === copy.lines.length - 1 ? <em className="font-normal italic text-amber">{line}</em> : line}
                </span>
              </span>
            ))}
          </h1>
          <p className="anim-rise max-w-[30ch] text-[17px] leading-relaxed text-bone/75 [animation-delay:0.6s] sm:text-lg">{copy.body}</p>
          <div className="anim-rise mt-2 [animation-delay:0.75s]">
            <a
              href="#collectie"
              className="group inline-flex min-h-[56px] items-center gap-3 rounded-full bg-bone px-7 text-[16px] font-semibold text-char no-underline transition-[background-color,transform] duration-300 ease-out hover:bg-amber hover:text-char active:scale-[0.97]"
            >
              {copy.cta}
              <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
          </div>
        </motion.div>

        {/* Fles: mobiel onder de kop, desktop rechts */}
        <div className="pointer-events-none relative -mt-6 flex flex-1 items-end justify-center [perspective:1200px] lg:mt-0 lg:items-center">
          <motion.div style={{ y: bottleY, scale: bottleScale, rotateY: rotY, rotateX: rotX }} className="relative">
            <div className="anim-bottle relative">
              <Image
                src={bottle.src}
                alt={copy.bottleAlt}
                width={bottle.width}
                height={bottle.height}
                priority
                sizes="(max-width: 1024px) 50vw, 360px"
                className="h-[min(46svh,420px)] w-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.75)] lg:h-[min(68vh,640px)]"
              />
              {/* Lichtstreep over het glas, alleen binnen de vorm van de fles */}
              <span
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden"
                style={{ WebkitMaskImage: `url(${bottle.src})`, maskImage: `url(${bottle.src})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' }}
              >
                <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent motion-safe:animate-[sheen_6s_ease-in-out_1.6s_infinite]" />
              </span>
              {/* Gloed onder de fles */}
              <span aria-hidden="true" className="anim-flicker absolute -bottom-6 left-1/2 h-10 w-[90%] -translate-x-1/2 rounded-[50%] bg-ember/50 blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/50 sm:flex">
        {copy.scroll}
        <span className="block h-10 w-px overflow-hidden bg-bone/15">
          <span className="anim-cue block h-full w-full bg-bone/70" />
        </span>
      </div>
    </section>
  );
}
