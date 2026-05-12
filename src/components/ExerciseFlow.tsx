'use client';

import { useState } from 'react';
import { DocumentCard } from '@/components/DocumentCard';
import { LedgerGrid } from '@/components/LedgerGrid';
import { JournalEntryForm } from '@/components/JournalEntryForm';
import { MicroContent } from '@/components/MicroContent';
import { checkExercise } from '@/lib/checkExercise';
import { getMicroContent } from '@/data/microcontent/level-1-a';
import type { DocumentExercise, StudentEntry, CheckResult, ExerciseStep } from '@/types/exercises';
import type { Theme } from '@/components/ThemeProvider';

interface ExerciseFlowProps {
  exercise: DocumentExercise;
  theme: Theme;
  onComplete: () => void;
}

interface StepState {
  entries: StudentEntry[];
  attempts: number;
  result: CheckResult | null;
}

const EMPTY_STEP: StepState = { entries: [], attempts: 0, result: null };

export function ExerciseFlow({ exercise, theme, onComplete }: ExerciseFlowProps) {
  const [step, setStep] = useState<ExerciseStep>('document');
  const [ledger, setLedger] = useState<StepState>(EMPTY_STEP);
  const [journal, setJournal] = useState<StepState>(EMPTY_STEP);
  const [microContentId, setMicroContentId] = useState<string | null>(null);

  const { template, correctEntries, errorMessages, orientationQuestion, explanation } = exercise;
  const activeMicroContent = microContentId ? getMicroContent(microContentId) : null;

  function openMicroContent(id: string | undefined) {
    if (id) setMicroContentId(id);
  }

  function checkLedger() {
    const attempts = ledger.attempts + 1;
    const result = checkExercise(ledger.entries, correctEntries, errorMessages, attempts);
    setLedger((s) => ({ ...s, attempts, result }));
    if (!result.correct && attempts >= 3) openMicroContent(result.errors[0]?.microContentId);
  }

  function checkJournal() {
    const attempts = journal.attempts + 1;
    const result = checkExercise(journal.entries, correctEntries, errorMessages, attempts);
    setJournal((s) => ({ ...s, attempts, result }));
    if (!result.correct && attempts >= 3) openMicroContent(result.errors[0]?.microContentId);
  }

  return (
    <div className="ef-root">
      {/* ── Step content ── */}
      {step === 'document' && (
        <div className="ef-step">
          <DocumentCard template={template} />
          {orientationQuestion && (
            <div className="ef-orientation">
              <p className="ef-orientation-q">{orientationQuestion}</p>
            </div>
          )}
          <div className="ef-actions">
            <button className="ef-btn-primary" onClick={() => setStep('ledger')}>
              Siirry kirjaukseen →
            </button>
          </div>
        </div>
      )}

      {step === 'ledger' && (
        <div className="ef-step">
          <div className="ef-step-header">
            <span className="ef-step-badge">Vaihe 1 / 2</span>
            <h3 className="ef-step-title">Kirjaa tiliristikkoon</h3>
          </div>
          <DocumentCard template={template} />

          <LedgerGrid
            monthOffset={template.monthOffset}
            entries={ledger.entries}
            onChange={(entries) => setLedger((s) => ({ ...s, entries, result: null }))}
            disabled={ledger.result?.correct === true}
          />

          {ledger.result && <FeedbackPanel result={ledger.result} />}

          {ledger.result?.correct ? (
            <div className="ef-actions">
              <p className="ef-correct-msg">✓ Tiliristikko oikein!</p>
              <button className="ef-btn-primary" onClick={() => setStep('journal')}>
                Jatka muistiotosite →
              </button>
            </div>
          ) : (
            <div className="ef-actions">
              {ledger.attempts < 4 ? (
                <button className="ef-btn-primary" onClick={checkLedger} disabled={ledger.entries.length === 0}>
                  Tarkista
                </button>
              ) : (
                <button className="ef-btn-secondary" onClick={() => {
                  setLedger((s) => ({
                    ...s,
                    entries: correctEntries.map((ce, i) => ({ ...ce, id: `ans-${i}` })),
                    result: { correct: true, errors: [] },
                  }));
                }}>
                  Näytä vastaus
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {step === 'journal' && (
        <div className="ef-step">
          <div className="ef-step-header">
            <span className="ef-step-badge">Vaihe 2 / 2</span>
            <h3 className="ef-step-title">Kirjaa muistiotosite</h3>
          </div>
          <DocumentCard template={template} />

          <JournalEntryForm
            monthOffset={template.monthOffset}
            entries={journal.entries}
            onChange={(entries) => setJournal((s) => ({ ...s, entries, result: null }))}
            theme={theme}
            disabled={journal.result?.correct === true}
          />

          {journal.result && <FeedbackPanel result={journal.result} />}

          {journal.result?.correct ? (
            <div className="ef-actions">
              <p className="ef-correct-msg">✓ Muistiotosite oikein!</p>
              <button className="ef-btn-primary" onClick={() => setStep('explanation')}>
                Lue selitys →
              </button>
            </div>
          ) : (
            <div className="ef-actions">
              {journal.attempts < 4 ? (
                <button className="ef-btn-primary" onClick={checkJournal} disabled={journal.entries.length === 0}>
                  Tarkista
                </button>
              ) : (
                <button className="ef-btn-secondary" onClick={() => {
                  setJournal((s) => ({
                    ...s,
                    entries: correctEntries.map((ce, i) => ({ ...ce, id: `ans-j-${i}` })),
                    result: { correct: true, errors: [] },
                  }));
                }}>
                  Näytä vastaus
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {step === 'explanation' && (
        <div className="ef-step">
          <div className="ef-step-header">
            <span className="ef-step-badge ef-step-badge-done">Valmis</span>
            <h3 className="ef-step-title">Selitys</h3>
          </div>
          <DocumentCard template={template} />
          <div className="ef-explanation">
            <p>{explanation}</p>
          </div>
          <div className="ef-actions">
            <button className="ef-btn-primary" onClick={onComplete}>
              Seuraava tosite →
            </button>
          </div>
        </div>
      )}

      {/* ── MicroContent overlay ── */}
      {activeMicroContent && (
        <MicroContent content={activeMicroContent} onClose={() => setMicroContentId(null)} />
      )}
    </div>
  );
}

// ─── Feedback panel ───────────────────────────────────────────────────────────

function FeedbackPanel({ result }: { result: CheckResult }) {
  if (result.correct) return null;
  return (
    <div className="ef-feedback">
      {result.errors.map((err, i) => (
        <div key={i} className="ef-feedback-item">
          <span className="ef-feedback-type">{err.type}</span>
          <span className="ef-feedback-msg">{err.message}</span>
        </div>
      ))}
    </div>
  );
}
