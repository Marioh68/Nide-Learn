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

// Tason 1 sanasto — 15 termiä, 3 erää
// Laajennetaan 30 termiin Iteraatio 2:ssa käsipari-rakenteen kanssa.
export const level1Vocabulary: VocabularyPhase[] = [
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
];
