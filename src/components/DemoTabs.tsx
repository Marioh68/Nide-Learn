'use client';

import { useState } from 'react';
import { VocabularyExercise } from '@/components/VocabularyExercise';
import { ExerciseFlow } from '@/components/ExerciseFlow';
import { ProgressTracker } from '@/components/ProgressTracker';
import { MonthIntro } from '@/components/MonthIntro';
import { level1Vocabulary } from '@/data/vocabulary/level-1';
import { novemberPhase1Exercises } from '@/data/exercises/november-phase1';
import { novemberPhase2Exercises } from '@/data/exercises/november-phase2';
import { decemberExercises } from '@/data/exercises/december';
import { januaryExercises } from '@/data/exercises/january';
import { useTheme } from '@/hooks/useTheme';
import type { DocumentStatus } from '@/types/exercises';

type Tab = 'sanasto' | 'marraskuu' | 'joulukuu' | 'tammikuu';

const allNovemberExercises = [...novemberPhase1Exercises, ...novemberPhase2Exercises];

export function DemoTabs() {
  const [tab, setTab] = useState<Tab>('sanasto');
  const { theme } = useTheme();

  // ── November state ──────────────────────────────────────────────────────────
  const [novIntroSeen, setNovIntroSeen] = useState(false);
  const [novIndex, setNovIndex] = useState(0);
  const [novDone, setNovDone] = useState(false);
  const [novStatuses, setNovStatuses] = useState<DocumentStatus[]>(
    allNovemberExercises.map(() => 'aloittamatta'),
  );

  // ── December state ──────────────────────────────────────────────────────────
  const [decIntroSeen, setDecIntroSeen] = useState(false);
  const [decIndex, setDecIndex] = useState(0);
  const [decDone, setDecDone] = useState(false);
  const [decStatuses, setDecStatuses] = useState<DocumentStatus[]>(
    decemberExercises.map(() => 'aloittamatta'),
  );

  // ── January state ───────────────────────────────────────────────────────────
  const [janIntroSeen, setJanIntroSeen] = useState(false);
  const [janIndex, setJanIndex] = useState(0);
  const [janDone, setJanDone] = useState(false);
  const [janStatuses, setJanStatuses] = useState<DocumentStatus[]>(
    januaryExercises.map(() => 'aloittamatta'),
  );

  // ── November handlers ───────────────────────────────────────────────────────
  function handleNovComplete() {
    const isLast = novIndex === allNovemberExercises.length - 1;
    setNovStatuses((prev) => {
      const n = [...prev];
      n[novIndex] = 'valmis';
      return n;
    });
    if (isLast) {
      setNovDone(true);
    } else {
      setNovIndex((i) => i + 1);
    }
  }

  function handleNovSelect(index: number) {
    setNovIndex(index);
    if (novStatuses[index] === 'aloittamatta') {
      setNovStatuses((prev) => {
        const n = [...prev];
        n[index] = 'kesken';
        return n;
      });
    }
  }

  // ── January handlers ────────────────────────────────────────────────────────
  function handleJanComplete() {
    const isLast = janIndex === januaryExercises.length - 1;
    setJanStatuses((prev) => {
      const n = [...prev];
      n[janIndex] = 'valmis';
      return n;
    });
    if (isLast) {
      setJanDone(true);
    } else {
      setJanIndex((i) => i + 1);
    }
  }

  function handleJanSelect(index: number) {
    setJanIndex(index);
    if (janStatuses[index] === 'aloittamatta') {
      setJanStatuses((prev) => {
        const n = [...prev];
        n[index] = 'kesken';
        return n;
      });
    }
  }

  // ── December handlers ───────────────────────────────────────────────────────
  function handleDecComplete() {
    const isLast = decIndex === decemberExercises.length - 1;
    setDecStatuses((prev) => {
      const n = [...prev];
      n[decIndex] = 'valmis';
      return n;
    });
    if (isLast) {
      setDecDone(true);
    } else {
      setDecIndex((i) => i + 1);
    }
  }

  function handleDecSelect(index: number) {
    setDecIndex(index);
    if (decStatuses[index] === 'aloittamatta') {
      setDecStatuses((prev) => {
        const n = [...prev];
        n[index] = 'kesken';
        return n;
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
          className={`demo-tab ${tab === 'marraskuu' ? 'demo-tab-active' : ''}`}
          onClick={() => setTab('marraskuu')}
        >
          Tositekirjaus — Marraskuu
        </button>
        <button
          className={`demo-tab ${tab === 'joulukuu' ? 'demo-tab-active' : ''}`}
          onClick={() => setTab('joulukuu')}
        >
          Tositekirjaus — Joulukuu
        </button>
        <button
          className={`demo-tab ${tab === 'tammikuu' ? 'demo-tab-active' : ''}`}
          onClick={() => setTab('tammikuu')}
        >
          Tositekirjaus — Tammikuu (ALV)
        </button>
      </div>

      {/* ── SANASTO ─────────────────────────────────────────────────────────── */}
      {tab === 'sanasto' && (
        <div className="demo-pane">
          <h1 className="demo-h1">Kirjanpidon perussanasto — Taso 1</h1>
          <p className="demo-lead">
            Harjoittele kirjanpidon perustermejä. Yhdistä kukin termi sitä vastaavaan määritelmään.
          </p>
          <VocabularyExercise phases={level1Vocabulary} />
        </div>
      )}

      {/* ── MARRASKUU — intro ────────────────────────────────────────────────── */}
      {tab === 'marraskuu' && !novIntroSeen && (
        <div className="demo-pane">
          <MonthIntro onStart={() => setNovIntroSeen(true)} />
        </div>
      )}

      {/* ── MARRASKUU — harjoitukset ─────────────────────────────────────────── */}
      {tab === 'marraskuu' && novIntroSeen && !novDone && (
        <div className="demo-pane demo-pane-split">
          <aside className="demo-sidebar">
            <ProgressTracker
              exercises={allNovemberExercises}
              statuses={novStatuses}
              currentIndex={novIndex}
              onSelect={handleNovSelect}
            />
          </aside>
          <div className="demo-exercise-area">
            <ExerciseFlow
              key={novIndex}
              exercise={allNovemberExercises[novIndex]}
              theme={theme}
              onComplete={handleNovComplete}
            />
          </div>
        </div>
      )}

      {/* ── MARRASKUU — koonti ───────────────────────────────────────────────── */}
      {tab === 'marraskuu' && novIntroSeen && novDone && (
        <div className="demo-pane">
          <NovemberSummary
            onRestart={() => {
              setNovDone(false);
              setNovIndex(0);
              setNovStatuses(allNovemberExercises.map(() => 'aloittamatta'));
            }}
            onNext={() => setTab('joulukuu')}
          />
        </div>
      )}

      {/* ── JOULUKUU — intro ────────────────────────────────────────────────── */}
      {tab === 'joulukuu' && !decIntroSeen && (
        <div className="demo-pane">
          <DecemberIntro onStart={() => setDecIntroSeen(true)} />
        </div>
      )}

      {/* ── JOULUKUU — harjoitukset ──────────────────────────────────────────── */}
      {tab === 'joulukuu' && decIntroSeen && !decDone && (
        <div className="demo-pane demo-pane-split">
          <aside className="demo-sidebar">
            <ProgressTracker
              exercises={decemberExercises}
              statuses={decStatuses}
              currentIndex={decIndex}
              onSelect={handleDecSelect}
            />
          </aside>
          <div className="demo-exercise-area">
            <ExerciseFlow
              key={decIndex}
              exercise={decemberExercises[decIndex]}
              theme={theme}
              onComplete={handleDecComplete}
            />
          </div>
        </div>
      )}

      {/* ── JOULUKUU — koonti ───────────────────────────────────────────────── */}
      {tab === 'joulukuu' && decIntroSeen && decDone && (
        <div className="demo-pane">
          <DecemberSummary
            onRestart={() => {
              setDecDone(false);
              setDecIndex(0);
              setDecStatuses(decemberExercises.map(() => 'aloittamatta'));
            }}
            onNext={() => setTab('tammikuu')}
          />
        </div>
      )}

      {/* ── TAMMIKUU — intro ─────────────────────────────────────────────────── */}
      {tab === 'tammikuu' && !janIntroSeen && (
        <div className="demo-pane">
          <JanuaryIntro onStart={() => setJanIntroSeen(true)} />
        </div>
      )}

      {/* ── TAMMIKUU — harjoitukset ──────────────────────────────────────────── */}
      {tab === 'tammikuu' && janIntroSeen && !janDone && (
        <div className="demo-pane demo-pane-split">
          <aside className="demo-sidebar">
            <ProgressTracker
              exercises={januaryExercises}
              statuses={janStatuses}
              currentIndex={janIndex}
              onSelect={handleJanSelect}
            />
          </aside>
          <div className="demo-exercise-area">
            <ExerciseFlow
              key={janIndex}
              exercise={januaryExercises[janIndex]}
              theme={theme}
              onComplete={handleJanComplete}
            />
          </div>
        </div>
      )}

      {/* ── TAMMIKUU — koonti ───────────────────────────────────────────────── */}
      {tab === 'tammikuu' && janIntroSeen && janDone && (
        <div className="demo-pane">
          <JanuarySummary
            onRestart={() => {
              setJanDone(false);
              setJanIndex(0);
              setJanStatuses(januaryExercises.map(() => 'aloittamatta'));
            }}
          />
        </div>
      )}
    </>
  );
}

// ─── November summary screen ───────────────────────────────────────────────────

const NOVEMBER_RECAP = [
  // Phase 1 — 8 tositetta
  { id: 'ys-001',           type: 'Yksityissijoitus',            debet: '1910 Pankkitili',                 kredit: '2080 Yksityistili',              note: '' },
  { id: 'yn-001',           type: 'Yksityisnosto',               debet: '2080 Yksityistili',               kredit: '1910 Pankkitili',                note: '' },
  { id: '2026-001',         type: 'Myyntilasku (PixelPro)',       debet: '1700 Myyntisaamiset',             kredit: '3000 Myynti, palvelumyynti',     note: '' },
  { id: 'kuitti-001',       type: 'Kuitti — toimistotarv.',       debet: '8400 Liiketoiminnan muut kulut',  kredit: '1910 Pankkitili',                note: '← ei 4000' },
  { id: 'ac-2611',          type: 'Ostolasku — PixelPro',         debet: '8390 Tietotekniikkakulut',        kredit: '1910 Pankkitili',                note: '' },
  { id: 'lp-1142',          type: 'Ostolasku — Langaton Piste',   debet: '8400 Liiketoiminnan muut kulut',  kredit: '2520 Ostovelat',                 note: '' },
  { id: 'tiliote-001',      type: 'Tiliote — myyntisuoritus',     debet: '1910 Pankkitili',                 kredit: '1700 Myyntisaamiset',            note: '' },
  { id: 'tiliote-002',      type: 'Tiliote — ostovelan maksu',    debet: '2520 Ostovelat',                  kredit: '1910 Pankkitili',                note: '' },
  // Phase 2 — 9 tositetta
  { id: '2026-002',         type: 'Myyntilasku (Aalto)',          debet: '1700 Myyntisaamiset',             kredit: '3000 Myynti, palvelumyynti',     note: '' },
  { id: 'kuitti-tankki24',  type: 'Kuitti — polttoaine',          debet: '8400 Liiketoiminnan muut kulut',  kredit: '1910 Pankkitili',                note: '' },
  { id: '2026-003',         type: 'Myyntilasku (Vehka)',          debet: '1700 Myyntisaamiset',             kredit: '3000 Myynti, palvelumyynti',     note: '' },
  { id: 'kuitti-halpa',     type: 'Kuitti — tarralappuja',        debet: '4000 Aineet ja tarvikkeet',       kredit: '1910 Pankkitili',                note: '← myyntiin!' },
  { id: 'tx-779',           type: 'Ostolasku — TyöterveysX',      debet: '8400 Liiketoiminnan muut kulut',  kredit: '2520 Ostovelat',                 note: '' },
  { id: 'yn-002',           type: 'Yksityisnosto',                debet: '2080 Yksityistili',               kredit: '1910 Pankkitili',                note: '' },
  { id: '2026-004',         type: 'Myyntilasku (Tähti)',          debet: '1700 Myyntisaamiset',             kredit: '3000 Myynti, palvelumyynti',     note: '' },
  { id: 'tiliote-003',      type: 'Tiliote — myyntisuoritus',     debet: '1910 Pankkitili',                 kredit: '1700 Myyntisaamiset',            note: '' },
  { id: 'kuitti-netcom',    type: 'Kuitti — NetCom 4G',           debet: '8390 Tietotekniikkakulut',        kredit: '1910 Pankkitili',                note: '' },
];

function NovemberSummary({
  onRestart,
  onNext,
}: {
  onRestart: () => void;
  onNext: () => void;
}) {
  return (
    <div className="ns-root">
      <div className="ns-hero">
        <div className="ns-hero-icon">✓</div>
        <h2 className="ns-hero-title">Marraskuun kirjaukset valmis!</h2>
        <p className="ns-hero-sub">Kati Mäkisen tmi — 17 tositetta kirjattu</p>
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
                <td className="ns-td">
                  {r.debet}
                  {r.note && <span className="ns-note"> {r.note}</span>}
                </td>
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
            <p className="ns-compare-example">
              Esim. Katin tarralappuja asiakkaan pakettiin, printterimusteet asiakkaan
              aineistoa varten, pakkausmateriaalit toimitettavaan tuotteeseen.
            </p>
          </div>
          <div className="ns-compare-card ns-compare-8400">
            <div className="ns-compare-account">8400 Liiketoiminnan muut kulut</div>
            <p className="ns-compare-rule">
              <strong>Yleiskulu</strong> — kulu ei vaikuta suoraan liikevaihtoon eikä
              päädy asiakkaan tuotteeseen.
            </p>
            <p className="ns-compare-example">
              Esim. toimistotarvikkeet omaan käyttöön, polttoaine, postimaksut,
              vuokra, vakuutukset, koulutus.
            </p>
          </div>
        </div>
        <p className="ns-compare-tip">
          Katin tarralappuja myydään asiakkaalle → <strong>4000</strong>.
          Toimistokynät omaan käyttöön → <strong>8400</strong>.
        </p>
      </div>

      {/* Opening balances preview */}
      <div className="ns-section">
        <h3 className="ns-section-title">Joulukuun alkusaldot</h3>
        <p className="ns-balances-intro">
          Marraskuun avoimet erät siirtyvät joulukuun alkusaldoiksi. Nämä näkyvät
          joulukuun tositteissa:
        </p>
        <table className="ns-table ns-balances-table">
          <thead>
            <tr>
              <th className="ns-th">Tili</th>
              <th className="ns-th ns-th-right">Saldo</th>
              <th className="ns-th">Selitys</th>
            </tr>
          </thead>
          <tbody>
            <tr className="ns-tr">
              <td className="ns-td">1910 Pankkitili</td>
              <td className="ns-td ns-td-right ns-balance-pos">6 199,10 €</td>
              <td className="ns-td ns-td-muted">Kumulatiivinen saldo</td>
            </tr>
            <tr className="ns-tr">
              <td className="ns-td">1700 Myyntisaamiset</td>
              <td className="ns-td ns-td-right ns-balance-pos">2 900,00 €</td>
              <td className="ns-td ns-td-muted">Avoin: 2026-003 ja 2026-004</td>
            </tr>
            <tr className="ns-tr">
              <td className="ns-td">2520 Ostovelat</td>
              <td className="ns-td ns-td-right ns-balance-neg">351,40 €</td>
              <td className="ns-td ns-td-muted">Avoin: TX-779 (TyöterveysX)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ns-actions">
        <button className="ns-restart-btn" onClick={onRestart}>
          Aloita marraskuu uudelleen
        </button>
        <button className="ns-next-btn" onClick={onNext}>
          Siirry joulukuuhun →
        </button>
      </div>
    </div>
  );
}

// ─── December intro screen ─────────────────────────────────────────────────────

function DecemberIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="month-intro">
      <div className="month-intro-icon">📋</div>
      <h2 className="month-intro-title">Joulukuu 2026</h2>
      <div className="month-intro-story">
        <p>
          Marraskuu on kirjattu — hyvä työ! Nyt avautuu joulukuu. Katin yritys on
          kasvanut: hän ottaa vastaan edelleenveloitustöitä, joissa tilaa palvelun
          alihankkijalta ja laskuttaa sen eteenpäin asiakkaalle.
        </p>
        <p>
          Joulukuun alussa kirjanpidossa näkyy marraskuun <strong>avoimet erät</strong>:
          kaksi maksamatonta myyntilaskua (myyntisaamiset) ja yksi maksamaton ostolasku
          (ostovelka). Nämä sulkeutuvat, kun maksut saapuvat tilioteelle.
        </p>
        <p>
          Uutena tilinä tulee <strong>4500 Ulkopuoliset palvelut</strong> — kun Kati
          tilaa painotyön alihankkijalta suoraan asiakkaan toimeksiantoon.
        </p>
      </div>
      <div className="month-intro-meta">
        <span>📅 Joulukuu 2026</span>
        <span>🏢 Asiakas Tmi — Kati Mäkinen</span>
        <span>🏦 Nide Bank</span>
      </div>
      <div className="dec-intro-balances">
        <div className="dec-intro-balances-title">Alkusaldot 1.12.2026</div>
        <div className="dec-intro-balance-row">
          <span className="dec-intro-balance-account">1910 Pankkitili</span>
          <span className="dec-intro-balance-amount dec-intro-pos">6 199,10 €</span>
        </div>
        <div className="dec-intro-balance-row">
          <span className="dec-intro-balance-account">1700 Myyntisaamiset</span>
          <span className="dec-intro-balance-amount dec-intro-pos">2 900,00 €</span>
        </div>
        <div className="dec-intro-balance-row">
          <span className="dec-intro-balance-account">2520 Ostovelat</span>
          <span className="dec-intro-balance-amount dec-intro-neg">351,40 €</span>
        </div>
      </div>
      <button className="month-intro-btn" onClick={onStart}>
        Aloita joulukuun kirjaukset →
      </button>
    </div>
  );
}

// ─── December summary screen ───────────────────────────────────────────────────

function DecemberSummary({ onRestart, onNext }: { onRestart: () => void; onNext?: () => void }) {
  return (
    <div className="ns-root">
      <div className="ns-hero ns-hero-dec">
        <div className="ns-hero-icon">🎄</div>
        <h2 className="ns-hero-title">Joulukuun kirjaukset valmis!</h2>
        <p className="ns-hero-sub">Kati Mäkisen tmi — marraskuu + joulukuu kirjattu</p>
      </div>

      <div className="ns-section">
        <h3 className="ns-section-title">Mitä opit joulukuussa?</h3>
        <div className="ns-compare">
          <div className="ns-compare-card ns-compare-4000">
            <div className="ns-compare-account">4500 Ulkopuoliset palvelut</div>
            <p className="ns-compare-rule">
              <strong>Muuttuva kulu</strong> — alihankkijalta ostettu palvelu, joka
              kuuluu suoraan asiakkaan toimeksiantoon.
            </p>
            <p className="ns-compare-example">
              Esim. Painotalo Vireen tilattu painotyö Katin asiakkaan esitteeseen.
              Kati laskuttaa sen eteenpäin (edelleenveloitus).
            </p>
          </div>
          <div className="ns-compare-card ns-compare-8400">
            <div className="ns-compare-account">Edelleenveloitus</div>
            <p className="ns-compare-rule">
              <strong>3 riviä</strong> — myyntilasku kirjataan palvelumyynnin
              (3000) ja edelleenveloituksen (3010) tileille erikseen.
            </p>
            <p className="ns-compare-example">
              1700 Myyntisaamiset D / 3000 Myynti K + 3010 Edelleenveloitus K
            </p>
          </div>
        </div>
      </div>

      <div className="ns-actions">
        <button className="ns-restart-btn" onClick={onRestart}>
          Aloita joulukuu uudelleen
        </button>
        {onNext && (
          <button className="ns-next-btn" onClick={onNext}>
            Siirry tammikuuhun (ALV) →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── January intro screen ──────────────────────────────────────────────────────

function JanuaryIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="month-intro">
      <div className="month-intro-icon">🧾</div>
      <h2 className="month-intro-title">Tammikuu 2027 — ALV alkaa</h2>
      <div className="month-intro-story">
        <p>
          Katin yritys on kasvanut — marraskuun ja joulukuun yhteisliikevaihto ylitti{' '}
          <strong>20 000 €:n rajan</strong>. AVL:n (arvonlisäverolain) mukaan Kati rekisteröityy
          ALV-velvolliseksi tammikuun alusta.
        </p>
        <p>
          Tammikuusta lähtien <strong>kaikki laskut sisältävät ALV:n</strong>. Myyntilaskuihin
          lisätään 25,5 % ALV, joka tilitetään Verohallinnolle. Ostolaskujen ALV on
          vähennyskelpoinen — Kati saa vähentää sen myyntiensä ALV:sta.
        </p>
        <p>
          Jokainen ALV:llinen kirjaus tarvitsee <strong>kolme riviä</strong>: myynneissä
          myyntisaamiset (brutto) + myynti (netto) + suoritettava ALV. Ostoissa kulutili
          (netto) + vähennettävä ALV + ostovelka tai pankki (brutto).
        </p>
      </div>
      <div className="month-intro-meta">
        <span>📅 Tammikuu 2027</span>
        <span>🏢 Asiakas Tmi — Kati Mäkinen</span>
        <span>🏦 Nide Bank</span>
      </div>
      <div className="jan-intro-alv-box">
        <div className="jan-intro-alv-title">ALV-tilit käyttöön</div>
        <div className="jan-intro-alv-row">
          <span className="jan-intro-alv-num">2871</span>
          <span className="jan-intro-alv-name">Suoritettava ALV myynneistä</span>
          <span className="jan-intro-alv-side jan-alv-k">Kredit myynnissä</span>
        </div>
        <div className="jan-intro-alv-row">
          <span className="jan-intro-alv-num">2920</span>
          <span className="jan-intro-alv-name">Vähennettävä ALV ostoista</span>
          <span className="jan-intro-alv-side jan-alv-d">Debet ostoissa</span>
        </div>
        <div className="jan-intro-alv-row">
          <span className="jan-intro-alv-num">2870</span>
          <span className="jan-intro-alv-name">ALV-velka</span>
          <span className="jan-intro-alv-side jan-alv-k">Tilityksen tulos</span>
        </div>
      </div>
      <button className="month-intro-btn" onClick={onStart}>
        Aloita tammikuun kirjaukset →
      </button>
    </div>
  );
}

// ─── January summary screen ────────────────────────────────────────────────────

function JanuarySummary({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="ns-root">
      <div className="ns-hero ns-hero-jan">
        <div className="ns-hero-icon">🧾</div>
        <h2 className="ns-hero-title">Tammikuun kirjaukset valmis!</h2>
        <p className="ns-hero-sub">ALV-sykli kk 1: myynti → tilitys → maksu</p>
      </div>

      <div className="ns-section">
        <h3 className="ns-section-title">ALV-kirjausten kaavat</h3>
        <div className="ns-compare">
          <div className="ns-compare-card ns-compare-4000">
            <div className="ns-compare-account">Myyntilasku ALV:lla</div>
            <p className="ns-compare-rule">
              <strong>3 riviä:</strong> myyntisaamiset koko summa (D) /
              veroton myynti (K) + suoritettava ALV 2871 (K)
            </p>
            <p className="ns-compare-example">
              1700 D 1 506 / 3000 K 1 200 / 2871 K 306
            </p>
          </div>
          <div className="ns-compare-card ns-compare-8400">
            <div className="ns-compare-account">Ostolasku / kuitti ALV:lla</div>
            <p className="ns-compare-rule">
              <strong>3 riviä:</strong> kulutili veroton (D) + ALV-vähennys 2920 (D) /
              ostovelka tai pankki koko summa (K)
            </p>
            <p className="ns-compare-example">
              8400 D 40 / 2920 D 10,20 / 1910 K 50,20
            </p>
          </div>
        </div>
      </div>

      <div className="ns-section">
        <h3 className="ns-section-title">ALV-sykli kuukauden lopussa</h3>
        <table className="ns-table">
          <thead>
            <tr>
              <th className="ns-th">Toimenpide</th>
              <th className="ns-th">Kirjaus</th>
            </tr>
          </thead>
          <tbody>
            <tr className="ns-tr">
              <td className="ns-td ns-td-type">ALV-tilitys (kk lopussa)</td>
              <td className="ns-td">2871 D / 2920 K / 2870 K (netto velka)</td>
            </tr>
            <tr className="ns-tr">
              <td className="ns-td ns-td-type">ALV-maksu (12. seuraavaa kk)</td>
              <td className="ns-td">2870 D / 1910 K</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ns-actions">
        <button className="ns-restart-btn" onClick={onRestart}>
          Aloita tammikuu uudelleen
        </button>
      </div>
    </div>
  );
}
