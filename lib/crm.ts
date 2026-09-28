import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { ESTAGIOS, type Cliente, type Estagio, type Lead, type LeadEvento } from "@/types/crm";

function asEstagio(value: unknown): Estagio {
  return ESTAGIOS.includes(value as Estagio) ? (value as Estagio) : "novo";
}

function asEventos(value: unknown): LeadEvento[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as Record<string, unknown>;
      return {
        id: String(row.id),
        descricao: String(row.descricao ?? ""),
        created_at: String(row.created_at ?? ""),
      };
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getDashboard() {
  if (!hasSupabaseEnv()) {
    return { error: "missing_env" as const, imoveis: 0, leadsNovos: 0, visitasSemana: 0, fechados: 0, porEstagio: [] as { estagio: Estagio; total: number }[] };
  }

  const supabase = await createClient();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [imoveis, leadsNovos, visitas, fechados, estagios] = await Promise.all([
    supabase.from("imoveis").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("estagio", "novo"),
    supabase.from("visitas").select("id", { count: "exact", head: true }).gte("quando", weekAgo.toISOString()).eq("status", "agendada"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("estagio", "fechado"),
    supabase.from("leads").select("estagio"),
  ]);

  const missing = [imoveis.error, leadsNovos.error, visitas.error, fechados.error, estagios.error].find(Boolean);
  if (missing) {
    return {
      error: missing.message,
      imoveis: 0,
      leadsNovos: 0,
      visitasSemana: 0,
      fechados: 0,
      porEstagio: ESTAGIOS.map((estagio) => ({ estagio, total: 0 })),
    };
  }

  const counts = new Map<Estagio, number>();
  for (const row of estagios.data ?? []) {
    const estagio = asEstagio((row as { estagio: string }).estagio);
    counts.set(estagio, (counts.get(estagio) ?? 0) + 1);
  }

  return {
    error: null,
    imoveis: imoveis.count ?? 0,
    leadsNovos: leadsNovos.count ?? 0,
    visitasSemana: visitas.count ?? 0,
    fechados: fechados.count ?? 0,
    porEstagio: ESTAGIOS.map((estagio) => ({ estagio, total: counts.get(estagio) ?? 0 })),
  };
}

export async function listLeads() {
  if (!hasSupabaseEnv()) return { data: [] as Lead[], error: "missing_env" as const };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, estagio, origem, created_at, clientes(nome, telefone, email), imoveis(id, titulo, cidade), lead_eventos(id, descricao, created_at)")
    .order("created_at", { ascending: false });

  if (error) return { data: [] as Lead[], error: error.message };

  const leads = (data ?? []).map((row) => {
    const record = row as Record<string, unknown>;
    const cliente = record.clientes as Lead["cliente"];
    const imovel = record.imoveis as Lead["imovel"];
    return {
      id: String(record.id),
      estagio: asEstagio(record.estagio),
      origem: String(record.origem ?? "site"),
      created_at: String(record.created_at ?? ""),
      cliente: cliente && !Array.isArray(cliente) ? cliente : null,
      imovel: imovel && !Array.isArray(imovel) ? imovel : null,
      eventos: asEventos(record.lead_eventos),
    } satisfies Lead;
  });

  return { data: leads, error: null };
}

export async function listClientes() {
  if (!hasSupabaseEnv()) return { data: [] as Cliente[], error: "missing_env" as const };

  const supabase = await createClient();
  const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false });
  if (error) return { data: [] as Cliente[], error: error.message };

  return {
    data: (data ?? []).map((row) => ({
      id: String(row.id),
      nome: String(row.nome ?? ""),
      telefone: row.telefone ? String(row.telefone) : null,
      email: row.email ? String(row.email) : null,
      origem: String(row.origem ?? "site"),
      notas: String(row.notas ?? ""),
      created_at: String(row.created_at ?? ""),
    })),
    error: null,
  };
}
