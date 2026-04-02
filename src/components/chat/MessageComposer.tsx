import { useState } from 'react';
import { useSendTicketReply } from '@/features/inbox/useTickets';

interface MessageComposerProps {
  ticketId: string;
}

export function MessageComposer({ ticketId }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState('');
  const { mutate: sendReply, isPending } = useSendTicketReply();

  const handleSend = () => {
    if (!message.trim()) return;

    sendReply({
      ticketId,
      message: message.trim(),
    });

    setMessage('');
  };

  const handleSaveDraft = () => {
    setDraft(message);
  };

  const handleLoadDraft = () => {
    if (draft) {
      setMessage(draft);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-4">
      <textarea
        rows={4}
        placeholder="Digite a resposta do suporte..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isPending}
        className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary disabled:opacity-50"
      />
      <div className="mt-3 flex justify-between gap-3">
        <div className="space-x-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isPending || !message.trim()}
            className="rounded-full border border-border px-4 py-2 text-sm text-text-primary disabled:opacity-50"
          >
            Salvar rascunho
          </button>
          {draft && (
            <button
              type="button"
              onClick={handleLoadDraft}
              disabled={isPending}
              className="rounded-full border border-border px-4 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
            >
              ↶ Carregar
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={isPending || !message.trim()}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isPending ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}