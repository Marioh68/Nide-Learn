import { describe, expect, it } from 'vitest';
import { checkExercise, calcBalance } from '@/lib/checkExercise';
import type { StudentEntry, CorrectEntry, ErrorMessages } from '@/types/exercises';

const msgs: ErrorMessages = {
  balance: { attempt1: 'balance1', attempt2: 'balance2', attempt3: 'balance3' },
  side:    { attempt1: 'side1',    attempt2: 'side2',    attempt3: 'side3' },
  account: { attempt1: 'account1', attempt2: 'account2', attempt3: 'account3' },
  amount:  { attempt1: 'amount1',  attempt2: 'amount2',  attempt3: 'amount3' },
};

const correct: CorrectEntry[] = [
  { account: '1910', side: 'debet',  amount: 5000 },
  { account: '2080', side: 'kredit', amount: 5000 },
];

function makeEntry(account: string, side: 'debet' | 'kredit', amount: number): StudentEntry {
  return { id: account + side, account, side, amount };
}

describe('checkExercise', () => {
  it('returns correct when entries match', () => {
    const entries = [
      makeEntry('1910', 'debet', 5000),
      makeEntry('2080', 'kredit', 5000),
    ];
    const result = checkExercise(entries, correct, msgs, 1);
    expect(result.correct).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns correct regardless of entry order', () => {
    const entries = [
      makeEntry('2080', 'kredit', 5000),
      makeEntry('1910', 'debet', 5000),
    ];
    const result = checkExercise(entries, correct, msgs, 1);
    expect(result.correct).toBe(true);
  });

  it('detects balance error', () => {
    const entries = [
      makeEntry('1910', 'debet', 5000),
      makeEntry('2080', 'kredit', 4000),
    ];
    const result = checkExercise(entries, correct, msgs, 1);
    expect(result.correct).toBe(false);
    expect(result.errors[0].type).toBe('balance');
    expect(result.errors[0].message).toBe('balance1');
  });

  it('shows attempt2 message on second attempt', () => {
    const entries = [
      makeEntry('1910', 'debet', 5000),
      makeEntry('2080', 'kredit', 4000),
    ];
    const result = checkExercise(entries, correct, msgs, 2);
    expect(result.errors[0].message).toBe('balance2');
  });

  it('shows attempt3 message and microContentId on third attempt', () => {
    const msgsWithId: ErrorMessages = {
      ...msgs,
      side: { ...msgs.side, attempt3: 'side3', microContentId: 'mc-1' },
    };
    const entries = [
      makeEntry('1910', 'kredit', 5000), // wrong side
      makeEntry('2080', 'debet', 5000),
    ];
    const result = checkExercise(entries, correct, msgsWithId, 3);
    expect(result.errors[0].type).toBe('side');
    expect(result.errors[0].microContentId).toBe('mc-1');
  });

  it('detects wrong account', () => {
    const entries = [
      makeEntry('1700', 'debet', 5000), // wrong account
      makeEntry('2080', 'kredit', 5000),
    ];
    const result = checkExercise(entries, correct, msgs, 1);
    expect(result.correct).toBe(false);
    expect(result.errors[0].type).toBe('account');
  });

  it('detects wrong side on correct account', () => {
    const entries = [
      makeEntry('1910', 'kredit', 5000), // wrong side
      makeEntry('2080', 'debet', 5000),
    ];
    const result = checkExercise(entries, correct, msgs, 1);
    expect(result.correct).toBe(false);
    expect(result.errors[0].type).toBe('side');
  });

  it('detects wrong amount', () => {
    const entries = [
      makeEntry('1910', 'debet', 4999),
      makeEntry('2080', 'kredit', 4999),
    ];
    const result = checkExercise(entries, correct, msgs, 1);
    expect(result.correct).toBe(false);
    expect(result.errors[0].type).toBe('amount');
  });

  it('returns only one error at a time', () => {
    const entries = [
      makeEntry('1700', 'kredit', 999), // wrong account, wrong side, wrong amount
      makeEntry('2080', 'debet', 999),
    ];
    const result = checkExercise(entries, correct, msgs, 1);
    expect(result.errors.length).toBe(1);
  });
});

describe('calcBalance', () => {
  it('calculates debet, kredit and difference', () => {
    const entries = [
      { side: 'debet' as const, amount: 1000 },
      { side: 'debet' as const, amount: 200 },
      { side: 'kredit' as const, amount: 1200 },
    ];
    const b = calcBalance(entries);
    expect(b.debet).toBe(1200);
    expect(b.kredit).toBe(1200);
    expect(b.difference).toBeCloseTo(0);
    expect(b.balanced).toBe(true);
  });

  it('reports unbalanced correctly', () => {
    const entries = [
      { side: 'debet' as const, amount: 500 },
      { side: 'kredit' as const, amount: 300 },
    ];
    const b = calcBalance(entries);
    expect(b.balanced).toBe(false);
    expect(b.difference).toBe(200);
  });
});
