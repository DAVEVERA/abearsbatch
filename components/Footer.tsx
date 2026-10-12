import Image from 'next/image';
import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/i18n';
import { LangSwitch } from './LangSwitch';

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const f = t.footer;
  const cols = [
    {
      title: f.shop,
      links: [
        [f.allFlavors, `/${locale}/shop`],
        [f.tastingSet, `/${locale}/proefset`],
        [f.giftcard, `/${locale}/cadeaubon`],
        [f.business, `/${locale}/zakelijk`],
      ],
    },
    {
      title: f.service,
      links: [
        [f.shipping, `/${locale}/verzenden`],
        [f.returns, `/${locale}/retourneren`],
        [f.contact, `/${locale}/contact`],
        [f.faq, `/${locale}/faq`],
      ],
    },
    {
      title: f.brand,
      links: [
        [t.nav.story, `/${locale}/verhaal`],
        [t.nav.trade, `/${locale}/horeca`],
        [t.nav.stockists, `/${locale}/verkooppunten`],
      ],
    },
  ] as const;

  // Verloop in plaats van een vlakke kleur: bovenaan exact de paginakleur, zodat er op
  // de landingspagina geen zichtbare stap zit, en naar onderen toe dieper wordend.
  return (
    <footer className="bg-gradient-to-b from-char to-night text-sm text-[#E8DCC8]">
      {/*
        Merkblok en menukolommen gescheiden in plaats van vier gelijke cellen: de
        lockup is hoger dan een kolomkop, waardoor hij in een 4-koloms raster de hele
        rij uit balans trok. Nu krijgt het logo eigen ruimte links en staan de drie
        menu's als groep rechts.
      */}
      <div className="container-site grid gap-12 py-14 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-20">
        <div className="flex flex-col items-start gap-5">
          <Image
            src="/images/merk/logo-lockup.webp"
            alt="A Bear's Batch"
            width={781}
            height={640}
            sizes="(max-width: 1024px) 190px, 230px"
            className="h-[146px] w-auto lg:h-[172px]"
          />
          <span className="max-w-[30ch] leading-relaxed">{f.tagline}</span>
        </div>
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {cols.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-2.5">
              <strong className="text-cream">{col.title}</strong>
              {col.links.map(([label, href]) => (
                <Link key={href} href={href} className="text-[#E8DCC8] no-underline hover:text-cream hover:underline">
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>
      <div className="container-site flex flex-wrap items-center justify-between gap-4 py-6">
        <span className="inline-flex items-center gap-2.5">
          <span className="rounded-md border-[1.5px] border-[#E8DCC8] px-2 font-bold">18+</span>
          {f.nix18}
        </span>
        <span>{f.payments}</span>
        <span className="flex items-center gap-2">
          <span className="[&_a]:text-[#E8DCC8]">
            <LangSwitch locale={locale} label={t.langSwitch} />
          </span>
          © {new Date().getFullYear()} A Bear&apos;s Batch · {f.legal}
        </span>
      </div>
    </footer>
  );
}
