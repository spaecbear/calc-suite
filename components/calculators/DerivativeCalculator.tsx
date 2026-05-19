"use client";

import { useState } from "react";
import * as math from "mathjs";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const EXAMPLES = ["x^3 + 2*x^2 - x + 4", "sin(x)*cos(x)", "e^x + ln(x)", "x^2 / (1 + x)"];

export default function DerivativeCalculator() {
  const [expr, setExpr]     = useState("x^3 + 2*x^2 - x + 4");
  const [evalX, setEvalX]   = useState("2");
  const [result, setResult] = useState<{ deriv: string; value: string | null } | null>(null);
  const [error, setError]   = useState("");

  function calculate() {
    setError("");
    setResult(null);
    try {
      const node   = math.parse(expr);
      const derivNode = math.derivative(node, "x");
      const derivStr  = derivNode.toString();

      let value: string | null = null;
      const xVal = parseFloat(evalX);
      if (!isNaN(xVal)) {
        const compiled = derivNode.compile();
        const raw = compiled.evaluate({ x: xVal });
        value = typeof raw === "number" ? raw.toPrecision(8).replace(/\.?0+$/, "") : String(raw);
      }

      setResult({ deriv: derivStr, value });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid expression");
    }
  }

  return (
    <Card>
      <CardTitle>Derivative Calculator</CardTitle>

      {/* Expression input */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--muted-foreground)" }}>
            f(x) =
          </label>
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="e.g. x^2 + sin(x)"
            className="w-full rounded-xl border px-3 py-2.5 text-sm font-mono outline-none transition-colors focus:ring-2"
            style={{
              background: "var(--muted)",
              borderColor: "var(--card-border)",
              color: "var(--foreground)",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--muted-foreground)" }}>
            Evaluate at x =
          </label>
          <input
            type="number"
            value={evalX}
            onChange={(e) => setEvalX(e.target.value)}
            placeholder="optional"
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{
              background: "var(--muted)",
              borderColor: "var(--card-border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        {/* Examples */}
        <div>
          <p className="text-xs mb-1.5" style={{ color: "var(--muted-foreground)" }}>Examples:</p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setExpr(ex)}
                className="text-xs px-2.5 py-1 rounded-lg border font-mono transition-opacity hover:opacity-70"
                style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={calculate} className="w-full">Differentiate</Button>
      </div>

      {error && (
        <p className="mt-3 text-sm" style={{ color: "#ef4444" }}>{error}</p>
      )}

      {result && (
        <ResultBox>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "var(--muted-foreground)" }}>f′(x) =</p>
              <p className="font-mono text-sm font-semibold break-all" style={{ color: "var(--result-text)" }}>{result.deriv}</p>
            </div>
            {result.value !== null && (
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: "var(--muted-foreground)" }}>
                  f′({evalX}) =
                </p>
                <p className="font-mono text-lg font-bold" style={{ color: "var(--accent)" }}>{result.value}</p>
              </div>
            )}
          </div>
        </ResultBox>
      )}

      {/* Usage note */}
      <p className="text-xs mt-3" style={{ color: "var(--muted-foreground)" }}>
        Use * for multiplication · ^ for powers · supported: sin, cos, tan, exp, ln, sqrt
      </p>
    </Card>
  );
}
