# Nide Learn — suunnitteludokumentti v1.4

**Päivitetty:** 7.5.2026 (myöhäinen ilta)
**Tila:** Iteraatio 2:n suunnittelu valmis kokonaisuudessaan. Code-puolen Iteraatio 1 käynnissä, Iteraatio 2 valmiina aloitettavaksi sen jälkeen.
**Vetäjä:** Marko (Nide Solutions Oy), kirjanpidon opettaja

Tämä dokumentti on Nide Learn -hankkeen pääreferenssi. Toimii sekä Project-keskustelujen kontekstina että Claude Code -työn brieffauksena. Päivittyy iteratiivisesti.

---

## 1. Dokumenttihakemisto

Kaikki Nide Learn -projektin dokumentit ja niiden roolit. Tämä lista pidetään ajan tasalla uusien tiedostojen myötä.

### Pääsuunnitelma
- **nide-learn-suunnitelma-v1.4.md** ← tämä tiedosto. Korvaa v1.3:n. Pääreferenssi kaikkeen.
- Aiemmat versiot (v1.0–v1.3) voi poistaa Project Knowledgesta, kun v1.4 on validoitu.

### Sisältötiedostot
- **nide-learn-mikrosisallot-taso1-a.md** — 13 mikrosisältöä A-tasolla. Käytettävissä tositekirjauksen yhteydessä avautuvina selityksinä. Validointi opettajakontakteilla kesken.
- **nide-learn-sanasto-harjoitus2.html** — Toimiva HTML-prototyyppi sanastoharjoituksesta (Harjoitus 2, parinmuodostus). Voi avata selaimessa ja näyttää testikäyttöön.

### Code-puolen brieffaustiedostot
- **CLAUDE.md** — Coden custom instructions. Sijoittuu repon juureen. Koden lukee joka istunnossa automaattisesti.
- **code-iteration-1.md** — Iteraatio 1:n tehtäväpaketti (infrastruktuuri + theme provider + sanastoharjoitus). Sijoittuu repon `docs/`-kansioon. Käynnissä.
- **code-iteration-2.md** — Iteraatio 2:n tehtäväpaketti (tositekirjausnäkymä, muistiotosite, tiliristikko, tarkistuslogiikka). Sijoittuu repon `docs/`-kansioon. Valmiina aloitettavaksi Iteraatio 1:n jälkeen.

### Referenssimateriaali (uploadit)
- **document__7_.pdf** — Nordea-yritystiliotteen malli (Paimion Kuljetus Oy). Käytetään Asiakas Tmi:n tiliotteiden ulkoasun pohjana.
- **1778161495659_image.png** — Procountor-muistiotositteen kuvankaappaus.
- **1778161613674_image.png** — Netvisor-muistiotositteen kuvankaappaus.
- Markon aiemmat HTML-demot (taloushallinto-opetus, Netvisor_Learn_osa_2_*) — kontekstuaalinen viite Markon aiempaan opetusmateriaaliin.

### Mitä jatkossa tulee
- `code-iteration-3.md` — Joulukuun tositteet täysmittaisina, raporttien tulostus (suunnitellaan kun Iteraatio 2 lähestyy valmistumista)
- `code-iteration-4.md` — Tason 1 kk 3–5, ALV-osa
- B-tason mikrosisällöt — kun A-taso on validoitu opettajilla
- Tason 2 sisältö

### Versiointi
Suunnitelmadokumentti päivittyy vX.Y-mallilla. Pääpäivitykset (X) tehdään kun isoja arkkitehtuurisia muutoksia, alapäivitykset (Y) kun sisältöä laajennetaan tai tarkennetaan.

---

## 2. Tausta ja strateginen positio

### Yhtiö ja tuotelinja
- **Nide Solutions Oy** — emoyhtiö
- **Nide Master** — olemassa oleva tuoteperhe tilitoimistoille
- **Nide Learn** — uusi tuote oppilaitoksille ja perehdytyskäyttöön

### Asiakassegmentit
1. Toisen asteen oppilaitokset (liiketoiminnan PT)
2. Ammattikorkeakoulut (tradenomikoulutus)
3. Yliopistot (laskentatoimi, taloushallinto)
4. Isot tilitoimistot — uusien työntekijöiden perehdytys

### Arvolupaus
AMK:lle: "sama ympäristö, johon opiskelijanne työllistyvät tilitoimistossa". Tilitoimistolle: "sama ympäristö, josta uudet työntekijänne ovat jo valmiiksi tuttuja AMK:sta valmistuessaan".

---

## 3. UI-strategia

### Kaksi teemaa
- **Netvisor-tyylinen** (referenssikuvat saatu)
- **Procountor-tyylinen** (referenssikuvat saatu)
- **Neutraali Nide-oletus** kolmantena vaihtoehtona

Brändineuvottelut Visman ja Accountorin kanssa kesken — etenetään "tyylinen"-pohjalta.

### Tekninen periaate
UI-teemat **vaihdettavissa komponenttitasolla**. Sisäinen domain-logiikka brändistä riippumaton.

---

## 4. Tositekirjauksen UI-konventio

### Yksi näkymä — muistiotosite — molempiin teemoihin
Tason 1 kaikki kirjaukset tehdään muistiotosite-näkymässä. Ei oikeita myynti- tai ostolaskunäkymiä.

### Debet/kredit-konventio
- **Muistiotositteella:** debet positiivinen, kredit negatiivinen (-)
- **Tiliristikolla:** erilliset debet/kredit -radio-kentät + summa erillisenä (pedagoginen selkeys)
- Erotus = 0 → tasapainossa

### Procountor-muistiotosite — kenttärakenne
- **Otsikkotiedot:** Nimi, Tunnus, Tositepvm, Kirjauskausi, ALV-tyyppi, ALV-status, Palvelujakson alkupvm/loppupvm, Kirjanpitäjän muistiinpanot, Vientiselite, Tosite yhteensä
- **Kirjanpitoviennit:** Tili, Kp-arvo, ALV-%, ALV, Yhteensä, ALV-väh.-, ALV-tyyppi, ALV-status
- **Päätoiminnot:** Tallenna · Hyväksy · Muokkaa · Avaa PDF · Uusi tosite

### Netvisor-muistiotosite — kenttärakenne
- **Tositetiedot:** Tositenumero, Tositelaji (MU/MY/OS/KU), Päiväys, Selite
- **Tositerivit:** Tili, Summa (debet+, kredit−), Riviselite, Lajit (ALV-koodi)
- **Tasapaino:** Erotus + Debet / Kredit -näyttö
- **Päätoiminnot:** Tallenna uusi tosite · Jatka tositteiden luomista · Peruuta

### Sisäinen domain-malli

```typescript
Tosite {
  numero: string;
  päiväys: Date;
  tositelaji: 'MU' | 'MY' | 'OS' | 'KU' | ...;
  selite: string;
  viennit: TositeRivi[];
  liitteet: Tiedosto[];
}

TositeRivi {
  tili: KirjanpitoTili;
  summa: Decimal;          // positiivinen=debet, negatiivinen=kredit
  alvKoodi?: ALVKoodi;     // myöhemmissä tasoissa
  selite?: string;
}
```

### Tiliristikko-näkymä

Opiskelija valitsee tilejä tilikartasta ja syöttää kirjaukset **erillisillä kentillä** (tili + puoli + summa). Järjestelmä renderöi T-tilit visuaalisesti:

```
┌─────────────────────────────┐
│    1700 Myyntisaamiset      │
├──────────────┬──────────────┤
│    Debet     │    Kredit    │
├──────────────┼──────────────┤
│  1 200,00    │              │
├──────────────┴──────────────┤
│  Saldo: 1 200,00 (debet)    │
└─────────────────────────────┘
```

Alapalkki näyttää tasapainon: "Debet yhteensä X € · Kredit yhteensä Y € · Erotus Z €"

---

## 5. Sisältöarkkitehtuuri — neljä tasoa

### Taso 1 — peruskirjanpito (toinen aste, tradenomi 1. vsk)
- 5 kuukauden tositerakenne
- ALV alkaa kk 3:ssa
- Marraskuu: peruskirjanpidon oppiminen
- Joulukuu: opitun kertaaminen + muuttuvat kulut + raporttien tulostus + katelaskenta
- Ei tilinpäätöstä

### Taso 2 — ALV ja tilinpäätös (AMK perusteet)
- Useat ALV-kannat (25,5 %, 13,5 %, 10 %, 0 %)
- Suoriteperuste vs. maksuperuste
- Jaksotukset (siirtosaamiset/-velat)
- ALV-tilitys
- Myyntikatelaskenta syvenee
- Tilinpäätösperustaso

### Taso 3 — laajennettu kirjanpito (AMK syventävät, yliopisto)
- Käyttöomaisuus ja poistot
- Palkat ja sotumaksut
- Käännetty verovelvollisuus
- YEL-laskenta
- ALV-tilityksen ja -vähennyksen ajoittuminen toimituspäivän mukaan
- Vähennysoikeuden rajoitukset

### Taso 4 — vaativa kirjanpito (yliopisto, tilitoimistoperehdytys)
- EU-sisäkauppa
- Valuuttamääräiset tositteet
- Tilinpäätösoikaisut
- Konsernitilinpäätös

### Tasonsiirtymät — raporttien tulostus tarkisteena
- **Tason 1 → Taso 2:** tuloslaskelman ja taseen tulostus ruudulle joulukuun lopussa + myyntikatelaskenta + ALV-hakeutumisen kysymyspari
- **Tason 2 → Taso 3:** sama tarkiste-mekanismi, mutta laajempi raporttirakenne

**Pedagoginen ydin:** kaksi tarkistetta — (1) mekaaninen tasapaino, (2) looginen oikeat tiliryhmät raporteista.

---

## 6. Demoyritys — Asiakas Tmi

### Yrittäjä ja yritys
- **Nimi:** Kati Mäkinen Tmi
- **Y-tunnus:** 4639218-5
- **Toimiala:** graafinen suunnittelu (B2B-palvelut)
- **Yhtiömuoto:** toiminimi
- **Henkilöstö:** yksinyrittäjä
- **Liikevaihto:** marraskuu 7 600 € + joulukuu 11 280 € = 18 880 € (2 kk:n aikana, vuositasolla projisoituna >100 000 €)
- **Pankkitili:** FI21 4055 0010 9876 23
- **Pankki:** Nide Bank (fiktiivinen)
- **Kaupparekisteriin merkitty:** 1.11.2026

### Tilikartta — Liikekirjuri-pohjainen

| Tilinumero | Nimi | Tyyppi | Käyttöönotto |
|------------|------|--------|---------------|
| 1200 | Koneet ja kalusto | Vastaavaa | Kk 5 |
| 1700 | Myyntisaamiset | Vastaavaa | Kk 1 |
| 1910 | Pankkitili | Vastaavaa | Kk 1 |
| 2010 | Oma pääoma | Vastattavaa | Kk 1 |
| 2080 | Yksityistili | Vastattavaa | Kk 1 |
| 2520 | Ostovelat | Vastattavaa | Kk 1 |
| 2870 | ALV-velka | Vastattavaa | Kk 3 |
| 2871 | Suoritettava ALV myynneistä | Vastattavaa | Kk 3 |
| 2920 | Vähennettävä ALV ostoista | Vastaavaa | Kk 3 |
| 3000 | Myynti, palvelumyynti | Tuotot | Kk 1 |
| 3010 | Myynti, edelleenveloitettava | Tuotot | Kk 2 |
| 4000 | Aineet ja tarvikkeet | Kulut | Kk 1 |
| 4500 | Ulkopuoliset palvelut (muuttuvat kulut) | Kulut | Kk 2 |
| 8390 | Tietotekniikkakulut | Kulut | Kk 1 |
| 8400 | Liiketoiminnan muut kulut | Kulut | Kk 1 |

**Tuloslaskelman rivit:**
- Liikevaihto = 3000 + 3010
- Materiaalit ja palvelut = 4000 + 4500
- Liiketoiminnan muut kulut = 8390 + 8400

**Myyntikatelaskenta:**
- Myyntikate = Liikevaihto − Materiaalit ja palvelut
- Myyntikate-% = Myyntikate / Liikevaihto × 100

### Asiakkaat ja toimittajat

**Asiakkaat (kuvitteelliset):**

| Y-tunnus | Nimi |
|----------|------|
| 1234567-1 | Kahvila Aamu Oy |
| 2856931-1 | Mainostoimisto Aalto Oy |
| 3741852-3 | Kustannus Vehka Oy |
| 5638274-9 | **Konsultointi Polku Oy** (uusi joulukuussa) |
| 5928167-9 | Energiapalvelu Tähti Oy |
| 7253148-4 | Yhdistys Liike Ry |
| 8479255-0 | Suunnittelutoimisto Pohjola Oy |

**Toimittajat (kuvitteelliset, korvaavat oikeat brändit):**

| Y-tunnus | Uusi nimi | Korvaa |
|----------|-----------|--------|
| (kv.) | PixelPro Software Ltd | Adobe |
| 6182739-4 | Painotalo Vire Oy | (uusi) |
| 6741938-3 | **Pilvipalvelu Cloudia Oy** (uusi joulukuussa) | — |
| 7385462-1 | **Suunnittelukirja-julkaisu Oy** (uusi joulukuussa) | — |
| 8479255-0 | TyöterveysX Oy | (huom: sama y-tunnus jonkin asiakkaan kanssa — generoidaan uusi tarvittaessa) |
| (uusi) | DesignAcademy Oy | — |
| (uusi) | Lehti-ilmoitus Pohjola Oy | — |
| (uusi) | Toimisto-Express Oy | Lyreco |
| (uusi) | Tankki24 Oy | ABC |
| (uusi) | Halpa-Tukku Oy | Tokmanni |
| (uusi) | NetCom Oy | DNA |
| (uusi) | Pikalähetys Oy | Posti |

**Huomio:** TyöterveysX Oy:n y-tunnus 8479255-0 ja Suunnittelutoimisto Pohjola Oy:n y-tunnus 8479255-0 ovat samat — generoidaan TyöterveysX:lle uusi y-tunnus toiseksi versioksi (esim. **9472583-1**, varmistettava ennen Code-aloitusta).

### 5 kuukauden tositerakenne

| Kuukausi | Tilanne | Pedagoginen sisältö |
|----------|---------|---------------------|
| **Kk 1** | Yhtiö perustettu, ei ALV | Tositteen elinkaari, peruskirjanpidon rakenne |
| **Kk 2** | Sama, ei ALV | Kertaaminen, 2 muuttuvaa kulua, raportit + katelaskenta |
| **Kk 3** | ALV alkaa | ALV-tilit 2871, 2920, 2870 |
| **Kk 4** | ALV jatkuu | ALV-laskenta, ALV-ilmoituksen täyttäminen |
| **Kk 5** | Käyttöomaisuus | Pienhankinta vs. käyttöomaisuus, ALV-maksu eräpäivänä |

---

## 7. Marraskuu 2026 — peruskirjanpidon oppiminen

### Avauskirjaus: yksityissijoitus

| Päivä | Tositenumero | Selite | Summa |
|-------|--------------|--------|-------|
| 1.11. | YS-001 | Alkupääoman sijoitus, henkilökohtaiselta tililtä | 5 000,00 € |

**Kirjaus muistiotositteena:** Pankkitili 1910 +5 000,00 / Yksityistili 2080 −5 000,00

### Myyntilaskut (4 kpl)

| Lasku | Päivä | Asiakas | Palvelu | Summa | Eräpäivä |
|-------|-------|---------|---------|-------|----------|
| 2026-001 | 5.11. | Kahvila Aamu Oy | Logosuunnittelu | 1 200,00 € | 19.11. |
| 2026-002 | 12.11. | Mainostoimisto Aalto Oy | Verkkosivun ulkoasu | 3 500,00 € | 26.11. |
| 2026-003 | 19.11. | Kustannus Vehka Oy | Kausijulkaisun taitto | 2 100,00 € | 3.12. |
| 2026-004 | 26.11. | Energiapalvelu Tähti Oy | Esitemateriaali | 800,00 € | 10.12. |

**Yhteensä: 7 600,00 €** · Marraskuun lopussa myyntisaamiset 2 900 €

### Ostolaskut (3 kpl)

| Lasku | Päivä | Toimittaja | Veroton | ALV | Yhteensä | Maksuehto |
|-------|-------|------------|---------|-----|----------|-----------|
| AC-2611 | 4.11. | PixelPro Software Ltd | 79,00 | 20,15 | 99,15 € | Kortin autom. veloitus 4.11. |
| LP-1142 | 14.11. | Lehti-ilmoitus Pohjola Oy | 450,00 | 114,75 | 564,75 € | 14 pv, eräp. 28.11. |
| TX-779 | 21.11. | TyöterveysX Oy | 280,00 | 71,40 | 351,40 € | 21 pv, eräp. 12.12. |

**Yhteensä sis. ALV: 1 015,30 €** · Marraskuun lopussa ostovelat 351,40 €

### Kuitit (4 kpl)

| Päivä | Liike | Tuote | Summa |
|-------|-------|-------|-------|
| 7.11. | Toimisto-Express Oy | Toimistotarvikkeita | 35,00 € |
| 13.11. | Tankki24 Oy | Polttoaine | 60,00 € |
| 20.11. | Halpa-Tukku Oy | Tarralappuja | 24,00 € |
| 27.11. | NetCom Oy | 4G-mokkulan kk-maksu | 18,00 € |

### Yksityisnostot (2 kpl)

| Päivä | Summa |
|-------|-------|
| 10.11. | 1 500,00 € |
| 24.11. | 1 200,00 € |

### Tiliote — marraskuu 2026

| Päivä | Selite | Veloitus | Hyvitys | Saldo |
|-------|--------|----------|---------|-------|
| 1.11. | Tilin avaus | | | 0,00 € |
| 1.11. | Yksityissijoitus | | 5 000,00 € | 5 000,00 € |
| 4.11. | PixelPro Software, kk-veloitus kortilta | 99,15 € | | 4 900,85 € |
| 7.11. | Toimisto-Express, kortti | 35,00 € | | 4 865,85 € |
| 10.11. | Yksityisnosto Mäkinen | 1 500,00 € | | 3 365,85 € |
| 13.11. | Tankki24, kortti | 60,00 € | | 3 305,85 € |
| 19.11. | Suoritus 2026-001, Kahvila Aamu Oy | | 1 200,00 € | 4 505,85 € |
| 20.11. | Halpa-Tukku, kortti | 24,00 € | | 4 481,85 € |
| 24.11. | Yksityisnosto Mäkinen | 1 200,00 € | | 3 281,85 € |
| 26.11. | Suoritus 2026-002, Mainostoimisto Aalto | | 3 500,00 € | 6 781,85 € |
| 27.11. | NetCom, kortti | 18,00 € | | 6 763,85 € |
| 28.11. | Lehti-ilmoitus Pohjola, lasku LP-1142 | 564,75 € | | 6 199,10 € |

**Loppusaldo 30.11.2026: 6 199,10 €**

### Marraskuun yhteenveto

| Erä | Summa |
|-----|-------|
| Liikevaihto (3000) | 7 600,00 € |
| Aineet ja tarvikkeet (4000) | −59,00 € |
| Tietotekniikkakulut (8390) | −99,15 € |
| Liiketoiminnan muut kulut (8400) | −994,15 € |
| **Tilikauden tulos** | **6 447,70 €** |

**Tase 30.11.2026:** Vastaavaa = Vastattavaa = 9 099,10 €

---

## 8. Joulukuu 2026 — kertaaminen + muuttuvat kulut

Tositteita kaksinkertainen määrä marraskuuhun verrattuna.

### Avaava tase 1.12.2026

- Pankkitili 1910: 6 199,10 €
- Myyntisaamiset 1700: 2 900,00 €
- Ostovelat 2520: 351,40 €
- Yksityistili 2080: 2 300,00 €
- Tilikauden tulos: 6 447,70 €

### Myyntilaskut (8 kpl) — 2 sisältää edelleenveloituksen

| Lasku | Päivä | Asiakas | Palvelu | Edelleen | Yhteensä | Eräpäivä |
|-------|-------|---------|---------|----------|----------|----------|
| 2026-005 | 3.12. | Kahvila Aamu Oy | Käyntikorttien suunnittelu 1 200 € | Käyntikortit 500 € | 1 700 € | 17.12. |
| 2026-006 | 5.12. | Yhdistys Liike Ry | Esitteen suunnittelu 750 € | Esitteet 250 € | 1 000 € | 19.12. |
| 2026-007 | 8.12. | Mainostoimisto Aalto Oy | Banneri-mainosgrafiikat | — | 2 800 € | 22.12. |
| 2026-008 | 10.12. | Suunnittelutoimisto Pohjola | Infografiikat | — | 1 850 € | 24.12. |
| 2026-009 | 12.12. | Kustannus Vehka Oy | Kausijulkaisun 2. osa | — | 1 100 € | 26.12. |
| 2026-010 | 15.12. | Kahvila Aamu Oy | Pieni juliste joulukampanjaan | — | 480 € | 29.12. |
| 2026-011 | 18.12. | Energiapalvelu Tähti Oy | Animaatio yritysesitykseen | — | 1 500 € | 1.1.2027 |
| 2026-012 | 22.12. | Konsultointi Polku Oy (uusi) | Iconisarja sovellukseen | — | 850 € | 5.1.2027 |

**Liikevaihto: 11 280 €** (palvelumyynti 10 530 € + edelleenveloitus 750 €)
**Joulukuun lopussa myyntisaamiset:** 2026-011 (1 500 €) + 2026-012 (850 €) = **2 350 €**

### Ostolaskut (6 kpl) — 2 muuttuvaa kulua

| Lasku | Päivä | Toimittaja | Veroton | ALV | Yhteensä | Maksuehto | Tilikohdistus |
|-------|-------|------------|---------|-----|----------|-----------|---------------|
| AC-2612 | 2.12. | PixelPro Software Ltd | 79,00 | 20,15 | 99,15 € | Kortin autom. veloitus | 8390 IT |
| CL-3091 | 9.12. | Pilvipalvelu Cloudia Oy | 240,00 | 61,20 | 301,20 € | 14 pv, eräp. 23.12. | 8390 IT |
| PV-2034 | 11.12. | Painotalo Vire Oy | 320,00 | 81,60 | 401,60 € | 14 pv, eräp. 25.12. | **4500 muuttuva** |
| PV-2035 | 12.12. | Painotalo Vire Oy | 150,00 | 38,25 | 188,25 € | 14 pv, eräp. 26.12. | **4500 muuttuva** |
| SK-1124 | 16.12. | Suunnittelukirja-julkaisu Oy | 35,00 | 8,93 | 43,93 € | 30 pv, eräp. 15.1.2027 | 8400 Muut |
| DA-491 | 18.12. | DesignAcademy Oy | 195,00 | 49,73 | 244,73 € | 14 pv, eräp. 1.1.2027 | 8400 Muut |

**Yhteensä sis. ALV: 1 278,86 €**
**Joulukuun lopussa ostovelat:** SK-1124 (43,93 €) + DA-491 (244,73 €) = **288,66 €**

### Kuitit (8 kpl)

| Päivä | Liike | Tuote | Summa | Tilikohdistus |
|-------|-------|-------|-------|---------------|
| 2.12. | Tankki24 Oy | Polttoaine | 48,00 € | 8400 |
| 5.12. | Toimisto-Express Oy | Printterimusteet | 28,00 € | 4000 |
| 9.12. | Halpa-Tukku Oy | Joulupakkausmateriaalit | 38,00 € | 4000 |
| 11.12. | Tankki24 Oy | Polttoaine | 55,00 € | 8400 |
| 14.12. | Toimisto-Express Oy | Toimistotarvikkeita | 52,00 € | 4000 |
| 16.12. | Pikalähetys Oy | Postitusmaksut | 32,00 € | 8400 |
| 21.12. | Pikalähetys Oy | Joululaskujen postitus | 28,00 € | 8400 |
| 28.12. | NetCom Oy | 4G-mokkulan kk-maksu | 18,00 € | 8400 |

**Yhteensä: 299 €** · Aineet ja tarvikkeet 118 € · Liiketoiminnan muut kulut 181 €

### Yksityisnostot (4 kpl)

| Päivä | Selite | Summa |
|-------|--------|-------|
| 1.12. | Joulukuun alku | 1 200,00 € |
| 8.12. | Joulukuun toinen viikko | 1 800,00 € |
| 15.12. | Joulun edellinen viikko | 1 200,00 € |
| 22.12. | Joulu | 1 500,00 € |

**Yhteensä: 5 700 €**

### Marraskuun avoimien sulkeminen joulukuussa

| Päivä | Tapahtuma | Summa |
|-------|-----------|-------|
| 3.12. | Kustannus Vehka maksaa laskun 2026-003 | +2 100 € |
| 10.12. | Energiapalvelu Tähti maksaa laskun 2026-004 | +800 € |
| 12.12. | Asiakas Tmi maksaa Ergonomiatarkastuksen TX-779 | −351,40 € |

### Tiliote — joulukuu 2026

| Päivä | Selite | Veloitus | Hyvitys | Saldo |
|-------|--------|----------|---------|-------|
| 1.12. | Avaava saldo | | | 6 199,10 € |
| 1.12. | Yksityisnosto Mäkinen | 1 200,00 € | | 4 999,10 € |
| 2.12. | PixelPro Software, kk-veloitus kortilta | 99,15 € | | 4 899,95 € |
| 2.12. | Tankki24, kortti | 48,00 € | | 4 851,95 € |
| 3.12. | Suoritus 2026-003, Kustannus Vehka | | 2 100,00 € | 6 951,95 € |
| 5.12. | Toimisto-Express, kortti | 28,00 € | | 6 923,95 € |
| 8.12. | Yksityisnosto Mäkinen | 1 800,00 € | | 5 123,95 € |
| 9.12. | Halpa-Tukku, kortti | 38,00 € | | 5 085,95 € |
| 10.12. | Suoritus 2026-004, Energiapalvelu Tähti | | 800,00 € | 5 885,95 € |
| 11.12. | Tankki24, kortti | 55,00 € | | 5 830,95 € |
| 12.12. | TyöterveysX Oy, lasku TX-779 | 351,40 € | | 5 479,55 € |
| 14.12. | Toimisto-Express, kortti | 52,00 € | | 5 427,55 € |
| 15.12. | Yksityisnosto Mäkinen | 1 200,00 € | | 4 227,55 € |
| 16.12. | Pikalähetys, kortti | 32,00 € | | 4 195,55 € |
| 17.12. | Suoritus 2026-005, Kahvila Aamu | | 1 700,00 € | 5 895,55 € |
| 19.12. | Suoritus 2026-006, Yhdistys Liike Ry | | 1 000,00 € | 6 895,55 € |
| 21.12. | Pikalähetys, kortti | 28,00 € | | 6 867,55 € |
| 22.12. | Yksityisnosto Mäkinen | 1 500,00 € | | 5 367,55 € |
| 22.12. | Suoritus 2026-007, Mainostoimisto Aalto | | 2 800,00 € | 8 167,55 € |
| 23.12. | Pilvipalvelu Cloudia, lasku CL-3091 | 301,20 € | | 7 866,35 € |
| 24.12. | Suoritus 2026-008, Suunnittelutoimisto Pohjola | | 1 850,00 € | 9 716,35 € |
| 26.12. | Suoritus 2026-009, Kustannus Vehka | | 1 100,00 € | 10 816,35 € |
| 27.12. | Painotalo Vire, lasku PV-2034 | 401,60 € | | 10 414,75 € |
| 28.12. | Painotalo Vire, lasku PV-2035 | 188,25 € | | 10 226,50 € |
| 28.12. | NetCom, kortti | 18,00 € | | 10 208,50 € |
| 29.12. | Suoritus 2026-010, Kahvila Aamu | | 480,00 € | 10 688,50 € |

**Loppusaldo 31.12.2026: 10 688,50 €**

### Joulukuun yhteenveto

**Tuloslaskelma 1.12. – 31.12.2026**

| Erä | Tilinumero | Summa |
|-----|------------|-------|
| Myynti, palvelumyynti | 3000 | 10 530,00 € |
| Myynti, edelleenveloitettava | 3010 | 750,00 € |
| **Liikevaihto yhteensä** | | **11 280,00 €** |
| Aineet ja tarvikkeet | 4000 | −118,00 € |
| Ulkopuoliset palvelut (muuttuvat) | 4500 | −589,85 € |
| **Materiaalit ja palvelut** | | **−707,85 €** |
| **Myyntikate** | | **10 572,15 €** |
| Tietotekniikkakulut | 8390 | −400,35 € |
| Liiketoiminnan muut kulut | 8400 | −469,66 € |
| **Tilikauden tulos joulukuussa** | | **9 702,14 €** |

**Myyntikatelaskenta:** Myyntikate-% = 10 572,15 / 11 280 = **93,72 %**

**Kumulatiivinen tilikauden tulos:** 6 447,70 + 9 702,14 = **16 149,84 €**

**Tase 31.12.2026:**
- Vastaavaa: Pankkitili 10 688,50 + Myyntisaamiset 2 350 = **13 038,50 €**
- Vastattavaa: Ostovelat 288,66 + Yksityistili −3 400 + Tilos 16 149,84 = **13 038,50 €** ✓

### Joulukuun lopussa — silta Tasolle 2

**Pedagogiset tehtävät joulukuun jälkeen:**

1. **Raporttien tulostus ruudulle** (tuloslaskelma + tase). Tarkiste 2: oikeat tiliryhmät, vastaavaa = vastattavaa.
2. **Myyntikatelaskenta** (yllä). Opiskelija pohtii, onko 93,72 % hyvä palveluyrityksessä — kyllä, koska graafinen suunnittelu on lähinnä työpalvelua.
3. **ALV-hakeutumisen kysymyspari:**
   - Miten hakeudut? (OmaVero-palvelussa)
   - Milloin pitää hakeutua? (Pakollinen kun liikevaihto >20 000 €/v; vapaaehtoinen jos vähennyskelpoisia ostoja paljon tai ALV-asiakkaita)
   - Asiakas Tmi:n tilanne: **pakollinen** 1.1.2027 alkaen, koska 2 kk:n liikevaihto 18 880 € → vuositasolla >100 000 €.

---

## 9. Tason 1 sanasto — 30 termiä

Käsipari-rakenne. Termien määritelmät ovat tässä dokumentissa luvussa 8 (v1.3:ssa), pidetään samoina v1.4:ssä.

**Yhteenveto:**
- A. Kirjanpidon ydinkäsitteet (6): Kirjanpito, Liiketapahtuma, Tosite, Kirjaus, Tilikausi, Pääoma
- B. Käsipari (2): Kirjanpitotili vs. Pankkitili
- C. Käsipari (2): Myynti vs. Myyntisaaminen
- D. Käsipari (3): Osto, Aineet ja tarvikkeet, Ostovelka
- E. Käsipari (2): Kulu vs. Meno
- F. Tuloutus (1)
- G. Tositteet ja raportit (6): Myyntilasku, Ostolasku, Kuitti, Tiliote, Tuloslaskelma, Tase
- H. Käsipari (3): Laskun päiväys vs. Eräpäivä, Maksuehto
- I. Toiminimen erityispiirteet (3): Toiminimi, Yksityisnosto, Yksityissijoitus
- J. Käsipari (2): ALV vs. AVL

---

## 10. Mikrosisällöt — Tason 1 A-taso

13 mikrosisältöä erillisessä tiedostossa: `nide-learn-mikrosisallot-taso1-a.md`

**Sapluunarakenne per mikrosisältö:**
1. Otsikko (lauseen muotoinen)
2. Ydinviesti (yksi virke, bolditettu)
3. Selitys (2–3 kappaletta, 100–150 sanaa)
4. Esimerkki Asiakas Tmi:stä
5. Tarkista että ymmärsit (1–3 kysymystä)

**Mikrosisältöjen kytkentä tositekirjaukseen:**
- 1–3: kk 1 alkutarinakortin yhteydessä
- 4–6: kontekstuaalisesti tositteita käsiteltäessä kk 1
- 7–8: kuukauden 2 aikana
- 9–13: ennen kuukautta 3 (ALV alkaa)

**Validointi:** opettajakontaktit testaavat A-tasolla, B/C-tasoja lisätään myöhemmin palautteen pohjalta.

---

## 11. Iteraatio 2:n pedagogiset päätökset

Kahdeksan päätöstä lukittu. Yhteenveto:

### 1. Tositteen elinkaari (7 vaihetta)
Lähdedokumentti → Tiliristikko → Tarkistus → Muistiotosite → Tarkistus → Esimerkki ja selitys → Edistyminen

### 2. Tositteiden järjestys (pedagoginen)
Marraskuun 9-vaiheinen järjestys: yksityissijoitus → yksityisnostot → myyntilaskut → kuitit → ostolasku-suoramaksu → ostolaskut maksuehdolla → tiliotetapahtumat (myyntisuoritukset) → tiliotetapahtumat (ostovelat) → kalenterinäkymä kokonaiskuvana.

### 3. Tarkistuslogiikan periaate
Hybridi: tasapaino reaaliaikaisesti, oikeellisuus pyydettäessä. Rajaton yritykset. Apu kasvaa: 1. yritys virhetyyppipalaute, 2. yritys vihje, 3. yritys mikrosisältölinkki, 4. yritys+ "Näytä oikea vastaus". Status, ei pisteytystä Tasolla 1.

### 4. Tositekortin ulkoasu
Hybridi (realistinen ulkoasu + kentät klikattavia mikrosisältöselityksille). Toimittajien nimet kuvitteelliset. Asiakas Tmi:n myyntilaskun layout teeman mukainen.

### 5. Tiliristikko-näkymä
Vaihtoehto C: opiskelija valitsee tilit tilikartasta + summan + debet/kredit-radio, järjestelmä renderöi visuaaliset T-tilit.

### 6. Palautteen muoto
Ohjaava, virhetyypeittäin (tasapaino/puoli/tili/summa). Sinuttelu. Abstrakti vihje 1. yrityksellä — opiskelija pohtii itse.

### 7. Tarinan rakenne
Hybridi: lyhyt konteksti per tosite (1–2 lausetta) + pakollinen kuukausitarinakortti alussa, vapaaehtoinen lopussa. Kolmas persoona.

### 8. Ohjattu vs. itsenäinen
Vaihtoehto C: kontekstuaalinen orientointi uusille tositetyypeille + täysi itsenäisyys kirjauksen aikana. Marraskuussa 8 orientointia, joulukuussa 2 (muuttuva kulu, edelleenveloitus).

---

## 12. Suomen ALV-tilanne 1.1.2026 alkaen

| Kanta | Prosentti | Soveltamisala |
|-------|-----------|---------------|
| Yleinen | 25,5 % | Kaikki muut paitsi alennetut |
| Alennettu | 13,5 % | Elintarvikkeet, ravintolapalvelut, kirjat, lääkkeet, jne. |
| Alennettu | 10 % | Sanoma- ja aikakauslehdet |
| 0 % | — | Vienti, EU-tavarakauppa B2B |

**Rajat:**
- ALV-velvollisuuden alaraja: 20 000 €/v
- ALV-alarajahuojennus poistunut 1.1.2025
- ALV-ilmoituksen eräpäivä: kohdekuukautta seuraavan toisen kuukauden 12. päivä
- Pienhankintaraja: 1 200 € yksittäinen, 3 600 € vuosittain

---

## 13. Iteraatioiden status

### Code-puolen Iteraatio 1 — käynnissä
**Tavoite:** Infrastruktuuri + theme provider (3 teemaa) + sanastoharjoitus-komponentti
**Brieffaus:** `CLAUDE.md` + `docs/code-iteration-1.md`

### Iteraatio 2 — suunnittelu valmis, briefi tehty
**Tavoite:** Tositekirjausnäkymä marraskuun ensimmäisille tositteille (8 ainutkertaista tositetyyppiä)
**Brieffaus:** `docs/code-iteration-2.md`
**Käynnistyy:** Iteraatio 1:n valmistuttua

### Iteraatio 3 ja eteenpäin — alustava
- Iteraatio 3: Joulukuun täysmittaiset tositteet + raporttien tulostus + katelaskenta
- Iteraatio 4: ALV-osa (Tason 1 kk 3–5)
- Iteraatio 5+: Tason 2 sisältö

---

## 14. Lukitut periaatepäätökset

- ✅ Brändi: Nide Learn, eriytys Nide Masterista
- ✅ UI-strategia: Netvisor- ja Procountor-tyyliset + Nide-oletus
- ✅ Sisältörakenne: yksi demoyritys, neljä tasoa
- ✅ Demoyritys: Kati Mäkinen Tmi, graafinen suunnittelija, toiminimi
- ✅ Pankki: Nide Bank
- ✅ Tilikartta: Liikekirjuri-pohjainen, sis. 3010 ja 4500
- ✅ Toimittajien ja asiakkaiden nimet kuvitteelliset
- ✅ Päivämäärät: vaihtoehto A (rullaava)
- ✅ ALV-velvollisuus alkaa kuukausi 3:n alussa
- ✅ Tason 1 sanasto: 30 termiä, käsiparit
- ✅ Tason 1 lopussa: raporttien tulostus + myyntikatelaskenta
- ✅ Tositekirjauksen UI: muistiotosite molemmissa teemoissa
- ✅ Debet/kredit-konventio: muistiotositteella +/−, tiliristikolla erilliset kentät
- ✅ Iteraatio 2:n 8 pedagogista päätöstä
- ✅ Mikrosisällöt Tason 1 A-tasolla (13 kpl) tehty

---

## 15. Avoimet kohdat

### Sisältö (ennen Iteraatio 2:n koodin aloitusta)
- [ ] **TyöterveysX Oy:n y-tunnus** — törmää Suunnittelutoimisto Pohjola Oy:n kanssa. Vahvista uusi y-tunnus (ehdotus: 9472583-1).
- [ ] **Konsultointi Polku Oy:n nimi** — sopiiko, vai vaihdetaanko?
- [ ] **Mikrosisältöjen validointi** opettajakontakteilla — A-taso valmis testattavaksi.

### Tekniikka (Iteraatio 1:n aikana)
- [ ] Pinon vahvistus (Next.js + TypeScript + Tailwind + shadcn/ui ehdotettu)
- [ ] Hosting (Vercel ehdotettu)
- [ ] i18n-rakenne alusta lähtien

### Pidempi tähtäin
- [ ] B-taso mikrosisällöt (kun A-taso validoitu)
- [ ] Tasojen 2–4 sanasto
- [ ] Procountor-teeman erot Netvisor-teemaan
- [ ] Hinnoittelumalli
- [ ] MPASSid + HAKA + Entra ID -autentikointi
- [ ] Opettajan dashboard
- [ ] Tason 1 Skills-tiedostot (kun sisältö on validoitu)

---

## Versiohistoria

- **v1.4 (7.5.2026 myöhäinen ilta)** — Joulukuun täydelliset tositetiedot (8 myyntilaskua, 6 ostolaskua, 8 kuittia, 4 yksityisnostoa). Uudet asiakkaat ja toimittajat y-tunnuksineen: Konsultointi Polku Oy 5638274-9, Pilvipalvelu Cloudia Oy 6741938-3, Suunnittelukirja-julkaisu Oy 7385462-1. Mikrosisältö-tiedosto valmis (13 kpl A-tasolla). Dokumenttihakemisto lisätty luvuksi 1. Joulukuun täysi tiliote. Code-iteration-2.md valmistui rinnakkain.
- **v1.3 (7.5.2026 ilta)** — Tilikartta Liikekirjuri-pohjainen, Nide Bank lukittu, toimittajien kuvitteelliset nimet, joulukuun tositemäärä kaksinkertaistettu, Iteraatio 2:n 8 päätöstä, Tason 1 lopun raporttien tulostus.
- **v1.2 (7.5.2026 iltapäivä)** — Tositekirjauksen UI-konventio: muistiotosite molemmissa teemoissa.
- **v1.1 (7.5.2026 aamupäivä)** — Marraskuun ja joulukuun tositesisältö, 30 termin sanasto, mikrosisältöjen kerrosrakenne.
- **v1.0 (6.5.2026)** — Strategiset päätökset, Tason 1 määritys, Asiakas Tmi:n profiili.
