import type { DocumentExercise } from '@/types/exercises';

// Shared feedback — same pattern as november files
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

// ─── Joulukuu 2026 — 26 tositetta ────────────────────────────────────────────
// Avaustilanteen tase 1.12.2026:
//   1910 Pankkitili      6 199,10 €
//   1700 Myyntisaamiset  2 900,00 €  (2026-003 ja 2026-004 avoinna)
//   2520 Ostovelat         351,40 €  (TX-779 avoinna)
//   2080 Yksityistili    2 300,00 €  (5 000 sijoitettu − 1 500 − 1 200)
//   Tilikauden tulos     6 447,70 €

export const decemberExercises: DocumentExercise[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // MARRASKUUN AVOINTEN SULKEMINEN JOULUKUUSSA
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 1. Yksityisnosto 1.12. ───────────────────────────────────────────────
  {
    template: {
      id: 'dec-yn-001',
      type: 'yksityisnosto',
      monthOffset: 1,
      day: 1,
      description: 'Kati aloittaa joulukuun nostamalla 1 200 € yrityksen pankkitililtä henkilökohtaiseen käyttöön.',
      amount: 1200,
      counterparty: 'Kati Mäkinen (henkilökohtainen tili)',
    },
    correctEntries: [
      { account: '2080', side: 'debet',  amount: 1200 },
      { account: '1910', side: 'kredit', amount: 1200 },
    ],
    errorMessages: err,
    explanation: 'Yksityisnosto: yksityistili (2080) debetoidaan, pankkitili (1910) kreditoidaan. Joulukuun ensimmäinen nosto.',
  },

  // ── 2. Tiliote — Kustannus Vehka maksaa 2026-003 (3.12.) ─────────────────
  {
    template: {
      id: 'dec-tiliote-001',
      type: 'tiliotetapahtuma',
      monthOffset: 1,
      day: 3,
      description:
        'Tiliote: Kustannus Vehka Oy maksaa marraskuun laskun 2026-003. Hyvitys 2 100 € pankkitilille. Marraskuun myyntisaamisista sulkeutuu 2 100 €.',
      amount: 2100,
      counterparty: 'Kustannus Vehka Oy',
      referenceNumber: '2026-003',
    },
    correctEntries: [
      { account: '1910', side: 'debet',  amount: 2100 },
      { account: '1700', side: 'kredit', amount: 2100 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Tämä on marraskuussa syntyneen saamisen sulkeminen. Mitkä tilit liikkuvat?',
        attempt2: 'Myyntisuoritus sulkee myyntisaamisen: pankki kasvaa ja saaminen pienenee.',
        attempt3: '1910 Pankkitili debet + 1700 Myyntisaamiset kredit. Sama kaava kuin kaikissa myyntisuorituksissa. Avaa selitys.',
        microContentId: 'mikrosisalto-5',
      },
    },
    orientationQuestion: 'Lasku 2026-003 kirjattiin marraskuussa myyntisaamisiin. Mitä tapahtuu nyt kun asiakas maksaa?',
    explanation:
      'Marraskuun myyntisaaminen sulkeutuu: 1700 kredit (saaminen poistuu) ja 1910 debet (pankki kasvaa). Jäljellä olevat avoimet saamiset: vain 2026-004 (800 €).',
  },

  // ── 3. Myyntilasku 2026-005 — edelleenveloituksella (3.12.) ──────────────
  // Erityinen: 3 kirjausriviä — 1700 D / 3000 K + 3010 K
  {
    template: {
      id: '2026-005',
      type: 'myyntilasku',
      monthOffset: 1,
      day: 3,
      description:
        'Kati laskuttaa Kahvila Aamu Oy:tä: käyntikorttien suunnittelu 1 200 € + käyntikorttien painatus (edelleenveloitus) 500 €. Lasku yhteensä 1 700 €, maksuaika 14 pv.',
      amount: 1700,
      counterparty: 'Kahvila Aamu Oy',
      invoiceNumber: '2026-005',
      dueDay: 17,
      paymentTerm: '14 pv netto',
    },
    // Kolme kirjausriviä: yksi debet, kaksi kredit (2 myyntitiliä)
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 1700 },
      { account: '3000', side: 'kredit', amount: 1200 },
      { account: '3010', side: 'kredit', amount: 500  },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Laskussa on kaksi eri tuottoa: suunnittelupalvelu ja edelleenveloitettava painatus. Tarvitaanko kaksi eri myyntitiliä?',
        attempt2: 'Palvelumyynti → tili 3000. Edelleenveloitettava osto (painatus asiakkaalle) → tili 3010. Molemmat näkyvät tässä laskussa.',
        attempt3: '1700 D 1700 / 3000 K 1200 (suunnittelu) + 3010 K 500 (edelleenveloitus). Avaa selitys.',
        microContentId: 'mikrosisalto-5',
      },
    },
    orientationQuestion: 'Laskulla on kaksi eri rivejä: suunnittelupalvelu ja edelleenveloitettava painatus. Miten ne eroavat toisistaan kirjanpidossa?',
    explanation:
      'Edelleenveloitettava kulu: Kati ostaa käyntikortit painotalosta ASIAKKAAN PUOLESTA ja laskuttaa ne eteenpäin. Tätä ei kirjata omaksi myynniksi (3000) vaan edelleenveloitukseksi (3010). Saaminen (1700) syntyy koko laskusta kerralla.',
  },

  // ── 4. Ostolasku AC-2612 PixelPro (2.12.) ────────────────────────────────
  {
    template: {
      id: 'ac-2612',
      type: 'ostolasku',
      monthOffset: 1,
      day: 2,
      description:
        'PixelPro Software Ltd veloittaa joulukuun kuukausimaksun 99,15 € automaattisesti kortilta.',
      amount: 99.15,
      counterparty: 'PixelPro Software Ltd',
      invoiceNumber: 'AC-2612',
      paymentTerm: 'Kortin automaattiveloitus',
    },
    correctEntries: [
      { account: '8390', side: 'debet',  amount: 99.15 },
      { account: '1910', side: 'kredit', amount: 99.15 },
    ],
    errorMessages: err,
    explanation: 'Toinen PixelPro-lasku — sama kirjaus kuin marraskuussa. Toistuva IT-kulu (8390) veloittaa pankkitilin (1910) automaattisesti.',
  },

  // ── 5. Kuitti Tankki24 (2.12.) ────────────────────────────────────────────
  {
    template: {
      id: 'dec-kuitti-tankki24-001',
      type: 'kuitti',
      monthOffset: 1,
      day: 2,
      description: 'Kati tankkaa autonsa Tankki24:llä. Maksaa kortilla 48 €.',
      amount: 48,
      counterparty: 'Tankki24 Oy',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 48 },
      { account: '1910', side: 'kredit', amount: 48 },
    ],
    errorMessages: err,
    explanation: 'Polttoaine → 8400 Liiketoiminnan muut kulut. Kortilla maksettu → 1910 pankkitili kredit.',
  },

  // ── 6. Kuitti Toimisto-Express — printterimusteet (5.12.) ─────────────────
  // HUOM: printterimusteet → 4000 (käytetään asiakastuotoksissa)
  {
    template: {
      id: 'dec-kuitti-toimisto-001',
      type: 'kuitti',
      monthOffset: 1,
      day: 5,
      description:
        'Kati ostaa Toimisto-Expressistä printterimusteet 28 €. Hän käyttää tulostinta asiakastöiden vedostukseen — mustetulostin tuottaa asiakkaalle toimitettavaa materiaalia.',
      amount: 28,
      counterparty: 'Toimisto-Express Oy',
    },
    correctEntries: [
      { account: '4000', side: 'debet',  amount: 28 },
      { account: '1910', side: 'kredit', amount: 28 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Printterimusteet liittyvät tuotantoon. Ovatko ne asiakastyöhön vai toimistoon?',
        attempt2: 'Tulostin tekee asiakkaille materiaalia — musteet kuluvat sen tuotantoon. Onko se muuttuva vai kiinteä kulu?',
        attempt3: 'Printterimusteet tuotantokäyttöön → 4000 Aineet ja tarvikkeet (muuttuva kulu). Avaa selitys.',
        microContentId: 'mikrosisalto-6',
      },
    },
    orientationQuestion: 'Vertaa: marraskuun kynät (8400) vs. joulukuun printterimusteet. Miksi kirjaus on eri?',
    explanation:
      'Printterimuste käytetään asiakkaille toimitettavan materiaalin tuotantoon → muuttuva kulu 4000. Kynät ja muistilapat ovat Katin omaan toimistokäyttöön → yleiskulu 8400. Ratkaiseva kysymys: päätyykö tämä ostos asiakkaan tuotteeseen?',
  },

  // ── 7. Ostolasku Yhdistys Liike Ry (5.12.) edelleenveloituksella ──────────
  {
    template: {
      id: '2026-006',
      type: 'myyntilasku',
      monthOffset: 1,
      day: 5,
      description:
        'Yhdistys Liike Ry tilaa esitteen suunnittelun 750 € + esitteiden painatuksen 250 € (edelleenveloitus). Lasku yhteensä 1 000 €.',
      amount: 1000,
      counterparty: 'Yhdistys Liike Ry',
      invoiceNumber: '2026-006',
      dueDay: 19,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 1000 },
      { account: '3000', side: 'kredit', amount: 750  },
      { account: '3010', side: 'kredit', amount: 250  },
    ],
    errorMessages: err,
    explanation: 'Toinen edelleenveloituslasku — sama rakenne kuin 2026-005. Suunnittelu 3000, painatus edelleenveloituksena 3010.',
  },

  // ── 8. Tiliote — Energiapalvelu Tähti maksaa 2026-004 (10.12.) ───────────
  {
    template: {
      id: 'dec-tiliote-002',
      type: 'tiliotetapahtuma',
      monthOffset: 1,
      day: 10,
      description:
        'Tiliote: Energiapalvelu Tähti Oy maksaa marraskuun laskun 2026-004. Hyvitys 800 € pankkitilille. Kaikki marraskuun saamiset ovat nyt suljettu.',
      amount: 800,
      counterparty: 'Energiapalvelu Tähti Oy',
      referenceNumber: '2026-004',
    },
    correctEntries: [
      { account: '1910', side: 'debet',  amount: 800 },
      { account: '1700', side: 'kredit', amount: 800 },
    ],
    errorMessages: err,
    explanation: 'Viimeinen marraskuun myyntisaaminen sulkeutuu. 1700 Myyntisaamiset kredit, 1910 Pankkitili debet. Nyt kaikki marraskuun saamiset ovat nollassa.',
  },

  // ── 9. Kuitti Halpa-Tukku — joulupakkausmateriaalit (9.12.) ──────────────
  {
    template: {
      id: 'dec-kuitti-halpatukku-001',
      type: 'kuitti',
      monthOffset: 1,
      day: 9,
      description:
        'Kati ostaa Halpa-Tukusta joulupakkausmateriaalit 38 €. Materiaalit käytetään asiakkaille toimitettavien painotöiden pakkaukseen.',
      amount: 38,
      counterparty: 'Halpa-Tukku Oy',
    },
    correctEntries: [
      { account: '4000', side: 'debet',  amount: 38 },
      { account: '1910', side: 'kredit', amount: 38 },
    ],
    errorMessages: err,
    explanation: 'Pakkausmateriaalit menevät asiakkaalle toimitettavan tuotteen mukana → 4000 Aineet ja tarvikkeet (muuttuva kulu).',
  },

  // ── 10. Myyntilasku 2026-007 (8.12.) ─────────────────────────────────────
  {
    template: {
      id: '2026-007',
      type: 'myyntilasku',
      monthOffset: 1,
      day: 8,
      description:
        'Mainostoimisto Aalto Oy tilaa banneri-mainosgrafiikat 2 800 €, maksuaika 14 pv.',
      amount: 2800,
      counterparty: 'Mainostoimisto Aalto Oy',
      invoiceNumber: '2026-007',
      dueDay: 22,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 2800 },
      { account: '3000', side: 'kredit', amount: 2800 },
    ],
    errorMessages: err,
    explanation: 'Toinen lasku Mainostoimisto Aallolle — sama kirjaus. 1700 D / 3000 K.',
  },

  // ── 11. Tiliote — TyöterveysX maksu TX-779 (12.12.) ─────────────────────
  {
    template: {
      id: 'dec-tiliote-003',
      type: 'tiliotetapahtuma',
      monthOffset: 1,
      day: 12,
      description:
        'Tiliote: Kati maksaa marraskuun ostolaskun TX-779 TyöterveysX Oy:lle. Veloitus 351,40 € pankkitililtä.',
      amount: 351.40,
      counterparty: 'TyöterveysX Oy',
      referenceNumber: 'TX-779',
    },
    correctEntries: [
      { account: '2520', side: 'debet',  amount: 351.40 },
      { account: '1910', side: 'kredit', amount: 351.40 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Ostovelka sulkeutuu kun lasku maksetaan. Mitkä tilit liikkuvat?',
        attempt2: 'Maksupäivänä: ostovelka (2520) poistuu ja pankkitili (1910) pienenee.',
        attempt3: '2520 Ostovelat debet (velka sulkeutuu) + 1910 Pankkitili kredit (raha lähtee). Avaa selitys.',
        microContentId: 'mikrosisalto-7',
      },
    },
    orientationQuestion: 'Ostovelka kirjattiin marraskuussa. Mitä tapahtuu maksupäivänä?',
    explanation:
      'Ostovelan maksu sulkee velkakirjauksen: 2520 debet (velka poistuu) ja 1910 kredit (pankki vähenee). Huomaa: kulu (8400) kirjattiin jo marraskuussa laskun saapuessa — ei nyt uudestaan.',
  },

  // ── 12. Myyntilasku 2026-008 (10.12.) ────────────────────────────────────
  {
    template: {
      id: '2026-008',
      type: 'myyntilasku',
      monthOffset: 1,
      day: 10,
      description:
        'Suunnittelutoimisto Pohjola Oy tilaa infografiikat 1 850 €, maksuaika 14 pv.',
      amount: 1850,
      counterparty: 'Suunnittelutoimisto Pohjola Oy',
      invoiceNumber: '2026-008',
      dueDay: 24,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 1850 },
      { account: '3000', side: 'kredit', amount: 1850 },
    ],
    errorMessages: err,
    explanation: '1700 Myyntisaamiset debet / 3000 Myynti kredit. Tuttu kirjausrakenne.',
  },

  // ── 13. Kuitti Tankki24 2 (11.12.) ───────────────────────────────────────
  {
    template: {
      id: 'dec-kuitti-tankki24-002',
      type: 'kuitti',
      monthOffset: 1,
      day: 11,
      description: 'Tankki24: polttoainetta 55 €. Kortilla.',
      amount: 55,
      counterparty: 'Tankki24 Oy',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 55 },
      { account: '1910', side: 'kredit', amount: 55 },
    ],
    errorMessages: err,
    explanation: 'Polttoaine → 8400 Liiketoiminnan muut kulut / 1910 Pankkitili.',
  },

  // ── 14. Tiliote — Yksityisnosto 2 (8.12.) ────────────────────────────────
  {
    template: {
      id: 'dec-yn-002',
      type: 'yksityisnosto',
      monthOffset: 1,
      day: 8,
      description: 'Kati nostaa 1 800 € yrityksen pankkitililtä.',
      amount: 1800,
      counterparty: 'Kati Mäkinen (henkilökohtainen tili)',
    },
    correctEntries: [
      { account: '2080', side: 'debet',  amount: 1800 },
      { account: '1910', side: 'kredit', amount: 1800 },
    ],
    errorMessages: err,
    explanation: 'Yksityisnosto: 2080 debet / 1910 kredit. Joulukuun toinen nosto.',
  },

  // ── 15. Ostolasku Painotalo Vire PV-2034 (11.12.) — 4500 muuttuva ────────
  {
    template: {
      id: 'pv-2034',
      type: 'ostolasku',
      monthOffset: 1,
      day: 11,
      description:
        'Painotalo Vire Oy laskuttaa käyntikorttien painatuksesta (lasku 2026-005:n edelleenveloitus) 401,60 €. Maksuehto 14 pv.',
      amount: 401.60,
      counterparty: 'Painotalo Vire Oy',
      invoiceNumber: 'PV-2034',
      dueDay: 25,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '4500', side: 'debet',  amount: 401.60 },
      { account: '2520', side: 'kredit', amount: 401.60 },
    ],
    errorMessages: {
      ...err,
      account: {
        attempt1: 'Painotalo on alihankkija asiakkaan töissä. Mikä tiliryhmä kuvaa muuttuvaa alihankkijakustannusta?',
        attempt2: 'Painotalo ei ole Katin oma toimistokulu — se on ulkopuolinen palvelu asiakkaan tuotteeseen. Mikä tili on "ulkopuoliset palvelut"?',
        attempt3: '4500 Ulkopuoliset palvelut (muuttuvat kulut) + 2520 Ostovelat (maksuehto 14 pv). Avaa selitys.',
        microContentId: 'mikrosisalto-6',
      },
    },
    orientationQuestion: 'Tämä on edelleenveloitettavan tilauksen kustannus — Painotalo on alihankkija. Mikä tili kuvaa ulkopuolista palvelua?',
    explanation:
      'Ulkopuoliset palvelut (4500) on muuttuva kulu — alihankittu työ tai palvelu, joka menee suoraan asiakkaan tilaukseen. Ero 4000:een: 4000 = materiaali/tavara, 4500 = palvelu/työ. Painotalo tekee Katin puolesta työn → 4500.',
  },

  // ── 16. Myyntilasku 2026-009 (12.12.) ────────────────────────────────────
  {
    template: {
      id: '2026-009',
      type: 'myyntilasku',
      monthOffset: 1,
      day: 12,
      description:
        'Kustannus Vehka Oy tilaa kausijulkaisun 2. osan 1 100 €, maksuaika 14 pv.',
      amount: 1100,
      counterparty: 'Kustannus Vehka Oy',
      invoiceNumber: '2026-009',
      dueDay: 26,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 1100 },
      { account: '3000', side: 'kredit', amount: 1100 },
    ],
    errorMessages: err,
    explanation: 'Toinen lasku Kustannus Vehkalle — sama kirjausrakenne. 1700 D / 3000 K.',
  },

  // ── 17. Kuitti Toimisto-Express — toimistotarvikkeita (14.12.) ────────────
  // HUOM: tässä tarvikkeet ovat Katin omaan käyttöön → 4000 per plan
  // (tulkinta: joulu-aika, suurempi toimistohankinta jota käytetään asiakastyöhön)
  {
    template: {
      id: 'dec-kuitti-toimisto-002',
      type: 'kuitti',
      monthOffset: 1,
      day: 14,
      description:
        'Kati ostaa Toimisto-Expressistä toimistotarvikkeita 52 €: tulostinpaperia, kangasnauhaa ja nitoja. Nämä käytetään asiakkaille toimitettavien materiaalien viimeistelyyn.',
      amount: 52,
      counterparty: 'Toimisto-Express Oy',
    },
    correctEntries: [
      { account: '4000', side: 'debet',  amount: 52 },
      { account: '1910', side: 'kredit', amount: 52 },
    ],
    errorMessages: err,
    explanation: 'Tulostinpaperi, kangasnauha ja nitoja — käytetään asiakkaalle toimitettavien materiaalien viimeistelyyn → 4000 Aineet ja tarvikkeet (muuttuva kulu).',
  },

  // ── 18. Yksityisnosto 3 (15.12.) ─────────────────────────────────────────
  {
    template: {
      id: 'dec-yn-003',
      type: 'yksityisnosto',
      monthOffset: 1,
      day: 15,
      description: 'Kati nostaa 1 200 € joulun edellisellä viikolla.',
      amount: 1200,
      counterparty: 'Kati Mäkinen (henkilökohtainen tili)',
    },
    correctEntries: [
      { account: '2080', side: 'debet',  amount: 1200 },
      { account: '1910', side: 'kredit', amount: 1200 },
    ],
    errorMessages: err,
    explanation: 'Yksityisnosto: 2080 debet / 1910 kredit. Kolmas joulukuun nosto.',
  },

  // ── 19. Ostolasku Painotalo Vire PV-2035 (12.12.) — 4500 muuttuva ────────
  {
    template: {
      id: 'pv-2035',
      type: 'ostolasku',
      monthOffset: 1,
      day: 12,
      description:
        'Painotalo Vire Oy laskuttaa Yhdistys Liike Ry:n esitteiden painatuksesta (lasku 2026-006:n edelleenveloitus) 188,25 €. Maksuehto 14 pv.',
      amount: 188.25,
      counterparty: 'Painotalo Vire Oy',
      invoiceNumber: 'PV-2035',
      dueDay: 26,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '4500', side: 'debet',  amount: 188.25 },
      { account: '2520', side: 'kredit', amount: 188.25 },
    ],
    errorMessages: err,
    explanation: 'Toinen Painotalo-lasku — sama 4500 Ulkopuoliset palvelut / 2520 Ostovelat -rakenne.',
  },

  // ── 20. Ostolasku CL-3091 Pilvipalvelu Cloudia (9.12.) ───────────────────
  {
    template: {
      id: 'cl-3091',
      type: 'ostolasku',
      monthOffset: 1,
      day: 9,
      description:
        'Pilvipalvelu Cloudia Oy laskuttaa pilvipalvelun kuukausimaksun 301,20 €. Maksuehto 14 pv.',
      amount: 301.20,
      counterparty: 'Pilvipalvelu Cloudia Oy',
      invoiceNumber: 'CL-3091',
      dueDay: 23,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '8390', side: 'debet',  amount: 301.20 },
      { account: '2520', side: 'kredit', amount: 301.20 },
    ],
    errorMessages: err,
    explanation: 'Pilvipalvelu = IT-kulu (8390) + maksuehto → ostovelka (2520).',
  },

  // ── 21. Myyntilasku 2026-010 (15.12.) ────────────────────────────────────
  {
    template: {
      id: '2026-010',
      type: 'myyntilasku',
      monthOffset: 1,
      day: 15,
      description:
        'Kahvila Aamu Oy tilaa pienen julisteen joulukampanjaan 480 €, maksuaika 14 pv.',
      amount: 480,
      counterparty: 'Kahvila Aamu Oy',
      invoiceNumber: '2026-010',
      dueDay: 29,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 480 },
      { account: '3000', side: 'kredit', amount: 480 },
    ],
    errorMessages: err,
    explanation: 'Myyntilasku Kahvila Aamulle. 1700 D / 3000 K.',
  },

  // ── 22. Kuitti Pikalähetys 1 (16.12.) ────────────────────────────────────
  {
    template: {
      id: 'dec-kuitti-pikalähetys-001',
      type: 'kuitti',
      monthOffset: 1,
      day: 16,
      description: 'Kati maksaa Pikalähetys Oy:lle postitusmaksut 32 €. Kortilla.',
      amount: 32,
      counterparty: 'Pikalähetys Oy',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 32 },
      { account: '1910', side: 'kredit', amount: 32 },
    ],
    errorMessages: err,
    explanation: 'Postitusmaksut = liiketoiminnan yleiskulu (8400). Kortilla maksettu → 1910.',
  },

  // ── 23. Ostolasku SK-1124 Suunnittelukirja (16.12.) ──────────────────────
  {
    template: {
      id: 'sk-1124',
      type: 'ostolasku',
      monthOffset: 1,
      day: 16,
      description:
        'Suunnittelukirja-julkaisu Oy laskuttaa vuosikirjasta 43,93 €. Maksuehto 30 pv, eräpäivä 15.1.2027.',
      amount: 43.93,
      counterparty: 'Suunnittelukirja-julkaisu Oy',
      invoiceNumber: 'SK-1124',
      dueDay: 15,
      dueDayOffset: 2,
      paymentTerm: '30 pv netto',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 43.93 },
      { account: '2520', side: 'kredit', amount: 43.93 },
    ],
    errorMessages: err,
    explanation: 'Alan kirjallisuus on yleiskulu (8400). Pitkä maksuehto (30 pv) → ostovelka (2520). Jää avoimeksi tammikuuhun.',
  },

  // ── 24. Myyntilasku 2026-011 (18.12.) ────────────────────────────────────
  {
    template: {
      id: '2026-011',
      type: 'myyntilasku',
      monthOffset: 1,
      day: 18,
      description:
        'Energiapalvelu Tähti Oy tilaa animaation yritysesitykseen 1 500 €, maksuaika 14 pv — eräpäivä 1.1.2027.',
      amount: 1500,
      counterparty: 'Energiapalvelu Tähti Oy',
      invoiceNumber: '2026-011',
      dueDay: 1,
      dueDayOffset: 2,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 1500 },
      { account: '3000', side: 'kredit', amount: 1500 },
    ],
    errorMessages: err,
    explanation: 'Eräpäivä on tammikuun puolella — kirjaus tehdään silti lähetyspäivänä (18.12.). Myyntisaaminen jää avoimeksi vuodenvaihteen yli.',
  },

  // ── 25. Ostolasku DA-491 DesignAcademy (18.12.) ───────────────────────────
  {
    template: {
      id: 'da-491',
      type: 'ostolasku',
      monthOffset: 1,
      day: 18,
      description:
        'DesignAcademy Oy laskuttaa verkkokurssista 244,73 €. Maksuehto 14 pv — eräpäivä 1.1.2027.',
      amount: 244.73,
      counterparty: 'DesignAcademy Oy',
      invoiceNumber: 'DA-491',
      dueDay: 1,
      dueDayOffset: 2,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 244.73 },
      { account: '2520', side: 'kredit', amount: 244.73 },
    ],
    errorMessages: err,
    explanation: 'Koulutuskulu → 8400 Liiketoiminnan muut kulut. Maksuehto → ostovelka (2520). Jää avoimeksi tammikuuhun.',
  },

  // ── 26. Myyntilasku 2026-012 (22.12.) ────────────────────────────────────
  {
    template: {
      id: '2026-012',
      type: 'myyntilasku',
      monthOffset: 1,
      day: 22,
      description:
        'Uusi asiakas Konsultointi Polku Oy (Y-tunnus 5638274-9) tilaa iconisarjan 850 €. Eräpäivä 5.1.2027.',
      amount: 850,
      counterparty: 'Konsultointi Polku Oy',
      invoiceNumber: '2026-012',
      dueDay: 5,
      dueDayOffset: 2,
      paymentTerm: '14 pv netto',
    },
    correctEntries: [
      { account: '1700', side: 'debet',  amount: 850 },
      { account: '3000', side: 'kredit', amount: 850 },
    ],
    errorMessages: err,
    explanation: 'Uusi asiakas, tuttu kirjauskaava. Eräpäivä tammikuun puolella — saaminen jää avoimeksi.',
  },

  // ── 27. Yksityisnosto 4 (22.12.) ─────────────────────────────────────────
  {
    template: {
      id: 'dec-yn-004',
      type: 'yksityisnosto',
      monthOffset: 1,
      day: 22,
      description: 'Kati nostaa 1 500 € joulurahaa yrityksen pankkitililtä.',
      amount: 1500,
      counterparty: 'Kati Mäkinen (henkilökohtainen tili)',
    },
    correctEntries: [
      { account: '2080', side: 'debet',  amount: 1500 },
      { account: '1910', side: 'kredit', amount: 1500 },
    ],
    errorMessages: err,
    explanation: 'Neljäs joulukuun yksityisnosto. 2080 debet / 1910 kredit.',
  },

  // ── 28. Kuitti Pikalähetys 2 — joululaskut (21.12.) ──────────────────────
  {
    template: {
      id: 'dec-kuitti-pikalähetys-002',
      type: 'kuitti',
      monthOffset: 1,
      day: 21,
      description: 'Pikalähetys Oy: joululaskujen postitus 28 €. Kortilla.',
      amount: 28,
      counterparty: 'Pikalähetys Oy',
    },
    correctEntries: [
      { account: '8400', side: 'debet',  amount: 28 },
      { account: '1910', side: 'kredit', amount: 28 },
    ],
    errorMessages: err,
    explanation: 'Postitusmaksut → 8400 Liiketoiminnan muut kulut / 1910 Pankkitili.',
  },

  // ── 29. Kuitti NetCom (28.12.) ────────────────────────────────────────────
  {
    template: {
      id: 'dec-kuitti-netcom-001',
      type: 'kuitti',
      monthOffset: 1,
      day: 28,
      description: 'NetCom Oy: 4G-mokkulan joulukuun kk-maksu 18 €. Kortilla.',
      amount: 18,
      counterparty: 'NetCom Oy',
    },
    correctEntries: [
      { account: '8390', side: 'debet',  amount: 18 },
      { account: '1910', side: 'kredit', amount: 18 },
    ],
    errorMessages: err,
    explanation: '4G-mokkulan kk-maksu → 8390 Tietotekniikkakulut / 1910 Pankkitili.',
  },

  // ── 30 (bonus). Tiliote — Mainostoimisto Aalto maksaa 2026-007 (22.12.) ───
  {
    template: {
      id: 'dec-tiliote-004',
      type: 'tiliotetapahtuma',
      monthOffset: 1,
      day: 22,
      description:
        'Tiliote: Mainostoimisto Aalto Oy maksaa laskun 2026-007. Hyvitys 2 800 € pankkitilille.',
      amount: 2800,
      counterparty: 'Mainostoimisto Aalto Oy',
      referenceNumber: '2026-007',
    },
    correctEntries: [
      { account: '1910', side: 'debet',  amount: 2800 },
      { account: '1700', side: 'kredit', amount: 2800 },
    ],
    errorMessages: err,
    explanation: 'Myyntisuoritus: 1910 debet / 1700 kredit. Joulukuun saamisia kertyy myös avoimiksi vuodenvaihteeseen.',
  },
];
