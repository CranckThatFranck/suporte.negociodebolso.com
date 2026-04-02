import { useEffect } from 'react';
import { SummaryCard } from '@/components/common/SummaryCard';
import { ErrorState } from '@/components/common/ErrorState';
import { useDashboardSummary } from '@/features/dashboard/useDashboard';
import { useRealtimeUpdates } from '@/lib/websocket/useWebSocket';

export function DashboardPage() {
  const { data: summary, isLoading, error } = useDashboardSummary();
  
  // Enable real-time updates for dashboard
  useRealtimeUpdates(true);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-3xl border border-border bg-surface"
            />
          ))}
        </section>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="space-y-4">
        <ErrorState
          title="Erro ao carregar dashboard"
          description="Não foi possível carregar o resumo de tickets. Tente novamente em alguns segundos."
        />
      </div>
    );
  }

  const cards = [
    {
      label: 'Total de Tickets',
      value: summary.total,
      accent: 'primary' as const,
    },
    {
      label: 'Abertos',
      value: summary.open,
      accent: 'warning' as const,
    },
    {
      label: 'Aguardando',
      value: summary.pending,
      accent: 'secondary' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((item) => (
          <SummaryCard
            key={item.label}
            label={item.label}
            value={item.value}
            accent={item.accent}
          />
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-text-primary">
            Estatísticas
          </p>
          <div className="mt-4 space-y-2 text-sm text-text-secondary">
            <p>
              Em Progresso:{' '}
              <span className="font-semibold text-text-primary">
                {summary.inProgress || 0}
              </span>
            </p>
            <p>
              Finalizados:{' '}
              <span className="font-semibold text-text-primary">
                {summary.closed || 0}
              </span>
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-text-primary">
            Atividade em Tempo Real
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Conectado ao servidor. Atualizações de tickets, mensagens e status serão refletidas automaticamente.
          </p>
        </div>
      </section>
    </div>
  );
}