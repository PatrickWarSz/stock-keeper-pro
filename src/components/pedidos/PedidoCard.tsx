import { Pedido } from "@/types";
import { useData } from "@/store/data-store";
import { brl, fmtDate } from "@/lib/format";
import { statusVisual, totalEntregue, totalEntradaEstoque } from "@/lib/pedido-utils";
import { CheckCircle2, Clock, TriangleAlert, Truck, History, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  pedido: Pedido;
  onRegistrarEntrega: (p: Pedido) => void;
  onFinalizar: (p: Pedido) => void;
  onHistorico: (p: Pedido) => void;
  onEditar: (p: Pedido) => void;
}

export function PedidoCard({ pedido, onRegistrarEntrega, onFinalizar, onHistorico, onEditar }: Props) {
  const { fornecedores, itens, categorias, entregas, deletePedido } = useData();
  const fornecedor = fornecedores.find((f) => f.id === pedido.fornecedor_id);
  const item = itens.find((i) => i.id === pedido.item_estoque_id);
  const categoria = item ? categorias.find((c) => c.id === item.categoria_id) : null;

  const sv = statusVisual(pedido, entregas);
  const entregue = totalEntregue(pedido, entregas);
  const falta = Math.max(0, pedido.quantidade - entregue);
  const total = pedido.quantidade * pedido.preco_unitario;
  const concluido = pedido.status === "concluido";
  const lastEntrega = entregas
    .filter((e) => e.pedido_id === pedido.id)
    .sort((a, b) => b.data_entrega.localeCompare(a.data_entrega))[0];

  const handleWhatsApp = () => {
    if (!fornecedor?.telefone) {
      window.alert("Fornecedor sem telefone cadastrado.");
      return;
    }
    const tel = fornecedor.telefone.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Olá ${fornecedor.contato || fornecedor.nome}, podemos confirmar o pedido de ${pedido.quantidade} ${pedido.unidade} de ${pedido.produto}? Previsão de entrega: ${fmtDate(pedido.data_prevista)}.`
    );
    window.open(`https://wa.me/55${tel}?text=${msg}`, "_blank");
  };

  return (
    <div className={cn(
      "ep-card p-4 transition-shadow hover:shadow-md",
      sv.atrasado && "border-l-4 border-l-destructive",
      concluido && "opacity-90",
    )}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="font-semibold text-sm">{pedido.produto}</span>
            <span className={cn("ep-badge", sv.prazoCls)}>
              {concluido ? <CheckCircle2 className="w-3 h-3" /> :
               sv.atrasado ? <TriangleAlert className="w-3 h-3" /> :
               <Clock className="w-3 h-3" />}
              {sv.prazoLabel}
            </span>
            <span className={cn("ep-badge", sv.completaCls)}>{sv.completaLabel}</span>
            {totalEntradaEstoque(pedido, entregas) > 0 && (
              <span className="ep-badge bg-blue-500/10 text-blue-600 border-blue-500/30">
                <CheckCircle2 className="w-3 h-3" /> Entrada lançada
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-1.5">
            <span><span className="text-faint">Fornecedor:</span> <strong>{fornecedor?.nome ?? "—"}</strong></span>
            <span><span className="text-faint">Pedido:</span> {fmtDate(pedido.data_pedido)}</span>
            <span><span className="text-faint">Prev.:</span> {fmtDate(pedido.data_prevista)}</span>
            {lastEntrega && <span><span className="text-faint">Entrega:</span> {fmtDate(lastEntrega.data_entrega)}</span>}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-1.5">
            <span>Pedido: <strong>{pedido.quantidade} {pedido.unidade}</strong></span>
            <span>Entregue: <strong>{entregue} {pedido.unidade}</strong></span>
            {falta > 0 && <span className="text-destructive font-medium">Falta: {falta} {pedido.unidade}</span>}
            {totalEntradaEstoque(pedido, entregas) > 0 && item && (
              <span>Entrada estoque: <strong>{totalEntradaEstoque(pedido, entregas)} {item.unidade}</strong></span>
            )}
            <span>Preço/{pedido.unidade}: <strong>{brl(pedido.preco_unitario)}</strong></span>
            <span>Total: <strong>{brl(total)}</strong></span>
          </div>
          {item && (
            <div className="text-xs text-muted-foreground">
              Item no estoque: <span className="text-primary">{categoria?.nome ?? "—"} → {item.nome}</span>
            </div>
          )}
          {pedido.observacao && (
            <div className="text-xs text-faint mt-1 italic">{pedido.observacao}</div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
          {!concluido && (
            <>
              <button
                onClick={() => onRegistrarEntrega(pedido)}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg px-3 py-1.5 transition-colors"
              >
                <Truck className="w-3.5 h-3.5" /> Registrar Entrega
              </button>
              <button
                onClick={() => onFinalizar(pedido)}
                className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 rounded-lg px-3 py-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Finalizar Pedido
              </button>
            </>
          )}
          <button
            onClick={() => onHistorico(pedido)}
            className="flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 rounded-lg px-3 py-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5" /> Histórico
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 rounded-lg px-3 py-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </button>
          <button
            onClick={() => onEditar(pedido)}
            className="w-7 h-7 rounded-lg bg-[hsl(var(--surface-2))] border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { if (confirm("Excluir este pedido?")) deletePedido(pedido.id); }}
            className="w-7 h-7 rounded-lg bg-[hsl(var(--surface-2))] border border-border flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}