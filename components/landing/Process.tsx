'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import type { LandingCopy } from '@/lib/landing-copy';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Vier stappen langs een lont die opbrandt terwijl je scrolt. */
export function Process({ copy }: { copy: LandingCopy['process'] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] });
  const fuse = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section className="grain relative bg-soot py-24 text-bone sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <span className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber">{copy.eyebrow}</span>
          <h2 className="mt-4 max-w-[14ch] font-display text-[clamp(38px,8vw,72px)] font-semibold leading-[0.98] tracking-[-0.02em]">{copy.title}</h2>
        </div>

        <ol ref={ref} className="relative flex flex-col gap-14 pl-10 sm:gap-20 sm:pl-14">
          {/* Lont */}
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-bone/15 sm:left-[11px]" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : fuse }}
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-amber via-ember to-ember shadow-[0_0_12px_2px_rgba(226,98,43,0.6)] sm:left-[11px]"
          />
          {copy.steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative"
            >
              <span aria-hidden="true" className="absolute -left-10 top-3 flex h-4 w-4 items-center justify-center sm:-left-14 sm:h-6 sm:w-6">
                <span className="h-2.5 w-2.5 rounded-full bg-ember shadow-[0_0_14px_4px_rgba(226,98,43,0.55)] sm:h-3 sm:w-3" />
              </span>
              <span aria-hidden="true" className="text-outline block font-display text-[88px] font-semibold leading-[0.8] sm:text-[120px]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{step.title}</h3>
              <p className="mt-3 max-w-[38ch] text-[16px] leading-relaxed text-bone/65 sm:text-lg">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
