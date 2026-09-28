import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { formatPreco } from "@/lib/format";
import type { Imovel } from "@/types/imovel";

export function PropertyRail({ imoveis }: { imoveis: Imovel[] }) {
  if (imoveis.length === 0) {
    return (
      <p className="px-6 text-sm text-muted-foreground md:px-12">
        O catálogo aparece aqui quando o Supabase estiver conectado.
      </p>
    );
  }

  return (
    <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:px-12">
      {imoveis.map((imovel) => (
        <Link
          key={imovel.id}
          href={`/imoveis/${imovel.id}`}
          className="group relative aspect-[3/4] w-[82vw] max-w-xl shrink-0 snap-start overflow-hidden border bg-card md:w-[58vw] lg:w-[42vw]"
        >
          {imovel.foto_url ? (
            <Image
              src={imovel.foto_url}
              alt={imovel.titulo}
              fill
              sizes="(min-width: 1024px) 42vw, 80vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full items-center justify-center">
              <LogoMark className="h-16 w-auto" />
            </span>
          )}
          <span className="absolute inset-0 bg-background/0 transition-colors duration-500 group-hover:bg-background/25" />
          <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-background/90 p-6">
            <span className="text-xs tracking-[0.18em] text-primary uppercase">{imovel.cidade}</span>
            <span className="font-serif text-3xl leading-none text-foreground">{imovel.titulo}</span>
            <span className="text-sm text-muted-foreground opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100">
              {formatPreco(imovel.preco, imovel.tipo)}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
