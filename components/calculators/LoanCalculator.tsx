"use client";

import { useState } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";

const TERM_OPTS = [
  { value: "12", label: "1 year" },
  { value: "24", label: "2 years" },
  { value: "36", label: "3 years" },
  { value: "48", label: "4 years" },
  { value: "60", label: "5 years" },
  { value: "72", label: "6 years" },
  { value: "84", label: "7 years" },
  { value: "120", label: "10 years" },
  { value: "180", label: "15 years" },
  { value: "240", label: "20 years" },
  { value: "360", label: "30 years" },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("6.5");
  const [termMonths, setTermMonths] = useState("60");

  const P = parseFloat(principal) || 0;
  const annualRate = parseFloat(rate) || 0;
  const n = parseInt(termMonths) || 1;
  const r = annualRate / 100 / 12;

  let monthly = 0;
  if (r === 0) {
    monthly = P / n;
  } else {
    monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalPaid = monthly * n;
  const totalInterest = totalPaid - P;
  const interestPct = P > 0 ? (totalInterest / P) * 100 : 0;

  const barFill = Math.min(100, Math.max(0, interestPct));

  return (
    <Card>
      <CardTitle>Loan Calculator</CardTitle>
      <div className="flex flex-col gap-4">
        <Input
          label="Loan Amount"
          type="number"
          value={principal}
          unit="$"
          placeholder="10000"
          min="0"
          onChange={(e) => setPrincipal(e.target.value)}
        />
        <Input
          label="Annual Interest Rate"
          type="number"
          value={rate}
          unit="%"
          placeholder="6.5"
          min="0"
          max="100"
          step="0.1"
          onChange={(e) => setRate(e.target.value)}
        />
        <Select
          label="Loan Term"
          options={TERM_OPTS}
          value={termMonths}
          onChange={(e) => setTermMonths(e.target.value)}
        />

        <ResultBox>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs opacity-70">Monthly Payment</p>
              <p className="text-2xl font-bold">{fmt(monthly)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Total Paid</p>
              <p className="text-xl font-bold">{fmt(totalPaid)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Principal</p>
              <p className="text-xl font-bold">{fmt(P)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Total Interest</p>
              <p className="text-xl font-bold">{fmt(totalInterest)}</p>
            </div>
          </div>

          {/* Principal vs interest bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1 opacity-70">
              <span>Principal {(100 - barFill).toFixed(0)}%</span>
              <span>Interest {barFill.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--result-border)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${100 - barFill}%`, background: "var(--accent)" }}
              />
            </div>
          </div>
        </ResultBox>
      </div>
    </Card>
  );
}
