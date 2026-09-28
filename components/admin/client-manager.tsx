"use client";

import { useActionState } from "react";
import { salvarCliente, type ActionState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Cliente } from "@/types/crm";
import { useState } from "react";

export function ClientManager({ clientes }: { clientes: Cliente[] }) {
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [state, action, pending] = useActionState<ActionState, FormData>(salvarCliente, null);

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Editar cliente" : "Novo cliente"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4" key={editing?.id ?? "novo"}>
            <input type="hidden" name="id" value={editing?.id ?? ""} />
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="nome">Nome</FieldLabel>
                <Input id="nome" name="nome" defaultValue={editing?.nome ?? ""} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
                <Input id="telefone" name="telefone" defaultValue={editing?.telefone ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input id="email" name="email" type="email" defaultValue={editing?.email ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="notas">Notas</FieldLabel>
                <Textarea id="notas" name="notas" defaultValue={editing?.notas ?? ""} rows={4} />
              </Field>
            </FieldGroup>
            {state ? (
              <Alert>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            ) : null}
            <div className="flex gap-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Salvando..." : "Salvar"}
              </Button>
              {editing ? (
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                Nenhum cliente ainda.
              </TableCell>
            </TableRow>
          ) : (
            clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="font-medium">{cliente.nome}</TableCell>
                <TableCell>{cliente.telefone || cliente.email || "—"}</TableCell>
                <TableCell>{cliente.origem}</TableCell>
                <TableCell className="text-right">
                  <Button type="button" variant="outline" size="sm" onClick={() => setEditing(cliente)}>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
