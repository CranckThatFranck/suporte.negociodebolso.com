import type { Ticket, TicketMessage } from '@/types';

export const mockTickets: Ticket[] = [
  {
    id: 'ticket-001',
    subject: 'Falha no pagamento recorrente',
    status: 'OPEN',
    tenantId: 'tenant-01',
    customerName: 'Mariana Costa',
    customerEmail: 'mariana@email.com',
    updatedAt: '2026-04-02T13:20:00Z'
  },
  {
    id: 'ticket-002',
    subject: 'Ativação de acesso bloqueada',
    status: 'IN_PROGRESS',
    tenantId: 'tenant-01',
    customerName: 'João Ribeiro',
    customerEmail: 'joao@email.com',
    updatedAt: '2026-04-02T12:42:00Z'
  }
];

export const mockMessages: TicketMessage[] = [
  {
    id: 'msg-001',
    ticketId: 'ticket-001',
    senderType: 'CUSTOMER',
    senderName: 'Mariana Costa',
    content: 'Meu pagamento foi aprovado, mas o acesso não liberou.',
    createdAt: '2026-04-02T13:05:00Z',
    status: 'SENT'
  },
  {
    id: 'msg-002',
    ticketId: 'ticket-001',
    senderType: 'AI_GE',
    senderName: 'Ge',
    content: 'Vou sugerir uma verificação no gateway de pagamento antes de responder ao cliente.',
    createdAt: '2026-04-02T13:07:00Z',
    status: 'READ'
  },
  {
    id: 'msg-003',
    ticketId: 'ticket-001',
    senderType: 'HUMAN_SUPPORT',
    senderName: 'Ana',
    content: 'Já acionei a checagem do processamento e estou acompanhando o retorno.',
    createdAt: '2026-04-02T13:12:00Z',
    status: 'READ'
  }
];