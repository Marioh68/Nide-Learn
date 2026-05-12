import type { DocumentExercise } from '@/types/exercises';

// Shared feedback templates — reused across all documents
// Attempt 1: abstract, student thinks independently
// Attempt 2: concrete hint
// Attempt 3: hint + microContentId
const balanceFeedback = {
  attempt1: 'Kirjauksesi ei ole vielä tasapainossa. Tarkista debet- ja kredit-puolten summat.',
  attempt2: 'Debet- ja kredit-summien on oltava yhtä suuret. Onko joku summa kirjoitettu väärään paikkaan?',
  attempt3: 'Kahdenkertaisessa kirjanpidossa jokainen kirjaus on aina tasapainossa. Avaa selitys alla.',
  microContentId: 'mikrosisalto-1',
};

const sideFeedback = {
  attempt1: 'Tarkista, kummalle puolelle kukin rivi kuuluu.',
  attempt2: 'Mieti, kummalle tilille raha tulee (debet) ja kummalta se lähtee (kredit). Raha ei voi tulla ja lähteä samalta tililtä.',
  attempt3: 'Debet on tilien vasen puoli, kredit oikea. Vastaavaa-tilejä debetoidaan kun saldo kasvaa. Avaa selitys.',
  microContentId: 'mikrosisalto-1',
};

const accountFeedback = {
  attempt1: 'Jokin tileistä ei ole oikein. Tarkista tilikartta.',
  attempt2: 'Mieti, mitä tapahtuu yrityksessä: mihin varaan tai velaan tämä liiketapahtuma vaikuttaa?',
  attempt3: 'Katso tilikarttaa: mille tilille tämän tyyppinen tapahtuma kirjataan? Avaa selitys.',
  microContentId: 'mikrosisalto-3',
};

const amountFeedback = {
  attempt1: 'Summa ei täsmää. Tarkista tositekortin summa uudelleen.',
  attempt2: 'Vertaa syöttämääsi summaa tositekorttiin. Onko sentin tarkkuus oikein?',
  attempt3: 'Kirjanpidossa summa pitää kirjata täsmälleen tositteen mukaisena. Avaa selitys.',
  microContentId: 'mikrosisalto-4',
};

const defaultErrorMessages = {
  balance: balanceFeedback,
  side: sideFeedback,
  account: accountFeedback,
  amount: amountFeedback,
};

// ─── 8 ainutkertaista tositetta — pedagoginen järjestys ──────────────────────

export const novemberPhase1Exercises: DocumentExercise[] = [
  // ── 1. Yksityissijoitus ───────────────────────────────────────────────────
  {
    template: {
      id: 'ys-001',
      type: 'yksityissijoitus',
      monthOffset: 0,
      day: 1,
      description:
        'Kati Mäkinen perustaa yrityksensä. Hän siirtää 5 000 € omalta henkilökohtaiselta tililtään Nide Bankin yritystilille aloittaakseen liiketoiminnan.',
      amount: 5000,
      counterparty: 'Kati Mäkinen (henkilökohtainen tili)',
    },
    correctEntries: [
      { account: '1910', side: 'debet',  amount: 5000 },
      { account: '2080', side: 'kredit', amount: 5000 },
    ],
    errorMessages: defaultErrorMessages,
    orientationQuestion:
      'Pohdi ennen kuin aloitat: Mitä tapahtuu pankkitilille? Entä mistä raha tulee — onko se yrityksen velka vai yrittäjän omaa pääomaa?',
    explanation:
      'Yksityissijoituksessa raha siirtyy yrittäjän omalta tililtä yrityksen pankkitilille. Pankkitili (1910) kasvaa → debet. Yksityistili (2080) kirjataan kredit — se kuvaa yrittäjän omaa pääomaa, jota hän on sijoittanut yritykseen.',
  },

  // ── 2. Yksityisnosto ─────────────────────────────────────────────────────
  {
    template: {
      id: 'yn-001',
      type: 'yksityisnosto',
      monthOffset: 0,
      day: 10,
      description:
        'Kati nostaa 1 500 € yritystililtä omiin elämiskuluihinsa. Toiminimessä tämä on yksityisnosto, ei palkka.',
      amount: 1500,
      counterparty: 'Kati Mäkinen (yksityiskäyttö)',
    },
    correctEntries: [
      { account: '2080', side: 'debet',  amount: 1500 },
      { account: '1910', side: 'kredit', amount: 1500 },
    ],
    errorMessages: defaultErrorMessages,
    orientationQuestion:
      'Pohdi: Miksi yksityisnosto kirjataan eri tavalla kuin palkka? Mihin tuloslaskelman tiliin se ei kuulu?',
    explanation:
      'Yksityisnosto ei ole kulu — se on yrittäjän oman pääoman vähennys. Yksityistili (2080) debetoidaan (oma pääoma pienenee) ja pankkitili (1910) kreditoidaan (raha lähtee). Tuloslaskelmaan tämä ei vaikuta lainkaan.',
  },

  // ── 3. Myyntilasku ───────────────────────────────────────────────────────
  {
    template: {
      id: '2026-001',
      type: 'myyntilasku',
      monthOffset: 0,
      day: 5,
      description:
        'Kati saa ensimmäisen tilauksensa: Kahvila Aamu Oy haluaa logosuunnittelun. Kati lähettää laskun heti työn valmistuttua.',
      amount: 1200,
      counterparty: 'Kahvila Aamu Oy',
      invoiceNumber: '2026-001',
      dueDay: 19,
      paymentTerm: '14 pv netto',
      referenceNumber: '1001',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 1200 },
      { account: '3000', side: 'kredit', amount: 1200 },
    ],
    errorMessages: {
      ...defaultErrorMessages,
      account: {
        attempt1: 'Jokin tileistä ei täsmää. Mitä tilille tapahtuu kun lähetät laskun — saatko rahaa heti vai vasta myöhemmin?',
        attempt2: 'Myyntilasku kirjataan suoriteperusteisesti: palvelu on suoritettu, mutta maksu ei ole vielä saapunut. Tämä tarkoittaa, että asiakkaalla on velka sinulle.',
        attempt3: 'Kirjaus: Myyntisaamiset (1700) debet — asiakas on sinulle velassa. Myynti (3000) kredit — liikevaihto kasvaa. Avaa selitys.',
        microContentId: 'mikrosisalto-4',
      },
    },
    orientationQuestion:
      'Pohdi: Lähdetäänkö raha heti pankkitilille kun lähetät laskun? Vai syntyykö jotain muuta ensin?',
    explanation:
      'Myyntilasku kirjataan suoriteperusteisesti — palvelu on suoritettu, joten tulo kirjataan heti. Koska maksu ei ole vielä saapunut, syntyy myyntisaaminen (1700). Myynti (3000) kasvaa kredit-puolella.',
  },

  // ── 4. Kuitti — toimistotarvikkeet ──────────────────────────────────────
  {
    template: {
      id: 'kuitti-001',
      type: 'kuitti',
      monthOffset: 0,
      day: 7,
      description:
        'Kati käy Toimisto-Express Oy:ssä hakemassa toimistotarvikkeita: kyniä, muistilappuja ja kirjekuoria. Hän maksaa kortilla.',
      amount: 35,
      counterparty: 'Toimisto-Express Oy',
      paymentTerm: 'Korttimaksu',
    },
    correctEntries: [
      { account: '4000', side: 'debet',  amount: 35 },
      { account: '1910', side: 'kredit', amount: 35 },
    ],
    errorMessages: defaultErrorMessages,
    orientationQuestion:
      'Pohdi: Kuitti on jo maksettu heti. Syntyykö ostovelkaa vai lähtikö raha suoraan pankkitililtä?',
    explanation:
      'Kuitilla ostettu tavara on maksettu välittömästi. Aineet ja tarvikkeet (4000) debetoidaan — kulu syntyy. Pankkitili (1910) kreditoidaan — raha on jo lähtenyt tililtä.',
  },

  // ── 5. Ostolasku — suoramaksu (PixelPro) ────────────────────────────────
  {
    template: {
      id: 'ac-2611',
      type: 'ostolasku',
      monthOffset: 0,
      day: 4,
      description:
        'PixelPro Software Ltd veloittaa automaattisesti Katin kortilta kuukausittaisen Adobe-vastaavan ohjelmistolisenssin. Veroton hinta 79,00 € + ALV (Taso 1: kirjataan kokonaissummana).',
      amount: 99.15,
      counterparty: 'PixelPro Software Ltd',
      invoiceNumber: 'AC-2611',
      paymentTerm: 'Kortin automaattiveloitus',
    },
    correctEntries: [
      { account: '8390', side: 'debet',  amount: 99.15 },
      { account: '1910', side: 'kredit', amount: 99.15 },
    ],
    errorMessages: {
      ...defaultErrorMessages,
      account: {
        attempt1: 'Tarkista tilikartta: mihin tiliryhmään ohjelmistokulut kuuluvat?',
        attempt2: 'Ohjelmisto- ja IT-kulut kuuluvat omaan tiliinsä. Katso 8xxx-ryhmää tililuettelosta.',
        attempt3: 'Tietotekniikkakulut (8390) on oikea tili IT-ohjelmistoille. Koska maksu veloitetaan kortilta heti, ostovelkaa ei synny. Avaa selitys.',
        microContentId: 'mikrosisalto-4',
      },
    },
    orientationQuestion:
      'Pohdi: Tämä on ostolasku, mutta maksu tapahtuu automaattisesti kortilta. Eroaako kirjaus kuiteista?',
    explanation:
      'Kun ostolasku maksetaan välittömästi (korttiveloitus), kirjaus on sama kuin kuitilla: kulu debetoidaan ja pankkitili kreditoidaan. Ostovelkaa ei synny. IT-ohjelmistot kirjataan tilille 8390 Tietotekniikkakulut.',
  },

  // ── 6. Ostolasku — maksuehdolla (Lehti-ilmoitus Pohjola) ────────────────
  {
    template: {
      id: 'lp-1142',
      type: 'ostolasku',
      monthOffset: 0,
      day: 14,
      description:
        'Kati on tilannut ilmoituksen paikalliseen ammattilehteen markkinoidakseen palveluitaan. Lehti-ilmoitus Pohjola Oy lähettää laskun 14 päivän maksuehdolla.',
      amount: 564.75,
      counterparty: 'Lehti-ilmoitus Pohjola Oy',
      invoiceNumber: 'LP-1142',
      dueDay: 28,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 564.75 },
      { account: '2520', side: 'kredit', amount: 564.75 },
    ],
    errorMessages: {
      ...defaultErrorMessages,
      account: {
        attempt1: 'Tarkista molemmat tilit. Mihin ryhmään markkinointikulu kuuluu? Entä kun laskua ei vielä makseta?',
        attempt2: 'Kun laskua ei makseta heti, rahaa ei lähde pankkitililtä — syntyy ostovelka. Markkinointikulut kuuluvat liiketoiminnan muihin kuluihin.',
        attempt3: 'Liiketoiminnan muut kulut (8400) debet, Ostovelat (2520) kredit. Maksu tehdään eräpäivänä 28.11. Avaa selitys.',
        microContentId: 'mikrosisalto-4',
      },
    },
    orientationQuestion:
      'Pohdi: Tässä on maksuehto "14 pv netto". Lähteekö raha nyt vai myöhemmin? Mitä kirjanpitoon pitää merkitä?',
    explanation:
      'Ostolaskulla on maksuehto — raha ei lähde heti. Siksi syntyy ostovelka (2520): Kati on velkaa toimittajalle. Liiketoiminnan muut kulut (8400) debetoidaan — kulu kirjataan heti kun lasku saapuu, ei vasta kun se maksetaan.',
  },

  // ── 7. Tiliotetapahtuma — myyntisuoritus ────────────────────────────────
  {
    template: {
      id: 'tiliote-001',
      type: 'tiliotetapahtuma',
      monthOffset: 0,
      day: 19,
      description:
        'Kahvila Aamu Oy maksaa laskunsa 2026-001 eräpäivänä. Tiliote näyttää hyvityksen 1 200,00 € yritystilille.',
      amount: 1200,
      counterparty: 'Kahvila Aamu Oy',
      invoiceNumber: '2026-001',
    },
    correctEntries: [
      { account: '1910', side: 'debet',  amount: 1200 },
      { account: '1700', side: 'kredit', amount: 1200 },
    ],
    errorMessages: {
      ...defaultErrorMessages,
      account: {
        attempt1: 'Raha saapuu tilille. Mitä tapahtuu myyntisaamiselle kun asiakas maksaa?',
        attempt2: 'Kun asiakas maksaa, myyntisaaminen poistuu ja pankkitilin saldo kasvaa. Molemmat muutokset pitää kirjata.',
        attempt3: 'Pankkitili (1910) debet — raha saapuu. Myyntisaamiset (1700) kredit — saaminen lakkaa olemasta. Avaa selitys.',
        microContentId: 'mikrosisalto-4',
      },
    },
    orientationQuestion:
      'Pohdi: Lasku 2026-001 kirjattiin jo 5.11. Mitä tapahtuu nyt kun asiakas maksaa? Pitääkö myynti kirjata uudelleen?',
    explanation:
      'Maksusuoritus ei ole uusi myynti — myynti kirjattiin jo laskupäivänä. Tässä kirjataan vain rahan liike: myyntisaaminen (1700) poistuu kredit-puolelta ja pankkitili (1910) kasvaa debet-puolella.',
  },

  // ── 8. Tiliotetapahtuma — ostovelan maksu ───────────────────────────────
  {
    template: {
      id: 'tiliote-002',
      type: 'tiliotetapahtuma',
      monthOffset: 0,
      day: 28,
      description:
        'Lehti-ilmoitus Pohjola Oy:n laskun LP-1142 eräpäivä on tänään. Kati maksaa laskun verkkopankissa ja tiliote näyttää veloituksen 564,75 €.',
      amount: 564.75,
      counterparty: 'Lehti-ilmoitus Pohjola Oy',
      invoiceNumber: 'LP-1142',
    },
    correctEntries: [
      { account: '2520', side: 'debet',  amount: 564.75 },
      { account: '1910', side: 'kredit', amount: 564.75 },
    ],
    errorMessages: {
      ...defaultErrorMessages,
      account: {
        attempt1: 'Ostovelka on aiemmin kirjattu. Mitä tapahtuu kun velka maksetaan?',
        attempt2: 'Kun ostovelka maksetaan, velka poistuu ja pankkitilin saldo pienenee. Kulu on jo kirjattu — nyt kirjataan vain rahan liike.',
        attempt3: 'Ostovelat (2520) debet — velka poistuu. Pankkitili (1910) kredit — raha lähtee. Kulu (8400) on jo kirjattu 14.11. Avaa selitys.',
        microContentId: 'mikrosisalto-4',
      },
    },
    orientationQuestion:
      'Pohdi: Lasku LP-1142 kirjattiin kuluksi jo 14.11. Kirjataanko kulu nyt uudelleen vai tapahtuuko jotain muuta?',
    explanation:
      'Ostovelan maksu ei ole uusi kulu — kulu kirjattiin jo laskun saapuessa. Tässä kirjataan vain rahan liike: ostovelka (2520) poistetaan debet-puolella ja pankkitili (1910) kreditoidaan — raha lähtee.',
  },
];
