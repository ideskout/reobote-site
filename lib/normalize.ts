import type { Categoria, Imovel, Tipo } from "@/types/imovel";

function optionalText(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function optionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizeImovel(row: Record<string, unknown>): Imovel {
  return {
    id: String(row.id),
    titulo: String(row.titulo ?? ""),
    cidade: String(row.cidade ?? ""),
    bairro: optionalText(row.bairro),
    endereco: optionalText(row.endereco),
    preco: Number(row.preco ?? 0),
    categoria: String(row.categoria ?? "casa") as Categoria,
    tipo: String(row.tipo ?? "venda") as Tipo,
    quartos: Number(row.quartos ?? 0),
    area: Number(row.area ?? 0),
    descricao: String(row.descricao ?? ""),
    foto_url: row.foto_url ? String(row.foto_url) : null,
    destaque: Boolean(row.destaque),
    latitude: optionalNumber(row.latitude),
    longitude: optionalNumber(row.longitude),
    created_at: String(row.created_at ?? ""),
  };
}
