# Iteraatio 5: Raporttinäkymä + Taso 2 (Helmikuu)

**Aloituspäivä:** 2026-05-13
**Valmistui:** 2026-05-13
**Status:** ✅ Valmis
**Vastuuhenkilö:** Marko + Claude Code
**Edellytykset:** Iteraatio 4 valmis ✅

---

## Tavoite

**A** — Automaattinen raporttinäkymä (tuloslaskelma + tase) kirjausten pohjalta  
**D** — Tason 2 alku: ALV useammalla kannalla (13,5 %, 10 %) + käyttöomaisuus + poistot

---

## Valittu toteutus: D + A

---

## Mitä tehtiin

### D — Helmikuun harjoitukset (`src/data/exercises/february.ts`)

9 harjoitusta (monthOffset 3–4), kolmella ALV-kannalla + käyttöomaisuus:

| # | ID | Tyyppi | Uusi asia | Debet | Kredit |
|---|-----|--------|-----------|-------|--------|
| 1 | feb-001 | Myyntilasku 25,5 % | — | 1700 D 2259 | 3000 K 1800 + 2871 K 459 |
| 2 | feb-002 | Kuitti kirja **13,5 %** | ALV-kanta 13,5 % | 8400 D 40 + 2920 D 5,40 | 1910 K 45,40 |
| 3 | feb-003 | Kuitti ravintola **13,5 %** | ravintola-ALV | 8400 D 20 + 2920 D 2,70 | 1910 K 22,70 |
| 4 | feb-004 | Kuitti lehti **10 %** | ALV-kanta 10 % | 8400 D 20 + 2920 D 2 | 1910 K 22 |
| 5 | feb-005 | Ostolasku laptop (25,5 %) | **1200 käyttöomaisuus** | 1200 D 1200 + 2920 D 306 | 2520 K 1506 |
| 6 | feb-006 | Muistiotosite poisto | **7680 kuukausipoisto** | 7680 D 20 | 1200 K 20 |
| 7 | feb-007 | Myyntilasku 25,5 % | — | 1700 D 3012 | 3000 K 2400 + 2871 K 612 |
| 8 | feb-alv-tilitys | **ALV-tilitys** 28.2. | — | 2871 D 1071 | 2920 K 316,10 + 2870 K 754,90 |
| 9 | feb-alv-maksu | **ALV-maksu** 12.3. (kk offset 4) | — | 2870 D 754,90 | 1910 K 754,90 |

ALV-laskelma: suoritettava 459+612=1 071 / vähennettävä 5,40+2,70+2,00+306,00=316,10 / netto 754,90 ✓

### D — Tilikartta (`src/data/accounts/chart-of-accounts.ts`)

- `1200 Koneet ja kalusto` kayttoonotto: **4 → 3** (helmikuu)
- Lisätty `7680 Poistot koneista ja kalustosta` (kulut, kayttoonotto: 3)

### A — Raporttilaskin (`src/utils/reportEngine.ts`)

Uusi puhtaan funktion moduuli:
- `computeTrialBalance(exercises, accounts, maxMonthOffset)` → `AccountBalance[]`  
  Laskee kunkin tilin debet/kredit-yhteissummat kaikista harjoituksista ≤ maxMonthOffset.
- `computeReports(exercises, accounts, maxMonthOffset)` → `FinancialReport`  
  Johtaa tuloslaskelman (tuotot−kulut) ja taseen (vastaavaa vs. vastattavaa+tilikauden tulos).  
  Matemaattinen identiteetti: vastaavaaTotal = vastattavaaBalances + nettoTulos (varmistettu).

### A — Raporttinäkymä (`src/components/ReportView.tsx`)

Uusi `'use client'` -komponentti:
- Kauden valinta (Marraskuu 2026 … Maaliskuu 2027)
- Pääkirja-koeajo: kaikki tilit D/K/saldo-pylväillä + kategoriavärit
- Tuloslaskelma: Liikevaihto − Kulut = Tilikauden voitto/tappio
- Tase: vastaavaa (vasen) + vastattavaa + tilikauden tulos (oikea), tasapaino-tarkistus

### Navigointi (`src/components/DemoTabs.tsx`)

- Tab-tyyppi laajennettu: `'helmikuu' | 'raportit'`
- Helmikuu-välilehti: FebIntro → harjoitusvirtaus → FebSummary  
  FebIntro näyttää ALV-kannat-boksin (25,5 % / 13,5 % / 10 %)
- JanuarySummary sai `onNext`-napin → "Siirry helmikuuhun (Taso 2)"  
- FebSummary sai `onNext`-napin → "Katso raportit"
- Raportit-välilehti renderöi `<ReportView />`

### CSS (`src/app/globals.css`)

- `.feb-intro-alv-rates` + `.feb-intro-rate-row` + `.feb-rate-{25|13|10}` — ALV-kannat-boksi
- `.ns-hero-feb .ns-hero-icon` — violetti teema helmikuun koontiin
- `.report-view`, `.report-header`, `.report-section`, `.report-table` — raportin pohja
- `.report-tase-grid` — kaksipalstainen tase-layout
- `.report-cat-dot` + `.report-cat-{vastaavaa|vastattavaa|tuotot|kulut}` — väripisteet
- `.report-balance-ok` / `.report-balance-err` — tasapainotarkistus-viesti

---

## Onnistumiskriteerit ✅

- [x] TypeScript strict mode — `pnpm tsc --noEmit` puhdas
- [x] ESLint — `pnpm lint` puhdas
- [x] Helmikuu-välilehti: 9 harjoitusta, FebIntro ALV-kantaboksi
- [x] ALV 13,5 % ja 10 %: DocumentCard näyttää oikean ALV-erittelyn
- [x] feb-005: 1200 Koneet ja kalusto aktivoituu (ei 8xxx)
- [x] feb-006: 7680 D / 1200 K poisto toimii
- [x] feb-alv-tilitys: 2871/2920/2870 (samoin kuin tammikuussa)
- [x] Raportit-välilehti: pääkirja + tuloslaskelma + tase näkyvät
- [x] Tase tasapainossa kaikkina kuukausina (balanced: true)
- [x] Kauden valinta muuttaa raporttia oikein

---

## Mitä EI tehty tässä iteraatiossa

- Tason 2 jaksotukset (siirtosaamiset, siirtovelat)
- Opettajan hallintapaneeli
- Autentikointi ja tietokanta
- E2E-testit helmikuulle ja raporteille

---

## Seuraavaksi — alustava Iteraatio 6

### Vaihtoehto A — Maaliskuu: palkat (Taso 2)
- Palkkajaksotus, ennakonpidätys, TyEL
- Tilit: 4200 Palkat, 2910 Ennakonpidätys, 2960 TyEL-velka

### Vaihtoehto B — E2E-testit Helmikuulle + Raporteille
- Playwright-testit helmikuun harjoituksille
- Raporttinäkymän testit (tase tasapainossa, kuukauden valinta)

### Vaihtoehto C — Opettajan hallintapaneeli (MVP)
- Vaatii autentikointi + tietokanta

### Vaihtoehto D — Tason 1 sanasto laajennus (30 → 50 termiä)
- Ryhmät K–P suunnitelman mukaan
