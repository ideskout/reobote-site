import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinancingSimulator } from "@/components/FinancingSimulator";
import { LogoMark } from "@/components/Logo";
import { formatArea, formatData, formatPreco } from "@/lib/format";
import { getImovel } from "@/lib/imoveis";
import { labelCategoria, labelTipo } from "@/lib/labels";
import { buttonPrimary } from "@/lib/styles";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type DetailProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const imovel = await getImovel(params.id);
  if (!imovel) return { title: "Imóvel não encontrado" };
  return {
    title: imovel.titulo,
    description: imovel.descricao.slice(0, 160),
  };
}

export default async function ImovelPage({ params }: DetailProps) {
  const imovel = await getImovel(params.id);
  if (!imovel) notFound();

  const whatsapp = buildWhatsAppUrl(
    `Olá, Reobote. Tenho interesse no imóvel "${imovel.titulo}" em ${imovel.cidade}.`,
  );

  const specs = [
    { label: "Cidade", value: imovel.cidade },
    { label: "Categoria", value: labelCategoria(imovel.categoria) },
    { label: "Tipo", value: labelTipo(imovel.tipo) },
    { label: "Quartos", value: imovel.quartos > 0 ? String(imovel.quartos) : "—" },
    { label: "Área", value: formatArea(imovel.area) },
  ];

  return (
    <article className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-sm text-mist">
        <Link href="/" className="transition hover:text-gold-300">
          Início
        </Link>
        <span className="px-2 text-white/30">/</span>
        <Link href="/#imoveis" className="transition hover:text-gold-300">
          Imóveis
        </Link>
        <span className="px-2 text-white/30">/</span>
        <span className="text-ivory">{imovel.titulo}</span>
      </p>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.35fr_0.75fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold-500">Galeria</p>
          <div className="relative mt-4 aspect-[16/10] overflow-hidden border border-white/10 bg-navy-900">
            {imovel.foto_url ? (
              <Image
                src={imovel.foto_url}
                alt={imovel.titulo}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gold-500">
                <LogoMark className="h-16 w-16" />
              </div>
            )}
          </div>
          <div className="mt-3 flex gap-3">
            <div className="relative h-20 w-28 overflow-hidden border border-gold-500">
              {imovel.foto_url ? (
                <Image
                  src={imovel.foto_url}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-navy-800" />
              )}
            </div>
          </div>

          <h2 className="mt-12 font-serif text-4xl text-ivory">Sobre este espaço</h2>
          <p className="mt-4 max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-mist">
            {imovel.descricao}
          </p>
          {imovel.created_at ? (
            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-mist">
              Publicado em {formatData(imovel.created_at)}
            </p>
          ) : null}

          <FinancingSimulator preco={imovel.preco} titulo={imovel.titulo} />
        </div>

        <aside className="border border-white/10 bg-navy-900/80 p-6 lg:sticky lg:top-24">
          <div className="flex gap-2">
            <span className="bg-navy-950 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ivory">
              {labelCategoria(imovel.categoria)}
            </span>
            <span className="bg-gold-500 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-navy-950">
              {labelTipo(imovel.tipo)}
            </span>
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-ivory">{imovel.titulo}</h1>
          <p className="mt-2 text-sm text-mist">{imovel.cidade}</p>
          <p className="mt-6 font-serif text-4xl text-gold-300">
            {formatPreco(imovel.preco, imovel.tipo)}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-mist">{spec.label}</dt>
                <dd className="mt-1 text-sm text-ivory">{spec.value}</dd>
              </div>
            ))}
          </dl>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonPrimary} mt-8 w-full`}
            >
              Falar no WhatsApp
            </a>
          ) : (
            <p className="mt-8 text-sm text-mist">
              Defina NEXT_PUBLIC_WHATSAPP_PHONE para ativar o contato.
            </p>
          )}
        </aside>
      </div>
    </article>
  );
}
