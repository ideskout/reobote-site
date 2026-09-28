export type Categoria = "casa" | "apartamento" | "comercial" | "terreno";
export type Tipo = "venda" | "locacao";

export type Imovel = {
  id: string;
  titulo: string;
  cidade: string;
  bairro: string | null;
  endereco: string | null;
  preco: number;
  categoria: Categoria;
  tipo: Tipo;
  quartos: number;
  area: number;
  descricao: string;
  foto_url: string | null;
  destaque: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type ImovelInput = {
  titulo: string;
  cidade: string;
  bairro: string | null;
  endereco: string | null;
  preco: number;
  categoria: Categoria;
  tipo: Tipo;
  quartos: number;
  area: number;
  descricao: string;
  foto_url: string | null;
  destaque: boolean;
  latitude: number | null;
  longitude: number | null;
};

export type ImovelFilters = {
  q?: string;
  cidade?: string;
  tipo?: string;
  categoria?: string;
  page?: number;
  pageSize?: number;
  destaque?: boolean;
};
