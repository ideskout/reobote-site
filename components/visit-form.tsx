"use client";

import { useActionState } from "react";
import { agendarVisita, type ActionState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function VisitForm({ imovelId, titulo }: { imovelId: string; titulo: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(agendarVisita, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendar visita</CardTitle>
        <CardDescription>Conte quando você pode ver {titulo}. A corretora confirma pelo telefone.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="imovel_id" value={imovelId} />
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="nome">Nome</FieldLabel>
              <Input id="nome" name="nome" required autoComplete="name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
              <Input id="telefone" name="telefone" required autoComplete="tel" inputMode="tel" />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input id="email" name="email" type="email" autoComplete="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="quando">Data e horário</FieldLabel>
              <Input id="quando" name="quando" type="datetime-local" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="mensagem">Mensagem</FieldLabel>
              <Textarea id="mensagem" name="mensagem" rows={3} />
            </Field>
          </FieldGroup>
          {state ? (
            <Alert>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Enviando..." : "Pedir visita"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
