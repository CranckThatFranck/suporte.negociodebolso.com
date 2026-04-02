import { useUpdateTicketStatus } from '@/features/inbox/useTickets';
import type { TicketStatus } from '@/types';

interface TicketStatusSelectorProps {
  ticketId: string;
  currentStatus: TicketStatus;
}

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'OPEN', label: 'Aberto' },
  { value: 'IN_PROGRESS', label: 'Em Progresso' },
  { value: 'PENDING', label: 'Aguardando' },
  { value: 'CLOSED', label: 'Fechado' },
  { value: 'CANCELED', label: 'Cancelado' },
  { value: 'RESOLVED', label: 'Resolvido' },
];

export function TicketStatusSelector({
  ticketId,
  currentStatus,
}: TicketStatusSelectorProps) {
  const { mutate: updateStatus, isPending } = useUpdateTicketStatus();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TicketStatus;
    if (newStatus !== currentStatus) {
      updateStatus({
        ticketId,
        newStatus,
      });
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleStatusChange}
      disabled={isPending}
      className="rounded-full border border-border bg-surface px-3 py-2 text-sm text-text-primary disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}