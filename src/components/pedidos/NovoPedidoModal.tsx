import { useEffect, useMemo, useState } from "react";
import { EpModal, EpButton } from "@/components/ui/EpModal";
import { EpField, epInput } from "@/components/ui/EpField";
import { useData } from "@/store/data-store";
import { Pedido } from "@/types";
import { brl, todayISO } from "@/lib/format";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: Pedido | null;
}

export function NovoPedidoModal({ open, onClose, editing }: Props) {
  const { fornecedores, itens, addPedido, updatePedido } = useData();
  const [produto, setProduto] = useState("");
  const [fornecedorId, setFornecedorId] = useState<string>("");
  const [dataPedido, setDataPedido] = useState(todayISO());
  const [dataPrevista, setDataPrevista] = useState(todayISO());
  const [quantidade, setQuantidade] = useState<number | "">("");
  const [unidade, setUnidade] = useState("kg");
  const [precoUnitario, setPrecoUnitario] = useState<number | "">("");
  const [itemEstoqueId, setItemEstoqueId] = useState<string>("");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    if (editing) {
      setProduto(editing.produto);
      setFornecedorId(editing.fornecedor_id ?? "");
      setDataPedido(editing.data_pedido);
      setDataPrevista(editing.data_prevista);
      setQuantidade(editing.quantidade);
      setUnidade(editing.unidade);
      setPrecoUnitario(editing.preco_unitario);
      setItemEstoqueId(editing.item_estoque_id ?? "");
      setObservacao(editing.observacao ?? "");
    } else if (open) {
      setProduto(""); setFornecedorId(""); setDataPedido(todayISO()); setDataPrevista(todayISO());
      setQuantidade(""); setUnidade("kg"); setPrecoUnitario(""); setItemEstoqueId(""); setObservacao("");
    }
  }, [editing, open]);

  const valorEstimado = useMemo(() =>
    (Number(quantidade) || 0) * (Number(precoUnitario) || 0), [quantidade, precoUnitario]);

  const handleSave = async () => {
    if (!produto.trim() || !fornecedorId || !quantidade || !precoUnitario) {
      toast.error("Preencha produto, fornecedor, quantidade e preço.");
      return;
    }
    const payload = {
      produto: produto.trim(),
      fornecedor_id: fornecedorId,
      data_pedido: dataPedido,
      data_prevista: dataPrevista,
      quantidade: Number(quantidade),
      unidade,
      preco_unitario: Number(precoUnitario),
      item_estoque_id: itemEstoqueId || null,
      observacao: observacao.trim() || null,
    };
    if (editing) await updatePedido(editing.id, payload);
    else await addPedido(payload);
    onClose();
  };

  return (
    <EpModal
      open={open} onClose={onClose}
      title={editing ? "Editar Pedido" : "Novo Pedido"}
      subtitle="Cadastre um novo pedido de matéria prima"
      icon={<ShoppingCart className="w-5 h-5 text-primary" />}
      size="xl"
      footer={<>
        <EpButton variant="ghost" onClick={onClose}>Cancelar</EpButton>
        <EpButton onClick={handleSave}>{editing ? "Salvar" : "Criar Pedido"}</EpButton>
      </>}
    >
      <div className="space-y-4">
        <EpField label="Produto" required>
          <input className={epInput} value={produto} onChange={(e) => setProduto(e.target.value)} placeholder="Ex: Tecido Suplex Preto" />
        </EpField>
        <div className="grid grid-cols-2 gap-3">
          <EpField label="Fornecedor" required>
            <select className={epInput} value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)}>
              <option value="">Selecione...</option>
              {fornecedores.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
          </EpField>
          <EpField label="Vincular ao item de estoque">
            <select className={epInput} value={itemEstoqueId} onChange={(e) => setItemEstoqueId(e.target.value)}>
              <option value="">Nenhum</option>
              {itens.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
            </select>
          </EpField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <EpField label="Data do Pedido" required>
            <input type="date" className={epInput} value={dataPedido} onChange={(e) => setDataPedido(e.target.value)} />
          </EpField>
          <EpField label="Data Prevista" required>
            <input type="date" className={epInput} value={dataPrevista} onChange={(e) => setDataPrevista(e.target.value)} />
          </EpField>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <EpField label="Quantidade" required>
            <input type="number" min="0" step="0.01" className={epInput} value={quantidade}
              onChange={(e) => setQuantidade(e.target.value === "" ? "" : Number(e.target.value))} />
          </EpField>
          <EpField label="Unidade" required>
            <select className={epInput} value={unidade} onChange={(e) => setUnidade(e.target.value)}>
              {["kg", "un", "rolo", "m", "L", "pç", "cx"].map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </EpField>
          <EpField label="Preço unitário (R$)" required>
            <input type="number" min="0" step="0.01" className={epInput} value={precoUnitario}
              onChange={(e) => setPrecoUnitario(e.target.value === "" ? "" : Number(e.target.value))} />
          </EpField>
        </div>
        <div className="bg-[hsl(var(--surface-2))] border border-border rounded-lg px-4 py-3 text-sm flex justify-between">
          <span className="text-muted-foreground">Valor estimado</span>
          <strong className="text-primary">{brl(valorEstimado)}</strong>
        </div>
        <EpField label="Observação">
          <textarea className={epInput + " h-20 resize-none"} value={observacao}
            onChange={(e) => setObservacao(e.target.value)} placeholder="Ex: Lembrar de confirmar cor..." />
        </EpField>
      </div>
    </EpModal>
  );
}