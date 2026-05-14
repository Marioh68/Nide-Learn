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

const alvMyyntiFeedback = {
  attempt1: 'ALV:llisessa myyntilaskussa tarvitaan kolme riviä. Kuinka ALV jaetaan tilille?',
  attempt2: 'Myyntisaamiset debetoidaan koko summalla (sis. ALV). Kredit jakautuu: veroton myynti (3000) ja ALV (2871).',
  attempt3: '1700 D koko summa / 3000 K veroton / 2871 K ALV-osuus. Avaa selitys.',
  microContentId: 'mikrosisalto-8',
};

// ─── Helmikuu 2027 — ALV useammalla kannalla (Taso 2) ─────────────────────────
// monthOffset 3 = helmikuu (laskentakuukausi)
// monthOffset 4 = maaliskuu (ALV-maksu 12.3.)
//
// ALV-kannat käytössä:
//   25,5 % — yleinen (palvelumyynti)
//   13,5 % — kirjat, elintarvikkeet, ravintola (1.1.2026 alkaen)
//   10,0 % — sanomalehdet, aikakauslehdet
//
// ALV-laskenta helmikuulta:
//   Suoritettava ALV (2871): 459 + 612 = 1 071,00
//   Vähennettävä ALV (2920): 5,40 + 2,70 + 2,00 + 306,00 = 316,10
//   Tilitettävä netto (2870): 1 071,00 − 316,10 = 754,90

export const februaryExercises: DocumentExercise[] = [

  // ── 1. Myyntilasku ALV 25,5 % — Kahvila Aamu (3.2.) ─────────────────────
  {
    template: {
      id: 'feb-001',
      type: 'myyntilasku',
      monthOffset: 3,
      day: 3,
      description:
        'Kati laskuttaa Kahvila Aamu Oy:tä helmikuun some-kampanjasta. Veroton 1 800 €, ALV 25,5 % = 459 €. Laskun loppusumma 2 259 €.',
      amount: 2259,
      vatRate: 25.5,
      counterparty: 'Kahvila Aamu Oy',
      invoiceNumber: '2027-005',
      dueDay: 17,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 2259 },
      { account: '3000', side: 'kredit', amount: 1800 },
      { account: '2871', side: 'kredit', amount: 459  },
    ],
    errorMessages: { ...err, account: alvMyyntiFeedback },
    explanation:
      '1700 D 2 259 / 3000 K 1 800 / 2871 K 459. Tuttu 3 rivin myyntikaava — sama rakenne kuin tammikuussa.',
  },

  // ── 2. Kuitti kirjakauppa — ALV 13,5 % (4.2.) ────────────────────────────
  {
    template: {
      id: 'feb-002',
      type: 'kuitti',
      monthOffset: 3,
      day: 4,
      description:
        'Kati ostaa Kirjakauppa Lukuhetki Oy:stä ammattikirjallisuutta. Veroton 40,00 €, ALV 13,5 % = 5,40 €. Yhteensä 45,40 €.',
      amount: 45.40,
      vatRate: 13.5,
      counterparty: 'Kirjakauppa Lukuhetki Oy',
    },
    // 3 riviä: kulutili veroton + ALV-vähennys / pankki
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 40   },
      { account: '2920', side: 'debet',  amount: 5.40 },
      { account: '1910', side: 'kredit', amount: 45.40 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Kirjat ovat ALV-kannalla 13,5 %. Kirjausrakenne on sama kuin 25,5 % ostoissa — kolme riviä.',
        attempt2: '8400 veroton kulu (D) + 2920 ALV-vähennys (D) / 1910 pankki koko summalla (K).',
        attempt3: '8400 D 40 / 2920 D 5,40 / 1910 K 45,40. ALV-kanta ei muuta rakennetta. Avaa selitys.',
        microContentId: 'mikrosisalto-8',
      },
      amount: {
        attempt1: 'Tarkista summat. ALV 13,5 % lasketaan: veroton × 0,135.',
        attempt2: '40 × 0,135 = 5,40. Yhteensä: 40 + 5,40 = 45,40.',
        attempt3: '8400 D 40 / 2920 D 5,40 / 1910 K 45,40. Avaa selitys.',
        microContentId: 'mikrosisalto-4',
      },
    },
    orientationQuestion:
      'Kirjat kuuluvat ALV-kantaan 13,5 % (ei 25,5 %). Muuttuuko kirjausrakenne kun ALV-kanta on eri?',
    explanation:
      'ALV-kanta 13,5 % ei muuta kirjausrakennetta — aina kolme riviä: kulutili veroton (8400), ALV-vähennys (2920), pankki koko summalla (1910). Lasketaan: 40 × 0,135 = 5,40 €. Ainoastaan 2920-rivin summa muuttuu kannan mukaan.',
  },

  // ── 3. Kuitti ravintola — ALV 13,5 % (7.2.) ──────────────────────────────
  {
    template: {
      id: 'feb-003',
      type: 'kuitti',
      monthOffset: 3,
      day: 7,
      description:
        'Kati maksaa asiakaslounaasta Ravintola Siltarannassa. Veroton 20,00 €, ALV 13,5 % = 2,70 €. Yhteensä 22,70 €.',
      amount: 22.70,
      vatRate: 13.5,
      counterparty: 'Ravintola Siltaranta Oy',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 20   },
      { account: '2920', side: 'debet',  amount: 2.70 },
      { account: '1910', side: 'kredit', amount: 22.70 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Ravintolapalvelut ovat ALV-kantaa 13,5 %. Sama 3 rivin rakenne kuin muissa ostoissa.',
        attempt2: '8400 veroton (D) + 2920 ALV (D) / 1910 pankki (K). Laske: 20 × 0,135 = 2,70.',
        attempt3: '8400 D 20 / 2920 D 2,70 / 1910 K 22,70. Avaa selitys.',
        microContentId: 'mikrosisalto-8',
      },
    },
    explanation:
      'Ravintolapalvelut: ALV 13,5 %. 20 × 0,135 = 2,70. Kirjausrakenne identtinen — ainoastaan summat vaihtelevat kannan mukaan.',
  },

  // ── 4. Kuitti lehti — ALV 10 % (8.2.) ────────────────────────────────────
  {
    template: {
      id: 'feb-004',
      type: 'kuitti',
      monthOffset: 3,
      day: 8,
      description:
        'Kati tilaa alan erikoislehden irtonumeron Lehtipiste Oy:stä. Veroton 20,00 €, ALV 10 % = 2,00 €. Yhteensä 22,00 €.',
      amount: 22.00,
      vatRate: 10,
      counterparty: 'Lehtipiste Oy',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 20   },
      { account: '2920', side: 'debet',  amount: 2.00 },
      { account: '1910', side: 'kredit', amount: 22.00 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Sanoma- ja aikakauslehdet ovat ALV-kantaa 10 %. Sama 3 rivin rakenne kuin muissa ostoissa.',
        attempt2: '8400 veroton (D) + 2920 ALV (D) / 1910 pankki (K). Laske: 20 × 0,10 = 2,00.',
        attempt3: '8400 D 20 / 2920 D 2,00 / 1910 K 22,00. Avaa selitys.',
        microContentId: 'mikrosisalto-8',
      },
    },
    orientationQuestion:
      'Suomessa on useita ALV-kantoja. Mihin kantaan sanoma- ja aikakauslehdet kuuluvat?',
    explanation:
      'Aikakauslehdet: ALV 10 %. 20 × 0,10 = 2,00 €. Kolme ALV-kantaa nyt käytössä: 25,5 % (yleinen), 13,5 % (kirjat, ruoka, ravintola), 10 % (lehdet). Kirjausrakenne on aina sama — vain ALV-summa vaihtelee.',
  },

  // ── 5. Ostolasku — laptop käyttöomaisuus (12.2.) ─────────────────────────
  {
    template: {
      id: 'feb-005',
      type: 'ostolasku',
      monthOffset: 3,
      day: 12,
      description:
        'Kati ostaa TechStore Oy:ltä uuden kannettavan tietokoneen työkäyttöön. Veroton 1 200 €, ALV 25,5 % = 306 €. Yhteensä 1 506 €. Maksuehto 14 pv. Tietokone on käyttöomaisuutta (arvo > 850 €, käyttöikä ≥ 3 v.) — se aktivoidaan tilille 1200.',
      amount: 1506,
      vatRate: 25.5,
      counterparty: 'TechStore Oy',
      invoiceNumber: 'TS-4412',
      dueDay: 26,
      paymentTerm: '14 pv netto',
    },
    // Aktivointi tilille 1200 (ei 8390 tai 8400)
    correctEntries: [
      { account: '1200', side: 'debet',  amount: 1200 },
      { account: '2920', side: 'debet',  amount: 306  },
      { account: '2520', side: 'kredit', amount: 1506 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Tietokone on arvokas (yli 850 €) ja pitkäikäinen. Kirjataanko se kuluksi vai tase-eräksi?',
        attempt2: 'Käyttöomaisuus (arvo > 850 €, käyttöikä ≥ 3 v.) aktivoidaan taseeseen: 1200 Koneet ja kalusto. Maksuehto → 2520 Ostovelat.',
        attempt3: '1200 D 1 200 / 2920 D 306 / 2520 K 1 506. Avaa selitys.',
        microContentId: 'mikrosisalto-3',
      },
    },
    orientationQuestion:
      'Kannettava tietokone maksaa 1 200 € (veroton) ja kestää useita vuosia. Kirjataanko se kuluksi heti vai aktivoidaanko taseeseen?',
    explanation:
      'Käyttöomaisuusraja: hankintameno > 850 € (veroton) JA taloudellinen käyttöikä ≥ 3 vuotta → aktivoidaan taseeseen, tili 1200 Koneet ja kalusto. ALV-vähennys samoin kuin muissa ostoissa (2920). Kredit menee ostovelaksi (2520), koska maksuehto 14 pv.',
  },

  // ── 6. Muistiotosite — tasapoisto helmikuulta (28.2.) ─────────────────────
  {
    template: {
      id: 'feb-006',
      type: 'muistiotosite',
      monthOffset: 3,
      day: 28,
      description:
        'Tasapoisto helmikuulta: laptop (1200 Koneet ja kalusto, hankintameno 1 200 €, käyttöikä 60 kk). Kuukausierä = 1 200 / 60 = 20,00 €.',
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
        attempt1: 'Poisto pienentää käyttöomaisuuden arvoa. Mikä tili kirjataan kuluksi ja mikä vähenee taseessa?',
        attempt2: '7680 Poistot koneista ja kalustosta debetoidaan (kulu). 1200 Koneet ja kalusto kreditoidaan (arvo pienenee).',
        attempt3: '7680 D 20 / 1200 K 20. Avaa selitys.',
        microContentId: 'mikrosisalto-3',
      },
      amount: {
        attempt1: 'Laske kuukausierä: hankintameno jaettuna käyttöiällä kuukausina.',
        attempt2: '1 200 € / 60 kk = 20,00 €/kk.',
        attempt3: '7680 D 20 / 1200 K 20. Avaa selitys.',
        microContentId: 'mikrosisalto-4',
      },
    },
    orientationQuestion:
      'Käyttöomaisuus kuluu ajan myötä. Miten tämä kirjataan kirjanpidossa kuukausittain?',
    explanation:
      'Tasapoisto: hankintameno jaetaan tasan käyttöiän kuukausille. 1 200 € / 60 kk = 20 €/kk. Poistotili 7680 debetoidaan (kuluksi), käyttöomaisuustili 1200 kreditoidaan (arvo vähenee taseessa). Tämä kirjaus tehdään joka kuukausi 5 vuoden ajan.',
  },

  // ── 7. Myyntilasku ALV 25,5 % — Energiapalvelu Tähti (14.2.) ─────────────
  {
    template: {
      id: 'feb-007',
      type: 'myyntilasku',
      monthOffset: 3,
      day: 14,
      description:
        'Energiapalvelu Tähti Oy tilaa helmikuun visuaalisen ilmeen päivityksen. Veroton 2 400 €, ALV 25,5 % = 612 €. Lasku yhteensä 3 012 €.',
      amount: 3012,
      vatRate: 25.5,
      counterparty: 'Energiapalvelu Tähti Oy',
      invoiceNumber: '2027-006',
      dueDay: 28,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 3012 },
      { account: '3000', side: 'kredit', amount: 2400 },
      { account: '2871', side: 'kredit', amount: 612  },
    ],
    errorMessages: { ...err, account: alvMyyntiFeedback },
    explanation:
      '1700 D 3 012 / 3000 K 2 400 / 2871 K 612. Neljä myyntilaskua helmikuussa — kaava on jo tuttu.',
  },

  // ── 8. ALV-tilitys helmikuulta (28.2.) ───────────────────────────────────
  // Suoritettava 2871: 459 + 612 = 1 071,00
  // Vähennettävä 2920: 5,40 + 2,70 + 2,00 + 306,00 = 316,10
  // Netto 2870: 1 071,00 − 316,10 = 754,90
  {
    template: {
      id: 'feb-alv-tilitys',
      type: 'muistiotosite',
      monthOffset: 3,
      day: 28,
      description:
        'ALV-tilitys helmikuulta 2027. Suoritettava ALV (2871): 1 071,00 €. Vähennettävä ALV (2920): 316,10 €. Tilitettävä nettovero (2870): 754,90 €. Eräpäivä 12.3.2027.',
      amount: 754.90,
      counterparty: 'Verohallinto',
    },
    correctEntries: [
      { account: '2871', side: 'debet',  amount: 1071    },
      { account: '2920', side: 'kredit', amount: 316.10  },
      { account: '2870', side: 'kredit', amount: 754.90  },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Sama ALV-tilitysrakenne kuin tammikuussa. Mitkä kolme tiliä liikkuvat?',
        attempt2: '2871 D (suoritettava sulkeutuu) / 2920 K (vähennettävä sulkeutuu) / 2870 K (nettovero).',
        attempt3: '2871 D 1 071 / 2920 K 316,10 / 2870 K 754,90. Avaa selitys.',
        microContentId: 'mikrosisalto-9',
      },
    },
    explanation:
      'ALV-tilitys: 2871 D (1 071) / 2920 K (316,10) / 2870 K (754,90). Netto: 1 071 − 316,10 = 754,90 €. Helmikuun vähennys on suurempi kuin tammikuussa, koska laptop (306 €) kuuluu vähennyksiin.',
  },

  // ── 9. ALV-maksu Verohallinnolle (12.3.) ─────────────────────────────────
  {
    template: {
      id: 'feb-alv-maksu',
      type: 'tiliotetapahtuma',
      monthOffset: 4,  // maaliskuu
      day: 12,
      description:
        'Tiliote: ALV-maksu Verohallinnolle helmikuun verosta. Veloitus 754,90 € pankkitililtä. Tili 2870 ALV-velka sulkeutuu.',
      amount: 754.90,
      counterparty: 'Verohallinto',
      referenceNumber: 'ALV 02/2027',
    },
    correctEntries: [
      { account: '2870', side: 'debet',  amount: 754.90 },
      { account: '1910', side: 'kredit', amount: 754.90 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Sama rakenne kuin tammikuun ALV-maksu. Mikä velka sulkeutuu?',
        attempt2: '2870 ALV-velka debetoidaan (velka poistuu). 1910 kredit (raha lähtee).',
        attempt3: '2870 D 754,90 / 1910 K 754,90. Avaa selitys.',
        microContentId: 'mikrosisalto-9',
      },
    },
    explanation:
      '2870 D 754,90 / 1910 K 754,90. Helmikuun ALV-sykli päättyy: myynti → tilitys → maksu. Kolme ALV-kantaa (25,5 %, 13,5 %, 10 %) kulkevat kaikki saman 2920/2871-rakenteen kautta.',
  },
];
