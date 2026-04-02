import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { pushGlobalToast } from '@/lib/toast';
import type { Ticket, TicketMessage, TicketStatus } from '@/types';
import {
  fetchTickets,
  fetchTicketDetail,
  fetchTicketMessages,
  sendTicketReply,
  updateTicketStatus,
} from './ticketsApi';

/**
 * Fetch all tickets
 */
export const useTickets = () => {
  return useQuery({
    queryKey: ['tickets', 'list'],
    queryFn: fetchTickets,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

/**
 * Fetch specific ticket detail
 */
export const useTicketDetail = (ticketId: string | undefined) => {
  return useQuery({
    queryKey: ['tickets', 'detail', ticketId],
    queryFn: () => fetchTicketDetail(ticketId!),
    enabled: !!ticketId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

/**
 * Fetch messages for a ticket
 */
export const useTicketMessages = (ticketId: string | undefined) => {
  return useQuery({
    queryKey: ['tickets', 'messages', ticketId],
    queryFn: () => fetchTicketMessages(ticketId!),
    enabled: !!ticketId,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
};

/**
 * Send message (mutation)
 */
export const useSendTicketReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      message,
      attachments,
    }: {
      ticketId: string;
      message: string;
      attachments?: File[];
    }) => sendTicketReply(ticketId, message, attachments),
    onSuccess: (data, variables) => {
      // Invalidate messages query for this ticket
      queryClient.invalidateQueries({
        queryKey: ['tickets', 'messages', variables.ticketId],
      });

      // Invalidate ticket list (lastMessageAt changed)
      queryClient.invalidateQueries({
        queryKey: ['tickets', 'list'],
      });

      pushGlobalToast({
        title: 'Mensagem enviada',
        description: 'Sua resposta foi enviada com sucesso.',
        type: 'success',
      });
    },
    onError: (error) => {
      console.error('Failed to send reply:', error);
      pushGlobalToast({
        title: 'Erro ao enviar mensagem',
        description: 'Tente novamente em alguns segundos.',
        type: 'error',
      });
    },
  });
};

/**
 * Update ticket status (mutation)
 */
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      newStatus,
    }: {
      ticketId: string;
      newStatus: TicketStatus;
    }) => updateTicketStatus(ticketId, newStatus),
    onSuccess: (data, variables) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({
        queryKey: ['tickets', 'list'],
      });

      queryClient.invalidateQueries({
        queryKey: ['tickets', 'detail', variables.ticketId],
      });

      pushGlobalToast({
        title: 'Status atualizado',
        description: `Ticket status alterado para ${variables.newStatus}.`,
        type: 'success',
      });
    },
    onError: (error) => {
      console.error('Failed to update ticket status:', error);
      pushGlobalToast({
        title: 'Erro ao atualizar status',
        description: 'Tente novamente em alguns segundos.',
        type: 'error',
      });
    },
  });
};

/**
 * Invalidate all ticket queries
 */
export const useInvalidateTickets = () => {
  const queryClient = useQueryClient();
  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: ['tickets'],
      });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({
        queryKey: ['tickets', 'list'],
      });
    },
    invalidateDetail: (ticketId: string) => {
      queryClient.invalidateQueries({
        queryKey: ['tickets', 'detail', ticketId],
      });
    },
    invalidateMessages: (ticketId: string) => {
      queryClient.invalidateQueries({
        queryKey: ['tickets', 'messages', ticketId],
      });
    },
  };
};
