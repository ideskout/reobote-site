import assert from "node:assert/strict";
import test from "node:test";
import { parcelaPrice, resumoSac, taxaMensal } from "./finance";

test("taxa mensal equivale à taxa efetiva anual", () => {
  const monthly = taxaMensal(0.1);
  const recomposed = Math.pow(1 + monthly, 12) - 1;
  assert.ok(Math.abs(recomposed - 0.1) < 1e-10);
});

test("PRICE mantém a parcela constante e quita o saldo", () => {
  const principal = 120_000;
  const years = 2;
  const parcela = parcelaPrice(principal, years, 0.1);
  const monthly = taxaMensal(0.1);
  let saldo = principal;

  for (let month = 0; month < years * 12; month += 1) {
    const juros = saldo * monthly;
    const amortizacao = parcela - juros;
    saldo -= amortizacao;
  }

  assert.ok(parcela > 0);
  assert.ok(Math.abs(saldo) < 0.05);
});

test("SAC começa mais alto que termina e a média é o ponto médio", () => {
  const resumo = resumoSac(120_000, 2, 0.1);
  assert.ok(resumo.primeira > resumo.ultima);
  assert.equal(resumo.media, (resumo.primeira + resumo.ultima) / 2);

  const months = 24;
  const amortizacao = 120_000 / months;
  const monthly = taxaMensal(0.1);
  assert.ok(Math.abs(resumo.primeira - (amortizacao + 120_000 * monthly)) < 1e-8);
  assert.ok(Math.abs(resumo.ultima - (amortizacao + amortizacao * monthly)) < 1e-8);
});

test("principal ou prazo inválidos retornam zero", () => {
  assert.equal(parcelaPrice(0, 20), 0);
  assert.equal(parcelaPrice(1000, 0), 0);
  assert.deepEqual(resumoSac(-1, 10), { primeira: 0, ultima: 0, media: 0 });
});
