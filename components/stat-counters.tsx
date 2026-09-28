"use client";

import CountUp from "@/components/CountUp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { empresa } from "@/lib/site";

export function StatCounters({
  imoveis,
  cidades,
}: {
  imoveis: number;
  cidades: number;
}) {
  const stats = [
    { key: "desde", label: "No mercado desde", value: empresa.desde, from: 2000 },
    { key: "imoveis", label: "Imóveis publicados", value: imoveis, from: 0 },
    { key: "cidades", label: "Cidades no catálogo", value: cidades, from: 0 },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.key}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              <CountUp to={stat.value} from={stat.from} duration={1.2} />
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
