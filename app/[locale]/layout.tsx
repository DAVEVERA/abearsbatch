import '@fontsource-variable/fraunces';
import '@fontsource-variable/work-sans';
import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { AgeGate } from '@/components/AgeGate';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { organizationJsonLd, siteUrl } from '@/lib/site';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: '#3B2617' };

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const t = getDictionary(params.locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.homeTitle, template: "%s · A Bear's Batch" },
    description: t.meta.homeDescription,
    icons: { icon: '/icon.png', apple: '/icon.png' },
    openGraph: { siteName: "A Bear's Batch", type: 'website', locale: params.locale === 'nl' ? 'nl_NL' : 'en_GB' },
  };
}

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const t = getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <a href="#inhoud" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-paper focus:px-4 focus:py-2">
          {t.skip}
        </a>
        <JsonLd data={organizationJsonLd(locale)} />
        <Header locale={locale} t={t} />
        <main id="inhoud">{children}</main>
        <Footer locale={locale} t={t} />
        <AgeGate t={t.ageGate} />
      </body>
    </html>
  );
}
