import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MainTabs, TabKey } from "@/components/layout/Tabs";
import { PedidosView } from "@/components/pedidos/PedidosView";
import { EstoqueView } from "@/components/estoque/EstoqueView";
import { FornecedoresModal } from "@/components/fornecedores/FornecedoresModal";
import { useData } from "@/store/data-store";

export default function Index() {
  const [tab, setTab] = useState<TabKey>("estoque");
  const [openForn, setOpenForn] = useState(false);
  const { loading, usingSupabase } = useData();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header onOpenFornecedores={() => setOpenForn(true)} />
      <MainTabs active={tab} onChange={setTab} />

      {!usingSupabase && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs">
          <div className="max-w-screen-xl mx-auto px-4 py-2">
            ⚙️ Modo offline (localStorage). Configure <code className="font-mono">VITE_SUPABASE_URL</code> e{" "}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> no <code className="font-mono">.env</code> para ativar o Supabase.
          </div>
        </div>
      )}

      <main className="max-w-screen-xl mx-auto w-full px-4 py-6 flex-1">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Carregando...</div>
        ) : tab === "pedidos" ? (
          <PedidosView />
        ) : (
          <EstoqueView />
        )}
      </main>

      <footer className="border-t border-border bg-[hsl(var(--surface))] py-4 mt-auto">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-primary/15 text-primary flex items-center justify-center">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </span>
            <span className="font-medium text-foreground">Estoque Pro</span>
          </div>
          <div>Sistema de Controle de Estoque de Matéria Prima</div>
          <div>© {new Date().getFullYear()} Todos os direitos reservados</div>
        </div>
      </footer>

      <FornecedoresModal open={openForn} onClose={() => setOpenForn(false)} />
    </div>
  );
}
