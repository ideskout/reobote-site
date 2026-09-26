"use client";

import { useMemo, useState } from "react";
import { formatPreco } from "@/lib/format";
import { buttonPrimary, fieldClass, labelClass } from "@/lib/styles";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Taxa efetiva anual de referência. Altere este número para recalcular a simulação. */
const ANNUAL_INTEREST_RATE = 0.1;

const PRAZOS = [5, 10, 15, 20, 30] as const;

type Sistema = "price" | "sac";

type FinancingSimulatorProps = {
  preco: number;
  titulo: string;
};

function taxaMensal() {
  return Math.pow(1 + ANNUAL_INTEREST_RATE, 1 / 12) - 1;
}

function parcelaPrice(principal: number, years: number) {
  const months = years * 12;
  if (principal <= 0 || months <= 0) return 0;

  const monthlyRate = taxaMensal();
  const growth = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * growth) / (growth - 1);
}

function resumoSac(principal: number, years: number) {
  const months = years * 12;
  if (principal <= 0 || months <= 0) {
    return { primeira: 0, ultima: 0, media: 0 };
  }

  const monthlyRate = taxaMensal();
  const amortizacao = principal / months;
  const primeira = amortizacao + principal * monthlyRate;
  const ultima = amortizacao * (1 + monthlyRate);
  const media = (primeira + ultima) / 2;

  return { primeira, ultima, media };
}

export function FinancingSimulator({ preco, titulo }: FinancingSimulatorProps) {
  const precoSeguro = Number.isFinite(preco) && preco > 0 ? preco : 0;
  const [entrada, setEntrada] = useState(() => Math.round(precoSeguro * 0.2));
  const [anos, setAnos] = useState<(typeof PRAZOS)[number]>(20);
  const [sistema, setSistema] = useState<Sistema>("price");

  const entradaLimitada = Math.min(Math.max(entrada, 0), precoSeguro);
  const financiado = precoSeguro - entradaLimitada;

  const simulacao = useMemo(() => {
    if (sistema === "price") {
      const parcela = parcelaPrice(financiado, anos);
      return { sistema, parcela, primeira: parcela, ultima: parcela, media: parcela };
    }

    return { sistema, parcela: 0, ...resumoSac(financiado, anos) };
  }, [sistema, financiado, anos]);

  const taxaLabel = `${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(ANNUAL_INTEREST_RATE * 100)}% ao ano`;

  const whatsapp = buildWhatsAppUrl(
    sistema === "price"
      ? `Olá, Reobote. Quero falar com um especialista sobre o financiamento de "${titulo}". A simulação no sistema Price estimou uma parcela fixa de ${formatPreco(simulacao.parcela)} por mês.`
      : `Olá, Reobote. Quero falar com um especialista sobre o financiamento de "${titulo}". A simulação no sistema SAC estimou a primeira parcela em ${formatPreco(simulacao.primeira)}, a última em ${formatPreco(simulacao.ultima)} e a média em ${formatPreco(simulacao.media)} por mês.`,
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
        Estimativa com taxa de referência de {taxaLabel}. O preço considerado é{" "}
        {formatPreco(precoSeguro)}.
      </p>

      <div
        className="mt-6 inline-flex border border-white/10"
        role="tablist"
        aria-label="Sistema de amortização"
      >
        {(
          [
            ["price", "Price"],
            ["sac", "SAC"],
          ] as const
        ).map(([valor, rotulo]) => {
          const ativo = sistema === valor;
          return (
            <button
              key={valor}
              type="button"
              role="tab"
              aria-selected={ativo}
              onClick={() => setSistema(valor)}
              className={`px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                ativo
                  ? "bg-gold-500 text-navy-950"
                  : "text-gold-300 hover:bg-white/5"
              }`}
            >
              {rotulo}
            </button>
          );
        })}
      </div>

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
        {sistema === "price" ? (
          <>
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold-300">
              Parcela mensal estimada
            </p>
            <p className="mt-2 font-serif text-5xl text-gold-300">
              {formatPreco(simulacao.parcela)}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
              Sistema Price: a parcela permanece a mesma durante todo o prazo.
            </p>
          </>
        ) : (
          <>
            <p className="max-w-xl text-sm leading-relaxed text-mist">
              Sistema SAC: a amortização é constante e os juros incidem sobre o
              saldo devedor. A parcela começa mais alta e diminui mês a mês.
            </p>
            <dl className="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.18em] text-gold-300">
                  Primeira parcela
                </dt>
                <dd className="mt-2 font-serif text-4xl text-gold-300">
                  {formatPreco(simulacao.primeira)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.18em] text-gold-300">
                  Última parcela
                </dt>
                <dd className="mt-2 font-serif text-4xl text-ivory">
                  {formatPreco(simulacao.ultima)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.18em] text-gold-300">
                  Parcela média
                </dt>
                <dd className="mt-2 font-serif text-4xl text-ivory">
                  {formatPreco(simulacao.media)}
                </dd>
              </div>
            </dl>
          </>
        )}
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
