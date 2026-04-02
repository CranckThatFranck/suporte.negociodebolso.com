import { useState } from 'react';
import { AIMonitorPanel } from '@/components/ai-monitor/AIMonitorPanel';
import { ChatMessageBubble } from '@/components/chat/ChatMessageBubble';
import { MessageComposer } from '@/components/chat/MessageComposer';
import { TicketStatusSelector } from '@/components/chat/TicketStatusSelector';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { TicketListItem } from '@/components/tickets/TicketListItem';
import { UserDetailsPanel } from '@/components/layout/UserDetailsPanel';
import { useTickets, useTicketMessages } from '@/features/inbox/useTickets';
import { useRealtimeUpdates } from '@/lib/websocket/useWebSocket';

export function InboxPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tickets list
  const {
    data: tickets = [],
    isLoading: isLoadingTickets,
    error: ticketsError,
  } = useTickets();

  // Fetch messages for selected ticket
  const {
    data: messages = [],
    isLoading: isLoadingMessages,
  } = useTicketMessages(selectedTicketId);

  // Enable real-time updates
  useRealtimeUpdates(true);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);
  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-select first ticket if none selected
  if (!selectedTicketId && filteredTickets.length > 0) {
    setSelectedTicketId(filteredTickets[0].id);
  }

  return (
    <div className="grid min-h-[calc(100vh-140px)] gap-4 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
      {/* Sidebar - Tickets List */}
      <aside className="space-y-4 rounded-3xl border border-border bg-surface p-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">Tickets</p>
          <input
            className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm"
            placeholder="Buscar por termo"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoadingTickets ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl border border-border bg-background"
              />
            ))}
          </div>
        ) : ticketsError ? (
          <ErrorState
            title="Erro ao carregar tickets"
            description="Tente novamente em alguns segundos."
          />
        ) : filteredTickets.length === 0 ? (
          <EmptyState
            title="Nenhum ticket"
            description="Nenhum ticket encontrado para este filtro."
          />
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className="w-full"
              >
                <TicketListItem
                  ticket={ticket}
                  active={ticket.id === selectedTicketId}
                />
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* Main Chat Area */}
      <section className="space-y-4 rounded-3xl border border-border bg-surface p-4">
        {!selectedTicket ? (
          <EmptyState
            title="Selecione um ticket"
            description="Clique em um ticket da lista para visualizar as mensagens."
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-sm text-text-secondary">Ticket selecionado</p>
                <h2 className="text-xl font-semibold text-text-primary">
                  {selectedTicket.subject}
                </h2>
                <p className="text-xs text-text-secondary">
                  {selectedTicket.customerEmail}
                </p>
              </div>
              <TicketStatusSelector
                ticketId={selectedTicket.id}
                currentStatus={selectedTicket.status}
              />
            </div>

            {/* Messages */}
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {isLoadingMessages ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                </div>
              ) : messages.length === 0 ? (
                <EmptyState
                  title="Sem mensagens"
                  description="Este ticket ainda não possui mensagens."
                />
              ) : (
                messages.map((message) => (
                  <ChatMessageBubble key={message.id} message={message} />
                ))
              )}
            </div>

            {/* Message Composer */}
            <MessageComposer ticketId={selectedTicket.id} />
          </>
        )}
      </section>

      {/* Right Sidebar - Details & AI Monitor */}
      <aside className="space-y-4">
        {selectedTicket && (
          <>
            <UserDetailsPanel ticket={selectedTicket} />
            <AIMonitorPanel />
          </>
        )}
      </aside>
    </div>
  );
}