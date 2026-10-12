import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FireBackground } from '@/components/landing/FireBackground';
import { FlavorSlider, type SliderFlavor } from '@/components/landing/FlavorSlider';
import { Hero } from '@/components/landing/Hero';
import { Maker } from '@/components/landing/Maker';
import { Manifesto } from '@/components/landing/Manifesto';
import { Process } from '@/components/landing/Process';
import { TastingBand } from '@/components/landing/TastingBand';
import { flavors } from '@/lib/flavors';
import { flavorPath, getDictionary, isLocale, type Locale } from '@/lib/i18n';
import { getLandingCopy } from '@/lib/landing-copy';

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
  const c = getLandingCopy(locale);

  const sliderFlavors: SliderFlavor[] = flavors.map((f) => ({
    slug: f.slug,
    name: f.name,
    character: f.character,
    tagline: f.tagline[locale],
    description: f.description[locale],
    href: flavorPath(locale, f.slug),
    cutout: f.cutout,
    glow: f.glow,
  }));

  return (
    <div data-seamless className="relative">
      {/* Vonken en as achter de hele pagina; de secties zelf zijn doorzichtig. */}
      <FireBackground className="z-0" />
      {/*
        Korrel in één doorlopende laag over de hele pagina. Stond hij per sectie, dan
        viel er een zichtbare naad op elke sectiegrens omdat de overlay daar stopt en
        opnieuw begint.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[url('/images/grain.png')] bg-[length:160px] opacity-[0.07] mix-blend-overlay"
      />
      <div className="relative z-10">
      <Hero copy={c.hero} />
      <Manifesto text={c.manifesto} />
      <FlavorSlider
        flavors={sliderFlavors}
        copy={c.slider}
        characterLabels={t.characters}
        volume={t.volume}
      />
      <Process copy={c.process} />
      <Maker copy={c.maker} href={`/${locale}/verhaal`} />
      <TastingBand
        copy={c.tasting}
        bottles={flavors.map((f) => ({ slug: f.slug, ...f.cutout }))}
        href={`/${locale}/proefset`}
        priceLabel={t.pricePlaceholder}
      />

      {/* Quiz + horeca */}
      <section className="relative text-bone">
        <div className="container-site grid gap-5 py-20 sm:py-28 lg:grid-cols-2">
          <Link
            href={`/${locale}/smaakquiz`}
            className="group relative flex min-h-[300px] flex-col justify-end gap-4 overflow-hidden rounded-[4px] border border-bone/15 p-8 text-bone no-underline transition-colors duration-500 hover:border-amber/60 hover:text-bone sm:p-12"
          >
            <span className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-ember/20 blur-3xl transition-transform duration-700 ease-out group-hover:scale-150" aria-hidden="true" />
            <span className="font-display text-[clamp(32px,7vw,48px)] font-semibold leading-[1.02]">{t.quiz.title}</span>
            <span className="max-w-[38ch] text-bone/65">{t.quiz.body}</span>
            <span className="mt-2 inline-flex items-center gap-2 font-semibold">
              {t.quiz.cta} <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">→</span>
            </span>
          </Link>
          <Link
            href={`/${locale}/horeca`}
            className="group relative flex min-h-[300px] flex-col justify-end gap-4 overflow-hidden rounded-[4px] bg-forest p-8 text-[#F1EEE4] no-underline hover:text-[#F1EEE4] sm:p-12"
          >
            <span className="font-display text-[clamp(32px,7vw,48px)] font-semibold leading-[1.02]">{t.trade.title}</span>
            <span className="max-w-[38ch] text-[#F1EEE4]/80">{t.trade.body}</span>
            <span className="mt-2 inline-flex items-center gap-2 font-semibold">
              {t.trade.cta} <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Nieuwsbrief */}
      <section className="relative text-bone">
        <div className="container-site flex flex-col gap-8 py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[560px]">
            <h2 className="font-display text-[clamp(32px,7vw,52px)] font-semibold leading-[1.02]">{t.newsletter.title}</h2>
            <p className="mt-4 text-bone/65">{t.newsletter.body}</p>
          </div>
          {/* TODO: koppelen aan Shopify Customer (acceptsMarketing) of Klaviyo */}
          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-end" action={`/${locale}/nieuwsbrief`} method="post">
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="nb-mail" className="text-sm text-bone/70">
                {t.newsletter.label}
              </label>
              <input
                id="nb-mail"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t.newsletter.placeholder}
                className="min-h-[56px] w-full rounded-full border border-bone/25 bg-transparent px-5 text-bone placeholder:text-bone/35 focus:border-amber focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-on-dark">
              {t.newsletter.cta}
            </button>
          </form>
        </div>
      </section>
      </div>
    </div>
  );
}
