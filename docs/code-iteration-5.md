# Iteraatio 5 — Helmikuu (Taso 2) + Raporttinäkymä

**Status:** ✅ Valmis  
**Haara:** `claude/nifty-brattain-bce543`

---

## Tavoite

Laajentaa demo Taso 2:lle: useampi ALV-kanta, käyttöomaisuuden aktivointi ja tasapoisto.  
Lisätä raporttinäkymä, joka laskee tuloslaskelman ja taseen automaattisesti kirjausten pohjalta.

---

## Mitä tehtiin

### D — Helmikuu-välilehti (9 harjoitusta)

| Harjoitus | Uusi asia | Debet | Kredit |
|---|---|---|---|
| feb-001 | Myyntilasku 25,5 % | 1700 D 2 259 | 3000 K 1 800 / 2871 K 459 |
| feb-002 | Kuitti kirja **ALV 13,5 %** | 8400 D 40 / 2920 D 5,40 | 1910 K 45,40 |
| feb-003 | Kuitti ravintola 13,5 % | 8400 D 20 / 2920 D 2,70 | 1910 K 22,70 |
| feb-004 | Kuitti lehti **ALV 10 %** | 8400 D 20 / 2920 D 2,00 | 1910 K 22,00 |
| feb-005 | Laptop **käyttöomaisuus** (1200) | 1200 D 1 200 / 2920 D 306 | 2520 K 1 506 |
| feb-006 | **Tasapoisto** 7680/1200 | 7680 D 20 | 1200 K 20 |
| feb-007 | Myyntilasku 25,5 % | 1700 D 3 012 | 3000 K 2 400 / 2871 K 612 |
| feb-alv-tilitys | ALV-tilitys helmikuulta | 2871 D 1 071 / 2920 K 316,10 | 2870 K 754,90 |
| feb-alv-maksu | ALV-maksu 12.3. (offset 4) | 2870 D 754,90 | 1910 K 754,90 |

**ALV-laskennan tarkistus:**
- Suoritettava 2871: 459 + 612 = **1 071,00**
- Vähennettävä 2920: 5,40 + 2,70 + 2,00 + 306,00 = **316,10**
- Netto 2870: 1 071,00 − 316,10 = **754,90** ✓

**Tilikarttamuutokset:**
- `1200 Koneet ja kalusto`: `kayttoonotto` 4 → **3** (Helmikuu)
- Lisätty: `7680 Poistot koneista ja kalustosta` (`kayttoonotto: 3`)

**FebIntro:** ALV-kannat-boksi värikoodattuina (sininen 25,5 % · vihreä 13,5 % · oranssi 10,0 %)

### A — Raporttinäkymä

**`src/utils/reportEngine.ts`** — puhdas funktiomoduuli (ei Reactia):
- `computeTrialBalance(exercises, accounts, maxMonthOffset)` — kumulatiiviset saldot
- `computeReports(...)` — tuloslaskelma + tase + `taseBalanced` -tarkistus
- Tase-invariantti: `vastaavaaTotal = vastattavaaTotal + nettoTulos`

**`src/components/ReportView.tsx`** — "Raportit"-välilehti:
- Kuukauden valinta `#report-month-sel` (5 vaihtoehtoa)
- Pääkirja-koeajotaulukko kategoriapisteineen
- Tuloslaskelma (LIIKEVAIHTO / KULUT / Tilikauden tulos)
- Tase (kahden sarakkeen grid, `✓ Tase tasapainossa`)

### Navigaatio

Tammikuun koonti → **"Siirry helmikuuhun (Taso 2) →"**  
Helmikuun koonti → **"Katso raportit →"**

---

## Seuraavaksi — Iteraatio 6

**B** — E2E-testit Helmikuulle + Raporteille  
**C** — Opettajan hallintapaneeli MVP (frontend, ei auth/DB)
