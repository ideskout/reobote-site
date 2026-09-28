import { cache } from "react";
import { isCategoria, isTipo } from "@/lib/labels";
import { normalizeImovel } from "@/lib/normalize";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Imovel, ImovelFilters } from "@/types/imovel";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const IMOVEL_COLUMNS_BASE =
  "id, titulo, cidade, preco, categoria, tipo, quartos, area, descricao, foto_url, created_at";
const IMOVEL_COLUMNS =
  "id, titulo, cidade, bairro, endereco, preco, categoria, tipo, quartos, area, descricao, foto_url, destaque, latitude, longitude, created_at";

function missingColumn(message: string) {
  return /column|schema cache/i.test(message);
}

export const PAGE_SIZE = 9;

function sanitizeSearch(value: string) {
  return value
    .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getImoveis(filters: ImovelFilters = {}) {
  if (!hasSupabaseEnv()) {
    return { data: [] as Imovel[], count: 0, error: "missing_env" as const };
  }

  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, filters.pageSize ?? PAGE_SIZE));
  const supabase = await createClient();
  let query = supabase
    .from("imoveis")
    .select(IMOVEL_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.destaque) {
    query = query.eq("destaque", true);
  }

  if (filters.cidade?.trim()) {
    query = query.eq("cidade", filters.cidade.trim());
  }

  if (isTipo(filters.tipo)) {
    query = query.eq("tipo", filters.tipo);
  }

  if (isCategoria(filters.categoria)) {
    query = query.eq("categoria", filters.categoria);
  }

  const q = filters.q ? sanitizeSearch(filters.q) : "";
  if (q) {
    query = query.or(`titulo.ilike.%${q}%,cidade.ilike.%${q}%,descricao.ilike.%${q}%`);
  }

  const from = (page - 1) * pageSize;
  let { data, error, count } = await query.range(from, from + pageSize - 1);

  if (error && missingColumn(error.message)) {
    let fallback = supabase
      .from("imoveis")
      .select(IMOVEL_COLUMNS_BASE, { count: "exact" })
      .order("created_at", { ascending: false });
    if (filters.cidade?.trim()) fallback = fallback.eq("cidade", filters.cidade.trim());
    if (isTipo(filters.tipo)) fallback = fallback.eq("tipo", filters.tipo);
    if (isCategoria(filters.categoria)) fallback = fallback.eq("categoria", filters.categoria);
    if (q) fallback = fallback.or(`titulo.ilike.%${q}%,cidade.ilike.%${q}%,descricao.ilike.%${q}%`);
    const retry = await fallback.range(from, from + pageSize - 1);
    data = retry.data as typeof data;
    error = retry.error;
    count = retry.count;
  }

  if (error) {
    return { data: [] as Imovel[], count: 0, error: error.message };
  }

  return {
    data: (data ?? []).map((row) => normalizeImovel(row as Record<string, unknown>)),
    count: count ?? 0,
    error: null,
  };
}

export async function getDestaques() {
  const featured = await getImoveis({ destaque: true, page: 1, pageSize: 3 });
  if (!featured.error && featured.data.length > 0) return featured.data;

  const latest = await getImoveis({ page: 1, pageSize: 3 });
  return latest.data;
}

export async function listCidades() {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.from("imoveis").select("cidade");
  if (error || !data) return [];

  return Array.from(
    new Set(
      data
        .map((row) => String(row.cidade ?? "").trim())
        .filter((cidade) => cidade.length > 0),
    ),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export const getImovel = cache(async (id: string) => {
  if (!UUID_PATTERN.test(id) || !hasSupabaseEnv()) return null;

  const supabase = await createClient();
  let { data, error } = await supabase.from("imoveis").select(IMOVEL_COLUMNS).eq("id", id).maybeSingle();
  if (error && missingColumn(error.message)) {
    const retry = await supabase.from("imoveis").select(IMOVEL_COLUMNS_BASE).eq("id", id).maybeSingle();
    data = retry.data as typeof data;
    error = retry.error;
  }

  if (error || !data) return null;
  return normalizeImovel(data as Record<string, unknown>);
});

export async function listImovelIds() {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("imoveis").select("id").order("created_at", { ascending: false }).limit(200);
  return (data ?? []).map((row) => String(row.id));
}
