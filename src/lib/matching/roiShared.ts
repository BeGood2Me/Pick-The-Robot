import type { AcquisitionModel, MoneyRange, RoiViability } from './types';

export function roundMoney(n: number): number {
  return Math.round(n);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUsdRange(range: MoneyRange): string {
  if (range.low === range.high) return formatUsd(range.low);
  return `${formatUsd(range.low)} to ${formatUsd(range.high)}`;
}

export function formatMonthRange(range: MoneyRange): string {
  if (range.high > 60) {
    return range.low > 60 ? 'longer than 5 years' : `${range.low} months to longer than 5 years`;
  }
  if (range.low === range.high) return `${range.low} months`;
  return `${range.low} to ${range.high} months`;
}

export function monthlyRobotCostFromBands(
  robots: number,
  band: { buyUnit: MoneyRange; raasMonthly: MoneyRange; leaseMonthly: MoneyRange },
  acquisition: AcquisitionModel,
  buyAmortizationMonths = 60,
  annualServiceRate = 0.12,
): MoneyRange {
  if (robots <= 0) return { low: 0, high: 0 };
  if (acquisition === 'raas') {
    return {
      low: roundMoney(robots * band.raasMonthly.low),
      high: roundMoney(robots * band.raasMonthly.high),
    };
  }
  if (acquisition === 'lease') {
    return {
      low: roundMoney(robots * band.leaseMonthly.low),
      high: roundMoney(robots * band.leaseMonthly.high),
    };
  }
  const serviceMonthly = annualServiceRate / 12;
  return {
    low: roundMoney(robots * (band.buyUnit.low / buyAmortizationMonths + band.buyUnit.low * serviceMonthly)),
    high: roundMoney(
      robots * (band.buyUnit.high / buyAmortizationMonths + band.buyUnit.high * serviceMonthly),
    ),
  };
}

export function paybackForBuy(
  robots: number,
  buyUnit: MoneyRange,
  monthlyLaborSavings: number,
): MoneyRange | null {
  if (robots <= 0 || monthlyLaborSavings <= 0) return null;
  const low = Math.ceil((robots * buyUnit.low) / monthlyLaborSavings);
  const high = Math.ceil((robots * buyUnit.high) / monthlyLaborSavings);
  return { low, high };
}

export function viabilityFromNet(input: {
  monthlyNet: MoneyRange;
  paybackMonths: MoneyRange | null;
  acquisition: AcquisitionModel;
  weakCase: boolean;
}): RoiViability {
  if (input.weakCase) return 'weak';
  if (input.monthlyNet.high <= 0) return 'weak';
  if (input.monthlyNet.low > 0) {
    if (input.acquisition === 'buy') {
      return input.paybackMonths && input.paybackMonths.high <= 36 ? 'strong' : 'moderate';
    }
    return 'strong';
  }
  return 'moderate';
}
