import Link from "next/link";
import { buttonPrimary } from "@/lib/styles";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold-500">404</p>
      <h1 className="mt-4 font-serif text-5xl text-ivory">Página não encontrada</h1>
      <p className="mt-4 text-mist">Esse endereço não faz parte do site da Reobote.</p>
      <Link href="/" className={`${buttonPrimary} mt-8`}>
        Voltar ao início
      </Link>
    </div>
  );
}
