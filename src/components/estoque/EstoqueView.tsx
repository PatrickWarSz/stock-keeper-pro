import { useMemo, useState } from "react";
import { useData } from "@/store/data-store";
import { ItemEstoque } from "@/types";
import { EpModal, EpButton } from "@/components/ui/EpModal";
import { EpField, epInput } from "@/components/ui/EpField";
import { HistoricoGeralModal } from "@/components/historico/HistoricoGeralModal";
import { Plus, Settings, History, PlusCircle, MinusCircle, MoreHorizontal, Layers, CheckCircle2, AlertTriangle, XCircle, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtDateTime } from "@/lib/format";

export function EstoqueView() {
  const { itens, categorias, movimentacoes, addItem, updateItem, deleteItem, registrarEntrada, registrarSaida, addCategoria, updateCategoria, deleteCategoria } = useData();

  const [openNovoItem, setOpenNovoItem] = useState(false);
  const [editing, setEditing] = useState<ItemEstoque | null>(null);
  const [openCats, setOpenCats] = useState(false);
  const [openHistGeral, setOpenHistGeral] = useState(false);
  const [movItem, setMovItem] = useState<{ item: ItemEstoque; tipo: "entrada" | "saida" } | null>(null);
  const [histItem, setHistItem] = useState<ItemEstoque | null>(null);
  const [catFilter, setCatFilter] = useState<string>("");

  const dashboard = useMemo(() => {
    let garantido = 0, baixo = 0, zerado = 0;
    for (const i of itens) {
      if (i.estoque_atual === 0) zerado++;
      else if (i.estoque_atual <= i.estoque_minimo) baixo++;
      else garantido++;
    }
    return { total: itens.length, garantido, baixo, zerado };
  }, [itens]);

  const filtered = catFilter ? itens.filter((i) => i.categoria_id === catFilter) : itens;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold">Controle de Estoque</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Gerencie seu estoque de matéria prima</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setOpenHistGeral(true)} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground border border-border rounded-lg px-3 py-2 bg-[hsl(var(--surface-2))] hover:border-primary/40 transition-colors">
            <History className="w-4 h-4" /> Histórico Geral
          </button>
          <button onClick={() => setOpenCats(true)} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground border border-border rounded-lg px-3 py-2 bg-[hsl(var(--surface-2))] hover:border-primary/40 transition-colors">
            <Settings className="w-4 h-4" /> Categorias
          </button>
          <button onClick={() => { setEditing(null); setOpenNovoItem(true); }} className="flex items-center gap-1.5 text-sm font-semibold bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg px-4 py-2 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Novo Item
          </button>
        </div>
      </div>

      <div className="ep-card flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-4 px-4 py-3">
        <span className="flex items-center gap-1.5 text-muted-foreground"><Layers className="w-3.5 h-3.5" /> Total: <strong className="text-foreground">{dashboard.total}</strong></span>
        <span className="w-px h-4 bg-border" />
        <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Garantido: <strong>{dashboard.garantido}</strong></span>
        <span className="w-px h-4 bg-border" />
        <span className="flex items-center gap-1.5 text-amber-500"><AlertTriangle className="w-3.5 h-3.5" /> Baixo: <strong>{dashboard.baixo}</strong></span>
        <span className="w-px h-4 bg-border" />
        <span className="flex items-center gap-1.5 text-destructive"><XCircle className="w-3.5 h-3.5" /> Zerado: <strong>{dashboard.zerado}</strong></span>
      </div>

      <div className="flex gap-2 mb-4">
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="bg-[hsl(var(--surface-2))] border border-border rounded-lg px-3 py-2 text-sm">
          <option value="">Todas as categorias</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </div>

      <div className="ep-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-xs text-muted-foreground uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-medium">Material</th>
              <th className="text-left px-4 py-3 font-medium">Categoria</th>
              <th className="text-left px-4 py-3 font-medium">Estoque</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Nenhum item cadastrado.</td></tr>
            )}
            {filtered.map((i) => {
              const cat = categorias.find((c) => c.id === i.categoria_id);
              const status = i.estoque_atual === 0 ? "zerado" : i.estoque_atual <= i.estoque_minimo ? "baixo" : "ok";
              return (
                <tr key={i.id} className="border-b border-border hover:bg-[hsl(var(--surface-2))] transition-colors">
                  <td className="px-4 py-3.5 font-medium">{i.nome}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{cat?.nome ?? "—"}</td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-sm font-medium">{i.estoque_atual} <span className="text-faint font-normal">{i.unidade}</span></span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("ep-badge",
                      status === "ok" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                      status === "baixo" ? "bg-amber-500/10 text-amber-600 border-amber-500/30" :
                      "bg-red-500/10 text-red-600 border-red-500/30"
                    )}>
                      {status === "ok" ? "OK" : status === "baixo" ? "Baixo" : "Zerado"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setMovItem({ item: i, tipo: "entrada" })} className="ep-badge text-emerald-600 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer">
                        <PlusCircle className="w-3 h-3" /> Entrada
                      </button>
                      <button onClick={() => setMovItem({ item: i, tipo: "saida" })} className="ep-badge text-destructive bg-destructive/10 border-destructive/30 hover:bg-destructive/20 cursor-pointer">
                        <MinusCircle className="w-3 h-3" /> Saída
                      </button>
                      <button onClick={() => setHistItem(i)} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-2))] transition-colors" title="Histórico">
                        <History className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditing(i); setOpenNovoItem(true); }} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-[hsl(var(--surface-2))] transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if (confirm(`Excluir "${i.nome}"?`)) deleteItem(i.id); }} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-[hsl(var(--surface-2))] transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <NovoItemModal open={openNovoItem} onClose={() => { setOpenNovoItem(false); setEditing(null); }} editing={editing}
        onSave={async (payload) => { if (editing) await updateItem(editing.id, payload); else await addItem(payload as Omit<ItemEstoque, "id">); }} />

      <MovimentacaoModal data={movItem} onClose={() => setMovItem(null)}
        onConfirm={async (qtd, obs) => {
          if (!movItem) return;
          if (movItem.tipo === "entrada") await registrarEntrada(movItem.item.id, qtd, obs);
          else await registrarSaida(movItem.item.id, qtd, obs);
        }} />

      <HistoricoItemModal item={histItem} onClose={() => setHistItem(null)} movimentacoes={movimentacoes} />
      <CategoriasModal open={openCats} onClose={() => setOpenCats(false)}
        categorias={categorias} addCategoria={addCategoria} updateCategoria={updateCategoria} deleteCategoria={deleteCategoria} />
      <HistoricoGeralModal open={openHistGeral} onClose={() => setOpenHistGeral(false)} />
    </>
  );
}

/* ---- Modal Novo Item ---- */
function NovoItemModal({ open, onClose, editing, onSave }: { open: boolean; onClose: () => void; editing: ItemEstoque | null; onSave: (p: Partial<ItemEstoque>) => Promise<void> }) {
  const { categorias } = useData();
  const [nome, setNome] = useState("");
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [unidade, setUnidade] = useState("un");
  const [estoque, setEstoque] = useState<number | "">(0);
  const [minimo, setMinimo] = useState<number | "">(0);

  useMemo(() => {
    if (editing) {
      setNome(editing.nome); setCategoriaId(editing.categoria_id ?? "");
      setUnidade(editing.unidade); setEstoque(editing.estoque_atual); setMinimo(editing.estoque_minimo);
    } else { setNome(""); setCategoriaId(""); setUnidade("un"); setEstoque(0); setMinimo(0); }
  }, [editing, open]);

  const save = async () => {
    if (!nome.trim()) { alert("Informe o nome."); return; }
    await onSave({ nome: nome.trim(), categoria_id: categoriaId || null, unidade, estoque_atual: Number(estoque) || 0, estoque_minimo: Number(minimo) || 0 });
    onClose();
  };
  return (
    <EpModal open={open} onClose={onClose} title={editing ? "Editar Item" : "Novo Item de Estoque"} size="lg"
      icon={<Plus className="w-5 h-5 text-primary" />}
      footer={<><EpButton variant="ghost" onClick={onClose}>Cancelar</EpButton><EpButton onClick={save}>{editing ? "Salvar" : "Criar Item"}</EpButton></>}>
      <div className="space-y-4">
        <EpField label="Nome" required><input className={epInput} value={nome} onChange={(e) => setNome(e.target.value)} /></EpField>
        <div className="grid grid-cols-2 gap-3">
          <EpField label="Categoria">
            <select className={epInput} value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
              <option value="">Sem categoria</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </EpField>
          <EpField label="Unidade" required>
            <select className={epInput} value={unidade} onChange={(e) => setUnidade(e.target.value)}>
              {["kg", "un", "rolo", "m", "L", "pç", "cx"].map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </EpField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <EpField label="Estoque inicial"><input type="number" min="0" className={epInput} value={estoque} onChange={(e) => setEstoque(e.target.value === "" ? "" : Number(e.target.value))} /></EpField>
          <EpField label="Estoque mínimo"><input type="number" min="0" className={epInput} value={minimo} onChange={(e) => setMinimo(e.target.value === "" ? "" : Number(e.target.value))} /></EpField>
        </div>
      </div>
    </EpModal>
  );
}

/* ---- Modal Entrada/Saída ---- */
function MovimentacaoModal({ data, onClose, onConfirm }: { data: { item: ItemEstoque; tipo: "entrada" | "saida" } | null; onClose: () => void; onConfirm: (qtd: number, obs?: string) => Promise<void> }) {
  const [qtd, setQtd] = useState<number | "">("");
  const [obs, setObs] = useState("");
  useMemo(() => { setQtd(""); setObs(""); }, [data]);
  if (!data) return null;
  const isIn = data.tipo === "entrada";
  return (
    <EpModal open={!!data} onClose={onClose}
      title={isIn ? "Registrar Entrada" : "Registrar Saída"} subtitle={`${data.item.nome} • Estoque atual: ${data.item.estoque_atual} ${data.item.unidade}`}
      icon={isIn ? <PlusCircle className="w-5 h-5 text-emerald-500" /> : <MinusCircle className="w-5 h-5 text-destructive" />}
      size="md"
      footer={<><EpButton variant="ghost" onClick={onClose}>Cancelar</EpButton>
        <EpButton onClick={async () => { if (!qtd || Number(qtd) <= 0) { alert("Informe uma quantidade válida."); return; } await onConfirm(Number(qtd), obs || undefined); onClose(); }}>
          Confirmar</EpButton></>}>
      <div className="space-y-4">
        <EpField label={`Quantidade (${data.item.unidade})`} required>
          <input type="number" min="0" step="0.01" className={epInput} value={qtd} onChange={(e) => setQtd(e.target.value === "" ? "" : Number(e.target.value))} />
        </EpField>
        <EpField label="Observação"><textarea className={epInput + " h-20 resize-none"} value={obs} onChange={(e) => setObs(e.target.value)} /></EpField>
      </div>
    </EpModal>
  );
}

/* ---- Histórico do Item ---- */
function HistoricoItemModal({ item, onClose, movimentacoes }: { item: ItemEstoque | null; onClose: () => void; movimentacoes: any[] }) {
  if (!item) return null;
  const lista = movimentacoes.filter((m) => m.item_id === item.id);
  return (
    <EpModal open={!!item} onClose={onClose} title="Histórico de Movimentações" subtitle={`${item.nome} — Estoque atual: ${item.estoque_atual} ${item.unidade}`}
      icon={<History className="w-5 h-5 text-primary" />} size="lg"
      footer={<EpButton variant="ghost" onClick={onClose}>Fechar</EpButton>}>
      {lista.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma movimentação.</p>}
      <div className="space-y-2">
        {lista.map((m) => {
          const isIn = m.tipo === "entrada";
          return (
            <div key={m.id} className={cn("rounded-xl p-3 text-sm border", isIn ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5")}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", isIn ? "bg-emerald-500/15" : "bg-red-500/15")}>
                    {isIn ? <PlusCircle className="w-3 h-3 text-emerald-600" /> : <MinusCircle className="w-3 h-3 text-red-600" />}
                  </div>
                  <span className={cn("font-semibold font-mono", isIn ? "text-emerald-700" : "text-red-700")}>
                    {isIn ? "+" : "-"}{m.quantidade} {item.unidade}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{fmtDateTime(m.created_at)}</span>
              </div>
              <div className="text-xs text-muted-foreground ml-8">
                {m.origem === "pedido" ? "Entrada via entrega de pedido" : isIn ? "Entrada manual" : "Saída manual"}
                {" — Estoque após: "}{m.saldo_apos} {item.unidade}
              </div>
            </div>
          );
        })}
      </div>
    </EpModal>
  );
}

/* ---- Categorias ---- */
function CategoriasModal({ open, onClose, categorias, addCategoria, updateCategoria, deleteCategoria }: any) {
  const [nova, setNova] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");
  return (
    <EpModal open={open} onClose={onClose} title="Gerenciar Categorias" subtitle="Adicione, edite ou remova categorias"
      icon={<Pencil className="w-5 h-5 text-primary" />} size="md"
      footer={<EpButton variant="ghost" onClick={onClose}>Fechar</EpButton>}>
      <div className="flex gap-2 mb-4">
        <input value={nova} onChange={(e) => setNova(e.target.value)} className={epInput} placeholder="Nova categoria..." />
        <button onClick={async () => { if (nova.trim()) { await addCategoria(nova); setNova(""); } }}
          className="w-9 h-9 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground flex items-center justify-center flex-shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {categorias.map((c: any) => (
          <div key={c.id} className="border border-border rounded-xl p-3 flex items-center justify-between">
            {editId === c.id ? (
              <input value={editVal} onChange={(e) => setEditVal(e.target.value)} className={epInput} />
            ) : (
              <div className="font-medium text-sm">{c.nome}</div>
            )}
            <div className="flex items-center gap-1.5 ml-2">
              {editId === c.id ? (
                <>
                  <button onClick={async () => { await updateCategoria(c.id, editVal); setEditId(null); }} className="text-xs text-emerald-600 px-2">Salvar</button>
                  <button onClick={() => setEditId(null)} className="text-xs text-muted-foreground px-2">Cancelar</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setEditId(c.id); setEditVal(c.nome); }} className="w-7 h-7 rounded-lg bg-[hsl(var(--surface-2))] border border-border flex items-center justify-center text-muted-foreground hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm(`Excluir "${c.nome}"?`)) deleteCategoria(c.id); }} className="w-7 h-7 rounded-lg bg-[hsl(var(--surface-2))] border border-border flex items-center justify-center text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </EpModal>
  );
}