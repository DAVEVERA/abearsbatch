import type { MetadataRoute } from 'next';
import { flavors } from '@/lib/flavors';
import { flavorPath, locales } from '@/lib/i18n';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/shop'];
  const now = new Date();
  return [
    ...locales.flatMap((l) =>
      pages.map((p) => ({
        url: `${siteUrl}/${l}${p}`,
        lastModified: now,
        alternates: { languages: { nl: `${siteUrl}/nl${p}`, en: `${siteUrl}/en${p}` } },
      })),
    ),
    ...locales.flatMap((l) =>
      flavors.map((f) => ({
        url: `${siteUrl}${flavorPath(l, f.slug)}`,
        lastModified: now,
        alternates: { languages: { nl: `${siteUrl}${flavorPath('nl', f.slug)}`, en: `${siteUrl}${flavorPath('en', f.slug)}` } },
      })),
    ),
  ];
}
