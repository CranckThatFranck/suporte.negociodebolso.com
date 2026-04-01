import { Link } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'

const tickets = [
  { id: '101', customer: 'Maria', subject: 'Erro no checkout', status: 'Novo' },
  { id: '102', customer: 'Carlos', subject: 'Dúvida sobre plano', status: 'Em atendimento' },
]

export default function InboxPage() {
  return (
    <AppShell>
      <h1 className="text-h1">Inbox</h1>
      <section className="mt-4 overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full border-collapse text-left">
          <thead className="bg-background text-caption uppercase text-text-secondary">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Assunto</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t border-border hover:bg-background/60">
                <td className="px-4 py-3 text-body">
                  <Link
                    to={`/inbox/${ticket.id}`}
                    className="text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {ticket.customer}
                  </Link>
                </td>
                <td className="px-4 py-3 text-body text-text-secondary">{ticket.subject}</td>
                <td className="px-4 py-3 text-body text-text-secondary">{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  )
}
