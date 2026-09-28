"use client";

import { useMemo, useState } from "react";
import { ANNUAL_INTEREST_RATE, parcelaPrice, resumoSac } from "@/lib/finance";
import { formatPreco } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PRAZOS = [5, 10, 15, 20, 30] as const;

export function FinancingSimulator({ preco, titulo }: { preco: number; titulo: string }) {
  const precoSeguro = Number.isFinite(preco) && preco > 0 ? preco : 0;
  const [entrada, setEntrada] = useState(() => Math.round(precoSeguro * 0.2));
  const [anos, setAnos] = useState<(typeof PRAZOS)[number]>(20);
  const [sistema, setSistema] = useState("price");

  const entradaLimitada = Math.min(Math.max(entrada, 0), precoSeguro);
  const financiado = precoSeguro - entradaLimitada;
  const taxaLabel = `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(ANNUAL_INTEREST_RATE * 100)}% ao ano, efetiva`;

  const simulacao = useMemo(() => {
    if (sistema === "price") {
      const parcela = parcelaPrice(financiado, anos);
      return { parcela, primeira: parcela, ultima: parcela, media: parcela };
    }
    return { parcela: 0, ...resumoSac(financiado, anos) };
  }, [sistema, financiado, anos]);

  const whatsapp = buildWhatsAppUrl(
    sistema === "price"
      ? `Olá, Reobote. Quero falar sobre o financiamento de "${titulo}". A simulação Price estimou ${formatPreco(simulacao.parcela)} por mês.`
      : `Olá, Reobote. Quero falar sobre o financiamento de "${titulo}". A simulação SAC estimou a primeira parcela em ${formatPreco(simulacao.primeira)} e a última em ${formatPreco(simulacao.ultima)}.`,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simule a parcela</CardTitle>
        <CardDescription>
          Estimativa com {taxaLabel}. A taxa mensal é a equivalente da taxa anual, não a taxa dividida por 12. O preço considerado é {formatPreco(precoSeguro)}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Tabs value={sistema} onValueChange={setSistema}>
          <TabsList>
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="sac">SAC</TabsTrigger>
          </TabsList>
          <TabsContent value="price" className="text-sm text-muted-foreground">
            A parcela permanece a mesma durante todo o prazo.
          </TabsContent>
          <TabsContent value="sac" className="text-sm text-muted-foreground">
            A amortização é constante. A parcela começa mais alta e diminui mês a mês.
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="entrada">Valor de entrada</FieldLabel>
            <Input
              id="entrada"
              type="number"
              min={0}
              max={precoSeguro}
              step={1000}
              value={entradaLimitada}
              onChange={(event) => setEntrada(Number(event.target.value))}
            />
            <Slider
              className="mt-4"
              min={0}
              max={precoSeguro}
              step={precoSeguro > 10000 ? 1000 : 100}
              value={[entradaLimitada]}
              onValueChange={([value]) => setEntrada(value ?? 0)}
              aria-label="Ajustar valor de entrada"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="prazo">Prazo em anos</FieldLabel>
            <select
              id="prazo"
              value={anos}
              onChange={(event) => setAnos(Number(event.target.value) as (typeof PRAZOS)[number])}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {PRAZOS.map((prazo) => (
                <option key={prazo} value={prazo}>
                  {prazo} anos
                </option>
              ))}
            </select>
          </Field>
        </div>

        {sistema === "price" ? (
          <div>
            <p className="text-sm text-muted-foreground">Parcela mensal estimada</p>
            <p className="text-4xl font-semibold">{formatPreco(simulacao.parcela)}</p>
          </div>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-muted-foreground">Primeira parcela</dt>
              <dd className="text-2xl font-semibold">{formatPreco(simulacao.primeira)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Última parcela</dt>
              <dd className="text-2xl font-semibold">{formatPreco(simulacao.ultima)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Parcela média</dt>
              <dd className="text-2xl font-semibold">{formatPreco(simulacao.media)}</dd>
            </div>
          </dl>
        )}

        <p className="text-sm text-muted-foreground">
          Valor financiado: {formatPreco(financiado)} · {anos} anos. Simulação estimada. Consulte um banco para as condições reais.
        </p>
        {whatsapp ? (
          <Button asChild className="w-fit">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer">
              Falar com um especialista
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
