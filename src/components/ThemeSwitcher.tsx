'use client';

import { useTheme, type Theme } from '@/hooks/useTheme';

const themes: { value: Theme; label: string }[] = [
  { value: 'nide', label: 'Nide' },
  { value: 'netvisor', label: 'Netvisor-tyylinen' },
  { value: 'procountor', label: 'Procountor-tyylinen' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <span
        style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}
      >
        Teema:
      </span>
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          aria-pressed={theme === t.value}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-btn)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            border: theme === t.value
              ? '2px solid var(--color-primary)'
              : '2px solid var(--color-border)',
            background: theme === t.value
              ? 'var(--color-primary)'
              : 'var(--color-surface)',
            color: theme === t.value
              ? 'var(--color-primary-foreground)'
              : 'var(--color-text)',
            fontWeight: theme === t.value ? 600 : 400,
            transition: 'all 120ms ease',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
