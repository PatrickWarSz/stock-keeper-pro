import { useState } from "react";
import { EpModal, EpButton } from "@/components/ui/EpModal";
import { EpField, epInput } from "@/components/ui/EpField";
import { useData } from "@/store/data-store";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";

export function FornecedoresModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { fornecedores, pedidos, addFornecedor, updateFornecedor, deleteFornecedor } = useData();
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const reset = () => { setNome(""); setContato(""); setTelefone(""); setEmail(""); setEditId(null); };

  const save = async () => {
    if (!nome.trim()) { alert("Nome é obrigatório."); return; }
    const payload = { nome: nome.trim(), contato: contato || null, telefone: telefone || null, email: email || null };
    if (editId) await updateFornecedor(editId, payload);
    else await addFornecedor(payload);
    reset();
  };

  return (
    <EpModal open={open} onClose={onClose} title="Fornecedores" subtitle="Gerencie os fornecedores de matéria prima"
      icon={<Building2 className="w-5 h-5 text-primary" />} size="md"
      footer={<EpButton variant="ghost" onClick={onClose}>Fechar</EpButton>}>
      <div className="bg-[hsl(var(--surface-2))] rounded-xl border border-border p-4 mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {editId ? "Editar Fornecedor" : "Novo Fornecedor"}
        </p>
        <div className="space-y-3">
          <EpField label="Nome" required><input className={epInput} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: JBN Têxtil" /></EpField>
          <div className="grid grid-cols-2 gap-2">
            <EpField label="Contato"><input className={epInput} value={contato} onChange={(e) => setContato(e.target.value)} placeholder="Responsável" /></EpField>
            <EpField label="Telefone"><input className={epInput} value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" /></EpField>
          </div>
          <EpField label="E-mail"><input type="email" className={epInput} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@fornecedor.com" /></EpField>
          <div className="flex gap-2">
            <EpButton onClick={save} className="flex-1 justify-center"><Plus className="w-4 h-4" />{editId ? "Salvar" : "Adicionar Fornecedor"}</EpButton>
            {editId && <EpButton variant="ghost" onClick={reset}>Cancelar</EpButton>}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {fornecedores.map((f) => {
          const count = pedidos.filter((p) => p.fornecedor_id === f.id).length;
          return (
            <div key={f.id} className="border border-border rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{f.nome}</div>
                <div className="text-xs text-muted-foreground">{count} pedido{count !== 1 ? "s" : ""}{f.telefone ? ` • ${f.telefone}` : ""}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => { setEditId(f.id); setNome(f.nome); setContato(f.contato ?? ""); setTelefone(f.telefone ?? ""); setEmail(f.email ?? ""); }} className="w-7 h-7 rounded-lg bg-[hsl(var(--surface-2))] border border-border flex items-center justify-center text-muted-foreground hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => { if (confirm(`Excluir "${f.nome}"?`)) deleteFornecedor(f.id); }} className="w-7 h-7 rounded-lg bg-[hsl(var(--surface-2))] border border-border flex items-center justify-center text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </EpModal>
  );
}