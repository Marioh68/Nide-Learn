# Iteraatio 2: Tositekirjausnäkymä — marraskuun ensimmäiset tositteet

**Aloituspäivä:** _(täyttäkää kun Iteraatio 1 on valmis)_
**Status:** Aloittamatta — odottaa Iteraatio 1:n valmistumista
**Vastuuhenkilö:** Marko + Claude Code
**Edellytykset:** Iteraatio 1 valmis (infrastruktuuri + theme provider + sanastoharjoitus toimii)

---

## Tavoite

Rakentaa **tositekirjausnäkymä**, jossa opiskelija käsittelee Asiakas Tmi:n marraskuun ensimmäiset tositteet kahden vaiheen pedagogisella polulla: **tiliristikko (T-tilit) → muistiotosite**. Iteraation lopussa on toimiva näkymä, jossa opiskelija voi kirjata, tarkistaa ja saada palautteen **8 ainutkertaisesta tositetyypistä** kolmessa teemassa (Nide, Netvisor, Procountor).

Iteraatio ei kata kaikkia marraskuun 17 tositetta — ainoastaan yhden kunkin tositetyypin ensimmäisen esiintymän (pedagogisen järjestyksen vaiheen 1–8). Toistuvat tositteet (vaihe 9) ja koko joulukuu tulevat Iteraatio 3:ssa.

---

## Aikataulu

Alustavasti **2–3 viikkoa**. Iso iteraatio — sisältää useita komponentteja ja tarkistuslogiikan. Jos kestää kauemmin, rajataan sisältöä, ei lisätä uutta.

---

## Pedagogiset päätökset (lukittu)

Lue suunnitelmadokumentin v1.4 luku 11 kokonaan. Tiivistys tähän:

### Tositteen elinkaari — 7 vaihetta

```
[1] LÄHDEDOKUMENTTI (tositekortti)
    ↓
[2] TILIRISTIKKO (käsitteellinen taso, T-tilit)
    ↓
[3] TARKISTUS — tiliristikko
    ↓
[4] MUISTIOTOSITE (käytännön taso, Netvisor- tai Procountor-tyylinen)
    ↓
[5] TARKISTUS — muistiotosite
    ↓
[6] ESIMERKKI JA SELITYS (tarinaan kytkentä)
    ↓
[7] EDISTYMINEN (tositteen status päivittyy)
```

### Tositteiden pedagoginen järjestys (marraskuun 9 vaihetta)

| Vaihe | Tositetyyppi | Kpl tässä iteraatiossa | Pedagoginen tarkoitus |
|-------|--------------|------------------------|------------------------|
| 1 | Yksityissijoitus | 1 | Helpoin: 2 tiliä, ei ALV:tä |
| 2 | Yksityisnosto | 1 (ensimmäinen) | Käänteinen sijoitukselle |
| 3 | Myyntilasku | 1 (ensimmäinen) | Myyntisaaminen + myynti |
| 4 | Kuitti | 1 (ensimmäinen) | Kulu + pankki |
| 5 | Ostolasku — suoramaksu (PixelPro) | 1 | Siirtymä kuiteista ostolaskuihin |
| 6 | Ostolasku — maksuehdolla | 1 (ensimmäinen) | Uusi: ostovelka |
| 7 | Tiliotetapahtuma — myyntisuoritus | 1 (ensimmäinen) | Myyntisaaminen → pankki |
| 8 | Tiliotetapahtuma — ostovelan maksu | 1 | Ostovelka → pankki |
| 9 | Kalenterinäkymä | — | Ei tässä iteraatiossa |

**Yhteensä 8 tositetta tässä iteraatiossa.** Loppu marraskuusta (toistuvat saman tyypin tositteet + kalenterinäkymä) tulee Iteraatio 3:ssa.

### Tarkistuslogiikka

- **Tasapaino reaaliaikaisesti** (debet = kredit -näyttö päivittyy aina)
- **Oikeellisuus pyydettäessä** ("Tarkista"-nappi)
- **Rajaton yritykset**, apu kasvaa:
  - 1. yritys: virhetyyppipalaute
  - 2. yritys: vihje
  - 3. yritys: mikrosisältölinkki
  - 4. yritys+: "Näytä oikea vastaus" -nappi
- Oikeat rivit säilytetään (vihreä), virheet merkitään (punainen, muokattavissa)
- **Status** per tosite: ⚪ Aloittamatta · 🟡 Kesken · ✅ Valmis · ⚠️ Ohitettu
- **Ei pisteytystä Tasolla 1**

### Debet/kredit-konventio

- **Tiliristikko:** erilliset kentät (tili + debet/kredit-radio + summa positiivisena)
- **Muistiotosite:** yksi summa-sarake (debet positiivinen, kredit negatiivinen)
- Opiskelija käyttää **kahta eri konventiota** samasta kirjauksesta — tämä on tarkoituksellista

---

## Vaiheet

### 1. Domain-mallien laajennus

Laajenna Iteraatio 1:n domain-malleja tositteille ja kirjauksille. Käytä suunnitelman v1.4 kohdan 4 domain-mallia pohjana:

```typescript
// Uudet tyypit Iteraatio 2:ssa
interface DocumentTemplate {
  id: string;
  type: 'yksityissijoitus' | 'yksityisnosto' | 'myyntilasku' | 'ostolasku' | 'kuitti' | 'tiliotetapahtuma';
  month: number;          // kk_offset (0 = marraskuu, 1 = joulukuu, ...)
  day: number;            // päivä kuukaudessa
  description: string;    // tarinan konteksti (1-2 lausetta)
  amount: number;
  counterparty?: string;  // asiakas tai toimittaja
  dueDate?: number;       // eräpäivän päivä
  paymentTerm?: string;   // "14 pv netto", "kortin automaattiveloitus"
}

interface CorrectEntry {
  account: string;        // tilinumero, esim. "1910"
  side: 'debet' | 'kredit';
  amount: number;
}

interface DocumentExercise {
  template: DocumentTemplate;
  correctEntries: CorrectEntry[];     // tiliristikon oikea vastaus
  errorMessages: ErrorMessages;       // virhetyyppien viestit (ks. kohta 5)
  orientationQuestions?: string[];    // pohdintakortti (ks. päätös 8)
  example: string;                    // selitys oikean vastauksen jälkeen
}
```

**Tietodata:** Seedaa 8 tositteen data erilliseen tiedostoon (esim. `data/exercises/november-phase1.ts`). Käytä suunnitelman v1.4 lukujen 7 ja 11 tietoja suoraan.

### 2. Tositekortti-komponentti (`<DocumentCard>`)

Näyttää lähdedokumentin opiskelijalle (elinkaaren vaihe 1).

**Vaatimukset:**
- Renderöi tositetyypeittäin erilainen ulkoasu:
  - **Myyntilasku:** teemakohtainen layout (Netvisor/Procountor/Nide-tyylinen). Sisältää: Asiakas Tmi:n tiedot, asiakkaan tiedot, laskun numero, päiväys, eräpäivä, tuoterivi, summa, pankkiyhteys, viitenumero.
  - **Ostolasku:** vaihteleva tyyli per toimittaja. Sisältää: toimittajan tiedot, vastaanottajan tiedot, laskun numero, päiväys, eräpäivä, tuoterivi, summa + ALV-erittely.
  - **Kuitti:** kassakuitti-tyyppinen (liikkeen nimi, pvm, kellonaika, tuoterivi, summa, maksutapa).
  - **Tiliotetapahtuma:** koko tiliote näkyvillä, käsiteltävä rivi korostettu sinisellä reunalla.
  - **Yksityissijoitus / yksityisnosto:** tarina-kortti (tilannekuvaus + pankin siirtokuitti).
- **Klikattavat kentät:** tositekortin kentistä ("Y-tunnus", "Eräpäivä", "Viitenumero" jne.) aukeaa mikrosisältö-popup (lyhyt selitys, A-tason mikrosisältö)
- **Kontekstuaalinen orientointi:** ensimmäisen uuden tositetyypin kohdalla näytetään pohdintakortti (💭 "Pohdi ennen kuin aloitat..."). Kortti näytetään kerran per tositetyyppi, ohitettavissa.
- **Lyhyt tarinan konteksti** (1-2 lausetta) tositekortin yläpuolella

**Tarkoitus:** opiskelija tutustuu tositteeseen ennen kirjausta. Ei syötettävää, pelkkä lukeminen ja tutkiminen.

### 3. Tiliristikko-komponentti (`<LedgerGrid>`)

Käsitteellinen taso — opiskelija rakentaa T-tilit (elinkaaren vaihe 2).

**Vaatimukset:**
- **"Lisää kirjaus" -nappi** avaa rivin:
  - Tili: dropdown tilikartasta (Asiakas Tmi:n 12–15 tiliä Tasolla 1)
  - Puoli: debet / kredit -radionapit
  - Summa: positiivinen numeerinen kenttä
  - Tallenna / Peruuta
- Lisätyt kirjaukset renderöityvät **visuaalisina T-tileinä** (ks. suunnitelman v1.4 kohta 4):
  - T-tilin numero ja nimi yläpuolella
  - Vasen sarake: debet-summat
  - Oikea sarake: kredit-summat
  - Saldo alareunassa
- Useat kirjaukset samalle tilille näkyvät samassa T-tilissä (useita rivejä debet- tai kredit-puolella)
- **Tasapainon reaaliaikainen näyttö** alapalkissa: "Debet yhteensä X € · Kredit yhteensä Y € · Erotus Z €"
- Kirjauksia voi **muokata ja poistaa** klikkaamalla
- **"Tarkista" -nappi** (ks. kohta 5)
- Tilikartta saatavilla sivupalkissa tai modaalina — voi selailla ja etsiä

**Näppäimistötuki:** Tab-navigointi kenttien välillä, Enter lisää kirjauksen.

### 4. Muistiotosite-komponentti (`<JournalEntryForm>`)

Käytännön taso — sama kirjaus syötetään ohjelman ruutuun (elinkaaren vaihe 4).

**Kaksi teemaa, sama domain-malli:**

#### Netvisor-tyylinen muistiotosite
- **Otsikko:** Tositenumero (juokseva) · Tositelaji (MU Muut) · Päiväys · Selite
- **Tositerivit (taulukko):** Tili (suurennuslasi-haku) · Summa (debet+, kredit−) · Riviselite · Lajit (ALV-koodi, esim. "Ei alv-käsittelyä")
- **Tasapaino:** Erotus-kenttä + Debet / Kredit -summat (0,00 / 0,00 → tasapainossa)
- **Automaattinen vastakirjauksen ehdotus:** On/Off -toggle (oletus Off Tason 1:ssä)
- **Päätoiminnot:** Tallenna uusi tosite (vihreä) · Peruuta
- **Ulkoasu:** sininen otsikkopalkki, valkoiset taulukkorivit (ks. Netvisor-referenssikuva)

#### Procountor-tyylinen muistiotosite
- **Tositteen otsikkotiedot:** Nimi · Tunnus · Tositepvm · Kirjauskausi · ALV-tyyppi (Osto/Myynti/Muu) · ALV-status (Kotimaa)
- **Kirjanpitoviennit (taulukko):** Tili · Kp-arvo · ALV-% · ALV · Yhteensä · ALV-väh.% · ALV-tyyppi · ALV-status
- **Toiminnot:** Tallenna (violetti) · Hyväksy · Uusi tosite
- **Ulkoasu:** violetti päävärialue, monisarakkeinen otsikko (ks. Procountor-referenssikuva)

**Yhteinen logiikka:**
- Opiskelija syöttää täsmälleen saman kirjauksen kuin tiliristikolla, mutta **eri muodossa**
- Tiliristikon debet/kredit-radio → muistiotositteen etumerkkikonventio (+ / −)
- Tarkistus samalla logiikalla kuin tiliristikko (kohta 5)
- **Kun opiskelija siirtyy tiliristikolta muistiotositteelle, tiliristikon vastaus EI kopioidu automaattisesti** — opiskelija syöttää uudelleen. Tämä on tarkoituksellista: pedagoginen arvo on kahden eri esitysmuodon oppimisessa.

**Tason 1 yksinkertaistukset:**
- ALV-kentät näkyvissä mutta lukittuja (0 % / "Ei alv-käsittelyä") ennen kk 3:ta
- Tositelaji oletuksena MU Muut (Netvisorissa) tai Muu (Procountorissa)
- Liitteet-paneelia ei tarvita Iteraatio 2:ssa

### 5. Tarkistuslogiikka (`checkExercise()`)

Yhteinen tarkistuslogiikka tiliristikon ja muistiotositteen tarkistuksille.

```typescript
type ErrorType = 'balance' | 'side' | 'account' | 'amount';

interface CheckResult {
  correct: boolean;
  errors: Array<{
    type: ErrorType;
    entryIndex: number;        // mikä rivi
    message: string;           // 1. yrityksen viesti
    hint?: string;             // 2. yrityksen vihje
    microContentId?: string;   // 3. yrityksen mikrosisältölinkki
  }>;
}

function checkExercise(
  studentEntries: StudentEntry[],
  correctEntries: CorrectEntry[],
  attemptNumber: number
): CheckResult;
```

**Tarkistussäännöt:**
1. **Tasapainovirhe:** debet-summa ≠ kredit-summa → yleensä reaaliaikaisesti näkyvillä, mutta tarkistetaan myös
2. **Tilivirhe:** opiskelija on valinnut väärän tilin
3. **Puolen virhe:** oikea tili mutta väärä puoli (debet vs. kredit)
4. **Summavirhe:** oikea tili ja puoli mutta väärä summa

**Tarkistusjärjestys:** tarkista tasapaino ensin, sitten tilit, sitten puolet, sitten summat. Näytä **yksi virheilmoitus kerrallaan** (tärkein ensin), ei listaa kaikista virheistä.

**Hyväksyttävät variantit Tasolla 1:** vain yksi oikea vastaus per tosite. Tarkat oikeat vastaukset seedataan tietomalliin (kohta 1).

**Palauteviestit per virhetyyppi ja yritys:**
- Seedaa tositteen data-malliin (ErrorMessages-kenttä)
- Käytä suunnitelman v1.4 luvun 11 päätös 6 esimerkkejä pohjana
- Vaihe 1 viesti on **abstrakti** (opiskelija pohtii itse)
- Vaihe 2 viesti on **konkreettisempi** (vihje oikeasta suunnasta)
- Vaihe 3 viesti sisältää **mikrosisältölinkin** (avaa mikrosisältö-popup)
- Vaihe 4+ näyttää **"Näytä oikea vastaus"** -napin

### 6. Mikrosisältö-komponentti (`<MicroContent>`)

Näyttää just-in-time-selityksiä kontekstuaalisesti.

**Vaatimukset:**
- Popup tai sivupaneeli, jossa mikrosisällön teksti (100–150 sanaa A-tasolla)
- Avautuu:
  - Tositekortin klikattavista kentistä (Y-tunnus, Eräpäivä jne.)
  - Tarkistuslogiikan 3. yrityksen yhteydessä
  - Vapaaehtoisesti painamalla ℹ️-ikonia tilikartan tilien vieressä
- **Data:** lue mikrosisällöt tiedostosta `data/microcontent/level-1-a.ts` — kopioi sisältö suunnitelman tiedostosta `nide-learn-mikrosisallot-taso1-a.md`
- Sulkeminen: X-nappi tai klikkaa taustaa

### 7. Tarinakortti-komponentit (`<MonthIntro>`, `<DocumentContext>`)

**`<MonthIntro>`** — kuukausitarinakortti:
- Pakollinen kuukauden alussa ennen ensimmäistä tositetta
- Vapaaehtoinen kuukauden lopussa
- Sisältö: lyhyt tarina Asiakas Tmi:stä (ks. suunnitelman v1.4 luku 11 päätös 7)
- "Aloita marraskuun kirjaukset" -nappi sulkee kortin ja avaa ensimmäisen tositteen

**`<DocumentContext>`** — lyhyt kontekstilause per tosite:
- 1-2 lausetta tositekortin yläpuolella
- Esim. "5.11.2026 — Kati saa ensimmäisen tilauksensa: Kahvila Aamu Oy haluaa logosuunnittelun."
- Seedattu tositteen datamalliin (DocumentTemplate.description)

### 8. Edistymisen seuranta (`<ProgressTracker>`)

Näyttää opiskelijan edistymisen marraskuun tositteissa.

**Vaatimukset:**
- Lista tositteista pedagogisessa järjestyksessä
- Jokaisen tositteen status: ⚪ 🟡 ✅ ⚠️
- Nykyinen tosite korostettu
- Klikkaamalla valmista tositetta voi palata katsomaan esimerkkiä
- Seuraava tosite aukeaa kun nykyinen on valmis tai ohitettu
- React state (ei persistenssiä vielä — kuten Iteraatio 1:ssä)

### 9. Demo-sivun laajennus

Laajenna Iteraatio 1:n demo-sivua:
- Lisää navigaatiopalkki: **Sanasto** · **Tositekirjaus** (uusi)
- Tositekirjaus-sivu näyttää:
  - Vasemmalla: `<ProgressTracker>` (tositteiden lista)
  - Keskellä: aktiivinen tosite (`<DocumentCard>` → `<LedgerGrid>` → `<JournalEntryForm>`)
  - Oikealla: `<MicroContent>` (sivupaneeli, avautuu tarvittaessa)
- Teemavalitsija säilyy yläpalkissa (3 painiketta: Nide / Netvisor / Procountor)
- **Teeman vaihto vaihtaa muistiotositteen layoutin** (Netvisor-tyylinen ↔ Procountor-tyylinen)
- Tositekortin myyntilaskut vaihtuvat myös teeman mukaan

### 10. Testaus

- **Yksikkötestit (Vitest):**
  - `checkExercise()` tarkistuslogiikka (kaikki virhetyypit)
  - Tasapainolaskenta
  - Palauteviestin valinta yrityskerran mukaan
- **Komponenttitestit:**
  - Tiliristikko: kirjauksen lisäys, muokkaus, poisto, tasapainon päivitys
  - Muistiotosite: debet/kredit-etumerkkikonventio
  - Tositekortin klikattavat kentät → mikrosisältö avautuu
- **E2E-testi (Playwright):**
  - Yksi kokonainen tositepolku: yksityissijoitus läpi kaikki 7 vaihetta kaikissa 3 teemassa
- **Saavutettavuus:**
  - Tiliristikko toimii näppäimistöllä
  - Screen reader -tarkistus T-tileille
  - Värikoodaus ei ole ainoa erottelija (oikein/väärin)

---

## Onnistumiskriteerit

Iteraatio 2 on valmis kun kaikki seuraavat täyttyvät:

- [ ] Domain-mallit laajennettuna tositteille ja kirjauksille
- [ ] 8 ainutkertaista tositetta seedattuna datamalliin (yksityissijoitus, yksityisnosto, myyntilasku, kuitti, ostolasku-suoramaksu, ostolasku-maksuehto, tiliotetapahtuma-myynti, tiliotetapahtuma-osto)
- [ ] `<DocumentCard>` renderöi 5 eri tositetyyppiä (myyntilasku, ostolasku, kuitti, tiliote, tarina-kortti)
- [ ] `<LedgerGrid>` toimii: lisäys, muokkaus, poisto, T-tilien renderöinti, reaaliaikainen tasapaino
- [ ] `<JournalEntryForm>` toimii Netvisor-teemassa JA Procountor-teemassa
- [ ] Tarkistuslogiikka (`checkExercise`) toimii kaikille virhetyypeille
- [ ] Palautteet kasvavat yrityskerran mukaan (1. abstrakti → 2. vihje → 3. mikrosisältö → 4. näytä vastaus)
- [ ] Mikrosisällöt avautuvat tositekortin kentistä ja tarkistuslogiikan 3. yrityksestä
- [ ] Orientointi-pohdintakortti näkyy ensimmäisellä kerralla per tositetyyppi, ohitettavissa
- [ ] Kuukausitarinakortti näkyy marraskuun alussa (pakollinen ennen ensimmäistä tositetta)
- [ ] Edistymisen seuranta: 8 tositetta listattuna, status päivittyy
- [ ] Kaikki toimii 3 teemassa (Nide, Netvisor, Procountor) ilman sivun uudelleenlatausta
- [ ] Testit: yksikkö, komponentti, E2E (vähintään 1 kokonainen polku)
- [ ] Saavutettavuus: näppäimistö + screen reader
- [ ] Deploy staging-ympäristöön

---

## Mitä EI tehdä tässä iteraatiossa

Pidä rajaus tiukasti:

- ❌ Marraskuun toistuvat tositteet (loput 9 tositetta) — Iteraatio 3
- ❌ Kalenterinäkymä (pedagogisen järjestyksen vaihe 9) — Iteraatio 3
- ❌ Joulukuun tositteet (muuttuvat kulut, edelleenveloitus) — Iteraatio 3
- ❌ Raporttien tulostus (tuloslaskelma, tase) — Iteraatio 3
- ❌ Myyntikatelaskenta — Iteraatio 3
- ❌ ALV-velvollisuus ja kk 3–5 — Iteraatio 4
- ❌ Backend, tietokanta, persistenssi — Iteraatio 3 tai 4
- ❌ Autentikointi (MPASSid, HAKA) — myöhemmin
- ❌ Opettajan dashboard — myöhemmin
- ❌ Liitteet-paneeli muistiotositteessa — myöhemmin
- ❌ Tulosteiden PDF-vienti — myöhemmin
- ❌ Mobiilioptimointi tuotantotasolle — perusnäkymä riittää

---

## Avoimet kysymykset Markolle ennen aloitusta

1. **Oikeat vastaukset per tosite.** Suunnitelmadokumentissa v1.4 on tositteiden summat ja tilit, mutta yksittäisten tositteiden CorrectEntry-data pitää seedata. Onko OK, että Code generoi ne suunnitelman pohjalta, vai haluatko tarkistaa erikseen?

2. **Palauteviestien sanamuodot.** Suunnitelman luvussa 11 (päätös 6) on esimerkit myyntilaskun virhetyypeille. Voiko Code generoida vastaavat viestit muille tositetyypeille samalla kaavalla, vai haluatko kirjoittaa ne itse?

3. **Tiliristikon ja muistiotositteen keskinäinen sijainti ruudulla.** Nykyinen ehdotus: peräkkäin (ensin tiliristikko, sitten muistiotosite kun tiliristikko on tarkistettu). Vai rinnakkain (molemmat näkyvillä, opiskelija täyttää molemmat)?

4. **Procountorin monisarakkeinen ALV-taulukko.** Tasolla 1 ALV on 0 % — pitäisikö ALV-sarakkeet piilottaa vai näyttää tyhjänä? Ehdotus: näytetään tyhjänä (opiskelijalle tutustumisen paikka), mutta lukittuna.

---

## Seuraavaksi: Iteraatio 3 — alustava

Iteraatio 2:n jälkeen luontevat seuraavat:

- Marraskuun loput tositteet (toistuvat tyypit, pedagogisen järjestyksen vaihe 9 kalenterinäkymä)
- Joulukuun 26 tositetta täysmittaisena (sis. muuttuvat kulut, edelleenveloitus)
- Raporttien tulostus (tuloslaskelma + tase ruudulle)
- Myyntikatelaskenta
- ALV-hakeutumisen kysymyspari
- Backend ja persistenssi alkavat (opiskelijan tilan tallennus)

Iteraatio 3:n tarkka sisältö lukitaan, kun Iteraatio 2 on valmis ja opettajapalaute saatu.
