import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilter } from "@/components/PropertyFilter";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { getImoveis, listCidades } from "@/lib/imoveis";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: {
    q?: string;
    cidade?: string;
    tipo?: string;
    categoria?: string;
  };
};

export default async function HomePage({ searchParams }: HomeProps) {
  const [{ data: imoveis, error }, cidades] = await Promise.all([
    getImoveis(searchParams),
    listCidades(),
  ]);

  return (
    <>
      <Hero />
      <Services />
      <section id="imoveis" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold-500">Portfólio</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-4xl text-ivory md:text-5xl">Imóveis disponíveis</h2>
          {error === null ? (
            <p className="text-sm text-mist">
              {imoveis.length} {imoveis.length === 1 ? "imóvel" : "imóveis"}
            </p>
          ) : null}
        </div>

        {error === "missing_env" ? (
          <div className="mt-10 border border-gold-500/40 bg-navy-900 p-6">
            <h3 className="font-serif text-3xl text-ivory">Conecte o catálogo</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist">
              Crie um projeto no Supabase, execute o arquivo supabase/schema.sql no SQL Editor
              e copie .env.example para .env.local com a URL e a chave anônima. O filtro e a
              grade passam a ler a tabela imoveis assim que o servidor reiniciar.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <Suspense fallback={<div className="h-40 border border-white/10 bg-navy-900/40" />}>
                <PropertyFilter cidades={cidades} />
              </Suspense>
            </div>
            {error ? (
              <p className="mt-8 text-sm text-gold-300">{error}</p>
            ) : imoveis.length === 0 ? (
              <p className="mt-10 font-serif text-2xl text-mist">
                Nenhum imóvel encontrado para essa busca.
              </p>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {imoveis.map((imovel) => (
                  <PropertyCard key={imovel.id} imovel={imovel} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
      <Testimonials />
    </>
  );
}
