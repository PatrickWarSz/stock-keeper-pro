# Project Memory

## Core
Estoque Pro faz parte de um hub SaaS multi-tenant. Cor primária âmbar/laranja (HSL 22 92% 45%), fonte Inter.
Layout: AppSidebar + TopBar + main + painel direito de Pedidos pendentes. Sempre usar tokens HSL, nunca cores hardcoded.
Rotas: /estoque /pedidos /fornecedores /historico /configuracoes. Padrão Light por default.
Estado em Zustand (src/lib/stock-store.ts) com persist localStorage 'estoque-local-v2'.

## Memories
- [Padrão do hub](mem://design/hub-pattern) — Layout sidebar+topbar+painel comum a todos os apps do hub
