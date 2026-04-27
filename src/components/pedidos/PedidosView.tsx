import { useMemo, useState } from "react";
import { useData } from "@/store/data-store";
import { Pedido } from "@/types";
import { isAtrasado, totalEntregue } from "@/lib/pedido-utils";
import { PedidoCard } from "./PedidoCard";
import { NovoPedidoModal } from "./NovoPedidoModal";
import { RegistrarEntregaModal } from "./RegistrarEntregaModal";
import { FinalizarPedidoModal } from "./FinalizarPedidoModal";
import { HistoricoEntregasModal } from "./HistoricoEntregasModal";
import { HistoricoGeralModal } from "@/components/historico/HistoricoGeralModal";
import { Plus, History, Package, Clock, TriangleAlert, CheckCircle2, Search, PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";

type Filter = "todos" | "pendentes" | "atrasados" | "concluidos";

export function PedidosView() {
  const { pedidos, entregas, fornecedores } = useData();
  const [search, setSearch] = useState("");
  const [fornFiltro, setFornFiltro] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [openNovo, setOpenNovo] = useState(false);
  const [openHistGeral, setOpenHistGeral] = useState(false);
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [pedidoEntrega, setPedidoEntrega] = useState<Pedido | null>(null);
  const [pedidoFinalizar, setPedidoFinalizar] = useState<Pedido | null>(null);
  const [pedidoHist, setPedidoHist] = useState<Pedido | null>(null);

  const stats = useMemo(() => {
    const total = pedidos.length;
    const pendentes = pedidos.filter((p) => p.status === "pendente").length;
    const atrasados = pedidos.filter((p) => isAtrasado(p)).length;
    const concluidos = pedidos.filter((p) => p.status === "concluido").length;
    return { total, pendentes, atrasados, concluidos };
  }, [pedidos]);

  const filtered = useMemo(() => {
    return pedidos.filter((p) => {
      if (search && !(`${p.produto} ${fornecedores.find((f) => f.id === p.fornecedor_id)?.nome ?? ""}`
        .toLowerCase().includes(search.toLowerCase()))) return false;
      if (fornFiltro && p.fornecedor_id !== fornFiltro) return false;
      if (filter === "pendentes" && p.status !== "pendente") return false;
      if (filter === "atrasados" && !isAtrasado(p)) return false;
      if (filter === "concluidos" && p.status !== "concluido") return false;
      return true;
    });
  }, [pedidos, search, fornFiltro, filter, fornecedores]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold">Pedidos de Matéria Prima</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Acompanhe pedidos por fornecedor e registre entregas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenHistGeral(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground border border-border rounded-lg px-3 py-2 bg-[hsl(var(--surface-2))] hover:border-primary/40 transition-colors"
          >
            <History className="w-4 h-4" /> Histórico Geral
          </button>
          <button
            onClick={() => { setEditingPedido(null); setOpenNovo(true); }}
            className="flex items-center gap-1.5 text-sm font-semibold bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg px-4 py-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Novo Pedido
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" icon={<Package className="w-5 h-5 text-faint" />} value={stats.total} />
        <StatCard label="Pendentes" icon={<Clock className="w-5 h-5 text-amber-500" />} value={stats.pendentes} valueClass="text-amber-500" />
        <StatCard label="Atrasados" icon={<TriangleAlert className="w-5 h-5 text-destructive" />} value={stats.atrasados} valueClass="text-destructive" />
        <StatCard label="Concluídos" icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} value={stats.concluidos} valueClass="text-emerald-500" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto ou fornecedor..."
            className="w-full bg-[hsl(var(--surface-2))] border border-border text-foreground rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={fornFiltro} onChange={(e) => setFornFiltro(e.target.value)}
          className="bg-[hsl(var(--surface-2))] border border-border text-foreground rounded-lg px-3 py-2 text-sm sm:w-52 outline-none"
        >
          <option value="">Todos os fornecedores</option>
          {fornecedores.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
        </select>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["todos", "pendentes", "atrasados", "concluidos"] as Filter[]).map((f) => (
            <button
              key={f} onClick={() => setFilter(f)}
              className={cn("ep-pill", filter === f ? "ep-pill-active" : "ep-pill-inactive")}
            >
              {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="ep-card flex flex-col items-center justify-center py-20 text-muted-foreground">
            <PackageSearch className="w-10 h-10 mb-3 opacity-40" strokeWidth={1.5} />
            <p className="text-sm">Nenhum pedido encontrado</p>
          </div>
        )}
        {filtered.map((p) => (
          <PedidoCard
            key={p.id} pedido={p}
            onRegistrarEntrega={(pp) => setPedidoEntrega(pp)}
            onFinalizar={(pp) => setPedidoFinalizar(pp)}
            onHistorico={(pp) => setPedidoHist(pp)}
            onEditar={(pp) => { setEditingPedido(pp); setOpenNovo(true); }}
          />
        ))}
      </div>

      <NovoPedidoModal open={openNovo} onClose={() => { setOpenNovo(false); setEditingPedido(null); }} editing={editingPedido} />
      <RegistrarEntregaModal open={!!pedidoEntrega} onClose={() => setPedidoEntrega(null)} pedido={pedidoEntrega} />
      <FinalizarPedidoModal open={!!pedidoFinalizar} onClose={() => setPedidoFinalizar(null)} pedido={pedidoFinalizar} />
      <HistoricoEntregasModal open={!!pedidoHist} onClose={() => setPedidoHist(null)} pedido={pedidoHist} />
      <HistoricoGeralModal open={openHistGeral} onClose={() => setOpenHistGeral(false)} />
    </>
  );
}

function StatCard({ label, value, icon, valueClass }: { label: string; value: number; icon: React.ReactNode; valueClass?: string }) {
  return (
    <div className="ep-card p-4 flex flex-col items-center justify-center gap-1.5 text-center">
      {icon}
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-2xl font-bold", valueClass ?? "text-foreground")}>{value}</span>
    </div>
  );
}