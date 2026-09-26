import Link from "next/link";
import { buttonPrimary } from "@/lib/styles";

export default function ImovelNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold-500">Imóvel</p>
      <h1 className="mt-4 font-serif text-5xl text-ivory">Esse imóvel não está no portfólio.</h1>
      <p className="mt-4 text-mist">O anúncio pode ter sido removido ou o endereço está incompleto.</p>
      <Link href="/#imoveis" className={`${buttonPrimary} mt-8`}>
        Ver imóveis
      </Link>
    </div>
  );
}
