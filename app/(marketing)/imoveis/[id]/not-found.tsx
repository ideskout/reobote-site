import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ImovelNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">Imóvel</p>
      <h1 className="text-4xl font-semibold tracking-tight">Esse imóvel não está no portfólio.</h1>
      <Button asChild>
        <Link href="/imoveis">Ver imóveis</Link>
      </Button>
    </div>
  );
}
