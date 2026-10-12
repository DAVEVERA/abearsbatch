import Image from 'next/image';
import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/i18n';
import { BagIcon, MenuIcon, SearchIcon, UserIcon } from './icons';

/**
 * Logo staat gecentreerd en wordt volledig getoond. Het menu zit in een uitklap naast
 * de winkelwagen, zodat de header één rij blijft en het logo de ruimte krijgt.
 */
export function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  const nav = [
    { href: `/${locale}/shop`, label: t.nav.flavors },
    { href: `/${locale}/proefset`, label: t.nav.gifts },
    { href: `/${locale}/verhaal`, label: t.nav.story },
    { href: `/${locale}/horeca`, label: t.nav.trade },
    { href: `/${locale}/verkooppunten`, label: t.nav.stockists },
  ];

  return (
    /*
      Geen onderrand: die leest als een naad. De header loopt via een verloop uit in
      de pagina, zodat de inhoud eronder door lijkt te schuiven.
    */
    <header
      data-chrome
      className="sticky top-0 z-40 bg-char/85 text-bone backdrop-blur-md after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-8 after:bg-gradient-to-b after:from-char/70 after:to-transparent [&_a:hover]:text-amber [&_a]:text-bone"
    >
      {/* Gelijke zijkolommen houden het logo exact in het midden. */}
      <div className="container-site grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2.5 lg:py-3.5">
        <div aria-hidden="true" />

        <Link href={`/${locale}`} className="flex items-center justify-center no-underline">
          {/*
            De volledige lockup uit de footer, inclusief tagline. Alt draagt de naam,
            want er staat geen tekst meer naast.
          */}
          <Image
            src="/images/merk/logo-lockup.webp"
            alt="A Bear's Batch"
            width={781}
            height={640}
            priority
            sizes="(max-width: 640px) 150px, 200px"
            className="h-[88px] w-auto xs:h-[100px] sm:h-[120px] lg:h-[144px]"
          />
        </Link>

        <div className="flex items-center justify-end">
          <button type="button" aria-label={t.search} className="hidden h-11 w-11 items-center justify-center transition-colors hover:text-amber sm:flex">
            <SearchIcon className="h-5 w-5" />
          </button>
          <Link href={`/${locale}/account`} aria-label={t.account} className="hidden h-11 w-11 items-center justify-center sm:flex">
            <UserIcon className="h-5 w-5" />
          </Link>
          <Link href={`/${locale}/winkelwagen`} aria-label={t.cart} className="flex h-11 w-11 items-center justify-center">
            <BagIcon className="h-[22px] w-[22px]" />
          </Link>

          {/* Uitklapmenu naast de winkelwagen. details/summary werkt zonder JavaScript. */}
          <details className="relative">
            <summary
              className="flex h-11 w-11 cursor-pointer list-none items-center justify-center transition-colors hover:text-amber [&::-webkit-details-marker]:hidden"
              aria-label={t.menu}
            >
              <MenuIcon className="h-6 w-6" />
            </summary>
            <nav
              aria-label={t.menu}
              className="absolute right-0 top-full z-50 mt-3 w-60 rounded-[3px] border border-bone/15 bg-char/95 p-1.5 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md"
            >
              <ul className="flex flex-col">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-[2px] px-4 py-3 text-[15px] font-medium no-underline transition-colors hover:bg-bone/10"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
