import { Entrega, Pedido } from "@/types";

export function totalEntregue(pedido: Pedido, entregas: Entrega[]) {
  return entregas.filter((e) => e.pedido_id === pedido.id).reduce((acc, e) => acc + e.quantidade, 0);
}

export function totalEntradaEstoque(pedido: Pedido, entregas: Entrega[]) {
  return entregas
    .filter((e) => e.pedido_id === pedido.id && e.lancou_estoque)
    .reduce((acc, e) => acc + (e.qtd_estoque ?? 0), 0);
}

export function isAtrasado(pedido: Pedido) {
  if (pedido.status === "concluido") return false;
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const prev = new Date(pedido.data_prevista + "T00:00:00");
  return prev < hoje;
}

export function statusVisual(pedido: Pedido, entregas: Entrega[]): {
  prazoLabel: string; prazoCls: string;
  completaLabel: string; completaCls: string;
  atrasado: boolean;
} {
  const atrasado = isAtrasado(pedido);
  const entregue = totalEntregue(pedido, entregas);
  const completo = entregue >= pedido.quantidade;
  const concluido = pedido.status === "concluido";

  const prazoLabel = concluido
    ? "Entregue no Prazo"
    : atrasado ? "Atrasado" : "Dentro do Prazo";
  const prazoCls = concluido
    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
    : atrasado
    ? "bg-red-500/10 text-red-600 border-red-500/30"
    : "bg-amber-500/10 text-amber-600 border-amber-500/30";

  const completaLabel = completo ? "Completa" : "Incompleta";
  const completaCls = completo
    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
    : "bg-orange-500/10 text-orange-600 border-orange-500/30";

  return { prazoLabel, prazoCls, completaLabel, completaCls, atrasado };
}