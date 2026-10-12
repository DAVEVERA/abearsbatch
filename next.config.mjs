/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600],
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.shopify.com' }],
  },
  async rewrites() {
    // Engelse URL's voor de smaakpagina's: /en/flavours/epilos -> /en/smaken/epilos
    return [{ source: '/en/flavours/:slug', destination: '/en/smaken/:slug' }];
  },
};

export default nextConfig;
