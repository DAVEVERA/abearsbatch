import { flavors } from './flavors';
import type { Locale } from './i18n';
import { formatPrice, getShopifyProduct } from './shopify';

/** Prijzen per smaak uit Shopify; null = nog geen winkel/prijs (placeholder tonen). */
export async function getPrices(locale: Locale): Promise<Record<string, string | null>> {
  const entries = await Promise.all(
    flavors.map(async (f) => {
      const p = await getShopifyProduct(f.shopifyHandle, locale === 'nl' ? 'NL' : 'EN');
      return [f.slug, p ? formatPrice(p.price, locale) : null] as const;
    }),
  );
  return Object.fromEntries(entries);
}

/** Alleen de velden die client-componenten nodig hebben (houdt de JS-bundel klein). */
export function cardFlavors() {
  return flavors.map(({ slug, name, character, image, tagline }) => ({ slug, name, character, image, tagline }));
}
