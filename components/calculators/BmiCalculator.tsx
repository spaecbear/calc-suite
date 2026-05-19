"use client";

import { useState } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Unit = "metric" | "imperial";

interface Category {
  label: string;
  range: [number, number];
  color: string;
}

const CATEGORIES: Category[] = [
  { label: "Underweight",      range: [0, 18.5],  color: "#3b82f6" },
  { label: "Normal weight",    range: [18.5, 25],  color: "#22c55e" },
  { label: "Overweight",       range: [25, 30],    color: "#f59e0b" },
  { label: "Obese (Class I)",  range: [30, 35],    color: "#f97316" },
  { label: "Obese (Class II)", range: [35, 40],    color: "#ef4444" },
  { label: "Obese (Class III)",range: [40, Infinity], color: "#7f1d1d" },
];

function getCategory(bmi: number): Category {
  return CATEGORIES.find(({ range }) => bmi >= range[0] && bmi < range[1]) ?? CATEGORIES[CATEGORIES.length - 1];
}

// pointer position 0-100% for gauge (BMI 10–45 range)
function gaugePos(bmi: number) {
  return Math.min(100, Math.max(0, ((bmi - 10) / 35) * 100));
}

export default function BmiCalculator() {
  const [unit, setUnit]     = useState<Unit>("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [result, setResult] = useState<{ bmi: number; cat: Category } | null>(null);
  const [error, setError]   = useState("");

  function calculate() {
    setError(""); setResult(null);
    try {
      const w = parseFloat(weight);
      if (isNaN(w) || w <= 0) throw new Error("Enter a valid weight");

      let heightM: number;
      if (unit === "metric") {
        const h = parseFloat(height);
        if (isNaN(h) || h <= 0) throw new Error("Enter a valid height in cm");
        heightM = h / 100;
      } else {
        const ft = parseFloat(heightFt) || 0;
        const inches = parseFloat(heightIn) || 0;
        const totalInches = ft * 12 + inches;
        if (totalInches <= 0) throw new Error("Enter a valid height");
        heightM = totalInches * 0.0254;
      }

      const weightKg = unit === "metric" ? w : w * 0.453592;
      const bmi = weightKg / (heightM * heightM);
      setResult({ bmi, cat: getCategory(bmi) });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid input");
    }
  }

  return (
    <Card>
      <CardTitle>BMI Calculator</CardTitle>

      {/* Unit toggle */}
      <div className="flex rounded-xl overflow-hidden border mb-4" style={{ borderColor: "var(--card-border)" }}>
        {(["metric", "imperial"] as Unit[]).map((u) => (
          <button
            key={u}
            onClick={() => { setUnit(u); setResult(null); }}
            className="flex-1 py-2 text-sm font-medium capitalize transition-colors"
            style={{
              background: unit === u ? "var(--accent)" : "var(--muted)",
              color: unit === u ? "#fff" : "var(--muted-foreground)",
            }}
          >
            {u}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {unit === "metric" ? (
          <>
            <Input label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
            <Input label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" />
          </>
        ) : (
          <>
            <Input label="Weight (lbs)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="154" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Height ft" type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="5" />
              <Input label="Height in" type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="9" />
            </div>
          </>
        )}

        {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}

        <Button onClick={calculate} className="w-full">Calculate BMI</Button>
      </div>

      {result && (
        <ResultBox>
          {/* Gauge */}
          <div className="mb-3">
            <div className="relative h-3 rounded-full overflow-hidden" style={{
              background: "linear-gradient(to right, #3b82f6 0%, #22c55e 30%, #f59e0b 50%, #f97316 65%, #ef4444 80%, #7f1d1d 100%)"
            }}>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
                style={{ left: `calc(${gaugePos(result.bmi)}% - 8px)`, background: result.cat.color }}
              />
            </div>
            <div className="flex justify-between mt-1">
              {[10, 18.5, 25, 30, 35, 45].map((v) => (
                <span key={v} className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>{v}</span>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Your BMI</p>
              <p className="font-mono text-4xl font-extrabold" style={{ color: result.cat.color }}>
                {result.bmi.toFixed(1)}
              </p>
            </div>
            <div className="text-right">
              <span
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{ background: result.cat.color + "22", color: result.cat.color }}
              >
                {result.cat.label}
              </span>
            </div>
          </div>

          {/* Category table */}
          <div className="mt-3 space-y-1">
            {CATEGORIES.slice(0, 4).map(({ label, range, color }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span style={{ color: "var(--muted-foreground)" }}>{label}</span>
                </div>
                <span style={{ color: "var(--muted-foreground)" }}>
                  {range[0]} – {range[1] === Infinity ? "+" : range[1]}
                </span>
              </div>
            ))}
          </div>
        </ResultBox>
      )}
    </Card>
  );
}
