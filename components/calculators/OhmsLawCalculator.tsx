"use client";

import { useState } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Field = "V" | "I" | "R" | "P";

const FIELDS: { id: Field; label: string; unit: string; symbol: string }[] = [
  { id: "V", label: "Voltage",     unit: "V",  symbol: "V" },
  { id: "I", label: "Current",     unit: "A",  symbol: "I" },
  { id: "R", label: "Resistance",  unit: "Ω",  symbol: "R" },
  { id: "P", label: "Power",       unit: "W",  symbol: "P" },
];

function solve(vals: Record<Field, string>): Record<Field, string> | null {
  const n: Partial<Record<Field, number>> = {};
  for (const [k, v] of Object.entries(vals)) {
    const num = parseFloat(v as string);
    if (!isNaN(num) && num > 0) n[k as Field] = num;
  }
  const known = Object.keys(n) as Field[];
  if (known.length < 2) return null;

  const fmt = (x: number) =>
    Math.abs(x) >= 1000 ? x.toFixed(0) :
    Math.abs(x) >= 10   ? x.toFixed(2) :
    Math.abs(x) >= 0.01 ? x.toFixed(4) :
    x.toExponential(3);

  let V = n.V, I = n.I, R = n.R, P = n.P;

  // Solve for all using Ohm's law: V=IR, P=VI=I²R=V²/R
  if (V && I) { R = V / I;      P = V * I; }
  else if (V && R) { I = V / R; P = V * I; }
  else if (V && P) { I = P / V; R = V / I; }
  else if (I && R) { V = I * R; P = V * I; }
  else if (I && P) { V = P / I; R = V / I; }
  else if (R && P) { V = Math.sqrt(P * R); I = V / R; }

  if (!V || !I || !R || !P) return null;

  return { V: fmt(V), I: fmt(I), R: fmt(R), P: fmt(P) };
}

export default function OhmsLawCalculator() {
  const [vals, setVals] = useState<Record<Field, string>>({ V: "", I: "", R: "", P: "" });
  const [result, setResult] = useState<Record<Field, string> | null>(null);
  const [error, setError] = useState("");

  const knownCount = Object.values(vals).filter((v) => v !== "" && !isNaN(parseFloat(v))).length;

  function calculate() {
    setError("");
    const res = solve(vals);
    if (!res) setError("Enter at least 2 known values.");
    else setResult(res);
  }

  function clear() {
    setVals({ V: "", I: "", R: "", P: "" });
    setResult(null);
    setError("");
  }

  return (
    <Card>
      <CardTitle>Ohm&apos;s Law Calculator</CardTitle>

      {/* Triangle diagram */}
      <div
        className="rounded-xl px-4 py-3 mb-4 text-center text-sm font-mono"
        style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
      >
        V = I × R &nbsp;·&nbsp; P = V × I &nbsp;·&nbsp; P = I²R &nbsp;·&nbsp; P = V²/R
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {FIELDS.map(({ id, label, unit, symbol }) => (
          <div key={id}>
            <label className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <span className="font-bold" style={{ color: "var(--accent)" }}>{symbol}</span>
              {label}
            </label>
            <div className="relative">
              <input
                type="number"
                value={vals[id]}
                onChange={(e) => { setVals({ ...vals, [id]: e.target.value }); setResult(null); }}
                placeholder="?"
                min="0"
                className="w-full rounded-xl border px-3 py-2.5 text-sm pr-10 outline-none"
                style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm mb-3" style={{ color: "#ef4444" }}>{error}</p>}

      <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>
        {knownCount < 2 ? `Enter ${2 - knownCount} more value${knownCount === 1 ? "" : "s"} to solve` : "Ready to solve"}
      </p>

      <div className="flex gap-2">
        <Button onClick={calculate} className="flex-1">Solve</Button>
        <Button variant="secondary" onClick={clear} className="px-5">Clear</Button>
      </div>

      {result && (
        <ResultBox>
          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map(({ id, label, unit, symbol }) => (
              <div key={id}>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  <span className="font-bold" style={{ color: "var(--accent)" }}>{symbol}</span> {label}
                </p>
                <p className="font-mono font-bold text-lg" style={{ color: "var(--result-text)" }}>
                  {result[id]} <span className="text-sm font-normal" style={{ color: "var(--muted-foreground)" }}>{unit}</span>
                </p>
              </div>
            ))}
          </div>
        </ResultBox>
      )}
    </Card>
  );
}
