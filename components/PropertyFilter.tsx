"use client";

import { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIAS, TIPOS, labelCategoria, labelTipo } from "@/lib/labels";
import { buttonGhost, buttonPrimary, fieldClass, labelClass } from "@/lib/styles";

export function PropertyFilter({ cidades }: { cidades: string[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = new URLSearchParams();
    const q = String(data.get("q") ?? "").trim();
    const cidade = String(data.get("cidade") ?? "").trim();
    const tipo = String(data.get("tipo") ?? "").trim();
    const categoria = String(data.get("categoria") ?? "").trim();

    if (q) next.set("q", q);
    if (cidade) next.set("cidade", cidade);
    if (tipo) next.set("tipo", tipo);
    if (categoria) next.set("categoria", categoria);

    const query = next.toString();
    router.push(query ? `/?${query}#imoveis` : "/#imoveis");
  }

  return (
    <form
      key={params.toString()}
      onSubmit={onSubmit}
      className="border border-white/10 bg-navy-900/70 p-5"
    >
      <div>
        <label htmlFor="q" className={labelClass}>
          Busca
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={params.get("q") ?? ""}
          placeholder="Título, cidade ou descrição"
          className={fieldClass}
        />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label htmlFor="cidade" className={labelClass}>
            Cidade
          </label>
          <select
            id="cidade"
            name="cidade"
            defaultValue={params.get("cidade") ?? ""}
            className={fieldClass}
          >
            <option value="">Todas</option>
            {cidades.map((cidade) => (
              <option key={cidade} value={cidade}>
                {cidade}
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
            defaultValue={params.get("tipo") ?? ""}
            className={fieldClass}
          >
            <option value="">Todos</option>
            {TIPOS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {labelTipo(tipo)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="categoria" className={labelClass}>
            Categoria
          </label>
          <select
            id="categoria"
            name="categoria"
            defaultValue={params.get("categoria") ?? ""}
            className={fieldClass}
          >
            <option value="">Todas</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {labelCategoria(categoria)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-3">
          <button type="submit" className={`${buttonPrimary} flex-1`}>
            Buscar
          </button>
          <a href="/#imoveis" className={buttonGhost}>
            Limpar
          </a>
        </div>
      </div>
    </form>
  );
}
