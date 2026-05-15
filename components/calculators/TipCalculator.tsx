"use client";

import { useState } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const TIP_PRESETS = [10, 15, 18, 20, 25];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function TipCalculator() {
  const [bill, setBill] = useState("50");
  const [tipPct, setTipPct] = useState("18");
  const [people, setPeople] = useState("1");

  const billNum = parseFloat(bill) || 0;
  const tipNum = parseFloat(tipPct) || 0;
  const peopleNum = Math.max(1, parseInt(people) || 1);

  const tipAmount = billNum * (tipNum / 100);
  const total = billNum + tipAmount;
  const perPerson = total / peopleNum;
  const tipPerPerson = tipAmount / peopleNum;

  return (
    <Card>
      <CardTitle>Tip Calculator</CardTitle>
      <div className="flex flex-col gap-4">
        <Input
          label="Bill Amount"
          type="number"
          value={bill}
          unit="$"
          placeholder="0.00"
          min="0"
          step="0.01"
          onChange={(e) => setBill(e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
            Tip Percentage
          </label>
          <div className="flex gap-2 flex-wrap mb-1">
            {TIP_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setTipPct(String(p))}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                style={{
                  background: tipPct === String(p) ? "var(--accent)" : "var(--muted)",
                  borderColor: tipPct === String(p) ? "var(--accent)" : "var(--card-border)",
                  color: tipPct === String(p) ? "#fff" : "var(--foreground)",
                }}
              >
                {p}%
              </button>
            ))}
          </div>
          <Input
            type="number"
            value={tipPct}
            unit="%"
            placeholder="18"
            min="0"
            max="100"
            onChange={(e) => setTipPct(e.target.value)}
          />
        </div>

        <Input
          label="Number of People"
          type="number"
          value={people}
          placeholder="1"
          min="1"
          step="1"
          onChange={(e) => setPeople(e.target.value)}
        />

        <ResultBox>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs opacity-70">Tip Amount</p>
              <p className="text-xl font-bold">{fmt(tipAmount)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Total Bill</p>
              <p className="text-xl font-bold">{fmt(total)}</p>
            </div>
            {peopleNum > 1 && (
              <>
                <div>
                  <p className="text-xs opacity-70">Per Person (total)</p>
                  <p className="text-xl font-bold">{fmt(perPerson)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Per Person (tip)</p>
                  <p className="text-xl font-bold">{fmt(tipPerPerson)}</p>
                </div>
              </>
            )}
          </div>
        </ResultBox>
      </div>
    </Card>
  );
}
