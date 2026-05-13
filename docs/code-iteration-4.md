# Iteraatio 4: Sanasto laajennus + ALV-rekisteröityminen

**Aloituspäivä:** 2026-05-13
**Valmistui:** 2026-05-13
**Status:** ✅ Valmis — sisältyy PR #3:een
**Vastuuhenkilö:** Marko + Claude Code
**Edellytykset:** Iteraatio 3 valmis ✅

---

## Tavoite

Laajennetaan Taso 1:n sanasto 15:stä 30 termiin (suunnitelma v1.4 luku 9, ryhmät A–J)
ja lisätään tammikuun ALV-harjoitukset (monthOffset 2) ALV-rekisteröitymisen jälkeiseltä
ensimmäiseltä kuukaudelta.

---

## Valittu toteutus: C + B

- **C** — Sanasto 15 → 30 termiä
- **B** — ALV-rekisteröityminen, tammikuu 2027

---

## Mitä tehtiin

### C — Sanasto (`src/data/vocabulary/level-1.ts`)

Lisättiin 3 uutta vaihetta, yhteensä 30 termiä:

| Vaihe | Termit | Suunnitelma-ryhmä |
|-------|--------|-------------------|
| 4. Pääoma, tilit ja käsiparit | Pääoma · Kirjanpitotili · Pankkitili · Myynti · Osto | A6, B, C1, D1 |
| 5. Kulut, menot ja tositetyypit | Aineet ja tarvikkeet · Kulu · Meno · Tuloutus · Kuitti | D2, E, F, G3 |
| 6. Laskutus ja ALV | Laskun päiväys · Eräpäivä · Maksuehto · ALV · AVL | H, J |

### B — ALV-harjoitukset (`src/data/exercises/january.ts`)

10 tammikuun harjoitusta (monthOffset 2), ALV-kanta 25,5 %:

| # | ID | Tyyppi | Debet | Kredit |
|---|-----|--------|-------|--------|
| 1 | jan-001 | Myyntilasku Kahvila Aamu | 1700 D 1506 | 3000 K 1200 + 2871 K 306 |
| 2 | jan-002 | Ostolasku PixelPro (kortti) | 8390 D 80 + 2920 D 20,40 | 1910 K 100,40 |
| 3 | jan-003 | Kuitti Tankki24 | 8400 D 40 + 2920 D 10,20 | 1910 K 50,20 |
| 4 | jan-004 | Myyntilasku Aalto | 1700 D 2510 | 3000 K 2000 + 2871 K 510 |
| 5 | jan-005 | Ostolasku Cloudia | 8390 D 240 + 2920 D 61,20 | 2520 K 301,20 |
| 6 | jan-006 | Myyntilasku Kustannus Vehka | 1700 D 1882,50 | 3000 K 1500 + 2871 K 382,50 |
| 7 | jan-007 | Kuitti Halpa-Tukku (4000) | 4000 D 80 + 2920 D 20,40 | 1910 K 100,40 |
| 8 | jan-008 | Myyntilasku Tähti | 1700 D 1004 | 3000 K 800 + 2871 K 204 |
| 9 | jan-alv-tilitys | **ALV-tilitys** 31.1. | 2871 D 1402,50 | 2920 K 112,20 + 2870 K 1290,30 |
| 10 | jan-alv-maksu | **ALV-maksu** 12.2. | 2870 D 1290,30 | 1910 K 1290,30 |

### Tekniset muutokset

- `src/types/exercises.ts`: lisätty `vatRate?: number` DocumentTemplateen + `'muistiotosite'` DocumentTypeen
- `src/components/DocumentCard.tsx`: ALV-erittely (veroton / ALV % / yhteensä) kun `vatRate` asetettu; `muistiotosite`-tyyppi lisätty TYPE_LABELSiin
- `src/components/DemoTabs.tsx`: Tammikuu-välilehti (JanuaryIntro, harjoitusvirtaus, JanuarySummary); "Siirry tammikuuhun →" -nappi joulukuun koontiin
- `src/app/globals.css`: `doc-card-muistiotosite`, `doc-alv-breakdown`-layout, `jan-intro-alv-box`, `ns-hero-jan`
- `e2e/yksityissijoitus.spec.ts`: korjattu kahdesta strict mode -virheestä (exact match, luokkanimi)

---

## Onnistumiskriteerit ✅

- [x] TypeScript strict mode — `pnpm tsc --noEmit` puhdas
- [x] ESLint — `pnpm lint` puhdas
- [x] Sanasto: 6 vaihetta, 30 termiä, kaikki renderöityvät
- [x] Tammikuu-välilehti: JanuaryIntro näyttää ALV-tilit, 10 harjoitusta toimii
- [x] 3-riviset ALV-kirjaukset tarkistuvat oikein
- [x] DocumentCard näyttää ALV-erittelyn vatRate-tositeille
- [x] ALV-tilitys (muistiotosite-tyyppi) toimii
- [x] E2E-testit vihreällä

---

## Mitä EI tehty tässä iteraatiossa

- Tuloslaskelma- / tase-raportit
- Helmikuun ALV-jatkumo (kk 4)
- Opettajan hallintapaneeli
- Autentikointi ja tietokanta

---

## Seuraavaksi — alustava Iteraatio 5

Luontevia jatkovaiheita (Marko valitsee):

### Vaihtoehto A — Raporttinäkymä (tuloslaskelma + tase)
Marraskuu–joulukuu tai kumulatiivinen näkymä:
- Automaattinen tuloslaskelma kirjausten pohjalta
- Taseen rakenne (vastaavaa = vastattavaa)
- Pedagoginen yhteys kirjausten ja tilinpäätöksen välillä

### Vaihtoehto B — Helmikuu ALV-jatkumo (kk 4)
- Sama rakenne kuin tammikuu mutta enemmän itsenäisyyttä
- ALV-erien kertyminen + tiliote-maksut

### Vaihtoehto C — Opettajan hallintapaneeli (MVP)
- Kuukauden valinta, aktiiviset tasot
- Vaatii autentikointi + tietokanta (isompi työ)

### Vaihtoehto D — Tason 2 alku (AMK)
- ALV useammalla kannalla (13,5 %, 0 %)
- Käyttöomaisuus (tili 1200)
