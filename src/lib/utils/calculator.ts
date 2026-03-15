import type { DealAnalysisFormData } from "@/types";

export interface DealCalculationResult {
  totalRepairs: number;
  holdingCosts: number;
  closingCosts: number;
  totalCosts: number;
  mao: number;
  profitIfFlip: number;
  seventyPercentRule: number;
}

export function calculateDeal(
  data: DealAnalysisFormData
): DealCalculationResult {
  const totalRepairs =
    (data.repair_roof ?? 0) +
    (data.repair_hvac ?? 0) +
    (data.repair_plumbing ?? 0) +
    (data.repair_electrical ?? 0) +
    (data.repair_kitchen ?? 0) +
    (data.repair_bath ?? 0) +
    (data.repair_flooring ?? 0) +
    (data.repair_paint ?? 0) +
    (data.repair_other ?? 0);

  const wholesaleFee = data.wholesale_fee ?? 10000;
  const closingCostsPct = data.closing_costs_pct ?? 3;
  const holdingMonths = data.holding_months ?? 6;
  const holdingCostMo = data.holding_cost_mo ?? 1500;

  const holdingCosts = holdingMonths * holdingCostMo;
  const closingCosts = data.arv * (closingCostsPct / 100);
  const seventyPercentRule = data.arv * 0.7;

  const totalCosts = totalRepairs + wholesaleFee + holdingCosts + closingCosts;
  const mao = seventyPercentRule - totalRepairs - wholesaleFee - holdingCosts - closingCosts;
  const profitIfFlip = data.arv - totalRepairs - holdingCosts - closingCosts;

  return {
    totalRepairs: Math.round(totalRepairs * 100) / 100,
    holdingCosts: Math.round(holdingCosts * 100) / 100,
    closingCosts: Math.round(closingCosts * 100) / 100,
    totalCosts: Math.round(totalCosts * 100) / 100,
    mao: Math.round(Math.max(0, mao) * 100) / 100,
    profitIfFlip: Math.round(profitIfFlip * 100) / 100,
    seventyPercentRule: Math.round(seventyPercentRule * 100) / 100,
  };
}
