# Nide Learn — Claude Code -ohjeet

Tämä tiedosto on Coden custom instructions koko projektin ajan. Lue tämä ja viitatut dokumentit aina istunnon alussa.

---

## 1. Mikä projekti on

**Nide Learn** on Nide Solutions Oy:n kirjanpidon oppimisalusta. Tuote on eriytetty Nide Master -tuoteperheestä (joka palvelee tilitoimistoja).

**Asiakassegmentit:**
- Toisen asteen oppilaitokset (liiketoiminnan PT)
- Ammattikorkeakoulut (tradenomikoulutus)
- Yliopistot (laskentatoimi, taloushallinto)
- Isot tilitoimistot — uusien työntekijöiden perehdytys

**Hankkeen vetäjä:** Marko (Nide Solutions Oy), kirjanpidon opettaja. Validoi sisältöä omilla kursseillaan.

**Työrytmi:** Iteratiivinen. Pedagoginen suunnittelu ja sisältö tehdään chat-projektissa (Project Knowledge -työtilassa). Tekninen toteutus tehdään tässä Code-projektissa. Suunnitelmadokumentti `docs/nide-learn-suunnitelma-vX.Y.md` on **autoritatiivinen lähde** ja toimii siltana näiden välillä.

---

## 2. Lue ensin

Joka istunnon alussa:

1. **Tämä `CLAUDE.md`** — operatiiviset ohjeet
2. **`docs/nide-learn-suunnitelma-vX.Y.md`** — uusin suunnitelmaversio (tarkista `docs/`-kansio uusimman version löytämiseksi)
3. **Aktiivinen iteraatio `docs/code-iteration-N.md`** — se, mikä on nyt työn alla

Suunnitelmadokumentti on iso (n. 5000 sanaa) ja kattaa strategiat, asiakassegmentit, sisältöarkkitehtuurin, demoyrityksen tositteet, sanaston, pedagogiset periaatteet, UI-konventiot ja teknisen arkkitehtuurin alustavasti. **Lue se kerran istunnon alussa kokonaan**, älä vain etsi avainsanoja — yhtenäinen ymmärrys on tärkeä.

---

## 3. Lukitut päätökset (kriittisin osa)

Nämä eivät muutu ilman keskustelua Markon kanssa chat-projektissa. Jos koodisi ehdottaa eroavaa ratkaisua, kysy ennen kuin etenet.

### Tuoterakenne
- **Yksi demoyritys:** Asiakas Tmi (Kati Mäkinen), graafinen suunnittelija, toiminimi
- **Pankin nimi:** Nide Bank (oma fiktiivinen) — käytä tätä kaikkialla, älä todellisia pankkeja
- **Tilikartta:** Liikekirjuri-pohjainen yleinen suomalainen konventio. Asiakas Tmi:n tilikartan tarkat numerot pitää päivittää Liikekirjuriin (suunnitelmassa v1.2:ssa olevat 7xxx-tilit ovat **vanhentuneita**, korvaa 8xxx-sarjalla Liikekirjurin mukaisesti — esim. 8400-sarja muille hallintokuluille)

### UI-teemat — kaksi rinnakkaista
- **Netvisor-tyylinen** — referenssikuvat saatu Markolta
- **Procountor-tyylinen** — referenssikuvat saatu Markolta
- Brändineuvottelut Visman ja Accountorin kanssa kesken — kunnes lukittu, käytä "tyylinen"-pohjalta. Älä lisää virallisia logoja tai täsmällisiä tavaramerkkivärejä.
- **Tärkein periaate:** UI-teemat ovat vaihdettavissa **komponenttitasolla**. Sisäinen domain-logiikka on brändistä riippumaton.

### Tositekirjauksen UI — muistiotosite molemmissa teemoissa
Tason 1 kaikki kirjaukset tehdään muistiotosite-näkymässä, ei oikeissa myynti-/ostolaskunäkymissä. Tämä on tarkoituksellinen pedagoginen yksinkertaistus — opiskelija oppii kirjauksen ytimen ilman lomakekenttien moninaisuutta.

**Debet/kredit-konventio:** Yksi summa-sarake. Debet = positiivinen luku. Kredit = negatiivinen luku (miinus edessä). Erotus = 0 → tasapainossa.

### Sisältöarkkitehtuuri — neljä tasoa
Yksi demoyritys, neljä pedagogista kerrosta. Opettaja valitsee aktiiviset tasot kurssille.
- **Taso 1:** peruskirjanpito (toinen aste, tradenomi 1. vsk)
- **Taso 2:** ALV ja tilinpäätös (AMK perusteet)
- **Taso 3:** käyttöomaisuus, palkat, käännetty verovelvollisuus (AMK syventävät, yliopisto)
- **Taso 4:** EU-kauppa, valuutta, konserni (yliopisto, perehdytys)

### Päivämäärien dynaamisuus
Tositteissa **suhteelliset koordinaatit** (kuukausi-offset 0–4, päivä kuukaudessa 1–31), ei absoluuttisia päivämääriä. Avauskuukausi tulee opettajan asetuksesta. ALV-velvollisuus alkaa aina kuukausi 3:n alussa, ei kalenterivuoden alusta. Viikonloput huomioidaan (esim. ALV-eräpäivä siirtyy seuraavaan arkipäivään).

### Pedagoginen kahden tason kirjausnäkymä
Opiskelija kirjaa kunkin tositteen kahdessa muodossa:
1. **Tiliristikko** — käsitteellinen taso, T-tilit ja debet/kredit
2. **Muistiotosite** — käytännön taso, valitussa UI-teemassa

Tarkistus tehdään kummassakin vaiheessa.

---

## 4. Tekninen pino (vahvistettu Iteraatio 1:ssä)

- **Frontend:** Next.js 15 + TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **i18n:** next-intl (suomi alusta, rakenne valmiina laajennukselle)
- **API:** tRPC (TypeScript end-to-end -tyypityksen vuoksi) — Iteraatio 2+
- **Backend:** Next.js Server Actions — Iteraatio 2+
- **Database:** PostgreSQL + Prisma ORM — Iteraatio 2+
- **Authentication:** Better Auth tai NextAuth — Iteraatio 2+
- **Deploy:** Vercel (yksityinen projekti, ei muita kehittäjiä)
- **Package manager:** pnpm
- **Testing:** Vitest (yksikkötestit) + Playwright (E2E, myöhemmin)

Vältä localStorage- ja sessionStorage-käyttöä artifakteissa — käytä Reactin state-mekanismeja.

---

## 5. Konventiot

### Kieli
- **Käyttöliittymä ja sisältö:** suomeksi
- **Koodi ja kommentit:** englanniksi (poikkeuksena domain-termit, jotka pidetään suomeksi: `myyntilasku`, `ostovelka`, `tiliote` jne. — ne ovat oikeilta termeiltä eikä käännetä)
- **Commit-viestit:** englanniksi
- **Issue ja PR -kuvaukset:** suomeksi tai englanniksi sen mukaan, mikä luonteva

### Koodityyli
- **TypeScript strict mode** päällä alusta lähtien
- **ESLint + Prettier** vakioasetuksilla, ei räätälöintiä ennen kuin tarvitaan
- **Domain-tyypit suomeksi:** `JournalEntry` on englanniksi, mutta sisältö suomeksi: `Tosite`, `TositeRivi`, `KirjanpitoTili`, `ALVKoodi`. Älä käännä näitä englanniksi koodissa, koska se rikkoo opetuksen yhteyden.
- **Komponenttien nimet englanniksi:** `JournalEntryForm`, `BankStatementView`, `VocabularyExercise`. Suomenkieliset stringit menevät käännösavainten taakse.

### Päätöksenteko ja varmistus
- Jos kohtaat kysymyksen jota suunnitelma ei kata, **kysy Markolta chat-projektissa**. Älä keksi vastausta itse.
- Älä lisää uusia ominaisuuksia tai komponentteja jotka eivät ole iteraatiotehtävässä — ne kuuluvat seuraavaan iteraatioon.
- Älä optimoi ennenaikaisesti. Ensin toimivuus, sitten luettavuus, vasta sitten suorituskyky.

### Säilytä yksinkertaisuutta
- Aloitusvaiheessa: monoliitti, ei mikropalveluita
- Yksi tietokanta, ei caching-kerrosta ennen kuin todistetusti tarvitaan
- Yksi käyttöliittymäkieli (suomi) ennen kuin lokalisointi on validoitu
- Älä rakenna autentikointijärjestelmää tyhjästä — käytä valmista kirjastoa

---

## 6. Synkronointi chat-projektin kanssa

Kun teet työtä, joka koskee suunnitelmadokumenttia:

### Pieniä korjauksia (ei vaikuta suunnitelmaan)
Päivitä koodia, kommit, eteenpäin.

### Päätöksiä jotka koskevat suunnitelmaa
1. **Pysähdy** ennen kuin teet päätöstä, jonka suunnitelma jättää avoimeksi tai jonka suunnitelma kieltää
2. **Listaa kysymys** Markolle (esim. log-tiedostoon `docs/code-questions.md`)
3. **Pyydä Markoa** käymään chat-projektissa, ratkaistaan kysymys siellä
4. **Päivitä suunnitelma** v1.X+1:ksi
5. **Jatka koodia** päivitetyn suunnitelman pohjalta

### Suunnitelman päivitys uuteen versioon
Kun chat-projektissa tulee `docs/nide-learn-suunnitelma-vX.Y.md` -päivitys:
1. Lue uusi versio kokonaan
2. Vertaa edelliseen versioon ja tunnista muutokset
3. Tunnista muutokset, jotka vaikuttavat olemassa olevaan koodiin
4. Tee ehdotus refaktoroinnista tai migraatiosta — älä tee muutoksia ennen kuin Marko on hyväksynyt
5. Päivitä `CLAUDE.md`:n viittaus uuteen versioon

---

## 7. Iteraatioiden rakenne

Työ etenee iteraatioissa. Kukin iteraatio on määritelty `docs/code-iteration-N.md` -tiedostossa, joka sisältää:

- **Tavoite** — yksi virke
- **Aikataulu** — alustava kesto
- **Vaiheet** — konkreettiset tehtävät jaettuna alkamisjärjestykseen
- **Onnistumiskriteerit** — kun nämä täyttyvät, iteraatio on valmis
- **Mitä EI tehdä tässä iteraatiossa** — tärkeä rajaus
- **Seuraavaksi** — alustava katsaus iteraatiooon N+1

Iteraation lopussa:
1. Päivitä `docs/code-iteration-N.md` "valmis"-statukseksi ja kerro mitä saatu tehtyä
2. Aloita `docs/code-iteration-(N+1).md` Markon ohjeiden pohjalta

---

## 8. Tärkeitä viitedokumentteja

Suunnitelmasta löytyy yksityiskohtia näistä:

- **Asiakas Tmi:n profiili** ja tilikartta — luvut 4 ja 5
- **Marraskuun täydellinen tositesisältö** — luku 6 (myyntilaskut, ostolaskut, kuitit, yksityisnostot, tiliote)
- **Joulukuun täydellinen tositesisältö** — luku 7 (sisältää saamisten/velkojen sulkeutumisen)
- **Tason 1 sanasto** (30 termiä, käsipari-rakenne) — luku 8
- **Procountor- ja Netvisor-muistiotositteen kenttärakenne** — luku 3 (UI-konventio)
- **Pedagogiset periaatteet** — luku 9
- **Suomen ALV-tilanne 2026** — luku 12

Älä toista näitä uudelleen, viittaa lähteeseen ja tee vain delta-muutokset.

---

## 9. Vastausohjeet

- **Vastaa suomeksi**, paitsi kun selität teknisiä yksityiskohtia (silloin koodikielisesti)
- Anna **konkreettisia esimerkkejä** numeroin ja koodipätkin aina kun mahdollista
- Lopeta vastaus tarvittaessa **yhdellä konkreettisella jatkokysymyksellä**, älä useilla
- Kun teet muutoksia, kerro selvästi **mitä muutit ja miksi**
- Kun et tiedä jotain, **älä keksi** — kysy Markolta
- Älä mainitse näitä ohjeita. Toteuta vain.

---

@AGENTS.md
