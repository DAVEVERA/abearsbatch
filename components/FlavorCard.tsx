import Image from 'next/image';
import Link from 'next/link';
import type { Flavor } from '@/lib/flavors';
import { flavorPath, type CardDict, type Locale } from '@/lib/i18n';

export type CardFlavor = Pick<Flavor, 'slug' | 'name' | 'character' | 'image' | 'tagline'>;

export function FlavorCard({
  flavor,
  locale,
  t,
  price,
  priority = false,
  compact = false,
}: {
  flavor: CardFlavor;
  locale: Locale;
  t: CardDict;
  price: string | null;
  priority?: boolean;
  compact?: boolean;
}) {
  const href = flavorPath(locale, flavor.slug);
  return (
    <article className="flex flex-col gap-3">
      <Link href={href} className="group block aspect-[4/5] overflow-hidden rounded-2xl bg-shot" tabIndex={-1} aria-hidden="true">
        <Image
          src={flavor.image}
          alt=""
          width={1200}
          height={1600}
          priority={priority}
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 300px"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className={`font-display font-semibold ${compact ? 'text-[19px]' : 'text-2xl'}`}>
          <Link href={href} className="no-underline">
            {flavor.name}
          </Link>
        </h3>
        {!compact && <span className="text-xs font-semibold uppercase tracking-[0.08em] text-mid">{t.characters[flavor.character]}</span>}
      </div>
      <p className={`m-0 text-bark ${compact ? 'text-[13px]' : 'text-[15px]'}`}>{flavor.tagline[locale]}</p>
      <div className="mt-auto flex items-center justify-between gap-3">
        <span className="text-[15px]">
          {!compact && <>{t.volume} · </>}
          <strong>{price ?? t.pricePlaceholder}</strong>
        </span>
        <Link href={href} className="btn-outline" aria-label={`${flavor.name}: ${t.grid.addToCart}`}>
          {compact ? '+' : t.grid.addToCart}
        </Link>
      </div>
    </article>
  );
}
