"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/property-form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { friendlyError } from "@/lib/errors";
import { formatPreco } from "@/lib/format";
import { labelCategoria, labelTipo } from "@/lib/labels";
import { removeFoto } from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
import type { Imovel } from "@/types/imovel";

export function PropertyManager({ initialImoveis }: { initialImoveis: Imovel[] }) {
  const router = useRouter();
  const [imoveis, setImoveis] = useState(initialImoveis);
  const [editing, setEditing] = useState<Imovel | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<Imovel | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleSaved(imovel: Imovel) {
    setImoveis((current) => {
      const exists = current.some((item) => item.id === imovel.id);
      if (!exists) return [imovel, ...current];
      return current.map((item) => (item.id === imovel.id ? imovel : item));
    });
    setEditing(null);
    setFormKey((value) => value + 1);
    setMessage("Imóvel salvo.");
    router.refresh();
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const supabase = createClient();
    const { error } = await supabase.from("imoveis").delete().eq("id", pendingDelete.id);
    if (error) {
      setMessage(friendlyError(error.message));
      setPendingDelete(null);
      return;
    }
    await removeFoto(pendingDelete.foto_url);
    setImoveis((current) => current.filter((item) => item.id !== pendingDelete.id));
    if (editing?.id === pendingDelete.id) {
      setEditing(null);
      setFormKey((value) => value + 1);
    }
    setMessage("Imóvel excluído.");
    setPendingDelete(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <PropertyForm
        key={editing?.id ?? `novo-${formKey}`}
        imovel={editing}
        onSaved={handleSaved}
        onCancel={
          editing
            ? () => {
                setEditing(null);
                setFormKey((value) => value + 1);
              }
            : undefined
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imóvel</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {imoveis.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                Nenhum imóvel cadastrado ainda.
              </TableCell>
            </TableRow>
          ) : (
            imoveis.map((imovel) => (
              <TableRow key={imovel.id}>
                <TableCell>
                  <p className="font-medium">{imovel.titulo}</p>
                  <p className="text-sm text-muted-foreground">
                    {labelCategoria(imovel.categoria)} · {labelTipo(imovel.tipo)}
                  </p>
                </TableCell>
                <TableCell>{imovel.cidade}</TableCell>
                <TableCell>{formatPreco(imovel.preco, imovel.tipo)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditing(imovel)}>
                      Editar
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => setPendingDelete(imovel)}>
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir imóvel</AlertDialogTitle>
            <AlertDialogDescription>
              Excluir &quot;{pendingDelete?.titulo}&quot; não pode ser desfeito.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
