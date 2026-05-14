import type { DocumentExercise } from '@/types/exercises';

// Shared feedback
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
  attempt2: 'Tarkista jokainen rivi erikseen. Palkkakirjauksessa tarvitaan bruttopalkka, pidätys ja netto.',
  attempt3: 'Brutto = pidätys + netto. Kaikkien rivien on summattava nollaan. Avaa selitys.',
  microContentId: 'mikrosisalto-4',
};
const err = { balance: balanceFeedback, side: sideFeedback, account: accountFeedback, amount: amountFeedback };

// ─── Maaliskuu 2027 — Taso 3: palkat ja sotumaksut ────────────────────────────
// monthOffset 4 = maaliskuu
// monthOffset 5 = huhtikuu (ALV-maksu 12.4.)
//
// Palkkakirjauksen logiikka:
//   Bruttopalkka  : 5000 Palkat ja palkkiot    D 1 500,00
//   Ennakonpidätys: 2960 Ennakonpidätysvelka   K   375,00  (25 % bruttosta)
//   Nettopalkat   : 2910 Palkkavelka           K 1 125,00
//   Sotumaksu 2 % : 5300 Työnantajan sotumaksut D    30,00  / 2970 Sotumaksuvelka K 30,00
//   Palkanmaksu   : 2910 Palkkavelka           D 1 125,00  / 1910 K 1 125,00
//   Tilitys       : 2960 D 375 / 2970 D 30    / 1910 K   405,00
//
// ALV-laskenta maaliskuulta:
//   Suoritettava 2871: 382,50
//   Vähennettävä 2920: 2,55  (kuitti: toimistotarv. 10 € veroton, ALV 2,55)
//   Tilitettävä 2870: 379,95

export const marchExercises: DocumentExercise[] = [

  // ── 1. Myyntilasku ALV 25,5 % — Designklubi ry (5.3.) ────────────────────
  {
    template: {
      id: 'mar-001',
      type: 'myyntilasku',
      monthOffset: 4,
      day: 5,
      description:
        'Kati suunnittelee Designklubi ry:lle kevään jäsentiedotteen visuaalisen ilmeen. Veroton 1 500 €, ALV 25,5 % = 382,50 €. Lasku yhteensä 1 882,50 €. Maksuehto 14 pv.',
      amount: 1882.50,
      vatRate: 25.5,
      counterparty: 'Designklubi ry',
      invoiceNumber: '2027-007',
      dueDay: 19,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 1882.50 },
      { account: '3000', side: 'kredit', amount: 1500    },
      { account: '2871', side: 'kredit', amount: 382.50  },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Tuttu myyntilasku. Sama 3 rivin rakenne kuin aiemminkin.',
        attempt2: '1700 D koko summa / 3000 K veroton / 2871 K ALV.',
        attempt3: '1700 D 1 882,50 / 3000 K 1 500 / 2871 K 382,50. Avaa selitys.',
        microContentId: 'mikrosisalto-8',
      },
    },
    explanation:
      '1700 D 1 882,50 / 3000 K 1 500 / 2871 K 382,50. Maaliskuun ensimmäinen myyntilasku — kaava on jo varma.',
  },

  // ── 2. Kuitti — toimistotarvike (7.3.) ────────────────────────────────────
  {
    template: {
      id: 'mar-002',
      type: 'kuitti',
      monthOffset: 4,
      day: 7,
      description:
        'Kati ostaa tulostinpaperia Toimistokeskus Oy:stä. Veroton 10,00 €, ALV 25,5 % = 2,55 €. Yhteensä 12,55 €.',
      amount: 12.55,
      vatRate: 25.5,
      counterparty: 'Toimistokeskus Oy',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 10    },
      { account: '2920', side: 'debet',  amount: 2.55  },
      { account: '1910', side: 'kredit', amount: 12.55 },
    ],
    errorMessages: { ...err },
    explanation:
      '8400 D 10 / 2920 D 2,55 / 1910 K 12,55. Tavallinen kuitti — kerrattu rakenne.',
  },

  // ── 3. Palkkakirjaus — Pekka Korhonen (31.3.) ────────────────────────────
  // Bruttopalkka 1 500 €, ennakonpidätys 25 % = 375 €, netto 1 125 €
  {
    template: {
      id: 'mar-003',
      type: 'muistiotosite',
      monthOffset: 4,
      day: 31,
      description:
        'Katin osa-aikainen avustaja Pekka Korhonen maaliskuun palkat. Bruttopalkka 1 500,00 €. Ennakonpidätys 25 % = 375,00 €. Nettopalkat 1 125,00 €. Palkka maksetaan 31.3. (kirjataan palkkavelka).',
      amount: 1500,
      counterparty: 'Pekka Korhonen',
    },
    correctEntries: [
      { account: '5000', side: 'debet',  amount: 1500 },
      { account: '2960', side: 'kredit', amount: 375  },
      { account: '2910', side: 'kredit', amount: 1125 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Palkkakirjauksessa tarvitaan palkkatili (kulu), ennakonpidätysvelka ja palkkavelka. Mitkä tilit vastaavat näitä?',
        attempt2: '5000 Palkat D (brutto) / 2960 Ennakonpidätysvelka K (pidätys) / 2910 Palkkavelka K (netto).',
        attempt3: '5000 D 1 500 / 2960 K 375 / 2910 K 1 125. Avaa selitys.',
        microContentId: 'mikrosisalto-3',
      },
      amount: {
        attempt1: 'Tarkista: brutto = ennakonpidätys + netto. 1 500 = 375 + 1 125.',
        attempt2: '5000 D 1 500 / 2960 K 375 / 2910 K 1 125. Kaikki kolme summaa täytyy syöttää.',
        attempt3: 'Brutto debetoidaan kokonaan, kredit jakautuu pidätykseen ja nettoon. Avaa selitys.',
        microContentId: 'mikrosisalto-4',
      },
    },
    orientationQuestion:
      'Kati maksaa avustajalleen 1 500 € bruttopalkkaa. Verovirasto ottaa 25 % ennakonpidätyksenä. Mitä kolmea tiliä kirjauksessa tarvitaan?',
    explanation:
      'Palkkakirjaus: 5000 Palkat D 1 500 (bruttopalkka kuluksi) / 2960 Ennakonpidätysvelka K 375 (pidätys yritykseltä Verohallinnolle edelleen) / 2910 Palkkavelka K 1 125 (nettopalkkaa odotetaan vielä maksettavaksi). Brutto = ennakonpidätys + netto: 1 500 = 375 + 1 125.',
  },

  // ── 4. Työnantajan sotumaksukirjaus (31.3.) ───────────────────────────────
  // Sotumaksu 2 % bruttopalkasta: 1 500 × 0,02 = 30,00 €
  {
    template: {
      id: 'mar-004',
      type: 'muistiotosite',
      monthOffset: 4,
      day: 31,
      description:
        'Työnantajan sosiaaliturvamaksu (sotu) maaliskuulta. Sotu-% 2,00 % × bruttopalkka 1 500 € = 30,00 €. Velka Verohallinnolle kirjataan.',
      amount: 30,
      counterparty: 'Verohallinto',
    },
    correctEntries: [
      { account: '5300', side: 'debet',  amount: 30 },
      { account: '2970', side: 'kredit', amount: 30 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Sotumaksu on työnantajan kulu — ei vähennetä palkasta. Mitkä tilit käytetään?',
        attempt2: '5300 Työnantajan sotumaksut D (kulu) / 2970 Sosiaaliturvamaksuvelka K (velka Verohallinnolle).',
        attempt3: '5300 D 30 / 2970 K 30. Avaa selitys.',
        microContentId: 'mikrosisalto-3',
      },
      amount: {
        attempt1: 'Laske: bruttopalkka × sotumaksuprosentti. 1 500 × 0,02.',
        attempt2: '1 500 × 0,02 = 30,00 €.',
        attempt3: '5300 D 30 / 2970 K 30. Avaa selitys.',
        microContentId: 'mikrosisalto-4',
      },
    },
    orientationQuestion:
      'Sotumaksu on työnantajan oma kulu — se ei vähennetä työntekijän palkasta. Miten se kirjataan?',
    explanation:
      'Työnantajan sotumaksu on erillinen kulu (5300) palkkakulun lisäksi. Se ei näy palkkalaskelmassa, koska se ei tule palkansaajalta. 1 500 × 2 % = 30,00 €. Velka (2970) maksetaan yhdessä ennakonpidätyksen (2960) kanssa Verohallinnolle.',
  },

  // ── 5. Palkanmaksu tiliote (31.3.) ────────────────────────────────────────
  {
    template: {
      id: 'mar-005',
      type: 'tiliotetapahtuma',
      monthOffset: 4,
      day: 31,
      description:
        'Tiliote: nettopalkan maksu Pekka Korhoselle. Veloitus 1 125,00 € pankkitililtä. Palkkavelka (2910) sulkeutuu.',
      amount: 1125,
      counterparty: 'Pekka Korhonen',
      referenceNumber: 'PALKKA 03/2027',
    },
    correctEntries: [
      { account: '2910', side: 'debet',  amount: 1125 },
      { account: '1910', side: 'kredit', amount: 1125 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Palkkavelka sulkeutuu kun maksu lähtee pankkitililtä. Mitkä kaksi tiliä?',
        attempt2: '2910 Palkkavelka D (velka poistuu) / 1910 Pankkitili K (raha lähtee).',
        attempt3: '2910 D 1 125 / 1910 K 1 125. Avaa selitys.',
        microContentId: 'mikrosisalto-3',
      },
    },
    explanation:
      '2910 D 1 125 / 1910 K 1 125. Palkkavelka kirjattiin 31.3. palkkakirjauksessa — nyt se sulkeutuu maksun yhteydessä. Nettopalkkaa maksetaan 1 125 €.',
  },

  // ── 6. Ennakonpidätyksen ja sotumaksun tilitys Verohallinnolle (31.3.) ───
  // Maksu: 2960 (375) + 2970 (30) = 405 €
  {
    template: {
      id: 'mar-006',
      type: 'tiliotetapahtuma',
      monthOffset: 4,
      day: 31,
      description:
        'Tiliote: ennakonpidätys + sotumaksu Verohallinnolle. Veloitus 405,00 €. Koostuu: ennakonpidätys 375,00 € + sotumaksu 30,00 €. Molemmat velat sulkeutuvat.',
      amount: 405,
      counterparty: 'Verohallinto',
      referenceNumber: 'EPL+SOTU 03/2027',
    },
    correctEntries: [
      { account: '2960', side: 'debet',  amount: 375 },
      { account: '2970', side: 'debet',  amount: 30  },
      { account: '1910', side: 'kredit', amount: 405 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Kaksi velkatiliä sulkeutuu samalla kertaa. Mitkä?',
        attempt2: '2960 Ennakonpidätysvelka D (375) + 2970 Sotumaksuvelka D (30) / 1910 K (405 lähtee pankista).',
        attempt3: '2960 D 375 / 2970 D 30 / 1910 K 405. Avaa selitys.',
        microContentId: 'mikrosisalto-3',
      },
      amount: {
        attempt1: 'Yhteissumma: ennakonpidätys + sotumaksu = ?',
        attempt2: '375 + 30 = 405 €.',
        attempt3: '2960 D 375 / 2970 D 30 / 1910 K 405. Avaa selitys.',
        microContentId: 'mikrosisalto-4',
      },
    },
    orientationQuestion:
      'Ennakonpidätys ja sotumaksu maksetaan samaan aikaan. Kumpi tili on velallinen kummallekin?',
    explanation:
      '2960 D 375 / 2970 D 30 / 1910 K 405. Yritys toimii siinä välissä: pidätti Pekalta 375 € ja maksaa sen nyt Verohallinnolle. Lisäksi maksetaan oma sotumaksu 30 €. Yhteensä 405 €.',
  },

  // ── 7. Tasapoisto maaliskuulta (31.3.) ────────────────────────────────────
  {
    template: {
      id: 'mar-007',
      type: 'muistiotosite',
      monthOffset: 4,
      day: 31,
      description:
        'Tasapoisto maaliskuulta: laptop (1 200 €, 60 kk). Kuukausierä 20,00 €. Sama kirjaus kuin helmikuussa.',
      amount: 20,
      counterparty: 'Sisäinen kirjaus',
    },
    correctEntries: [
      { account: '7680', side: 'debet',  amount: 20 },
      { account: '1200', side: 'kredit', amount: 20 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Sama poisto kuin helmikuussa. Mitkä tilit?',
        attempt2: '7680 Poistot D (kulu) / 1200 Koneet ja kalusto K (arvo pienenee).',
        attempt3: '7680 D 20 / 1200 K 20. Avaa selitys.',
        microContentId: 'mikrosisalto-3',
      },
    },
    explanation:
      '7680 D 20 / 1200 K 20. Kolmas kuukausi — poisto on nyt rutiinitoimenpide. Jäljellä 57 erää.',
  },

  // ── 8. ALV-tilitys maaliskuulta (31.3.) ──────────────────────────────────
  // Suoritettava 2871: 382,50
  // Vähennettävä 2920: 2,55
  // Netto 2870: 382,50 − 2,55 = 379,95
  {
    template: {
      id: 'mar-alv-tilitys',
      type: 'muistiotosite',
      monthOffset: 4,
      day: 31,
      description:
        'ALV-tilitys maaliskuulta 2027. Suoritettava ALV (2871): 382,50 €. Vähennettävä ALV (2920): 2,55 €. Tilitettävä nettovero (2870): 379,95 €. Eräpäivä 12.4.2027.',
      amount: 379.95,
      counterparty: 'Verohallinto',
    },
    correctEntries: [
      { account: '2871', side: 'debet',  amount: 382.50 },
      { account: '2920', side: 'kredit', amount: 2.55   },
      { account: '2870', side: 'kredit', amount: 379.95 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Sama ALV-tilitysrakenne kuin aiemmin. Mitkä kolme tiliä?',
        attempt2: '2871 D (suoritettava sulkeutuu) / 2920 K (vähennettävä sulkeutuu) / 2870 K (netto).',
        attempt3: '2871 D 382,50 / 2920 K 2,55 / 2870 K 379,95. Avaa selitys.',
        microContentId: 'mikrosisalto-9',
      },
    },
    explanation:
      '2871 D 382,50 / 2920 K 2,55 / 2870 K 379,95. Netto: 382,50 − 2,55 = 379,95 €. Maaliskuussa vähennyksiä vähän — vain yksi kuitti.',
  },

  // ── 9. ALV-maksu Verohallinnolle (12.4.) ─────────────────────────────────
  {
    template: {
      id: 'mar-alv-maksu',
      type: 'tiliotetapahtuma',
      monthOffset: 5,
      day: 12,
      description:
        'Tiliote: ALV-maksu Verohallinnolle maaliskuun verosta. Veloitus 379,95 € pankkitililtä. Tili 2870 sulkeutuu.',
      amount: 379.95,
      counterparty: 'Verohallinto',
      referenceNumber: 'ALV 03/2027',
    },
    correctEntries: [
      { account: '2870', side: 'debet',  amount: 379.95 },
      { account: '1910', side: 'kredit', amount: 379.95 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'ALV-velka maksetaan pankista. Sama kuin aiemmin.',
        attempt2: '2870 ALV-velka D (velka poistuu) / 1910 K (raha lähtee).',
        attempt3: '2870 D 379,95 / 1910 K 379,95. Avaa selitys.',
        microContentId: 'mikrosisalto-9',
      },
    },
    explanation:
      '2870 D 379,95 / 1910 K 379,95. Maaliskuun ALV-sykli päättyy — kaava on jo varma.',
  },
];
