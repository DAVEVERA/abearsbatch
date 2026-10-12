import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/i18n';
import { BagIcon, MenuIcon, SearchIcon, UserIcon } from './icons';
import { LangSwitch } from './LangSwitch';

export function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  const nav = [
    { href: `/${locale}/shop`, label: t.nav.flavors },
    { href: `/${locale}/proefset`, label: t.nav.gifts },
    { href: `/${locale}/verhaal`, label: t.nav.story },
    { href: `/${locale}/horeca`, label: t.nav.trade },
    { href: `/${locale}/verkooppunten`, label: t.nav.stockists },
  ];

  return (
    <>
      <div className="bg-black px-4 py-2 text-center text-[12px] tracking-[0.06em] text-ash">{t.announce}</div>
      <header className="sticky top-0 z-40 border-b border-bone/10 bg-char/95 text-bone backdrop-blur-md [&_a:hover]:text-amber [&_a]:text-bone">
        <div className="container-site flex items-center gap-4 py-3 lg:gap-6 lg:py-4">
          <details className="group lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden" aria-label={t.menu}>
              <MenuIcon className="h-6 w-6" />
            </summary>
            <nav aria-label={t.menu} className="absolute inset-x-0 top-full border-b border-bone/10 bg-char px-4 pb-8 pt-2">
              <ul className="flex flex-col">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="flex min-h-[48px] items-center border-b border-bone/10 font-display text-2xl no-underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>

          <Link href={`/${locale}`} className="flex flex-1 flex-col items-center leading-none no-underline lg:flex-none lg:items-start">
            <span className="font-display text-[19px] font-bold tracking-[0.06em] text-bone sm:text-[24px]">A BEAR&apos;S BATCH</span>
            <span className="mt-1 hidden font-display text-xs italic text-ash sm:block">Liquor handcrafted by De Beer</span>
          </Link>

          <nav aria-label="Hoofdmenu" className="ml-auto hidden lg:block">
            <ul className="flex gap-7 text-[15px] font-medium">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="no-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center">
            <span className="hidden sm:block">
              <LangSwitch locale={locale} label={t.langSwitch} />
            </span>
            <button type="button" aria-label={t.search} className="hidden h-11 w-11 items-center justify-center sm:flex">
              <SearchIcon className="h-5 w-5" />
            </button>
            <Link href={`/${locale}/account`} aria-label={t.account} className="hidden h-11 w-11 items-center justify-center sm:flex">
              <UserIcon className="h-5 w-5" />
            </Link>
            <Link href={`/${locale}/winkelwagen`} aria-label={t.cart} className="relative flex h-11 w-11 items-center justify-center">
              <BagIcon className="h-[22px] w-[22px]" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
