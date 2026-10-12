import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FlavorGrid } from '@/components/FlavorGrid';
import { FlaskIcon, GiftIcon, IdIcon, Ornament, WaveIcon } from '@/components/icons';
import { flavors } from '@/lib/flavors';
import { cardDict, getDictionary, isLocale, type Locale } from '@/lib/i18n';
import { cardFlavors, getPrices } from '@/lib/prices';

export const revalidate = 300;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const t = getDictionary(params.locale);
  return {
    title: { absolute: t.meta.homeTitle },
    description: t.meta.homeDescription,
    alternates: { canonical: `/${params.locale}`, languages: { nl: '/nl', en: '/en', 'x-default': '/nl' } },
    openGraph: { title: t.meta.homeTitle, description: t.meta.homeDescription, images: ['/images/merk/logo-beer.webp'] },
  };
}

export default async function Home({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const t = getDictionary(locale);
  const prices = await getPrices(locale);
  const uspIcons = [FlaskIcon, WaveIcon, GiftIcon, IdIcon];

  return (
    <>
      {/* Hero */}
      <section className="bg-cream">
        <div className="container-site grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-6">
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <h1 className="font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.01em] sm:text-6xl xl:text-[76px]">{t.hero.title}</h1>
            <p className="max-w-[520px] text-lg text-bark sm:text-[19px]">{t.hero.body}</p>
            <div className="mt-2 flex flex-wrap items-center gap-5">
              <Link href="#smaken" className="btn-primary">
                {t.hero.cta}
              </Link>
              <Link href={`/${locale}/proefset`} className="font-semibold underline-offset-4">
                {t.hero.secondary}
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/merk/logo-beer.webp"
              alt={t.hero.imageAlt}
              width={1360}
              height={1185}
              priority
              sizes="(max-width: 1024px) 92vw, 560px"
              className="h-auto w-full max-w-[560px] rounded-[20px]"
            />
          </div>
        </div>
      </section>

      {/* USP-balk */}
      <section aria-label="USP" className="border-b border-ink/15">
        <ul className="container-site grid grid-cols-2 gap-x-4 gap-y-5 py-7 text-[15px] text-bark lg:grid-cols-4">
          {t.usp.map((text, i) => {
            const Icon = uspIcons[i];
            return (
              <li key={text} className="flex items-center gap-3">
                <Icon className="h-7 w-7 flex-none text-copper" />
                <span>{text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* De acht smaken */}
      <section id="smaken" className="container-site scroll-mt-24 pb-16 pt-16 sm:pt-[88px]">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{t.grid.title}</h2>
            <p className="mt-3 max-w-[560px] text-bark">{t.grid.intro}</p>
          </div>
        </div>
        <FlavorGrid flavors={cardFlavors()} prices={prices} locale={locale} t={cardDict(t)} />
      </section>

      {/* Proefset */}
      <section className="container-site pb-20 sm:pb-[88px]">
        <div className="grid items-center gap-10 rounded-3xl bg-bark p-7 text-cream sm:p-14 lg:grid-cols-2">
          <div className="flex flex-col gap-[18px]">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E8C9A6]">{t.tasting.eyebrow}</span>
            <h2 className="font-display text-4xl font-semibold leading-tight sm:text-[44px]">{t.tasting.title}</h2>
            <p className="max-w-[480px] text-[17px]">{t.tasting.body}</p>
            <div className="flex flex-wrap items-center gap-5">
              <Link href={`/${locale}/proefset`} className="inline-flex min-h-[52px] items-center rounded-full bg-cream px-7 font-semibold text-ink no-underline hover:bg-paper hover:text-ink">
                {t.tasting.cta} · {t.pricePlaceholder}
              </Link>
              <Link href={`/${locale}/cadeaubon`} className="font-semibold text-cream underline-offset-4 hover:text-cream">
                {t.tasting.giftcard}
              </Link>
            </div>
          </div>
          <ul className="grid grid-cols-4 gap-2.5" aria-hidden="true">
            {flavors.map((f) => (
              <li key={f.slug}>
                <Image src={f.image} alt="" width={1200} height={1600} sizes="(max-width: 1024px) 22vw, 140px" className="aspect-[3/4] w-full rounded-[10px] object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Het verhaal */}
      <section className="bg-cream">
        <div className="container-site grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <figure>
            <Image
              src="/images/merk/de-beer.webp"
              alt={t.story.imageAlt}
              width={1067}
              height={1600}
              sizes="(max-width: 1024px) 92vw, 520px"
              className="aspect-[4/5] w-full max-w-[520px] rounded-[20px] object-cover"
            />
            <figcaption className="mt-2.5 text-[13px] text-muted">{t.story.caption}</figcaption>
          </figure>
          <div className="flex flex-col gap-6">
            <span className="eyebrow">{t.story.eyebrow}</span>
            <h2 className="font-display text-4xl font-semibold leading-tight sm:text-[44px]">{t.story.title}</h2>
            <Ornament className="h-4 w-48 text-copper-light" />
            <p className="text-lg text-bark">{t.story.body}</p>
            <ol className="mt-2 grid grid-cols-2 gap-5">
              {t.story.steps.map((step, i) => (
                <li key={step.title} className="border-t-2 border-copper-light pt-3">
                  <span className="font-display text-[28px] text-copper">{i + 1}</span>
                  <div className="font-semibold">{step.title}</div>
                  <div className="text-sm text-muted">{step.text}</div>
                </li>
              ))}
            </ol>
            <Link href={`/${locale}/verhaal`} className="font-semibold underline-offset-4">
              {t.story.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Quiz + horeca */}
      <section className="container-site grid gap-7 py-20 sm:py-[88px] lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-3xl border border-ink/20 p-8 sm:p-12">
          <span className="eyebrow">{t.quiz.eyebrow}</span>
          <h2 className="font-display text-[32px] font-semibold leading-tight sm:text-4xl">{t.quiz.title}</h2>
          <p className="text-bark">{t.quiz.body}</p>
          <Link href={`/${locale}/smaakquiz`} className="mt-2 inline-flex min-h-[48px] items-center self-start rounded-full bg-ink px-6 font-semibold text-paper no-underline hover:bg-bark hover:text-paper">
            {t.quiz.cta}
          </Link>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl bg-forest p-8 text-[#F1EEE4] sm:p-12">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#D3DCC5]">{t.trade.eyebrow}</span>
          <h2 className="font-display text-[32px] font-semibold leading-tight sm:text-4xl">{t.trade.title}</h2>
          <p>{t.trade.body}</p>
          <Link href={`/${locale}/horeca`} className="mt-2 inline-flex min-h-[48px] items-center self-start rounded-full bg-[#F1EEE4] px-6 font-semibold text-forest no-underline hover:bg-paper hover:text-forest">
            {t.trade.cta}
          </Link>
        </div>
      </section>

      {/* Nieuwsbrief */}
      <section className="bg-ink text-cream">
        <div className="container-site flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[560px]">
            <h2 className="font-display text-[32px] font-semibold leading-tight sm:text-4xl">{t.newsletter.title}</h2>
            <p className="mt-3 text-[#E8DCC8]">{t.newsletter.body}</p>
          </div>
          {/* TODO: koppelen aan Shopify Customer (acceptsMarketing) of Klaviyo */}
          <form className="flex flex-wrap items-end gap-3" action={`/${locale}/nieuwsbrief`} method="post">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nb-mail" className="text-sm">
                {t.newsletter.label}
              </label>
              <input
                id="nb-mail"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t.newsletter.placeholder}
                className="min-h-[52px] w-[300px] max-w-full rounded-full border border-mid bg-paper px-4 text-ink"
              />
            </div>
            <button type="submit" className="min-h-[52px] rounded-full bg-copper-light px-7 font-semibold text-night">
              {t.newsletter.cta}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
