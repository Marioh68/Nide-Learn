// reportEngine.ts — computes trial balance, tuloslaskelma and tase
// from exercise correctEntries. Pure functions, no side effects.

import type { DocumentExercise, AccountCategory } from '@/types/exercises';
import type { KirjanpitoTili } from '@/types/exercises';

// ─── Output types ─────────────────────────────────────────────────────────────

export interface AccountBalance {
  accountNumber: string;
  accountName: string;
  category: AccountCategory;
  debetTotal: number;
  kreditTotal: number;
  /** debet − kredit. Positive = net debet, negative = net kredit. */
  netBalance: number;
}

export interface ReportRow {
  accountNumber: string;
  accountName: string;
  amount: number; // always ≥ 0 for display; direction implied by category
}

export interface FinancialReport {
  trialBalance: AccountBalance[];
  tuloslaskelma: {
    tuottoRows: ReportRow[];
    kulutRows: ReportRow[];
    tuototTotal: number;
    kulutTotal: number;
    nettoTulos: number; // positive = voitto, negative = tappio
  };
  tase: {
    vastaavaaRows: ReportRow[];
    vastattavaaRows: ReportRow[];
    vastaavaaTotal: number;
    vastattavaaTotal: number; // vastattavaa balances + nettoTulos
    nettoTulos: number;
    balanced: boolean;
  };
}

// ─── Core computation ─────────────────────────────────────────────────────────

/**
 * Computes account balances from all exercise correctEntries
 * up to and including maxMonthOffset.
 */
export function computeTrialBalance(
  exercises: DocumentExercise[],
  accounts: KirjanpitoTili[],
  maxMonthOffset = 99,
): AccountBalance[] {
  const balMap = new Map<string, { debet: number; kredit: number }>();

  for (const ex of exercises) {
    if (ex.template.monthOffset > maxMonthOffset) continue;
    for (const entry of ex.correctEntries) {
      const cur = balMap.get(entry.account) ?? { debet: 0, kredit: 0 };
      if (entry.side === 'debet') cur.debet += entry.amount;
      else cur.kredit += entry.amount;
      balMap.set(entry.account, cur);
    }
  }

  const result: AccountBalance[] = [];
  for (const acc of accounts) {
    const bal = balMap.get(acc.numero);
    if (!bal) continue;
    result.push({
      accountNumber: acc.numero,
      accountName: acc.nimi,
      category: acc.kategoria,
      debetTotal: round2(bal.debet),
      kreditTotal: round2(bal.kredit),
      netBalance: round2(bal.debet - bal.kredit),
    });
  }
  return result.sort((a, b) => a.accountNumber.localeCompare(b.accountNumber));
}

/**
 * Derives tuloslaskelma and tase from the trial balance.
 *
 * Balance sheet identity (double-entry invariant):
 *   vastaavaaTotal = vastattavaaBalances + nettoTulos
 */
export function computeReports(
  exercises: DocumentExercise[],
  accounts: KirjanpitoTili[],
  maxMonthOffset = 99,
): FinancialReport {
  const tb = computeTrialBalance(exercises, accounts, maxMonthOffset);

  // ── Tuloslaskelma ──────────────────────────────────────────────────────────
  const tuottoRows: ReportRow[] = [];
  const kulutRows: ReportRow[] = [];

  for (const bal of tb) {
    if (bal.category === 'tuotot') {
      // Normal balance = kredit → revenue = kredit − debet
      const amount = round2(bal.kreditTotal - bal.debetTotal);
      if (amount > 0.005) {
        tuottoRows.push({ accountNumber: bal.accountNumber, accountName: bal.accountName, amount });
      }
    } else if (bal.category === 'kulut') {
      // Normal balance = debet
      const amount = round2(bal.debetTotal - bal.kreditTotal);
      if (amount > 0.005) {
        kulutRows.push({ accountNumber: bal.accountNumber, accountName: bal.accountName, amount });
      }
    }
  }

  const tuototTotal = round2(tuottoRows.reduce((s, r) => s + r.amount, 0));
  const kulutTotal  = round2(kulutRows.reduce((s, r) => s + r.amount, 0));
  const nettoTulos  = round2(tuototTotal - kulutTotal);

  // ── Tase ───────────────────────────────────────────────────────────────────
  const vastaavaaRows: ReportRow[] = [];
  const vastattavaaRows: ReportRow[] = [];

  for (const bal of tb) {
    if (bal.category === 'vastaavaa') {
      const amount = round2(bal.debetTotal - bal.kreditTotal); // net debet
      if (Math.abs(amount) > 0.005) {
        vastaavaaRows.push({ accountNumber: bal.accountNumber, accountName: bal.accountName, amount });
      }
    } else if (bal.category === 'vastattavaa') {
      const amount = round2(bal.kreditTotal - bal.debetTotal); // net kredit
      if (Math.abs(amount) > 0.005) {
        vastattavaaRows.push({ accountNumber: bal.accountNumber, accountName: bal.accountName, amount });
      }
    }
  }

  const vastaavaaTotal       = round2(vastaavaaRows.reduce((s, r) => s + r.amount, 0));
  const vastattavaaBalances  = round2(vastattavaaRows.reduce((s, r) => s + r.amount, 0));
  // Include period result so that vastaavaaTotal = vastattavaaTotal (A = L + E)
  const vastattavaaTotal     = round2(vastattavaaBalances + nettoTulos);
  const balanced             = Math.abs(vastaavaaTotal - vastattavaaTotal) < 0.02;

  return {
    trialBalance: tb,
    tuloslaskelma: { tuottoRows, kulutRows, tuototTotal, kulutTotal, nettoTulos },
    tase: { vastaavaaRows, vastattavaaRows, vastaavaaTotal, vastattavaaTotal, nettoTulos, balanced },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
