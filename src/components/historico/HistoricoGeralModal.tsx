import { useMemo, useState } from "react";
import { EpModal, EpButton } from "@/components/ui/EpModal";
import { useData } from "@/store/data-store";
import { fmtDateTime } from "@/lib/format";
import { Calendar, Search, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export function HistoricoGeralModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { movimentacoes, itens, categorias, pedidos, limparHistorico } = useData();
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState<"todos" | "entrada" | "saida">("todos");
  const [dtStart, setDtStart] = useState("");
  const [dtEnd, setDtEnd] = useState("");

  const list = useMemo(() => {
    return movimentacoes.filter((m) => {
      const item = itens.find((i) => i.id === m.item_id);
      const cat = item ? categorias.find((c) => c.id === item.categoria_id) : null;
      const blob = `${item?.nome ?? ""} ${cat?.nome ?? ""} ${m.observacao ?? ""}`.toLowerCase();
      if (search && !blob.includes(search.toLowerCase())) return false;
      if (tipo !== "todos" && m.tipo !== tipo) return false;
      const d = m.created_at.slice(0, 10);
      if (dtStart && d < dtStart) return false;
      if (dtEnd && d > dtEnd) return false;
      return true;
    });
  }, [movimentacoes, itens, categorias, search, tipo, dtStart, dtEnd]);

  return (
    <EpModal
      open={open} onClose={onClose}
      title="Histórico Geral de Movimentações"
      icon={<Calendar className="w-5 h-5 text-primary" />}
      size="xl"
      footer={<>
        <button
          onClick={() => { if (confirm("Limpar todo o histórico?")) limparHistorico(); }}
          className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 rounded-lg px-3 py-1.5 transition-colors mr-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Limpar histórico
        </button>
        <EpButton variant="ghost" onClick={onClose}>Fechar</EpButton>
      </>}
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar item, categoria ou descrição..."
            className="w-full bg-[hsl(var(--surface-2))] border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <select value={tipo} onChange={(e) => setTipo(e.target.value as any)}
          className="bg-[hsl(var(--surface-2))] border border-border rounded-lg px-3 py-2 text-sm sm:w-36 outline-none">
          <option value="todos">Todos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">De:</label>
          <input type="date" value={dtStart} onChange={(e) => setDtStart(e.target.value)}
            className="w-full bg-[hsl(var(--surface-2))] border border-border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Até:</label>
          <input type="date" value={dtEnd} onChange={(e) => setDtEnd(e.target.value)}
            className="w-full bg-[hsl(var(--surface-2))] border border-border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="space-y-2">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhuma movimentação encontrada.</p>
        )}
        {list.map((m) => {
          const item = itens.find((i) => i.id === m.item_id);
          const cat = item ? categorias.find((c) => c.id === item.categoria_id) : null;
          const ped = m.pedido_id ? pedidos.find((p) => p.id === m.pedido_id) : null;
          const isIn = m.tipo === "entrada";
          return (
            <div key={m.id} className="border border-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isIn ? "bg-emerald-500/15" : "bg-red-500/15"}`}>
                  {isIn ? <ArrowUp className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowDown className="w-3.5 h-3.5 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm">{item?.nome ?? "Item removido"}</div>
                      <div className="text-xs text-muted-foreground">{cat?.nome ?? "—"}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {m.origem === "pedido" ? "Entrada via entrega de pedido" :
                         isIn ? "Entrada manual" : "Saída manual"}
                        {ped && ` • ${ped.produto}`}
                      </div>
                      {m.observacao && <div className="text-xs italic text-muted-foreground mt-0.5">"{m.observacao}"</div>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`font-semibold font-mono text-sm ${isIn ? "text-emerald-600" : "text-red-600"}`}>
                        {isIn ? "+" : "-"}{m.quantidade} {item?.unidade ?? ""}
                      </div>
                      <div className="text-xs text-muted-foreground">{fmtDateTime(m.created_at)}</div>
                      <div className="text-xs text-muted-foreground">Saldo: {m.saldo_apos}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3">{list.length} movimentação(ões) encontrada(s)</p>
    </EpModal>
  );
}