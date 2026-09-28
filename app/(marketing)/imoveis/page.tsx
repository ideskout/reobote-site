import type { Metadata } from "next";
import { ListingBrowser } from "@/components/listing-browser";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getImoveis, listCidades, PAGE_SIZE } from "@/lib/imoveis";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Imóveis",
  description: "Casas, apartamentos, salas e terrenos para compra e locação com a Reobote.",
};

type ListingProps = {
  searchParams: Promise<{
    q?: string;
    cidade?: string;
    tipo?: string;
    categoria?: string;
    page?: string;
    favoritos?: string;
  }>;
};

function pageHref(params: Record<string, string | undefined>, page: number) {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) next.set(key, value);
  }
  if (page > 1) next.set("page", String(page));
  const query = next.toString();
  return query ? `/imoveis?${query}` : "/imoveis";
}

export default async function ImoveisPage({ searchParams }: ListingProps) {
  const params = await searchParams;
  const favoritos = params.favoritos === "1";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = favoritos ? 48 : PAGE_SIZE;
  const [{ data, count, error }, cidades] = await Promise.all([
    getImoveis({
      q: params.q,
      cidade: params.cidade,
      tipo: params.tipo,
      categoria: params.categoria,
      page: favoritos ? 1 : page,
      pageSize,
    }),
    listCidades(),
  ]);

  const pages = Math.max(1, Math.ceil(count / pageSize));
  const filters = {
    q: params.q,
    cidade: params.cidade,
    tipo: params.tipo,
    categoria: params.categoria,
    favoritos: favoritos ? "1" : undefined,
  };

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20 md:px-12">
      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-6xl font-medium tracking-tight md:text-7xl">Imóveis</h1>
        <p className="text-muted-foreground">
          {error
            ? "Catálogo indisponível"
            : favoritos
              ? "Favoritos salvos neste navegador"
              : `${count} ${count === 1 ? "imóvel" : "imóveis"}`}
        </p>
      </div>
      {error === "missing_env" ? (
        <Alert>
          <AlertTitle>Conecte o catálogo</AlertTitle>
          <AlertDescription>
            Copie .env.example para .env.local e execute supabase/schema.sql no SQL Editor.
          </AlertDescription>
        </Alert>
      ) : error ? (
        <Alert>
          <AlertTitle>Não foi possível carregar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {error && error !== "missing_env" ? null : (
        <ListingBrowser imoveis={data} cidades={cidades} defaults={filters} />
      )}
      {!favoritos && pages > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={pageHref(filters, Math.max(1, page - 1))} />
            </PaginationItem>
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <PaginationItem key={number}>
                <PaginationLink href={pageHref(filters, number)} isActive={number === page}>
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href={pageHref(filters, Math.min(pages, page + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </section>
  );
}
