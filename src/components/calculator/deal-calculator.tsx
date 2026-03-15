"use client";

import { useState } from "react";
import { calculateDeal } from "@/lib/utils/calculator";
import type { DealAnalysisFormData } from "@/types";

const defaultValues: DealAnalysisFormData = {
  arv: 0,
  repair_roof: 0,
  repair_hvac: 0,
  repair_plumbing: 0,
  repair_electrical: 0,
  repair_kitchen: 0,
  repair_bath: 0,
  repair_flooring: 0,
  repair_paint: 0,
  repair_other: 0,
  wholesale_fee: 10000,
  closing_costs_pct: 3,
  holding_months: 6,
  holding_cost_mo: 1500,
};

const repairCategories = [
  { key: "repair_roof" as const, label: "Roof" },
  { key: "repair_hvac" as const, label: "HVAC" },
  { key: "repair_plumbing" as const, label: "Plumbing" },
  { key: "repair_electrical" as const, label: "Electrical" },
  { key: "repair_kitchen" as const, label: "Kitchen" },
  { key: "repair_bath" as const, label: "Bathrooms" },
  { key: "repair_flooring" as const, label: "Flooring" },
  { key: "repair_paint" as const, label: "Paint/Drywall" },
  { key: "repair_other" as const, label: "Other" },
];

export function DealCalculator() {
  const [values, setValues] = useState<DealAnalysisFormData>(defaultValues);
  const result = calculateDeal(values);

  function updateField(field: keyof DealAnalysisFormData, value: string) {
    setValues((prev) => ({
      ...prev,
      [field]: value === "" ? 0 : parseFloat(value) || 0,
    }));
  }

  const maoColor =
    result.mao > 0 ? "text-success" : "text-danger";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Input side */}
      <div className="space-y-5">
        {/* ARV */}
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
            After Repair Value (ARV)
          </h2>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">
              $
            </span>
            <input
              type="number"
              value={values.arv || ""}
              onChange={(e) => updateField("arv", e.target.value)}
              placeholder="200000"
              className="w-full rounded-lg border border-border bg-bg-elevated py-3 pl-8 pr-3 font-mono text-lg text-text outline-none focus:border-accent"
            />
          </div>
          <p className="mt-2 text-xs text-text-muted">
            70% Rule: {" "}
            <span className="font-mono text-accent">
              ${result.seventyPercentRule.toLocaleString()}
            </span>
          </p>
        </div>

        {/* Repair Breakdown */}
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
            Repair Breakdown
          </h2>
          <div className="space-y-2">
            {repairCategories.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <label className="w-28 text-xs text-text-muted">{label}</label>
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                    $
                  </span>
                  <input
                    type="number"
                    value={values[key] || ""}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-border bg-bg-elevated py-1.5 pl-6 pr-2 font-mono text-sm text-text outline-none focus:border-accent"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-border pt-3">
            <span className="text-xs font-medium text-text-muted">
              Total Repairs
            </span>
            <span className="font-mono text-sm text-secondary">
              ${result.totalRepairs.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Costs */}
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
            Costs & Fees
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="w-36 text-xs text-text-muted">
                Wholesale Fee
              </label>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                  $
                </span>
                <input
                  type="number"
                  value={values.wholesale_fee || ""}
                  onChange={(e) => updateField("wholesale_fee", e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg-elevated py-1.5 pl-6 pr-2 font-mono text-sm text-text outline-none focus:border-accent"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="w-36 text-xs text-text-muted">
                Closing Costs %
              </label>
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.5"
                  value={values.closing_costs_pct || ""}
                  onChange={(e) =>
                    updateField("closing_costs_pct", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-bg-elevated py-1.5 px-3 font-mono text-sm text-text outline-none focus:border-accent"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                  %
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="w-36 text-xs text-text-muted">
                Holding Months
              </label>
              <input
                type="number"
                value={values.holding_months || ""}
                onChange={(e) => updateField("holding_months", e.target.value)}
                className="w-full flex-1 rounded-lg border border-border bg-bg-elevated py-1.5 px-3 font-mono text-sm text-text outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="w-36 text-xs text-text-muted">
                Monthly Hold Cost
              </label>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                  $
                </span>
                <input
                  type="number"
                  value={values.holding_cost_mo || ""}
                  onChange={(e) =>
                    updateField("holding_cost_mo", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-bg-elevated py-1.5 pl-6 pr-2 font-mono text-sm text-text outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results side */}
      <div className="space-y-5">
        {/* MAO - The Big Number */}
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
            Maximum Allowable Offer
          </p>
          <p className={`mt-2 font-mono text-5xl font-bold ${maoColor}`}>
            ${result.mao.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-text-muted">
            ARV × 70% − Repairs − Fee − Holding − Closing
          </p>
        </div>

        {/* Cost Breakdown */}
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
            Cost Breakdown
          </h2>
          <div className="space-y-3 text-sm">
            <BreakdownRow
              label="70% of ARV"
              value={result.seventyPercentRule}
              color="text-accent"
            />
            <BreakdownRow
              label="Total Repairs"
              value={result.totalRepairs}
              negative
            />
            <BreakdownRow
              label="Wholesale Fee"
              value={values.wholesale_fee ?? 0}
              negative
            />
            <BreakdownRow
              label="Holding Costs"
              value={result.holdingCosts}
              negative
            />
            <BreakdownRow
              label="Closing Costs"
              value={result.closingCosts}
              negative
            />
            <div className="border-t border-border pt-3">
              <BreakdownRow
                label="= MAO"
                value={result.mao}
                color={maoColor}
                bold
              />
            </div>
          </div>
        </div>

        {/* Flip Analysis */}
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
            If You Flip (Buy at MAO)
          </h2>
          <div className="space-y-3 text-sm">
            <BreakdownRow
              label="Sell at ARV"
              value={values.arv}
              color="text-accent"
            />
            <BreakdownRow
              label="Buy at MAO"
              value={result.mao}
              negative
            />
            <BreakdownRow
              label="Repairs"
              value={result.totalRepairs}
              negative
            />
            <BreakdownRow
              label="Holding"
              value={result.holdingCosts}
              negative
            />
            <BreakdownRow
              label="Closing"
              value={result.closingCosts}
              negative
            />
            <div className="border-t border-border pt-3">
              <BreakdownRow
                label="= Flip Profit"
                value={result.profitIfFlip}
                color={result.profitIfFlip > 0 ? "text-success" : "text-danger"}
                bold
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  negative,
  color,
  bold,
}: {
  label: string;
  value: number;
  negative?: boolean;
  color?: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className={`${bold ? "font-medium text-text" : "text-text-muted"}`}>
        {negative && "−"} {label}
      </span>
      <span
        className={`font-mono ${color ?? "text-text"} ${bold ? "font-bold" : ""}`}
      >
        ${Math.abs(value).toLocaleString()}
      </span>
    </div>
  );
}
