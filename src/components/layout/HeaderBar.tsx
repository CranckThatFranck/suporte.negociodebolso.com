import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export function HeaderBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-surface px-6 py-4">
      <div>
        <p className="text-sm font-medium text-text-secondary">Suporte de Bolso</p>
        <h1 className="text-2xl font-semibold text-text-primary">Painel de atendimento</h1>
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background"
      >
        {theme === 'dark' ? <SunMedium size={16} /> : <MoonStar size={16} />}
        {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      </button>
    </header>
  );
}