"use client";

import { useState } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const ASPECT_RATIOS = [
  { label: "16:9 (HD / 4K)",       w: 16, h: 9 },
  { label: "16:10 (WUXGA)",         w: 16, h: 10 },
  { label: "4:3 (XGA / SXGA)",     w: 4,  h: 3 },
  { label: "2.35:1 (CinemaScope)", w: 2.35, h: 1 },
  { label: "21:9 (UltraWide)",     w: 21, h: 9 },
];

// Common throw ratios for reference
const THROW_PRESETS = [
  { label: "Ultra-short throw (0.4)", value: "0.4" },
  { label: "Short throw (0.8)",        value: "0.8" },
  { label: "Standard (1.5)",           value: "1.5" },
  { label: "Long throw (2.5)",         value: "2.5" },
];

type Mode = "dist-to-size" | "size-to-dist";

function fmtFt(m: number) {
  const ft = m * 3.28084;
  const inches = Math.round((ft % 1) * 12);
  return `${Math.floor(ft)}′ ${inches}″ (${m.toFixed(2)} m)`;
}

function fmtIn(m: number) {
  return `${(m * 39.3701).toFixed(1)}″ (${(m * 100).toFixed(1)} cm)`;
}

export default function ProjectorCalculator() {
  const [mode, setMode]           = useState<Mode>("dist-to-size");
  const [throwRatio, setThrowRatio] = useState("1.5");
  const [distance, setDistance]   = useState(""); // metres
  const [screenW, setScreenW]     = useState(""); // metres
  const [aspectIdx, setAspectIdx] = useState(0);
  const [unit, setUnit]           = useState<"m" | "ft">("ft");
  const [result, setResult]       = useState<Record<string, string> | null>(null);
  const [error, setError]         = useState("");

  const ar = ASPECT_RATIOS[aspectIdx];

  function toMetres(val: string): number {
    const n = parseFloat(val);
    return unit === "ft" ? n * 0.3048 : n;
  }

  function calculate() {
    setError(""); setResult(null);
    const tr = parseFloat(throwRatio);
    if (isNaN(tr) || tr <= 0) { setError("Enter a valid throw ratio"); return; }

    if (mode === "dist-to-size") {
      const distM = toMetres(distance);
      if (isNaN(distM) || distM <= 0) { setError("Enter a valid throw distance"); return; }
      // Throw ratio = distance / image width  →  image width = distance / throw ratio
      const imgW = distM / tr;
      const imgH = imgW * (ar.h / ar.w);
      const diagonal = Math.sqrt(imgW ** 2 + imgH ** 2);
      setResult({
        "Image Width":    fmtIn(imgW),
        "Image Height":   fmtIn(imgH),
        "Screen Diagonal": fmtIn(diagonal),
        "Throw Distance": fmtFt(distM),
        "Throw Ratio":    tr.toFixed(2),
      });
    } else {
      const swM = toMetres(screenW);
      if (isNaN(swM) || swM <= 0) { setError("Enter a valid screen width"); return; }
      // distance = throw ratio × image width
      const distM = tr * swM;
      const imgH  = swM * (ar.h / ar.w);
      const diagonal = Math.sqrt(swM ** 2 + imgH ** 2);
      setResult({
        "Required Distance": fmtFt(distM),
        "Image Width":       fmtIn(swM),
        "Image Height":      fmtIn(imgH),
        "Screen Diagonal":   fmtIn(diagonal),
        "Throw Ratio":       tr.toFixed(2),
      });
    }
  }

  return (
    <Card>
      <CardTitle>Projector Calculator</CardTitle>

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border mb-4" style={{ borderColor: "var(--card-border)" }}>
        {([
          { key: "dist-to-size", label: "Distance → Screen size" },
          { key: "size-to-dist", label: "Screen size → Distance" },
        ] as { key: Mode; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setMode(key); setResult(null); }}
            className="flex-1 py-2 text-xs font-medium transition-colors"
            style={{
              background: mode === key ? "var(--accent)" : "var(--muted)",
              color: mode === key ? "#fff" : "var(--muted-foreground)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {/* Unit toggle */}
        <div className="flex gap-2 items-center">
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Units:</span>
          {(["ft", "m"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className="px-3 py-1 rounded-lg text-xs font-semibold border transition-colors"
              style={{
                background: unit === u ? "var(--accent)" : "var(--muted)",
                borderColor: "var(--card-border)",
                color: unit === u ? "#fff" : "var(--muted-foreground)",
              }}
            >
              {u}
            </button>
          ))}
        </div>

        {/* Throw ratio */}
        <div>
          <Input
            label={`Throw ratio (TR = distance ÷ image width)`}
            type="number"
            value={throwRatio}
            onChange={(e) => setThrowRatio(e.target.value)}
            placeholder="1.5"
          />
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {THROW_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setThrowRatio(p.value)}
                className="text-[10px] px-2 py-0.5 rounded border"
                style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--muted-foreground)" }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Variable input */}
        {mode === "dist-to-size" ? (
          <Input
            label={`Throw distance (${unit})`}
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder={unit === "ft" ? "10" : "3"}
          />
        ) : (
          <Input
            label={`Screen / image width (${unit})`}
            type="number"
            value={screenW}
            onChange={(e) => setScreenW(e.target.value)}
            placeholder={unit === "ft" ? "6" : "2"}
          />
        )}

        {/* Aspect ratio */}
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Aspect ratio</p>
          <select
            value={aspectIdx}
            onChange={(e) => setAspectIdx(Number(e.target.value))}
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none appearance-none"
            style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            {ASPECT_RATIOS.map((a, i) => (
              <option key={a.label} value={i}>{a.label}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}
        <Button onClick={calculate} className="w-full">Calculate</Button>
      </div>

      {result && (
        <ResultBox>
          <div className="space-y-2">
            {Object.entries(result).map(([k, v]) => (
              <div key={k} className="flex justify-between items-baseline">
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{k}</span>
                <span className="text-sm font-mono font-semibold" style={{ color: "var(--result-text)" }}>{v}</span>
              </div>
            ))}
          </div>
        </ResultBox>
      )}
    </Card>
  );
}
