import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary, isLocale, locales } from '@/lib/i18n';

/** Pagina's die nog uitgebouwd worden (fase 2). Niet indexeren tot ze af zijn. */
const pending: Record<string, { nl: string; en: string }> = {
  proefset: { nl: 'Proefset & cadeaus', en: 'Tasting set & gifts' },
  cadeaubon: { nl: 'Cadeaubon', en: 'Gift card' },
  smaakquiz: { nl: 'Smaakquiz', en: 'Flavour quiz' },
  verhaal: { nl: 'Het verhaal', en: 'Our story' },
  horeca: { nl: 'Horeca', en: 'Trade' },
  verkooppunten: { nl: 'Waar te koop', en: 'Stockists' },
  winkelwagen: { nl: 'Winkelwagen', en: 'Cart' },
  account: { nl: 'Account', en: 'Account' },
  zakelijk: { nl: 'Zakelijke geschenken', en: 'Corporate gifts' },
  verzenden: { nl: 'Verzenden & leeftijdscheck', en: 'Shipping & age check' },
  retourneren: { nl: 'Retourneren', en: 'Returns' },
  contact: { nl: 'Contact', en: 'Contact' },
  faq: { nl: 'Veelgestelde vragen', en: 'FAQ' },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => Object.keys(pending).map((page) => ({ locale, page })));
}

export function generateMetadata({ params }: { params: { locale: string; page: string } }): Metadata {
  const p = pending[params.page];
  if (!p || !isLocale(params.locale)) return {};
  return { title: p[params.locale], robots: { index: false, follow: true } };
}

export default function PendingPage({ params }: { params: { locale: string; page: string } }) {
  const p = pending[params.page];
  if (!p || !isLocale(params.locale)) notFound();
  const t = getDictionary(params.locale);
  return (
    <div className="container-site flex min-h-[50vh] flex-col items-start justify-center gap-5 py-20">
      <span className="eyebrow">{params.locale === 'nl' ? 'Binnenkort' : 'Coming soon'}</span>
      <h1 className="font-display text-5xl font-semibold">{p[params.locale]}</h1>
      <p className="max-w-lg text-bark">
        {params.locale === 'nl' ? 'Deze pagina wordt op dit moment gebouwd.' : 'This page is being built right now.'}
      </p>
      <Link href={`/${params.locale}/shop`} className="btn-primary">
        {t.hero.cta}
      </Link>
    </div>
  );
}
