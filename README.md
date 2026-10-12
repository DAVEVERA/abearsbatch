# A Bear's Batch — website 2026

Next.js 14 (App Router, TypeScript, Tailwind) met Shopify als headless winkelmotor. Klaar voor Vercel.

## Starten

```bash
npm install
cp .env.example .env.local   # Shopify-gegevens invullen (optioneel)
npm run dev                  # http://localhost:3000 → /nl
```

Zonder Shopify-env toont de site placeholders (`€ [prijs]`, `[aantal]`). Met env worden prijs, voorraad en variant-id live opgehaald (ISR, 5 min).

## Deploy (Vercel)

1. Repo koppelen in Vercel.
2. Env-variabelen uit `.env.example` zetten.
3. Domein `abearsbatch.com` koppelen.

## Shopify inrichten

- Producten met handles: `epilos`, `haktiri`, `floreta`, `teposo`, `fragaki`, `colkina`, `palmusa`, `silkimi`.
- Storefront API-token met rechten op producten en cart.
- Verzending: PostNL met optie **Leeftijdscheck**.

## Structuur

| Pad | Inhoud |
| --- | --- |
| `app/[locale]/page.tsx` | Home |
| `app/[locale]/shop/page.tsx` | Shop met filters en bundels |
| `app/[locale]/smaken/[slug]/page.tsx` | Smaakpagina-template (8×, NL `/nl/smaken/…`, EN `/en/flavours/…`) |
| `app/[locale]/[page]/page.tsx` | Pagina's in opbouw (noindex) |
| `components/AgeGate.tsx` | Leeftijdscheck met geboortejaar en "onthoud mij" |
| `lib/flavors.ts` | Smaakdata (teksten, profielen, placeholders) |
| `lib/i18n.ts` | NL/EN-teksten |
| `lib/shopify.ts` | Storefront API-client |
| `lib/site.ts` | Organization-, Product- en Breadcrumb-schema |

## Nog aan te leveren door de klant

Prijzen, verzenddrempel en -kosten, voorraad per batch, % vol (behalve Epilos 19%), ingrediënten, neus-notities, serveertips, cocktails, pairings, sfeer- en serveerfoto's, uitleg 4-stappenproces, Instagram-account.

## Volgende fase

1. Winkelwagen + checkout: Shopify Cart API, verplichte leeftijdsbevestiging (actief aanvinken) vóór doorsturen naar Shopify Checkout, melding ID-check bij levering, cadeau-optie, verzendgrens.
2. Proefset & cadeaus, smaakquiz (4 vragen), het verhaal, horeca-portaal, waar te koop.
3. Nieuwsbrief koppelen (Shopify Customer of Klaviyo).
