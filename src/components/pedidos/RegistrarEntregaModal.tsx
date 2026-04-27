import { useEffect, useMemo, useState } from "react";
import { EpModal, EpButton } from "@/components/ui/EpModal";
import { EpField, epInput, Toggle } from "@/components/ui/EpField";
import { useData } from "@/store/data-store";
import { Pedido } from "@/types";
import { totalEntregue } from "@/lib/pedido-utils";
import { todayISO } from "@/lib/format";
import { Truck } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  pedido: Pedido | null;
}

export function RegistrarEntregaModal({ open, onClose, pedido }: Props) {
  const { entregas, itens, registrarEntrega } = useData();
  const [data, setData] = useState(todayISO());
  const [qtd, setQtd] = useState<number | "">("");
  const [lancarEstoque, setLancarEstoque] = useState(true);
  const [qtdEstoque, setQtdEstoque] = useState<number | "">("");
  const [observacao, setObservacao] = useState("");

  const item = useMemo(() => pedido?.item_estoque_id
    ? itens.find((i) => i.id === pedido.item_estoque_id) ?? null
    : null, [pedido, itens]);

  const saldo = pedido ? Math.max(0, pedido.quantidade - totalEntregue(pedido, entregas)) : 0;

  useEffect(() => {
    if (open && pedido) {
      setData(todayISO());
      setQtd(saldo);
      setLancarEstoque(Boolean(item));
      setQtdEstoque("");
      setObservacao("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pedido?.id]);

  if (!pedido) return null;

  const handleSave = async () => {
    if (!qtd || Number(qtd) <= 0) { alert("Informe a quantidade entregue."); return; }
    await registrarEntrega({
      pedidoId: pedido.id,
      data_entrega: data,
      quantidade: Number(qtd),
      qtd_estoque: lancarEstoque && item ? Number(qtdEstoque) || 0 : null,
      lancou_estoque: Boolean(lancarEstoque && item && Number(qtdEstoque) > 0),
      observacao: observacao.trim() || null,
      item_estoque_id: item?.id ?? null,
    });
    onClose();
  };

  return (
    <EpModal
      open={open} onClose={onClose}
      title="Registrar Entrega"
      subtitle={pedido.produto}
      icon={<Truck className="w-5 h-5 text-emerald-500" />}
      size="lg"
      footer={<>
        <EpButton variant="ghost" onClick={onClose}>Cancelar</EpButton>
        <EpButton onClick={handleSave}>
          <Truck className="w-4 h-4" /> Confirmar Entrega
        </EpButton>
      </>}
    >
      <div className="bg-[hsl(var(--surface-2))] rounded-lg border border-border px-4 py-2.5 mb-4 text-sm">
        Saldo a entregar: <strong>{saldo} {pedido.unidade}</strong>
      </div>
      <div className="space-y-4">
        <EpField label="Data de Entrega" required>
          <input type="date" className={epInput} value={data} onChange={(e) => setData(e.target.value)} />
        </EpField>
        <div className="grid grid-cols-2 gap-3">
          <EpField label={`Quantidade Entregue (${pedido.unidade})`} required>
            <input type="number" min="0" step="0.01" className={epInput} value={qtd}
              onChange={(e) => setQtd(e.target.value === "" ? "" : Number(e.target.value))} />
          </EpField>
          {item && lancarEstoque && (
            <EpField label={`Qtd para entrada no estoque (${item.unidade})`}
              hint="Informe a quantidade no formato da unidade do item vinculado.">
              <input type="number" min="0" step="0.01" className={epInput} value={qtdEstoque}
                onChange={(e) => setQtdEstoque(e.target.value === "" ? "" : Number(e.target.value))} />
            </EpField>
          )}
        </div>
        {item && (
          <div className="border border-border rounded-xl p-4 bg-[hsl(var(--surface-2))]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Lançar entrada no estoque?
              </p>
              <Toggle checked={lancarEstoque} onChange={setLancarEstoque} />
            </div>
            <p className="text-xs text-muted-foreground">
              Item vinculado: <strong className="text-foreground">{item.nome}</strong>
            </p>
            {lancarEstoque && Number(qtdEstoque) > 0 && (
              <p className="text-xs text-emerald-600 mt-2 font-medium">
                ✓ Serão adicionados <strong>{qtdEstoque} {item.unidade}</strong> ao item.
              </p>
            )}
          </div>
        )}
        <EpField label="Observação">
          <textarea className={epInput + " h-20 resize-none"} value={observacao}
            onChange={(e) => setObservacao(e.target.value)} placeholder="Ex: Romaneio 1234..." />
        </EpField>
      </div>
    </EpModal>
  );
}