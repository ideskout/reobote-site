"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { friendlyError } from "@/lib/errors";
import { buttonPrimary, fieldClass, labelClass } from "@/lib/styles";
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
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
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
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <Logo />
      <h1 className="mt-8 font-serif text-5xl text-ivory">Área do corretor</h1>
      <p className="mt-3 text-sm leading-relaxed text-mist">
        Entre com o e-mail e a senha cadastrados no Supabase Auth.
      </p>

      {!configured ? (
        <p className="mt-6 border border-gold-500/40 bg-navy-900 p-4 text-sm leading-relaxed text-gold-300">
          Copie .env.example para .env.local e preencha a URL e a chave anônima do Supabase
          antes de entrar.
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={!configured}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={!configured}
            className={fieldClass}
          />
        </div>
        {error ? (
          <p role="alert" className="text-sm text-gold-300">
            {error}
          </p>
        ) : null}
        <button type="submit" className={`${buttonPrimary} w-full`} disabled={!configured || pending}>
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
