import { AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react'
import { AppShell } from '../../components/layout/AppShell'

const cards = [
  { label: 'Tickets abertos', value: '48', icon: MessageSquare, color: 'text-primary' },
  { label: 'Resolvidos hoje', value: '32', icon: CheckCircle2, color: 'text-success' },
  { label: 'Críticos', value: '4', icon: AlertTriangle, color: 'text-warning' },
]

export default function DashboardPage() {
  return (
    <AppShell>
      <h1 className="text-h1">Visão geral</h1>
      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-body text-text-secondary">{card.label}</p>
              <card.icon className={card.color} size={18} />
            </div>
            <p className="mt-3 text-h2">{card.value}</p>
          </article>
        ))}
      </section>
    </AppShell>
  )
}
