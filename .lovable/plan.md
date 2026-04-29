# Plano — Estoque Pro vira o primeiro app satélite real do Nexus Grid

Foco desta sessão: **só o lado do Estoque Pro**, conforme contrato aprovado. Sem mexer em billing, sem migrar dados ainda — apenas plugar auth/entitlement. A migração das tabelas `estoque_*` fica para uma sessão seguinte (ver "Fora de escopo").

## 1. Configurar Supabase compartilhado

- Criar `.env` com as credenciais do Hub (você cola os valores que pegou no projeto Hub):
  ```
  VITE_SUPABASE_URL=<mesma URL do Hub>
  VITE_SUPABASE_PUBLISHABLE_KEY=<mesma anon key do Hub>
  VITE_SUPABASE_PROJECT_ID=<mesmo project id>
  ```
- Atualizar `.env.example` com os mesmos nomes (sem valores).
- Criar `src/lib/supabase.ts` exportando um cliente único:
  - `createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit', storageKey: 'sb-<project-ref>-auth-token' } })`
  - `detectSessionInUrl: true` é o que faz o handoff via fragment funcionar automaticamente.

## 2. Hook `useHubSession` — porteiro do app

Novo arquivo `src/hooks/useHubSession.ts`. Comportamento:

1. Roda no mount do `AppLayout`.
2. Lê `supabase.auth.getSession()`. Se não houver sessão → `window.location.href = hubLoginUrl()`.
3. Registra `supabase.auth.onAuthStateChange` para reagir a logout em outra aba.
4. Com sessão válida, consulta:
   ```ts
   supabase.from('v_module_access_effective')
     .select('effective_status, trial_days_left')
     .eq('module_id', 'estoque')
     .maybeSingle()
   ```
5. Se `effective_status === 'blocked'` ou linha ausente → redireciona para `${HUB_BASE_URL}/programas/estoque`.
6. Se `trial`, expõe `trialDaysLeft` para a UI mostrar um aviso na TopBar.
7. Retorna `{ session, user, profile, effectiveStatus, trialDaysLeft, loading }`.

Buscar `profiles.full_name` em paralelo para usar na TopBar.

## 3. Proteger rotas `/app/*`

- Em `src/pages/AppLayout.tsx`: chamar `useHubSession()`. Enquanto `loading`, renderizar um skeleton/spinner full-screen. Sem sessão → o hook já redireciona, então o componente nunca chega a renderizar conteúdo sensível.
- A landing `/` continua 100% pública.

## 4. TopBar com usuário real e logout

- `src/components/layout/TopBar.tsx`: adicionar à direita (depois do `HubBadge`):
  - Aviso de trial: se `trialDaysLeft != null`, badge âmbar com "Trial: X dias".
  - Avatar/menu com `full_name` ou email.
  - Item "Sair" → `await supabase.auth.signOut()` + `window.location.href = HUB_BASE_URL`.
  - Item "Voltar ao Hub" → abre `HUB_BASE_URL` em nova aba.

## 5. Landing pública aceitar handoff também

A landing `/` precisa também ter `detectSessionInUrl` rodando — basta importar o cliente em algum lugar carregado no boot (ex: `src/main.tsx` faz `import './lib/supabase'`). Assim, se o Hub mandar usuário direto pra `https://estoquemat.lovable.app/#access_token=...`, a sessão é capturada antes de qualquer navegação.

Bônus: se a landing detectar sessão ativa **e** entitlement ativo, trocar os CTAs "Começar grátis" / "Entrar" por um único "Abrir Estoque Pro" → `/app/estoque`. Pequena melhora de UX, sem custo.

## 6. Memória do projeto

Atualizar `mem://index.md` (Core) com as regras novas:
- Cliente Supabase único em `src/lib/supabase.ts` usando as credenciais do Hub Nexus (mesmo project ref).
- Toda rota `/app/*` passa pelo `useHubSession`. Sem sessão → redireciona pro Hub. Sem entitlement (`v_module_access_effective.effective_status !== 'active'|'trial'`) → redireciona pra landing do programa no Hub.
- Handoff de sessão: o cliente Supabase está com `detectSessionInUrl: true`, então tokens chegando no fragment `#access_token=...` são consumidos automaticamente.
- Logout: `supabase.auth.signOut()` + redirect pro `HUB_BASE_URL`.

## Arquivos afetados

```text
NOVO   .env                         (credenciais do Hub — você preenche)
EDIT   .env.example                 (renomear chaves p/ casar com Hub)
NOVO   src/lib/supabase.ts          (cliente único)
NOVO   src/hooks/useHubSession.ts   (porteiro: sessão + entitlement)
EDIT   src/main.tsx                 (import do cliente p/ rodar detectSessionInUrl cedo)
EDIT   src/pages/AppLayout.tsx      (usa useHubSession + skeleton)
EDIT   src/components/layout/TopBar.tsx  (user menu, logout, aviso trial)
EDIT   src/pages/LandingPage.tsx    (CTA "Abrir app" se já logado+ativo)
EDIT   mem/index.md                 (regras novas)
```

## Detalhes técnicos

- **Storage key compartilhada**: como Hub e satélite usam o mesmo project ref, ambos os clientes Supabase escrevem em `sb-<ref>-auth-token`. Em origins diferentes o `localStorage` não cruza — por isso o handoff via fragment é necessário no primeiro acesso. Depois disso, o satélite tem sua própria sessão persistida e o `autoRefreshToken` mantém ela viva.
- **Sem service role**: o cliente é criado com a anon key. RLS do Supabase faz o resto.
- **`v_module_access_effective`**: a view já filtra por `tenant_id` do usuário logado via RLS. Não precisamos passar `tenant_id` manualmente.
- **`zustand persist` continua**: `estoque-local-v2` segue funcionando como cache local até a migração pro Supabase. Nada quebra.
- **CORS / domínios**: nada pra configurar — Supabase aceita qualquer origin com a anon key.

## Fora de escopo (vai pra próxima sessão)

- Criar tabelas `estoque_categorias`, `estoque_itens`, `estoque_movimentacoes`, `estoque_pedidos`, `estoque_fornecedores` com `tenant_id` + RLS.
- Migrar dados do `localStorage` (zustand) pro Supabase + sync.
- Trocar o `stock-store` para escrever no Supabase em vez de só `localStorage`.
- Billing real (Stripe/Paddle) — quando entrar no Hub, o satélite não precisa mudar nada.

## Pré-requisito antes de aprovar

Você precisa ter em mãos (do `.env` do projeto Hub):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key)
- `VITE_SUPABASE_PROJECT_ID`

Sem esses três valores o app vai redirecionar pro Hub mas não vai conseguir validar entitlement. Se preferir, aprove o plano e me passe os valores na próxima mensagem — eu configuro tudo de uma vez.