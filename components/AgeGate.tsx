'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/lib/i18n';

const KEY = 'abb_age_ok';
const MIN_AGE = 18;

function isVerified() {
  try {
    return localStorage.getItem(KEY) === '1' || sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Leeftijdscheck vóór toegang. De bezoeker vult zelf het geboortejaar in (nooit voorinvullen).
 * "Onthoud mij" bewaart de bevestiging op dit apparaat; anders alleen voor deze sessie.
 * De wettelijke controle bij aankoop en levering gebeurt daarnaast in de checkout.
 */
export function AgeGate({ t }: { t: Dictionary['ageGate'] }) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isVerified()) setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const main = document.getElementById('inhoud');
    main?.setAttribute('inert', '');
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      main?.removeAttribute('inert');
    };
  }, [open]);

  if (!open) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const y = Number(year);
    const now = new Date().getFullYear();
    if (!/^\d{4}$/.test(year) || y < 1900 || y > now) {
      setError(t.invalid);
      return;
    }
    // Op jaarbasis: wie dit jaar 18 wordt, telt als 18 (strengere controle volgt in de checkout).
    if (now - y < MIN_AGE) {
      setError(t.tooYoung);
      return;
    }
    try {
      (remember ? localStorage : sessionStorage).setItem(KEY, '1');
    } catch {
      /* opslag geblokkeerd: alleen voor deze pagina */
    }
    setOpen(false);
  }

  return (
    <div className="grain fixed inset-0 z-50 overflow-y-auto bg-char text-bone" role="dialog" aria-modal="true" aria-labelledby="agegate-title">
      <div aria-hidden="true" className="anim-flicker pointer-events-none absolute -bottom-[25%] left-1/2 h-[60vh] w-[140vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(226,98,43,0.45),transparent)]" />
      <div className="relative mx-auto flex min-h-full max-w-md flex-col items-center gap-6 px-7 py-12 text-center">
        <Image
          src="/images/flessen/epilos.webp"
          alt="A Bear's Batch"
          width={900}
          height={1200}
          priority
          sizes="200px"
          className="anim-bottle h-auto w-[150px] drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)] sm:w-[180px]"
        />
        <h1 id="agegate-title" className="font-display text-3xl font-semibold leading-tight">
          {t.title}
        </h1>
        <p className="text-bone/70">{t.body}</p>
        <form onSubmit={submit} className="flex w-full flex-col gap-3 text-left" noValidate>
          <label htmlFor="agegate-year" className="text-sm font-medium">
            {t.label}
          </label>
          <input
            ref={inputRef}
            id="agegate-year"
            inputMode="numeric"
            autoComplete="bday-year"
            maxLength={4}
            placeholder={t.placeholder}
            value={year}
            onChange={(e) => {
              setYear(e.target.value.replace(/\D/g, ''));
              setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'agegate-error' : undefined}
            className="min-h-[56px] rounded-xl border border-bone/25 bg-transparent px-4 text-bone placeholder:text-bone/30 focus:border-amber focus:outline-none text-center text-xl font-semibold tracking-[0.2em]"
          />
          {error && (
            <p id="agegate-error" role="alert" className="text-sm font-medium text-amber">
              {error}
            </p>
          )}
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-[15px]">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-5 w-5 accent-amber" />
            {t.remember}
          </label>
          <button type="submit" className="min-h-[56px] rounded-full bg-amber text-[17px] font-semibold text-char transition-colors hover:bg-bone">
            {t.cta}
          </button>
        </form>
        <p className="flex items-center gap-2 text-[13px] text-ash">
          <strong className="rounded-md border-[1.5px] border-ash px-1.5">18+</strong>
          NIX18
        </p>
      </div>
    </div>
  );
}
