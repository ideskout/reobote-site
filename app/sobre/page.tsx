import type { Metadata } from "next";
import Link from "next/link";
import { buttonGhost, buttonPrimary } from "@/lib/styles";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a corretora à frente da Reobote, com CRECI ativo desde 2011.",
};

// Texto de exemplo. Troque o nome, o cargo e a trajetória quando quiser.
const corretora = {
  nome: "Helena Duarte",
  cargo: "Corretora responsável",
  frase: "Desde 2011, ao lado de quem está começando de novo.",
  creci: "CRECI ativo desde 2011",
};

const destaques = [
  {
    title: "Vivência no mercado",
    text: "Mais de uma década conduzindo compra, venda e locação, do primeiro contato à assinatura.",
    icon: <MarketIcon />,
  },
  {
    title: "Atendimento personalizado",
    text: "A busca parte do seu momento, com escuta, visitas e uma proposta feita sob medida.",
    icon: <CareIcon />,
  },
  {
    title: "Segurança jurídica",
    text: "Contratos, certidões e cada etapa da negociação explicados antes de qualquer assinatura.",
    icon: <ShieldIcon />,
  },
];

export default function SobrePage() {
  const whatsapp = buildWhatsAppUrl(
    "Olá, Reobote. Vi a página Sobre e quero conversar com a corretora.",
  );

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[0.82fr_1.18fr]">
        <figure className="relative mx-auto w-full max-w-sm">
          <div className="flex aspect-[3/4] flex-col items-center justify-center border border-gold-500/40 bg-navy-900">
            <PortraitPlaceholder />
            <figcaption className="mt-6 text-[11px] uppercase tracking-[0.22em] text-gold-300">
              Foto em breve
            </figcaption>
          </div>
          <span className="pointer-events-none absolute -left-3 -top-3 h-10 w-10 border-l border-t border-gold-300" />
          <span className="pointer-events-none absolute -bottom-3 -right-3 h-10 w-10 border-b border-r border-gold-300" />
        </figure>

        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold-500">
            A consultoria
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.95] text-ivory sm:text-6xl">
            {corretora.nome}
          </h1>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold-300">
            {corretora.cargo}
          </p>
          <p className="mt-6 max-w-xl font-serif text-3xl italic leading-snug text-gold-300">
            {corretora.frase}
          </p>
          <p className="mt-6 inline-flex border border-gold-500/50 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ivory">
            {corretora.creci}
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-navy-900/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold-500">
            História
          </p>
          <h2 className="mt-3 font-serif text-4xl text-ivory md:text-5xl">
            Minha trajetória
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-mist">
            Desde 2011 acompanho o mercado imobiliário de perto, em compras,
            vendas e locações que pedem mais do que pressa. Aprendi que um bom
            endereço não se resume a metragem e bairro: ele precisa caber no
            momento de quem chega. Na Reobote, cada negociação segue com calma,
            documentação clara e, quando faz sentido, um caminho de
            financiamento explicado sem letra miúda. O objetivo é simples —
            entregar a chave de um espaço onde uma nova história pode começar.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-serif text-4xl text-ivory md:text-5xl">
          Como eu trabalho
        </h2>
        <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
          {destaques.map((item) => (
            <article key={item.title} className="bg-navy-950 p-6">
              <div className="text-gold-300">{item.icon}</div>
              <h3 className="mt-6 font-serif text-3xl text-ivory">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-navy-900">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="max-w-xl font-serif text-4xl text-ivory md:text-5xl">
            Vamos conversar sobre o seu próximo endereço.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonPrimary}
              >
                Falar no WhatsApp
              </a>
            ) : (
              <p className="text-sm text-mist">
                Defina NEXT_PUBLIC_WHATSAPP_PHONE para exibir o botão de contato.
              </p>
            )}
            <Link href="/imoveis" className={buttonGhost}>
              Ver imóveis disponíveis
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PortraitPlaceholder() {
  return (
    <svg viewBox="0 0 80 80" className="h-24 w-24" fill="none" aria-hidden="true">
      <circle cx="40" cy="30" r="12" stroke="#c9a24a" strokeWidth="1.4" />
      <path
        d="M18 66c3.5-12 13-18 22-18s18.5 6 22 18"
        stroke="#e6c97a"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function MarketIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <path d="M4 26V14l12-8 12 8v12" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13 26v-7h6v7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function CareIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <circle cx="16" cy="11" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 26c1.4-5 4.6-7.5 9-7.5S23.6 21 25 26" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <path d="M16 4 6 8v8c0 6.2 4.2 10.4 10 12 5.8-1.6 10-5.8 10-12V8L16 4Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="m12 16 3 3 5-6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
