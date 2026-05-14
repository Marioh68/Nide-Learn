# Iteraatio 6 — E2E-testit + Opettajan paneeli (MVP)

**Status:** ✅ Valmis  
**Haara:** `claude/nifty-brattain-bce543`

---

## Tavoite

B: Playwright E2E -testit Helmikuulle ja Raporteille.  
C: Opettajan hallintapaneeli (frontend MVP) — välilehtien näkyvyyden hallinta + tasovalinta.

---

## Mitä tehtiin

### B — E2E-testit

**`e2e/helmikuu.spec.ts`**
- FebIntro: otsikko + ALV-kannat-boksi (25,5 % / 13,5 % / 10,0 %)
- DocumentCard feb-002: `ALV 13,5 %` suomenkielisellä desimaalimerkillä
- DocumentCard feb-004: `ALV 10 %`
- feb-005 käyttöomaisuus: oikea vastaus 1200 D / 2920 D / 2520 K hyväksytään
- feb-006 poisto: kortti näyttää 20 € ja tyypin Muistiotosite

**`e2e/raportit.spec.ts`**
- Kolme osiota näkyvissä: Pääkirja-koeajo, Tuloslaskelma, Tase
- `✓ Tase tasapainossa` näkyy oletuksena (Helmikuu)
- `#report-month-sel` -valitsin toimii, oletusvaihtoehto on Helmikuu
- Marraskuu-valinta: 2870 ei näy (ALV alkaa vasta Tammikuussa)
- Tammikuu: 2871 näkyy
- Helmikuu: 7680 ja 1200 näkyvät
- Tase tasapainossa kaikilla 5 kuukausivalinnalla

**`e2e/teacher-panel.spec.ts`**
- Opettaja-nappi headerissa, avaa dialogin
- Sulkeminen: ✕-nappi, Escape, backdrop-klikkaus
- Välilehtien piilottaminen poistaa tab-palkista
- Piilotuksen peruuttaminen palauttaa välilehden
- Viimeistä näkyvää välilehteä ei voi piilottaa
- Tasonvalitsimen 4 painiketta, Taso 1 oletuksena aktiivinen
- Tason vaihto päivittää kuvauksen

**`src/components/DocumentCard.tsx` — korjaus**
- `{vatRate} %` → `{vatRate.toLocaleString('fi-FI')} %`
- Korjaa: `13.5 %` (pistepiste) → `13,5 %` (pilkku suomenkielisessä näkymässä

### C — Opettajan paneeli

**`src/contexts/TeacherContext.tsx`** — React Context
- `TabId` tyyppi + `ALL_TABS` järjestys
- `TeacherProvider` + `useTeacher` hook
- State: `visibleTabs: TabId[]` (oletuksena kaikki) + `activeLevel: 1|2|3|4`

**`src/components/TeacherPanel.tsx`** — sivupaneeli
- Checkbox-lista kaikille 6 välilehdelle
- Viimeistä näkyvää välilehteä ei voi poistaa (suojaus)
- Tasonvalitsin 1–4 (valinnan muutos päivittää kuvauksen)
- Escape sulkee, backdrop sulkee
- Demo-ilmoitus: "asetukset eivät tallennu"

**`src/components/PageContent.tsx`** — wrapperi
- `TeacherProvider` + `Inner` (client component)
- Lisää "Opettaja"-napin headeriin `page-header-actions`-diviin
- `TeacherPanel` renderöidään tässä

**`src/components/DemoTabs.tsx`** — päivitykset
- Importoi `useTeacher` + `TabId`
- Tab-palkin napit generoidaan `visibleTabs`-arraystä TAB_LABELS-mappauksella
- `effectiveTab = visibleTabs.includes(tab) ? tab : visibleTabs[0] ?? 'sanasto'`
- Kaikki 6 välilehteä (myös Helmikuu + Raportit) renderöidään `effectiveTab`-ehdolla

**`src/app/page.tsx`** — yksinkertaistettu
- `DemoPage` renderöi suoraan `<PageContent />`

---

## Mitä EI tehty

- Autentikointi (opettaja vs. opiskelija) → Iteraatio 7
- Asetusten tallennus tietokantaan → Iteraatio 7
- Opiskelijasessioiden seuranta → Iteraatio 7+
- Taso 3/4 harjoitukset → tuleva iteraatio

---

## Seuraavaksi — Iteraatio 7

Vaihtoehtoja Markon kanssa päätettäväksi:

**A** — Autentikointi (Better Auth tai NextAuth) + opettaja/opiskelija-roolit  
**B** — Tietokanta (PostgreSQL + Prisma) + sessioiden tallennus  
**C** — tRPC API-kerros + Server Actions  
**D** — Taso 3 harjoitukset (palkat, käännetty verovelvollisuus)
