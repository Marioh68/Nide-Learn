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
  attempt2: 'Huomaa: ALV:llisessa kirjauksessa tarvitset kolme summaa: veroton, ALV ja yhteensä.',
  attempt3: 'ALV-kirjauksessa: debet = kokonaissumma (sis. ALV), kredit = veroton + ALV erikseen. Avaa selitys.',
  microContentId: 'mikrosisalto-4',
};
const err = { balance: balanceFeedback, side: sideFeedback, account: accountFeedback, amount: amountFeedback };

// ALV-kohtaiset ohjeviestit myyntitilanteessa
const alvMyyntiFeedback = {
  attempt1: 'ALV:llisessa myyntilaskussa tarvitaan kolme riviä. Kuinka ALV jaetaan tilille?',
  attempt2: 'Myyntisaamiset debetoidaan koko summalla (sis. ALV). Kredit jakautuu: veroton myynti (3000) ja ALV (2871).',
  attempt3: '1700 D koko summa / 3000 K veroton / 2871 K ALV-osuus. Avaa selitys.',
  microContentId: 'mikrosisalto-8',
};

// ALV-kohtaiset ohjeviestit ostotilanteessa
const alvOstoFeedback = {
  attempt1: 'Ostolaskussa ALV on vähennyskelpoinen. Tarvitset kolme riviä — kaksi debet-puolelle.',
  attempt2: 'Kulu debetoidaan verottomalla määrällä, ALV debetoidaan tilille 2920. Kredit = ostovelka koko summalla.',
  attempt3: 'Kulutili D veroton / 2920 D ALV-osuus / 2520 K koko summa (tai 1910 K jos kuitti). Avaa selitys.',
  microContentId: 'mikrosisalto-8',
};

// ─── Tammikuu 2026 — ALV-rekisteröityminen (monthOffset 2) ────────────────────
// ALV-kanta: 25,5 % (yleinen kanta 1.1.2026 alkaen, AVL)
// Katin liikevaihto nov+joulukuu ≈ 18 580 € → ylitti 20 000 € rajan joulukuussa
// → ALV-rekisteröinti astui voimaan 1.1.2027 (monthOffset 2)
//
// ALV-tilit (kayttoonotto: 2):
//   2871 Suoritettava ALV myynneistä  (Vastattavaa, kredit myynnissä)
//   2920 Vähennettävä ALV ostoista    (Vastaavaa,  debet ostoissa)
//   2870 ALV-velka                    (Vastattavaa, tilityksen tulos)
//
// Tammikuun ALV-laskenta (harjoitukset 1–8):
//   Suoritettava ALV (2871): 306 + 510 + 382.50 + 204 = 1 402,50 €
//   Vähennettävä ALV (2920): 20.40 + 10.20 + 61.20 + 20.40 = 112,20 €
//   Tilitettävä netto (2870): 1 402,50 − 112,20 = 1 290,30 €

export const januaryExercises: DocumentExercise[] = [

  // ── 1. Myyntilasku ALV:lla — ensimmäinen (3.1.) ───────────────────────────
  {
    template: {
      id: 'jan-001',
      type: 'myyntilasku',
      monthOffset: 2,
      day: 3,
      description:
        'Kati laskuttaa Kahvila Aamu Oy:tä logon päivityksestä. Veroton hinta 1 200 €, ALV 25,5 % = 306 €. Laskun loppusumma 1 506 €.',
      amount: 1506,
      vatRate: 25.5,
      counterparty: 'Kahvila Aamu Oy',
      invoiceNumber: '2027-001',
      dueDay: 17,
      paymentTerm: '14 pv netto',
    },
    // 3 riviä: myyntisaamiset koko summa / veroton myynti / suoritettava ALV
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 1506 },
      { account: '3000', side: 'kredit', amount: 1200 },
      { account: '2871', side: 'kredit', amount: 306  },
    ],
    errorMessages: {
      ...err,
      account: alvMyyntiFeedback,
    },
    orientationQuestion:
      'Tammikuusta Kati on ALV-velvollinen. Miten ALV muuttaa myyntilaskun kirjausta verrattuna marraskuuhun?',
    explanation:
      'ALV-velvollinen myyntilasku vaatii kolme riviä: 1700 Myyntisaamiset debetoidaan koko summalla (1 506 €, sis. ALV). Kredit jakautuu verottomaan myyntiin (3000, 1 200 €) ja suoritettavaan ALV:hen (2871, 306 €). ALV tilitetään Verohallinnolle kuukausittain.',
  },

  // ── 2. Ostolasku ALV:lla — PixelPro (2.1.) ───────────────────────────────
  {
    template: {
      id: 'jan-002',
      type: 'ostolasku',
      monthOffset: 2,
      day: 2,
      description:
        'PixelPro Software Ltd veloittaa tammikuun kuukausimaksun automaattisesti kortilta. Veroton 80,00 €, ALV 25,5 % = 20,40 €. Yhteensä 100,40 €.',
      amount: 100.40,
      vatRate: 25.5,
      counterparty: 'PixelPro Software Ltd',
      invoiceNumber: 'AC-2613',
      paymentTerm: 'Kortin automaattiveloitus',
    },
    // 3 riviä: IT-kulu (veroton) + ALV-vähennys / pankki koko summa
    correctEntries: [
      { account: '8390', side: 'debet',  amount: 80   },
      { account: '2920', side: 'debet',  amount: 20.40 },
      { account: '1910', side: 'kredit', amount: 100.40 },
    ],
    errorMessages: {
      ...err,
      account: alvOstoFeedback,
    },
    orientationQuestion:
      'Ostolaskussa ALV on vähennyskelpoinen — se kirjataan omalle tilille. Kummalle puolelle ALV kirjataan ostajan kirjanpidossa?',
    explanation:
      'Ostajan ALV-kirjaus: kulutili (8390) debetoidaan verottomalla summalla, vähennettävä ALV (2920) debetoidaan ALV-osuudella. Kredit menee pankkitilille (1910) koko summalla. Tili 2920 on vastaavaa — ALV-velvollisuus antaa oikeuden vähentää ostojen ALV:n myyntiensä ALV:sta.',
  },

  // ── 3. Kuitti ALV:lla — Tankki24 polttoaine (4.1.) ────────────────────────
  {
    template: {
      id: 'jan-003',
      type: 'kuitti',
      monthOffset: 2,
      day: 4,
      description:
        'Tankki24: polttoainetta kortilla. Veroton 40,00 €, ALV 25,5 % = 10,20 €. Yhteensä 50,20 €.',
      amount: 50.20,
      vatRate: 25.5,
      counterparty: 'Tankki24 Oy',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 40   },
      { account: '2920', side: 'debet',  amount: 10.20 },
      { account: '1910', side: 'kredit', amount: 50.20 },
    ],
    errorMessages: { ...err, account: alvOstoFeedback },
    explanation:
      'Sama rakenne kuin ostolaskussa: 8400 veroton (kulu), 2920 ALV-osuus (vähennys), 1910 kredit koko summalla. Kuiteissa suoraan pankki kredit — ei ostovelkaa.',
  },

  // ── 4. Myyntilasku ALV:lla — Mainostoimisto Aalto (5.1.) ─────────────────
  {
    template: {
      id: 'jan-004',
      type: 'myyntilasku',
      monthOffset: 2,
      day: 5,
      description:
        'Mainostoimisto Aalto Oy tilaa somegrafiikat. Veroton 2 000 €, ALV 25,5 % = 510 €. Lasku yhteensä 2 510 €.',
      amount: 2510,
      vatRate: 25.5,
      counterparty: 'Mainostoimisto Aalto Oy',
      invoiceNumber: '2027-002',
      dueDay: 19,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 2510 },
      { account: '3000', side: 'kredit', amount: 2000 },
      { account: '2871', side: 'kredit', amount: 510  },
    ],
    errorMessages: { ...err, account: alvMyyntiFeedback },
    explanation:
      '1700 D 2 510 / 3000 K 2 000 / 2871 K 510. Tuttu ALV-myyntirakenne — harjoittele tunnistamaan kaava nopeasti.',
  },

  // ── 5. Ostolasku ALV:lla — Cloudia (8.1.) ────────────────────────────────
  {
    template: {
      id: 'jan-005',
      type: 'ostolasku',
      monthOffset: 2,
      day: 8,
      description:
        'Pilvipalvelu Cloudia Oy laskuttaa tammikuun pilvipalvelun. Veroton 240,00 €, ALV 25,5 % = 61,20 €. Yhteensä 301,20 €. Maksuehto 14 pv.',
      amount: 301.20,
      vatRate: 25.5,
      counterparty: 'Pilvipalvelu Cloudia Oy',
      invoiceNumber: 'CL-3092',
      dueDay: 22,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '8390', side: 'debet',  amount: 240   },
      { account: '2920', side: 'debet',  amount: 61.20 },
      { account: '2520', side: 'kredit', amount: 301.20 },
    ],
    errorMessages: { ...err, account: alvOstoFeedback },
    explanation:
      'Maksuehto → kredit 2520 Ostovelat (ei 1910). Kulutili 8390 veroton, 2920 ALV-vähennys. Ostovelka on koko summa (sis. ALV).',
  },

  // ── 6. Myyntilasku ALV:lla — Kustannus Vehka (10.1.) ─────────────────────
  {
    template: {
      id: 'jan-006',
      type: 'myyntilasku',
      monthOffset: 2,
      day: 10,
      description:
        'Kustannus Vehka Oy tilaa kausijulkaisun 3. osan. Veroton 1 500 €, ALV 25,5 % = 382,50 €. Lasku yhteensä 1 882,50 €.',
      amount: 1882.50,
      vatRate: 25.5,
      counterparty: 'Kustannus Vehka Oy',
      invoiceNumber: '2027-003',
      dueDay: 24,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 1882.50 },
      { account: '3000', side: 'kredit', amount: 1500    },
      { account: '2871', side: 'kredit', amount: 382.50  },
    ],
    errorMessages: { ...err, account: alvMyyntiFeedback },
    explanation:
      '1700 D 1 882,50 / 3000 K 1 500 / 2871 K 382,50. Desimaalit kuuluvat tarkkoihin ALV-summiin — tarkista laskin.',
  },

  // ── 7. Kuitti ALV:lla — Halpa-Tukku tarralappuja (9.1.) ──────────────────
  {
    template: {
      id: 'jan-007',
      type: 'kuitti',
      monthOffset: 2,
      day: 9,
      description:
        'Kati ostaa Halpa-Tukusta tarralappuja asiakastoimituksiin. Veroton 80,00 €, ALV 25,5 % = 20,40 €. Yhteensä 100,40 €.',
      amount: 100.40,
      vatRate: 25.5,
      counterparty: 'Halpa-Tukku Oy',
    },
    correctEntries: [
      { account: '4000', side: 'debet',  amount: 80   },
      { account: '2920', side: 'debet',  amount: 20.40 },
      { account: '1910', side: 'kredit', amount: 100.40 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Tarralappuja myydään asiakkaalle — muuttuva kulu. Mikä tili ja onko ALV vähennyskelpoinen?',
        attempt2: '4000 Aineet ja tarvikkeet (veroton) + 2920 ALV-vähennys (debet). Kredit = pankki koko summalla.',
        attempt3: '4000 D 80 / 2920 D 20,40 / 1910 K 100,40. Avaa selitys.',
        microContentId: 'mikrosisalto-8',
      },
    },
    explanation:
      'Tarralappuja myydään asiakkaalle → 4000 Aineet ja tarvikkeet (muuttuva kulu). ALV-vähennys sama kuin muissakin kuiteissa: 2920 debet ALV-osuus.',
  },

  // ── 8. Myyntilasku ALV:lla — Energiapalvelu Tähti (12.1.) ─────────────────
  {
    template: {
      id: 'jan-008',
      type: 'myyntilasku',
      monthOffset: 2,
      day: 12,
      description:
        'Energiapalvelu Tähti Oy tilaa animaatiopakettin päivityksen. Veroton 800 €, ALV 25,5 % = 204 €. Lasku yhteensä 1 004 €.',
      amount: 1004,
      vatRate: 25.5,
      counterparty: 'Energiapalvelu Tähti Oy',
      invoiceNumber: '2027-004',
      dueDay: 26,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 1004 },
      { account: '3000', side: 'kredit', amount: 800  },
      { account: '2871', side: 'kredit', amount: 204  },
    ],
    errorMessages: { ...err, account: alvMyyntiFeedback },
    explanation:
      '1700 D 1 004 / 3000 K 800 / 2871 K 204. Neljäs myyntilasku ALV:lla — tunnista kaava itsenäisesti.',
  },

  // ── 9. ALV-tilitys tammikuulta (31.1.) ───────────────────────────────────
  // Suoritettava ALV 2871: jan-001 306 + jan-004 510 + jan-006 382,50 + jan-008 204 = 1 402,50
  // Vähennettävä ALV 2920: jan-002 20,40 + jan-003 10,20 + jan-005 61,20 + jan-007 20,40 = 112,20
  // Tilitettävä netto 2870: 1 402,50 − 112,20 = 1 290,30
  {
    template: {
      id: 'jan-alv-tilitys',
      type: 'muistiotosite',
      monthOffset: 2,
      day: 31,
      description:
        'ALV-tilitys tammikuulta 2027. Suoritettava ALV myynneistä (2871): 1 402,50 €. Vähennettävä ALV ostoista (2920): 112,20 €. Tilitettävä nettovero (2870): 1 290,30 €. Eräpäivä 12.2.2027.',
      amount: 1290.30,
      counterparty: 'Verohallinto',
    },
    // ALV-tilitys: sulkee 2871 ja 2920, muodostaa 2870
    correctEntries: [
      { account: '2871', side: 'debet',  amount: 1402.50 },
      { account: '2920', side: 'kredit', amount: 112.20  },
      { account: '2870', side: 'kredit', amount: 1290.30 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'ALV-tilitys sulkee kaksi ALV-tiliä ja muodostaa yhdistelmätilin. Mitkä kolme tiliä liikkuvat?',
        attempt2: 'Suoritettava ALV (2871) debetoidaan (suljetaan). Vähennettävä ALV (2920) kreditoidaan (suljetaan). Erotus (2870) kredit = tilitettävä velka.',
        attempt3: '2871 D 1 402,50 / 2920 K 112,20 / 2870 K 1 290,30. Avaa selitys.',
        microContentId: 'mikrosisalto-9',
      },
    },
    orientationQuestion:
      'Kuukauden lopussa ALV-tilit suljetaan: suoritettava ALV (2871) ja vähennettävä ALV (2920) nollataan, ja erotus muodostaa veron. Millä puolella kukin tili suljetaan?',
    explanation:
      'ALV-tilitys tehdään kuukauden lopussa: 2871 debetoidaan (suoritettava ALV sulkeutuu, aiemmin kredit), 2920 kreditoidaan (vähennettävä ALV sulkeutuu, aiemmin debet). Erotus = 1 402,50 − 112,20 = 1 290,30 € tilitettäväksi — kirjataan tilille 2870 ALV-velka (kredit). Maksetaan seuraavan kuun 12. päivä.',
  },

  // ── 10. ALV-maksu Verohallinnolle (12.2.) ────────────────────────────────
  {
    template: {
      id: 'jan-alv-maksu',
      type: 'tiliotetapahtuma',
      monthOffset: 3,   // helmikuu
      day: 12,
      description:
        'Tiliote: ALV-maksu Verohallinnolle tammikuun verosta. Veloitus 1 290,30 € pankkitililtä. Tili 2870 ALV-velka sulkeutuu.',
      amount: 1290.30,
      counterparty: 'Verohallinto',
      referenceNumber: 'ALV 01/2027',
    },
    correctEntries: [
      { account: '2870', side: 'debet',  amount: 1290.30 },
      { account: '1910', side: 'kredit', amount: 1290.30 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'ALV-velka maksetaan Verohallinnolle. Mikä tili sulkeutuu ja mistä raha lähtee?',
        attempt2: '2870 ALV-velka debetoidaan (velka poistuu). 1910 Pankkitili kreditoidaan (raha lähtee).',
        attempt3: '2870 D 1 290,30 / 1910 K 1 290,30. Avaa selitys.',
        microContentId: 'mikrosisalto-9',
      },
    },
    explanation:
      'ALV-maksu sulkee tammikuun ALV-velan: 2870 debet (velka nollaantuu) / 1910 kredit (pankki pienenee). Tammikuun ALV-sykli on nyt täydellinen: myynti → tilitys → maksu.',
  },
];
