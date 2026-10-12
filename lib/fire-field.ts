/**
 * Stromingsveld voor de vuur- en asdeeltjes.
 *
 * Geen DOM en geen React: puur rekenwerk, zodat het los van de browser na te rekenen is.
 *
 * De kern is een curl-noise veld. Alle deeltjes lezen hetzelfde, langzaam evoluerende
 * veld, dus buren krijgen vergelijkbare richtingen: dat geeft stromen in plaats van los
 * zand. Omdat de snelheid de curl van een scalair potentiaal is, is het veld
 * divergentievrij en ontstaan wervels vanzelf — die hoeven niet gescript te worden.
 *
 * Daarbovenop:
 * - gust(): trage wind die aanzwelt en wegvalt, met zeldzame harde vlagen.
 * - buoyancy: hete deeltjes stijgen hard, koelen af en verliezen hun lift.
 * - drag: traagheid, zodat deeltjes het veld niet exact volgen maar doorschieten.
 *   Juist dat doorschieten maakt dat ze om een wervel heen draaien in plaats van erin
 *   te vallen.
 */

// --- Ruis -------------------------------------------------------------------

/** Deterministische hash naar [-1, 1). Math.imul houdt het op 32-bits. */
function hash(ix: number, iy: number, iz: number, seed: number): number {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(iz, 1442695041) ^ Math.imul(seed, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 2147483648 - 1;
}

/** Smoothstep: zachte overgang tussen roosterpunten, geen knikken. */
const fade = (t: number) => t * t * (3 - 2 * t);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 3D value noise. De derde as is tijd, zodat het veld evolueert in plaats van schuift. */
export function noise3(x: number, y: number, z: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const fx = fade(x - xi);
  const fy = fade(y - yi);
  const fz = fade(z - zi);

  const n000 = hash(xi, yi, zi, seed);
  const n100 = hash(xi + 1, yi, zi, seed);
  const n010 = hash(xi, yi + 1, zi, seed);
  const n110 = hash(xi + 1, yi + 1, zi, seed);
  const n001 = hash(xi, yi, zi + 1, seed);
  const n101 = hash(xi + 1, yi, zi + 1, seed);
  const n011 = hash(xi, yi + 1, zi + 1, seed);
  const n111 = hash(xi + 1, yi + 1, zi + 1, seed);

  const x00 = lerp(n000, n100, fx);
  const x10 = lerp(n010, n110, fx);
  const x01 = lerp(n001, n101, fx);
  const x11 = lerp(n011, n111, fx);

  return lerp(lerp(x00, x10, fy), lerp(x01, x11, fy), fz);
}

/** 1D value noise, voor de windvlagen. */
export function noise1(x: number, seed: number): number {
  const xi = Math.floor(x);
  const f = fade(x - xi);
  return lerp(hash(xi, 0, 0, seed), hash(xi + 1, 0, 0, seed), f);
}

// --- Veld -------------------------------------------------------------------

/**
 * Scalair potentiaal. Twee octaven: grote wervels waar het oog de stroom in volgt,
 * plus kleinere eddies die de randen onrustig houden.
 */
function potential(x: number, y: number, t: number, seed: number): number {
  return noise3(x, y, t, seed) + noise3(x * 2.4, y * 2.4, t * 1.7, seed + 101) * 0.45;
}

/** Afstand waarover de afgeleide wordt benaderd, in veldeenheden. */
const EPS = 0.16;

export type Vec = { x: number; y: number };

/**
 * Curl van het potentiaal: (dPsi/dy, -dPsi/dx).
 * Schrijft in `out` om allocaties per deeltje per frame te vermijden.
 */
export function curl(x: number, y: number, t: number, seed: number, out: Vec): Vec {
  const dpdy = potential(x, y + EPS, t, seed) - potential(x, y - EPS, t, seed);
  const dpdx = potential(x + EPS, y, t, seed) - potential(x - EPS, y, t, seed);
  const inv = 1 / (2 * EPS);
  out.x = dpdy * inv;
  out.y = -dpdx * inv;
  return out;
}

/**
 * Windsterkte op moment `t` (seconden), in px/s^2.
 * Een trage basis plus een derde-machts piek: meestal bijna windstil, af en toe
 * een vlaag. De macht zorgt dat sterke vlagen zeldzaam zijn in plaats van ritmisch.
 */
export function gust(t: number, seed: number): number {
  const base = noise1(t * 0.055, seed + 11);
  const spike = Math.max(0, noise1(t * 0.21, seed + 57));
  return base * 0.55 + spike * spike * spike * 1.6;
}

// --- Deeltjes ---------------------------------------------------------------

export const EMBER = 0;
export const ASH = 1;

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Leeftijd in seconden. */
  life: number;
  /** Levensduur in seconden. */
  max: number;
  kind: typeof EMBER | typeof ASH;
  /** Straal in px. */
  size: number;
  /** Persoonlijke afwijking op de lift, zodat niet alles even hard stijgt. */
  buoy: number;
  /** Traagheid: laag = zweeft lang door, hoog = volgt het veld strak. */
  drag: number;
  /** Rotatie van asdeeltjes. */
  spin: number;
  spinV: number;
  /** Eigen fase voor het flikkeren. */
  phase: number;
};

export type FieldConfig = {
  /** Sterkte van het stromingsveld, px/s^2. */
  flow: number;
  /** Ruimtelijke schaal: hoeveel veldeenheden per pixel. Kleiner = grotere wervels. */
  scale: number;
  /** Hoe snel het veld zichzelf hertekent. */
  timeScale: number;
  /** Maximale windbijdrage, px/s^2. */
  gustAmp: number;
  /** Lift van een vers, heet deeltje, px/s^2. */
  buoyancy: number;
  /** Zwaartekracht op as, px/s^2. */
  gravity: number;
  seed: number;
};

export const defaultConfig: FieldConfig = {
  flow: 190,
  scale: 1 / 420,
  timeScale: 0.12,
  gustAmp: 110,
  buoyancy: 430,
  gravity: 26,
  seed: 1337,
};

/**
 * Hoeveel lift een deeltje nu nog heeft. Vers is heet en stijgt hard, daarna koelt
 * het af en zakt de lift weg — dat levert het snelheidsverschil over de levensduur.
 */
export function heatOf(p: Particle): number {
  if (p.kind === ASH) return 0;
  const k = p.life / p.max;
  const cooled = 1 - k;
  return cooled <= 0 ? 0 : cooled * cooled * cooled * Math.sqrt(cooled);
}

const flowVec: Vec = { x: 0, y: 0 };

/**
 * Eén integratiestap. `dt` in seconden, `t` in seconden sinds start.
 * Expliciet dt-gebaseerd: op een 120Hz-scherm moet dit even snel lopen als op 60Hz.
 */
export function stepParticle(p: Particle, cfg: FieldConfig, t: number, dt: number): void {
  curl(p.x * cfg.scale, p.y * cfg.scale, t * cfg.timeScale, cfg.seed, flowVec);

  // As is zwaarder en laat zich minder door de stroming meenemen dan een vonk.
  const carry = p.kind === ASH ? 0.55 : 1;
  const wind = gust(t, cfg.seed) * cfg.gustAmp;

  const ax = flowVec.x * cfg.flow * carry + wind * carry;
  const ay = flowVec.y * cfg.flow * carry - cfg.buoyancy * heatOf(p) * p.buoy + (p.kind === ASH ? cfg.gravity : 0);

  // Semi-impliciete demping: snelheid kruipt naar de doelsnelheid toe.
  p.vx += (ax - p.vx * p.drag) * dt;
  p.vy += (ay - p.vy * p.drag) * dt;

  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.spin += p.spinV * dt;
  p.life += dt;
}

/** Pseudo-gauss uit drie trekkingen: bron is dicht in het midden, ijl aan de randen. */
function bell(rand: () => number): number {
  return (rand() + rand() + rand()) / 1.5 - 1;
}

export type SpawnArea = {
  /** Horizontaal midden van de vuurbron, 0..1 van de breedte. */
  cx: number;
  /** Spreiding van de bron, 0..1 van de breedte. */
  spread: number;
  width: number;
  height: number;
};

/**
 * Nieuw deeltje bij de bron. `seeded` verdeelt het eerste veld over het scherm,
 * zodat er bij het laden niet eerst een lege lucht staat.
 */
export function spawn(area: SpawnArea, seeded: boolean, rand: () => number = Math.random): Particle {
  const ember = rand() < 0.58;
  const max = ember ? 4.2 + rand() * 4.2 : 10 + rand() * 8;
  const x = (area.cx + bell(rand) * area.spread) * area.width;

  // Vers deeltje start onder de rand; bij het eerste veld staat het al ergens omhoog.
  const startY = area.height + 20 + rand() * 60;
  const progress = seeded ? rand() : 0;

  return {
    x,
    y: seeded ? area.height * (1 - progress) + bell(rand) * 40 : startY,
    vx: bell(rand) * 34,
    vy: ember ? -(130 + rand() * 170) : -(20 + rand() * 45),
    life: seeded ? progress * max : 0,
    max,
    kind: ember ? EMBER : ASH,
    size: ember ? 0.7 + rand() * 1.5 : 1 + rand() * 2.1,
    buoy: 0.6 + rand() * 0.85,
    drag: ember ? 0.8 + rand() * 0.7 : 1.5 + rand() * 0.9,
    spin: rand() * Math.PI * 2,
    spinV: bell(rand) * 1.6,
    phase: rand() * Math.PI * 2,
  };
}

/** Buiten beeld of opgebrand. */
export function isDead(p: Particle, width: number, height: number): boolean {
  return p.life >= p.max || p.y < -80 || p.y > height + 140 || p.x < -140 || p.x > width + 140;
}

/**
 * Zichtbaarheid over de levensduur: snel aan, traag uit.
 * Een vonk is meteen fel en dooft geleidelijk; dat leest als afkoelen.
 */
export function alphaOf(p: Particle): number {
  const k = p.life / p.max;
  if (k >= 1) return 0;
  const rise = Math.min(1, k / 0.06);
  const fall = 1 - k;
  return rise * fall * fall;
}
