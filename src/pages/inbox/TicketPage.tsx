import { useParams } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'

const messages = [
  { id: 1, author: 'Cliente', text: 'Estou com erro ao finalizar a compra.' },
  { id: 2, author: 'Atendente', text: 'Pode me informar qual navegador está usando?' },
]

export default function TicketPage() {
  const { ticketId } = useParams()

  return (
    <AppShell>
      <h1 className="text-h1">Ticket #{ticketId}</h1>
      <section className="mt-4 rounded-lg border border-border bg-surface p-4">
        <p className="text-body text-text-secondary">Histórico de mensagens</p>
        <ul className="mt-3 space-y-3">
          {messages.map((message) => (
            <li key={message.id} className="rounded-md border border-border bg-background p-3">
              <p className="text-caption text-text-secondary">{message.author}</p>
              <p className="mt-1 text-body">{message.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  )
}
