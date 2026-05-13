import type { DocumentExercise } from '@/types/exercises';

// Shared feedback — identical to phase 1, imported pattern kept inline for independence
const balanceFeedback = {
  attempt1: 'Kirjauksesi ei ole vielä tasapainossa. Tarkista debet- ja kredit-puolten summat.',
  attempt2: 'Debet- ja kredit-summien on oltava yhtä suuret. Onko joku summa kirjoitettu väärään paikkaan?',
  attempt3: 'Kahdenkertaisessa kirjanpidossa jokainen kirjaus on aina tasapainossa. Avaa selitys alla.',
  microContentId: 'mikrosisalto-1',
};
const sideFeedback = {
  attempt1: 'Tarkista, kummalle puolelle kukin rivi kuuluu.',
  attempt2: 'Mieti, kummalle tilille raha tulee (debet) ja kummalta se lähtee (kredit).',
  attempt3: 'Debet on tilien vasen puoli, kredit oikea. Vastaavaa-tilejä debetoidaan kun saldo kasvaa.',
  microContentId: 'mikrosisalto-1',
};
const accountFeedback = {
  attempt1: 'Jokin tileistä ei ole oikein. Tarkista tilikartta.',
  attempt2: 'Mieti, mitä tapahtuu yrityksessä: mihin varoihin tai velkoihin tämä liiketapahtuma vaikuttaa?',
  attempt3: 'Katso tilikarttaa: mille tilille tämän tyyppinen tapahtuma kirjataan? Avaa selitys.',
  microContentId: 'mikrosisalto-3',
};
const amountFeedback = {
  attempt1: 'Summa ei täsmää. Tarkista tositekortin summa uudelleen.',
  attempt2: 'Vertaa syöttämääsi summaa tositekorttiin. Onko sentin tarkkuus oikein?',
  attempt3: 'Kirjanpidossa summa pitää kirjata täsmälleen tositteen mukaisena. Avaa selitys.',
  microContentId: 'mikrosisalto-4',
};
const err = { balance: balanceFeedback, side: sideFeedback, account: accountFeedback, amount: amountFeedback };

// ─── Marraskuun loput 9 tositetta — kronologinen järjestys ────────────────────

export const novemberPhase2Exercises: DocumentExercise[] = [

  // ── 9. Myyntilasku 2026-002 (12.11.) ─────────────────────────────────────
  {
    template: {
      id: '2026-002',
      type: 'myyntilasku',
      monthOffset: 0,
      day: 12,
      description:
        'Mainostoimisto Aalto Oy tilaa Katilta verkkosivun ulkoasun. Kati lähettää laskun 3 500 €, maksuaika 14 pv.',
      amount: 3500,
      counterparty: 'Mainostoimisto Aalto Oy',
      invoiceNumber: '2026-002',
      dueDay: 26,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 3500 },
      { account: '3000', side: 'kredit', amount: 3500 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Oletko valinnut oikeat tilit? Muista: lasku ei ole vielä maksettu.',
        attempt2: 'Myyntilasku ei tuota rahaa heti — syntyy saaminen. Mikä tili kuvaa saamista?',
        attempt3: 'Myyntilasku → 1700 Myyntisaamiset (debet) ja 3000 Myynti (kredit). Avaa selitys.',
        microContentId: 'mikrosisalto-5',
      },
    },
    orientationQuestion: 'Kati on lähettänyt laskun mutta rahaa ei ole vielä tullut. Milloin syntyy myyntisaaminen?',
    explanation:
      'Toinen myyntilasku — sama kirjausperiaate. Lasku syntyy lähetyshetkellä, jolloin kirjataan myyntisaaminen (1700 debet) ja myyntitulo (3000 kredit). Maksu tulee 26.11. ja sulkee saamisen.',
  },

  // ── 10. Kuitti Tankki24 — polttoaine (13.11.) ─────────────────────────────
  {
    template: {
      id: 'kuitti-tankki24-001',
      type: 'kuitti',
      monthOffset: 0,
      day: 13,
      description:
        'Kati tankkaa autonsa Tankki24:llä ajoa varten. Hän maksaa kortilla 60 €.',
      amount: 60,
      counterparty: 'Tankki24 Oy',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 60 },
      { account: '1910', side: 'kredit', amount: 60 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Polttoaine on kulu yritykselle — mutta mille kulutilille?',
        attempt2: 'Polttoaine ei ole ainetta tai tarviketta, jota myydään asiakkaalle. Mihin kulutiliin se kuuluu?',
        attempt3: 'Polttoaine = liiketoiminnan yleiskulu → 8400 Liiketoiminnan muut kulut. Avaa selitys.',
        microContentId: 'mikrosisalto-6',
      },
    },
    orientationQuestion: 'Onko polttoaine muuttuva kulu (4000) vai liiketoiminnan yleiskulu (8400)?',
    explanation:
      'Polttoaine on liiketoiminnan yleiskulu — se ei päädy asiakkaan tuotteeseen eikä vaikuta suoraan liikevaihtoon. Tili 8400 Liiketoiminnan muut kulut (debet). Kortilla maksaminen veloittaa pankkitililtä heti (1910 kredit).',
  },

  // ── 11. Myyntilasku 2026-003 (19.11.) ────────────────────────────────────
  {
    template: {
      id: '2026-003',
      type: 'myyntilasku',
      monthOffset: 0,
      day: 19,
      description:
        'Kustannus Vehka Oy tilaa kausijulkaisun taiton. Kati lähettää laskun 2 100 €, maksuaika 14 pv — eräpäivä 3.12.',
      amount: 2100,
      counterparty: 'Kustannus Vehka Oy',
      invoiceNumber: '2026-003',
      dueDay: 3,
      dueDayOffset: 1,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 2100 },
      { account: '3000', side: 'kredit', amount: 2100 },
    ],
    errorMessages: err,
    orientationQuestion: 'Eräpäivä on joulukuun puolella. Milloin kirjaus tehdään — lähetys- vai maksupäivänä?',
    explanation:
      'Kirjaus tehdään aina laskun LÄHETYSPÄIVÄNÄ (suoriteperuste). Vaikka maksu tulee vasta joulukuussa, myyntisaaminen (1700) syntyy jo 19.11. Tästä tulee marraskuun lopussa avoinna oleva saaminen.',
  },

  // ── 12. Kuitti Halpa-Tukku — tarralappuja (20.11.) ───────────────────────
  // HUOM: tarralappuja = myydään asiakkaalle (pakkausmateriaalit) → 4000, ei 8400
  {
    template: {
      id: 'kuitti-halpatukku-001',
      type: 'kuitti',
      monthOffset: 0,
      day: 20,
      description:
        'Kati ostaa Halpa-Tukusta tarralappuja 24 €. Hän käyttää niitä asiakkaiden tilauksia pakatessaan — tarrat päätyvät asiakkaan tuotteeseen.',
      amount: 24,
      counterparty: 'Halpa-Tukku Oy',
    },
    correctEntries: [
      { account: '4000', side: 'debet',  amount: 24 },
      { account: '1910', side: 'kredit', amount: 24 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Tarralappuja käytetään asiakkaan tilauksessa. Onko kyseessä muuttuva vai kiinteä kulu?',
        attempt2: 'Vertaa: toimistotarvikkeet (kynät) → 8400, mutta pakkausmateriaalit jotka päätyvät asiakkaalle → mikä tili?',
        attempt3: 'Pakkausmateriaalit ovat ainetta/tarviketta joka myydään tai toimitetaan asiakkaalle → 4000 Aineet ja tarvikkeet. Avaa selitys.',
        microContentId: 'mikrosisalto-6',
      },
    },
    orientationQuestion: 'Nämä tarralappuja päätyvät asiakkaan pakkaukseen. Onko se sama kuin toimistokynät?',
    explanation:
      'Avainero: tarralappuja MENEE ASIAKKAAN TILAUKSEN MUKANA → 4000 Aineet ja tarvikkeet (muuttuva kulu). Toimistokynät ovat Katin omaan käyttöön → 8400 Liiketoiminnan muut kulut. Muuttuva kulu kasvaa liikevaihdon mukana; yleiskulu on vakio.',
  },

  // ── 13. Ostolasku TX-779 TyöterveysX (21.11.) ────────────────────────────
  {
    template: {
      id: 'tx-779',
      type: 'ostolasku',
      monthOffset: 0,
      day: 21,
      description:
        'TyöterveysX Oy laskuttaa Katia ergonomiatarkastuksesta 351,40 €. Maksuehto 21 pv, eräpäivä 12.12.',
      amount: 351.40,
      counterparty: 'TyöterveysX Oy',
      invoiceNumber: 'TX-779',
      dueDay: 12,
      dueDayOffset: 1,
      paymentTerm: '21 pv netto',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 351.40 },
      { account: '2520', side: 'kredit', amount: 351.40 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Ergonomiatarkastus on kulu — mutta maksetaanko se heti vai myöhemmin?',
        attempt2: 'Maksuehto on 21 pv → rahaa ei vielä lähde. Syntyykö ostovelka vai pankkiveloitus?',
        attempt3: 'Maksuehto → 2520 Ostovelat (kredit). Terveys­kulut → 8400 Liiketoiminnan muut kulut (debet). Avaa selitys.',
        microContentId: 'mikrosisalto-7',
      },
    },
    orientationQuestion: 'Maksuehto on 21 pv. Miten se vaikuttaa siihen, mitä kredit-puolelle kirjataan?',
    explanation:
      'Kun ostolasku on maksuehdolla (ei kortti), raha ei lähde vielä pankkitililtä. Syntyy ostovelka (2520 kredit). Kulu kirjataan heti laskun saapumispäivänä (8400 debet). Ostovelka suljetaan 12.12. kun lasku maksetaan.',
  },

  // ── 14. Yksityisnosto 2 (24.11.) ─────────────────────────────────────────
  {
    template: {
      id: 'yn-002',
      type: 'yksityisnosto',
      monthOffset: 0,
      day: 24,
      description:
        'Kati siirtää 1 200 € yrityksen pankkitililtä omaan käyttöönsä — toinen yksityisnosto marraskuussa.',
      amount: 1200,
      counterparty: 'Kati Mäkinen (henkilökohtainen tili)',
    },
    correctEntries: [
      { account: '2080', side: 'debet',  amount: 1200 },
      { account: '1910', side: 'kredit', amount: 1200 },
    ],
    errorMessages: err,
    orientationQuestion: 'Yksityisnosto on sama mekanismi kuin aiemmin. Muistatko kumpi tili debetoidaan?',
    explanation:
      'Yksityisnosto vähentää yrityksen pääomaa (2080 debet) ja pankkitilin saldoa (1910 kredit). Yksityistilin (2080) kasvava debet-saldo tarkoittaa, että Kati on nostanut enemmän kuin sijoittanut.',
  },

  // ── 15. Myyntilasku 2026-004 (26.11.) ────────────────────────────────────
  {
    template: {
      id: '2026-004',
      type: 'myyntilasku',
      monthOffset: 0,
      day: 26,
      description:
        'Energiapalvelu Tähti Oy tilaa esitemateriaalin. Kati lähettää laskun 800 €, maksuaika 14 pv — eräpäivä 10.12.',
      amount: 800,
      counterparty: 'Energiapalvelu Tähti Oy',
      invoiceNumber: '2026-004',
      dueDay: 10,
      dueDayOffset: 1,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 800 },
      { account: '3000', side: 'kredit', amount: 800 },
    ],
    errorMessages: err,
    explanation:
      'Neljäs myyntilasku marraskuussa — eräpäivä joulukuun puolella. Saamiset (1700) kasvavat. Marraskuun lopussa avoimia saamisia on yhteensä 2 900 € (2026-003 + 2026-004).',
  },

  // ── 16. Tiliote — Mainostoimisto Aalto maksaa 2026-002 (26.11.) ───────────
  {
    template: {
      id: 'tiliote-003',
      type: 'tiliotetapahtuma',
      monthOffset: 0,
      day: 26,
      description:
        'Tiliote: Mainostoimisto Aalto Oy maksaa laskun 2026-002. Hyvitys 3 500 € näkyy yrityksen pankkitilillä.',
      amount: 3500,
      counterparty: 'Mainostoimisto Aalto Oy',
      referenceNumber: '2026-002',
    },
    correctEntries: [
      { account: '1910', side: 'debet',  amount: 3500 },
      { account: '1700', side: 'kredit', amount: 3500 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Raha tulee tilille ja jokin saaminen sulkeutuu. Mitkä tilit liikkuvat?',
        attempt2: 'Myyntisuoritus = pankkitili kasvaa (1910 debet) ja myyntisaaminen poistuu. Mitä saaminen-tilille tehdään?',
        attempt3: '1910 Pankkitili debet (raha tulee) + 1700 Myyntisaamiset kredit (saaminen sulkeutuu). Avaa selitys.',
        microContentId: 'mikrosisalto-5',
      },
    },
    orientationQuestion: 'Lasku on jo kirjattu myyntisaamisiin (1700). Mitä tapahtuu kun asiakas maksaa?',
    explanation:
      'Kun asiakas maksaa, myyntisaaminen sulkeutuu: 1700 kredit (saaminen poistuu) ja 1910 debet (pankki kasvaa). Kirjaus on peili myyntilaskun kirjaukselle. Mainostoimisto Aalto maksoi ajoissa — eräpäivä oli 26.11.',
  },

  // ── 17. Kuitti NetCom — 4G-mokkula (27.11.) ──────────────────────────────
  {
    template: {
      id: 'kuitti-netcom-001',
      type: 'kuitti',
      monthOffset: 0,
      day: 27,
      description:
        'NetCom Oy laskuttaa 4G-mokkulan kuukausimaksun 18 €. Kati käyttää mokkulaa asiakastöiden tekemiseen etänä.',
      amount: 18,
      counterparty: 'NetCom Oy',
    },
    correctEntries: [
      { account: '8390', side: 'debet',  amount: 18 },
      { account: '1910', side: 'kredit', amount: 18 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: '4G-mokkula on IT-laite. Onko se sama kuin yleinen liiketoimintakulu?',
        attempt2: 'Tietotekniikkaan liittyvät kulut (ohjelmistot, yhteydet, laitteet) kuuluvat omaan tiliinsä. Mikä se on?',
        attempt3: '4G-mokkulan kk-maksu → 8390 Tietotekniikkakulut (debet). Kortilla maksettu → 1910 kredit. Avaa selitys.',
        microContentId: 'mikrosisalto-6',
      },
    },
    orientationQuestion: '4G-mokkula on IT-yhteys. Eroaako sen kirjaus muista liiketoimintakuluista?',
    explanation:
      'Tietotekniikkakulut (ohjelmistot, nettiyhteydet, laitteet) kirjataan omalle tilille 8390, ei yleiseen 8400:aan. Tämä mahdollistaa IT-kulujen seurannan erikseen. NetCom:n korttiveloitus = 1910 kredit.',
  },
];
