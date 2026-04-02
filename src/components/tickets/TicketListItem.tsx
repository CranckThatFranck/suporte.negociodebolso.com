import type { Ticket } from '@/types';

export function TicketListItem({ ticket, active }: { ticket: Ticket; active?: boolean }) {
  return (
    <button
      type="button"
      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
        active ? 'border-primary bg-primary/10' : 'border-border bg-surface hover:bg-background'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-text-primary">{ticket.customerName}</p>
          <p className="mt-1 line-clamp-1 text-sm text-text-secondary">{ticket.subject}</p>
        </div>
        <span className="rounded-full bg-background px-2 py-1 text-[11px] font-semibold uppercase text-text-secondary">
          {ticket.status}
        </span>
      </div>
    </button>
  );
}