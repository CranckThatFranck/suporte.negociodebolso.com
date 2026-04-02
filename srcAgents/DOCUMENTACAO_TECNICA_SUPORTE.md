# DOCUMENTAÇÃO TÉCNICA SUPORTE

## 1. Objetivo e Escopo
Este documento define a especificação técnica única para implementação do site suporte.negóciodebolso.com.
A aplicação deve ser implementada em React com Vite e Tailwind CSS, com foco em operação de suporte em tempo real.
O resultado esperado é um frontend web completo, preparado para autenticação JWT, arquitetura multi-tenant, consultas REST, atualizações via WebSocket e experiência de atendimento orientada a produtividade.

## 2. Stack Técnica

### 2.1 Frontend Core
- React 18
- Vite 5
- TypeScript
- React Router DOM
- TanStack Query
- Axios
- Tailwind CSS
- Lucide React

### 2.2 Tempo Real
- SockJS Client
- StompJS

### 2.3 Padrão de Organização de Pastas
```
src/
  app/
    providers/
    router/
  assets/
  components/
    common/
    layout/
    tickets/
    chat/
    dashboard/
    ai-monitor/
  features/
    auth/
    dashboard/
    inbox/
    ticket-details/
    devices/
  hooks/
  lib/
    axios/
    query/
    websocket/
    storage/
  types/
  utils/
  pages/
    login/
    dashboard/
    inbox/
  styles/
```

### 2.4 Dependências Obrigatórias
- react
- react-dom
- react-router-dom
- @tanstack/react-query
- axios
- sockjs-client
- @stomp/stompjs
- lucide-react
- tailwindcss
- postcss
- autoprefixer

### 2.5 Scripts NPM Esperados
- dev: inicializa ambiente local
- build: gera bundle de produção
- preview: serve build localmente
- lint: executa linter
- test: executa testes unitarios

## 3. Identidade Visual e Tema

### 3.1 Tokens de Cor
Definir no Tailwind e expor como variaveis CSS para light e dark.

- primary: cor principal de acao e destaque
  - light: #2563EB
  - dark: #3B82F6
- secondary: cor secundaria para elementos complementares
  - light: #7C3AED
  - dark: #8B5CF6
- background: fundo geral
  - light: #F8FAFC
  - dark: #0B1220
- surface: fundo de cards, modais e paineis
  - light: #FFFFFF
  - dark: #111827
- text-primary
  - light: #0F172A
  - dark: #E5E7EB
- text-secondary
  - light: #475569
  - dark: #9CA3AF
- border
  - light: #E2E8F0
  - dark: #1F2937
- success
  - light: #16A34A
  - dark: #22C55E
- warning
  - light: #D97706
  - dark: #F59E0B
- error-cancel
  - light: #DC2626
  - dark: #EF4444

### 3.2 Tipografia
Configurar via Tailwind:
- font-sans: Inter, system-ui, sans-serif
- font-mono: JetBrains Mono, ui-monospace, SFMono-Regular, monospace

Escala recomendada:
- h1: 30px semibold
- h2: 24px semibold
- h3: 20px semibold
- body: 14px regular
- caption: 12px regular

### 3.3 Regras de Light e Dark Mode
- Modo padrão: respeitar preferência do sistema no primeiro acesso.
- Persistência: salvar escolha explícita do usuário em localStorage com chave theme.
- Classe raiz: aplicar classe dark em html quando tema for escuro.
- Todos os componentes devem consumir tokens sem cores hardcoded em JSX.

### 3.4 Diretrizes de UI
- Layout com densidade operacional para agentes de suporte.
- Contraste mínimo AA em textos e ícones.
- Estados visuais obrigatórios: hover, focus-visible, disabled, loading, error.

## 4. Rotas e Navegação

### 4.1 Rotas Principais
- /login
  - acesso público
  - formulário de autenticação da equipe
- /dashboard
  - rota protegida
  - cards de resumo
- /inbox
  - rota protegida
  - lista de tickets e chat
- /inbox/:ticketId
  - rota protegida
  - ticket selecionado e histórico de mensagens

### 4.2 Regras de Rota Protegida
- Se não houver JWT válido, redirecionar para /login.
- Se API responder 401 em qualquer chamada protegida:
  - limpar sessão
  - redirecionar para /login
  - exibir aviso de sessão expirada

### 4.3 Estratégia de Navegação
- Router com BrowserRouter.
- Guardas de rota implementadas com componente ProtectedRoute.
- Páginas lazy-loaded para reduzir tempo inicial de carregamento.

## 5. API REST

### 5.1 Base URL
- https://api.negóciodebolso.com/api/v1/admin

### 5.2 Axios Instance
Criar instância única em src/lib/axios/client.ts com:
- baseURL configurada pela URL base acima
- timeout de 20000 ms
- headers padrão Content-Type application/json

Interceptors obrigatórios:
1. Request interceptor:
   - Inserir Authorization: Bearer <jwt> quando houver token.
   - Inserir X-Tenant-ID obrigatoriamente em todas as requisições.
   - Permitir bypass de tenant para usuários role SUPPORT ou ADMIN conforme regra de negócio.
2. Response interceptor:
   - Em 401, invalidar sessão, limpar storage e redirecionar para /login.
   - Propagar erro padronizado para camada de UI.

### 5.3 Autenticação
Endpoint:
- POST /login-equipe

Payload:
```
{
  "idEmpresa": "string",
  "nickname": "string",
  "password": "string"
}
```

Resposta esperada mínima:
```
{
  "token": "jwt",
  "authSource": "SUPPORT_PANEL",
  "user": {
    "id": "string",
    "name": "string",
    "role": "SUPPORT|ADMIN|OUTRO"
  },
  "tenantId": "string"
}
```

Persistência local após login:
- jwt
- authSource
- tenantId
- userRole
- userName

### 5.4 Tickets
- GET /support/tickets
  - parâmetros de filtro:
    - status: OPEN, IN_PROGRESS, CANCELED, RESOLVED
    - tenant
    - page
    - size
  - retorno deve suportar paginação para lazy loading na sidebar.

- GET /support/tickets/{id}
  - retorna metadados completos do ticket.

- GET /support/tickets/{id}/messages
  - retorna histórico de mensagens do ticket em ordem cronológica.

- PATCH /support/tickets/{id}/status
  - payload:
```
{
  "status": "OPEN|IN_PROGRESS|CANCELED|RESOLVED"
}
```

### 5.5 Dispositivos
- POST /support/devices
  - finalidade: registrar token FCM no backend
  - payload mínimo:
```
{
  "token": "string",
  "platform": "WEB",
  "deviceName": "string"
}
```

## 6. WebSockets

### 6.1 Configuração
- Broker endpoint: /ws-support
- Tópico de escuta: /topic/support/updates

### 6.2 Fluxo de Conexão
1. Abrir conexão SockJS para /ws-support.
2. Encapsular com cliente STOMP.
3. Conectar enviando headers de autenticação e tenant quando aplicável.
4. Assinar /topic/support/updates.
5. Ao desconectar, tentar reconexão com backoff exponencial.

### 6.3 Eventos Esperados
Padrão de mensagem do topico:
```
{
  "eventType": "NEW_MESSAGE|TICKET_UPDATED|TICKET_CREATED|TICKET_STATUS_CHANGED",
  "ticketId": "string",
  "tenantId": "string",
  "payload": {}
}
```

Regras de atualização:
- NEW_MESSAGE:
  - se ticket ativo em tela, inserir mensagem no chat em tempo real
  - atualizar preview e ordenação da lista de tickets
- TICKET_UPDATED e TICKET_STATUS_CHANGED:
  - invalidar query de detalhes do ticket
  - invalidar query da lista de tickets
- TICKET_CREATED:
  - inserir ticket no topo da lista e atualizar contadores

## 7. Fluxo do Agente Ge (IA)

### 7.1 Objetivo
Exibir claramente, no chat, quando a mensagem foi gerada pela IA Ge (Gemini) versus suporte humano.

### 7.2 Requisitos de Dados
Cada mensagem deve possuir no mínimo:
- id
- ticketId
- senderType: AI_GE | HUMAN_SUPPORT | CUSTOMER
- senderName
- content
- createdAt
- status

### 7.3 Comportamento Visual
- Mensagens AI_GE:
  - estilo visual distinto de humano
  - badge fixa Ge
  - indicação de texto gerado automaticamente
- Mensagens HUMAN_SUPPORT:
  - estilo de agente humano
  - nome do agente
- Mensagens CUSTOMER:
  - estilo de cliente

### 7.4 Componente de Monitoramento de IA
Criar painel ai-monitor no contexto do ticket contendo:
- último estado da interação com Ge
- total de sugestões geradas
- tempo médio de resposta da IA
- ações rapidas:
  - aceitar sugestão
  - editar sugestão
  - descartar sugestão

### 7.5 Regras de Integração
- Sugestoes da IA não devem ser enviadas automaticamente ao cliente.
- Envio so ocorre após confirmacao explícita do agente humano.
- Toda mensagem enviada deve registrar origem final: AI_ASSISTED ou HUMAN_TYPED.

## 8. Telas e Componentes

## 8.1 Tela de Login
Componentes:
- Input idEmpresa
- Input nickname
- Input password
- Botão entrar
- Feedback de erro

Regras:
- Validar campos obrigatórios antes do submit.
- Chamar POST /login-equipe.
- Armazenar JWT e AuthSource no localStorage.
- Armazenar tenantId e role para controle de acesso e headers.

## 8.2 Dashboard
Cards obrigatórios:
- Total
- Aberto
- Aguardando

Comportamento:
- Carregar contadores por query com cache curto.
- Atualizar contadores em eventos WebSocket de ticket.

## 8.3 Inbox
Layout:
- Sidebar esquerda com lista de tickets e filtros.
- Área central com chat do ticket selecionado.
- Painel lateral direito com detalhes do usuário.

Sidebar:
- busca por termo
- filtros de status
- lazy loading ou paginação incremental
- item de ticket com:
  - nome cliente
  - último trecho de mensagem
  - timestamp da última atividade
  - status atual

Chat central:
- lista de mensagens em ordem cronológica
- campo de composição
- ações de status do ticket
- suporte a atualização em tempo real via WebSocket

## 8.4 Detalhes do Usuário
Painel lateral direito com:
- Nome
- E-mail
- Tenant

Campos adicionais recomendados:
- telefone
- idioma preferencial
- canal de origem

## 8.5 Componentes Reutilizáveis Mínimos
- AppShell
- HeaderBar
- SidebarTickets
- TicketListItem
- ChatMessageBubble
- MessageComposer
- TicketStatusSelector
- UserDetailsPanel
- SummaryCard
- EmptyState
- ErrorState
- LoadingSkeleton

## 9. Gerenciamento de Estado e Dados

### 9.1 TanStack Query
- Queries por feature com chaves padronizadas:
  - ['auth','me']
  - ['tickets','list',filters,page]
  - ['tickets','detail',ticketId]
  - ['tickets','messages',ticketId]
- Mutations para:
  - login
  - atualizar status do ticket
  - enviar mensagem
  - registrar device token
- Invalidação seletiva após mutações e eventos WebSocket.

### 9.2 Estado de Sessão
Storage local em src/lib/storage/session.ts com funções:
- getToken
- setToken
- clearSession
- getTenantId
- setTenantId
- getUserRole
- setUserRole

## 10. Regras de Negócio e Segurança

### 10.1 Multi-tenant
- X-Tenant-ID é obrigatório em todas as requisições.
- Para role SUPPORT ou ADMIN, aplicar bypass de tenant quando backend permitir operação global.
- Para demais roles, tenant deve ser sempre o tenant da sessão.

### 10.2 Autenticação e Autorização
- JWT obrigatório para rotas protegidas e chamadas privadas.
- 401 sempre encerra sessão local e redireciona ao login.
- Não persistir dados sensíveis além do necessario.

### 10.3 Resiliência
- Tratar timeout e indisponibilidade de API com mensagens claras.
- Exibir estados de carregamento e erro em todas as views de dados.
- Reconectar WebSocket automaticamente.

### 10.4 Segurança de Frontend
- Não logar token JWT em console.
- Sanitizar entrada do usuário antes de renderização em contexto rico.
- Usar sempre HTTPS para API e WebSocket em produção.

## 11. Contratos de Tipagem (TypeScript)

### 11.1 Tipos Base
```
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CANCELED' | 'RESOLVED';

export interface AuthUser {
  id: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  idEmpresa: string;
  nickname: string;
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
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderType: 'AI_GE' | 'HUMAN_SUPPORT' | 'CUSTOMER';
  senderName: string;
  content: string;
  createdAt: string;
}
```

## 12. Critérios de Aceite Funcional

### 12.1 Login
- Dado usuário válido, quando autenticar, deve navegar para /dashboard.
- Dado usuário inválido, deve exibir erro sem quebrar a UI.

### 12.2 Inbox e Chat
- Ao selecionar ticket, deve carregar detalhes e mensagens.
- Ao receber NEW_MESSAGE por WebSocket, chat e lista devem atualizar sem reload.
- Alteração de status deve refletir na UI e persistir via API.

### 12.3 Segurança
- Toda request autenticada deve carregar Authorization e X-Tenant-ID.
- Em 401, usuário deve voltar para /login com sessão limpa.

### 12.4 IA Ge
- Mensagens da IA devem ser visualmente distinguíveis.
- Sugestão da IA so e enviada ao cliente após confirmacao humana.

## 13. Plano de Implementação Sugerido
1. Bootstrap do projeto com Vite + React + TypeScript + Tailwind.
2. Implementar infraestrutura base (router, axios, query client, storage).
3. Implementar autenticação e rota protegida.
4. Implementar dashboard com resumo.
5. Implementar inbox com lista paginada e detalhes.
6. Implementar chat, envio de mensagens e troca de status.
7. Integrar WebSocket e invalidações em tempo real.
8. Integrar painel de monitoramento da IA Ge.
9. Finalizar estados de erro, carregamento e acessibilidade.
10. Validar critérios de aceite.

## 14. Resultado Esperado
Ao final da implementação, a aplicação web deve permitir operação completa de suporte com autenticação, multi-tenant, visualização de tickets, atendimento em tempo real via chat, diferenciação de mensagens de IA Ge e controles de segurança alinhados ao backend.
