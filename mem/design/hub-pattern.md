---
name: Padrão visual do hub SaaS multi-tenant
description: Estrutura de layout compartilhada entre apps do hub (Devoluções Pro, Estoque Pro, etc.)
type: design
---
Todos os apps do hub seguem o MESMO esqueleto, mudando apenas cor primária, nome e ícone:

- Layout: SidebarProvider + Sidebar esquerda (collapsible="icon") + TopBar sticky + main + painel direito opcional (xl:flex w-80)
- Sidebar: header com logo quadrada (bg-primary, ícone branco) + nome do app + tagline em uppercase 10px; grupos OPERAÇÃO e SISTEMA com label uppercase tracking-wider 10px text-muted-foreground
- TopBar: SidebarTrigger + busca global (Search icon + Input + kbd ⌘K) + badge de alertas circular à direita + toggle tema
- Painel direito: title + contador no topo, lista de cards clicáveis com badges de status
- Cores via tokens HSL em index.css (--primary, --warning, --success, --destructive). NUNCA cores hardcoded em componentes.
- Fonte: Inter
- Radius: 0.625rem
- Componentes shadcn/ui em src/components/ui/, layout do hub em src/components/layout/ (AppSidebar, TopBar, PendingOrdersPanel-like)
