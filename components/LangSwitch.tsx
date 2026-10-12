'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

/** Wisselt NL <-> EN en blijft op dezelfde pagina. */
export function LangSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const target: Locale = locale === 'nl' ? 'en' : 'nl';
  let href = pathname.replace(/^\/(nl|en)(?=\/|$)/, `/${target}`);
  href = target === 'en' ? href.replace('/en/smaken/', '/en/flavours/') : href.replace('/nl/flavours/', '/nl/smaken/');
  return (
    <Link href={href} hrefLang={target} lang={target} className="inline-flex min-h-[44px] items-center px-2 text-sm font-medium no-underline">
      {label}
    </Link>
  );
}
