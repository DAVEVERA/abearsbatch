import Image from 'next/image';
import Link from 'next/link';
import type { LandingCopy } from '@/lib/landing-copy';

/** Proefset: een eindeloze rij flessen die langzaam voorbij drijft. */
export function TastingBand({
  copy,
  bottles,
  href,
  priceLabel,
}: {
  copy: LandingCopy['tasting'];
  bottles: { slug: string; src: string; width: number; height: number }[];
  href: string;
  priceLabel: string;
}) {
  const row = [...bottles, ...bottles];
  return (
    <section className="relative overflow-hidden py-20 text-bone sm:py-28">
      <div className="container-site flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-[clamp(40px,9vw,80px)] font-semibold leading-[0.95] tracking-[-0.02em]">{copy.title}</h2>
          <p className="mt-4 max-w-[36ch] text-lg text-bone/80">{copy.body}</p>
        </div>
        <Link href={href} className="btn-on-dark self-start sm:self-auto">
          {copy.cta} · {priceLabel}
        </Link>
      </div>
      <div aria-hidden="true" className="group mt-14 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="anim-marquee flex w-max items-end gap-10 group-hover:[animation-play-state:paused] sm:gap-16">
          {row.map((b, i) => (
            <li key={`${b.slug}-${i}`} className="w-[96px] flex-none sm:w-[130px]">
              <Image src={b.src} alt="" width={b.width} height={b.height} sizes="130px" className="h-auto w-full drop-shadow-[0_20px_24px_rgba(0,0,0,0.45)]" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
