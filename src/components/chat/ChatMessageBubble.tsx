import type { TicketMessage } from '@/types';

const senderStyles: Record<TicketMessage['senderType'], string> = {
  AI_GE: 'border-secondary/30 bg-secondary/10 text-text-primary',
  HUMAN_SUPPORT: 'border-primary/30 bg-primary/10 text-text-primary',
  CUSTOMER: 'border-border bg-surface text-text-primary'
};

export function ChatMessageBubble({ message }: { message: TicketMessage }) {
  return (
    <article className={`rounded-3xl border px-4 py-3 ${senderStyles[message.senderType]}`}>
      <div className="flex items-center justify-between gap-3 text-xs text-text-secondary">
        <span className="font-semibold uppercase tracking-wide">{message.senderType}</span>
        <span>{new Date(message.createdAt).toLocaleString('pt-BR')}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-text-primary">{message.senderName}</p>
      <p className="mt-1 text-sm text-text-primary">{message.content}</p>
      {message.senderType === 'AI_GE' ? (
        <span className="mt-3 inline-flex rounded-full bg-secondary/15 px-2 py-1 text-[11px] font-semibold text-secondary">
          Ge
        </span>
      ) : null}
    </article>
  );
}