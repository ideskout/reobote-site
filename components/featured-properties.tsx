import Image from "next/image";
import Link from "next/link";
import AnimatedContent from "@/components/AnimatedContent";
import { LogoMark } from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatArea, formatPreco } from "@/lib/format";
import { labelTipo } from "@/lib/labels";
import type { Imovel } from "@/types/imovel";

export function FeaturedProperties({ imoveis }: { imoveis: Imovel[] }) {
  if (imoveis.length === 0) {
    return (
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        Os destaques aparecem aqui quando o catálogo estiver conectado.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-20 md:gap-28">
      {imoveis.map((imovel, index) => {
        const place = [imovel.bairro, imovel.cidade].filter(Boolean).join(" · ");
        const meta = [place, formatArea(imovel.area), labelTipo(imovel.tipo)].filter(Boolean).join("  ·  ");
        const imageFirst = index % 2 === 0;

        return (
          <AnimatedContent key={imovel.id} distance={36} duration={0.7} delay={index * 0.08} threshold={0.2}>
            <Card className="overflow-hidden border bg-card shadow-none">
              <div className="grid lg:grid-cols-[1.45fr_0.75fr]">
                <div className={`group relative min-h-[22rem] overflow-hidden bg-muted lg:min-h-[32rem] ${imageFirst ? "" : "lg:order-2"}`}>
                  <Link href={`/imoveis/${imovel.id}`} className="absolute inset-0" aria-label={imovel.titulo}>
                    {imovel.foto_url ? (
                      <Image
                        src={imovel.foto_url}
                        alt={imovel.titulo}
                        fill
                        sizes="(min-width: 1024px) 62vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out motion-reduce:transition-none motion-reduce:group-hover:scale-100 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center">
                        <LogoMark className="h-16 w-auto" />
                      </span>
                    )}
                  </Link>
                  <div className="pointer-events-none absolute inset-0 bg-background/0 transition-colors duration-700 ease-out group-hover:bg-background/20" />
                </div>
                <div className="flex flex-col justify-end gap-6 p-8 md:p-12">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs tracking-[0.22em] text-primary uppercase">{imovel.cidade}</p>
                    {imovel.destaque ? <Badge variant="outline">Destaque</Badge> : null}
                  </div>
                  <h3 className="font-serif text-4xl font-medium leading-[0.95] md:text-5xl">
                    <Link href={`/imoveis/${imovel.id}`}>{imovel.titulo}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">{meta}</p>
                  <p className="font-serif text-3xl">{formatPreco(imovel.preco, imovel.tipo)}</p>
                  <Button asChild variant="link" className="h-auto w-fit px-0 text-xs tracking-[0.2em] text-foreground uppercase">
                    <Link href={`/imoveis/${imovel.id}`}>Abrir ficha</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </AnimatedContent>
        );
      })}
    </div>
  );
}
