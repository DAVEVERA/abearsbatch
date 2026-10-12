# Ralph Loop State

status: paused — wacht op visuele beoordeling door gebruiker
iteration: 4
max_iterations: 10
started_at: 2026-10-12T00:00:00Z
task: Achtergrondanimatie met vuur- en asdeeltjes die opdwarrelen vanuit een onzichtbare vuurbron, achter de hele landingspagina. Motion-eisen: coherente flows, snelheidsverschillen, af en toe een kolk, wind die aanzwelt en wegvalt, "patroon maar geen patroon". Niet te zwaar.

## Besluiten van de gebruiker

- Bereik: één vast canvas achter de complete /nl-landingspagina (niet per sectie).
- prefers-reduced-motion: zachte variant (vertraagd, gedempt, minder deeltjes, geen gusts) in plaats van stilstand.

## Completion Criteria

- [x] Stromingsveld levert aantoonbaar coherente flows — cos=0,88 op 25px, ~0 op 1080px
- [x] Kolken/vortices ontstaan aantoonbaar — rotatie p95/mediaan = 3,3x; zichtbaar in stroomlijnrender
- [x] Gusts variëren over tijd — 26% windstil, 6,2% vlagen, max/mediaan = 7x
- [x] Snelheid verschilt over de levensduur — 247 px/s vroeg vs 131 px/s laat = 1,88x
- [x] Deeltjes komen uit een bron onderaan, vuur zelf niet getekend
- [x] Frame-rate onafhankelijk — 60Hz vs 120Hz wijkt 3,7px af na 2s
- [x] tsc + lint + build slagen
- [x] Geen onbedoelde bestandswijzigingen
- [ ] Framebudget gemeten in de echte browser — GEBLOKKEERD, zie hieronder
- [ ] Visueel akkoord van de gebruiker — vereist zijn oordeel

## Blokkade

De browser-extensie reageert niet meer betrouwbaar (CDP-timeouts, geblokkeerde
screenshots) en het MCP-tabblad staat op de achtergrond, waardoor
requestAnimationFrame niet loopt. Live meten van fps en framekosten kan daardoor niet
vanuit deze sessie. Verificatie is daarom numeriek gedaan plus headless gerenderd naar
PNG; het eindoordeel over hoe het beweegt ligt bij de gebruiker.

## Iteration Log

### Iteration 0

Repo geïnspecteerd. Bestaande `EmberField` (Hero + FlavorSlider): vaste vy per deeltje,
één sinus-wiebel, geen gedeeld veld, geen gusts, frame-count gebaseerd,
`createRadialGradient` per deeltje per frame.

### Iteration 1

Plan: `lib/fire-field.ts` — curl-noise flowveld, gusts, buoyancy, drag. Puur rekenwerk.
Verificatie: 8 numerieke checks in Node.
Resultaat: 6/8. Divergentiecheck was een testfout (stapgrootte kwam niet overeen met
die van curl() zelf); snelheidsverschil te zwak (1,42x).

### Iteration 2

Testfout hersteld (zelfde stap als curl), buoyancy 290 -> 520.
Verificatie: 8/8. Divergentie exact 0,0000 — bevestigt een echt curl-veld.

### Iteration 3

Renderer gebouwd (`FireBackground.tsx`) en ingebouwd op de landingspagina; secties
doorzichtig gemaakt zodat het canvas erdoorheen leest. Oude EmberField verwijderd.
Bug gevonden: canvas bleef 1x1 omdat getBoundingClientRect() in een verborgen tabblad
nul teruggeeft. Vervangen door window.innerWidth/innerHeight + window-resize.

### Iteration 4

Headless naar PNG gerenderd (eigen PNG-encoder, alleen Node-ingebouwde modules) omdat
de browser niet meewerkte. Twee echte problemen gezien:
- deeltjes lazen als sterren: te wit en te gelijkmatig verdeeld;
- de wervels uit het veld waren niet terug te zien in de banen, want de verhoogde
  buoyancy duwde deeltjes er dwars doorheen.
Opgelost door niet te schipperen tussen lift en stroming, maar de uitworpsnelheid bij
de bron te verhogen (deeltjes worden weggeworpen en remmen af): flow 150 -> 190,
buoyancy 520 -> 430, vy bij spawn -(40..110) -> -(130..300), lift dooft als cooled^3.5.
Daarnaast warmer kleurverloop en uitrekken langs de bewegingsrichting.
Verificatie: 8/8, snelheidsverschil 1,88x. Renders tonen een pluim met zichtbare
snelheidsverschillen.

Volgende stap: gebruiker laat kijken, daarna afstemmen op zijn oordeel.

---

## Ronde 2 — herontwerp landingspagina

status: afgerond, wacht op visuele beoordeling
Besluiten gebruiker: Bodoni Moda + Inter; alleen English-schakelaar uit de header;
bruine balk volledig laten overlopen.

### Iteration 5

Rode markeringen uit de screenshot één voor één aan code gekoppeld. Logo-assets:
beide bronbestanden bleken dekkend (geen alfakanaal), dus op de donkere header zou
een crème rechthoek ontstaan. Transparante, bone-getinte varianten afgeleid uit het
eigen artwork met sharp (luminantie-keying, papier 228 -> alfa 0, inkt 62 -> alfa 1).
Volledige lockup op headerhoogte bleek 64x56px en onleesbaar; daarom beeldmerk in de
header met het wordmerk als echte tekst in Bodoni Moda, en de volledige lockup in de
footer waar wel hoogte is.

### Iteration 6

Eyebrows, 01/08-teller, swipe-hint en scroll-cue verwijderd; bijbehorende dode code
(pad(), interacted-state) opgeruimd. Sectie-achtergronden en scheidingslijnen weg.
Knoppen herbouwd als .btn-base/.btn-primary/.btn-on-dark met veegvulling, meelopende
pijl, lift en reduced-motion-guard.

### Iteration 7

Visueel nagelopen: harde naad gevonden op elke sectiegrens. Oorzaak was de
grain-overlay die per sectie stond; waar twee secties met verschillende grain elkaar
raakten viel een zichtbare stap. Vervangen door één doorlopende vaste laag.
Footer gaf eveneens een kleurstap; nu verloop vanaf de paginakleur.

### Openstaand

- Mobiele weergave niet visueel geverifieerd: resize_window kreeg het paginavenster
  niet versmald (innerWidth bleef 1920). Header is wel defensief krapper gezet met
  een nieuwe xs-breakpoint op 360px.
- Next heeft geen metric-overrides voor Bodoni Moda ("Failed to find font override
  values"), dus een kleine tekstsprong bij het inladen blijft mogelijk.
- Geen font-preloadlinks in de gebouwde HTML; fonts starten pas na de CSS.
