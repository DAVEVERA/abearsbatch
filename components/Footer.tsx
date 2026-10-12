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

  return (
    <footer className="bg-night text-sm text-[#E8DCC8]">
      <div className="container-site grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2.5">
          <span className="font-display text-xl font-bold tracking-[0.06em] text-cream">A BEAR&apos;S BATCH</span>
          <span>{f.tagline}</span>
        </div>
        {cols.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-2">
            <strong className="text-cream">{col.title}</strong>
            {col.links.map(([label, href]) => (
              <Link key={href} href={href} className="text-[#E8DCC8] no-underline hover:text-cream hover:underline">
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="container-site flex flex-wrap items-center justify-between gap-4 border-t border-[#E8DCC8]/20 py-6">
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
