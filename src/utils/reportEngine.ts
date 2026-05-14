import type { DocumentExercise, KirjanpitoTili, AccountCategory } from '@/types/exercises';

// ─── Output types ─────────────────────────────────────────────────────────────

export interface AccountBalance {
  numero: string;
  nimi: string;
  kategoria: AccountCategory;
  debet: number;
  kredit: number;
  balance: number; // debet − kredit (positive = debet side)
}

export interface ReportRow {
  numero: string;
  nimi: string;
  amount: number;
}

export interface FinancialReport {
  trialBalance: AccountBalance[];
  // Tuloslaskelma
  tuotot: ReportRow[];
  kulut: ReportRow[];
  nettoTulos: number;       // tuotot sum − kulut sum (positive = voitto)
  // Tase
  vastaavaa: ReportRow[];   // debet-puoli (vastaavaa = assets)
  vastattavaa: ReportRow[]; // kredit-puoli (vastattavaa + oma pääoma)
  vastaavaaTotal: number;
  vastattavaaTotal: number; // vastattavaa balances alone
  // invariant: vastaavaaTotal === vastattavaaTotal + nettoTulos
  taseBalanced: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ─── Core computation ─────────────────────────────────────────────────────────

export function computeTrialBalance(
  exercises: DocumentExercise[],
  accounts: KirjanpitoTili[],
  maxMonthOffset = 99,
): AccountBalance[] {
  const acc: Record<string, { debet: number; kredit: number }> = {};

  for (const ex of exercises) {
    if (ex.template.monthOffset > maxMonthOffset) continue;
    for (const entry of ex.correctEntries) {
      if (!acc[entry.account]) acc[entry.account] = { debet: 0, kredit: 0 };
      if (entry.side === 'debet') {
        acc[entry.account].debet = round2(acc[entry.account].debet + entry.amount);
      } else {
        acc[entry.account].kredit = round2(acc[entry.account].kredit + entry.amount);
      }
    }
  }

  return accounts
    .filter((t) => acc[t.numero])
    .map((t) => {
      const { debet, kredit } = acc[t.numero];
      return {
        numero: t.numero,
        nimi: t.nimi,
        kategoria: t.kategoria,
        debet,
        kredit,
        balance: round2(debet - kredit),
      };
    })
    .sort((a, b) => a.numero.localeCompare(b.numero));
}

export function computeReports(
  exercises: DocumentExercise[],
  accounts: KirjanpitoTili[],
  maxMonthOffset = 99,
): FinancialReport {
  const tb = computeTrialBalance(exercises, accounts, maxMonthOffset);

  const tuotot: ReportRow[] = [];
  const kulut: ReportRow[] = [];
  const vastaavaa: ReportRow[] = [];
  const vastattavaa: ReportRow[] = [];

  for (const row of tb) {
    const amount = Math.abs(row.balance);
    if (amount === 0) continue;

    switch (row.kategoria) {
      case 'tuotot':
        // tuotot tilit: kredit puoli = liikevaihto (balance negative for credit-normal accounts)
        tuotot.push({ numero: row.numero, nimi: row.nimi, amount: round2(row.kredit - row.debet) });
        break;
      case 'kulut':
        // kulut tilit: debet puoli = kulut
        kulut.push({ numero: row.numero, nimi: row.nimi, amount: round2(row.debet - row.kredit) });
        break;
      case 'vastaavaa':
        vastaavaa.push({ numero: row.numero, nimi: row.nimi, amount: round2(row.debet - row.kredit) });
        break;
      case 'vastattavaa':
        vastattavaa.push({ numero: row.numero, nimi: row.nimi, amount: round2(row.kredit - row.debet) });
        break;
    }
  }

  const tuototSum = round2(tuotot.reduce((s, r) => s + r.amount, 0));
  const kulutSum  = round2(kulut.reduce((s, r) => s + r.amount, 0));
  const nettoTulos = round2(tuototSum - kulutSum);

  const vastaavaaTotal   = round2(vastaavaa.reduce((s, r) => s + r.amount, 0));
  const vastattavaaTotal = round2(vastattavaa.reduce((s, r) => s + r.amount, 0));

  // Balance identity: vastaavaaTotal = vastattavaaTotal + nettoTulos
  const diff = round2(Math.abs(vastaavaaTotal - (vastattavaaTotal + nettoTulos)));
  const taseBalanced = diff < 0.02; // allow 1-cent rounding tolerance

  return {
    trialBalance: tb,
    tuotot,
    kulut,
    nettoTulos,
    vastaavaa,
    vastattavaa,
    vastaavaaTotal,
    vastattavaaTotal,
    taseBalanced,
  };
}
