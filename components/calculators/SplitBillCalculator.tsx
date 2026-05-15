"use client";

import { useState, useId } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

interface Person {
  id: string;
  name: string;
  adjustment: string; // extra amount this person owes (positive) or credit (negative)
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

let uid = 0;
const newId = () => `p${++uid}`;

export default function SplitBillCalculator() {
  const [bill, setBill] = useState("120");
  const [tip, setTip] = useState("18");
  const [tax, setTax] = useState("0");
  const [people, setPeople] = useState<Person[]>([
    { id: newId(), name: "Person 1", adjustment: "0" },
    { id: newId(), name: "Person 2", adjustment: "0" },
  ]);

  const billNum = parseFloat(bill) || 0;
  const tipPct = parseFloat(tip) || 0;
  const taxPct = parseFloat(tax) || 0;

  const tipAmount = billNum * (tipPct / 100);
  const taxAmount = billNum * (taxPct / 100);
  const grandTotal = billNum + tipAmount + taxAmount;
  const evenSplit = people.length > 0 ? grandTotal / people.length : 0;

  const addPerson = () => {
    setPeople((prev) => [
      ...prev,
      { id: newId(), name: `Person ${prev.length + 1}`, adjustment: "0" },
    ]);
  };

  const removePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePerson = (id: string, field: keyof Person, value: string) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  return (
    <Card>
      <CardTitle>Split Bill Calculator</CardTitle>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <Input label="Bill" type="number" value={bill} unit="$" min="0" step="0.01" onChange={(e) => setBill(e.target.value)} />
          <Input label="Tip" type="number" value={tip} unit="%" min="0" onChange={(e) => setTip(e.target.value)} />
          <Input label="Tax" type="number" value={tax} unit="%" min="0" onChange={(e) => setTax(e.target.value)} />
        </div>

        {/* People */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
              People ({people.length})
            </span>
            <Button variant="secondary" size="sm" onClick={addPerson}>
              <Plus size={12} className="inline mr-1" />
              Add Person
            </Button>
          </div>

          {people.map((p) => (
            <div key={p.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  label="Name"
                  type="text"
                  value={p.name}
                  onChange={(e) => updatePerson(p.id, "name", e.target.value)}
                />
              </div>
              <div className="w-28">
                <Input
                  label="Extra $±"
                  type="number"
                  value={p.adjustment}
                  step="0.01"
                  onChange={(e) => updatePerson(p.id, "adjustment", e.target.value)}
                />
              </div>
              <button
                onClick={() => removePerson(p.id)}
                className="mb-0.5 p-2 rounded-xl transition-colors hover:opacity-70"
                style={{ color: "var(--muted-foreground)" }}
                aria-label="Remove person"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <ResultBox>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs opacity-70">Grand Total</p>
              <p className="text-xl font-bold">{fmt(grandTotal)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">Even Split</p>
              <p className="text-xl font-bold">{fmt(evenSplit)}</p>
            </div>
          </div>

          {people.length > 0 && (
            <div className="border-t pt-3 flex flex-col gap-2" style={{ borderColor: "var(--result-border)" }}>
              {people.map((p) => {
                const adj = parseFloat(p.adjustment) || 0;
                const owes = evenSplit + adj;
                return (
                  <div key={p.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{p.name || "—"}</span>
                    <span className="text-sm font-bold">
                      {fmt(owes)}
                      {adj !== 0 && (
                        <span className="text-xs font-normal opacity-60 ml-1">
                          ({adj > 0 ? "+" : ""}{fmt(adj)})
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t mt-3 pt-2 flex justify-between text-xs opacity-60" style={{ borderColor: "var(--result-border)" }}>
            <span>Bill {fmt(billNum)} + Tip {fmt(tipAmount)} + Tax {fmt(taxAmount)}</span>
          </div>
        </ResultBox>
      </div>
    </Card>
  );
}
