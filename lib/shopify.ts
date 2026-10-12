import 'server-only';

/**
 * Minimale Shopify Storefront API-client (headless).
 * Zonder env-variabelen geeft hij null terug en tonen de pagina's prijs-placeholders,
 * zodat de site lokaal en op Vercel werkt vóór de winkel is ingericht.
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION ?? '2025-07';

export const shopifyEnabled = Boolean(domain && token);

type Money = { amount: string; currencyCode: string };

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  price: Money;
  variantId: string | null;
  quantityAvailable: number | null;
};

async function storefront<T>(query: string, variables: Record<string, unknown> = {}, revalidate = 300): Promise<T | null> {
  if (!shopifyEnabled) return null;
  try {
    const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token as string,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate, tags: ['shopify'] },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T; errors?: unknown };
    return json.data ?? null;
  } catch {
    return null;
  }
}

const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      handle
      availableForSale
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 1) { nodes { id quantityAvailable } }
    }
  }
`;

type ProductResponse = {
  product: {
    id: string;
    handle: string;
    availableForSale: boolean;
    priceRange: { minVariantPrice: Money };
    variants: { nodes: { id: string; quantityAvailable: number | null }[] };
  } | null;
};

export async function getShopifyProduct(handle: string, language: 'NL' | 'EN' = 'NL'): Promise<ShopifyProduct | null> {
  const data = await storefront<ProductResponse>(PRODUCT_QUERY, { handle, country: 'NL', language });
  const p = data?.product;
  if (!p) return null;
  const variant = p.variants.nodes[0];
  return {
    id: p.id,
    handle: p.handle,
    availableForSale: p.availableForSale,
    price: p.priceRange.minVariantPrice,
    variantId: variant?.id ?? null,
    quantityAvailable: variant?.quantityAvailable ?? null,
  };
}

export function formatPrice(money: Money, locale: 'nl' | 'en' = 'nl') {
  return new Intl.NumberFormat(locale === 'nl' ? 'nl-NL' : 'en-GB', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(Number(money.amount));
}
