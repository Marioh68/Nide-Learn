# Iteraatio 1: Infrastruktuuri + Theme Provider + Sanastoharjoitus

**Aloituspäivä:** 12.5.2026
**Status:** Vaiheet 1–5 valmis — odotetaan opettajapalautetta
**Vastuuhenkilö:** Marko + Claude Code
**Staging-URL:** https://nide-learn.vercel.app/

---

## Tavoite

Rakentaa Nide Learn -projektin perusinfrastruktuuri ja toteuttaa **sanastoharjoitus-komponentti** kolmella vaihdettavalla teemalla (Nide-oletus, Netvisor-tyylinen, Procountor-tyylinen). Iteraation lopussa on toimiva web-sovellus, jossa opiskelija voi tehdä Tason 1 sanastoharjoituksen, ja teema voidaan vaihtaa lennossa.

Iteraation tarkoitus on **todistaa teema-arkkitehtuurin toimivuus** yhden konkreettisen komponentin kautta. Backend, autentikointi ja persistenssi tulevat seuraavissa iteraatioissa.

---

## Aikataulu

Alustavasti **1–2 viikkoa**. Pidetään realistisena: jos kestää kauemmin, syy selvitetään ja iteraation rajaus säädetään, ei lisätä uusia tavoitteita kesken.

---

## Vaiheet

### 1. Repon ja kehitysympäristön perustus

1. Luo Git-repo (GitHub-organisaatio: `nide-solutions` tai vastaava, repo: `nide-learn`)
2. Lisää `.gitignore`, `LICENSE` (Anthropic ei määrittele, Marko valitsee — ehdotus: yksityinen, ei lisenssiä)
3. Kopioi `CLAUDE.md` repon juureen
4. Luo `docs/`-kansio, kopioi sinne `nide-learn-suunnitelma-v1.2.md` ja tämä tiedosto
5. Lisää `README.md` joka antaa lyhyen yhteenvedon tuotteesta ja kehitysohjeet
6. Aseta CI/CD-perusta (GitHub Actions: linterin ja testin ajaminen pull requesteissa)

### 2. Pinon asennus ja vahvistus

1. **Vahvista pinon valinnat Markolta** ennen kuin asennat. Suunnitelman ehdotus:
   - Next.js 15 + TypeScript (strict mode)
   - Tailwind CSS + shadcn/ui
   - Vitest yksikkötestaukseen
   - Playwright E2E-testaukseen myöhemmin
2. Asenna Next.js + TypeScript -pohjaprojekti (`pnpm create next-app`, suosi pnpm:ää npm:n sijaan)
3. Konfiguroi TypeScript strict mode ja path aliases (`@/components/*`, `@/lib/*`)
4. Asenna Tailwind CSS ja shadcn/ui (`pnpm dlx shadcn@latest init`)
5. Asenna Vitest ja kirjoita yksi sanity-testi (`expect(1 + 1).toBe(2)`) — varmista että ajaminen onnistuu CI:ssä

### 3. Theme provider -mekaniikka

**Tämä on iteraation tärkein osa.** Theme providerin pitää olla niin joustava, että uusien teemojen lisääminen myöhemmin on triviaalia.

#### Vaatimukset
- Kolme teemaa alusta lähtien: `nide` (oletus, neutraali), `netvisor` (Netvisor-tyylinen), `procountor` (Procountor-tyylinen)
- Teema valitaan kontekstilla, ei prop-tasolla — kerran asetetaan, kaikki komponentit reagoivat
- Teemavalitsija on vasta **demo-sivulla** Iteraatio 1:ssä, ei tuotantokäyttöön
- Teeman vaihtuminen ei vaadi sivun uudelleenlatausta
- Teemat eroavat **vähintään** näiltä osin:
  - Värit (primary, secondary, accent, background, text)
  - Typografia (otsikko- ja body-fontti)
  - Spacing (kompakti vs. ilmava)
  - Komponenttityyli (esim. nappien pyöreys)

#### Toteutusehdotus
- React Context (`<ThemeProvider>` komponentti)
- Tailwind CSS variableiden päälle, jotka vaihdetaan dynaamisesti class-attribuutilla `<html data-theme="netvisor">`
- Teemamääritykset erillisissä CSS-tiedostoissa (`themes/nide.css`, `themes/netvisor.css`, `themes/procountor.css`)
- Theme provider -hookilla: `useTheme()` palauttaa nykyisen teeman ja `setTheme()`-funktion

#### Suunnitteluviitteet
- **Netvisor-tyylinen:** referenssikuvat suunnitelman luvussa 3 (sininen päävärialue, otsikkopalkki, valkoiset taulukot, sinisen tihkuvat painikkeet)
- **Procountor-tyylinen:** referenssikuvat suunnitelman luvussa 3 (violetti päävärialue, taulukkomainen otsikkokenttä, "Tallenna"-nappi violetti, kentät vaalealla taustalla)
- **Nide-oletus:** Markon valinnan mukaan — ehdotetaan rauhallinen, professionaalinen tyyli (esim. Fraunces-otsikot + DM Sans -body, vihreä aksentti #1A4D3A). Tämä on jo HTML-prototyypissä `nide-learn-sanasto-harjoitus2.html` — käytä sitä referenssinä Nide-oletuksen tyylille

### 4. Sanastoharjoitus-komponentti

Siirrä HTML-prototyyppi (`nide-learn-sanasto-harjoitus2.html`) React-komponentiksi.

#### Vaatimukset
- Komponentti `<VocabularyExercise>` joka renderöi koko sanastoharjoituksen
- Tukee Tason 1 sanastoa (30 termiä, käsipari-rakenne)
- Toimii kaikissa kolmessa teemassa
- Klikkaa-ja-yhdistä -mekaniikka (sama kuin prototyypissä)
- Värikoodatut parit
- Tarkistus + esimerkki-näkymä oikean parin jälkeen
- Erien välillä siirtyminen (3 erää)
- Lopputulosnäyttö

#### Tietorakenne
Sanaston data (30 termiä) erilliseen tiedostoon, esim. `data/vocabulary/level-1.ts`:

```typescript
export type VocabularyPair = {
  id: string;
  term: string;
  definition: string;
  example: string;
};

export type VocabularyPhase = {
  id: string;
  title: string;
  intro: string;
  pairs: VocabularyPair[];
};

export const level1Vocabulary: VocabularyPhase[] = [
  // Erä 1: Kirjanpidon ydinkäsitteet (6 paria)
  // Erä 2: Tositteet ja raportit (6 paria)
  // Erä 3: Toiminimen erityispiirteet (3 paria)
  // ... lue suunnitelman luku 8 lopulliselle sisällölle
];
```

**Huom:** Suunnitelmassa v1.2 luku 8 sisältää 30 termin sanaston. Käsipari-termit (esim. "Myynti vs. Myyntisaaminen") esitetään **kahtena erillisenä parina** sanastossa (yksi "Myynti" ja yksi "Myyntisaaminen"), koska parinmuodostus on yksittäistermi → määritelmä -tasolla. Käsiparit ovat pedagoginen rakennelma, ei tekninen.

Iteraatio 1:ssä riittää aloittaa **15 termin alkupaketilla** (suunnitelman v1.1 alkuperäinen sanasto, ennen käsiparilaajennusta) — laajennetaan 30:een Iteraatio 2:ssa kun käsipari-rakenne on tarkasti toteutettu. Tarkista tämä Markolta ennen aloitusta.

#### Tilanhallinta
- React state (useState) — ei tallennusta vielä Iteraatio 1:ssä
- Kun ohjelma suljetaan, edistyminen häviää (sama kuin HTML-prototyypissä) — tämä on hyväksyttävä rajaus, persistenssi tulee Iteraatio 2:ssa

#### Saavutettavuus
- Klikkaus-yhdistäminen pitää toimia näppäimistöllä (Tab + Enter/Space)
- ARIA-attribuutit oikein
- Värikoodaus ei ole ainoa erottelija (lisää myös tekstit/numerot pareihin)

### 5. Demo-sivu

Yksinkertainen sivu joka näyttää sanastoharjoituksen ja teemavalitsijan.

#### Vaatimukset
- URL: esim. `/demo` tai `/`
- Yläpalkissa teemavalitsija (3 painiketta: Nide / Netvisor / Procountor) — tämä on vain demo-tarkoitukseen, **ei tuotantokäyttöön**
- Sanastoharjoitus renderöityy nykyisessä teemassa
- Teeman vaihto vaihtaa harjoituksen ulkonäön välittömästi
- Yksinkertainen header ja footer

#### Vältä
- Älä rakenna täyttä navigaatiota tai layoutia tässä iteraatiossa
- Älä lisää muita sivuja
- Älä tee mobiili-erikoisuuksia ennen kuin perusnäkymä toimii

### 6. Deploy ja jakaminen

1. Vie Vercel:iin (tai Markon valitsema alusta)
2. Aseta development-, staging- ja production-ympäristöt
3. Jaa staging-URL Markolle, joka jakaa sen 2–3 opettajakontaktilleen palautetta varten
4. Kerää opettajien palaute → mahdolliset korjaukset Iteraatio 2:n alussa

---

## Onnistumiskriteerit

Iteraatio 1 on valmis kun **kaikki** seuraavat täyttyvät:

- [x] Repo perustettu, CI/CD toimii (linter ja testi ajaa pull requesteissa)
- [x] Pinon valinnat vahvistettu Markon kanssa ja asennettu
- [x] Theme provider toimii: kolme teemaa (Nide, Netvisor, Procountor), vaihtuminen lennossa, ei sivun uudelleenlatausta
- [x] Sanastoharjoitus-komponentti rakennettu (15 termiä, 3 erää — vahvistettu Markolta)
- [x] Sanastoharjoitus toimii kaikissa kolmessa teemassa
- [x] Demo-sivu deployattu Verceliin — https://nide-learn.vercel.app/
- [ ] Vähintään yksi opettajakontakti on testannut sivun ja antanut palautteen
- [ ] Saavutettavuus: harjoituksen voi tehdä näppäimistöllä, screen reader -tarkistus tehty

---

## Mitä EI tehdä tässä iteraatiossa

Pidä rajaus tiukasti. Nämä tulevat myöhemmissä iteraatioissa:

- ❌ Backend, API, tietokanta — ei vielä mitään persistenssiä
- ❌ Autentikointi (MPASSid, HAKA, Entra ID) — myöhemmin
- ❌ Käyttäjähallinta, kurssit, opettajan dashboard
- ❌ Tositekirjaus-näkymä (muistiotosite) — Iteraatio 2 tai 3
- ❌ Tiliristikko-komponentti
- ❌ Asiakas Tmi:n tilikartan tarkka päivitys Liikekirjuri-numerointiin (tämä tehdään chat-projektissa, ei Codessa)
- ❌ Tositteiden seedaus (marraskuu, joulukuu) — Iteraatio 2
- ❌ Mikrosisältö-modulit — myöhemmin
- ❌ Hinnoittelumalli, sopimuspohjat
- ❌ Procountor- ja Netvisor-teemoille tarkat värit/typografiat lopullisen brändineuvottelun jälkeen — niiden viimeistelyä ei tehdä ennen kuin Marko vahvistaa
- ❌ Mobiilioptimointi tuotantotasolle — perusnäkymä riittää

Jos kohtaat tarpeen tehdä jotain näistä iteraation aikana, **pysähdy**, kysy Markolta, ja ehdota lykkäystä Iteraatio 2:een.

---

## Avoimet kysymykset Markolle ennen aloitusta

Pyydä Markoa vastaamaan näihin chat-projektissa ennen kuin aloitat:

1. **Pinon vahvistus.** Hyväksytkö Next.js + TypeScript + Tailwind + shadcn/ui + Vitest? Vai onko mielessä toinen pino?
2. **Hosting ja domain.** Mikä Git-isäntä (GitHub Organization vai Personal)? Mihin deployataan (Vercel, Netlify, oma hosting)?
3. **Sanaston laajuus Iteraatio 1:ssä.** Aloitanko 15 termillä (helpompi, nopea valmis) vai 30 termillä (kattava heti)? Suosittelen 15:tä, mutta sinun valinta.
4. **Nide-oletusteeman tyyli.** Kopioidaanko HTML-prototyypin tyyli (Fraunces + DM Sans + vihreä aksentti) vai aloitetaanko siitä mutta suunnitellaan uudelleen?
5. **Käännösavainten käyttö.** Yhden kielen (suomen) sovelluksena alusta, vai rakennetaan jo nyt i18n-rakenne (next-intl)? Suosittelen jälkimmäistä — sitä on hankalampi lisätä myöhemmin.

---

## Seuraavaksi: Iteraatio 2 — alustava katsaus

Iteraatio 1:n jälkeen seuraavat luonteva askeleet:

- **Backend ja persistenssi:** PostgreSQL + Prisma, käyttäjien autentikointi, harjoitusten tilan tallennus
- **Sanaston laajennus 30 termiin** käsipari-rakenteella (jos aloitettiin 15:llä)
- **Käyttäjäroolit:** opiskelija, opettaja
- **Opettajan kurssin luonti:** valitse tasot, asetukset, opiskelijoiden kutsuminen
- **Sanastoharjoituksen edistymisen tallennus** käyttäjäkohtaisesti

Iteraatio 2:n tarkka sisältö lukitaan, kun Iteraatio 1 on valmis ja opettajapalaute saatu.
