# Project Memory

## Core
Estoque Pro faz parte do hub SaaS multi-tenant **Nexus Grid** (https://hubnexusgrid.lovable.app, login em /login). Cor primária âmbar/laranja (HSL 22 92% 45%), fonte Inter.
Auth e billing são SEMPRE no hub. Botões "Entrar"/"Assinar" do Estoque Pro DEVEM apontar para hubLoginUrl()/hubSignupUrl() em src/lib/hub.ts. Nunca criar tela de login local.
Backend é Supabase compartilhado com o hub (projeto NÃO usa Lovable Cloud — usuário rejeitou explicitamente).
Cliente Supabase único em src/lib/supabase.ts usando VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY (mesmos valores do Hub, mesmo project ref). Sempre anon key, nunca service role.
Toda rota /app/* passa por useHubSession (src/hooks/useHubSession.ts): sem sessão → redireciona para hubLoginUrl(); sem entitlement ativo (v_module_access_effective.effective_status ∉ {active,trial} para module_id='estoque') → redireciona para HUB_BASE_URL/programas/estoque.
Handoff de sessão: cliente criado com detectSessionInUrl:true. Hub redireciona para o satélite com #access_token=...&refresh_token=... no fragment; supabase-js consome no boot e persiste localmente. Por isso src/main.tsx importa "./lib/supabase" cedo.
Logout: signOutToHub() (hooks/useHubSession.ts) — supabase.auth.signOut() + window.location → HUB_BASE_URL.
Layout: AppSidebar + TopBar (com HubBadge) + main + painel direito de Pedidos pendentes. Sempre usar tokens HSL, nunca cores hardcoded.
Rotas app: /app/estoque /app/pedidos /app/fornecedores /app/historico /app/configuracoes. Landing em /. Padrão Light por default.
Estado em Zustand (src/lib/stock-store.ts) com persist localStorage 'estoque-local-v2'.

## Memories
- [Padrão do hub](mem://design/hub-pattern) — Layout sidebar+topbar+painel comum a todos os apps do hub
