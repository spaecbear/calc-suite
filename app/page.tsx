"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AdBanner } from "@/components/AdBanner";
import { ProGate } from "@/components/ProGate";
import { type CalcId, PRO_IDS } from "@/lib/navItems";
import { isProUser, initPurchases } from "@/lib/purchases";
import { initAds, showBanner, hideBanner } from "@/lib/ads";

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

  useEffect(() => {
    let cancelled = false;
    isProUser()
      .then((pro) => { if (!cancelled) setIsPro(pro); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    initPurchases(); // configure RevenueCat before any purchase calls
    initAds().then(() => { isPro ? hideBanner() : showBanner(); });
  }, [isPro]);

  const isProCalc = PRO_IDS.includes(active);
  const locked    = isProCalc && !isPro;
  // These calcs fill the full screen with no padding (keyboard-style layout)
  const isFullscreen = (active === "basic" || active === "scientific") && !locked;

  function handleUnlock() { setIsPro(true); hideBanner(); }

  function renderCalc() {
    if (locked) return <ProGate onUnlock={handleUnlock} />;
    return FREE_CALCS[active] ?? PRO_CALCS[active] ?? null;
  }

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "var(--background)" }}>
      <Header active={active} onChange={setActive} isPro={isPro} />

      {isFullscreen ? (
        // Full-screen keyboard layout — no padding, fills remaining height
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderCalc()}
        </div>
      ) : (
        // All other calculators: padded, scrollable
        <main className="flex-1 overflow-y-auto px-4 py-5">
          <div className="max-w-lg mx-auto">
            {renderCalc()}
          </div>
          {!isPro && (
            <div className="max-w-lg mx-auto mt-4">
              <AdBanner />
            </div>
          )}
        </main>
      )}
    </div>
  );
}
