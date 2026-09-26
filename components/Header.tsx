"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/", label: "Início" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/#imoveis", label: "Imóveis" },
  { href: "/sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" aria-label="Reobote, página inicial" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-mist transition hover:text-gold-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="border border-gold-500/70 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gold-300 transition hover:bg-gold-500 hover:text-navy-950"
          >
            Área do corretor
          </Link>
        </nav>

        <button
          type="button"
          className="border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.16em] text-ivory md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="menu-mobile"
          className="border-t border-white/10 bg-navy-900 px-6 py-4 md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-[0.18em] text-ivory"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="text-sm uppercase tracking-[0.18em] text-gold-300"
              onClick={() => setOpen(false)}
            >
              Área do corretor
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
