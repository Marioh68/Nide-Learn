import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { VocabularyExercise } from '@/components/VocabularyExercise';
import { level1Vocabulary } from '@/data/vocabulary/level-1';

export default function DemoPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-background)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: 'var(--color-header-bg)',
          color: 'var(--color-header-text)',
          padding: '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-md)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          Nide Learn
        </span>
        <ThemeSwitcher />
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          padding: '32px 24px',
          maxWidth: 900,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            marginBottom: '4px',
          }}
        >
          Kirjanpidon perussanasto — Taso 1
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-muted)',
            marginBottom: '28px',
            fontSize: '1rem',
          }}
        >
          Harjoittele kirjanpidon perustermejä. Yhdistä kukin termi sitä vastaavaan määritelmään.
        </p>

        <VocabularyExercise phases={level1Vocabulary} />
      </main>
    </div>
  );
}
