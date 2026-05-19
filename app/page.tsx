"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AdBanner } from "@/components/AdBanner";
import { ProGate } from "@/components/ProGate";
import { type CalcId, PRO_IDS } from "@/lib/navItems";
import { isProUser } from "@/lib/purchases";

// Free calculators
import BasicCalculator from "@/components/calculators/BasicCalculator";
import UnitConverter from "@/components/calculators/UnitConverter";
import TipCalculator from "@/components/calculators/TipCalculator";
import LoanCalculator from "@/components/calculators/LoanCalculator";
import DateCalculator from "@/components/calculators/DateCalculator";
import DiscountCalculator from "@/components/calculators/DiscountCalculator";
import FuelCostCalculator from "@/components/calculators/FuelCostCalculator";
import SplitBillCalculator from "@/components/calculators/SplitBillCalculator";

// Pro calculators
import DerivativeCalculator from "@/components/calculators/DerivativeCalculator";
import IntegralCalculator from "@/components/calculators/IntegralCalculator";
import OhmsLawCalculator from "@/components/calculators/OhmsLawCalculator";
import ScientificCalculator from "@/components/calculators/ScientificCalculator";
import BmiCalculator from "@/components/calculators/BmiCalculator";
import CompoundInterestCalculator from "@/components/calculators/CompoundInterestCalculator";

const FREE_CALCS: Record<string, React.ReactNode> = {
  basic:    <BasicCalculator />,
  unit:     <UnitConverter />,
  tip:      <TipCalculator />,
  loan:     <LoanCalculator />,
  date:     <DateCalculator />,
  discount: <DiscountCalculator />,
  fuel:     <FuelCostCalculator />,
  split:    <SplitBillCalculator />,
};

const PRO_CALCS: Record<string, React.ReactNode> = {
  derivative: <DerivativeCalculator />,
  integral:   <IntegralCalculator />,
  ohm:        <OhmsLawCalculator />,
  scientific: <ScientificCalculator />,
  bmi:        <BmiCalculator />,
  compound:   <CompoundInterestCalculator />,
};

export default function Home() {
  const [active, setActive] = useState<CalcId>("basic");
  const [isPro, setIsPro]   = useState(false);

  // Check RevenueCat on mount — renders immediately, upgrades silently
  useEffect(() => {
    let cancelled = false;
    isProUser()
      .then((pro) => { if (!cancelled) setIsPro(pro); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const isProCalc = PRO_IDS.includes(active);
  const locked    = isProCalc && !isPro;

  function renderCalc() {
    if (locked) return <ProGate onUnlock={() => setIsPro(true)} />;
    return FREE_CALCS[active] ?? PRO_CALCS[active] ?? null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <Header active={active} onChange={setActive} isPro={isPro} />

      <main className="flex-1 px-4 py-5 overflow-y-auto">
        {/* Top ad — only for free users */}
        {!isPro && (
          <div className="max-w-lg mx-auto mb-4">
            <AdBanner position="top" />
          </div>
        )}

        {/* Calculator */}
        <div className="max-w-lg mx-auto">
          {renderCalc()}
        </div>

        {/* Bottom ad — only for free users */}
        {!isPro && (
          <div className="max-w-lg mx-auto mt-4">
            <AdBanner position="bottom" />
          </div>
        )}
      </main>
    </div>
  );
}
