import Image from "next/image";
import Link from "next/link";
import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import { PropertyRail } from "@/components/property-rail";
import { TextReveal } from "@/components/text-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getImoveis } from "@/lib/imoveis";
import { corretora, empresa, getSiteUrl } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const revalidate = 60;

const servicos = ["Compra", "Venda", "Locação", "Financiamento", "Investimentos"];

export default async function HomePage() {
  const catalogo = await getImoveis({ page: 1, pageSize: 8 });
  const whatsapp = buildWhatsAppUrl("Olá, Reobote. Quero começar uma conversa sobre um imóvel.");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: empresa.nome,
    url: getSiteUrl(),
    description: empresa.introducao[1],
    image: `${getSiteUrl()}/brand/elisangela.jpg`,
    employee: {
      "@type": "Person",
      name: corretora.nome,
      jobTitle: corretora.cargo,
      image: `${getSiteUrl()}/brand/elisangela.jpg`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="grid min-h-[calc(100svh-5rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <FadeContent className="flex flex-col justify-end gap-8 px-6 py-16 md:px-12 lg:py-24">
          <p className="text-xs tracking-[0.28em] text-primary uppercase">{empresa.nome}</p>
          <TextReveal
            text="Seu próximo imóvel começa aqui."
            className="max-w-4xl font-serif text-[clamp(4.5rem,7vw,7.5rem)] font-medium leading-[0.9] tracking-tight"
          />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{empresa.slogan}</p>
          <Button asChild variant="outline" className="w-fit">
            <Link href="/imoveis">Ver imóveis</Link>
          </Button>
        </FadeContent>
        <div className="relative min-h-[70vh] overflow-hidden lg:min-h-full">
          <Image
            src="/brand/elisangela.jpg"
            alt="Elisangela Dias, corretora responsável pela Reobote"
            fill
            priority
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover object-[center_38%] transition-transform duration-1000 hover:scale-[1.03]"
          />
        </div>
      </section>

      <section className="flex flex-col gap-10 py-24">
        <div className="flex items-end justify-between gap-6 px-6 md:px-12">
          <h2 className="font-serif text-5xl font-medium tracking-tight md:text-6xl">Imóveis</h2>
          <Button asChild variant="outline">
            <Link href="/imoveis">Ver todos</Link>
          </Button>
        </div>
        <PropertyRail imoveis={catalogo.data} />
      </section>

      <AnimatedContent distance={24} duration={0.5}>
        <section className="grid items-center gap-16 px-6 py-24 md:px-12 lg:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden border">
            <Image
              src="/brand/elisangela.jpg"
              alt="Elisangela Dias"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[center_38%]"
            />
          </div>
          <div className="flex flex-col gap-8">
            <p className="text-xs tracking-[0.28em] text-primary uppercase">{corretora.nome}</p>
            <h2 className="font-serif text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">{empresa.titulo}</h2>
            {empresa.introducao.map((paragrafo) => (
              <p key={paragrafo} className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                {paragrafo}
              </p>
            ))}
            <dl className="grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col gap-1 border-t pt-4">
                <dt className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Desde</dt>
                <dd className="font-serif text-4xl text-primary">2017</dd>
              </div>
              <div className="flex flex-col gap-1 border-t pt-4">
                <dt className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Experiência</dt>
                <dd className="font-serif text-4xl text-primary">11 anos</dd>
              </div>
              <div className="flex flex-col gap-1 border-t pt-4">
                <dt className="text-xs tracking-[0.18em] text-muted-foreground uppercase">CRECI-SP</dt>
                <dd className="font-serif text-4xl text-primary">105318-F</dd>
              </div>
            </dl>
            <Button asChild variant="outline" className="w-fit">
              <Link href="/sobre">Conhecer a Reobote</Link>
            </Button>
          </div>
        </section>
      </AnimatedContent>

      <section className="px-6 py-24 md:px-12">
        <h2 className="mb-12 font-serif text-5xl font-medium tracking-tight md:text-6xl">Serviços</h2>
        <div className="grid gap-4 md:grid-cols-5">
          {servicos.map((item) => (
            <Card key={item} className="min-h-40 bg-card">
              <CardHeader className="h-full justify-end">
                <CardTitle className="font-serif text-3xl font-medium">{item}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 md:px-12">
        <div className="flex max-w-3xl flex-col gap-6">
          <h2 className="font-serif text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
            Vamos conversar sobre o próximo endereço.
          </h2>
          <p className="text-sm text-muted-foreground">{empresa.whatsappExibicao}</p>
          {whatsapp ? (
            <Button asChild className="w-fit">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                Falar no WhatsApp
              </a>
            </Button>
          ) : (
            <Button asChild variant="outline" className="w-fit">
              <Link href="/#contato">Contato</Link>
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
