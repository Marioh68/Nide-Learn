// Domain types for Nide Learn exercise system
// Finnish accounting terms kept in Finnish per project conventions

export type DocumentType =
  | 'yksityissijoitus'
  | 'yksityisnosto'
  | 'myyntilasku'
  | 'ostolasku'
  | 'kuitti'
  | 'tiliotetapahtuma'
  | 'muistiotosite';

export type DocumentStatus = 'aloittamatta' | 'kesken' | 'valmis' | 'ohitettu';

export type ExerciseSide = 'debet' | 'kredit';

export type ErrorType = 'balance' | 'side' | 'account' | 'amount';

// ─── Account chart ────────────────────────────────────────────────────────────

export type AccountCategory = 'vastaavaa' | 'vastattavaa' | 'tuotot' | 'kulut';

export interface KirjanpitoTili {
  numero: string;
  nimi: string;
  kategoria: AccountCategory;
  kayttoonotto: number; // kk_offset (0 = kk1)
}

// ─── Correct answer model ─────────────────────────────────────────────────────

export interface CorrectEntry {
  account: string;       // tilinumero, e.g. "1910"
  side: ExerciseSide;
  amount: number;
}

// ─── Feedback messages per error type ────────────────────────────────────────

export interface FeedbackLevel {
  attempt1: string;      // abstract — student thinks on their own
  attempt2: string;      // concrete hint
  attempt3: string;      // hint + microContentId link
  microContentId?: string;
}

export interface ErrorMessages {
  balance: FeedbackLevel;
  side: FeedbackLevel;
  account: FeedbackLevel;
  amount: FeedbackLevel;
}

// ─── Document template (source document shown to student) ────────────────────

export interface DocumentTemplate {
  id: string;
  type: DocumentType;
  monthOffset: number;   // 0 = marraskuu, 1 = joulukuu, ...
  day: number;
  description: string;   // 1-2 sentence story context
  amount: number;
  counterparty?: string;
  invoiceNumber?: string;
  dueDay?: number;       // eräpäivän päivä samassa kuussa (tai seuraavassa)
  dueDayOffset?: number; // +1 = seuraava kuukausi
  paymentTerm?: string;
  referenceNumber?: string;
  vatRate?: number;      // e.g. 25.5 — if set, amount is total incl. VAT
}

// ─── Full exercise unit ───────────────────────────────────────────────────────

export interface DocumentExercise {
  template: DocumentTemplate;
  correctEntries: CorrectEntry[];
  errorMessages: ErrorMessages;
  orientationQuestion?: string;  // shown before student starts
  explanation: string;           // shown after correct answer
}

// ─── Student entry (what student inputs) ─────────────────────────────────────

export interface StudentEntry {
  id: string;           // uuid for React key
  account: string;
  side: ExerciseSide;
  amount: number;
  description?: string;
}

// ─── Check result ─────────────────────────────────────────────────────────────

export interface EntryError {
  type: ErrorType;
  entryIndex: number;
  message: string;
  hint?: string;
  microContentId?: string;
}

export interface CheckResult {
  correct: boolean;
  errors: EntryError[];
}

// ─── Exercise session state ───────────────────────────────────────────────────

export type ExerciseStep = 'document' | 'ledger' | 'journal' | 'explanation';

export interface ExerciseSessionState {
  currentDocumentIndex: number;
  currentStep: ExerciseStep;
  documentStatuses: DocumentStatus[];
  attemptCounts: Record<string, number>; // documentId → attempt count
}
