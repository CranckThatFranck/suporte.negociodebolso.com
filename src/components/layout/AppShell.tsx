import type { ReactNode } from 'react';
import logoUrl from '../../../srcAgents/iconplaystore.svg';
import { HeaderBar } from './HeaderBar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-border bg-surface px-6 py-6 lg:flex">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Logo Suporte de Bolso" className="h-11 w-11 rounded-2xl object-cover" />
            <div>
              <p className="text-sm text-text-secondary">Negócio de Bolso</p>
              <p className="font-semibold text-text-primary">Suporte de Bolso</p>
            </div>
          </div>
          <nav className="mt-10 flex flex-col gap-2 text-sm text-text-secondary">
            <span className="rounded-2xl bg-background px-4 py-3 font-medium text-text-primary">Dashboard</span>
            <span className="rounded-2xl px-4 py-3">Inbox</span>
            <span className="rounded-2xl px-4 py-3">IA Ge</span>
          </nav>
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          <HeaderBar />
          <div className="min-w-0 flex-1 p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}