# suporte.negociodebolso.com

Frontend do suporte em tempo real para operação da equipe de atendimento.

## Stack

- React 18 + TypeScript
- Vite 5
- React Router DOM
- TanStack Query
- Axios
- Tailwind CSS
- Lucide React
- SockJS + STOMP

## Scripts

- `npm run dev`: inicia ambiente local
- `npm run build`: gera build de produção
- `npm run preview`: serve o build localmente
- `npm run lint`: executa o linter
- `npm run test`: executa testes unitários

## Rotas

- `/login` (pública)
- `/dashboard` (protegida)
- `/inbox` (protegida)
- `/inbox/:ticketId` (protegida)
