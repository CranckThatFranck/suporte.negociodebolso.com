# FALTA_ENDPOINTS_SUPORTE.md
**Status**: Identificado após analisar API v3  
**Data**: 2 de abril de 2026

---

## Resumo
O frontend está pronto para integração real, mas alguns endpoints necessários para **Milestone 3 (Dashboard)** e **Milestone 4 (WebSocket)** não foram encontrados na documentação da API v3.

---

## 1. ❌ Dashboard - Resumo de Tickets

### Endpoint Solicitado
```
GET /api/v1/support/tickets/summary
X-Tenant-ID: <tenant-id>
```

### Response Esperado
```json
{
  "total": 128,
  "open": 42,
  "pending": 19,
  "inProgress": 25,
  "closed": 42
}
```

### Motivo
- O frontend exibe 3 cards no dashboard: **Total de Tickets**, **Abertos**, **Aguardando Confirmação**
- Atualmente seria necessário fazer `GET /api/v1/support/tickets` + filtrar localmente em cada carregamento (ineficiente)
- Um endpoint de resumo agrupado (`/summary`) reduz latência e carga de rede

### Alternativa Temporária
Usar `GET /api/v1/support/tickets` e calcular os resumos localmente no frontend (menos ideal, mas funciona).

---

## 2. ❌ WebSocket Events - Tipos de Eventos Não Documentados

### Contexto
- Endpoint: `wss://api.negociodebolso.com/ws-support` (SockJS + STOMP)
- Topic: `/topic/support/updates`
- Header: `Authorization: Bearer <token>`, `X-Tenant-ID: <tenant-id>`

### Eventos Esperados
O frontend necessita dos seguintes eventos (tipos não documentados):

#### 2.1 NEW_MESSAGE
```json
{
  "eventType": "NEW_MESSAGE",
  "ticketId": "uuid-ticket",
  "payload": {
    "messageId": "uuid-message",
    "senderType": "CUSTOMER|AGENT|SYSTEM",
    "text": "Conteúdo da mensagem",
    "createdAt": "2026-04-02T15:30:00Z"
  }
}
```
**Uso**: Invalidar query de mensagens e atualizar lista de tickets (lastMessageAt)

#### 2.2 TICKET_STATUS_CHANGED
```json
{
  "eventType": "TICKET_STATUS_CHANGED",
  "ticketId": "uuid-ticket",
  "payload": {
    "newStatus": "IN_PROGRESS|CLOSED|RESOLVED",
    "changedAt": "2026-04-02T15:30:00Z",
    "changedBy": "agent@email.com"
  }
}
```
**Uso**: Invalidar queries de ticket (detail + list)

#### 2.3 TICKET_CREATED
```json
{
  "eventType": "TICKET_CREATED",
  "ticketId": "uuid-ticket",
  "payload": {
    "shortId": "abc123",
    "subject": "Novo ticket",
    "senderEmail": "customer@email.com",
    "createdAt": "2026-04-02T15:30:00Z"
  }
}
```
**Uso**: Invalidar query de tickets (list)

#### 2.4 TICKET_UPDATED
```json
{
  "eventType": "TICKET_UPDATED",
  "ticketId": "uuid-ticket",
  "payload": {
    "field": "assignee|priority|category",
    "oldValue": "...",
    "newValue": "...",
    "updatedAt": "2026-04-02T15:30:00Z"
  }
}
```
**Uso**: Invalidar queries de ticket (detail + list)

---

## 3. ✅ Endpoints Confirmados (Implementação Prossegue)

### Autenticação
- `POST /api/v1/auth/login-equipe` ✅

### Tickets
- `GET /api/v1/support/tickets` ✅
- `GET /api/v1/support/tickets/{id}/messages` ✅
- `POST /api/v1/support/tickets/{id}/reply` ✅

---

## Ação Solicitada ao Backend

### Para Milestone 3 (Dashboard)
1. **Criar**: `GET /api/v1/support/tickets/summary`
   - Retornar agregações por status
   - Incluir contagem de tickets por status

### Para Milestone 4 (WebSocket)
1. **Documentar**: Estrutura exata dos eventos em `/topic/support/updates`
2. **Confirmar**: Tipos de eventos (NEW_MESSAGE, TICKET_STATUS_CHANGED, TICKET_CREATED, TICKET_UPDATED)
3. **Confirmar**: Headers obrigatórios e tratamento de autenticação

---

## Timeline de Bloqueio

| Milestone | Bloqueedor | Severidade | Workaround |
|-----------|-----------|-----------|-----------|
| **M2** | Nenhum | ✅ | Autenticação pronta |
| **M3** | Dashboard summary endpoint | 🟡 Médio | Calcular localmente (ineficiente) |
| **M4** | WebSocket event types | 🟡 Médio | Implementar scaffold, aguardar eventos reais |

---

## Próximas Ações Frontend

### Já Implementado
- ✅ M2: Autenticação com `POST /api/v1/auth/login-equipe`
- ✅ M4: Queries para tickets e mensagens
- ✅ M4: WebSocket scaffold (SockJS + STOMP)

### A Implementar (Aguardando Clarificação)
- 🔄 M3: Dashboard queries com resumo
- 🔄 M4: Integração de eventos reais do WebSocket

---

**Gerado por**: GitHub Copilot  
**Versão da API**: v3  
**Data de Geração**: 2 de abril de 2026
