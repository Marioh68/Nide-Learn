'use client';

import { useState } from 'react';
import { VocabularyExercise } from '@/components/VocabularyExercise';
import { ExerciseFlow } from '@/components/ExerciseFlow';
import { ProgressTracker } from '@/components/ProgressTracker';
import { MonthIntro } from '@/components/MonthIntro';
import { level1Vocabulary } from '@/data/vocabulary/level-1';
import { novemberPhase1Exercises } from '@/data/exercises/november-phase1';
import { useTheme } from '@/hooks/useTheme';
import type { DocumentStatus } from '@/types/exercises';

type Tab = 'sanasto' | 'tositekirjaus';

export function DemoTabs() {
  const [tab, setTab] = useState<Tab>('sanasto');
  const [introSeen, setIntroSeen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [statuses, setStatuses] = useState<DocumentStatus[]>(
    novemberPhase1Exercises.map(() => 'aloittamatta'),
  );
  const { theme } = useTheme();

  function handleComplete() {
    const isLast = currentIndex === novemberPhase1Exercises.length - 1;
    setStatuses((prev) => {
      const next = [...prev];
      next[currentIndex] = 'valmis';
      return next;
    });
    if (isLast) {
      setAllDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleSelect(index: number) {
    setCurrentIndex(index);
    if (statuses[index] === 'aloittamatta') {
      setStatuses((prev) => {
        const next = [...prev];
        next[index] = 'kesken';
        return next;
      });
    }
  }

  return (
    <>
      {/* Tab bar */}
      <div className="demo-tabs">
        <button
          className={`demo-tab ${tab === 'sanasto' ? 'demo-tab-active' : ''}`}
          onClick={() => setTab('sanasto')}
        >
          Sanasto
        </button>
        <button
          className={`demo-tab ${tab === 'tositekirjaus' ? 'demo-tab-active' : ''}`}
          onClick={() => setTab('tositekirjaus')}
        >
          Tositekirjaus — Marraskuu
        </button>
      </div>

      {tab === 'sanasto' && (
        <div className="demo-pane">
          <h1 className="demo-h1">Kirjanpidon perussanasto — Taso 1</h1>
          <p className="demo-lead">
            Harjoittele kirjanpidon perustermejä. Yhdistä kukin termi sitä vastaavaan määritelmään.
          </p>
          <VocabularyExercise phases={level1Vocabulary} />
        </div>
      )}

      {tab === 'tositekirjaus' && !introSeen && (
        <div className="demo-pane">
          <MonthIntro onStart={() => setIntroSeen(true)} />
        </div>
      )}

      {tab === 'tositekirjaus' && introSeen && !allDone && (
        <div className="demo-pane demo-pane-split">
          <aside className="demo-sidebar">
            <ProgressTracker
              exercises={novemberPhase1Exercises}
              statuses={statuses}
              currentIndex={currentIndex}
              onSelect={handleSelect}
            />
          </aside>
          <div className="demo-exercise-area">
            <ExerciseFlow
              key={currentIndex}
              exercise={novemberPhase1Exercises[currentIndex]}
              theme={theme}
              onComplete={handleComplete}
            />
          </div>
        </div>
      )}

      {tab === 'tositekirjaus' && introSeen && allDone && (
        <div className="demo-pane">
          <NovemberSummary onRestart={() => { setAllDone(false); setCurrentIndex(0); setStatuses(novemberPhase1Exercises.map(() => 'aloittamatta')); }} />
        </div>
      )}
    </>
  );
}

// ─── November summary screen ──────────────────────────────────────────────────

const NOVEMBER_RECAP = [
  { id: 'ys-001',    type: 'Yksityissijoitus',       debet: '1910 Pankkitili',              kredit: '2080 Yksityistili',           note: '' },
  { id: 'yn-001',    type: 'Yksityisnosto',           debet: '2080 Yksityistili',            kredit: '1910 Pankkitili',             note: '' },
  { id: '2026-001',  type: 'Myyntilasku',             debet: '1700 Myyntisaamiset',          kredit: '3000 Myynti, palvelumyynti',  note: '' },
  { id: 'kuitti-001',type: 'Kuitti (toimistotarv.)',  debet: '8400 Liiketoiminnan muut kulut', kredit: '1910 Pankkitili',           note: '← ei 4000' },
  { id: 'ac-2611',   type: 'Ostolasku (kortti)',      debet: '8390 Tietotekniikkakulut',     kredit: '1910 Pankkitili',             note: '' },
  { id: 'lp-1142',   type: 'Ostolasku (maksuehto)',   debet: '8400 Liiketoiminnan muut kulut', kredit: '2520 Ostovelat',           note: '' },
  { id: 'tiliote-001',type: 'Tiliote — myyntisuoritus', debet: '1910 Pankkitili',            kredit: '1700 Myyntisaamiset',         note: '' },
  { id: 'tiliote-002',type: 'Tiliote — ostovelan maksu', debet: '2520 Ostovelat',            kredit: '1910 Pankkitili',             note: '' },
];

function NovemberSummary({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="ns-root">
      <div className="ns-hero">
        <div className="ns-hero-icon">✓</div>
        <h2 className="ns-hero-title">Marraskuun kirjaukset valmis!</h2>
        <p className="ns-hero-sub">Kati Mäkisen tmi — 8 tositetta kirjattu</p>
      </div>

      {/* Recap table */}
      <div className="ns-section">
        <h3 className="ns-section-title">Kirjausten koonti</h3>
        <table className="ns-table">
          <thead>
            <tr>
              <th className="ns-th">Tosite</th>
              <th className="ns-th">Debet</th>
              <th className="ns-th">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {NOVEMBER_RECAP.map((r) => (
              <tr key={r.id} className="ns-tr">
                <td className="ns-td ns-td-type">{r.type}</td>
                <td className="ns-td">{r.debet}{r.note && <span className="ns-note"> {r.note}</span>}</td>
                <td className="ns-td">{r.kredit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pedagogical note: 4000 vs 8400 */}
      <div className="ns-section">
        <h3 className="ns-section-title">Muista: 4000 vai 8400?</h3>
        <div className="ns-compare">
          <div className="ns-compare-card ns-compare-4000">
            <div className="ns-compare-account">4000 Aineet ja tarvikkeet</div>
            <p className="ns-compare-rule">
              <strong>Muuttuva kulu</strong> — tavara myydään asiakkaalle tai käytetään
              suoraan myytävän tuotteen valmistukseen.
            </p>
            <p className="ns-compare-example">Esim. puusepän puu, leipomon jauhot, mainostoimiston sublimaatiopaita asiakkaalle.</p>
          </div>
          <div className="ns-compare-card ns-compare-8400">
            <div className="ns-compare-account">8400 Liiketoiminnan muut kulut</div>
            <p className="ns-compare-rule">
              <strong>Yleiskulu</strong> — kulu ei vaikuta suoraan liikevaihtoon eikä päädy
              asiakkaan tuotteeseen.
            </p>
            <p className="ns-compare-example">Esim. toimistotarvikkeet, lehti-ilmoitukset, vakuutukset, konttorivuokra.</p>
          </div>
        </div>
        <p className="ns-compare-tip">
          Katin kyniä ja muistilappuja ei myydä asiakkaalle → <strong>8400</strong>, ei 4000.
        </p>
      </div>

      <div className="ns-actions">
        <button className="ns-restart-btn" onClick={onRestart}>
          Aloita marraskuu uudelleen
        </button>
      </div>
    </div>
  );
}
