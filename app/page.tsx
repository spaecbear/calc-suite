"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { AdBanner } from "@/components/AdBanner";
import { type CalcId } from "@/lib/navItems";

import BasicCalculator from "@/components/calculators/BasicCalculator";
import UnitConverter from "@/components/calculators/UnitConverter";
import TipCalculator from "@/components/calculators/TipCalculator";
import LoanCalculator from "@/components/calculators/LoanCalculator";
import DateCalculator from "@/components/calculators/DateCalculator";
import DiscountCalculator from "@/components/calculators/DiscountCalculator";
import FuelCostCalculator from "@/components/calculators/FuelCostCalculator";
import SplitBillCalculator from "@/components/calculators/SplitBillCalculator";

const CALC_MAP: Record<CalcId, React.ReactNode> = {
  basic: <BasicCalculator />,
  unit: <UnitConverter />,
  tip: <TipCalculator />,
  loan: <LoanCalculator />,
  date: <DateCalculator />,
  discount: <DiscountCalculator />,
  fuel: <FuelCostCalculator />,
  split: <SplitBillCalculator />,
};

export default function Home() {
  const [active, setActive] = useState<CalcId>("basic");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <Header active={active} onChange={setActive} />

      <main className="flex-1 px-4 py-5 overflow-y-auto">
        {/* Top ad */}
        <div className="max-w-lg mx-auto mb-4">
          <AdBanner position="top" />
        </div>

        {/* Calculator */}
        <div className="max-w-lg mx-auto">
          {CALC_MAP[active]}
        </div>

        {/* Bottom ad */}
        <div className="max-w-lg mx-auto mt-4">
          <AdBanner position="bottom" />
        </div>
      </main>
    </div>
  );
}
