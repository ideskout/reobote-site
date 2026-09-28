"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Link2, MoreHorizontal } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { PropertyQuickView } from "@/components/property-quick-view";
import { useFavorites } from "@/components/use-favorites";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatArea, formatPreco } from "@/lib/format";
import type { Imovel } from "@/types/imovel";

export function PropertyCard({ imovel }: { imovel: Imovel }) {
  const router = useRouter();
  const { has, toggle } = useFavorites();
  const [open, setOpen] = useState(false);
  const saved = has(imovel.id);
  const specs = [imovel.quartos > 0 ? `${imovel.quartos} quartos` : null, formatArea(imovel.area)].filter(Boolean);

  async function copyLink() {
    const url = `${window.location.origin}/imoveis/${imovel.id}`;
    await navigator.clipboard.writeText(url);
  }

  return (
    <article className="group relative overflow-hidden border bg-card">
      <div className="relative aspect-[3/4]">
        <Link href={`/imoveis/${imovel.id}`} className="absolute inset-0">
          {imovel.foto_url ? (
            <Image
              src={imovel.foto_url}
              alt={imovel.titulo}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full items-center justify-center">
              <LogoMark className="h-16 w-auto" />
            </span>
          )}
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-background/0 transition-colors duration-500 group-hover:bg-background/25" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant={saved ? "default" : "outline"}
                className="absolute right-4 top-4 z-10"
                aria-pressed={saved}
                aria-label={saved ? "Remover dos favoritos" : "Favoritar"}
                onClick={() => toggle(imovel.id)}
              >
                <Heart />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{saved ? "Remover dos favoritos" : "Favoritar"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-background/90 p-5">
          <p className="text-xs tracking-[0.18em] text-primary uppercase">{imovel.cidade}</p>
          <h3 className="font-serif text-3xl leading-none">
            <Link href={`/imoveis/${imovel.id}`}>{imovel.titulo}</Link>
          </h3>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100">
              {[formatPreco(imovel.preco, imovel.tipo), ...specs].filter(Boolean).join(" · ")}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
                Prévia
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" size="icon" variant="outline" aria-label="Ações do imóvel">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => router.push(`/imoveis/${imovel.id}`)}>Ver imóvel</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => toggle(imovel.id)}>
                      {saved ? "Remover dos favoritos" : "Favoritar"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => void copyLink()}>
                      <Link2 />
                      Copiar link
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <PropertyQuickView imovel={imovel} open={open} onOpenChange={setOpen} />
    </article>
  );
}
