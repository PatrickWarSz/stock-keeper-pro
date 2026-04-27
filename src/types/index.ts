export type Unidade = "kg" | "un" | "rolo" | "m" | "L" | "pç" | "cx";

export interface Categoria {
  id: string;
  nome: string;
  created_at?: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  contato?: string | null;
  telefone?: string | null;
  email?: string | null;
  created_at?: string;
}

export interface ItemEstoque {
  id: string;
  nome: string;
  categoria_id: string | null;
  unidade: string;
  estoque_atual: number;
  estoque_minimo: number;
  created_at?: string;
}

export type StatusPedido = "pendente" | "concluido";

export interface Pedido {
  id: string;
  produto: string;
  fornecedor_id: string | null;
  data_pedido: string; // ISO date
  data_prevista: string; // ISO date
  quantidade: number;
  unidade: string;
  preco_unitario: number;
  item_estoque_id: string | null;
  observacao?: string | null;
  status: StatusPedido;
  created_at?: string;
}

export interface Entrega {
  id: string;
  pedido_id: string;
  data_entrega: string; // ISO date
  quantidade: number;
  qtd_estoque?: number | null; // qtd lançada no estoque (na unidade do item)
  lancou_estoque: boolean;
  observacao?: string | null;
  created_at?: string;
}

export type TipoMovimentacao = "entrada" | "saida";
export type OrigemMovimentacao = "manual" | "pedido" | "ajuste";

export interface Movimentacao {
  id: string;
  item_id: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  saldo_apos: number;
  origem: OrigemMovimentacao;
  pedido_id?: string | null;
  entrega_id?: string | null;
  observacao?: string | null;
  created_at: string;
}