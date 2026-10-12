import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FlavorGrid } from '@/components/FlavorGrid';
import { ChevronIcon } from '@/components/icons';
import { cardDict, getDictionary, isLocale, type Locale } from '@/lib/i18n';
import { cardFlavors, getPrices } from '@/lib/prices';

export const revalidate = 300;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const t = getDictionary(params.locale);
  return {
    title: t.grid.title,
    description: t.grid.intro,
    alternates: { canonical: `/${params.locale}/shop`, languages: { nl: '/nl/shop', en: '/en/shop' } },
  };
}

export default async function ShopPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const t = getDictionary(locale);
  const prices = await getPrices(locale);

  return (
    <div className="container-site pb-24 pt-10">
      <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{t.grid.title}</h1>
      <p className="mt-3 max-w-[560px] text-bark">{t.grid.intro}</p>

      {/* Bundels bovenaan */}
      <div className="my-8 grid gap-4 md:grid-cols-2">
        <Link href={`/${locale}/proefset`} className="flex items-center gap-4 rounded-2xl bg-bark p-5 text-cream no-underline hover:text-cream">
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#E8C9A6]">{t.tasting.eyebrow}</div>
            <div className="font-display text-xl font-semibold">{t.tasting.title}</div>
            <div className="text-[13px] text-[#E8DCC8]">{t.pricePlaceholder}</div>
          </div>
          <ChevronIcon className="h-6 w-6" />
        </Link>
        <Link href={`/${locale}/cadeaubon`} className="flex items-center gap-4 rounded-2xl border border-ink/20 p-5 no-underline">
          <div className="flex-1">
            <div className="eyebrow">{t.tasting.giftcard}</div>
            <div className="font-display text-xl font-semibold">{t.footer.business}</div>
          </div>
          <ChevronIcon className="h-6 w-6" />
        </Link>
      </div>

      <FlavorGrid flavors={cardFlavors()} prices={prices} locale={locale} t={cardDict(t)} />
    </div>
  );
}
