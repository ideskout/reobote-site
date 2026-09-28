"use client";

import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatArea, formatPreco } from "@/lib/format";
import { labelCategoria, labelTipo } from "@/lib/labels";
import type { Imovel } from "@/types/imovel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

function Preview({ imovel }: { imovel: Imovel }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-muted">
        {imovel.foto_url ? (
          <Image src={imovel.foto_url} alt={imovel.titulo} fill sizes="480px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <LogoMark className="h-16 w-auto" />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {imovel.destaque ? <Badge>Destaque</Badge> : null}
        <Badge variant="secondary">{labelCategoria(imovel.categoria)}</Badge>
        <Badge variant="outline">{labelTipo(imovel.tipo)}</Badge>
      </div>
      <p className="text-2xl font-semibold">{formatPreco(imovel.preco, imovel.tipo)}</p>
      <p className="text-sm text-muted-foreground">
        {[imovel.bairro, imovel.cidade, imovel.quartos > 0 ? `${imovel.quartos} quartos` : null, formatArea(imovel.area)]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <p className="line-clamp-4 text-sm text-muted-foreground">{imovel.descricao}</p>
    </div>
  );
}

export function PropertyQuickView({
  imovel,
  open,
  onOpenChange,
}: {
  imovel: Imovel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mobile = useIsMobile();
  const preview = <Preview imovel={imovel} />;
  const actions = (
    <Button asChild>
      <Link href={`/imoveis/${imovel.id}`}>Ver imóvel</Link>
    </Button>
  );

  if (mobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{imovel.titulo}</DrawerTitle>
            <DrawerDescription>{imovel.cidade}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{preview}</div>
          <DrawerFooter>{actions}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{imovel.titulo}</DialogTitle>
          <DialogDescription>{imovel.cidade}</DialogDescription>
        </DialogHeader>
        {preview}
        <DialogFooter>{actions}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
