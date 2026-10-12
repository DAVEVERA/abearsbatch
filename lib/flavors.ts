import type { Locale } from './i18n';

export type Character = 'fruitig' | 'warm' | 'tropisch' | 'romig';

type Localized = Record<Locale, string>;

export type Flavor = {
  slug: string;
  name: string;
  /** Shopify product handle; standaard gelijk aan slug. */
  shopifyHandle: string;
  character: Character;
  image: string;
  /** Alcoholpercentage; null = nog aan te leveren door de klant. */
  abv: number | null;
  tagline: Localized;
  description: Localized;
  profile: { nose: Localized; palate: Localized; finish: Localized; base: Localized };
  /** Posities 0–100 op de schalen droog–zoet, licht–vol, fris–warm, zacht–kruidig (voorbeeldwaarden). */
  scales: [number, number, number, number];
  serve: Localized;
  cocktail: { name: Localized; recipe: Localized };
  pairing: Localized;
};

const todo = (nl: string, en: string): Localized => ({ nl: `[${nl}]`, en: `[${en}]` });

export const flavors: Flavor[] = [
  {
    slug: 'epilos',
    name: 'Epilos',
    shopifyHandle: 'epilos',
    character: 'warm',
    image: '/images/smaken/epilos.webp',
    abv: 19,
    tagline: { nl: 'Vol, donker en verleidelijk.', en: 'Full, dark and seductive.' },
    description: {
      nl: 'Rijk en fluweelzacht, met diepe tonen van rijp fruit en een warme, elegante afdronk. Een intense likeur om rustig van te genieten.',
      en: 'Rich and velvety, with deep notes of ripe fruit and a warm, elegant finish. An intense liqueur to savour slowly.',
    },
    profile: {
      nose: todo('neus', 'nose'),
      palate: { nl: 'Rijk en fluweelzacht, diepe tonen van rijp fruit', en: 'Rich and velvety, deep notes of ripe fruit' },
      finish: { nl: 'Warm en elegant', en: 'Warm and elegant' },
      base: todo('ingrediënten', 'ingredients'),
    },
    scales: [70, 85, 80, 35],
    serve: { nl: 'Licht gekoeld, in een tulpglas', en: 'Lightly chilled, in a tulip glass' },
    cocktail: { name: todo('naam cocktail', 'cocktail name'), recipe: todo('ingrediënten en bereiding', 'ingredients and method') },
    pairing: { nl: 'Kaasplank, pure chocolade', en: 'Cheese board, dark chocolate' },
  },
  {
    slug: 'haktiri',
    name: 'Haktiri',
    shopifyHandle: 'haktiri',
    character: 'warm',
    image: '/images/smaken/haktiri.webp',
    abv: null,
    tagline: { nl: 'Warm, rijk en gelaagd.', en: 'Warm, rich and layered.' },
    description: {
      nl: 'Diepe tonen van gekaramelliseerd fruit gaan samen met een zachte, geroosterde warmte. Vol en bijna dessertachtig, met een lange, elegante romige afdronk.',
      en: 'Deep notes of caramelised fruit meet a soft, roasted warmth. Full and almost dessert-like, with a long, elegant creamy finish.',
    },
    profile: {
      nose: todo('neus', 'nose'),
      palate: { nl: 'Gekaramelliseerd fruit, zachte geroosterde warmte', en: 'Caramelised fruit, soft roasted warmth' },
      finish: { nl: 'Lang, elegant en romig', en: 'Long, elegant and creamy' },
      base: todo('ingrediënten', 'ingredients'),
    },
    scales: [75, 85, 85, 30],
    serve: todo('serveertip', 'serving tip'),
    cocktail: { name: todo('naam cocktail', 'cocktail name'), recipe: todo('ingrediënten en bereiding', 'ingredients and method') },
    pairing: todo('pairing', 'pairing'),
  },
  {
    slug: 'floreta',
    name: 'Floreta',
    shopifyHandle: 'floreta',
    character: 'fruitig',
    image: '/images/smaken/floreta.webp',
    abv: null,
    tagline: { nl: 'Bloemig, fruitig en verfijnd.', en: 'Floral, fruity and refined.' },
    description: {
      nl: 'Een zomerse likeur met een frisse opening, zacht rijp fruit en een subtiel bloemige afdronk. Licht en elegant, maar met genoeg karakter om te blijven verrassen.',
      en: 'A summery liqueur with a fresh opening, soft ripe fruit and a subtly floral finish. Light and elegant, with enough character to keep surprising.',
    },
    profile: {
      nose: todo('neus', 'nose'),
      palate: { nl: 'Frisse opening, zacht rijp fruit', en: 'Fresh opening, soft ripe fruit' },
      finish: { nl: 'Subtiel bloemig', en: 'Subtly floral' },
      base: todo('ingrediënten', 'ingredients'),
    },
    scales: [55, 35, 25, 20],
    serve: todo('serveertip', 'serving tip'),
    cocktail: { name: todo('naam cocktail', 'cocktail name'), recipe: todo('ingrediënten en bereiding', 'ingredients and method') },
    pairing: todo('pairing', 'pairing'),
  },
  {
    slug: 'teposo',
    name: 'Teposo',
    shopifyHandle: 'teposo',
    character: 'tropisch',
    image: '/images/smaken/teposo.webp',
    abv: null,
    tagline: { nl: 'Exotisch, fris en pittig.', en: 'Exotic, fresh and spicy.' },
    description: {
      nl: 'Een levendige likeur waarin tropische frisheid en een aangename kruidige warmte elkaar afwisselen. Sappig en verfrissend in de eerste slok, met een subtiele kick die langzaam naar voren komt.',
      en: 'A lively liqueur where tropical freshness and a pleasant spicy warmth take turns. Juicy and refreshing on the first sip, with a subtle kick that slowly comes forward.',
    },
    profile: {
      nose: todo('neus', 'nose'),
      palate: { nl: 'Tropisch fris en sappig', en: 'Tropical, fresh and juicy' },
      finish: { nl: 'Subtiele kruidige kick', en: 'Subtle spicy kick' },
      base: todo('ingrediënten', 'ingredients'),
    },
    scales: [50, 50, 35, 75],
    serve: todo('serveertip', 'serving tip'),
    cocktail: { name: todo('naam cocktail', 'cocktail name'), recipe: todo('ingrediënten en bereiding', 'ingredients and method') },
    pairing: todo('pairing', 'pairing'),
  },
  {
    slug: 'fragaki',
    name: 'Fragaki',
    shopifyHandle: 'fragaki',
    character: 'fruitig',
    image: '/images/smaken/fragaki.webp',
    abv: null,
    tagline: { nl: 'Fruitig, fris en speels.', en: 'Fruity, fresh and playful.' },
    description: {
      nl: 'Sappig rood fruit ontmoet een levendige frisheid, gevolgd door zachte bloemige tonen. Een toegankelijke likeur die bij iedere slok nét iets meer prijsgeeft.',
      en: 'Juicy red fruit meets a lively freshness, followed by soft floral notes. An approachable liqueur that reveals a little more with every sip.',
    },
    profile: {
      nose: todo('neus', 'nose'),
      palate: { nl: 'Sappig rood fruit, levendig fris', en: 'Juicy red fruit, lively and fresh' },
      finish: { nl: 'Zachte bloemige tonen', en: 'Soft floral notes' },
      base: todo('ingrediënten', 'ingredients'),
    },
    scales: [60, 40, 25, 20],
    serve: todo('serveertip', 'serving tip'),
    cocktail: { name: todo('naam cocktail', 'cocktail name'), recipe: todo('ingrediënten en bereiding', 'ingredients and method') },
    pairing: todo('pairing', 'pairing'),
  },
  {
    slug: 'colkina',
    name: 'Colkina',
    shopifyHandle: 'colkina',
    character: 'tropisch',
    image: '/images/smaken/colkina.webp',
    abv: null,
    tagline: { nl: 'Zacht, tropisch en aromatisch.', en: 'Smooth, tropical and aromatic.' },
    description: {
      nl: 'Een volle tropische smaak wordt opgefrist door een verrassend groen en kruidig karakter. Zacht en rond, met een frisse spanning die hem spannend houdt.',
      en: 'A full tropical flavour is lifted by a surprisingly green and herbal character. Smooth and round, with a fresh tension that keeps it interesting.',
    },
    profile: {
      nose: todo('neus', 'nose'),
      palate: { nl: 'Vol tropisch, groen en kruidig', en: 'Full tropical, green and herbal' },
      finish: { nl: 'Zacht en rond, met frisse spanning', en: 'Smooth and round, with fresh tension' },
      base: todo('ingrediënten', 'ingredients'),
    },
    scales: [55, 60, 40, 55],
    serve: todo('serveertip', 'serving tip'),
    cocktail: { name: todo('naam cocktail', 'cocktail name'), recipe: todo('ingrediënten en bereiding', 'ingredients and method') },
    pairing: todo('pairing', 'pairing'),
  },
  {
    slug: 'palmusa',
    name: 'Palmusa',
    shopifyHandle: 'palmusa',
    character: 'tropisch',
    image: '/images/smaken/palmusa.webp',
    abv: null,
    tagline: { nl: 'Vol en verleidelijk.', en: 'Full and seductive.' },
    description: {
      nl: 'Tropisch en zacht van karakter, met warme geroosterde tonen en een verfijnde kruidigheid in de afdronk. Rijk van smaak zonder zijn frisheid te verliezen.',
      en: 'Tropical and smooth in character, with warm roasted notes and a refined spiciness on the finish. Rich in flavour without losing its freshness.',
    },
    profile: {
      nose: todo('neus', 'nose'),
      palate: { nl: 'Tropisch en zacht, warme geroosterde tonen', en: 'Tropical and smooth, warm roasted notes' },
      finish: { nl: 'Verfijnd kruidig', en: 'Refined and spicy' },
      base: todo('ingrediënten', 'ingredients'),
    },
    scales: [65, 75, 65, 50],
    serve: todo('serveertip', 'serving tip'),
    cocktail: { name: todo('naam cocktail', 'cocktail name'), recipe: todo('ingrediënten en bereiding', 'ingredients and method') },
    pairing: todo('pairing', 'pairing'),
  },
  {
    slug: 'silkimi',
    name: 'Silkimi',
    shopifyHandle: 'silkimi',
    character: 'romig',
    image: '/images/smaken/silkimi.webp',
    abv: null,
    tagline: { nl: 'Fluweelzacht, warm en verleidelijk.', en: 'Velvety, warm and seductive.' },
    description: {
      nl: 'Een zijdezachte cream likeur met diepe, geroosterde tonen en een subtiele kruidigheid. Vol en romig van karakter, met een warme afdronk die heerlijk lang blijft hangen.',
      en: 'A silky cream liqueur with deep, roasted notes and a subtle spiciness. Full and creamy in character, with a warm finish that lingers beautifully.',
    },
    profile: {
      nose: todo('neus', 'nose'),
      palate: { nl: 'Zijdezacht, diepe geroosterde tonen', en: 'Silky, deep roasted notes' },
      finish: { nl: 'Warm en lang', en: 'Warm and long' },
      base: todo('ingrediënten', 'ingredients'),
    },
    scales: [80, 90, 80, 30],
    serve: todo('serveertip', 'serving tip'),
    cocktail: { name: todo('naam cocktail', 'cocktail name'), recipe: todo('ingrediënten en bereiding', 'ingredients and method') },
    pairing: todo('pairing', 'pairing'),
  },
];

export function getFlavor(slug: string) {
  return flavors.find((f) => f.slug === slug);
}

/** Aanbevelingen: eerst dezelfde categorie, aangevuld met andere smaken. */
export function getRelated(flavor: Flavor, count = 3) {
  const same = flavors.filter((f) => f.slug !== flavor.slug && f.character === flavor.character);
  const rest = flavors.filter((f) => f.slug !== flavor.slug && f.character !== flavor.character);
  return [...same, ...rest].slice(0, count);
}
