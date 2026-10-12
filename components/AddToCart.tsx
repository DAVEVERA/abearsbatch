'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n';

/**
 * Aantal + cadeau-optie + knop.
 * TODO (fase checkout): koppelen aan Shopify Cart API (cartCreate / cartLinesAdd) via een server action
 * met `variantId`; cadeauverpakking als cart attribute of losse variant.
 */
export function AddToCart({ t, variantId, soldOut = false }: { t: Dictionary['product']; variantId: string | null; soldOut?: boolean }) {
  const [qty, setQty] = useState(1);
  const [gift, setGift] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <div role="group" aria-label={t.qty} className="flex h-14 items-center rounded-full border border-ink/30">
          <button type="button" aria-label={t.less} onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-14 w-12 text-xl">
            −
          </button>
          <span className="w-7 text-center font-semibold" aria-live="polite">
            {qty}
          </span>
          <button type="button" aria-label={t.more} onClick={() => setQty((q) => Math.min(12, q + 1))} className="h-14 w-12 text-xl">
            +
          </button>
        </div>
        <button
          type="button"
          disabled={soldOut}
          data-variant-id={variantId ?? undefined}
          onClick={() => setAdded(true)}
          className="btn-primary h-14 flex-[1_1_240px] text-[17px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {added ? `✓ ${t.addToCart}` : t.addToCart}
        </button>
      </div>
      <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-[15px]">
        <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} className="h-5 w-5 accent-copper" />
        {t.giftWrap}
      </label>
    </div>
  );
}
