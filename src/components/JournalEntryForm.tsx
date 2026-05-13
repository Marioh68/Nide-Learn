'use client';

import { useId, useState } from 'react';
import { getAvailableAccounts } from '@/data/accounts/chart-of-accounts';
import { calcBalance } from '@/lib/checkExercise';
import type { StudentEntry } from '@/types/exercises';
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
// One amount column: positive = debet, negative = kredit (no D/K dropdown)

function NetvisorForm({ entries, availableAccounts, disabled, onUpdateFields, onAdd, onRemove }: FormProps) {
  // rawAmounts stores the string the user is actively typing so that partial
  // values like "-" or "99," are not reset by the controlled-input cycle.
  const [rawAmounts, setRawAmounts] = useState<Record<string, string>>({});

  function committedDisplay(e: StudentEntry): string {
    if (e.amount === 0) return '';
    return e.side === 'kredit' ? String(-e.amount) : String(e.amount);
  }

  function handleAmountChange(id: string, raw: string) {
    setRawAmounts((prev) => ({ ...prev, [id]: raw }));
    const normalised = raw.replace(',', '.');
    const v = parseFloat(normalised);
    if (isNaN(v) || normalised === '' || normalised === '-') {
      onUpdateFields(id, { amount: 0 });
      return;
    }
    if (v > 0) onUpdateFields(id, { side: 'debet', amount: v });
    else if (v < 0) onUpdateFields(id, { side: 'kredit', amount: Math.abs(v) });
    else onUpdateFields(id, { amount: 0 });
  }

  function commitRaw(id: string) {
    setRawAmounts((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }

  const totalDebet  = entries.reduce((s, e) => s + (e.side === 'debet'  ? e.amount : 0), 0);
  const totalKredit = entries.reduce((s, e) => s + (e.side === 'kredit' ? e.amount : 0), 0);
  const netBalance  = totalDebet - totalKredit;
  const balanced    = Math.abs(netBalance) < 0.005 && entries.length > 0;
  const fmt = (n: number) => n.toLocaleString('fi-FI', { minimumFractionDigits: 2 });

  return (
    <div className="jef jef-netvisor">

      {/* ── Netvisor-style form header ───────────────────────────────────── */}
      <div className="jef-nv-form-header">
        <div className="jef-nv-field">
          <span className="jef-nv-field-label">Tositelaji</span>
          <span className="jef-nv-field-value">MU Muut</span>
        </div>
        <div className="jef-nv-field jef-nv-field-selite">
          <span className="jef-nv-field-label">Selite</span>
          <span className="jef-nv-field-value jef-nv-field-placeholder">—</span>
        </div>
        <div className="jef-nv-autopost">
          <span className="jef-nv-autopost-label">Automaattinen vastakirjaus</span>
          <span className="jef-nv-toggle jef-nv-toggle-off">Off</span>
        </div>
      </div>

      {/* ── Entry table ──────────────────────────────────────────────────── */}
      <table className="jef-table">
        <thead>
          <tr className="jef-nv-thead">
            <th className="jef-th jef-nv-th-handle" aria-hidden="true" />
            <th className="jef-th jef-col-account">Tili</th>
            <th className="jef-th jef-col-amount">
              Summa
              <span className="jef-th-hint"> (+ debet / − kredit)</span>
            </th>
            <th className="jef-th jef-col-alv">ALV-%</th>
            <th className="jef-th jef-col-alv">ALV-tunnus</th>
            {!disabled && <th className="jef-th jef-col-action" />}
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={e.id} className="jef-row">
              <td className="jef-td jef-nv-handle-cell" aria-hidden="true">≡</td>
              <td className="jef-td">
                <select
                  value={e.account}
                  onChange={(ev) => onUpdateFields(e.id, { account: ev.target.value })}
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
                <input
                  type="text"
                  inputMode="decimal"
                  value={rawAmounts[e.id] !== undefined ? rawAmounts[e.id] : committedDisplay(e)}
                  onChange={(ev) => handleAmountChange(e.id, ev.target.value)}
                  onBlur={() => commitRaw(e.id)}
                  disabled={disabled}
                  aria-label={`Rivi ${i + 1}: summa`}
                  className={`jef-input jef-amount ${e.side === 'kredit' && e.amount > 0 ? 'jef-amount-kredit' : ''}`}
                  placeholder="0,00"
                />
              </td>
              <td className="jef-td jef-alv-locked">0 %</td>
              <td className="jef-td jef-alv-locked">—</td>
              {!disabled && (
                <td className="jef-td jef-action-cell">
                  <button onClick={() => onRemove(e.id)} className="jef-remove" aria-label="Poista rivi">×</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="jef-nv-total-row">
            <td className="jef-nv-total-label" colSpan={2}>Erotus</td>
            <td className={`jef-nv-total-amount ${balanced ? 'balance-ok' : entries.length > 0 ? 'balance-err' : ''}`}>
              {fmt(netBalance)} €
            </td>
            <td className="jef-nv-dk-cell" colSpan={disabled ? 2 : 3}>
              Debet / Kredit:&nbsp;
              <span className="jef-nv-dk-val">{fmt(totalDebet)} / {fmt(totalKredit)}</span>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* ── Bottom action row ─────────────────────────────────────────────── */}
      {!disabled && (
        <div className="jef-nv-bottom">
          <button onClick={onAdd} className="jef-add-btn">+ Lisää rivi</button>
        </div>
      )}
    </div>
  );
}

// ─── Procountor style ──────────────────────────────────────────────────────────

function ProcountorForm({ entries, availableAccounts, balance, disabled, onUpdate, onUpdateFields, onAdd, onRemove }: FormProps) {
  const [rawDebets, setRawDebets]   = useState<Record<string, string>>({});
  const [rawKredits, setRawKredits] = useState<Record<string, string>>({});

  function clearRaw(id: string, col: 'debet' | 'kredit') {
    if (col === 'debet')  setRawDebets((p)  => { const n = { ...p }; delete n[id]; return n; });
    else                  setRawKredits((p) => { const n = { ...p }; delete n[id]; return n; });
  }

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
                  value={rawDebets[e.id] !== undefined ? rawDebets[e.id] : (e.side === 'debet' && e.amount !== 0 ? String(e.amount) : '')}
                  onChange={(ev) => {
                    const raw = ev.target.value;
                    setRawDebets((p) => ({ ...p, [e.id]: raw }));
                    const v = parseFloat(raw.replace(',', '.'));
                    if (!isNaN(v) && v > 0) onUpdateFields(e.id, { side: 'debet', amount: v });
                    else if (raw === '') onUpdate(e.id, 'amount', 0);
                  }}
                  onBlur={() => clearRaw(e.id, 'debet')}
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
                  value={rawKredits[e.id] !== undefined ? rawKredits[e.id] : (e.side === 'kredit' && e.amount !== 0 ? String(e.amount) : '')}
                  onChange={(ev) => {
                    const raw = ev.target.value;
                    setRawKredits((p) => ({ ...p, [e.id]: raw }));
                    const v = parseFloat(raw.replace(',', '.'));
                    if (!isNaN(v) && v > 0) onUpdateFields(e.id, { side: 'kredit', amount: v });
                    else if (raw === '') onUpdate(e.id, 'amount', 0);
                  }}
                  onBlur={() => clearRaw(e.id, 'kredit')}
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
