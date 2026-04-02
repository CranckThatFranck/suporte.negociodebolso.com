import apiClient from '@/lib/axios/client';
import type { TicketStatus } from '@/types';

export interface TicketSummaryResponse {
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

export interface DashboardSummary {
  total: number;
  open: number;
  pending: number;
  inProgress?: number;
  closed?: number;
}

const SUPPORT_API_BASE = '/api/v1/support';

/**
 * Fetch dashboard summary data
 * Falls back to calculating from ticket list if summary endpoint not available
 */
export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    // Try the dedicated summary endpoint first (if available in future)
    const { data } = await apiClient.get<DashboardSummary>(
      `${SUPPORT_API_BASE}/tickets/summary`
    );
    return data;
  } catch (error: any) {
    // Fallback: fetch all tickets and calculate summary locally
    if (error?.response?.status === 404) {
      return calculateSummaryFromTickets();
    }
    throw error;
  }
};

/**
 * Calculate summary from ticket list (fallback)
 */
export const calculateSummaryFromTickets = async (): Promise<DashboardSummary> => {
  const { data } = await apiClient.get<TicketSummaryResponse[]>(
    `${SUPPORT_API_BASE}/tickets`
  );

  const summary: DashboardSummary = {
    total: data.length,
    open: 0,
    pending: 0,
    inProgress: 0,
    closed: 0,
  };

  data.forEach((ticket) => {
    switch (ticket.status as TicketStatus) {
      case 'OPEN':
        summary.open++;
        break;
      case 'PENDING':
        summary.pending++;
        break;
      case 'IN_PROGRESS':
        summary.inProgress = (summary.inProgress || 0) + 1;
        break;
      case 'CLOSED':
      case 'RESOLVED':
      case 'CANCELED':
        summary.closed = (summary.closed || 0) + 1;
        break;
    }
  });

  return summary;
};
