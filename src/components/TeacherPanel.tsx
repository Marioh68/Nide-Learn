'use client';

import { useEffect, useState } from 'react';
import { useTeacher, ALL_TABS } from '@/contexts/TeacherContext';
import { verifyTeacherPassword } from '@/actions/teacher';
import type { TabId } from '@/contexts/TeacherContext';

const TAB_LABELS: Record<TabId, string> = {
  sanasto:    'Sanasto',
  marraskuu:  'Marraskuu',
  joulukuu:   'Joulukuu',
  tammikuu:   'Tammikuu (ALV)',
  helmikuu:   'Helmikuu (Taso 2)',
  maaliskuu:  'Maaliskuu (Taso 3)',
  paivakirja: 'Päiväkirja',
  raportit:   'Raportit',
};

const LEVEL_LABELS: Record<number, string> = {
  1: 'Taso 1 — Peruskirjanpito',
  2: 'Taso 2 — ALV & käyttöomaisuus',
  3: 'Taso 3 — Palkat & sotumaksut',
  4: 'Taso 4 — Konserni & valuutta',
};

interface TeacherPanelProps {
  open: boolean;
  onClose: () => void;
  authenticated: boolean;
  onAuthenticated: () => void;
}

export function TeacherPanel({ open, onClose, authenticated, onAuthenticated }: TeacherPanelProps) {
  const { visibleTabs, setVisibleTabs, activeLevel, setActiveLevel } = useTeacher();
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [checking, setChecking] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setAuthError(false);
    const ok = await verifyTeacherPassword(password);
    setChecking(false);
    if (ok) {
      setPassword('');
      onAuthenticated();
    } else {
      setAuthError(true);
    }
  }

  function toggleTab(tab: TabId) {
    if (visibleTabs.includes(tab)) {
      if (visibleTabs.length === 1) return;
      setVisibleTabs(visibleTabs.filter((t) => t !== tab));
    } else {
      setVisibleTabs(ALL_TABS.filter((t) => visibleTabs.includes(t) || t === tab));
    }
  }

  return (
    <>
      <div className="tp-backdrop" onClick={onClose} aria-hidden />
      <aside className="tp-panel" role="dialog" aria-label="Opettajan asetukset">
        <div className="tp-header">
          <span className="tp-header-title">Opettajan asetukset</span>
          <button className="tp-close-btn" onClick={onClose} aria-label="Sulje paneeli">✕</button>
        </div>

        {!authenticated ? (
          <div className="tp-body">
            <form className="tp-auth-form" onSubmit={handleAuth}>
              <div className="tp-auth-title">Opettajan kirjautuminen</div>
              <p className="tp-auth-desc">
                Syötä opettajan salasana aktivoidaksesi asetukset.
              </p>
              <input
                type="password"
                className="tp-auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Salasana"
                aria-label="Opettajan salasana"
                autoFocus
              />
              {authError && (
                <p className="tp-auth-error">Väärä salasana.</p>
              )}
              <button
                type="submit"
                className="tp-auth-submit"
                disabled={checking || !password}
              >
                {checking ? 'Tarkistetaan…' : 'Kirjaudu'}
              </button>
            </form>
          </div>
        ) : (
          <div className="tp-body">
            {/* Visible tabs */}
            <section className="tp-section">
              <div className="tp-section-title">Näkyvät välilehdet</div>
              {ALL_TABS.map((tab) => (
                <label key={tab} className="tp-tab-row">
                  <input
                    type="checkbox"
                    className="tp-checkbox"
                    checked={visibleTabs.includes(tab)}
                    onChange={() => toggleTab(tab)}
                  />
                  <span className="tp-tab-label">{TAB_LABELS[tab]}</span>
                </label>
              ))}
            </section>

            {/* Active level */}
            <section className="tp-section">
              <div className="tp-section-title">Aktiivinen taso</div>
              <div className="tp-level-grid">
                {([1, 2, 3, 4] as const).map((level) => (
                  <button
                    key={level}
                    className={`tp-level-btn ${activeLevel === level ? 'tp-level-active' : ''}`}
                    onClick={() => setActiveLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="tp-level-desc">{LEVEL_LABELS[activeLevel]}</p>
            </section>

            <div className="tp-notice">
              Demo-versio — asetukset eivät tallennu sivun päivityksen jälkeen.
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
