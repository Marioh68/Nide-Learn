'use client';

import { useState } from 'react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { DemoTabs } from '@/components/DemoTabs';
import { TeacherPanel } from '@/components/TeacherPanel';
import { TeacherProvider } from '@/contexts/TeacherContext';

function Inner() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [teacherAuth, setTeacherAuth] = useState(false);

  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="page-logo">Nide Learn</span>
        <div className="page-header-actions">
          <ThemeSwitcher />
          <button
            className={`tp-toggle-btn ${teacherAuth ? 'tp-toggle-authed' : ''}`}
            onClick={() => setPanelOpen(true)}
            aria-label="Avaa opettajan asetukset"
          >
            Opettaja
          </button>
        </div>
      </header>
      <main className="page-main">
        <DemoTabs />
      </main>
      <TeacherPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        authenticated={teacherAuth}
        onAuthenticated={() => setTeacherAuth(true)}
      />
    </div>
  );
}

export function PageContent() {
  return (
    <TeacherProvider>
      <Inner />
    </TeacherProvider>
  );
}
