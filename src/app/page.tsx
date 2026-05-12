import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { DemoTabs } from '@/components/DemoTabs';

export default function DemoPage() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="page-logo">Nide Learn</span>
        <ThemeSwitcher />
      </header>
      <main className="page-main">
        <DemoTabs />
      </main>
    </div>
  );
}
