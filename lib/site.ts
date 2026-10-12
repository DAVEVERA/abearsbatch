import type { Flavor } from './flavors';
import { flavorPath, type Locale } from './i18n';
import type { ShopifyProduct } from './shopify';

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.abearsbatch.com').replace(/\/$/, '');

export const brand = {
  name: "A Bear's Batch",
  legalName: "A Bear's Batch",
  slogan: 'Liquor handcrafted by De Beer',
  logo: `${siteUrl}/icon.png`,
  instagram: 'https://www.instagram.com/[account]/',
};

export function organizationJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    legalName: brand.legalName,
    url: `${siteUrl}/${locale}`,
    logo: brand.logo,
    slogan: brand.slogan,
    description:
      locale === 'nl'
        ? 'Ambachtelijke likeur uit eigen keuken, met de hand gemaakt in kleine oplages.'
        : 'Craft liqueur from our own kitchen, handmade in small batches.',
  };
}

export function productJsonLd(flavor: Flavor, locale: Locale, product: ShopifyProduct | null) {
  const url = `${siteUrl}${flavorPath(locale, flavor.slug)}`;
  const additionalProperty = [
    { '@type': 'PropertyValue', name: locale === 'nl' ? 'Inhoud' : 'Volume', value: '0.5', unitCode: 'LTR' },
    ...(flavor.abv !== null
      ? [{ '@type': 'PropertyValue', name: locale === 'nl' ? 'Alcoholpercentage' : 'Alcohol by volume', value: flavor.abv, unitText: '% vol' }]
      : []),
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${flavor.name} — ${brand.name}`,
    description: `${flavor.tagline[locale]} ${flavor.description[locale]}`,
    image: [`${siteUrl}${flavor.image}`],
    sku: flavor.slug,
    url,
    category: locale === 'nl' ? 'Likeur' : 'Liqueur',
    brand: { '@type': 'Brand', name: brand.name },
    additionalProperty,
    // Offer alleen met echte prijs uit Shopify; nooit een verzonnen prijs in schema.
    ...(product
      ? {
          offers: {
            '@type': 'Offer',
            url,
            price: product.price.amount,
            priceCurrency: product.price.currencyCode,
            availability: product.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            eligibleRegion: { '@type': 'Country', name: 'NL' },
          },
        }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })),
  };
}
