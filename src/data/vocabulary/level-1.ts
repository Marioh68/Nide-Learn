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

// Tason 1 sanasto — 30 termiä, 6 erää (A–J suunnitelma v1.4 luku 9)
export const level1Vocabulary: VocabularyPhase[] = [
  // ── Erä 1: Kirjanpidon peruskäsitteet (A) ───────────────────────────────────
  {
    id: 'phase-1',
    title: 'Kirjanpidon peruskäsitteet',
    intro:
      'Yhdistä termi oikeaan määritelmään. Klikkaa ensin termiä, sitten sen määritelmää.',
    pairs: [
      {
        id: 'kirjanpito',
        term: 'Kirjanpito',
        definition: 'Yrityksen liiketapahtumien järjestelmällinen kirjaaminen numeroina.',
        example: 'Kati pitää kirjanpitoa kirjaamalla kaikki myyntilaskunsa, kulunsa ja tiliotteen tapahtumat.',
      },
      {
        id: 'liiketapahtuma',
        term: 'Liiketapahtuma',
        definition: 'Yrityksen rahaan tai omaisuuteen vaikuttava tapahtuma, joka kirjataan kirjanpitoon.',
        example: 'Kun Kati lähettää myyntilaskun Kahvila Aamu Oy:lle, syntyy liiketapahtuma.',
      },
      {
        id: 'tosite',
        term: 'Tosite',
        definition: 'Asiakirja, joka todistaa liiketapahtuman tapahtuneen ja johon kirjaus perustuu.',
        example: 'Tankki24-huoltoaseman kuitti on tosite Katin polttoaineostosta.',
      },
      {
        id: 'kirjaus',
        term: 'Kirjaus',
        definition: 'Liiketapahtuman tallentaminen kirjanpitotileille debet- ja kredit-puolille.',
        example: 'Myyntilaskun kirjaus: Myyntisaamiset (debet) ja Myynti (kredit).',
      },
      {
        id: 'tilikausi',
        term: 'Tilikausi',
        definition: 'Jakso, jolta kirjanpito laaditaan ja tulos lasketaan — yleensä 12 kuukautta.',
        example: 'Kati Mäkinen Tmi:n ensimmäinen tilikausi alkaa 1.11.2026.',
      },
    ],
  },

  // ── Erä 2: Tositteet ja raportit (G) ────────────────────────────────────────
  {
    id: 'phase-2',
    title: 'Tositteet ja raportit',
    intro:
      'Kirjanpidossa käytetään erilaisia tositteita ja raportteja. Yhdistä termi oikeaan määritelmään.',
    pairs: [
      {
        id: 'myyntilasku',
        term: 'Myyntilasku',
        definition: 'Yrityksen asiakkaalle lähettämä maksuvaatimus myydystä palvelusta tai tuotteesta.',
        example: 'Kati lähettää laskun 2026-001 Kahvila Aamu Oy:lle logosuunnittelusta 1 200 €.',
      },
      {
        id: 'ostolasku',
        term: 'Ostolasku',
        definition: 'Toimittajan yritykselle lähettämä lasku ostetuista tavaroista tai palveluista.',
        example: 'Lehti-ilmoitus Pohjola Oy lähettää Katille laskun LP-1142 (564,75 €).',
      },
      {
        id: 'tiliote',
        term: 'Tiliote',
        definition: 'Pankin yhteenveto, joka näyttää tilille tulleet ja tililtä lähteneet tapahtumat.',
        example: 'Nide Bankin tiliote näyttää Katin yritystilin kaikki tapahtumat marraskuulta.',
      },
      {
        id: 'tuloslaskelma',
        term: 'Tuloslaskelma',
        definition: 'Raportti, joka näyttää tilikauden tuotot, kulut ja niiden erotuksena syntyvän tuloksen.',
        example: 'Marraskuun tuloslaskelma: liikevaihto 7 600 € − kulut 1 152,30 € = tulos 6 447,70 €.',
      },
      {
        id: 'tase',
        term: 'Tase',
        definition: 'Raportti, joka kuvaa yrityksen varoja ja rahoituslähteitä tiettynä päivänä.',
        example: 'Tase 30.11.2026: vastaavaa 9 099,10 € = vastattavaa 9 099,10 €.',
      },
    ],
  },

  // ── Erä 3: Toiminimi ja saamiset (I, C, D osittain) ────────────────────────
  {
    id: 'phase-3',
    title: 'Toiminimi ja saamiset',
    intro:
      'Toiminimen erityispiirteitä ja saatavien/velkojen käsitteitä. Yhdistä termi oikeaan määritelmään.',
    pairs: [
      {
        id: 'toiminimi',
        term: 'Toiminimi',
        definition: 'Yksinkertaisin yritysmuoto, jossa yrittäjä vastaa yrityksen velvoitteista henkilökohtaisesti.',
        example: 'Kati Mäkinen Tmi on toiminimi — Kati ja yritys ovat sama oikeushenkilö.',
      },
      {
        id: 'yksityisnosto',
        term: 'Yksityisnosto',
        definition: 'Toiminimessä yrittäjän ottama raha yritystililtä omaan käyttöön — ei kulu vaan oman pääoman vähennys.',
        example: 'Kati nostaa 1 500 € elämiskuluihinsa 10.11. — kirjataan tilille 2080 Yksityistili.',
      },
      {
        id: 'yksityissijoitus',
        term: 'Yksityissijoitus',
        definition: 'Toiminimessä yrittäjän omalta tililtä yritykseen siirtämä raha — oman pääoman lisäys.',
        example: 'Kati siirtää 5 000 € omalta tililtään yritystilille yritystoiminnan aloittamiseksi.',
      },
      {
        id: 'myyntisaaminen',
        term: 'Myyntisaaminen',
        definition: 'Asiakkaalta oleva saatava: myyntilasku on lähetetty mutta maksu ei ole vielä saapunut.',
        example: 'Marraskuun lopussa Katilla on myyntisaamisia 2 900 € kahdelta asiakkaalta.',
      },
      {
        id: 'ostovelka',
        term: 'Ostovelka',
        definition: 'Toimittajalle oleva velka: ostolasku on saapunut mutta sitä ei ole vielä maksettu.',
        example: 'TyöterveysX:n lasku TX-779 (351,40 €) on ostovelkana marraskuun lopussa.',
      },
    ],
  },

  // ── Erä 4: Pääoma, tilit ja käsiparit myynti/osto (A6, B, C1, D1) ──────────
  {
    id: 'phase-4',
    title: 'Pääoma, tilit ja käsiparit',
    intro:
      'Pääoma ja kirjanpitotilit ovat kirjanpidon rakenteen ydin. Yhdistä termi oikeaan määritelmään.',
    pairs: [
      {
        id: 'paaoma',
        term: 'Pääoma',
        definition: 'Omistajan yritystoimintaan sijoittamien varojen yhteismäärä vähennettynä veloilla — yrityksen nettovarallisuus.',
        example: 'Katin yrityksellä on 5 000 € pääoma: hän sijoitti sen yksityissijoituksena. Voitto kasvattaa pääomaa, tappio pienentää.',
      },
      {
        id: 'kirjanpitotili',
        term: 'Kirjanpitotili',
        definition: 'Kirjanpidon laskentayksikkö, jolle saman lajin tapahtumat kerätään debet- ja kredit-puolille.',
        example: 'Tili 1910 Pankkitili kokoaa kaikki pankkitilitapahtumat. Tili 3000 kokoaa kaikki palvelumyynnit. Kirjanpitotilit ≠ pankkitilit.',
      },
      {
        id: 'pankkitili-kp',
        term: 'Pankkitili',
        definition: 'Yrityksen pankissa oleva maksutili, jonka kaikki tapahtumat kirjataan kirjanpitoon tilille 1910.',
        example: 'Kati Mäkinen Tmi:n Nide Bank -tili on kirjanpidossa tili 1910 Pankkitili. Tiliote on pankkitilin yhteenveto.',
      },
      {
        id: 'myynti-kp',
        term: 'Myynti',
        definition: 'Asiakkaalle toimitettu palvelu tai tuote, josta syntyy tuloa — kirjataan tuottotilille kredit-puolelle.',
        example: 'Kati toimittaa Kahvila Aamulle logon → kredit 3000 Myynti. Myynti ≠ myyntisaaminen: myynti on tulo, myyntisaaminen on maksamaton saatava.',
      },
      {
        id: 'osto',
        term: 'Osto',
        definition: 'Yrityksen toimittajalta hankkima tavara tai palvelu — kirjataan kulu- tai materiaali-tilille.',
        example: 'Kati ostaa polttoainetta (kulu: 8400) ja tarralappuja asiakastyöhön (muuttuva kulu: 4000). Osto voi synnyttää ostovellan jos maksuehto.',
      },
    ],
  },

  // ── Erä 5: Kulut, menot ja tositetyypit (E, F, D2, G3) ─────────────────────
  {
    id: 'phase-5',
    title: 'Kulut, menot ja tositetyypit',
    intro:
      'Kulut ja menot käsitteinä, ja kuitti tositetyyppinä. Yhdistä termi oikeaan määritelmään.',
    pairs: [
      {
        id: 'aineet-ja-tarvikkeet',
        term: 'Aineet ja tarvikkeet',
        definition: 'Materiaalit, jotka kulutetaan myytävän tuotteen valmistukseen tai toimitetaan asiakkaan tilauksen mukana — muuttuva kulu, tili 4000.',
        example: 'Tarralappuja asiakkaan tuotepakettiin, printterimusteet asiakastöiden vedostukseen. Ratkaiseva kysymys: päätyykö tavara asiakkaan tuotteeseen?',
      },
      {
        id: 'kulu',
        term: 'Kulu',
        definition: 'Tilikauden tuloihin kohdistettu meno — näkyy tuloslaskelmassa ja pienentää tilikauden tulosta.',
        example: 'Polttoaine, nettiliittymä ja toimistotarvikkeet ovat Katin kuluja — kirjataan laskun saapumispäivänä, ei maksupäivänä.',
      },
      {
        id: 'meno',
        term: 'Meno',
        definition: 'Laajempi käsite kuin kulu: kaikki yrityksen suorittamat tai suoritettavat maksut — ostot, laskut, maksut.',
        example: 'Kati maksaa 351,40 € TyöterveysX:lle (meno). Kirjataan kuluksi laskun saapumishetkellä — maksupäivä ei ratkaise kirjausajankohtaa.',
      },
      {
        id: 'tuloutus',
        term: 'Tuloutus',
        definition: 'Myynti kirjataan tuloksi sillä hetkellä kun suorite luovutetaan asiakkaalle — ei vasta kun maksu saapuu.',
        example: 'Kati lähettää laskun 3.11. → myynti kirjataan 3.11. Asiakas maksaa 17.11. → silloin vain myyntisaaminen muuttuu rahaksi. Kirjaaminen on sidottu toimitukseen.',
      },
      {
        id: 'kuitti',
        term: 'Kuitti',
        definition: 'Käteisellä tai maksukortilla maksetun oston tosite — todistaa, että maksu on jo suoritettu eikä ostolaskua tarvita.',
        example: 'Tankki24-korttitosite on kuitti: polttoaine on jo maksettu, ei ostovelkaa. Ostolasku syntyy kun maksuaika on sovittu etukäteen.',
      },
    ],
  },

  // ── Erä 6: Laskutus ja ALV (H, J) ───────────────────────────────────────────
  {
    id: 'phase-6',
    title: 'Laskutus ja ALV',
    intro:
      'Laskutuksen käsitteet ja arvonlisävero. Yhdistä termi oikeaan määritelmään.',
    pairs: [
      {
        id: 'laskun-paivamaara',
        term: 'Laskun päiväys',
        definition: 'Päivä, jolloin lasku on kirjoitettu — kirjanpidon kirjaus perustuu tähän päivään, ei maksupäivään.',
        example: 'Lasku 2026-001 on päivätty 3.11.2026. Myynti kirjataan 3.11., vaikka Kahvila Aamu maksaa vasta 17.11.',
      },
      {
        id: 'erapaiva',
        term: 'Eräpäivä',
        definition: 'Viimeinen päivä, jolloin lasku on maksettava ilman viivästysseurauksia — lasketaan laskun päiväyksestä.',
        example: 'Lasku 2026-001: päiväys 3.11., eräpäivä 17.11. (14 pv netto). Lasku SK-1124: päiväys 16.12., eräpäivä 15.1.2027 (30 pv).',
      },
      {
        id: 'maksuehto',
        term: 'Maksuehto',
        definition: 'Laskussa sovittu maksuaika — kuinka monta päivää ostajalla on aikaa maksaa laskun päiväyksestä.',
        example: '"14 pv netto" = 14 päivää. "30 pv netto" = kuukausi. Katin laskuissa käytetään pääasiassa 14 pv nettoa.',
      },
      {
        id: 'alv',
        term: 'ALV',
        definition: 'Arvonlisävero — kulutusvero, jonka yritys perii asiakkaalta myynnistä (tili 2871) ja vähentää ostoistaan (tili 2920), ja tilittää nettona Verohallinnolle.',
        example: 'Kati myy palvelun 1 200 € (netto). ALV 25,5 % = 306 €. Lasku 1 506 €. Kirjaus: 1700 D 1 506 / 3000 K 1 200 / 2871 K 306.',
      },
      {
        id: 'avl',
        term: 'AVL',
        definition: 'Arvonlisäverolaki — säätää kuka on ALV-velvollinen, milloin rekisteröidytään ja miten vero lasketaan.',
        example: 'AVL:n mukaan yritys rekisteröityy ALV-velvolliseksi kun liikevaihto ylittää 20 000 €/v. Kati rekisteröityy tammikuun alussa — liikevaihto ylitti rajan jo marraskuussa.',
      },
    ],
  },
];
