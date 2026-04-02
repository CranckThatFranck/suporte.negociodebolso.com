import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import type { WsSupportEvent } from '@/types';
import { getTenantId, getToken } from '@/lib/storage/session';

const wsUrl =
  import.meta.env.VITE_WS_URL ?? 'https://api.negociodebolso.com/ws-support';

export type SupportSocketHandlers = {
  onEvent?: (event: WsSupportEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export const createSupportSocket = (handlers: SupportSocketHandlers = {}) => {
  const token = getToken();
  const tenantId = getTenantId();

  if (!token || !tenantId) {
    console.warn('[WebSocket] Missing auth credentials (token or tenantId)');
  }

  const client = new Client({
    webSocketFactory: () => {
      // SockJS handles HTTP polling fallback
      return new SockJS(wsUrl, undefined, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
      });
    },
    reconnectDelay: 5000,
    maxWebSocketFrameSize: 8 * 1024 * 1024, // 8MB
    heartbeatIncoming: 10_000,
    heartbeatOutgoing: 10_000,
    connectHeaders: {
      Authorization: `Bearer ${token ?? ''}`,
      'X-Tenant-ID': tenantId ?? '',
    },
    onConnect: (frame) => {
      console.log('[WebSocket] Connected:', frame);
      handlers.onConnect?.();

      // Subscribe to support updates topic
      const subscription = client.subscribe(
        '/topic/support/updates',
        (message: IMessage) => {
          try {
            const event = JSON.parse(message.body) as WsSupportEvent;
            console.log('[WebSocket] Event:', event);
            handlers.onEvent?.(event);
          } catch (error) {
            console.error('[WebSocket] Failed to parse message:', error, message.body);
          }
        },
        {
          id: 'support-updates',
        }
      );

      return undefined;
    },
    onDisconnect: (frame) => {
      console.log('[WebSocket] Disconnected:', frame);
      handlers.onDisconnect?.();
    },
    onStompError: (frame) => {
      console.error('[WebSocket] STOMP Error:', frame);
    },
    onWebSocketError: (event) => {
      console.error('[WebSocket] WebSocket Error:', event);
    },
  });

  return client;
};