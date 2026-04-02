export type TicketStatus = 'OPEN' | 'PENDING' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELED' | 'RESOLVED';

export interface AuthUser {
  id: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  idEmpresa?: string;
  nickname?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  authSource: string;
  user: AuthUser;
  tenantId: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  tenantId: string;
  customerName: string;
  customerEmail: string;
  updatedAt: string;
  shortId?: string;
  lastMessageAt?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderType: 'AI_GE' | 'HUMAN_SUPPORT' | 'CUSTOMER' | 'SYSTEM';
  senderName: string;
  content: string;
  createdAt: string;
  status: 'PENDING' | 'SENT' | 'READ';
}

export interface WsSupportEvent {
  eventType: 'NEW_MESSAGE' | 'TICKET_UPDATED' | 'TICKET_CREATED' | 'TICKET_STATUS_CHANGED';
  ticketId: string;
  tenantId: string;
  payload: Record<string, unknown>;
}