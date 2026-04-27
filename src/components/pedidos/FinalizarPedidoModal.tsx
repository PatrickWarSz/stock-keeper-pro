import { EpModal, EpButton } from "@/components/ui/EpModal";
import { useData } from "@/store/data-store";
import { Pedido } from "@/types";
import { totalEntregue } from "@/lib/pedido-utils";
import { CheckCircle2 } from "lucide-react";

export function FinalizarPedidoModal({
  open, onClose, pedido,
}: { open: boolean; onClose: () => void; pedido: Pedido | null }) {
  const { entregas, finalizarPedido } = useData();
  if (!pedido) return null;
  const entregue = totalEntregue(pedido, entregas);
  const pendente = pedido.quantidade - entregue;
  return (
    <EpModal
      open={open} onClose={onClose}
      title="Finalizar Pedido?" subtitle="Esta ação marcará o pedido como concluído."
      icon={<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <CheckCircle2 className="w-5 h-5 text-primary" />
      </div>}
      size="sm"
      footer={<>
        <EpButton variant="ghost" onClick={onClose}>Cancelar</EpButton>
        <EpButton onClick={async () => { await finalizarPedido(pedido.id); onClose(); }}>Confirmar</EpButton>
      </>}
    >
      <div className="bg-[hsl(var(--surface-2))] rounded-xl border border-border p-3 text-xs text-muted-foreground space-y-1">
        <div>Pedido: <strong className="text-foreground">{pedido.produto}</strong></div>
        <div>Entregue: <strong className={pendente > 0 ? "text-amber-500" : "text-emerald-500"}>
          {entregue} de {pedido.quantidade} {pedido.unidade}
        </strong></div>
        {pendente > 0 && <div className="text-amber-600">⚠ Há itens pendentes de entrega.</div>}
      </div>
    </EpModal>
  );
}