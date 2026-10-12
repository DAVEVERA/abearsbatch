import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AddToCart } from '@/components/AddToCart';
import { FlavorCard } from '@/components/FlavorCard';
import { FlaskIcon, Ornament } from '@/components/icons';
import { JsonLd } from '@/components/JsonLd';
import { flavors, getFlavor, getRelated } from '@/lib/flavors';
import { cardDict, flavorPath, getDictionary, isLocale, locales, type Locale } from '@/lib/i18n';
import { formatPrice, getShopifyProduct } from '@/lib/shopify';
import { breadcrumbJsonLd, productJsonLd, siteUrl } from '@/lib/site';

export const revalidate = 300;
export const dynamicParams = false;

type Params = { params: { locale: string; slug: string } };

export function generateStaticParams() {
  return locales.flatMap((locale) => flavors.map((f) => ({ locale, slug: f.slug })));
}

export function generateMetadata({ params }: Params): Metadata {
  const flavor = getFlavor(params.slug);
  if (!flavor || !isLocale(params.locale)) return {};
  const t = getDictionary(params.locale);
  const description = t.meta.flavorDescription.replace('{name}', flavor.name).replace('{tagline}', flavor.tagline[params.locale]);
  const title = `${flavor.name} — ${params.locale === 'nl' ? 'ambachtelijke likeur' : 'craft liqueur'}`;
  return {
    title,
    description,
    alternates: {
      canonical: flavorPath(params.locale, flavor.slug),
      languages: { nl: flavorPath('nl', flavor.slug), en: flavorPath('en', flavor.slug), 'x-default': flavorPath('nl', flavor.slug) },
    },
    openGraph: { title, description, type: 'website', images: [{ url: flavor.image, width: 1200, height: 1600, alt: flavor.name }] },
  };
}

export default async function FlavorPage({ params }: Params) {
  const flavor = getFlavor(params.slug);
  if (!flavor || !isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const t = getDictionary(locale);
  const p = t.product;

  const product = await getShopifyProduct(flavor.shopifyHandle, locale === 'nl' ? 'NL' : 'EN');
  const price = product ? formatPrice(product.price, locale) : t.pricePlaceholder;
  const related = getRelated(flavor, 3);
  const relatedPrices = await Promise.all(
    related.map(async (r) => {
      const rp = await getShopifyProduct(r.shopifyHandle, locale === 'nl' ? 'NL' : 'EN');
      return rp ? formatPrice(rp.price, locale) : null;
    }),
  );
  const flavorsLabel = p.breadcrumbFlavors;
  const sameCharacter = related[0]?.character === flavor.character;

  return (
    <>
      <JsonLd data={productJsonLd(flavor, locale, product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: p.breadcrumbHome, url: `${siteUrl}/${locale}` },
          { name: flavorsLabel, url: `${siteUrl}/${locale}/shop` },
          { name: flavor.name, url: `${siteUrl}${flavorPath(locale, flavor.slug)}` },
        ])}
      />

      <nav aria-label="Breadcrumb" className="container-site pt-5 text-sm text-muted">
        <ol className="flex flex-wrap gap-1.5">
          <li>
            <Link href={`/${locale}`} className="text-muted">
              {p.breadcrumbHome}
            </Link>{' '}
            /
          </li>
          <li>
            <Link href={`/${locale}/shop`} className="text-muted">
              {flavorsLabel}
            </Link>{' '}
            /
          </li>
          <li aria-current="page">{flavor.name}</li>
        </ol>
      </nav>

      {/* Product */}
      <section className="container-site grid items-start gap-10 pb-16 pt-6 lg:grid-cols-2 lg:gap-14 lg:pb-20">
        <div className="flex flex-col gap-3" aria-label={p.gallery}>
          <div className="aspect-[4/5] overflow-hidden rounded-[20px] bg-shot">
            <Image
              src={flavor.image}
              alt={`${flavor.name}, ${t.volume}${flavor.abv ? `, ${flavor.abv}% vol` : ''} — ${flavor.tagline[locale]}`}
              width={1200}
              height={1600}
              priority
              sizes="(max-width: 1024px) 92vw, 600px"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Sfeer-, serveer- en detailfoto's: nog aan te leveren */}
          <div className="grid grid-cols-4 gap-3">
            <div className="aspect-square overflow-hidden rounded-xl outline outline-2 outline-offset-2 outline-ink">
              <Image src={flavor.image} alt="" width={1200} height={1600} sizes="140px" className="h-full w-full object-cover" />
            </div>
            <div className="placeholder-photo aspect-square">[{p.photoAmbience}]</div>
            <div className="placeholder-photo aspect-square">[{p.photoServe}]</div>
            <div className="placeholder-photo aspect-square">[{p.photoLabel}]</div>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:sticky lg:top-28">
          <span className="eyebrow">{t.characters[flavor.character]}</span>
          <h1 className="font-display text-6xl font-semibold leading-none sm:text-[72px]">{flavor.name}</h1>
          <p className="font-display text-2xl italic text-bark">{flavor.tagline[locale]}</p>
          <p className="text-[17px] text-bark">{flavor.description[locale]}</p>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-4xl font-semibold">{price}</span>
            <span className="text-muted">
              {t.volume} · {flavor.abv !== null ? `${flavor.abv}% vol` : t.abvPlaceholder}
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-cream px-4 py-3 text-sm text-bark">
            <FlaskIcon className="h-5 w-5 flex-none text-copper" />
            <span>
              <strong>{p.batch}</strong> · {product?.quantityAvailable != null ? p.batchNote.replace(/\[[^\]]+\]/, String(product.quantityAvailable)) : p.batchNote}
            </span>
          </div>
          <AddToCart t={p} variantId={product?.variantId ?? null} soldOut={product ? !product.availableForSale : false} />
          <ul className="flex flex-col gap-2 border-t border-ink/15 pt-4 text-sm text-bark">
            {p.shippingNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Smaakprofiel */}
      <section className="bg-cream">
        <div className="container-site grid gap-14 py-20 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-[40px] font-semibold">{p.profile}</h2>
            <Ornament className="h-4 w-48 text-copper-light" />
            <dl className="grid grid-cols-[120px_1fr] gap-x-6 gap-y-4 text-[17px] sm:grid-cols-[140px_1fr]">
              <dt className="font-semibold">{p.nose}</dt>
              <dd className="text-bark">{flavor.profile.nose[locale]}</dd>
              <dt className="font-semibold">{p.palate}</dt>
              <dd className="text-bark">{flavor.profile.palate[locale]}</dd>
              <dt className="font-semibold">{p.finish}</dt>
              <dd className="text-bark">{flavor.profile.finish[locale]}</dd>
              <dt className="font-semibold">{p.base}</dt>
              <dd className="text-bark">{flavor.profile.base[locale]}</dd>
            </dl>
          </div>
          <div className="flex flex-col gap-5">
            <h3 className="font-display text-2xl font-semibold">{p.scales}</h3>
            <ul className="flex flex-col gap-5">
              {t.scaleLabels.map(([lo, hi], i) => (
                <li key={lo} className="grid grid-cols-[80px_1fr_80px] items-center gap-3.5 text-sm text-bark">
                  <span>{lo}</span>
                  <span
                    className="relative h-1.5 rounded-full bg-ink/15"
                    role="meter"
                    aria-label={`${lo} – ${hi}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={flavor.scales[i]}
                  >
                    <span className="absolute -top-[5px] h-4 w-4 -translate-x-1/2 rounded-full bg-copper" style={{ left: `${flavor.scales[i]}%` }} />
                  </span>
                  <span className="text-right">{hi}</span>
                </li>
              ))}
            </ul>
            <p className="text-[13px] text-muted">{p.scalesNote}</p>
          </div>
        </div>
      </section>

      {/* Serveren */}
      <section className="container-site py-20">
        <h2 className="mb-7 font-display text-[40px] font-semibold">
          {p.serveTitle} {flavor.name}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            [p.serve, flavor.serve[locale], null],
            [p.cocktail, flavor.cocktail.name[locale], flavor.cocktail.recipe[locale]],
            [p.pairing, flavor.pairing[locale], null],
          ].map(([label, title, body]) => (
            <div key={label} className="flex flex-col gap-2.5 rounded-[20px] border border-ink/20 p-7">
              <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-mid">{label}</span>
              <h3 className="font-display text-2xl font-semibold">{title}</h3>
              {body && <p className="text-[15px] text-bark">{body}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Aanbevelingen */}
      <section className="container-site pb-24">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-[32px] font-semibold sm:text-4xl">
            {sameCharacter ? `${p.alsoTitle} ${t.characters[flavor.character].toLowerCase()}` : p.allFlavors}
          </h2>
          <Link href={`/${locale}/shop`} className="font-semibold">
            {p.allFlavors}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-6 lg:grid-cols-4">
          {related.map((r, i) => (
            <FlavorCard key={r.slug} flavor={r} locale={locale} t={cardDict(t)} price={relatedPrices[i]} compact />
          ))}
          <Link
            href={`/${locale}/proefset`}
            className="flex flex-col justify-end gap-2.5 rounded-2xl bg-bark p-6 text-cream no-underline hover:text-cream"
          >
            <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#E8C9A6]">{p.combine}</span>
            <span className="font-display text-[26px] font-semibold">{t.tasting.title}</span>
            <span className="text-sm text-[#E8DCC8]">{t.tasting.cta} →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
