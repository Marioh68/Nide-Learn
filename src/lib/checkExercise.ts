import type {
  StudentEntry,
  CorrectEntry,
  ErrorMessages,
  CheckResult,
  EntryError,
} from '@/types/exercises';

const AMOUNT_TOLERANCE = 0.005; // cent-level rounding tolerance

function roundedEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < AMOUNT_TOLERANCE;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function checkExercise(
  studentEntries: StudentEntry[],
  correctEntries: CorrectEntry[],
  errorMessages: ErrorMessages,
  attemptNumber: number,
): CheckResult {
  const errors: EntryError[] = [];

  // 1. Balance check — always first
  const studentDebet = studentEntries
    .filter((e) => e.side === 'debet')
    .reduce((s, e) => s + e.amount, 0);
  const studentKredit = studentEntries
    .filter((e) => e.side === 'kredit')
    .reduce((s, e) => s + e.amount, 0);

  if (!roundedEqual(studentDebet, studentKredit)) {
    errors.push(buildError('balance', -1, errorMessages.balance, attemptNumber));
    // Return early — balance must be fixed before deeper checks make sense
    return { correct: false, errors };
  }

  // 2. Entry count check
  if (studentEntries.length !== correctEntries.length) {
    errors.push(buildError('account', -1, errorMessages.account, attemptNumber));
    return { correct: false, errors };
  }

  // 3. Match each student entry to a correct entry (order-independent)
  const unmatchedCorrect = [...correctEntries];

  for (let i = 0; i < studentEntries.length; i++) {
    const se = studentEntries[i];

    // Try exact match first
    const exactIdx = unmatchedCorrect.findIndex(
      (ce) =>
        ce.account === se.account &&
        ce.side === se.side &&
        roundedEqual(ce.amount, se.amount),
    );

    if (exactIdx !== -1) {
      unmatchedCorrect.splice(exactIdx, 1);
      continue;
    }

    // Try matching by account to give a more specific error
    const accountIdx = unmatchedCorrect.findIndex((ce) => ce.account === se.account);

    if (accountIdx !== -1) {
      const ce = unmatchedCorrect[accountIdx];
      if (ce.side !== se.side) {
        errors.push(buildError('side', i, errorMessages.side, attemptNumber));
      } else {
        errors.push(buildError('amount', i, errorMessages.amount, attemptNumber));
      }
      unmatchedCorrect.splice(accountIdx, 1);
    } else {
      errors.push(buildError('account', i, errorMessages.account, attemptNumber));
    }
  }

  // Return first error only (most important first, per spec)
  if (errors.length > 0) {
    return { correct: false, errors: [errors[0]] };
  }

  return { correct: true, errors: [] };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildError(
  type: EntryError['type'],
  entryIndex: number,
  feedback: ErrorMessages[keyof ErrorMessages],
  attemptNumber: number,
): EntryError {
  const base: EntryError = { type, entryIndex, message: feedback.attempt1 };

  if (attemptNumber >= 2) base.message = feedback.attempt2;
  if (attemptNumber >= 3) {
    base.message = feedback.attempt3;
    if (feedback.microContentId) base.microContentId = feedback.microContentId;
  }

  if (attemptNumber >= 2) base.hint = feedback.attempt2;

  return base;
}

// ─── Balance utilities (used by UI for real-time display) ─────────────────────

export function calcBalance(entries: Pick<StudentEntry, 'side' | 'amount'>[]) {
  const debet = entries.filter((e) => e.side === 'debet').reduce((s, e) => s + e.amount, 0);
  const kredit = entries.filter((e) => e.side === 'kredit').reduce((s, e) => s + e.amount, 0);
  return { debet, kredit, difference: debet - kredit, balanced: roundedEqual(debet, kredit) };
}
