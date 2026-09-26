import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { buttonGhost, buttonPrimary } from "@/lib/styles";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

export function Hero() {
  const whatsapp = buildWhatsAppUrl(
    "Olá, Reobote. Quero começar uma conversa sobre um imóvel.",
  );

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold-500">
          Consultoria imobiliária
        </p>
        <h1 className="mt-5 font-serif text-5xl leading-[0.95] text-ivory sm:text-6xl lg:text-7xl">
          Encontre o lugar onde a próxima história começa.
        </h1>
        <p className="mt-6 max-w-xl font-serif text-2xl italic text-gold-300">
          Mais que imóveis, espaços para novos começos.
        </p>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-mist">
          Acompanhamos compra, venda, locação e financiamento com calma e
          critério — do primeiro olhar à entrega das chaves.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/#imoveis" className={buttonPrimary}>
            Explorar imóveis
          </Link>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonGhost}
            >
              Falar no WhatsApp
            </a>
          ) : (
            <Link href="/#servicos" className={buttonGhost}>
              Conhecer os serviços
            </Link>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="relative aspect-[4/5] overflow-hidden border border-gold-500/40 bg-navy-900">
          <Image
            src={HERO_IMAGE}
            alt="Fachada de uma casa contemporânea ao entardecer"
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-navy-950/20" />
        </div>
        <span className="pointer-events-none absolute -left-3 -top-3 h-10 w-10 border-l border-t border-gold-300" />
        <span className="pointer-events-none absolute -bottom-3 -right-3 h-10 w-10 border-b border-r border-gold-300" />
        <p className="absolute bottom-6 left-6 right-6 font-serif text-2xl italic text-ivory">
          Um endereço. Um recomeço.
        </p>
      </div>
    </section>
  );
}
