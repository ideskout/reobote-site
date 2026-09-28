import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinancingSimulator } from "@/components/financing-simulator";
import { LogoMark } from "@/components/Logo";
import { PropertyMap } from "@/components/property-map";
import { PropertyShare } from "@/components/property-share";
import { VisitForm } from "@/components/visit-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatArea, formatData, formatPreco } from "@/lib/format";
import { getImovel } from "@/lib/imoveis";
import { labelCategoria, labelTipo } from "@/lib/labels";
import { getSiteUrl } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type DetailProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const { id } = await params;
  const imovel = await getImovel(id);
  if (!imovel) return { title: "Imóvel não encontrado" };
  return {
    title: imovel.titulo,
    description: imovel.descricao.slice(0, 160),
    openGraph: {
      title: imovel.titulo,
      description: imovel.descricao.slice(0, 160),
      images: imovel.foto_url ? [imovel.foto_url] : undefined,
    },
  };
}

export default async function ImovelPage({ params }: DetailProps) {
  const { id } = await params;
  const imovel = await getImovel(id);
  if (!imovel) notFound();

  const whatsapp = buildWhatsAppUrl(
    `Olá, Reobote. Tenho interesse no imóvel "${imovel.titulo}" em ${imovel.cidade}.`,
  );
  const specs = [
    { label: "Cidade", value: imovel.cidade },
    { label: "Bairro", value: imovel.bairro ?? "—" },
    { label: "Categoria", value: labelCategoria(imovel.categoria) },
    { label: "Tipo", value: labelTipo(imovel.tipo) },
    { label: "Quartos", value: imovel.quartos > 0 ? String(imovel.quartos) : "—" },
    { label: "Área", value: formatArea(imovel.area) },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: imovel.titulo,
    description: imovel.descricao,
    url: `${getSiteUrl()}/imoveis/${imovel.id}`,
    image: imovel.foto_url ?? undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: imovel.cidade,
      streetAddress: imovel.endereco ?? undefined,
    },
  };

  return (
    <article className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16 md:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/imoveis">Imóveis</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{imovel.titulo}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="flex flex-col gap-8">
          <div className="relative aspect-[4/5] overflow-hidden border bg-card md:aspect-[16/10]">
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
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <LogoMark className="h-20 w-auto" />
              </div>
            )}
          </div>
          <div>
            <h2 className="font-serif text-4xl font-medium">Sobre este espaço</h2>
            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-muted-foreground">{imovel.descricao}</p>
            {imovel.created_at ? (
              <p className="mt-4 text-sm text-muted-foreground">Publicado em {formatData(imovel.created_at)}</p>
            ) : null}
          </div>
          <PropertyMap
            titulo={imovel.titulo}
            endereco={imovel.endereco}
            cidade={imovel.cidade}
            latitude={imovel.latitude}
            longitude={imovel.longitude}
          />
          <FinancingSimulator preco={imovel.preco} titulo={imovel.titulo} />
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          <Card>
            <CardHeader className="gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{labelCategoria(imovel.categoria)}</Badge>
                <Badge>{labelTipo(imovel.tipo)}</Badge>
              </div>
              <CardTitle className="font-serif text-4xl font-medium md:text-5xl">{imovel.titulo}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {[imovel.endereco, imovel.bairro, imovel.cidade].filter(Boolean).join(" · ")}
              </p>
              <p className="text-3xl font-semibold">{formatPreco(imovel.preco, imovel.tipo)}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <dl className="grid grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                    <dd className="text-sm font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <Separator />
              <PropertyShare title={imovel.titulo} city={imovel.cidade} />
              {whatsapp ? (
                <Button asChild>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                    Falar no WhatsApp
                  </a>
                </Button>
              ) : null}
            </CardContent>
          </Card>
          <VisitForm imovelId={imovel.id} titulo={imovel.titulo} />
        </div>
      </div>
    </article>
  );
}
