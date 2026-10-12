import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/nl/winkelwagen', '/en/winkelwagen', '/nl/account', '/en/account'] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
