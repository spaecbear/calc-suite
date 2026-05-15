"use client";

import { useState } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";

type Mode = "percent" | "amount" | "markup";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function DiscountCalculator() {
  const [mode, setMode] = useState<Mode>("percent");
  const [original, setOriginal] = useState("100");
  const [discount, setDiscount] = useState("20");
  const [finalPrice, setFinalPrice] = useState("80");
  const [markupPct, setMarkupPct] = useState("30");
  const [cost, setCost] = useState("50");

  const origNum = parseFloat(original) || 0;
  const discNum = parseFloat(discount) || 0;
  const finalNum = parseFloat(finalPrice) || 0;

  const percentResult = (() => {
    const saved = origNum * (discNum / 100);
    return { saved, final: origNum - saved, pct: discNum };
  })();

  const amountResult = (() => {
    const pct = origNum > 0 ? (discNum / origNum) * 100 : 0;
    return { saved: discNum, final: origNum - discNum, pct };
  })();

  const markupResult = (() => {
    const costNum = parseFloat(cost) || 0;
    const pct = parseFloat(markupPct) || 0;
    const salePrice = costNum * (1 + pct / 100);
    const profit = salePrice - costNum;
    const margin = salePrice > 0 ? (profit / salePrice) * 100 : 0;
    return { salePrice, profit, margin };
  })();

  const reverseResult = (() => {
    if (origNum <= 0) return null;
    const pct = ((origNum - finalNum) / origNum) * 100;
    return { pct, saved: origNum - finalNum };
  })();

  return (
    <Card>
      <CardTitle>Discount Calculator</CardTitle>

      <Select
        label="Mode"
        options={[
          { value: "percent", label: "Discount by %" },
          { value: "amount", label: "Discount by $ Amount" },
          { value: "markup", label: "Markup / Profit" },
        ]}
        value={mode}
        onChange={(e) => setMode(e.target.value as Mode)}
      />

      <div className="flex flex-col gap-4 mt-4">
        {mode === "percent" && (
          <>
            <Input label="Original Price" type="number" value={original} unit="$" min="0" onChange={(e) => setOriginal(e.target.value)} />
            <Input label="Discount" type="number" value={discount} unit="%" min="0" max="100" onChange={(e) => setDiscount(e.target.value)} />
            <ResultBox>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs opacity-70">Final Price</p>
                  <p className="text-2xl font-bold">{fmt(percentResult.final)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">You Save</p>
                  <p className="text-2xl font-bold">{fmt(percentResult.saved)}</p>
                </div>
              </div>
            </ResultBox>
          </>
        )}

        {mode === "amount" && (
          <>
            <Input label="Original Price" type="number" value={original} unit="$" min="0" onChange={(e) => setOriginal(e.target.value)} />
            <Input label="Discount Amount" type="number" value={discount} unit="$" min="0" onChange={(e) => setDiscount(e.target.value)} />
            <ResultBox>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs opacity-70">Final Price</p>
                  <p className="text-2xl font-bold">{fmt(amountResult.final)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Discount %</p>
                  <p className="text-2xl font-bold">{amountResult.pct.toFixed(1)}%</p>
                </div>
              </div>
            </ResultBox>
          </>
        )}

        {mode === "markup" && (
          <>
            <Input label="Cost / Buy Price" type="number" value={cost} unit="$" min="0" onChange={(e) => setCost(e.target.value)} />
            <Input label="Markup %" type="number" value={markupPct} unit="%" min="0" onChange={(e) => setMarkupPct(e.target.value)} />
            <ResultBox>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs opacity-70">Sale Price</p>
                  <p className="text-xl font-bold">{fmt(markupResult.salePrice)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Profit</p>
                  <p className="text-xl font-bold">{fmt(markupResult.profit)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Margin</p>
                  <p className="text-xl font-bold">{markupResult.margin.toFixed(1)}%</p>
                </div>
              </div>
            </ResultBox>
          </>
        )}

        {/* Reverse lookup always shown */}
        <div
          className="rounded-xl p-3 border"
          style={{ borderColor: "var(--card-border)", background: "var(--muted)" }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>
            Reverse Lookup — What % off?
          </p>
          <div className="flex gap-2">
            <Input label="Original $" type="number" value={original} min="0" onChange={(e) => setOriginal(e.target.value)} />
            <Input label="Final $" type="number" value={finalPrice} min="0" onChange={(e) => setFinalPrice(e.target.value)} />
          </div>
          {reverseResult && finalNum < origNum && (
            <p className="text-sm font-semibold mt-2" style={{ color: "var(--accent)" }}>
              {reverseResult.pct.toFixed(1)}% off — saved {fmt(reverseResult.saved)}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
