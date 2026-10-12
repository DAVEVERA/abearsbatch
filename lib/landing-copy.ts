import type { Locale } from './i18n';

const nl = {
  hero: {
    eyebrow: 'Ambachtelijke likeur · Batch 01',
    lines: ['Vuur.', 'Tijd.', 'Geduld.'],
    body: 'Acht likeuren, met de hand gemaakt in kleine oplages. Niet om overal hetzelfde te smaken.',
    cta: 'Ontdek de 8 smaken',
    scroll: 'Scroll',
    bottleAlt: 'Fles Epilos, ambachtelijke likeur van A Bear’s Batch',
  },
  manifesto:
    'De meeste likeuren worden op één manier gemaakt. Wij doen het op drie of vier manieren tegelijk, en voegen ze pas aan het einde samen. Meer werk. Maar dat proef je.',
  slider: {
    eyebrow: 'De collectie',
    title: 'Acht karakters',
    hint: 'Swipe of sleep',
    prev: 'Vorige smaak',
    next: 'Volgende smaak',
    view: 'Bekijk',
    of: 'van',
    roledescription: 'carrousel',
  },
  process: {
    eyebrow: 'Het proces',
    title: 'Langzaam, met de hand, zonder kortere weg.',
    steps: [
      { title: 'Proeven', text: '[korte uitleg van De Beer]' },
      { title: 'Drie, vier methodes', text: 'Elke smaak maken we op meerdere manieren tegelijk.' },
      { title: 'Samenvoegen', text: 'Pas aan het einde komt alles samen tot één smaak.' },
      { title: 'Met de hand afgemaakt', text: 'Het etiket zetten we er zelf op. Fles voor fles.' },
    ],
  },
  maker: {
    eyebrow: 'De maker',
    title: 'Gemaakt door De Beer.',
    body: 'Elke fles gaat door onze eigen handen, van de eerste smaaktest tot het etiket dat we er zelf op plakken. Verrassend waar het kan, vertrouwd waar het moet.',
    cta: 'Lees het verhaal',
    alt: 'De Beer, de maker van A Bear’s Batch, met een fles likeur',
  },
  tasting: {
    eyebrow: 'Proefset',
    title: 'Alle acht, in 50 ml.',
    body: 'Voor wie nog niet kan kiezen. Of voor iemand die alles al heeft.',
    cta: 'Bekijk de proefset',
  },
};

type Copy = typeof nl;

const en: Copy = {
  hero: {
    eyebrow: 'Craft liqueur · Batch 01',
    lines: ['Fire.', 'Time.', 'Patience.'],
    body: 'Eight liqueurs, handmade in small batches. Not made to taste the same everywhere.',
    cta: 'Discover the 8 flavours',
    scroll: 'Scroll',
    bottleAlt: "Bottle of Epilos, craft liqueur by A Bear's Batch",
  },
  manifesto:
    'Most liqueurs are made one way. We make ours three or four ways at once, and only bring them together at the very end. More work. But you can taste it.',
  slider: {
    eyebrow: 'The collection',
    title: 'Eight characters',
    hint: 'Swipe or drag',
    prev: 'Previous flavour',
    next: 'Next flavour',
    view: 'View',
    of: 'of',
    roledescription: 'carousel',
  },
  process: {
    eyebrow: 'The process',
    title: 'Slowly, by hand, no shortcuts.',
    steps: [
      { title: 'Tasting', text: '[short explanation by De Beer]' },
      { title: 'Three or four methods', text: 'We make every flavour several ways at once.' },
      { title: 'Bringing it together', text: 'Only at the very end does it all become one flavour.' },
      { title: 'Finished by hand', text: 'We put every label on ourselves. Bottle by bottle.' },
    ],
  },
  maker: {
    eyebrow: 'The maker',
    title: 'Made by De Beer.',
    body: 'Every bottle passes through our own hands, from the first tasting to the label we stick on ourselves. Surprising where it can be, familiar where it should be.',
    cta: 'Read the story',
    alt: "De Beer, the maker of A Bear's Batch, holding a bottle of liqueur",
  },
  tasting: {
    eyebrow: 'Tasting set',
    title: 'All eight, in 50 ml.',
    body: 'For anyone who can’t choose yet. Or for someone who has everything.',
    cta: 'View the tasting set',
  },
};

export function getLandingCopy(locale: Locale): Copy {
  return locale === 'nl' ? nl : en;
}
export type LandingCopy = Copy;
