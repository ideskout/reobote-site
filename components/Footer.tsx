import Link from "next/link";
import { Logo } from "@/components/Logo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const whatsapp = buildWhatsAppUrl(
    "Olá, Reobote. Quero conversar sobre um imóvel.",
  );
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs font-serif text-2xl italic leading-snug text-gold-300">
            Mais que imóveis, espaços para novos começos.
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-500">
            Navegação
          </p>
          <ul className="mt-4 space-y-3 text-sm text-mist">
            <li>
              <Link href="/" className="transition hover:text-ivory">
                Início
              </Link>
            </li>
            <li>
              <Link href="/#servicos" className="transition hover:text-ivory">
                Serviços
              </Link>
            </li>
            <li>
              <Link href="/#imoveis" className="transition hover:text-ivory">
                Imóveis
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="transition hover:text-ivory">
                Sobre
              </Link>
            </li>
            <li>
              <Link href="/admin" className="transition hover:text-ivory">
                Área do corretor
              </Link>
            </li>
          </ul>
        </div>

        <div id="contato">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-500">
            Contato
          </p>
          <p className="mt-4 text-sm leading-relaxed text-mist">
            Consultoria para compra, venda, locação e financiamento.
          </p>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex bg-gold-500 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-navy-950 transition hover:bg-gold-300"
            >
              Falar no WhatsApp
            </a>
          ) : (
            <p className="mt-5 text-sm text-mist">
              Defina NEXT_PUBLIC_WHATSAPP_PHONE para exibir o botão de contato.
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs tracking-wide text-mist">
        © {year} Reobote. Todos os direitos reservados.
      </div>
    </footer>
  );
}
