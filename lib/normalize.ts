import type { Categoria, Imovel, Tipo } from "@/types/imovel";

export function normalizeImovel(row: Record<string, unknown>): Imovel {
  return {
    id: String(row.id),
    titulo: String(row.titulo ?? ""),
    cidade: String(row.cidade ?? ""),
    preco: Number(row.preco ?? 0),
    categoria: String(row.categoria ?? "casa") as Categoria,
    tipo: String(row.tipo ?? "venda") as Tipo,
    quartos: Number(row.quartos ?? 0),
    area: Number(row.area ?? 0),
    descricao: String(row.descricao ?? ""),
    foto_url: row.foto_url ? String(row.foto_url) : null,
    created_at: String(row.created_at ?? ""),
  };
}
