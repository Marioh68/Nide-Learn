'use client';

import { useState, useMemo } from 'react';
import { computeReports } from '@/utils/reportEngine';
import { novemberPhase1Exercises } from '@/data/exercises/november-phase1';
import { novemberPhase2Exercises } from '@/data/exercises/november-phase2';
import { decemberExercises } from '@/data/exercises/december';
import { januaryExercises } from '@/data/exercises/january';
import { februaryExercises } from '@/data/exercises/february';
import { marchExercises } from '@/data/exercises/march';
import { asiakastmiTilikartta } from '@/data/accounts/chart-of-accounts';

const ALL_EXERCISES = [
  ...novemberPhase1Exercises,
  ...novemberPhase2Exercises,
  ...decemberExercises,
  ...januaryExercises,
  ...februaryExercises,
  ...marchExercises,
];

const MONTH_OPTIONS = [
  { label: 'Marraskuu 2026',                         maxOffset: 0 },
  { label: 'Joulukuu 2026',                          maxOffset: 1 },
  { label: 'Tammikuu 2027 (ALV alkaa)',               maxOffset: 2 },
  { label: 'Helmikuu 2027',                          maxOffset: 3 },
  { label: 'Maaliskuu 2027 (ALV-maksu)',              maxOffset: 4 },
  { label: 'Huhtikuu 2027 (sis. maalis. ALV-maksu)', maxOffset: 5 },
];

// Format number Finnish locale, always 2 decimals
function fmt(n: number): string {
  return Math.abs(n).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ReportView() {
  const [optionIdx, setOptionIdx] = useState(3); // default: Helmikuu
  const maxOffset = MONTH_OPTIONS[optionIdx].maxOffset;

  const report = useMemo(
    () => computeReports(ALL_EXERCISES, asiakastmiTilikartta, maxOffset),
    [maxOffset],
  );

  return (
    <div className="report-view">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="report-header">
        <div>
          <h2 className="report-title">Raportit — Asiakas Tmi, Kati Mäkinen</h2>
          <p className="report-subtitle">Laskettu harjoitusten oikeista kirjauksista</p>
        </div>
        <div className="report-period-sel">
          <label htmlFor="report-month-sel">Kausi:</label>
          <select
            id="report-month-sel"
            value={optionIdx}
            onChange={(e) => setOptionIdx(Number(e.target.value))}
            className="report-select"
          >
            {MONTH_OPTIONS.map((opt, i) => (
              <option key={i} value={i}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Pääkirja (trial balance) ────────────────────────────────────────── */}
      <div className="report-section">
        <h3 className="report-section-title">Pääkirja-koeajo</h3>
        <p className="report-section-desc">
          Kaikki liikutellut tilit debet- ja kredit-summilla. Saldo = debet − kredit.
          Sulkumerkit tarkoittavat negatiivista saldoa (luonnollinen vastattavaa- ja tuottotileillä).
        </p>
        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th className="report-th report-th-cat"></th>
                <th className="report-th">Tili</th>
                <th className="report-th report-th-num">Debet</th>
                <th className="report-th report-th-num">Kredit</th>
                <th className="report-th report-th-num">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {report.trialBalance.map((bal) => (
                <tr key={bal.accountNumber} className={`report-tr report-tr-${bal.category}`}>
                  <td className="report-td report-td-cat">
                    <span className={`report-cat-dot report-cat-${bal.category}`} />
                  </td>
                  <td className="report-td report-td-account">
                    {bal.accountNumber} {bal.accountName}
                  </td>
                  <td className="report-td report-td-num">
                    {bal.debetTotal > 0 ? fmt(bal.debetTotal) : ''}
                  </td>
                  <td className="report-td report-td-num">
                    {bal.kreditTotal > 0 ? fmt(bal.kreditTotal) : ''}
                  </td>
                  <td className="report-td report-td-num report-td-saldo">
                    {bal.netBalance > 0.005
                      ? fmt(bal.netBalance)
                      : bal.netBalance < -0.005
                        ? `(${fmt(bal.netBalance)})`
                        : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Tuloslaskelma ───────────────────────────────────────────────────── */}
      <div className="report-section">
        <h3 className="report-section-title">Tuloslaskelma</h3>
        <div className="report-table-wrap report-table-wrap-narrow">
          <table className="report-table">
            <tbody>
              {/* Tuotot */}
              <tr className="report-group-row">
                <td className="report-td report-td-group" colSpan={2}>LIIKEVAIHTO</td>
              </tr>
              {report.tuloslaskelma.tuottoRows.map((r) => (
                <tr key={r.accountNumber} className="report-tr">
                  <td className="report-td report-td-account">
                    {r.accountNumber} {r.accountName}
                  </td>
                  <td className="report-td report-td-num">{fmt(r.amount)}</td>
                </tr>
              ))}
              <tr className="report-total-row">
                <td className="report-td report-td-total">Liikevaihto yhteensä</td>
                <td className="report-td report-td-num report-td-total">
                  {fmt(report.tuloslaskelma.tuototTotal)}
                </td>
              </tr>

              {/* Kulut */}
              <tr className="report-group-row">
                <td className="report-td report-td-group" colSpan={2}>KULUT</td>
              </tr>
              {report.tuloslaskelma.kulutRows.map((r) => (
                <tr key={r.accountNumber} className="report-tr">
                  <td className="report-td report-td-account">
                    {r.accountNumber} {r.accountName}
                  </td>
                  <td className="report-td report-td-num">{fmt(r.amount)}</td>
                </tr>
              ))}
              <tr className="report-total-row">
                <td className="report-td report-td-total">Kulut yhteensä</td>
                <td className="report-td report-td-num report-td-total">
                  {fmt(report.tuloslaskelma.kulutTotal)}
                </td>
              </tr>

              {/* Nettotulos */}
              <tr className="report-result-row">
                <td className="report-td report-td-result">
                  {report.tuloslaskelma.nettoTulos >= 0
                    ? 'TILIKAUDEN VOITTO'
                    : 'TILIKAUDEN TAPPIO'}
                </td>
                <td
                  className={`report-td report-td-num report-td-result ${
                    report.tuloslaskelma.nettoTulos >= 0 ? 'report-pos' : 'report-neg'
                  }`}
                >
                  {fmt(report.tuloslaskelma.nettoTulos)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Tase ───────────────────────────────────────────────────────────── */}
      <div className="report-section">
        <h3 className="report-section-title">Tase</h3>
        <div className="report-tase-grid">

          {/* Vastaavaa */}
          <div className="report-tase-col">
            <div className="report-tase-col-header">VASTAAVAA</div>
            <table className="report-table">
              <tbody>
                {report.tase.vastaavaaRows.map((r) => (
                  <tr key={r.accountNumber} className="report-tr">
                    <td className="report-td report-td-account">
                      {r.accountNumber} {r.accountName}
                    </td>
                    <td className="report-td report-td-num">{fmt(r.amount)}</td>
                  </tr>
                ))}
                <tr className="report-total-row">
                  <td className="report-td report-td-total">Yhteensä</td>
                  <td className="report-td report-td-num report-td-total">
                    {fmt(report.tase.vastaavaaTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Vastattavaa */}
          <div className="report-tase-col">
            <div className="report-tase-col-header">VASTATTAVAA</div>
            <table className="report-table">
              <tbody>
                {report.tase.vastattavaaRows.map((r) => (
                  <tr key={r.accountNumber} className="report-tr">
                    <td className="report-td report-td-account">
                      {r.accountNumber} {r.accountName}
                    </td>
                    <td className="report-td report-td-num">{fmt(r.amount)}</td>
                  </tr>
                ))}
                <tr className="report-tulos-row report-tr">
                  <td className="report-td report-td-account report-td-tulos">
                    {report.tuloslaskelma.nettoTulos >= 0
                      ? 'Tilikauden voitto'
                      : 'Tilikauden tappio'}
                  </td>
                  <td
                    className={`report-td report-td-num report-td-tulos ${
                      report.tuloslaskelma.nettoTulos >= 0 ? 'report-pos' : 'report-neg'
                    }`}
                  >
                    {fmt(report.tuloslaskelma.nettoTulos)}
                  </td>
                </tr>
                <tr className="report-total-row">
                  <td className="report-td report-td-total">Yhteensä</td>
                  <td className="report-td report-td-num report-td-total">
                    {fmt(report.tase.vastattavaaTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
            {report.tase.balanced ? (
              <div className="report-balance-ok">✓ Tase tasapainossa</div>
            ) : (
              <div className="report-balance-err">
                ⚠ Tase ei täsmää ({fmt(Math.abs(report.tase.vastaavaaTotal - report.tase.vastattavaaTotal))} € ero)
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
