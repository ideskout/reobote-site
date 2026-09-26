"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { friendlyError } from "@/lib/errors";
import { normalizeImovel } from "@/lib/normalize";
import { CATEGORIAS, TIPOS, isCategoria, isTipo, labelCategoria, labelTipo } from "@/lib/labels";
import { removeFoto, uploadFoto } from "@/lib/storage";
import { buttonGhost, buttonPrimary, fieldClass, labelClass } from "@/lib/styles";
import { createClient } from "@/lib/supabase/client";
import type { Imovel } from "@/types/imovel";

type PropertyFormProps = {
  imovel?: Imovel | null;
  onSaved: (imovel: Imovel) => void;
  onDelete?: (imovel: Imovel) => void;
  onCancel?: () => void;
};

export function PropertyForm({
  imovel,
  onSaved,
  onDelete,
  onCancel,
}: PropertyFormProps) {
  const editing = Boolean(imovel);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(imovel?.foto_url ?? null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    setFile(next);
    if (!next) return;
    setPreview(URL.createObjectURL(next));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const titulo = String(form.get("titulo") ?? "").trim();
    const cidade = String(form.get("cidade") ?? "").trim();
    const descricao = String(form.get("descricao") ?? "").trim();
    const categoria = String(form.get("categoria") ?? "");
    const tipo = String(form.get("tipo") ?? "");
    const preco = Number(form.get("preco"));
    const quartos = Number(form.get("quartos"));
    const area = Number(form.get("area"));

    try {
      if (!titulo || !cidade || !descricao) {
        throw new Error("Preencha título, cidade e descrição.");
      }
      if (!isCategoria(categoria) || !isTipo(tipo)) {
        throw new Error("Escolha categoria e tipo válidos.");
      }
      if (!Number.isFinite(preco) || preco <= 0) {
        throw new Error("Informe um preço maior que zero.");
      }
      if (!Number.isFinite(quartos) || quartos < 0 || !Number.isInteger(quartos)) {
        throw new Error("Informe a quantidade de quartos.");
      }
      if (!Number.isFinite(area) || area < 0) {
        throw new Error("Informe a área em metros quadrados.");
      }

      let fotoUrl = imovel?.foto_url ?? null;
      if (file) {
        const uploaded = await uploadFoto(file);
        if (imovel?.foto_url) await removeFoto(imovel.foto_url);
        fotoUrl = uploaded;
      }

      const payload = {
        titulo,
        cidade,
        preco,
        categoria,
        tipo,
        quartos,
        area,
        descricao,
        foto_url: fotoUrl,
      };

      const supabase = createClient();
      const query = imovel
        ? supabase.from("imoveis").update(payload).eq("id", imovel.id)
        : supabase.from("imoveis").insert(payload);

      const { data, error: saveError } = await query.select("*").single();
      if (saveError) throw new Error(friendlyError(saveError.message));

      onSaved(normalizeImovel(data as Record<string, unknown>));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Não foi possível salvar.";
      setError(friendlyError(message));
    } finally {
      setPending(false);
    }
  }

  return (
    <form id="form-imovel" onSubmit={onSubmit} className="border border-white/10 bg-navy-900/70 p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-500">
            {editing ? "Edição" : "Novo cadastro"}
          </p>
          <h2 className="mt-2 font-serif text-4xl text-ivory">
            {editing ? "Editar imóvel" : "Cadastrar imóvel"}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="titulo" className={labelClass}>
            Título
          </label>
          <input
            id="titulo"
            name="titulo"
            required
            defaultValue={imovel?.titulo ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="cidade" className={labelClass}>
            Cidade
          </label>
          <input
            id="cidade"
            name="cidade"
            required
            defaultValue={imovel?.cidade ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="preco" className={labelClass}>
            Preço (R$)
          </label>
          <input
            id="preco"
            name="preco"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={imovel?.preco ?? ""}
            className={fieldClass}
          />
          <p className="mt-2 text-xs text-mist">Na locação, informe o valor mensal.</p>
        </div>
        <div>
          <label htmlFor="categoria" className={labelClass}>
            Categoria
          </label>
          <select
            id="categoria"
            name="categoria"
            required
            defaultValue={imovel?.categoria ?? "casa"}
            className={fieldClass}
          >
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {labelCategoria(categoria)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tipo" className={labelClass}>
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            required
            defaultValue={imovel?.tipo ?? "venda"}
            className={fieldClass}
          >
            {TIPOS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {labelTipo(tipo)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quartos" className={labelClass}>
            Quartos
          </label>
          <input
            id="quartos"
            name="quartos"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={imovel?.quartos ?? 0}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="area" className={labelClass}>
            Área (m²)
          </label>
          <input
            id="area"
            name="area"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={imovel?.area ?? ""}
            className={fieldClass}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="descricao" className={labelClass}>
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            required
            rows={5}
            defaultValue={imovel?.descricao ?? ""}
            className={fieldClass}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="foto" className={labelClass}>
            Foto
          </label>
          <input
            id="foto"
            name="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFile}
            className="block w-full text-sm text-mist file:mr-4 file:border-0 file:bg-gold-500 file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.14em] file:text-navy-950"
          />
          <p className="mt-2 text-xs text-mist">
            A imagem vai para o bucket fotos-imoveis. Máximo de 5 MB.
          </p>
          {preview ? (
            // Blob previews and storage URLs are shown before save; next/image cannot load blob: URLs.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Pré-visualização da foto do imóvel"
              className="mt-4 aspect-[16/9] w-full max-w-md object-cover"
            />
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-gold-300">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className={buttonPrimary} disabled={pending}>
          {pending ? "Salvando..." : editing ? "Salvar alterações" : "Cadastrar imóvel"}
        </button>
        {editing && onCancel ? (
          <button type="button" className={buttonGhost} onClick={onCancel} disabled={pending}>
            Cancelar
          </button>
        ) : null}
        {editing && imovel && onDelete ? (
          <button
            type="button"
            className="inline-flex items-center justify-center border border-red-300/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-red-200 transition hover:bg-red-950/40 disabled:opacity-60"
            onClick={() => onDelete(imovel)}
            disabled={pending}
          >
            Excluir imóvel
          </button>
        ) : null}
      </div>
    </form>
  );
}
