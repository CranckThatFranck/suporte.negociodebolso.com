import type { Ticket } from '@/types';
import { getTenantId } from '@/lib/storage/session';

interface UserDetailsPanelProps {
  ticket?: Ticket;
}

export function UserDetailsPanel({ ticket }: UserDetailsPanelProps) {
  const tenantId = getTenantId();
  const customerName = ticket?.customerName || 'N/A';
  const customerEmail = ticket?.customerEmail || 'N/A';

  return (
    <aside className="rounded-3xl border border-border bg-surface p-5">
      <p className="text-sm font-semibold text-text-primary">Detalhes do Cliente</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-text-secondary">Nome</dt>
          <dd className="truncate text-text-primary">{customerName}</dd>
        </div>
        <div>
          <dt className="text-text-secondary">E-mail</dt>
          <dd className="truncate text-text-primary">{customerEmail}</dd>
        </div>
        <div>
          <dt className="text-text-secondary">Tenant</dt>
          <dd className="truncate text-text-primary">{tenantId || 'N/A'}</dd>
        </div>
        {ticket && (
          <>
            <div>
              <dt className="text-text-secondary">Ticket ID</dt>
              <dd className="font-mono truncate text-xs text-text-primary">
                {ticket.id.slice(0, 8)}...
              </dd>
            </div>
            <div>
              <dt className="text-text-secondary">Criado em</dt>
              <dd className="text-text-primary">
                {new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}
              </dd>
            </div>
          </>
        )}
      </dl>
    </aside>
  );
}