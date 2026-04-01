import { SunMoon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../app/providers/ThemeContext'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/inbox', label: 'Inbox' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { toggleTheme, theme } = useTheme()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <p className="text-h3 font-semibold">Suporte NDB</p>
            <nav className="flex items-center gap-2">
              {links.map((link) => {
                const active = location.pathname.startsWith(link.to)
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-md px-3 py-2 text-body transition hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                      active ? 'bg-background text-text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-caption text-text-secondary transition hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Alternar tema"
          >
            <SunMoon size={16} />
            {theme === 'dark' ? 'Escuro' : 'Claro'}
          </button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-4">{children}</main>
    </div>
  )
}
