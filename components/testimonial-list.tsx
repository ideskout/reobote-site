"use client";

import AnimatedList from "@/components/AnimatedList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TestimonialList({
  items,
}: {
  items: { nome: string; texto: string; local: string }[];
}) {
  return (
    <AnimatedList className="md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.nome}>
          <CardHeader>
            <CardTitle className="text-lg">{item.nome}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm leading-relaxed text-muted-foreground">{item.texto}</p>
            <p className="text-sm font-medium">{item.local}</p>
          </CardContent>
        </Card>
      ))}
    </AnimatedList>
  );
}
