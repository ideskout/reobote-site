"use client";

import AnimatedList from "@/components/AnimatedList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SpecialtyList({
  items,
}: {
  items: { title: string; text: string }[];
}) {
  return (
    <AnimatedList className="md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title} className="h-full">
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </CardContent>
        </Card>
      ))}
    </AnimatedList>
  );
}
