# Iteraatio 7 — Päiväkirja + Maaliskuu (Taso 3) + Opettajan kirjautuminen

**Status:** 🔄 Työn alla  
**Haara:** `claude/nifty-brattain-bce543`

---

## Tavoite

A: Opettajan kirjautuminen (yksinkertainen salasana, Server Action, ei DB).  
D: Maaliskuun harjoitukset (Taso 3) — palkat ja sotumaksut.  
Päiväkirja: Uusi välilehti, jossa kaikki harjoitusten `correctEntries` kronologisessa järjestyksessä. Tilinumero on klikattava → avaa TiliristikkoModal (T-tili visualisoituna).

---

## Mitä tehtiin

### A — Opettajan kirjautuminen

**`src/actions/teacher.ts`** — Server Action
- `verifyTeacherPassword(password)` — vertaa `TEACHER_PASS` ympäristömuuttujaan
- Jos `TEACHER_PASS` ei ole asetettu, kirjautuminen ei koskaan onnistu
- Palautus: `Promise<boolean>`

**`src/components/TeacherPanel.tsx`** — päivitys
- Uudet props: `authenticated: boolean` + `onAuthenticated: () => void`
- Ei autentikoitu → näyttää salasanalomakkeen
- Autentikoitu → näyttää välilehti/tasoasetukset kuten ennen
- Salasanavirhe → "Väärä salasana." ilmoitus

**`src/components/PageContent.tsx`** — päivitys
- Lisätty `teacherAuth` state
- `Opettaja`-nappulalla `tp-toggle-authed`-luokka kun kirjautunut (visuaalinen merkintä)

**`.github/workflows/ci.yml`** — päivitys
- Lisätty `TEACHER_PASS: e2etest` E2E-testeille

**`playwright.config.ts`** — päivitys
- `reuseExistingServer: !process.env.CI`
- `env: { TEACHER_PASS: process.env.TEACHER_PASS ?? 'e2etest' }`

### D — Maaliskuu (Taso 3): palkat

**`src/data/accounts/chart-of-accounts.ts`** — päivitys
- Lisätty palkka-tilit (kayttoonotto: 4):
  - `2910 Palkkavelka`
  - `2960 Ennakonpidätysvelka`
  - `2970 Sosiaaliturvamaksuvelka`
  - `5000 Palkat ja palkkiot`
  - `5300 Työnantajan sotumaksut`

**`src/data/exercises/march.ts`** — UUSI (9 harjoitusta)

| Harjoitus | Uusi asia | Debet | Kredit |
|---|---|---|---|
| mar-001 | Myyntilasku 25,5 % | 1700 D 1 882,50 | 3000 K 1 500 / 2871 K 382,50 |
| mar-002 | Kuitti toimistotarv. | 8400 D 10 / 2920 D 2,55 | 1910 K 12,55 |
| mar-003 | **Palkkakirjaus** (brutto 1500) | 5000 D 1 500 | 2960 K 375 / 2910 K 1 125 |
| mar-004 | **Sotumaksukirjaus** (2 %) | 5300 D 30 | 2970 K 30 |
| mar-005 | Palkanmaksu (tiliote) | 2910 D 1 125 | 1910 K 1 125 |
| mar-006 | EPL + sotu tilitys | 2960 D 375 / 2970 D 30 | 1910 K 405 |
| mar-007 | Tasapoisto (jatkuu) | 7680 D 20 | 1200 K 20 |
| mar-alv-tilitys | ALV-tilitys | 2871 D 382,50 / 2920 K 2,55 | 2870 K 379,95 |
| mar-alv-maksu | ALV-maksu (offset 5) | 2870 D 379,95 | 1910 K 379,95 |

**Palkkakirjauksen logiikka:**
- Bruttopalkka = ennakonpidätys + nettopalkat: 1 500 = 375 + 1 125
- Ennakonpidätys 25 % × 1 500 = 375
- Sotumaksu 2 % × 1 500 = 30

**`src/contexts/TeacherContext.tsx`** — päivitys
- `TabId` laajennettu: lisätty `'maaliskuu'` ja `'paivakirja'`
- `ALL_TABS` 6 → 8 välilehteä

### Päiväkirja + TiliristikkoModal

**`src/components/TiliristikkoModal.tsx`** — UUSI
- Props: `{ account, onClose, exercises, maxMonthOffset }`
- Näyttää T-ristikkovisualisoinnin yhdelle tilille
- Vasen puoli: Debet-kirjaukset (pvm + summa)
- Oikea puoli: Kredit-kirjaukset
- Alaosa: Saldo (D/K)
- Sulkeminen: ✕-nappi tai Escape

**`src/components/PaivakirjaView.tsx`** — UUSI
- Kaikki `correctEntries` kaikista harjoituksista, järjestetty (monthOffset, day)
- Kausi-valitsin (`#pv-month-sel`), oletus: maaliskuu
- Sarakkeita: Pvm, Tyyppi, Vastapuoli, Tili, Debet, Kredit
- Tilinumero = klikattava nappi → avaa `TiliristikkoModal`
- Alatunniste: "✓ Päiväkirja tasapainossa" (invariantti)

**`src/components/DemoTabs.tsx`** — päivitys
- Importoitu `marchExercises`, `PaivakirjaView`
- Lisätty maaliskuu-tila + handlerit
- Lisätty `MarIntro` (palkkarakenne-boksi) + `MarSummary`
- FebSummary "Seuraava" → maaliskuu (ei raportit)

**`src/components/ReportView.tsx`** — päivitys
- Lisätty `marchExercises` ALL_EXERCISES-joukkoon
- MONTH_OPTIONS 5 → 6 (lisätty huhtikuu, offset 5)

### E2E-testit

**`e2e/teacher-panel.spec.ts`** — päivitys
- Kirjautumistestit: lomake näkyy, väärä salasana → virhe, nappi disabled tyhjällä kentällä
- Tab-testit siirretty "vaatii kirjautumisen" -suiteen, joka käyttää `TEACHER_PASS ?? 'e2etest'`
- Välilehtien lukumäärä päivitetty 6 → 8

**`e2e/maaliskuu.spec.ts`** — UUSI
- MarIntro: otsikko + palkkarakenne-boksi
- mar-003 palkkakirjaus: tositekortti (1500, Pekka Korhonen), oikea vastaus hyväksytään
- mar-004 sotumaksu: tositekortti (30, Verohallinto)

**`e2e/paivakirja.spec.ts`** — UUSI
- Päiväkirja-välilehti: otsikko, sarakkeet, tasapaino
- Kuukausivalinta: marraskuu ei sisällä 2871, maaliskuu sisältää 5000
- Tasapaino kaikilla 6 kuukausivalinnalla
- TiliristikkoModal: avautuu tilinumeroa klikkaamalla, sisältää D/K-puolet, sulkeutuu Escapella ja ✕:llä

**`e2e/raportit.spec.ts`** — päivitys
- Tasapaino-testi kattaa nyt kaikki 6 kuukausivaihtoehtoa (lisätty index '5')
- Lisätty testi: maaliskuu sisältää 5000 Palkat

---

## Mitä EI tehty

- Tietokanta-tallennus (asetukset nollautuvat sivun päivityksessä) → tuleva iteraatio
- Opettaja vs. opiskelija -roolihallinta → tuleva iteraatio
- Taso 3: käännetty verovelvollisuus, YEL → tuleva iteraatio
- Taso 4 → tuleva iteraatio

---

## Seuraavaksi — Iteraatio 8

Vaihtoehtoja Markon kanssa päätettäväksi:

**A** — Tietokanta (PostgreSQL + Prisma) + sessioiden tallennus  
**B** — Taso 3 jatko: käännetty verovelvollisuus (ALV 0 %, EU-hankinnat)  
**C** — Opiskelija-sessio: edistyminen tallennetaan (ilman kirjautumista, esim. localStorage → myöhemmin DB)  
**D** — Parempi opettajapaneeli: kurssikoodin generointi, opiskelijalistojen hallinta
