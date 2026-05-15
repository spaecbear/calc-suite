"use client";

import { useState } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";

type Mode = "diff" | "add";

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function DateCalculator() {
  const [mode, setMode] = useState<Mode>("diff");

  // diff mode
  const [dateA, setDateA] = useState(today());
  const [dateB, setDateB] = useState(today());

  // add/subtract mode
  const [baseDate, setBaseDate] = useState(today());
  const [days, setDays] = useState("30");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const diffResult = (() => {
    if (!dateA || !dateB) return null;
    const a = new Date(dateA);
    const b = new Date(dateB);
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = Math.abs(b.getTime() - a.getTime());
    const totalDays = Math.round(diffMs / msPerDay);
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const months = Math.floor(totalDays / 30.4375);
    const years = Math.floor(totalDays / 365.25);
    return { totalDays, weeks, remainingDays, months, years };
  })();

  const addResult = (() => {
    if (!baseDate) return null;
    const d = new Date(baseDate);
    const n = parseInt(days) || 0;
    const delta = operation === "add" ? n : -n;
    d.setDate(d.getDate() + delta);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  })();

  return (
    <Card>
      <CardTitle>Date Calculator</CardTitle>

      {/* Mode toggle */}
      <div
        className="flex rounded-xl p-1 mb-4 gap-1"
        style={{ background: "var(--muted)" }}
      >
        {(["diff", "add"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: mode === m ? "var(--accent)" : "transparent",
              color: mode === m ? "#fff" : "var(--muted-foreground)",
            }}
          >
            {m === "diff" ? "Date Difference" : "Add / Subtract"}
          </button>
        ))}
      </div>

      {mode === "diff" ? (
        <div className="flex flex-col gap-4">
          <Input
            label="Start Date"
            type="date"
            value={dateA}
            onChange={(e) => setDateA(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={dateB}
            onChange={(e) => setDateB(e.target.value)}
          />
          {diffResult && (
            <ResultBox>
              <p className="text-2xl font-bold mb-1">
                {diffResult.totalDays.toLocaleString()}{" "}
                <span className="text-base font-normal">days</span>
              </p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                <div>
                  <p className="text-lg font-semibold">{diffResult.years}</p>
                  <p className="text-xs opacity-70">years</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{diffResult.months}</p>
                  <p className="text-xs opacity-70">months</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{diffResult.weeks}w {diffResult.remainingDays}d</p>
                  <p className="text-xs opacity-70">wks + days</p>
                </div>
              </div>
            </ResultBox>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Input
            label="Start Date"
            type="date"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
          />
          <Select
            label="Operation"
            options={[
              { value: "add", label: "Add days" },
              { value: "subtract", label: "Subtract days" },
            ]}
            value={operation}
            onChange={(e) => setOperation(e.target.value as "add" | "subtract")}
          />
          <Input
            label="Number of Days"
            type="number"
            value={days}
            placeholder="30"
            min="0"
            onChange={(e) => setDays(e.target.value)}
          />
          {addResult && (
            <ResultBox>
              <p className="text-xs opacity-70 mb-1">Result Date</p>
              <p className="text-xl font-bold">{addResult}</p>
            </ResultBox>
          )}
        </div>
      )}
    </Card>
  );
}
