'use client';

import { useState } from 'react';
import { VocabularyExercise } from '@/components/VocabularyExercise';
import { ExerciseFlow } from '@/components/ExerciseFlow';
import { ProgressTracker } from '@/components/ProgressTracker';
import { level1Vocabulary } from '@/data/vocabulary/level-1';
import { novemberPhase1Exercises } from '@/data/exercises/november-phase1';
import { useTheme } from '@/hooks/useTheme';
import type { DocumentStatus } from '@/types/exercises';

type Tab = 'sanasto' | 'tositekirjaus';

export function DemoTabs() {
  const [tab, setTab] = useState<Tab>('sanasto');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statuses, setStatuses] = useState<DocumentStatus[]>(
    novemberPhase1Exercises.map(() => 'aloittamatta'),
  );
  const { theme } = useTheme();

  function handleComplete() {
    setStatuses((prev) => {
      const next = [...prev];
      next[currentIndex] = 'valmis';
      return next;
    });
    if (currentIndex < novemberPhase1Exercises.length - 1) {
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

      {tab === 'tositekirjaus' && (
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
    </>
  );
}
