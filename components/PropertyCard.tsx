import Image from "next/image";
import Link from "next/link";
import { formatArea, formatPreco } from "@/lib/format";
import { labelCategoria, labelTipo } from "@/lib/labels";
import { LogoMark } from "@/components/Logo";
import type { Imovel } from "@/types/imovel";

export function PropertyCard({ imovel }: { imovel: Imovel }) {
  const specs = [
    imovel.quartos > 0 ? `${imovel.quartos} quartos` : null,
    formatArea(imovel.area),
  ].filter(Boolean);

  return (
    <Link
      href={`/imoveis/${imovel.id}`}
      className="group flex h-full flex-col border border-white/10 bg-navy-900/70 transition hover:border-gold-500/70"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-800">
        {imovel.foto_url ? (
          <Image
            src={imovel.foto_url}
            alt={imovel.titulo}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gold-500">
            <LogoMark className="h-14 w-14" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="bg-navy-950/85 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ivory backdrop-blur">
            {labelCategoria(imovel.categoria)}
          </span>
          <span className="bg-gold-500 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-navy-950">
            {labelTipo(imovel.tipo)}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-2xl leading-tight text-ivory">
          {imovel.titulo}
        </h3>
        <p className="mt-2 text-sm text-mist">{imovel.cidade}</p>
        <p className="mt-5 font-serif text-2xl text-gold-300">
          {formatPreco(imovel.preco, imovel.tipo)}
        </p>
        <p className="mt-auto pt-4 text-[11px] uppercase tracking-[0.16em] text-mist">
          {specs.join(" · ")}
        </p>
      </div>
    </Link>
  );
}
