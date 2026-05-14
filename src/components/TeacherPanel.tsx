'use client';

import { useEffect } from 'react';
import { useTeacher, ALL_TABS } from '@/contexts/TeacherContext';
import type { TabId } from '@/contexts/TeacherContext';

const TAB_LABELS: Record<TabId, string> = {
  sanasto:    'Sanasto',
  marraskuu:  'Marraskuu',
  joulukuu:   'Joulukuu',
  tammikuu:   'Tammikuu (ALV)',
  helmikuu:   'Helmikuu (Taso 2)',
  raportit:   'Raportit',
};

const LEVEL_LABELS: Record<number, string> = {
  1: 'Taso 1 — Peruskirjanpito',
  2: 'Taso 2 — ALV & käyttöomaisuus',
  3: 'Taso 3 — Palkat & KV',
  4: 'Taso 4 — Konserni & valuutta',
};

interface TeacherPanelProps {
  open: boolean;
  onClose: () => void;
}

export function TeacherPanel({ open, onClose }: TeacherPanelProps) {
  const { visibleTabs, setVisibleTabs, activeLevel, setActiveLevel } = useTeacher();

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

  function toggleTab(tab: TabId) {
    if (visibleTabs.includes(tab)) {
      // keep at least one tab
      if (visibleTabs.length === 1) return;
      setVisibleTabs(visibleTabs.filter((t) => t !== tab));
    } else {
      // insert in original order
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
            Demo-versio — asetukset eivät tallennu.
            Autentikointi ja tietokanta tuleva iteraatiossa 7.
          </div>
        </div>
      </aside>
    </>
  );
}
