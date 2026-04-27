import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MainTabs, TabKey } from "@/components/layout/Tabs";
import { PedidosView } from "@/components/pedidos/PedidosView";
import { EstoqueView } from "@/components/estoque/EstoqueView";
import { FornecedoresModal } from "@/components/fornecedores/FornecedoresModal";
import { useData } from "@/store/data-store";

export default function Index() {
  const [tab, setTab] = useState<TabKey>("pedidos");
  const [openForn, setOpenForn] = useState(false);
  const { loading, usingSupabase } = useData();

  return (
    <div className="min-h-screen bg-background text-foreground">
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

      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Carregando...</div>
        ) : tab === "pedidos" ? (
          <PedidosView />
        ) : (
          <EstoqueView />
        )}
      </main>

      <FornecedoresModal open={openForn} onClose={() => setOpenForn(false)} />
    </div>
  );
}
