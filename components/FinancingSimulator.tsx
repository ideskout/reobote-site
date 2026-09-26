"use client";

import { useMemo, useState } from "react";
import { formatPreco } from "@/lib/format";
import { buttonPrimary, fieldClass, labelClass } from "@/lib/styles";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Taxa efetiva anual de referência. Altere este número para recalcular a simulação. */
const ANNUAL_INTEREST_RATE = 0.1;

const PRAZOS = [5, 10, 15, 20, 30] as const;

type FinancingSimulatorProps = {
  preco: number;
  titulo: string;
};

function parcelaPrice(principal: number, years: number) {
  const months = years * 12;
  if (principal <= 0 || months <= 0) return 0;

  const monthlyRate = Math.pow(1 + ANNUAL_INTEREST_RATE, 1 / 12) - 1;
  const growth = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * growth) / (growth - 1);
}

export function FinancingSimulator({ preco, titulo }: FinancingSimulatorProps) {
  const precoSeguro = Number.isFinite(preco) && preco > 0 ? preco : 0;
  const [entrada, setEntrada] = useState(() => Math.round(precoSeguro * 0.2));
  const [anos, setAnos] = useState<(typeof PRAZOS)[number]>(20);

  const entradaLimitada = Math.min(Math.max(entrada, 0), precoSeguro);
  const financiado = precoSeguro - entradaLimitada;
  const parcela = useMemo(
    () => parcelaPrice(financiado, anos),
    [financiado, anos],
  );

  const taxaLabel = `${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(ANNUAL_INTEREST_RATE * 100)}% ao ano`;

  const whatsapp = buildWhatsAppUrl(
    `Olá, Reobote. Quero falar com um especialista sobre o financiamento de "${titulo}". A simulação estimou uma parcela de ${formatPreco(parcela)} por mês.`,
  );

  function atualizarEntrada(valor: number) {
    if (!Number.isFinite(valor)) {
      setEntrada(0);
      return;
    }
    setEntrada(Math.min(Math.max(valor, 0), precoSeguro));
  }

  return (
    <section className="mt-12 border border-white/10 bg-navy-900/70 p-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold-500">
        Financiamento
      </p>
      <h2 className="mt-3 font-serif text-4xl text-ivory">Simule a parcela</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
        Estimativa com taxa de referência de {taxaLabel}, no sistema Price
        (parcela fixa). O preço considerado é {formatPreco(precoSeguro)}.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="entrada" className={labelClass}>
            Valor de entrada
          </label>
          <input
            id="entrada"
            type="number"
            min={0}
            max={precoSeguro}
            step="1000"
            value={entradaLimitada}
            onChange={(event) => atualizarEntrada(Number(event.target.value))}
            className={fieldClass}
          />
          <input
            type="range"
            min={0}
            max={precoSeguro}
            step={precoSeguro > 10000 ? 1000 : 100}
            value={entradaLimitada}
            onChange={(event) => atualizarEntrada(Number(event.target.value))}
            aria-label="Ajustar valor de entrada"
            className="mt-4 w-full accent-gold-500"
          />
          <p className="mt-2 text-sm text-ivory">{formatPreco(entradaLimitada)}</p>
        </div>

        <div>
          <label htmlFor="prazo" className={labelClass}>
            Prazo em anos
          </label>
          <select
            id="prazo"
            value={anos}
            onChange={(event) =>
              setAnos(Number(event.target.value) as (typeof PRAZOS)[number])
            }
            className={fieldClass}
          >
            {PRAZOS.map((prazo) => (
              <option key={prazo} value={prazo}>
                {prazo} anos
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gold-300">
          Parcela mensal estimada
        </p>
        <p className="mt-2 font-serif text-5xl text-gold-300">
          {formatPreco(parcela)}
        </p>
        <p className="mt-3 text-sm text-mist">
          Valor financiado: {formatPreco(financiado)} · {anos} anos · {taxaLabel}
        </p>
        <p className="mt-5 text-base leading-relaxed text-ivory">
          Simulação estimada. Consulte um banco parceiro para condições reais.
        </p>
      </div>

      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonPrimary} mt-6`}
        >
          Falar com um especialista
        </a>
      ) : (
        <p className="mt-6 text-sm text-mist">
          Defina NEXT_PUBLIC_WHATSAPP_PHONE para ativar o contato com um especialista.
        </p>
      )}
    </section>
  );
}
