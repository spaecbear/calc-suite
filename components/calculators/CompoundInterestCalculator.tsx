"use client";

import { useState } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

const FREQ_OPTIONS = [
  { label: "Annually (1×/yr)",    value: "1"  },
  { label: "Semi-annually (2×)",  value: "2"  },
  { label: "Quarterly (4×)",      value: "4"  },
  { label: "Monthly (12×)",       value: "12" },
  { label: "Daily (365×)",        value: "365" },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

interface YearRow { year: number; balance: number; interest: number; contribution: number }

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal]   = useState("10000");
  const [rate, setRate]             = useState("7");
  const [years, setYears]           = useState("10");
  const [contrib, setContrib]       = useState("100");
  const [freq, setFreq]             = useState("12");
  const [result, setResult] = useState<{ final: number; totalInterest: number; totalContrib: number; rows: YearRow[] } | null>(null);
  const [error, setError]   = useState("");

  function calculate() {
    setError(""); setResult(null);
    const P  = parseFloat(principal);
    const r  = parseFloat(rate) / 100;
    const t  = parseInt(years);
    const c  = parseFloat(contrib) || 0;
    const n  = parseInt(freq);

    if (isNaN(P) || P < 0) { setError("Enter a valid principal"); return; }
    if (isNaN(r) || r < 0) { setError("Enter a valid rate"); return; }
    if (isNaN(t) || t < 1 || t > 100) { setError("Years must be 1–100"); return; }

    const rows: YearRow[] = [];
    let balance = P;
    let totalContrib = 0;

    for (let yr = 1; yr <= t; yr++) {
      const start = balance;
      // Compound principal + contributions each period
      for (let p = 0; p < n; p++) {
        balance = balance * (1 + r / n) + c;
      }
      totalContrib += c * n;
      rows.push({
        year: yr,
        balance,
        interest: balance - start - c * n,
        contribution: c * n,
      });
    }

    const totalInterest = balance - P - totalContrib;
    setResult({ final: balance, totalInterest, totalContrib, rows });
  }

  return (
    <Card>
      <CardTitle>Compound Interest</CardTitle>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Principal ($)" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="10000" />
          <Input label="Annual rate (%)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="7" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Years" type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="10" />
          <Input label="Monthly contrib ($)" type="number" value={contrib} onChange={(e) => setContrib(e.target.value)} placeholder="100" />
        </div>
        <Select
          label="Compounding frequency"
          value={freq}
          onChange={(e) => setFreq(e.target.value)}
          options={FREQ_OPTIONS}
        />

        {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}

        <Button onClick={calculate} className="w-full">Calculate</Button>
      </div>

      {result && (
        <>
          <ResultBox>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Final Balance</p>
                <p className="font-bold text-lg" style={{ color: "var(--accent)" }}>{fmt(result.final)}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Interest Earned</p>
                <p className="font-bold text-lg" style={{ color: "#22c55e" }}>{fmt(result.totalInterest)}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Contributions</p>
                <p className="font-bold text-lg" style={{ color: "var(--result-text)" }}>{fmt(result.totalContrib + parseFloat(principal))}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="h-3 rounded-full overflow-hidden flex" style={{ background: "var(--card-border)" }}>
                {(() => {
                  const principal_pct = (parseFloat(principal) / result.final) * 100;
                  const contrib_pct   = (result.totalContrib / result.final) * 100;
                  const interest_pct  = 100 - principal_pct - contrib_pct;
                  return (
                    <>
                      <div style={{ width: `${principal_pct}%`, background: "var(--accent)" }} />
                      <div style={{ width: `${contrib_pct}%`, background: "#a5b4fc" }} />
                      <div style={{ width: `${interest_pct}%`, background: "#22c55e" }} />
                    </>
                  );
                })()}
              </div>
              <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--muted-foreground)" }}>
                <span>Principal</span><span>Contributions</span><span>Interest</span>
              </div>
            </div>
          </ResultBox>

          {/* Year-by-year table */}
          <div className="mt-4">
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>YEAR-BY-YEAR BREAKDOWN</p>
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--card-border)" }}>
              <div
                className="grid grid-cols-4 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                <span>Year</span><span className="text-right">Balance</span>
                <span className="text-right">Interest</span><span className="text-right">Contrib</span>
              </div>
              <div className="max-h-56 overflow-y-auto divide-y" style={{ borderColor: "var(--card-border)" }}>
                {result.rows.map(({ year, balance, interest, contribution }) => (
                  <div key={year} className="grid grid-cols-4 px-3 py-2 text-xs" style={{ color: "var(--foreground)" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>{year}</span>
                    <span className="text-right font-medium">{fmt(balance)}</span>
                    <span className="text-right" style={{ color: "#22c55e" }}>+{fmt(interest)}</span>
                    <span className="text-right" style={{ color: "var(--muted-foreground)" }}>{fmt(contribution)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
