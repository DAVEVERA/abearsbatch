import type { Locale } from './i18n';

const nl = {
  hero: {
    eyebrow: 'Ambachtelijke likeur · Batch 01',
    lines: ['Vuur.', 'Tijd.', 'Geduld.'],
    body: 'Acht likeuren, met de hand gemaakt in kleine oplages. Niet om overal hetzelfde te smaken.',
    cta: 'Ontdek de 8 smaken',
    scroll: 'Scroll',
    bottleAlt: 'Zeven flessen A Bear’s Batch op een houten blok: Colkina, Epilos, Floreta, Fragaki, Silkimi, Teposo en Haktiri',
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
      {
        title: 'Proeven',
        text: 'Elke smaak begint in de keuken. We zoeken combinaties die je niet verwacht, proeven bij en beginnen opnieuw tot het klopt. Geen bestaand recept: pas als een smaak ons zelf verrast, gaat hij door.',
      },
      {
        title: 'Drie, vier methodes',
        text: 'De meeste likeuren worden op één manier gemaakt. Wij infuseren vaak op drie of vier manieren tegelijk, omdat elk ingrediënt zijn eigen tempo heeft. Zo halen we eruit wat er echt in zit.',
      },
      {
        title: 'Samenvoegen',
        text: 'Pas aan het einde komen die losse delen samen tot één smaak. Dat is het moment waarop blijkt of het werkt: het verschil tussen lekker en even blijven zitten.',
      },
      {
        title: 'Met de hand afgemaakt',
        text: 'We snijden het fruit, filteren, bottelen en plakken elk etiket zelf. Echte ingrediënten, geen onnodige kleur- of smaakstoffen. Geen machines, kleine batches, fles voor fles.',
      },
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
    bottleAlt: "Seven bottles of A Bear's Batch on a wooden block: Colkina, Epilos, Floreta, Fragaki, Silkimi, Teposo and Haktiri",
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
      {
        title: 'Tasting',
        text: 'Every flavour starts in the kitchen. We look for combinations you would not expect, taste, and begin again until it is right. No existing recipe: a flavour only moves on once it surprises us.',
      },
      {
        title: 'Three or four methods',
        text: 'Most liqueurs are made one way. We often infuse three or four ways at once, because every ingredient has its own pace. That is how we draw out what is really in there.',
      },
      {
        title: 'Bringing it together',
        text: 'Only at the very end do those separate parts become a single flavour. That is the moment it shows whether it works: the difference between nice and worth staying for.',
      },
      {
        title: 'Finished by hand',
        text: 'We cut the fruit, filter, bottle and apply every label ourselves. Real ingredients, no needless colourings or flavourings. No machines, small batches, bottle by bottle.',
      },
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
