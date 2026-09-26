"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/PropertyForm";
import { formatPreco } from "@/lib/format";
import { friendlyError } from "@/lib/errors";
import { labelCategoria, labelTipo } from "@/lib/labels";
import { removeFoto } from "@/lib/storage";
import { buttonGhost } from "@/lib/styles";
import { createClient } from "@/lib/supabase/client";
import type { Imovel } from "@/types/imovel";

export function AdminDashboard({
  initialImoveis,
  email,
}: {
  initialImoveis: Imovel[];
  email: string;
}) {
  const router = useRouter();
  const [imoveis, setImoveis] = useState(initialImoveis);
  const [editing, setEditing] = useState<Imovel | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSaved(imovel: Imovel) {
    setImoveis((current) => {
      const exists = current.some((item) => item.id === imovel.id);
      if (!exists) return [imovel, ...current];
      return current.map((item) => (item.id === imovel.id ? imovel : item));
    });
    setEditing(null);
    setFormKey((value) => value + 1);
    setMessage("Imóvel salvo.");
    setError(null);
    router.refresh();
  }

  async function handleDelete(imovel: Imovel) {
    const confirmed = window.confirm(`Excluir "${imovel.titulo}"? Essa ação não pode ser desfeita.`);
    if (!confirmed) return;

    setError(null);
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("imoveis").delete().eq("id", imovel.id);

    if (deleteError) {
      setError(friendlyError(deleteError.message));
      return;
    }

    await removeFoto(imovel.foto_url);
    setImoveis((current) => current.filter((item) => item.id !== imovel.id));
    if (editing?.id === imovel.id) {
      setEditing(null);
      setFormKey((value) => value + 1);
    }
    setMessage("Imóvel excluído.");
    router.refresh();
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function startEdit(imovel: Imovel) {
    setEditing(imovel);
    setMessage(null);
    document.getElementById("form-imovel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold-500">Administração</p>
          <h1 className="mt-3 font-serif text-5xl text-ivory">Portfólio</h1>
          <p className="mt-3 text-sm text-mist">Conectado como {email}</p>
        </div>
        <button type="button" className={buttonGhost} onClick={signOut}>
          Sair
        </button>
      </div>

      {message ? <p className="mt-6 text-sm text-gold-300">{message}</p> : null}
      {error ? (
        <p role="alert" className="mt-6 text-sm text-gold-300">
          {error}
        </p>
      ) : null}

      <div className="mt-8">
        <PropertyForm
          key={editing?.id ?? `novo-${formKey}`}
          imovel={editing}
          onSaved={handleSaved}
          onDelete={handleDelete}
          onCancel={() => {
            setEditing(null);
            setFormKey((value) => value + 1);
          }}
        />
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-3xl text-ivory">Imóveis cadastrados</h2>
        {imoveis.length === 0 ? (
          <p className="mt-4 text-sm text-mist">Nenhum imóvel cadastrado ainda.</p>
        ) : (
          <ul className="mt-6 divide-y divide-white/10 border border-white/10">
            {imoveis.map((imovel) => (
              <li key={imovel.id} className="flex flex-col gap-4 bg-navy-900/40 p-4 sm:flex-row sm:items-center">
                <div className="h-16 w-24 shrink-0 bg-navy-800">
                  {imovel.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imovel.foto_url} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-2xl text-ivory">{imovel.titulo}</p>
                  <p className="mt-1 text-sm text-mist">
                    {imovel.cidade} · {labelCategoria(imovel.categoria)} · {labelTipo(imovel.tipo)}
                  </p>
                  <p className="mt-1 text-sm text-gold-300">{formatPreco(imovel.preco, imovel.tipo)}</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" className={buttonGhost} onClick={() => startEdit(imovel)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="border border-red-300/40 px-4 py-3 text-xs uppercase tracking-[0.16em] text-red-200"
                    onClick={() => handleDelete(imovel)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
