# Project Memory

## Core
Estoque Pro faz parte do hub SaaS multi-tenant **Nexus Grid** (https://hubnexusgrid.lovable.app, login em /login). Cor primária âmbar/laranja (HSL 22 92% 45%), fonte Inter.
Auth e billing são SEMPRE no hub. Botões "Entrar"/"Assinar" do Estoque Pro DEVEM apontar para hubLoginUrl()/hubSignupUrl() em src/lib/hub.ts. Nunca criar tela de login local.
Backend é Supabase compartilhado com o hub (projeto NÃO usa Lovable Cloud — usuário rejeitou explicitamente).
Layout: AppSidebar + TopBar (com HubBadge) + main + painel direito de Pedidos pendentes. Sempre usar tokens HSL, nunca cores hardcoded.
Rotas app: /app/estoque /app/pedidos /app/fornecedores /app/historico /app/configuracoes. Landing em /. Padrão Light por default.
Estado em Zustand (src/lib/stock-store.ts) com persist localStorage 'estoque-local-v2'.

## Memories
- [Padrão do hub](mem://design/hub-pattern) — Layout sidebar+topbar+painel comum a todos os apps do hub
