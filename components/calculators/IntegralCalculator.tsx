"use client";

import { useState } from "react";
import * as math from "mathjs";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const EXAMPLES = [
  { expr: "x^2", a: "0", b: "3" },
  { expr: "sin(x)", a: "0", b: "3.14159" },
  { expr: "e^x", a: "0", b: "1" },
  { expr: "1/x", a: "1", b: "e" },
];

/** Adaptive Simpson's rule — accurate to ~1e-8 for smooth functions */
function simpsonAdaptive(f: (x: number) => number, a: number, b: number, tol = 1e-8, depth = 0): number {
  const mid = (a + b) / 2;
  const S   = ((b - a) / 6) * (f(a) + 4 * f(mid) + f(b));
  const S1  = ((mid - a) / 6) * (f(a) + 4 * f((a + mid) / 2) + f(mid));
  const S2  = ((b - mid) / 6) * (f(mid) + 4 * f((mid + b) / 2) + f(b));
  if (depth > 50) return S1 + S2;
  if (Math.abs(S1 + S2 - S) < 15 * tol) return S1 + S2 + (S1 + S2 - S) / 15;
  return simpsonAdaptive(f, a, mid, tol / 2, depth + 1) +
         simpsonAdaptive(f, mid, b, tol / 2, depth + 1);
}

export default function IntegralCalculator() {
  const [expr, setExpr] = useState("x^2");
  const [lower, setLower] = useState("0");
  const [upper, setUpper] = useState("3");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError]   = useState("");

  function calculate() {
    setError("");
    setResult(null);
    try {
      const compiled = math.compile(expr);
      const f = (x: number) => {
        const val = compiled.evaluate({ x });
        if (typeof val !== "number" || !isFinite(val)) throw new Error("Function undefined at x = " + x);
        return val;
      };

      const a = math.evaluate(lower) as number;
      const b = math.evaluate(upper) as number;
      if (isNaN(a) || isNaN(b)) throw new Error("Invalid bounds");

      const area = simpsonAdaptive(f, a, b);
      const display = Math.abs(area) < 1e-10 ? "0" : area.toPrecision(10).replace(/\.?0+$/, "");
      setResult(display);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not evaluate integral");
    }
  }

  return (
    <Card>
      <CardTitle>Integral Calculator</CardTitle>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--muted-foreground)" }}>f(x) =</label>
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="e.g. x^2"
            className="w-full rounded-xl border px-3 py-2.5 text-sm font-mono outline-none"
            style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Lower bound (a)" value={lower} onChange={(e) => setLower(e.target.value)} placeholder="0" />
          <Input label="Upper bound (b)" value={upper} onChange={(e) => setUpper(e.target.value)} placeholder="1" />
        </div>

        {/* Examples */}
        <div>
          <p className="text-xs mb-1.5" style={{ color: "var(--muted-foreground)" }}>Examples:</p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map(({ expr: ex, a, b }) => (
              <button
                key={ex}
                onClick={() => { setExpr(ex); setLower(a); setUpper(b); }}
                className="text-xs px-2.5 py-1 rounded-lg border font-mono transition-opacity hover:opacity-70"
                style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
              >
                ∫{ex}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={calculate} className="w-full">Calculate Integral</Button>
      </div>

      {error && (
        <p className="mt-3 text-sm" style={{ color: "#ef4444" }}>{error}</p>
      )}

      {result !== null && (
        <ResultBox>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
            ∫ from {lower} to {upper} of {expr} dx =
          </p>
          <p className="font-mono text-2xl font-bold" style={{ color: "var(--accent)" }}>{result}</p>
          <p className="text-xs mt-1.5" style={{ color: "var(--muted-foreground)" }}>
            Computed via adaptive Simpson's rule (±1×10⁻⁸ tolerance)
          </p>
        </ResultBox>
      )}

      <p className="text-xs mt-3" style={{ color: "var(--muted-foreground)" }}>
        Use * for multiplication · ^ for powers · bounds support expressions like pi, e
      </p>
    </Card>
  );
}
