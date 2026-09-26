import { cache } from "react";
import { isCategoria, isTipo } from "@/lib/labels";
import { normalizeImovel } from "@/lib/normalize";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Imovel, ImovelFilters } from "@/types/imovel";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function sanitizeSearch(value: string) {
  return value
    .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getImoveis(filters: ImovelFilters = {}) {
  if (!hasSupabaseEnv()) {
    return { data: [] as Imovel[], error: "missing_env" as const };
  }

  const supabase = createClient();
  let query = supabase
    .from("imoveis")
    .select("*")
    .order("created_at", { ascending: false });

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
    query = query.or(
      `titulo.ilike.%${q}%,cidade.ilike.%${q}%,descricao.ilike.%${q}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    return { data: [] as Imovel[], error: error.message };
  }

  return {
    data: (data ?? []).map((row) =>
      normalizeImovel(row as Record<string, unknown>),
    ),
    error: null,
  };
}

export async function listCidades() {
  if (!hasSupabaseEnv()) return [];

  const supabase = createClient();
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

  const supabase = createClient();
  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return normalizeImovel(data as Record<string, unknown>);
});
