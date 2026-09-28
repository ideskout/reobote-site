"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORIAS, TIPOS, labelCategoria, labelTipo } from "@/lib/labels";

type Defaults = {
  q?: string;
  cidade?: string;
  tipo?: string;
  categoria?: string;
};

export function PropertySearch({
  cidades,
  defaults = {},
}: {
  cidades: string[];
  defaults?: Defaults;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(defaults.q ?? "");

  function go(next: Defaults) {
    const params = new URLSearchParams();
    const q = (next.q ?? defaults.q ?? "").trim();
    const cidade = next.cidade ?? defaults.cidade;
    const tipo = next.tipo ?? defaults.tipo;
    const categoria = next.categoria ?? defaults.categoria;
    if (q) params.set("q", q);
    if (cidade) params.set("cidade", cidade);
    if (tipo) params.set("tipo", tipo);
    if (categoria) params.set("categoria", categoria);
    const search = params.toString();
    router.push(search ? `/imoveis?${search}` : "/imoveis");
    setOpen(false);
  }

  const summary = [defaults.q, defaults.cidade, defaults.tipo ? labelTipo(defaults.tipo) : "", defaults.categoria ? labelCategoria(defaults.categoria) : ""]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <Button type="button" variant="outline" className="w-full justify-start" onClick={() => setOpen(true)}>
        <Search />
        {summary || "Buscar imóvel, cidade ou tipo"}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Bairro, cidade ou título" value={query} onValueChange={setQuery} />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>Nenhum filtro encontrado.</CommandEmpty>
              <CommandGroup heading="Texto">
                <CommandItem value={`buscar ${query || "catalogo"}`} onSelect={() => go({ q: query })}>
                  Buscar {query ? `“${query}”` : "em todo o catálogo"}
                </CommandItem>
              </CommandGroup>
              {cidades.length > 0 ? (
                <CommandGroup heading="Cidade">
                  {cidades.map((cidade) => (
                    <CommandItem key={cidade} value={`cidade ${cidade}`} onSelect={() => go({ q: query, cidade })}>
                      {cidade}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              <CommandGroup heading="Tipo">
                {TIPOS.map((tipo) => (
                  <CommandItem key={tipo} value={`tipo ${labelTipo(tipo)}`} onSelect={() => go({ q: query, tipo })}>
                    {labelTipo(tipo)}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Categoria">
                {CATEGORIAS.map((categoria) => (
                  <CommandItem
                    key={categoria}
                    value={`categoria ${labelCategoria(categoria)}`}
                    onSelect={() => go({ q: query, categoria })}
                  >
                    {labelCategoria(categoria)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
      </CommandDialog>
    </>
  );
}
