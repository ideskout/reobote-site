"use client";

import Link from "next/link";
import AnimatedList from "@/components/AnimatedList";
import CountUp from "@/components/CountUp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCards({
  cards,
}: {
  cards: { label: string; value: number; href: string }[];
}) {
  return (
    <AnimatedList className="sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.label} href={card.href} className="block h-full">
          <Card className="h-full transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                <CountUp to={card.value} duration={1.1} />
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </AnimatedList>
  );
}
