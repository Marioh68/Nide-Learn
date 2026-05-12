import { ThemeSwitcher } from '@/components/ThemeSwitcher';

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
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            marginBottom: '8px',
          }}
        >
          Tervetuloa Nide Learniin
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-muted)',
            marginBottom: '32px',
            fontSize: '1.0625rem',
          }}
        >
          Kirjanpidon oppimisalusta — vaihda teemaa yläreunan painikkeista.
        </p>

        {/* Theme preview card */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: '16px',
            }}
          >
            Teeman esikatselu
          </h2>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button
              style={{
                padding: '10px 20px',
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
              Tallenna
            </button>
            <button
              style={{
                padding: '10px 20px',
                background: 'var(--color-secondary)',
                color: 'var(--color-secondary-foreground)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-btn)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                cursor: 'pointer',
              }}
            >
              Peruuta
            </button>
          </div>

          <div
            style={{
              background: 'var(--color-success-bg)',
              border: '1px solid var(--color-success)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: 'var(--color-success)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              marginBottom: '8px',
            }}
          >
            Kirjaus tallennettu onnistuneesti.
          </div>

          <div
            style={{
              background: 'var(--color-error-bg)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: 'var(--color-error)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
            }}
          >
            Kirjaus ei ole tasapainossa. Tarkista debet- ja kredit-summat.
          </div>
        </div>

        {/* Placeholder for vocabulary exercise */}
        <div
          style={{
            background: 'var(--color-surface-raised)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-muted)',
              fontSize: '0.9375rem',
            }}
          >
            Sanastoharjoitus — tulossa Vaiheessa 4
          </p>
        </div>
      </main>
    </div>
  );
}
