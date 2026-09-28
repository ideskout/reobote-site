import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimatedContent from "@/components/AnimatedContent";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { corretora, empresa } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Sobre",
  description: `${empresa.titulo} ${empresa.nome} desde ${empresa.desde}. ${empresa.creci}.`,
  openGraph: {
    images: [{ url: "/brand/elisangela.jpg", alt: "Elisangela Dias, corretora da Reobote" }],
  },
};

const servicos = ["Compra", "Venda", "Locação", "Financiamento", "Investimentos"];

export default function SobrePage() {
  const whatsapp = buildWhatsAppUrl("Olá, Reobote. Vi a página Sobre e quero conversar sobre um imóvel.");

  return (
    <>
      <section className="grid items-end gap-16 px-6 py-20 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
        <div className="relative aspect-[3/4] overflow-hidden border">
          <Image
            src="/brand/elisangela.jpg"
            alt="Elisangela Dias, corretora responsável pela Reobote"
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-[center_38%]"
          />
        </div>
        <div className="flex flex-col gap-8">
          <p className="text-xs tracking-[0.28em] text-primary uppercase">{empresa.nome}</p>
          <h1 className="font-serif text-[clamp(3.5rem,6vw,6rem)] font-medium leading-[0.92] tracking-tight">
            {empresa.titulo}
          </h1>
          <p className="text-sm text-muted-foreground">
            {corretora.nome} · {corretora.cargo}
          </p>
          <div className="flex max-w-xl flex-col gap-6">
            {empresa.introducao.map((paragrafo) => (
              <p key={paragrafo} className="text-sm leading-relaxed text-muted-foreground">
                {paragrafo}
              </p>
            ))}
          </div>
        </div>
      </section>

      <AnimatedContent distance={20} duration={0.45}>
        <section className="grid gap-10 border-y px-6 py-20 md:grid-cols-3 md:px-12">
          <div className="flex flex-col gap-2">
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Desde</p>
            <p className="font-serif text-6xl text-primary">2017</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Experiência</p>
            <p className="font-serif text-6xl text-primary">11 anos</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">CRECI-SP</p>
            <p className="font-serif text-6xl text-primary">105318-F</p>
          </div>
        </section>
      </AnimatedContent>

      <section className="grid gap-16 px-6 py-24 md:px-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h2 className="font-serif text-5xl font-medium">Atendimento</h2>
          {empresa.atendimento.map((paragrafo) => (
            <p key={paragrafo} className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {paragrafo}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="font-serif text-5xl font-medium text-primary">Missão</h2>
          <p className="max-w-xl text-lg leading-relaxed">{empresa.missao}</p>
          <p className="text-sm text-muted-foreground">{empresa.slogan}</p>
        </div>
      </section>

      <section className="px-6 py-8 md:px-12">
        <h2 className="mb-8 font-serif text-5xl font-medium">Diferenciais</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {empresa.diferenciais.map((item) => (
            <Card key={item}>
              <CardHeader>
                <CardTitle className="font-serif text-2xl font-medium">{item}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 md:px-12">
        <h2 className="mb-8 font-serif text-5xl font-medium text-primary">Serviços</h2>
        <div className="grid gap-4 md:grid-cols-5">
          {servicos.map((item) => (
            <Card key={item} className="min-h-36">
              <CardHeader className="h-full justify-end">
                <CardTitle className="font-serif text-3xl font-medium">{item}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="contato" className="px-6 py-24 md:px-12">
        <div className="flex max-w-3xl flex-col gap-6">
          <h2 className="font-serif text-5xl font-medium md:text-7xl">Entre em contato</h2>
          <p className="text-sm text-muted-foreground">{empresa.whatsappExibicao}</p>
          <p className="text-sm text-muted-foreground">
            <a href={empresa.instagramUrl} className="underline-offset-4 hover:text-foreground hover:underline" target="_blank" rel="noopener noreferrer">
              {empresa.instagram}
            </a>
          </p>
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
