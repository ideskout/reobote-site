"use client";

import AnimatedList from "@/components/AnimatedList";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { empresa } from "@/lib/site";

export function SobreStory() {
  return (
    <AnimatedList className="sm:grid-cols-2">
      {empresa.diferenciais.map((item) => (
        <Card key={item} className="h-full">
          <CardHeader>
            <CardTitle className="text-base font-medium">{item}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </AnimatedList>
  );
}
