import type { KirjanpitoTili } from '@/types/exercises';

// Asiakas Tmi (Kati Mäkinen) — Liikekirjuri-pohjainen tilikartta
// Tilit käyttöön kuukausioffsetin mukaan: 0 = kk1 (marraskuu)
export const asiakastmiTilikartta: KirjanpitoTili[] = [
  // ── Vastaavaa ──────────────────────────────────────────────────────────────
  { numero: '1200', nimi: 'Koneet ja kalusto',          kategoria: 'vastaavaa',  kayttoonotto: 3 },
  { numero: '1700', nimi: 'Myyntisaamiset',              kategoria: 'vastaavaa',  kayttoonotto: 0 },
  { numero: '1910', nimi: 'Pankkitili',                  kategoria: 'vastaavaa',  kayttoonotto: 0 },
  { numero: '2920', nimi: 'Vähennettävä ALV ostoista',   kategoria: 'vastaavaa',  kayttoonotto: 2 },

  // ── Vastattavaa ────────────────────────────────────────────────────────────
  { numero: '2010', nimi: 'Oma pääoma',                  kategoria: 'vastattavaa', kayttoonotto: 0 },
  { numero: '2080', nimi: 'Yksityistili',                kategoria: 'vastattavaa', kayttoonotto: 0 },
  { numero: '2520', nimi: 'Ostovelat',                   kategoria: 'vastattavaa', kayttoonotto: 0 },
  { numero: '2870', nimi: 'ALV-velka',                   kategoria: 'vastattavaa', kayttoonotto: 2 },
  { numero: '2871', nimi: 'Suoritettava ALV myynneistä', kategoria: 'vastattavaa', kayttoonotto: 2 },

  // ── Tuotot ─────────────────────────────────────────────────────────────────
  { numero: '3000', nimi: 'Myynti, palvelumyynti',           kategoria: 'tuotot', kayttoonotto: 0 },
  { numero: '3010', nimi: 'Myynti, edelleenveloitettava',    kategoria: 'tuotot', kayttoonotto: 1 },

  // ── Kulut ──────────────────────────────────────────────────────────────────
  { numero: '4000', nimi: 'Aineet ja tarvikkeet',            kategoria: 'kulut', kayttoonotto: 0 },
  { numero: '4500', nimi: 'Ulkopuoliset palvelut',           kategoria: 'kulut', kayttoonotto: 1 },
  { numero: '8390', nimi: 'Tietotekniikkakulut',             kategoria: 'kulut', kayttoonotto: 0 },
  { numero: '7680', nimi: 'Poistot koneista ja kalustosta',  kategoria: 'kulut', kayttoonotto: 3 },
  { numero: '8400', nimi: 'Liiketoiminnan muut kulut',       kategoria: 'kulut', kayttoonotto: 0 },
];

export function getTiliByNro(numero: string): KirjanpitoTili | undefined {
  return asiakastmiTilikartta.find((t) => t.numero === numero);
}

// Returns accounts available at a given month offset
export function getAvailableAccounts(monthOffset: number): KirjanpitoTili[] {
  return asiakastmiTilikartta.filter((t) => t.kayttoonotto <= monthOffset);
}
