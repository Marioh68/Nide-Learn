import type { DocumentExercise } from '@/types/exercises';

// Shared feedback (same as january.ts)
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
  attempt3: 'ALV-kirjauksessa: kulutili + 2920 debetoidaan verottomalla ja ALV-osuudella, kredit koko summalla.',
  microContentId: 'mikrosisalto-4',
};
const err = { balance: balanceFeedback, side: sideFeedback, account: accountFeedback, amount: amountFeedback };

const alvMyyntiFeedback = {
  attempt1: 'ALV:llisessa myyntilaskussa tarvitaan kolme riviä. Kuinka ALV jaetaan tilille?',
  attempt2: 'Myyntisaamiset debetoidaan koko summalla (sis. ALV). Kredit jakautuu: veroton myynti (3000) ja ALV (2871).',
  attempt3: '1700 D koko summa / 3000 K veroton / 2871 K ALV-osuus. Avaa selitys.',
  microContentId: 'mikrosisalto-8',
};
// ─── Helmikuu 2027 — Taso 2: ALV useammalla kannalla + käyttöomaisuus ──────────
// monthOffset 3 = Helmikuu
//
// ALV-kannat:
//   25,5 %  yleinen kanta   (feb-001, feb-005, feb-007)
//   13,5 %  alennettu I     (feb-002 kirja, feb-003 ravintola)
//   10,0 %  alennettu II    (feb-004 aikakauslehti)
//
// Käyttöomaisuus (feb-005 + feb-006):
//   Laptop 1 200 € netto → 1200 D (aktivointi), 7680 D 20 (kuukausipoisto)
//
// Helmikuun ALV-laskenta (harjoitukset 1, 5, 7 = myynti; 2, 3, 4, 5 = osto):
//   Suoritettava ALV (2871): 459 (feb-001) + 612 (feb-007) = 1 071,00 €
//   Vähennettävä ALV (2920): 5,40 + 2,70 + 2,00 + 306,00 = 316,10 €
//   Tilitettävä netto (2870): 1 071,00 − 316,10 = 754,90 €

export const februaryExercises: DocumentExercise[] = [

  // ── 1. Myyntilasku 25,5 % — Niko Oy (3.2.) ──────────────────────────────
  {
    template: {
      id: 'feb-001',
      type: 'myyntilasku',
      monthOffset: 3,
      day: 3,
      description:
        'Kati laskuttaa Niko Oy:tä brändi-ilmeen suunnittelusta. Veroton hinta 1 800 €, ALV 25,5 % = 459 €. Laskun loppusumma 2 259 €.',
      amount: 2259,
      vatRate: 25.5,
      counterparty: 'Niko Oy',
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
    orientationQuestion:
      'Helmikuun myyntilasku — sama 25,5 % kanta kuin tammikuussa. Onko kaava jo hallussa?',
    explanation:
      '1700 D 2 259 / 3000 K 1 800 / 2871 K 459. ALV-myyntilasku 25,5 % — tuttu kolmen rivin kaava.',
  },

  // ── 2. Kuitti kirja 13,5 % — Akateeminen Kirjakauppa (5.2.) ─────────────
  {
    template: {
      id: 'feb-002',
      type: 'kuitti',
      monthOffset: 3,
      day: 5,
      description:
        'Kirjakaupasta ammattikirjallisuutta: "Typografia ja ulkoasu 2027". Veroton 40 €, ALV 13,5 % (kirjat) = 5,40 €. Yhteensä 45,40 €.',
      amount: 45.40,
      vatRate: 13.5,
      counterparty: 'Akateeminen Kirjakauppa',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 40   },
      { account: '2920', side: 'debet',  amount: 5.40 },
      { account: '1910', side: 'kredit', amount: 45.40 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Ammattikirja on liiketoiminnan kulu. Mikä ALV-kanta kirjoille on?',
        attempt2: 'Kirjoihin sovelletaan 13,5 %:n alennettua ALV-kantaa. Kirjausrakenne on sama kuin 25,5 %:ssa.',
        attempt3: '8400 D 40 / 2920 D 5,40 / 1910 K 45,40. ALV-kanta muuttuu, mutta kirjaustapa ei. Avaa selitys.',
        microContentId: 'mikrosisalto-8',
      },
    },
    orientationQuestion:
      'Tämä kuitti on kirjaston oston kuitti. Kirjoille on alennettu ALV-kanta. Löydätkö oikean laskukaavan?',
    explanation:
      'Kirjoihin sovelletaan 13,5 % ALV:ia (alennettu I kanta). Kirjausrakenne on identtinen 25,5 %:n kanssa: 8400 D veroton / 2920 D ALV-osuus / 1910 K brutto. Vain prosentti muuttuu: 45,40 / 1,135 = 40,00 €.',
  },

  // ── 3. Kuitti ravintola 13,5 % — Ravintola Tivoli (7.2.) ─────────────────
  {
    template: {
      id: 'feb-003',
      type: 'kuitti',
      monthOffset: 3,
      day: 7,
      description:
        'Toimialajärjestön verkostoitumistilaisuuden lounas. Veroton 20 €, ALV 13,5 % (ravintola) = 2,70 €. Yhteensä 22,70 €.',
      amount: 22.70,
      vatRate: 13.5,
      counterparty: 'Ravintola Tivoli',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 20   },
      { account: '2920', side: 'debet',  amount: 2.70 },
      { account: '1910', side: 'kredit', amount: 22.70 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Ravintolalaskulle on alennettu ALV-kanta. Tuttu kirjauskaava, eri prosentti.',
        attempt2: 'Ravintolapalveluihin sovelletaan 13,5 %:n alennettua ALV-kantaa. Kirjaus: 8400 D veroton + 2920 D ALV / 1910 K brutto.',
        attempt3: '8400 D 20 / 2920 D 2,70 / 1910 K 22,70. Avaa selitys.',
        microContentId: 'mikrosisalto-8',
      },
    },
    explanation:
      'Ravintolapalvelut: 13,5 % ALV. 8400 D 20 / 2920 D 2,70 / 1910 K 22,70. Sama rakenne, sama logiikka — vain prosentti on 13,5 % eikä 25,5 %.',
  },

  // ── 4. Kuitti aikakauslehti 10 % — Suomen Graafiset ry (8.2.) ────────────
  {
    template: {
      id: 'feb-004',
      type: 'kuitti',
      monthOffset: 3,
      day: 8,
      description:
        'Graafinen Suunnittelija -lehden vuosikerta. Veroton 20 €, ALV 10 % (aikakauslehti) = 2 €. Yhteensä 22 €.',
      amount: 22,
      vatRate: 10,
      counterparty: 'Suomen Graafiset ry',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 20 },
      { account: '2920', side: 'debet',  amount: 2  },
      { account: '1910', side: 'kredit', amount: 22 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Ammattilehti — kolmas ALV-kanta. Kirjausrakenne tuttu. Laske 10 %:n ALV.',
        attempt2: 'Sanoma- ja aikakauslehdillä on 10 % ALV. 8400 D veroton + 2920 D ALV / 1910 K brutto.',
        attempt3: '8400 D 20 / 2920 D 2 / 1910 K 22. Avaa selitys.',
        microContentId: 'mikrosisalto-8',
      },
    },
    orientationQuestion:
      'Kolmas ALV-kanta: 10 % sanoma- ja aikakauslehdille. Laske ALV-osuus itse ennen kirjausta.',
    explanation:
      'Aikakauslehdet: 10 % ALV. 22 / 1,10 = 20 € veroton, ALV = 2 €. 8400 D 20 / 2920 D 2 / 1910 K 22. Kolme eri ALV-kantaa, yksi kirjausrakenne.',
  },

  // ── 5. Ostolasku laptop — käyttöomaisuus 25,5 % (10.2.) ──────────────────
  //   Netto 1 200 € → käyttöaika ≥ 3 v JA arvo > 850 € → aktivoidaan 1200
  {
    template: {
      id: 'feb-005',
      type: 'ostolasku',
      monthOffset: 3,
      day: 10,
      description:
        'Uusi MacBook Pro työvälineeksi. Veroton 1 200 €, ALV 25,5 % = 306 €. Yhteensä 1 506 €. Käyttöaika 5 vuotta — aktivoidaan käyttöomaisuuteen. Maksuehto 30 pv.',
      amount: 1506,
      vatRate: 25.5,
      counterparty: 'TechStore Oy',
      invoiceNumber: 'VK-88143',
      dueDay: 28,
      paymentTerm: '30 pv netto',
    },
    correctEntries: [
      { account: '1200', side: 'debet',  amount: 1200 },
      { account: '2920', side: 'debet',  amount: 306  },
      { account: '2520', side: 'kredit', amount: 1506 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Laptop on arvokas ja käyttöaikaa on useita vuosia. Menisikö se kuluksi vai taseeseen?',
        attempt2: 'Käyttöaika ≥ 3 v JA hankintahinta > 850 € (netto) → aktivointi tilille 1200 Koneet ja kalusto, ei kulutilille. ALV-vähennys 2920 normaali.',
        attempt3: '1200 D 1 200 / 2920 D 306 / 2520 K 1 506. Tase-tilille, ei 8xxx-tilille. Avaa selitys.',
        microContentId: 'mikrosisalto-3',
      },
    },
    orientationQuestion:
      'Laptopilla on 5 vuoden käyttöaika ja hinta on 1 200 € (netto). Kirjataanko se kuluksi (8xxx) vai käyttöomaisuudeksi (1200)?',
    explanation:
      'Aktivointiraja: käyttöaika ≥ 3 v JA nettoarvo > 850 € → käyttöomaisuus tilille 1200 Koneet ja kalusto. Laptop kirjataan 1200 D 1 200 (tase, vastaavaa), 2920 D 306 (ALV-vähennys), 2520 K 1 506 (ostovelka). Käyttöomaisuus poistetaan kuukausittain tilille 7680.',
  },

  // ── 6. Muistiotosite — kuukausipoisto (28.2.) ─────────────────────────────
  //   Laptop 1 200 € netto, tasapoisto 5 v = 60 kk → 20 €/kk
  {
    template: {
      id: 'feb-006',
      type: 'muistiotosite',
      monthOffset: 3,
      day: 28,
      description:
        'Helmikuun kuukausipoisto: MacBook Pro (1200 Koneet ja kalusto). Hankintahinta 1 200 €, tasapoisto 5 vuotta = 20 €/kk. Omaisuuden arvo taseessa vähenee, kulu kirjataan tuloslaskelmaan.',
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
        attempt1: 'Poisto on kuukausikohtainen kulu joka pienentää käyttöomaisuuden arvoa taseessa. Mitkä tilit liikkuvat?',
        attempt2: '7680 Poistot koneista ja kalustosta (kulu, debet). 1200 Koneet ja kalusto (vastaavaa, kredit) — arvo pienenee.',
        attempt3: '7680 D 20 / 1200 K 20. Tasapoisto 1 200 € / 60 kk = 20 €/kk. Avaa selitys.',
        microContentId: 'mikrosisalto-3',
      },
    },
    orientationQuestion:
      'Poisto siirtää osan käyttöomaisuuden hankintahinnasta kuukauden kuluksi. Kummalle puolelle kukin tili menee?',
    explanation:
      'Tasapoisto: 1 200 € / 60 kk = 20 €/kk. 7680 Poistot debetoidaan (kulu kasvaa), 1200 Koneet ja kalusto kreditoidaan (arvo pienenee). Poisto EI liikuta rahaa — se on kirjanpidollinen kulu. Kauden lopussa 1200:lla on arvo 1 200 − 20 = 1 180 €.',
  },

  // ── 7. Myyntilasku 25,5 % — Kestilä & Kumpp. (14.2.) ─────────────────────
  {
    template: {
      id: 'feb-007',
      type: 'myyntilasku',
      monthOffset: 3,
      day: 14,
      description:
        'Kestilä & Kumpp. Ky tilaa vuosikertomuksen taiton. Veroton hinta 2 400 €, ALV 25,5 % = 612 €. Laskun loppusumma 3 012 €.',
      amount: 3012,
      vatRate: 25.5,
      counterparty: 'Kestilä & Kumpp. Ky',
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
      '1700 D 3 012 / 3000 K 2 400 / 2871 K 612. Helmikuun toinen myyntilasku — tunnista kaava nopeasti.',
  },

  // ── 8. ALV-tilitys helmikuulta (28.2.) ────────────────────────────────────
  // Suoritettava ALV 2871: feb-001 459 + feb-007 612 = 1 071,00
  // Vähennettävä ALV 2920: feb-002 5,40 + feb-003 2,70 + feb-004 2,00 + feb-005 306,00 = 316,10
  // Tilitettävä netto 2870: 1 071,00 − 316,10 = 754,90
  {
    template: {
      id: 'feb-alv-tilitys',
      type: 'muistiotosite',
      monthOffset: 3,
      day: 28,
      description:
        'ALV-tilitys helmikuulta 2027. Suoritettava ALV myynneistä (2871): 1 071,00 €. Vähennettävä ALV ostoista (2920): 316,10 €. Tilitettävä nettovero (2870): 754,90 €. Eräpäivä 12.3.2027.',
      amount: 754.90,
      counterparty: 'Verohallinto',
    },
    correctEntries: [
      { account: '2871', side: 'debet',  amount: 1071   },
      { account: '2920', side: 'kredit', amount: 316.10 },
      { account: '2870', side: 'kredit', amount: 754.90 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Sama tilitysrakenne kuin tammikuussa. Mitkä kolme tiliä liikkuvat?',
        attempt2: '2871 D (myynti-ALV sulkeutuu) / 2920 K (osto-ALV sulkeutuu) / 2870 K (nettovero velaksi). Tammikuun kaavalla.',
        attempt3: '2871 D 1 071 / 2920 K 316,10 / 2870 K 754,90. Avaa selitys.',
        microContentId: 'mikrosisalto-9',
      },
    },
    orientationQuestion:
      'Helmikuun ALV-tilitys — kolmella eri ALV-kannalla laskutetut tapahtumat summautuvat samoille tileille (2871 ja 2920). Laske yhteissummat ennen kirjausta.',
    explanation:
      'Myynti-ALV 2871: 459 + 612 = 1 071 €. Osto-ALV 2920: 5,40 + 2,70 + 2,00 + 306,00 = 316,10 €. Netto 2870: 1 071 − 316,10 = 754,90 €. Kolme eri ALV-kantaa tilityksessä — sama kirjausrakenne kuin tammikuussa.',
  },

  // ── 9. ALV-maksu Verohallinnolle (12.3.) ─────────────────────────────────
  {
    template: {
      id: 'feb-alv-maksu',
      type: 'tiliotetapahtuma',
      monthOffset: 4,   // maaliskuu
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
        attempt1: 'ALV-velka maksetaan. Mikä tili sulkeutuu ja mistä raha lähtee?',
        attempt2: '2870 ALV-velka debetoidaan (velka nollaantuu). 1910 Pankkitili kreditoidaan (raha lähtee).',
        attempt3: '2870 D 754,90 / 1910 K 754,90. Avaa selitys.',
        microContentId: 'mikrosisalto-9',
      },
    },
    explanation:
      '2870 D 754,90 / 1910 K 754,90. Helmikuun ALV-sykli on nyt täydellinen: myynti → tilitys → maksu. Sykli toistuu joka kuukausi.',
  },
];
