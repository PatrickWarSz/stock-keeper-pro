import { EpModal, EpButton } from "@/components/ui/EpModal";
import { useData } from "@/store/data-store";
import { Pedido } from "@/types";
import { fmtDate } from "@/lib/format";
import { totalEntregue } from "@/lib/pedido-utils";
import { History } from "lucide-react";

export function HistoricoEntregasModal({
  open, onClose, pedido,
}: { open: boolean; onClose: () => void; pedido: Pedido | null }) {
  const { entregas } = useData();
  if (!pedido) return null;
  const lista = entregas
    .filter((e) => e.pedido_id === pedido.id)
    .sort((a, b) => b.data_entrega.localeCompare(a.data_entrega));
  const entregue = totalEntregue(pedido, entregas);
  return (
    <EpModal
      open={open} onClose={onClose}
      title="Histórico de Entregas" subtitle={pedido.produto}
      icon={<History className="w-5 h-5 text-purple-500" />}
      size="lg"
      footer={<EpButton variant="ghost" onClick={onClose}>Fechar</EpButton>}
    >
      <div className="bg-[hsl(var(--surface-2))] rounded-xl border border-border p-3 mb-3 text-sm space-y-1">
        <div>Total Pedido: <strong>{pedido.quantidade} {pedido.unidade}</strong></div>
        <div>Total Entregue: <strong>{entregue} {pedido.unidade}</strong></div>
      </div>
      {lista.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma entrega registrada.</p>}
      <div className="space-y-2">
        {lista.map((e, idx) => (
          <div key={e.id} className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-3 text-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="ep-badge bg-[hsl(var(--surface))] text-muted-foreground border-border">
                  Entrega #{lista.length - idx}
                </span>
                <span className="font-medium">{fmtDate(e.data_entrega)}</span>
              </div>
              {e.lancou_estoque && (
                <span className="ep-badge bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                  Estoque atualizado
                </span>
              )}
            </div>
            <div className="text-muted-foreground text-xs space-y-0.5">
              <div>Quantidade: <strong>{e.quantidade} {pedido.unidade}</strong></div>
              {e.lancou_estoque && e.qtd_estoque != null && (
                <div>Entrada estoque: <strong>{e.qtd_estoque}</strong></div>
              )}
              {e.observacao && <div className="italic">"{e.observacao}"</div>}
            </div>
          </div>
        ))}
      </div>
    </EpModal>
  );
}