export type Categoria = "casa" | "apartamento" | "comercial" | "terreno";
export type Tipo = "venda" | "locacao";

export type Imovel = {
  id: string;
  titulo: string;
  cidade: string;
  preco: number;
  categoria: Categoria;
  tipo: Tipo;
  quartos: number;
  area: number;
  descricao: string;
  foto_url: string | null;
  created_at: string;
};

export type ImovelInput = {
  titulo: string;
  cidade: string;
  preco: number;
  categoria: Categoria;
  tipo: Tipo;
  quartos: number;
  area: number;
  descricao: string;
  foto_url: string | null;
};

export type ImovelFilters = {
  q?: string;
  cidade?: string;
  tipo?: string;
  categoria?: string;
};
