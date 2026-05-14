'use client';

import { useMemo, useState } from 'react';
import { novemberPhase1Exercises } from '@/data/exercises/november-phase1';
import { novemberPhase2Exercises } from '@/data/exercises/november-phase2';
import { decemberExercises } from '@/data/exercises/december';
import { januaryExercises } from '@/data/exercises/january';
import { februaryExercises } from '@/data/exercises/february';
import { asiakastmiTilikartta } from '@/data/accounts/chart-of-accounts';
import { computeReports } from '@/utils/reportEngine';

const ALL_EXERCISES = [
  ...novemberPhase1Exercises,
  ...novemberPhase2Exercises,
  ...decemberExercises,
  ...januaryExercises,
  ...februaryExercises,
];

const MONTH_OPTIONS = [
  { label: 'Marraskuu 2026', maxOffset: 0 },
  { label: 'Joulukuu 2026',  maxOffset: 1 },
  { label: 'Tammikuu 2027',  maxOffset: 2 },
  { label: 'Helmikuu 2027',  maxOffset: 3 },
  { label: 'Maaliskuu 2027 (sis. helmik. ALV-maksu)', maxOffset: 4 },
];

const fmt = (n: number) => n.toLocaleString('fi-FI', { minimumFractionDigits: 2 });

const CAT_DOT: Record<string, string> = {
  vastaavaa:  'report-cat-dot report-cat-vastaavaa',
  vastattavaa:'report-cat-dot report-cat-vastattavaa',
  tuotot:     'report-cat-dot report-cat-tuotot',
  kulut:      'report-cat-dot report-cat-kulut',
};

export function ReportView() {
  const [monthIdx, setMonthIdx] = useState(3); // helmikuu default
  const maxOffset = MONTH_OPTIONS[monthIdx].maxOffset;

  const report = useMemo(
    () => computeReports(ALL_EXERCISES, asiakastmiTilikartta, maxOffset),
    [maxOffset],
  );

  return (
    <div className="report-view">
      <div className="report-header">
        <div>
          <h2 className="report-title">Raportit</h2>
          <p className="report-subtitle">Asiakas Tmi — Kati Mäkinen</p>
        </div>
        <div className="report-period-sel">
          <label htmlFor="report-month-sel" className="report-period-label">Kausi:</label>
          <select
            id="report-month-sel"
            className="report-select"
            value={monthIdx}
            onChange={(e) => setMonthIdx(Number(e.target.value))}
          >
            {MONTH_OPTIONS.map((opt, i) => (
              <option key={i} value={i}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Pääkirja-koeajo ───────────────────────────────────────────────── */}
      <section className="report-section">
        <h3 className="report-section-title">Pääkirja-koeajo</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th></th>
              <th>Tili</th>
              <th className="report-num-col">Debet</th>
              <th className="report-num-col">Kredit</th>
              <th className="report-num-col">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {report.trialBalance.map((row) => (
              <tr key={row.numero}>
                <td><span className={CAT_DOT[row.kategoria]} /></td>
                <td>{row.numero} {row.nimi}</td>
                <td className="report-num-col">{row.debet > 0 ? fmt(row.debet) : ''}</td>
                <td className="report-num-col">{row.kredit > 0 ? fmt(row.kredit) : ''}</td>
                <td className="report-num-col report-balance-cell">
                  {row.balance !== 0
                    ? <span className={row.balance > 0 ? 'report-pos' : 'report-neg'}>{fmt(Math.abs(row.balance))}</span>
                    : '–'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Tuloslaskelma ─────────────────────────────────────────────────── */}
      <section className="report-section">
        <h3 className="report-section-title">Tuloslaskelma</h3>
        <table className="report-table">
          <tbody>
            <tr className="report-group-header">
              <td colSpan={2}><span className={CAT_DOT['tuotot']} /> LIIKEVAIHTO</td>
            </tr>
            {report.tuotot.map((r) => (
              <tr key={r.numero}>
                <td className="report-indent">{r.numero} {r.nimi}</td>
                <td className="report-num-col">{fmt(r.amount)}</td>
              </tr>
            ))}
            <tr className="report-total-row">
              <td>Liikevaihto yhteensä</td>
              <td className="report-num-col">{fmt(report.tuotot.reduce((s, r) => s + r.amount, 0))}</td>
            </tr>

            <tr className="report-group-header">
              <td colSpan={2}><span className={CAT_DOT['kulut']} /> KULUT</td>
            </tr>
            {report.kulut.map((r) => (
              <tr key={r.numero}>
                <td className="report-indent">{r.numero} {r.nimi}</td>
                <td className="report-num-col report-neg">-{fmt(r.amount)}</td>
              </tr>
            ))}
            <tr className="report-total-row">
              <td>Kulut yhteensä</td>
              <td className="report-num-col report-neg">-{fmt(report.kulut.reduce((s, r) => s + r.amount, 0))}</td>
            </tr>

            <tr className="report-result-row">
              <td><strong>Tilikauden tulos</strong></td>
              <td className="report-num-col">
                <strong className={report.nettoTulos >= 0 ? 'report-pos' : 'report-neg'}>
                  {fmt(report.nettoTulos)}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── Tase ─────────────────────────────────────────────────────────── */}
      <section className="report-section">
        <h3 className="report-section-title">
          Tase
          {report.taseBalanced
            ? <span className="report-balance-ok"> ✓ Tase tasapainossa</span>
            : <span className="report-balance-err"> ✗ Tase ei täsmää</span>
          }
        </h3>
        <div className="report-tase-grid">
          {/* Vastaavaa */}
          <div>
            <div className="report-tase-header"><span className={CAT_DOT['vastaavaa']} /> VASTAAVAA</div>
            {report.vastaavaa.map((r) => (
              <div key={r.numero} className="report-tase-row">
                <span className="report-tase-name">{r.numero} {r.nimi}</span>
                <span className="report-num-col">{fmt(r.amount)}</span>
              </div>
            ))}
            <div className="report-tase-total">
              <span>Vastaavaa yhteensä</span>
              <span className="report-num-col">{fmt(report.vastaavaaTotal)}</span>
            </div>
          </div>

          {/* Vastattavaa + tulos */}
          <div>
            <div className="report-tase-header"><span className={CAT_DOT['vastattavaa']} /> VASTATTAVAA</div>
            {report.vastattavaa.map((r) => (
              <div key={r.numero} className="report-tase-row">
                <span className="report-tase-name">{r.numero} {r.nimi}</span>
                <span className="report-num-col">{fmt(r.amount)}</span>
              </div>
            ))}
            <div className="report-tase-row report-tase-result-row">
              <span className="report-tase-name">Tilikauden tulos</span>
              <span className={`report-num-col ${report.nettoTulos >= 0 ? 'report-pos' : 'report-neg'}`}>
                {fmt(report.nettoTulos)}
              </span>
            </div>
            <div className="report-tase-total">
              <span>Vastattavaa yhteensä</span>
              <span className="report-num-col">{fmt(report.vastattavaaTotal + report.nettoTulos)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
