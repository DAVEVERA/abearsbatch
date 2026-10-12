'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { LandingCopy } from '@/lib/landing-copy';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Maker({ copy, href }: { copy: LandingCopy['maker']; href: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%']);
  const clip = useTransform(scrollYProgress, [0, 0.35], reduce ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] : ['inset(18% 12% 18% 12%)', 'inset(0% 0% 0% 0%)']);

  return (
    <section className="grain relative bg-char py-24 text-bone sm:py-32">
      <div ref={ref} className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.figure style={{ clipPath: clip }} className="relative aspect-[4/5] overflow-hidden rounded-[4px]">
          <motion.div style={{ y: imgY }} className="absolute inset-[-10%_0]">
            <Image src="/images/merk/de-beer.webp" alt={copy.alt} fill sizes="(max-width: 1024px) 92vw, 600px" className="object-cover grayscale contrast-125" />
          </motion.div>
          <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(226,98,43,0.28),transparent_60%)] mix-blend-screen" />
        </motion.figure>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -20% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="flex flex-col gap-6"
        >
          <span className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber">{copy.eyebrow}</span>
          <h2 className="font-display text-[clamp(40px,9vw,80px)] font-semibold leading-[0.95] tracking-[-0.02em]">{copy.title}</h2>
          <p className="max-w-[40ch] text-lg leading-relaxed text-bone/70">{copy.body}</p>
          <Link href={href} className="group inline-flex min-h-[44px] items-center gap-3 self-start font-semibold text-bone no-underline hover:text-amber">
            <span className="relative">
              {copy.cta}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-current transition-transform duration-500 ease-out group-hover:scale-x-0" />
            </span>
            <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
