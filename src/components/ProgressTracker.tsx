'use client';

import type { DocumentStatus, DocumentExercise } from '@/types/exercises';

const STATUS_ICON: Record<DocumentStatus, string> = {
  aloittamatta: '⚪',
  kesken:       '🟡',
  valmis:       '✅',
  ohitettu:     '⚠️',
};

const STATUS_LABEL: Record<DocumentStatus, string> = {
  aloittamatta: 'Aloittamatta',
  kesken:       'Kesken',
  valmis:       'Valmis',
  ohitettu:     'Ohitettu',
};

interface ProgressTrackerProps {
  exercises: DocumentExercise[];
  statuses: DocumentStatus[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function ProgressTracker({ exercises, statuses, currentIndex, onSelect }: ProgressTrackerProps) {
  return (
    <nav className="progress-tracker" aria-label="Tositteen edistyminen">
      <div className="pt-header">Tositteet</div>
      <ol className="pt-list">
        {exercises.map((ex, i) => {
          const status = statuses[i] ?? 'aloittamatta';
          const isCurrent = i === currentIndex;
          return (
            <li key={ex.template.id}>
              <button
                className={`pt-item ${isCurrent ? 'pt-item-active' : ''} pt-item-${status}`}
                onClick={() => onSelect(i)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Tosite ${i + 1}: ${STATUS_LABEL[status]}`}
              >
                <span className="pt-icon">{STATUS_ICON[status]}</span>
                <span className="pt-label">
                  <span className="pt-num">{i + 1}.</span>
                  <span className="pt-type">{ex.template.type.replace('yksityis', 'Yks. ').replace('tosite', '').replace('lasku', 'lasku')}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="pt-summary">
        {statuses.filter((s) => s === 'valmis').length} / {exercises.length} valmis
      </div>
    </nav>
  );
}
