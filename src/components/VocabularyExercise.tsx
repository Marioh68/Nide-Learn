'use client';

import { useCallback, useMemo, useState } from 'react';
import type { VocabularyPhase, VocabularyPair } from '@/data/vocabulary/level-1';

// ─── Colour palette for matched pairs (cycles through 5 colours) ──────────────
const PAIR_COLORS = [
  { bg: '#d4edda', border: '#28a745', text: '#155724' },
  { bg: '#cce5ff', border: '#004085', text: '#004085' },
  { bg: '#fff3cd', border: '#856404', text: '#533f03' },
  { bg: '#f8d7da', border: '#721c24', text: '#721c24' },
  { bg: '#e2d9f3', border: '#6c3fc7', text: '#4b2b8f' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type MatchedPair = {
  termId: string;
  colorIndex: number;
};

// ─── Utility: shuffle array (Fisher-Yates) ───────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Phase view ───────────────────────────────────────────────────────────────
function PhaseView({
  phase,
  onComplete,
}: {
  phase: VocabularyPhase;
  onComplete: () => void;
}) {
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [matched, setMatched] = useState<MatchedPair[]>([]);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

  const shuffledTerms = useMemo(() => shuffle(phase.pairs), [phase.pairs]);
  const shuffledDefs = useMemo(() => shuffle(phase.pairs), [phase.pairs]);

  const matchedIds = matched.map((m) => m.termId);
  const colorOf = (termId: string) =>
    PAIR_COLORS[matched.findIndex((m) => m.termId === termId) % PAIR_COLORS.length];

  const handleTermClick = useCallback(
    (pairId: string) => {
      if (matchedIds.includes(pairId)) return;
      setSelectedTermId((prev) => (prev === pairId ? null : pairId));
      setWrongFlash(null);
    },
    [matchedIds],
  );

  const handleDefClick = useCallback(
    (pairId: string) => {
      if (matchedIds.includes(pairId)) return;
      if (!selectedTermId) return;

      if (selectedTermId === pairId) {
        // Correct
        const colorIndex = matched.length % PAIR_COLORS.length;
        setMatched((prev) => [...prev, { termId: pairId, colorIndex }]);
        setSelectedTermId(null);
        setWrongFlash(null);
      } else {
        // Wrong — flash the definition
        setWrongFlash(pairId);
        setTimeout(() => setWrongFlash(null), 600);
      }
    },
    [selectedTermId, matchedIds, matched.length],
  );

  const allMatched = matched.length === phase.pairs.length;

  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-muted)',
          fontSize: '0.9rem',
          marginBottom: '20px',
        }}
      >
        {phase.intro}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {/* Terms column */}
        <div
          role="list"
          aria-label="Termit"
          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px',
            }}
          >
            Termit
          </div>
          {shuffledTerms.map((pair) => {
            const isMatched = matchedIds.includes(pair.id);
            const isSelected = selectedTermId === pair.id;
            const color = isMatched ? colorOf(pair.id) : null;

            return (
              <button
                key={pair.id}
                role="listitem"
                onClick={() => handleTermClick(pair.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTermClick(pair.id);
                  }
                }}
                disabled={isMatched}
                aria-pressed={isSelected}
                aria-label={`Termi: ${pair.term}${isMatched ? ' (yhdistetty)' : ''}`}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: isMatched
                    ? `2px solid ${color!.border}`
                    : isSelected
                      ? '2px solid var(--color-primary)'
                      : '2px solid var(--color-border)',
                  background: isMatched
                    ? color!.bg
                    : isSelected
                      ? 'var(--color-secondary)'
                      : 'var(--color-surface)',
                  color: isMatched ? color!.text : 'var(--color-text)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: isSelected ? 600 : 400,
                  textAlign: 'left',
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 120ms ease',
                  outline: 'none',
                  boxShadow: isSelected ? '0 0 0 3px var(--color-primary)33' : 'none',
                }}
              >
                {pair.term}
              </button>
            );
          })}
        </div>

        {/* Definitions column */}
        <div
          role="list"
          aria-label="Määritelmät"
          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px',
            }}
          >
            Määritelmät
          </div>
          {shuffledDefs.map((pair) => {
            const isMatched = matchedIds.includes(pair.id);
            const isWrong = wrongFlash === pair.id;
            const color = isMatched ? colorOf(pair.id) : null;

            return (
              <div key={pair.id}>
                <button
                  role="listitem"
                  onClick={() => handleDefClick(pair.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDefClick(pair.id);
                    }
                  }}
                  disabled={isMatched || !selectedTermId}
                  aria-label={`Määritelmä: ${pair.definition}${isMatched ? ' (yhdistetty)' : ''}`}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isMatched
                      ? `2px solid ${color!.border}`
                      : isWrong
                        ? '2px solid var(--color-error)'
                        : '2px solid var(--color-border)',
                    background: isMatched
                      ? color!.bg
                      : isWrong
                        ? 'var(--color-error-bg)'
                        : selectedTermId && !isMatched
                          ? 'var(--color-surface)'
                          : 'var(--color-surface)',
                    color: isMatched ? color!.text : isWrong ? 'var(--color-error)' : 'var(--color-text)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    cursor: isMatched || !selectedTermId ? 'default' : 'pointer',
                    width: '100%',
                    transition: 'all 120ms ease',
                    outline: 'none',
                    lineHeight: 1.4,
                    display: 'block',
                  }}
                >
                  {pair.definition}
                </button>

                {/* Example shown after matching */}
                {isMatched && (
                  <div style={{ marginTop: '4px' }}>
                    <button
                      onClick={() =>
                        setExpandedExample((prev) => (prev === pair.id ? null : pair.id))
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '2px 4px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)',
                        textDecoration: 'underline',
                      }}
                    >
                      {expandedExample === pair.id ? 'Piilota esimerkki' : 'Näytä esimerkki'}
                    </button>
                    {expandedExample === pair.id && (
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-muted)',
                          fontStyle: 'italic',
                          padding: '6px 10px',
                          background: 'var(--color-surface-raised)',
                          borderRadius: 'var(--radius-sm)',
                          margin: '4px 0 0 0',
                          lineHeight: 1.5,
                        }}
                      >
                        {pair.example}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* All matched — progress indicator */}
      {allMatched && (
        <div
          style={{
            background: 'var(--color-success-bg)',
            border: '1px solid var(--color-success)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-success)',
              fontWeight: 600,
            }}
          >
            Kaikki parit yhdistetty!
          </span>
          <button
            onClick={onComplete}
            autoFocus
            style={{
              padding: '8px 18px',
              background: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
              border: 'none',
              borderRadius: 'var(--radius-btn)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Seuraava erä →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Results screen ───────────────────────────────────────────────────────────
function ResultsScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--color-text)',
          marginBottom: '8px',
        }}
      >
        Harjoitus valmis!
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-muted)',
          marginBottom: '24px',
          fontSize: '1rem',
        }}
      >
        Olet käynyt läpi kaikki 15 kirjanpidon perustermiä.
      </p>
      <button
        onClick={onRetry}
        style={{
          padding: '10px 24px',
          background: 'var(--color-primary)',
          color: 'var(--color-primary-foreground)',
          border: 'none',
          borderRadius: 'var(--radius-btn)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Aloita uudelleen
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function VocabularyExercise({ phases }: { phases: VocabularyPhase[] }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [done, setDone] = useState(false);
  // Key used to remount phase when restarting
  const [runKey, setRunKey] = useState(0);

  const handlePhaseComplete = () => {
    if (phaseIndex + 1 < phases.length) {
      setPhaseIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  };

  const handleRetry = () => {
    setPhaseIndex(0);
    setDone(false);
    setRunKey((k) => k + 1);
  };

  const currentPhase = phases[phaseIndex];

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: 0,
            }}
          >
            {done ? 'Sanastoharjoitus' : currentPhase.title}
          </h2>
          {!done && (
            <span
              aria-label={`Erä ${phaseIndex + 1} / ${phases.length}`}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                background: 'var(--color-surface-raised)',
                padding: '2px 10px',
                borderRadius: '999px',
              }}
            >
              Erä {phaseIndex + 1} / {phases.length}
            </span>
          )}
        </div>

        {/* Progress dots */}
        {!done && (
          <div
            role="progressbar"
            aria-valuenow={phaseIndex + 1}
            aria-valuemin={1}
            aria-valuemax={phases.length}
            aria-label={`Edistyminen: erä ${phaseIndex + 1} kolmesta`}
            style={{ display: 'flex', gap: '6px' }}
          >
            {phases.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 4,
                  borderRadius: 2,
                  background: i <= phaseIndex ? 'var(--color-primary)' : 'var(--color-border)',
                  transition: 'background 200ms ease',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {done ? (
        <ResultsScreen onRetry={handleRetry} />
      ) : (
        <PhaseView
          key={`${runKey}-${phaseIndex}`}
          phase={currentPhase}
          onComplete={handlePhaseComplete}
        />
      )}
    </div>
  );
}
