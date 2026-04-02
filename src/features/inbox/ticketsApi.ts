import apiClient from '@/lib/axios/client';
import type { Ticket, TicketMessage, TicketStatus } from '@/types';

export interface TicketSummaryDTO {
  id: string;
  shortId: string;
  remetenteEmail: string;
  assunto: string;
  status: TicketStatus;
  caixaOrigem: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

export interface TicketMessageDTO {
  id: string;
  tipoRemetente: 'CUSTOMER' | 'AGENT' | 'SYSTEM';
  mensagem: string;
  remetenteEmail: string;
  assuntoOriginal?: string;
  createdAt: string;
  attachments?: Array<{
    id: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    downloadUrl: string;
  }>;
}

const SUPPORT_API_BASE = '/api/v1/support';

/**
 * Map API sender type to frontend type
 */
const mapSenderType = (
  tipoRemetente: 'CUSTOMER' | 'AGENT' | 'SYSTEM'
): 'CUSTOMER' | 'HUMAN_SUPPORT' | 'AI_GE' | 'SYSTEM' => {
  switch (tipoRemetente) {
    case 'CUSTOMER':
      return 'CUSTOMER';
    case 'AGENT':
      return 'HUMAN_SUPPORT';
    case 'SYSTEM':
      return 'SYSTEM';
    default:
      return 'SYSTEM';
  }
};

/**
 * Fetch all tickets for the current tenant
 */
export const fetchTickets = async (): Promise<Ticket[]> => {
  const { data } = await apiClient.get<TicketSummaryDTO[]>(
    `${SUPPORT_API_BASE}/tickets`
  );

  return data.map((dto) => ({
    id: dto.id,
    subject: dto.assunto,
    status: dto.status,
    tenantId: '', // Not provided in DTO
    customerName: dto.remetenteEmail.split('@')[0],
    customerEmail: dto.remetenteEmail,
    updatedAt: dto.updatedAt,
    shortId: dto.shortId,
    lastMessageAt: dto.lastMessageAt,
  }));
};

/**
 * Fetch specific ticket detail
 */
export const fetchTicketDetail = async (ticketId: string): Promise<Ticket> => {
  // API doesn't provide single ticket endpoint, use list and filter
  const tickets = await fetchTickets();
  const ticket = tickets.find((t) => t.id === ticketId);

  if (!ticket) {
    throw new Error(`Ticket ${ticketId} not found`);
  }

  return ticket;
};

/**
 * Fetch messages for a specific ticket
 */
export const fetchTicketMessages = async (
  ticketId: string
): Promise<TicketMessage[]> => {
  const { data } = await apiClient.get<TicketMessageDTO[]>(
    `${SUPPORT_API_BASE}/tickets/${ticketId}/messages`
  );

  return data.map((dto) => ({
    id: dto.id,
    ticketId,
    senderType: mapSenderType(dto.tipoRemetente),
    senderName: dto.remetenteEmail,
    content: dto.mensagem,
    createdAt: dto.createdAt,
    status: 'SENT' as const,
  }));
};

/**
 * Send reply to ticket (new message)
 */
export const sendTicketReply = async (
  ticketId: string,
  message: string,
  attachments?: File[]
): Promise<TicketMessage> => {
  const formData = new FormData();

  // API expects JSON stringified payload for multipart
  const payload = {
    mensagem: message,
  };
  formData.append('payload', JSON.stringify(payload));

  if (attachments && attachments.length > 0) {
    attachments.forEach((file) => {
      formData.append('attachments', file);
    });
  }

  const { data } = await apiClient.post<TicketMessageDTO>(
    `${SUPPORT_API_BASE}/tickets/${ticketId}/reply`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return {
    id: data.id,
    ticketId,
    senderType: mapSenderType(data.tipoRemetente),
    senderName: data.remetenteEmail,
    content: data.mensagem,
    createdAt: data.createdAt,
    status: 'SENT' as const,
  };
};

/**
 * Update ticket status
 * Note: API endpoint not explicitly found in docs, adding for future integration
 */
export const updateTicketStatus = async (
  ticketId: string,
  newStatus: TicketStatus
): Promise<Ticket> => {
  const { data } = await apiClient.patch<any>(
    `${SUPPORT_API_BASE}/tickets/${ticketId}`,
    { status: newStatus }
  );

  return {
    id: data.id,
    subject: data.assunto,
    status: data.status,
    tenantId: '',
    customerName: data.remetenteEmail.split('@')[0],
    customerEmail: data.remetenteEmail,
    updatedAt: data.updatedAt,
    shortId: data.shortId,
    lastMessageAt: data.lastMessageAt,
  };
};
