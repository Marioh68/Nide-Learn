'use client';

import { useState, useMemo } from 'react';
import { novemberPhase1Exercises } from '@/data/exercises/november-phase1';
import { novemberPhase2Exercises } from '@/data/exercises/november-phase2';
import { decemberExercises } from '@/data/exercises/december';
import { januaryExercises } from '@/data/exercises/january';
import { februaryExercises } from '@/data/exercises/february';
import { marchExercises } from '@/data/exercises/march';
import { asiakastmiTilikartta } from '@/data/accounts/chart-of-accounts';
import { TiliristikkoModal } from '@/components/TiliristikkoModal';
import type { DocumentExercise, DocumentType } from '@/types/exercises';

const ALL_EXERCISES: DocumentExercise[] = [
  ...novemberPhase1Exercises,
  ...novemberPhase2Exercises,
  ...decemberExercises,
  ...januaryExercises,
  ...februaryExercises,
  ...marchExercises,
];

const MONTH_OPTIONS = [
  { label: 'Marraskuu 2026',  maxOffset: 0 },
  { label: 'Joulukuu 2026',   maxOffset: 1 },
  { label: 'Tammikuu 2027',   maxOffset: 2 },
  { label: 'Helmikuu 2027',   maxOffset: 3 },
  { label: 'Maaliskuu 2027',  maxOffset: 4 },
  { label: 'Huhtikuu 2027 (sis. maalis. ALV-maksu)', maxOffset: 5 },
];

const TYPE_LABELS: Record<DocumentType, string> = {
  yksityissijoitus: 'Yksityissijoitus',
  yksityisnosto: 'Yksityisnosto',
  myyntilasku: 'Myyntilasku',
  ostolasku: 'Ostolasku',
  kuitti: 'Kuitti',
  tiliotetapahtuma: 'Tiliote',
  muistiotosite: 'Muistiotosite',
};

const MONTH_NAMES: Record<number, string> = {
  0: 'Marras 2026',
  1: 'Joulu 2026',
  2: 'Tammi 2027',
  3: 'Helmi 2027',
  4: 'Maalis 2027',
  5: 'Huhti 2027',
};

const fmt = (n: number) =>
  n.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function accountName(numero: string): string {
  return asiakastmiTilikartta.find((t) => t.numero === numero)?.nimi ?? '';
}

interface JournalRow {
  exerciseId: string;
  monthOffset: number;
  day: number;
  docType: DocumentType;
  counterparty: string;
  account: string;
  side: 'debet' | 'kredit';
  amount: number;
}

export function PaivakirjaView() {
  const [monthIdx, setMonthIdx] = useState(4); // maaliskuu default
  const [openAccount, setOpenAccount] = useState<string | null>(null);

  const maxOffset = MONTH_OPTIONS[monthIdx].maxOffset;

  const rows: JournalRow[] = useMemo(() => {
    const result: JournalRow[] = [];
    for (const ex of ALL_EXERCISES) {
      if (ex.template.monthOffset > maxOffset) continue;
      for (const entry of ex.correctEntries) {
        result.push({
          exerciseId: ex.template.id,
          monthOffset: ex.template.monthOffset,
          day: ex.template.day,
          docType: ex.template.type,
          counterparty: ex.template.counterparty ?? '–',
          account: entry.account,
          side: entry.side,
          amount: entry.amount,
        });
      }
    }
    result.sort((a, b) =>
      a.monthOffset !== b.monthOffset
        ? a.monthOffset - b.monthOffset
        : a.day - b.day,
    );
    return result;
  }, [maxOffset]);

  const debetTotal = useMemo(() => rows.filter((r) => r.side === 'debet').reduce((s, r) => s + r.amount, 0), [rows]);
  const kreditTotal = useMemo(() => rows.filter((r) => r.side === 'kredit').reduce((s, r) => s + r.amount, 0), [rows]);

  // Group rows by exerciseId to visually separate transactions
  let prevId = '';

  return (
    <div className="pv-root">
      <div className="pv-header">
        <div>
          <h2 className="pv-title">Päiväkirja</h2>
          <p className="pv-subtitle">Asiakas Tmi — Kati Mäkinen — kaikki kirjaukset</p>
        </div>
        <div className="pv-controls">
          <label htmlFor="pv-month-sel" className="pv-period-label">Kausi:</label>
          <select
            id="pv-month-sel"
            className="pv-select"
            value={monthIdx}
            onChange={(e) => setMonthIdx(Number(e.target.value))}
          >
            {MONTH_OPTIONS.map((opt, i) => (
              <option key={i} value={i}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="pv-tip">Klikkaa tilinumeroa nähdäksesi tilin T-ristikko.</p>

      <div className="pv-table-wrap">
        <table className="pv-table">
          <thead>
            <tr>
              <th className="pv-th">Pvm</th>
              <th className="pv-th">Tyyppi</th>
              <th className="pv-th">Vastapuoli</th>
              <th className="pv-th">Tili</th>
              <th className="pv-th pv-th-r">Debet</th>
              <th className="pv-th pv-th-r">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const newGroup = row.exerciseId !== prevId;
              prevId = row.exerciseId;
              return (
                <tr
                  key={idx}
                  className={`pv-tr ${newGroup ? 'pv-tr-group-start' : ''}`}
                >
                  <td className="pv-td pv-td-date">
                    {newGroup
                      ? `${MONTH_NAMES[row.monthOffset] ?? `kk${row.monthOffset}`} ${row.day}.`
                      : ''}
                  </td>
                  <td className="pv-td pv-td-type">
                    {newGroup ? TYPE_LABELS[row.docType] : ''}
                  </td>
                  <td className="pv-td pv-td-party">
                    {newGroup ? row.counterparty : ''}
                  </td>
                  <td className="pv-td pv-td-account">
                    <button
                      className="pv-account-btn"
                      onClick={() => setOpenAccount(row.account)}
                      aria-label={`Näytä tiliristikko: ${row.account} ${accountName(row.account)}`}
                    >
                      {row.account}
                    </button>
                    <span className="pv-account-name">{accountName(row.account)}</span>
                  </td>
                  <td className="pv-td pv-td-r">
                    {row.side === 'debet' ? fmt(row.amount) : ''}
                  </td>
                  <td className="pv-td pv-td-r">
                    {row.side === 'kredit' ? fmt(row.amount) : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="pv-tfoot-tr">
              <td colSpan={4} className="pv-tfoot-label">Yhteensä</td>
              <td className="pv-td pv-td-r pv-total">{fmt(debetTotal)}</td>
              <td className="pv-td pv-td-r pv-total">{fmt(kreditTotal)}</td>
            </tr>
            <tr className="pv-tfoot-balance">
              <td colSpan={4} className="pv-tfoot-label">
                {Math.abs(debetTotal - kreditTotal) < 0.02
                  ? '✓ Päiväkirja tasapainossa'
                  : '⚠ Ei tasapainossa'}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      <TiliristikkoModal
        account={openAccount}
        onClose={() => setOpenAccount(null)}
        exercises={ALL_EXERCISES}
        maxMonthOffset={maxOffset}
      />
    </div>
  );
}
