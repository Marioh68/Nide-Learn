'use client';

import { useState, useId } from 'react';
import { getAvailableAccounts } from '@/data/accounts/chart-of-accounts';
import { calcBalance } from '@/lib/checkExercise';
import type { StudentEntry, ExerciseSide } from '@/types/exercises';
import type { Theme } from '@/components/ThemeProvider';

interface JournalEntryFormProps {
  monthOffset: number;
  entries: StudentEntry[];
  onChange: (entries: StudentEntry[]) => void;
  theme: Theme;
  disabled?: boolean;
}

export function JournalEntryForm({
  monthOffset,
  entries,
  onChange,
  theme,
  disabled = false,
}: JournalEntryFormProps) {
  const uid = useId();
  const availableAccounts = getAvailableAccounts(monthOffset);
  const balance = calcBalance(entries);

  function updateEntry(id: string, field: keyof StudentEntry, value: string | number) {
    onChange(
      entries.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    );
  }

  function updateEntryFields(id: string, fields: Partial<StudentEntry>) {
    onChange(
      entries.map((e) =>
        e.id === id ? { ...e, ...fields } : e,
      ),
    );
  }

  function addRow() {
    const newEntry: StudentEntry = {
      id: `${uid}-${Date.now()}`,
      account: '',
      side: 'debet',
      amount: 0,
    };
    onChange([...entries, newEntry]);
  }

  function removeRow(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }

  if (theme === 'netvisor') {
    return <NetvisorForm entries={entries} availableAccounts={availableAccounts} balance={balance} disabled={disabled} onUpdate={updateEntry} onUpdateFields={updateEntryFields} onAdd={addRow} onRemove={removeRow} uid={uid} />;
  }
  return <ProcountorForm entries={entries} availableAccounts={availableAccounts} balance={balance} disabled={disabled} onUpdate={updateEntry} onUpdateFields={updateEntryFields} onAdd={addRow} onRemove={removeRow} uid={uid} />;
}

// ─── Shared types for sub-forms ───────────────────────────────────────────────

type AccountRow = ReturnType<typeof getAvailableAccounts>[number];

interface FormProps {
  entries: StudentEntry[];
  availableAccounts: AccountRow[];
  balance: ReturnType<typeof calcBalance>;
  disabled: boolean;
  uid: string;
  onUpdate: (id: string, field: keyof StudentEntry, value: string | number) => void;
  onUpdateFields: (id: string, fields: Partial<StudentEntry>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

// ─── Netvisor style ────────────────────────────────────────────────────────────

function NetvisorForm({ entries, availableAccounts, balance, disabled, uid, onUpdate, onAdd, onRemove }: FormProps) {
  return (
    <div className="jef jef-netvisor">
      <table className="jef-table">
        <thead>
          <tr>
            <th className="jef-th jef-col-account">Tili</th>
            <th className="jef-th jef-col-side">D/K</th>
            <th className="jef-th jef-col-amount">Summa</th>
            <th className="jef-th jef-col-alv">ALV-%</th>
            <th className="jef-th jef-col-alv">ALV-koodi</th>
            {!disabled && <th className="jef-th jef-col-action" />}
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={e.id} className="jef-row">
              <td className="jef-td">
                <select
                  value={e.account}
                  onChange={(ev) => onUpdate(e.id, 'account', ev.target.value)}
                  disabled={disabled}
                  aria-label={`Rivi ${i + 1}: tili`}
                  className="jef-select"
                >
                  <option value="">— Valitse tili —</option>
                  {availableAccounts.map((a) => (
                    <option key={a.numero} value={a.numero}>{a.numero} {a.nimi}</option>
                  ))}
                </select>
              </td>
              <td className="jef-td">
                <select
                  value={e.side}
                  onChange={(ev) => onUpdate(e.id, 'side', ev.target.value as ExerciseSide)}
                  disabled={disabled}
                  aria-label={`Rivi ${i + 1}: puoli`}
                  className="jef-select jef-side-select"
                >
                  <option value="debet">D</option>
                  <option value="kredit">K</option>
                </select>
              </td>
              <td className="jef-td">
                <input
                  type="text"
                  inputMode="decimal"
                  value={e.amount === 0 ? '' : e.amount}
                  onChange={(ev) => {
                    const v = parseFloat(ev.target.value.replace(',', '.'));
                    onUpdate(e.id, 'amount', isNaN(v) ? 0 : v);
                  }}
                  disabled={disabled}
                  aria-label={`Rivi ${i + 1}: summa`}
                  className="jef-input jef-amount"
                  placeholder="0,00"
                />
              </td>
              <td className="jef-td jef-alv-locked" aria-label="ALV-% (ei käytössä)">—</td>
              <td className="jef-td jef-alv-locked" aria-label="ALV-koodi (ei käytössä)">—</td>
              {!disabled && (
                <td className="jef-td jef-action-cell">
                  <button onClick={() => onRemove(e.id)} className="jef-remove" aria-label="Poista rivi">×</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!disabled && (
        <button onClick={onAdd} className="jef-add-btn">+ Lisää rivi</button>
      )}

      <BalanceFooter balance={balance} entryCount={entries.length} />
    </div>
  );
}

// ─── Procountor style ──────────────────────────────────────────────────────────

function ProcountorForm({ entries, availableAccounts, balance, disabled, uid, onUpdate, onUpdateFields, onAdd, onRemove }: FormProps) {
  return (
    <div className="jef jef-procountor">
      <table className="jef-table">
        <thead>
          <tr>
            <th className="jef-th jef-col-account">Tiliöinti</th>
            <th className="jef-th jef-col-amount">Debet</th>
            <th className="jef-th jef-col-amount">Kredit</th>
            <th className="jef-th jef-col-alv">Alv-%</th>
            <th className="jef-th jef-col-alv">Alv-laji</th>
            {!disabled && <th className="jef-th jef-col-action" />}
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={e.id} className="jef-row">
              <td className="jef-td">
                <select
                  value={e.account}
                  onChange={(ev) => onUpdate(e.id, 'account', ev.target.value)}
                  disabled={disabled}
                  aria-label={`Rivi ${i + 1}: tili`}
                  className="jef-select"
                >
                  <option value="">— Valitse tili —</option>
                  {availableAccounts.map((a) => (
                    <option key={a.numero} value={a.numero}>{a.numero} {a.nimi}</option>
                  ))}
                </select>
              </td>
              {/* Separate debet/kredit columns — Procountor convention */}
              <td className="jef-td">
                <input
                  type="text"
                  inputMode="decimal"
                  value={e.side === 'debet' && e.amount !== 0 ? e.amount : ''}
                  onChange={(ev) => {
                    const v = parseFloat(ev.target.value.replace(',', '.'));
                    if (!isNaN(v) && v > 0) {
                      onUpdateFields(e.id, { side: 'debet', amount: v });
                    } else if (ev.target.value === '') {
                      onUpdate(e.id, 'amount', 0);
                    }
                  }}
                  disabled={disabled}
                  aria-label={`Rivi ${i + 1}: debet`}
                  className="jef-input jef-amount"
                  placeholder="0,00"
                />
              </td>
              <td className="jef-td">
                <input
                  type="text"
                  inputMode="decimal"
                  value={e.side === 'kredit' && e.amount !== 0 ? e.amount : ''}
                  onChange={(ev) => {
                    const v = parseFloat(ev.target.value.replace(',', '.'));
                    if (!isNaN(v) && v > 0) {
                      onUpdateFields(e.id, { side: 'kredit', amount: v });
                    } else if (ev.target.value === '') {
                      onUpdate(e.id, 'amount', 0);
                    }
                  }}
                  disabled={disabled}
                  aria-label={`Rivi ${i + 1}: kredit`}
                  className="jef-input jef-amount"
                  placeholder="0,00"
                />
              </td>
              <td className="jef-td jef-alv-locked">—</td>
              <td className="jef-td jef-alv-locked">—</td>
              {!disabled && (
                <td className="jef-td jef-action-cell">
                  <button onClick={() => onRemove(e.id)} className="jef-remove" aria-label="Poista rivi">×</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!disabled && (
        <button onClick={onAdd} className="jef-add-btn">+ Lisää rivi</button>
      )}

      <BalanceFooter balance={balance} entryCount={entries.length} />
    </div>
  );
}

// ─── Shared balance footer ────────────────────────────────────────────────────

function BalanceFooter({ balance, entryCount }: { balance: ReturnType<typeof calcBalance>; entryCount: number }) {
  const fmt = (n: number) => n.toLocaleString('fi-FI', { minimumFractionDigits: 2 });
  return (
    <div className={`jef-balance ${balance.balanced && entryCount > 0 ? 'balanced' : ''}`}>
      <span>Debet <strong>{fmt(balance.debet)} €</strong></span>
      <span>Kredit <strong>{fmt(balance.kredit)} €</strong></span>
      <span className={balance.balanced ? 'balance-ok' : 'balance-err'}>
        Erotus <strong>{fmt(balance.difference)} €</strong>
      </span>
      {balance.balanced && entryCount > 0 && <span className="balance-check">✓</span>}
    </div>
  );
}
