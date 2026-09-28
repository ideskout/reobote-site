"use server";

import { revalidatePath } from "next/cache";
import { friendlyError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { ESTAGIOS, type Estagio } from "@/types/crm";

export type ActionState = { ok: boolean; message: string } | null;

export async function agendarVisita(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "O catálogo ainda não está conectado ao Supabase." };
  }

  const nome = String(formData.get("nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const imovelId = String(formData.get("imovel_id") ?? "").trim();
  const quando = String(formData.get("quando") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();

  if (nome.length < 2) return { ok: false, message: "Informe seu nome." };
  if (telefone.replace(/\D/g, "").length < 10) return { ok: false, message: "Informe um telefone com DDD." };
  if (!quando) return { ok: false, message: "Escolha data e horário." };

  const data = new Date(quando);
  if (Number.isNaN(data.getTime()) || data.getTime() < Date.now() - 60_000) {
    return { ok: false, message: "Escolha uma data futura." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("agendar_visita", {
    p_nome: nome,
    p_telefone: telefone,
    p_email: email,
    p_imovel_id: imovelId || null,
    p_quando: data.toISOString(),
    p_mensagem: mensagem,
  });

  if (error) {
    return { ok: false, message: friendlyError(error.message) };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/clientes");
  return { ok: true, message: "Visita solicitada. A corretora retorna pelo telefone informado." };
}

export async function atualizarEstagio(leadId: string, estagio: Estagio) {
  if (!ESTAGIOS.includes(estagio)) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ estagio, updated_at: new Date().toISOString() })
    .eq("id", leadId);

  if (!error) {
    await supabase.from("lead_eventos").insert({
      lead_id: leadId,
      descricao: `Estágio alterado para ${estagio}.`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/pipeline");
}

export async function salvarCliente(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const notas = String(formData.get("notas") ?? "").trim();

  if (nome.length < 2) return { ok: false, message: "Informe o nome do cliente." };

  const supabase = await createClient();
  const payload = {
    nome,
    telefone: telefone || null,
    email: email || null,
    notas,
  };

  const query = id
    ? supabase.from("clientes").update(payload).eq("id", id)
    : supabase.from("clientes").insert({ ...payload, origem: "manual" });

  const { error } = await query;
  if (error) return { ok: false, message: friendlyError(error.message) };

  revalidatePath("/admin/clientes");
  return { ok: true, message: id ? "Cliente atualizado." : "Cliente cadastrado." };
}
