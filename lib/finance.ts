/** Taxa efetiva anual de referência. A parcela usa a taxa mensal equivalente, não a nominal dividida por 12. */
export const ANNUAL_INTEREST_RATE = 0.1;

export function taxaMensal(annual = ANNUAL_INTEREST_RATE) {
  return Math.pow(1 + annual, 1 / 12) - 1;
}

export function parcelaPrice(principal: number, years: number, annual = ANNUAL_INTEREST_RATE) {
  const months = years * 12;
  if (principal <= 0 || months <= 0) return 0;

  const monthlyRate = taxaMensal(annual);
  const growth = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * growth) / (growth - 1);
}

export function resumoSac(principal: number, years: number, annual = ANNUAL_INTEREST_RATE) {
  const months = years * 12;
  if (principal <= 0 || months <= 0) {
    return { primeira: 0, ultima: 0, media: 0 };
  }

  const monthlyRate = taxaMensal(annual);
  const amortizacao = principal / months;
  const primeira = amortizacao + principal * monthlyRate;
  const saldoFinal = amortizacao;
  const ultima = amortizacao + saldoFinal * monthlyRate;
  const media = (primeira + ultima) / 2;

  return { primeira, ultima, media };
}
