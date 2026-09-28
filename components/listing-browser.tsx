"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { PropertySearch } from "@/components/property-search";
import { useFavorites } from "@/components/use-favorites";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIAS, TIPOS, labelCategoria, labelTipo } from "@/lib/labels";
import type { Imovel } from "@/types/imovel";

type Filters = {
  q?: string;
  cidade?: string;
  tipo?: string;
  categoria?: string;
  favoritos?: string;
};

function href(filters: Filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/imoveis?${query}` : "/imoveis";
}

export function ListingBrowser({
  imoveis,
  cidades,
  defaults,
}: {
  imoveis: Imovel[];
  cidades: string[];
  defaults: Filters;
}) {
  const router = useRouter();
  const { ids } = useFavorites();
  const [cidade, setCidade] = useState(defaults.cidade || "todos");
  const [categoria, setCategoria] = useState(defaults.categoria || "todos");
  const favoritos = defaults.favoritos === "1";
  const visible = favoritos ? imoveis.filter((imovel) => ids.includes(imovel.id)) : imoveis;

  function apply(next: Filters) {
    router.push(href({ ...defaults, ...next }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <PropertySearch cidades={cidades} defaults={defaults} />
        </div>
        <Tabs value={defaults.tipo || "todos"} onValueChange={(value) => apply({ tipo: value === "todos" ? undefined : value })}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            {TIPOS.map((tipo) => (
              <TabsTrigger key={tipo} value={tipo}>
                {labelTipo(tipo)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button
          type="button"
          variant={favoritos ? "default" : "outline"}
          onClick={() => apply({ favoritos: favoritos ? undefined : "1" })}
        >
          Favoritos
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button type="button" variant="outline" className="md:hidden">
              <SlidersHorizontal />
              Filtros
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filtros</DrawerTitle>
            </DrawerHeader>
            <div className="px-4">
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel>Cidade</FieldLabel>
                  <Select value={cidade} onValueChange={setCidade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="todos">Todas</SelectItem>
                        {cidades.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Categoria</FieldLabel>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="todos">Todas</SelectItem>
                        {CATEGORIAS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {labelCategoria(item)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </div>
            <DrawerFooter>
              <Button
                type="button"
                onClick={() =>
                  apply({
                    cidade: cidade === "todos" ? undefined : cidade,
                    categoria: categoria === "todos" ? undefined : categoria,
                  })
                }
              >
                Aplicar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      {visible.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{favoritos ? "Nenhum favorito ainda" : "Nenhum imóvel encontrado"}</EmptyTitle>
            <EmptyDescription>
              {favoritos ? "Toque no coração de um imóvel para guardá-lo neste navegador." : "Ajuste a busca ou limpe os filtros."}
            </EmptyDescription>
          </EmptyHeader>
          <Button type="button" variant="outline" onClick={() => router.push("/imoveis")}>
            Limpar filtros
          </Button>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((imovel) => (
            <PropertyCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      )}
    </div>
  );
}
