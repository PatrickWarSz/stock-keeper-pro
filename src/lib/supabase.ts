import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase ÚNICO do Estoque Pro.
 *
 * Usa as MESMAS credenciais do Hub Nexus Grid (mesmo project ref, mesma
 * anon key). Isso é o que permite que a sessão criada no Hub seja válida
 * aqui — o JWT é assinado pelo mesmo projeto.
 *
 * Handoff de sessão: como Hub e satélite estão em origins diferentes
 * (`hubnexusgrid.lovable.app` vs `estoquemat.lovable.app`), o localStorage
 * NÃO é compartilhado entre eles. O Hub faz handoff explícito redirecionando
 * com `#access_token=...&refresh_token=...` no fragment. Com
 * `detectSessionInUrl: true` (default), o supabase-js lê o fragment
 * automaticamente no boot e persiste a sessão localmente. A partir daí,
 * `autoRefreshToken` mantém ela viva.
 *
 * NUNCA usar service role aqui — só anon key. RLS no Supabase faz o resto.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;
const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID as
  | string
  | undefined;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY,
);

if (!isSupabaseConfigured) {
  // Não derruba o app — só avisa. A landing pública continua funcionando.
  // O guardião de rota (useHubSession) é quem vai redirecionar pro Hub.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY não configurados. " +
      "Defina-os no .env com os MESMOS valores do Hub Nexus Grid.",
  );
}

/**
 * Storage key igual à do Hub para que, dentro do mesmo origin do satélite,
 * o cliente persista no slot esperado. Em origins diferentes não há
 * compartilhamento — o handoff via fragment resolve isso.
 */
const storageKey = SUPABASE_PROJECT_ID
  ? `sb-${SUPABASE_PROJECT_ID}-auth-token`
  : "sb-estoque-auth-token";

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL ?? "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY ?? "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "implicit",
      storageKey,
    },
  },
);
