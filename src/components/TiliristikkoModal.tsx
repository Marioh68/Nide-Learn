'use client';

import { useEffect } from 'react';
import type { DocumentExercise, CorrectEntry } from '@/types/exercises';
import { asiakastmiTilikartta } from '@/data/accounts/chart-of-accounts';

interface Props {
  account: string | null;
  onClose: () => void;
  exercises: DocumentExercise[];
  maxMonthOffset?: number;
}

const MONTH_LABELS: Record<number, string> = {
  0: 'marras',
  1: 'joulu',
  2: 'tammi',
  3: 'helmi',
  4: 'maalis',
  5: 'huhti',
};

function fmtDate(offset: number, day: number): string {
  return `${MONTH_LABELS[offset] ?? `kk${offset}`} ${day}.`;
}

const fmt = (n: number) =>
  n.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function TiliristikkoModal({ account, onClose, exercises, maxMonthOffset = 99 }: Props) {
  useEffect(() => {
    if (!account) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [account, onClose]);

  if (!account) return null;

  const tili = asiakastmiTilikartta.find((t) => t.numero === account);

  const relevantEntries: Array<CorrectEntry & { docDate: string; docType: string }> = [];
  for (const ex of exercises) {
    if (ex.template.monthOffset > maxMonthOffset) continue;
    for (const entry of ex.correctEntries) {
      if (entry.account === account) {
        relevantEntries.push({
          ...entry,
          docDate: fmtDate(ex.template.monthOffset, ex.template.day),
          docType: ex.template.id,
        });
      }
    }
  }

  const debetRows = relevantEntries.filter((e) => e.side === 'debet');
  const kreditRows = relevantEntries.filter((e) => e.side === 'kredit');
  const debetTotal = debetRows.reduce((s, e) => s + e.amount, 0);
  const kreditTotal = kreditRows.reduce((s, e) => s + e.amount, 0);
  const saldo = debetTotal - kreditTotal;

  return (
    <>
      <div className="trm-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-label={`Tiliristikko: ${account} ${tili?.nimi ?? ''}`}
        aria-modal="true"
        className="trm-panel"
      >
        <div className="trm-header">
          <div>
            <span className="trm-account-num">{account}</span>
            <span className="trm-account-name">{tili?.nimi ?? 'Tili'}</span>
          </div>
          <button className="trm-close-btn" onClick={onClose} aria-label="Sulje tiliristikko">
            ✕
          </button>
        </div>

        <div className="trm-t-account">
          {/* Debet side */}
          <div className="trm-side trm-debet-side">
            <div className="trm-side-label">Debet</div>
            {debetRows.length === 0 ? (
              <div className="trm-empty">–</div>
            ) : (
              debetRows.map((e, i) => (
                <div key={i} className="trm-entry-row">
                  <span className="trm-entry-date">{e.docDate}</span>
                  <span className="trm-entry-amount">{fmt(e.amount)}</span>
                </div>
              ))
            )}
            <div className="trm-total-row">
              <span className="trm-total-label">Yhteensä</span>
              <span className="trm-total-amount">{fmt(debetTotal)}</span>
            </div>
          </div>

          <div className="trm-divider" />

          {/* Kredit side */}
          <div className="trm-side trm-kredit-side">
            <div className="trm-side-label">Kredit</div>
            {kreditRows.length === 0 ? (
              <div className="trm-empty">–</div>
            ) : (
              kreditRows.map((e, i) => (
                <div key={i} className="trm-entry-row">
                  <span className="trm-entry-date">{e.docDate}</span>
                  <span className="trm-entry-amount">{fmt(e.amount)}</span>
                </div>
              ))
            )}
            <div className="trm-total-row">
              <span className="trm-total-label">Yhteensä</span>
              <span className="trm-total-amount">{fmt(kreditTotal)}</span>
            </div>
          </div>
        </div>

        <div className="trm-saldo">
          <span className="trm-saldo-label">Saldo:</span>
          <span className={`trm-saldo-value ${saldo > 0 ? 'trm-saldo-d' : saldo < 0 ? 'trm-saldo-k' : ''}`}>
            {saldo >= 0 ? `D ${fmt(saldo)}` : `K ${fmt(Math.abs(saldo))}`}
          </span>
        </div>
      </div>
    </>
  );
}
