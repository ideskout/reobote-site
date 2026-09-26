import type { Categoria, Tipo } from "@/types/imovel";

export const CATEGORIAS: Categoria[] = [
  "casa",
  "apartamento",
  "comercial",
  "terreno",
];

export const TIPOS: Tipo[] = ["venda", "locacao"];

const CATEGORIA_LABEL: Record<Categoria, string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  comercial: "Comercial",
  terreno: "Terreno",
};

const TIPO_LABEL: Record<Tipo, string> = {
  venda: "Venda",
  locacao: "Locação",
};

export function isCategoria(value: string | undefined): value is Categoria {
  return CATEGORIAS.includes(value as Categoria);
}

export function isTipo(value: string | undefined): value is Tipo {
  return TIPOS.includes(value as Tipo);
}

export function labelCategoria(value: string) {
  return CATEGORIA_LABEL[value as Categoria] ?? value;
}

export function labelTipo(value: string) {
  return TIPO_LABEL[value as Tipo] ?? value;
}
