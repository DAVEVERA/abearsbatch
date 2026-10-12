'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const color = useTransform(progress, [range[0], range[1], Math.min(1, range[1] + 0.12)], ['#EDE6DA', '#F0A35C', '#EDE6DA']);
  return (
    <motion.span style={{ opacity, color }} className="manifesto-word inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

/**
 * Woorden ontbranden één voor één terwijl je scrolt.
 * prefers-reduced-motion gaat via CSS (.manifesto-word in globals.css), niet via een
 * branch in de render: `useReducedMotion()` is tijdens SSR altijd null, dus een branch
 * hier levert andere markup op server en client op en breekt de hydration.
 */
export function Manifesto({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');

  return (
    <section className="relative px-4 py-28 text-bone sm:px-8 sm:py-40">
      <p ref={ref} className="mx-auto max-w-[22ch] font-display text-[clamp(30px,7.4vw,72px)] font-medium leading-[1.12] tracking-[-0.015em] sm:max-w-[24ch]">
        {words.map((w, i) => {
          const start = i / words.length;
          return <Word key={`${w}-${i}`} word={w} progress={scrollYProgress} range={[start, start + 1 / words.length]} />;
        })}
      </p>
    </section>
  );
}
