# Iteraatio 3: Marraskuun loput tositteet + Joulukuu

**Aloituspäivä:** 2026-05-13
**Valmistui:** 2026-05-13
**Status:** ✅ Valmis — PR #3 auki, odottaa mergausta
**Vastuuhenkilö:** Marko + Claude Code
**Edellytykset:** Iteraatio 2 valmis ja mergattu masteriin ✅

---

## Tavoite

Lisätään marraskuun loput 9 tositetta (vaihe 2) sekä koko joulukuu (26 tositetta),
yhdistetään ne yhdeksi opiskeluvirraksi DemoTabsissa, ja tehdään kuukausien välinen
siirtymä alkusaldoineen pedagogisesti selkeäksi.

---

## Valittu toteutus: B + C

Markolta vahvistettu valinta:

- **B** — Marraskuun loput tositteet (phase 2, 9 kpl)
- **C** — Joulukuun tositteet (26 kpl)

---

## Mitä tehtiin

### 1. `src/data/exercises/november-phase2.ts` (uusi)

9 marraskuun loppua tositetta kronologisessa järjestyksessä:

| # | ID | Tyyppi | Tili D | Tili K | Huomio |
|---|-----|--------|--------|--------|--------|
| 9 | 2026-002 | Myyntilasku (Aalto) | 1700 | 3000 | |
| 10 | kuitti-tankki24-001 | Kuitti polttoaine | 8400 | 1910 | |
| 11 | 2026-003 | Myyntilasku (Vehka) | 1700 | 3000 | |
| 12 | kuitti-halpatukku-001 | Kuitti tarralappuja | **4000** | 1910 | myyntiin! |
| 13 | tx-779 | Ostolasku TyöterveysX | 8400 | 2520 | |
| 14 | yn-002 | Yksityisnosto | 2080 | 1910 | |
| 15 | 2026-004 | Myyntilasku (Tähti) | 1700 | 3000 | |
| 16 | tiliote-003 | Tiliote Aalto/2026-002 | 1910 | 1700 | |
| 17 | kuitti-netcom-001 | Kuitti NetCom 4G | 8390 | 1910 | |

### 2. `src/data/exercises/december.ts` (uusi)

30 joulukuun tositetta. Avaustilanteen tase 1.12.2026:
- 1910 Pankkitili: 6 199,10 €
- 1700 Myyntisaamiset: 2 900,00 € (avoimet: 2026-003 + 2026-004)
- 2520 Ostovelat: 351,40 € (avoin: TX-779)

Sisältää uutuutena:
- **Edelleenveloituslaskut** (2026-005, 2026-006): 3-riviset kirjaukset, 3000 + 3010 kredit
- **4500 Ulkopuoliset palvelut**: Painotalo Vire (muuttuvat alihankintakulut)
- Marraskuun avointen erien sulkeutuminen (tiliotekirjaukset)
- Laskuja joiden eräpäivä on tammikuun puolella (avoimet erät vuodenvaihteessa)

### 3. `src/components/DemoTabs.tsx`

- Marraskuu yhdistää phase1 + phase2 → **17 harjoitusta** yhdessä virrassa
- Uusi **Joulukuu-välilehti** omalla intro/harjoitukset/koonti-tilarakenteella
- `NovemberSummary`: 17-rivinen koonti, alkusaldoruutu (1910/1700/2520), "Siirry joulukuuhun →" -nappi
- `DecemberIntro`: selittää alkusaldot ja 4500-tilin käyttöönoton
- `DecemberSummary`: kertaa edelleenveloituksen ja 4500 vs 4000 -erottelun

### 4. Aiemmista commiteista tässä PR:ssä (iteraatio 2:n loppukorjaukset)

- Netvisor-form uusi ulkoasu: tummansininen otsikko, yksittäinen summasarake (+ debet / − kredit)
- Desimaalipilkku ja miinusmerkki korjattu kaikissa formeissa (`rawAmounts` local state)
- Harjoitus 4 korjattu: 8400 toimistotarvikkeille (ei 4000)
- Tiliristikon kategoriabadget (tase/tuloslaskelma)

---

## Onnistumiskriteerit ✅

- [x] TypeScript strict mode — `pnpm tsc --noEmit` puhdas
- [x] ESLint — `pnpm lint` puhdas
- [x] Marraskuu 17 tositteen yhtenäinen virta toimii
- [x] NovemberSummary näyttää kaikki 17 kirjausta ja alkusaldot
- [x] "Siirry joulukuuhun" -nappi siirtää oikeaan välilehteen
- [x] DecemberIntro näyttää alkusaldot
- [x] 3-riviset edelleenveloituskirjaukset (2026-005, 2026-006) hyväksyttävissä
- [x] 4500-tilikäyttö (Painotalo Vire) selitetty oikein
- [x] PR #3 auki mergausta varten

---

## Mitä EI tehty tässä iteraatiossa

- ALV-rekisteröityminen (tulee myöhemmin, kuukausi 3:n alusta)
- Tuloslaskelma- / tase-raportit (Vaihtoehto A)
- Myyntikatelaskenta (Vaihtoehto D)
- Autentikointi ja tietokanta (Iteraatio 5+)

---

## Seuraavaksi — alustava Iteraatio 4

Luontevia jatkovaiheita (Marko valitsee):

### Vaihtoehto A — Raporttinäkymä (tuloslaskelma + tase)
Marraskuu + joulukuu kirjauksista lasketaan automaattisesti:
- Tuloslaskelma: tuotot − kulut = tulos
- Tase: vastaavaa = vastattavaa
- Opiskelija näkee kuinka yksittäiset kirjaukset muodostavat lopullisen tilinpäätöksen

### Vaihtoehto B — ALV-rekisteröityminen (kuukausi 3)
- ALV-hakeutuminen tammikuun alusta (monthOffset 2)
- Ensiostot ALV:n kanssa: 4000/1910 ja ALV-tili (2939)
- Myyntilasku ALV:lla: 3000 + 2939

### Vaihtoehto C — Sanasto laajennus
- Tason 1 sanasto on 15 termiä → laajennettavissa 30:een
- Uusia käsitteitä: edelleenveloitus, ulkopuoliset palvelut, alkusaldo, avoin erä

### Vaihtoehto D — Opettajan näkymä (hallintapaneeli)
- Opettaja valitsee aktiiviset tasot kurssille
- Avauskuukauden asetus (dynaamiset päivämäärät)
- Vaatii tietokanta + autentikointi → isompi työ
