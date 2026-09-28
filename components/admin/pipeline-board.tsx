"use client";

import { useEffect, useState, useTransition } from "react";
import { atualizarEstagio } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ESTAGIOS, ESTAGIO_LABEL, type Estagio, type Lead } from "@/types/crm";

export function PipelineBoard({ leads }: { leads: Lead[] }) {
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState<Lead | null>(leads[0] ?? null);

  useEffect(() => {
    setCurrent((previous) => leads.find((lead) => lead.id === previous?.id) ?? leads[0] ?? null);
  }, [leads]);

  function move(id: string, estagio: Estagio) {
    startTransition(async () => {
      await atualizarEstagio(id, estagio);
    });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ESTAGIOS.map((estagio) => (
          <section key={estagio} className="flex flex-col gap-3">
            <h2 className="text-sm font-medium">{ESTAGIO_LABEL[estagio]}</h2>
            {leads.filter((lead) => lead.estagio === estagio).length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Nenhum lead</p>
            ) : (
              leads
                .filter((lead) => lead.estagio === estagio)
                .map((lead) => (
                  <Card key={lead.id}>
                    <CardHeader className="gap-2">
                      <CardTitle className="text-base">{lead.cliente?.nome ?? "Sem nome"}</CardTitle>
                      <p className="text-sm text-muted-foreground">{lead.imovel?.titulo ?? "Sem imóvel"}</p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <Badge variant="secondary">{lead.origem}</Badge>
                      <Select
                        value={lead.estagio}
                        disabled={pending}
                        onValueChange={(value) => move(lead.id, value as Estagio)}
                      >
                        <SelectTrigger aria-label={`Estágio de ${lead.cliente?.nome ?? "lead"}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {ESTAGIOS.map((item) => (
                              <SelectItem key={item} value={item}>
                                {ESTAGIO_LABEL[item]}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <button type="button" className="text-left text-sm text-muted-foreground underline-offset-4 hover:underline" onClick={() => setCurrent(lead)}>
                        Ver histórico
                      </button>
                    </CardContent>
                  </Card>
                ))
            )}
          </section>
        ))}
      </div>
      <aside className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium">Histórico</h2>
        {current ? (
          <ScrollArea className="mt-4 h-64">
            <div className="flex flex-col gap-3 pr-3">
              <p className="font-medium">{current.cliente?.nome}</p>
              {current.eventos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Ainda não há registros.</p>
              ) : (
                current.eventos.map((evento) => (
                  <p key={evento.id} className="text-sm text-muted-foreground">
                    {evento.descricao}
                  </p>
                ))
              )}
            </div>
          </ScrollArea>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Selecione um lead para ver o histórico.</p>
        )}
      </aside>
    </div>
  );
}
