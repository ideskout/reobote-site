"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function PropertyShare({ title, city }: { title: string; city: string }) {
  const [copied, setCopied] = useState(false);
  const [whatsapp, setWhatsapp] = useState<string | null>(null);

  useEffect(() => {
    setWhatsapp(
      buildWhatsAppUrl(`Olá, Reobote. Vi o imóvel "${title}" em ${city}: ${window.location.href}`),
    );
  }, [title, city]);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <TooltipProvider>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline">
                <Share2 />
                Compartilhar
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Copiar link ou enviar no WhatsApp</TooltipContent>
        </Tooltip>
        <PopoverContent className="flex flex-col gap-2">
          <Button type="button" variant="outline" onClick={() => void copyLink()}>
            {copied ? <Check /> : <Link2 />}
            {copied ? "Link copiado" : "Copiar link"}
          </Button>
          {whatsapp ? (
            <Button asChild variant="outline">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          ) : null}
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
