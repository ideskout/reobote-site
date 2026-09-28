"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { friendlyError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;

    setPending(true);
    setError(null);
    const data = new FormData(event.currentTarget);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: String(data.get("email") ?? "").trim(),
        password: String(data.get("password") ?? ""),
      });
      if (signInError) throw new Error(signInError.message);
      router.push("/admin");
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Não foi possível entrar.";
      setError(friendlyError(message));
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-10 px-6 py-24">
      <Logo priority className="h-24 w-auto" />
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-4xl font-medium">Área do corretor</CardTitle>
          <CardDescription>Entre com o e-mail e a senha cadastrados no Supabase Auth.</CardDescription>
        </CardHeader>
        <CardContent>
          {!configured ? (
            <Alert>
              <AlertDescription>
                Copie .env.example para .env.local e preencha a URL e a chave anônima do Supabase.
              </AlertDescription>
            </Alert>
          ) : null}
          <form onSubmit={onSubmit} className="mt-4">
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input id="email" name="email" type="email" autoComplete="email" required disabled={!configured} />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input id="password" name="password" type="password" autoComplete="current-password" required disabled={!configured} />
              </Field>
              {error ? (
                <Alert>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <Button type="submit" className="w-full" disabled={!configured || pending}>
                {pending ? "Entrando..." : "Entrar"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
