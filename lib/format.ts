import type { Tipo } from "@/types/imovel";

export function formatPreco(valor: number, tipo?: Tipo) {
  const money = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

  return tipo === "locacao" ? `${money} / mês` : money;
}

export function formatArea(area: number) {
  const value = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(area);

  return `${value} m²`;
}

export function formatData(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
    new Date(iso),
  );
}
