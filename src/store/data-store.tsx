import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Categoria,
  Entrega,
  Fornecedor,
  ItemEstoque,
  Movimentacao,
  Pedido,
} from "@/types";

const LS_KEY = "estoque-pro:data:v1";
const uid = () => crypto.randomUUID();
const todayISO = () => new Date().toISOString().slice(0, 10);

interface DataState {
  categorias: Categoria[];
  fornecedores: Fornecedor[];
  itens: ItemEstoque[];
  pedidos: Pedido[];
  entregas: Entrega[];
  movimentacoes: Movimentacao[];
}

const seed = (): DataState => {
  const catId = uid();
  const catAviamentos = uid();
  const fornJBN = uid();
  const fornMalha = uid();
  const itemSuplex = uid();
  const itemZiper = uid();
  return {
    categorias: [
      { id: catId, nome: "elastico" },
      { id: catAviamentos, nome: "aviamentos" },
    ],
    fornecedores: [
      { id: fornJBN, nome: "JBN Têxtil", contato: "Rodrigo", telefone: "(11) 90000-0000", email: "rodrigo@jbn.com" },
      { id: fornMalha, nome: "Malhatech", telefone: "(11) 91111-1111" },
    ],
    itens: [
      { id: itemSuplex, nome: "TECIDO SUPLEX PRETO", categoria_id: catId, unidade: "rolo", estoque_atual: 22, estoque_minimo: 5 },
      { id: itemZiper, nome: "ZÍPER INVISÍVEL 20CM", categoria_id: catAviamentos, unidade: "un", estoque_atual: 200, estoque_minimo: 50 },
    ],
    pedidos: [
      {
        id: uid(), produto: "Tecido Suplex Preto", fornecedor_id: fornJBN,
        data_pedido: "2026-04-26", data_prevista: "2026-04-30",
        quantidade: 100, unidade: "kg", preco_unitario: 10,
        item_estoque_id: itemSuplex, observacao: "Lembrar de confirmar cor",
        status: "pendente",
      },
      {
        id: uid(), produto: "Elástico 3cm Branco", fornecedor_id: fornMalha,
        data_pedido: "2026-04-15", data_prevista: "2026-04-20",
        quantidade: 50, unidade: "kg", preco_unitario: 8.5,
        item_estoque_id: null, observacao: null,
        status: "pendente",
      },
    ],
    entregas: [],
    movimentacoes: [],
  };
};

const empty: DataState = {
  categorias: [], fornecedores: [], itens: [], pedidos: [], entregas: [], movimentacoes: [],
};

function loadLocal(): DataState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(LS_KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw);
  } catch {
    return seed();
  }
}
function saveLocal(s: DataState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

/* ============================================================
 * Public API
 * ============================================================ */
interface DataApi extends DataState {
  loading: boolean;
  usingSupabase: boolean;
  // categorias
  addCategoria: (nome: string) => Promise<void>;
  updateCategoria: (id: string, nome: string) => Promise<void>;
  deleteCategoria: (id: string) => Promise<void>;
  // fornecedores
  addFornecedor: (f: Omit<Fornecedor, "id">) => Promise<void>;
  updateFornecedor: (id: string, f: Partial<Fornecedor>) => Promise<void>;
  deleteFornecedor: (id: string) => Promise<void>;
  // itens
  addItem: (i: Omit<ItemEstoque, "id">) => Promise<void>;
  updateItem: (id: string, i: Partial<ItemEstoque>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  // movimentações
  registrarEntrada: (itemId: string, qtd: number, observacao?: string) => Promise<void>;
  registrarSaida: (itemId: string, qtd: number, observacao?: string) => Promise<void>;
  // pedidos
  addPedido: (p: Omit<Pedido, "id" | "status">) => Promise<void>;
  updatePedido: (id: string, p: Partial<Pedido>) => Promise<void>;
  deletePedido: (id: string) => Promise<void>;
  finalizarPedido: (id: string) => Promise<void>;
  // entregas
  registrarEntrega: (input: {
    pedidoId: string;
    data_entrega: string;
    quantidade: number;
    qtd_estoque?: number | null;
    lancou_estoque: boolean;
    observacao?: string | null;
    item_estoque_id?: string | null;
  }) => Promise<void>;
  limparHistorico: () => Promise<void>;
}

const Ctx = createContext<DataApi | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>(empty);
  const [loading, setLoading] = useState(true);

  /* ---------- bootstrap ---------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isSupabaseConfigured || !supabase) {
        setState(loadLocal());
        setLoading(false);
        return;
      }
      try {
        const [c, f, i, p, e, m] = await Promise.all([
          supabase.from("categorias").select("*").order("nome"),
          supabase.from("fornecedores").select("*").order("nome"),
          supabase.from("itens_estoque").select("*").order("nome"),
          supabase.from("pedidos").select("*").order("data_pedido", { ascending: false }),
          supabase.from("entregas").select("*").order("data_entrega", { ascending: false }),
          supabase.from("movimentacoes").select("*").order("created_at", { ascending: false }),
        ]);
        if (!alive) return;
        setState({
          categorias: c.data ?? [],
          fornecedores: f.data ?? [],
          itens: i.data ?? [],
          pedidos: p.data ?? [],
          entregas: e.data ?? [],
          movimentacoes: m.data ?? [],
        });
      } catch (err) {
        console.error("Erro ao carregar do Supabase, usando localStorage:", err);
        setState(loadLocal());
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  /* ---------- helpers ---------- */
  const update = useCallback((mut: (s: DataState) => DataState) => {
    setState((prev) => {
      const next = mut(prev);
      if (!isSupabaseConfigured) saveLocal(next);
      return next;
    });
  }, []);

  async function sb(table: string, op: () => any) {
    if (!isSupabaseConfigured || !supabase) return;
    const r = await op();
    if (r?.error) console.error(`[${table}]`, r.error);
  }

  /* ---------- categorias ---------- */
  const addCategoria = async (nome: string) => {
    const novo: Categoria = { id: uid(), nome: nome.trim() };
    if (!novo.nome) return;
    update((s) => ({ ...s, categorias: [...s.categorias, novo] }));
    await sb("categorias", () => supabase!.from("categorias").insert(novo));
    toast.success("Categoria criada");
  };
  const updateCategoria = async (id: string, nome: string) => {
    update((s) => ({ ...s, categorias: s.categorias.map((c) => c.id === id ? { ...c, nome } : c) }));
    await sb("categorias", () => supabase!.from("categorias").update({ nome }).eq("id", id));
    toast.success("Categoria atualizada");
  };
  const deleteCategoria = async (id: string) => {
    update((s) => ({ ...s, categorias: s.categorias.filter((c) => c.id !== id) }));
    await sb("categorias", () => supabase!.from("categorias").delete().eq("id", id));
    toast.success("Categoria removida");
  };

  /* ---------- fornecedores ---------- */
  const addFornecedor = async (f: Omit<Fornecedor, "id">) => {
    const novo: Fornecedor = { ...f, id: uid() };
    update((s) => ({ ...s, fornecedores: [...s.fornecedores, novo] }));
    await sb("fornecedores", () => supabase!.from("fornecedores").insert(novo));
    toast.success("Fornecedor adicionado");
  };
  const updateFornecedor = async (id: string, f: Partial<Fornecedor>) => {
    update((s) => ({ ...s, fornecedores: s.fornecedores.map((x) => x.id === id ? { ...x, ...f } : x) }));
    await sb("fornecedores", () => supabase!.from("fornecedores").update(f).eq("id", id));
    toast.success("Fornecedor atualizado");
  };
  const deleteFornecedor = async (id: string) => {
    update((s) => ({ ...s, fornecedores: s.fornecedores.filter((x) => x.id !== id) }));
    await sb("fornecedores", () => supabase!.from("fornecedores").delete().eq("id", id));
    toast.success("Fornecedor removido");
  };

  /* ---------- itens ---------- */
  const addItem = async (i: Omit<ItemEstoque, "id">) => {
    const novo: ItemEstoque = { ...i, id: uid() };
    update((s) => ({ ...s, itens: [...s.itens, novo] }));
    await sb("itens_estoque", () => supabase!.from("itens_estoque").insert(novo));
    toast.success("Item criado", { description: novo.nome });
  };
  const updateItem = async (id: string, i: Partial<ItemEstoque>) => {
    update((s) => ({ ...s, itens: s.itens.map((x) => x.id === id ? { ...x, ...i } : x) }));
    await sb("itens_estoque", () => supabase!.from("itens_estoque").update(i).eq("id", id));
    toast.success("Item atualizado");
  };
  const deleteItem = async (id: string) => {
    update((s) => ({ ...s, itens: s.itens.filter((x) => x.id !== id) }));
    await sb("itens_estoque", () => supabase!.from("itens_estoque").delete().eq("id", id));
    toast.success("Item removido");
  };

  /* ---------- movimentações genéricas ---------- */
  async function aplicarMovimentacao(
    s: DataState,
    itemId: string,
    tipo: "entrada" | "saida",
    qtd: number,
    origem: "manual" | "pedido",
    extra: { pedido_id?: string | null; entrega_id?: string | null; observacao?: string | null } = {}
  ): Promise<DataState> {
    const item = s.itens.find((i) => i.id === itemId);
    if (!item) return s;
    const delta = tipo === "entrada" ? qtd : -qtd;
    const novoEstoque = Math.max(0, item.estoque_atual + delta);
    const mov: Movimentacao = {
      id: uid(),
      item_id: itemId,
      tipo,
      quantidade: qtd,
      saldo_apos: novoEstoque,
      origem,
      pedido_id: extra.pedido_id ?? null,
      entrega_id: extra.entrega_id ?? null,
      observacao: extra.observacao ?? null,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      await Promise.all([
        supabase.from("itens_estoque").update({ estoque_atual: novoEstoque }).eq("id", itemId),
        supabase.from("movimentacoes").insert(mov),
      ]);
    }
    return {
      ...s,
      itens: s.itens.map((i) => i.id === itemId ? { ...i, estoque_atual: novoEstoque } : i),
      movimentacoes: [mov, ...s.movimentacoes],
    };
  }

  const registrarEntrada = async (itemId: string, qtd: number, observacao?: string) => {
    setState((s) => {
      const next = { ...s };
      // mutação assíncrona — usamos resolver imediato
      aplicarMovimentacao(next, itemId, "entrada", qtd, "manual", { observacao }).then((updated) => {
        setState(updated);
        if (!isSupabaseConfigured) saveLocal(updated);
      });
      return s;
    });
    toast.success(`Entrada registrada: +${qtd}`);
  };
  const registrarSaida = async (itemId: string, qtd: number, observacao?: string) => {
    setState((s) => {
      aplicarMovimentacao(s, itemId, "saida", qtd, "manual", { observacao }).then((updated) => {
        setState(updated);
        if (!isSupabaseConfigured) saveLocal(updated);
      });
      return s;
    });
    toast.success(`Saída registrada: -${qtd}`);
  };

  /* ---------- pedidos ---------- */
  const addPedido = async (p: Omit<Pedido, "id" | "status">) => {
    const novo: Pedido = { ...p, id: uid(), status: "pendente" };
    update((s) => ({ ...s, pedidos: [novo, ...s.pedidos] }));
    await sb("pedidos", () => supabase!.from("pedidos").insert(novo));
    toast.success("Pedido criado", { description: novo.produto });
  };
  const updatePedido = async (id: string, p: Partial<Pedido>) => {
    update((s) => ({ ...s, pedidos: s.pedidos.map((x) => x.id === id ? { ...x, ...p } : x) }));
    await sb("pedidos", () => supabase!.from("pedidos").update(p).eq("id", id));
    toast.success("Pedido atualizado");
  };
  const deletePedido = async (id: string) => {
    update((s) => ({
      ...s,
      pedidos: s.pedidos.filter((x) => x.id !== id),
      entregas: s.entregas.filter((e) => e.pedido_id !== id),
    }));
    await sb("pedidos", () => supabase!.from("pedidos").delete().eq("id", id));
    toast.success("Pedido removido");
  };
  const finalizarPedido = async (id: string) => {
    update((s) => ({ ...s, pedidos: s.pedidos.map((x) => x.id === id ? { ...x, status: "concluido" } : x) }));
    await sb("pedidos", () => supabase!.from("pedidos").update({ status: "concluido" }).eq("id", id));
    toast.success("Pedido finalizado");
  };

  /* ---------- entregas ---------- */
  const registrarEntrega: DataApi["registrarEntrega"] = async (input) => {
    const entrega: Entrega = {
      id: uid(),
      pedido_id: input.pedidoId,
      data_entrega: input.data_entrega,
      quantidade: input.quantidade,
      qtd_estoque: input.qtd_estoque ?? null,
      lancou_estoque: input.lancou_estoque,
      observacao: input.observacao ?? null,
      created_at: new Date().toISOString(),
    };

    setState((s) => {
      let next: DataState = { ...s, entregas: [entrega, ...s.entregas] };

      // Se lançar no estoque e item vinculado existe
      if (input.lancou_estoque && input.item_estoque_id && (input.qtd_estoque ?? 0) > 0) {
        // mutação assíncrona
        aplicarMovimentacao(
          next,
          input.item_estoque_id,
          "entrada",
          input.qtd_estoque!,
          "pedido",
          { pedido_id: input.pedidoId, entrega_id: entrega.id, observacao: "Entrada via entrega de pedido" },
        ).then((updated) => {
          // verificar se pedido foi 100% entregue
          const totalEntregue = updated.entregas
            .filter((e) => e.pedido_id === input.pedidoId)
            .reduce((acc, e) => acc + e.quantidade, 0);
          const ped = updated.pedidos.find((p) => p.id === input.pedidoId);
          if (ped && totalEntregue >= ped.quantidade) {
            updated = { ...updated, pedidos: updated.pedidos.map((p) => p.id === ped.id ? { ...p, status: "concluido" as const } : p) };
            if (isSupabaseConfigured && supabase) {
              supabase.from("pedidos").update({ status: "concluido" }).eq("id", ped.id);
            }
          }
          setState(updated);
          if (!isSupabaseConfigured) saveLocal(updated);
        });
        return next;
      }

      // sem lançamento no estoque — checa conclusão pelo total entregue
      const totalEntregue = next.entregas
        .filter((e) => e.pedido_id === input.pedidoId)
        .reduce((acc, e) => acc + e.quantidade, 0);
      const ped = next.pedidos.find((p) => p.id === input.pedidoId);
      if (ped && totalEntregue >= ped.quantidade) {
        next = { ...next, pedidos: next.pedidos.map((p) => p.id === ped.id ? { ...p, status: "concluido" as const } : p) };
      }
      if (!isSupabaseConfigured) saveLocal(next);
      return next;
    });

    if (isSupabaseConfigured && supabase) {
      await supabase.from("entregas").insert(entrega);
    }
    toast.success("Entrega registrada", {
      description: input.lancou_estoque ? "Estoque atualizado" : undefined,
    });
  };

  const limparHistorico = async () => {
    update((s) => ({ ...s, movimentacoes: [] }));
    await sb("movimentacoes", () => supabase!.from("movimentacoes").delete().neq("id", "00000000-0000-0000-0000-000000000000"));
    toast.success("Histórico limpo");
  };

  const api: DataApi = useMemo(() => ({
    ...state,
    loading,
    usingSupabase: isSupabaseConfigured,
    addCategoria, updateCategoria, deleteCategoria,
    addFornecedor, updateFornecedor, deleteFornecedor,
    addItem, updateItem, deleteItem,
    registrarEntrada, registrarSaida,
    addPedido, updatePedido, deletePedido, finalizarPedido,
    registrarEntrega,
    limparHistorico,
  }), [state, loading]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useData(): DataApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useData must be inside <DataProvider>");
  return v;
}

/* utility re-exports */
export { todayISO };