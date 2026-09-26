"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ImoveisIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#imoveis");
  }, [router]);

  return (
    <p className="px-6 py-24 text-center text-sm text-mist">Abrindo o portfólio...</p>
  );
}
