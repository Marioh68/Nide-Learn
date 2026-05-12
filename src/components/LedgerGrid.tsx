'use client';

import { useState, useId } from 'react';
import { calcBalance } from '@/lib/checkExercise';
import { getAvailableAccounts } from '@/data/accounts/chart-of-accounts';
import type { StudentEntry, ExerciseSide } from '@/types/exercises';

interface LedgerGridProps {
  monthOffset: number;
  entries: StudentEntry[];
  onChange: (entries: StudentEntry[]) => void;
  disabled?: boolean;
}

interface TAccount {
  numero: string;
  nimi: string;
  debet: StudentEntry[];
  kredit: StudentEntry[];
}

function buildTAccounts(entries: StudentEntry[], accounts: ReturnType<typeof getAvailableAccounts>): TAccount[] {
  const map = new Map<string, TAccount>();
  for (const e of entries) {
    if (!map.has(e.account)) {
      const tili = accounts.find((a) => a.numero === e.account);
      map.set(e.account, {
        numero: e.account,
        nimi: tili?.nimi ?? e.account,
        debet: [],
        kredit: [],
      });
    }
    const t = map.get(e.account)!;
    if (e.side === 'debet') t.debet.push(e);
    else t.kredit.push(e);
  }
  return Array.from(map.values());
}

export function LedgerGrid({ monthOffset, entries, onChange, disabled = false }: LedgerGridProps) {
  const uid = useId();
  const availableAccounts = getAvailableAccounts(monthOffset);
  const tAccounts = buildTAccounts(entries, availableAccounts);
  const balance = calcBalance(entries);

  const [newAccount, setNewAccount] = useState('');
  const [newSide, setNewSide] = useState<ExerciseSide>('debet');
  const [newAmount, setNewAmount] = useState('');
  const [addError, setAddError] = useState('');

  function addEntry() {
    setAddError('');
    if (!newAccount) { setAddError('Valitse tili.'); return; }
    const amount = parseFloat(newAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) { setAddError('Syötä positiivinen summa.'); return; }
    const entry: StudentEntry = {
      id: `${uid}-${Date.now()}`,
      account: newAccount,
      side: newSide,
      amount,
    };
    onChange([...entries, entry]);
    setNewAccount('');
    setNewSide('debet');
    setNewAmount('');
  }

  function removeEntry(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }

  return (
    <div className="ledger-grid">
      {/* T-account columns */}
      {tAccounts.length === 0 ? (
        <p className="ledger-empty">Ei kirjauksia vielä. Lisää kirjaus alta.</p>
      ) : (
        <div className="t-accounts-row">
          {tAccounts.map((t) => (
            <div key={t.numero} className="t-account">
              <div className="t-account-header">{t.numero} {t.nimi}</div>
              <div className="t-account-body">
                {/* Debet side */}
                <div className="t-side t-debet">
                  <div className="t-side-label">Debet</div>
                  {t.debet.map((e) => (
                    <div key={e.id} className="t-entry">
                      <span className="t-amount">{e.amount.toLocaleString('fi-FI', { minimumFractionDigits: 2 })} €</span>
                      {!disabled && (
                        <button
                          className="t-remove"
                          onClick={() => removeEntry(e.id)}
                          aria-label="Poista kirjaus"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {/* Kredit side */}
                <div className="t-side t-kredit">
                  <div className="t-side-label">Kredit</div>
                  {t.kredit.map((e) => (
                    <div key={e.id} className="t-entry">
                      <span className="t-amount">{e.amount.toLocaleString('fi-FI', { minimumFractionDigits: 2 })} €</span>
                      {!disabled && (
                        <button
                          className="t-remove"
                          onClick={() => removeEntry(e.id)}
                          aria-label="Poista kirjaus"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add entry row */}
      {!disabled && (
        <div className="ledger-add-row">
          <select
            value={newAccount}
            onChange={(e) => setNewAccount(e.target.value)}
            aria-label="Tili"
            className="ledger-select"
          >
            <option value="">— Valitse tili —</option>
            {availableAccounts.map((a) => (
              <option key={a.numero} value={a.numero}>
                {a.numero} {a.nimi}
              </option>
            ))}
          </select>

          <fieldset className="ledger-side-fieldset">
            <legend className="sr-only">Puoli</legend>
            <label className="ledger-radio">
              <input
                type="radio"
                name={`${uid}-side`}
                value="debet"
                checked={newSide === 'debet'}
                onChange={() => setNewSide('debet')}
              />
              Debet
            </label>
            <label className="ledger-radio">
              <input
                type="radio"
                name={`${uid}-side`}
                value="kredit"
                checked={newSide === 'kredit'}
                onChange={() => setNewSide('kredit')}
              />
              Kredit
            </label>
          </fieldset>

          <input
            type="text"
            inputMode="decimal"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="Summa €"
            aria-label="Summa"
            className="ledger-amount-input"
            onKeyDown={(e) => { if (e.key === 'Enter') addEntry(); }}
          />

          <button onClick={addEntry} className="ledger-add-btn">
            Lisää kirjaus
          </button>

          {addError && <span className="ledger-add-error">{addError}</span>}
        </div>
      )}

      {/* Balance bar */}
      <div className={`ledger-balance-bar ${balance.balanced && entries.length > 0 ? 'balanced' : 'unbalanced'}`}>
        <span>Debet yhteensä <strong>{balance.debet.toLocaleString('fi-FI', { minimumFractionDigits: 2 })} €</strong></span>
        <span>·</span>
        <span>Kredit yhteensä <strong>{balance.kredit.toLocaleString('fi-FI', { minimumFractionDigits: 2 })} €</strong></span>
        <span>·</span>
        <span>
          Erotus{' '}
          <strong className={balance.balanced ? 'balance-ok' : 'balance-err'}>
            {balance.difference.toLocaleString('fi-FI', { minimumFractionDigits: 2 })} €
          </strong>
        </span>
        {balance.balanced && entries.length > 0 && (
          <span className="balance-check">✓ Tasapainossa</span>
        )}
      </div>
    </div>
  );
}
