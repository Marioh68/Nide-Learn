import type { MicroContentData } from '@/components/MicroContent';

export const microContentLevel1A: MicroContentData[] = [
  {
    id: 'mikrosisalto-1',
    title: 'Kahdenkertainen kirjanpito',
    body: 'Kahdenkertaisessa kirjanpidossa jokainen liiketapahtuma kirjataan aina kahdelle tilille: toiselle debet-puolelle ja toiselle kredit-puolelle. Debet- ja kredit-summien on aina oltava yhtä suuret — tätä kutsutaan tasapainoksi. Ajattele sitä näin: raha ei koskaan katoa tai ilmesty tyhjästä — se siirtyy aina jostakin johonkin.',
  },
  {
    id: 'mikrosisalto-2',
    title: 'Debet ja kredit',
    body: 'Debet on tilin vasen puoli, kredit oikea puoli. Vastaavaa-tilejä (esim. pankkitili, myyntisaamiset) debetoidaan kun niiden saldo kasvaa. Vastattavaa-tilejä (esim. pääoma, ostovelat) kreditoidaan kun niiden saldo kasvaa. Tulos-tilejä (tuotot ja kulut) käsitellään omien sääntöjensä mukaan.',
  },
  {
    id: 'mikrosisalto-3',
    title: 'Tilikartta',
    body: 'Tilikartta on lista kaikista tilinumeroista ja -nimistä, joita yritys käyttää kirjanpidossaan. Tilit on ryhmitelty numeron mukaan: 1xxx = vastaavaa (omaisuus), 2xxx = vastattavaa (velat ja pääoma), 3xxx = tuotot, 4xxx–8xxx = kulut. Tilinumero kertoo heti, mihin ryhmään kirjaus kuuluu.',
  },
  {
    id: 'mikrosisalto-4',
    title: 'Kirjauksen summa',
    body: 'Kirjanpidossa summa kirjataan aina täsmälleen tositteen mukaisena — ei pyöristettynä. Jos tositteessa lukee 99,15 €, kirjaat 99,15 €. Pienetkin senttierot tekevät kirjanpidosta epätäsmällisen. Tositteessa oleva summa on ainoa oikea lähde.',
  },
  {
    id: 'mikrosisalto-5',
    title: 'Yksityissijoitus',
    body: 'Yksityissijoitus tarkoittaa, että yrittäjä siirtää omaa rahaansa yrityksen käyttöön. Se ei ole tuloa yritykselle — se on pääomaa. Kirjanpidossa yrityksen pankkitili (1910) kasvaa debet-puolella, ja yksityistili (2080) kasvaa kredit-puolella. Yksityistili on tili, joka seuraa yrittäjän omaa varallisuutta yrityksessä.',
  },
  {
    id: 'mikrosisalto-6',
    title: 'Myyntisaaminen',
    body: 'Myyntisaaminen syntyy, kun yritys on myynyt tuotteen tai palvelun, mutta asiakas ei ole vielä maksanut. Suoriteperiaatteen mukaan myynti kirjataan heti, kun palvelu on tehty — ei vasta maksun saapuessa. Myyntisaamiset (1700) ovat vastaavaa: ne ovat rahaa, joka on tulossa yritykseen.',
  },
  {
    id: 'mikrosisalto-7',
    title: 'Ostovelka',
    body: 'Ostovelka syntyy, kun yritys on vastaanottanut laskun, mutta ei ole vielä maksanut sitä. Ostovelat (2520) ovat vastattavaa: ne ovat rahaa, joka on vielä maksettava. Kun lasku saapuu, kirjataan kulu debet-puolelle ja ostovelka kredit-puolelle. Kun lasku maksetaan, ostovelka vähenee ja pankkitili vähenee.',
  },
];

export function getMicroContent(id: string): MicroContentData | undefined {
  return microContentLevel1A.find((m) => m.id === id);
}
