"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/sobre", label: "Sobre" },
  { href: "/#contato", label: "Contato" },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4 md:px-10">
        <Link href="/" aria-label="Reobote, página inicial">
          <Logo priority className="h-12 w-auto" />
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {links.map((link) => {
            const current = isCurrent(pathname, link.href);
            return (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className={cn(
                  "hover:bg-highlight/10 hover:text-foreground",
                  current && "underline decoration-highlight decoration-2 underline-offset-8",
                )}
              >
                <Link href={link.href} aria-current={current ? "page" : undefined}>
                  {link.label}
                </Link>
              </Button>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" className="hidden md:inline-flex">
            <Link href="/admin">Área do corretor</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2" aria-label="Mobile">
                {links.map((link) => (
                  <Button key={link.href} variant="ghost" className="justify-start hover:bg-highlight/10" asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
                <Button asChild>
                  <Link href="/admin">Área do corretor</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
