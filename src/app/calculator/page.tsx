import { DealCalculator } from "@/components/calculator/deal-calculator";

export default function CalculatorPage() {
  return (
    <div>
      <h1 className="mb-6 font-mono text-2xl font-bold tracking-tight">
        Deal Calculator
      </h1>
      <DealCalculator />
    </div>
  );
}
