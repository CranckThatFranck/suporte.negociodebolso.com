import { useEffect, useRef } from 'react';
import { useInvalidateTickets } from '@/features/inbox/useTickets';
import { useInvalidateDashboardSummary } from '@/features/dashboard/useDashboard';
import { createSupportSocket } from './supportSocket';
import type { WsSupportEvent } from '@/types';

interface WebSocketHandlers {
  onEvent?: (event: WsSupportEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to manage WebSocket connection and real-time updates
 * Automatically invalidates queries when relevant events are received
 */
export const useRealtimeUpdates = (
  enabled: boolean = true,
  handlers?: WebSocketHandlers
) => {
  const clientRef = useRef<any>(null);
  const invalidateTickets = useInvalidateTickets();
  const invalidateDashboard = useInvalidateDashboardSummary();

  useEffect(() => {
    if (!enabled) return;

    const handleWebSocketEvent = (event: WsSupportEvent) => {
      console.log('[WebSocket] Event received:', event.eventType, event);

      // Handle different event types
      switch (event.eventType) {
        case 'NEW_MESSAGE':
          // Invalidate messages for this ticket + ticket list (lastMessageAt changed)
          if (event.ticketId) {
            invalidateTickets.invalidateMessages(event.ticketId);
            invalidateTickets.invalidateList();
          }
          break;

        case 'TICKET_STATUS_CHANGED':
          // Invalidate ticket detail and list
          if (event.ticketId) {
            invalidateTickets.invalidateDetail(event.ticketId);
            invalidateTickets.invalidateList();
            invalidateDashboard(); // Status change affects dashboard counts
          }
          break;

        case 'TICKET_CREATED':
          // New ticket - invalidate list
          invalidateTickets.invalidateList();
          invalidateDashboard();
          break;

        case 'TICKET_UPDATED':
          // Ticket updated - invalidate detail and list
          if (event.ticketId) {
            invalidateTickets.invalidateDetail(event.ticketId);
            invalidateTickets.invalidateList();
          }
          break;

        default:
          console.log('[WebSocket] Unknown event type:', event.eventType);
      }

      // Call custom handler if provided
      handlers?.onEvent?.(event);
    };

    const handleConnect = () => {
      console.log('[WebSocket] Connected');
      handlers?.onConnect?.();
    };

    const handleDisconnect = () => {
      console.log('[WebSocket] Disconnected');
      handlers?.onDisconnect?.();
    };

    const handleError = (error: Error) => {
      console.error('[WebSocket] Error:', error);
      handlers?.onError?.(error);
    };

    // Initialize WebSocket connection
    try {
      clientRef.current = createSupportSocket({
        onEvent: handleWebSocketEvent,
        onConnect: handleConnect,
        onDisconnect: handleDisconnect,
      });

      // Activate the connection
      clientRef.current.activate();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      handleError(error instanceof Error ? error : new Error(String(error)));
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [enabled, handlers, invalidateTickets, invalidateDashboard]);

  return {
    isConnected: clientRef.current?.connected || false,
  };
};

/**
 * Hook to manually trigger query invalidation (for manual refresh scenarios)
 */
export const useRefreshQueries = () => {
  const invalidateTickets = useInvalidateTickets();
  const invalidateDashboard = useInvalidateDashboardSummary();

  return {
    refreshTickets: invalidateTickets.invalidateList,
    refreshTicketDetail: invalidateTickets.invalidateDetail,
    refreshMessages: invalidateTickets.invalidateMessages,
    refreshDashboard: invalidateDashboard,
    refreshAll: () => {
      invalidateTickets.invalidateAll();
      invalidateDashboard();
    },
  };
};
