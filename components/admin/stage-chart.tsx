"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ESTAGIO_LABEL, type Estagio } from "@/types/crm";

const chartConfig = {
  total: { label: "Leads", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

export function StageChart({ data }: { data: { estagio: Estagio; total: number }[] }) {
  const rows = data.map((item) => ({ estagio: ESTAGIO_LABEL[item.estagio], total: item.total }));

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <BarChart data={rows}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="estagio" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
