'use client';

import { useState } from 'react';
import type { Character } from '@/lib/flavors';
import type { CardDict, Locale } from '@/lib/i18n';
import { FlavorCard, type CardFlavor } from './FlavorCard';

const order: Character[] = ['fruitig', 'warm', 'tropisch', 'romig'];

export function FlavorGrid({
  flavors,
  prices,
  locale,
  t,
}: {
  flavors: CardFlavor[];
  prices: Record<string, string | null>;
  locale: Locale;
  t: CardDict;
}) {
  const [filter, setFilter] = useState<Character | 'all'>('all');
  const shown = filter === 'all' ? flavors : flavors.filter((f) => f.character === filter);
  const chips: (Character | 'all')[] = ['all', ...order];

  return (
    <>
      <div role="group" aria-label={t.grid.filterLabel} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {chips.map((c) => {
          const active = c === filter;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(c)}
              className={`min-h-[44px] flex-none rounded-full border px-[18px] text-sm font-medium transition-colors ${
                active ? 'border-ink bg-ink text-paper' : 'border-ink/30 bg-transparent text-ink hover:border-ink'
              }`}
            >
              {c === 'all' ? t.grid.all : t.characters[c]}
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-7 lg:grid-cols-4">
        {shown.map((f, i) => (
          <FlavorCard key={f.slug} flavor={f} locale={locale} t={t} price={prices[f.slug] ?? null} priority={i < 2} />
        ))}
        {shown.length === 0 && <p className="col-span-full text-bark">{t.grid.empty}</p>}
      </div>
    </>
  );
}
