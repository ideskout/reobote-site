import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { corretora, empresa } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const links = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/sobre", label: "Sobre" },
  { href: "/admin", label: "Área do corretor" },
];

export function SiteFooter() {
  const whatsapp = buildWhatsAppUrl("Olá, Reobote. Quero conversar sobre um imóvel.");
  const year = new Date().getFullYear();

  return (
    <footer id="contato" className="border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-[1.2fr_0.8fr_1.1fr] md:px-12">
        <div className="flex flex-col gap-4">
          <Logo className="h-24 w-auto" />
          <p className="max-w-xs text-lg text-foreground">Mais que imóveis, espaços para novos começos.</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Navegação</p>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline hover:decoration-highlight"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium">Contato</p>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button type="button" className="flex items-center gap-3 text-left">
                <Avatar>
                  <AvatarImage src="/brand/elisangela.jpg" alt="" />
                  <AvatarFallback>ED</AvatarFallback>
                </Avatar>
                <span className="flex flex-col">
                  <span className="font-medium">{corretora.nome}</span>
                  <span className="text-sm text-muted-foreground">{corretora.cargo}</span>
                </span>
              </button>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-sm font-medium">{corretora.experiencia}</p>
              <p className="mt-2 text-sm text-muted-foreground">{corretora.frase}</p>
            </HoverCardContent>
          </HoverCard>
          <p className="text-sm text-muted-foreground">{empresa.creci}</p>
          {whatsapp ? (
            <a href={whatsapp} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" target="_blank" rel="noopener noreferrer">
              WhatsApp {empresa.whatsappExibicao}
            </a>
          ) : null}
          <a href={empresa.instagramUrl} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" target="_blank" rel="noopener noreferrer">
            Instagram {empresa.instagram}
          </a>
          {whatsapp ? (
            <Button asChild className="w-fit">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                Falar no WhatsApp
              </a>
            </Button>
          ) : null}
        </div>
      </div>
      <Separator />
      <p className="px-4 py-4 text-center text-xs text-muted-foreground">
        © {year} Reobote. Todos os direitos reservados.
      </p>
    </footer>
  );
}
