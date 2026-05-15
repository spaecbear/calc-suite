"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar, BottomNav } from "@/components/Nav";
import { AdBanner } from "@/components/AdBanner";
import { type CalcId } from "@/lib/navItems";

import UnitConverter from "@/components/calculators/UnitConverter";
import TipCalculator from "@/components/calculators/TipCalculator";
import LoanCalculator from "@/components/calculators/LoanCalculator";
import DateCalculator from "@/components/calculators/DateCalculator";
import DiscountCalculator from "@/components/calculators/DiscountCalculator";
import FuelCostCalculator from "@/components/calculators/FuelCostCalculator";
import SplitBillCalculator from "@/components/calculators/SplitBillCalculator";

const CALC_MAP: Record<CalcId, React.ReactNode> = {
  unit: <UnitConverter />,
  tip: <TipCalculator />,
  loan: <LoanCalculator />,
  date: <DateCalculator />,
  discount: <DiscountCalculator />,
  fuel: <FuelCostCalculator />,
  split: <SplitBillCalculator />,
};

export default function Home() {
  const [active, setActive] = useState<CalcId>("unit");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--background)" }}
    >
      <Header />

      {/* Top ad banner */}
      <div className="px-4 pt-3 pb-0">
        <AdBanner position="top" />
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={active} onChange={setActive} />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 md:pb-6 md:px-6">
          <div className="max-w-lg mx-auto">
            {CALC_MAP[active]}
          </div>
        </main>

        {/* Side ad (desktop only) */}
        <aside className="hidden lg:flex w-44 shrink-0 p-4">
          <AdBanner position="side" />
        </aside>
      </div>

      {/* Bottom ad */}
      <div className="hidden md:block px-6 pb-4">
        <AdBanner position="bottom" />
      </div>

      {/* Mobile bottom nav */}
      <BottomNav active={active} onChange={setActive} />
    </div>
  );
}
