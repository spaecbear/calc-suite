"use client";

import { useState } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Trash2 } from "lucide-react";

// Standard breaker sizes (NEMA / NEC)
const BREAKER_SIZES = [15, 20, 30, 40, 50, 60, 70, 80, 100, 125, 150, 200];

// AWG wire gauge ampacity (NEC 310 table, copper, 60°C)
const WIRE_GAUGES = [
  { awg: "14 AWG", amps: 15  },
  { awg: "12 AWG", amps: 20  },
  { awg: "10 AWG", amps: 30  },
  { awg: "8 AWG",  amps: 40  },
  { awg: "6 AWG",  amps: 55  },
  { awg: "4 AWG",  amps: 70  },
  { awg: "2 AWG",  amps: 95  },
  { awg: "1 AWG",  amps: 110 },
  { awg: "1/0",    amps: 125 },
  { awg: "2/0",    amps: 145 },
  { awg: "3/0",    amps: 165 },
  { awg: "4/0",    amps: 195 },
];

interface Device { id: number; name: string; watts: string; qty: string }

let nextId = 1;

function recommendBreaker(amps: number): number {
  // NEC 80% rule: circuit must handle amps / 0.8
  const required = amps / 0.8;
  return BREAKER_SIZES.find((s) => s >= required) ?? 200;
}

function recommendWire(amps: number): string {
  const gauge = WIRE_GAUGES.find((g) => g.amps >= amps);
  return gauge ? gauge.awg : "4/0+ (consult electrician)";
}

function safeLoad(breakerSize: number): number {
  return breakerSize * 0.8;
}

export default function CircuitLoadCalculator() {
  const [voltage, setVoltage]   = useState<"120" | "240">("120");
  const [devices, setDevices]   = useState<Device[]>([
    { id: nextId++, name: "Refrigerator",  watts: "150",  qty: "1" },
    { id: nextId++, name: "Microwave",     watts: "1200", qty: "1" },
    { id: nextId++, name: "Coffee Maker",  watts: "1000", qty: "1" },
  ]);
  const [result, setResult] = useState<{
    totalWatts: number; totalAmps: number; breaker: number;
    wire: string; safe: number; status: "ok" | "warn" | "over";
  } | null>(null);

  function addDevice() {
    setDevices((d) => [...d, { id: nextId++, name: "", watts: "", qty: "1" }]);
  }

  function removeDevice(id: number) {
    setDevices((d) => d.filter((x) => x.id !== id));
  }

  function update(id: number, field: keyof Device, value: string) {
    setDevices((d) => d.map((x) => x.id === id ? { ...x, [field]: value } : x));
    setResult(null);
  }

  function calculate() {
    const v = parseFloat(voltage);
    let totalW = 0;
    for (const d of devices) {
      const w = parseFloat(d.watts) || 0;
      const q = parseFloat(d.qty)   || 1;
      totalW += w * q;
    }
    const totalAmps  = totalW / v;
    const breaker    = recommendBreaker(totalAmps);
    const wire       = recommendWire(totalAmps);
    const safe       = safeLoad(breaker);
    const status     = totalAmps > breaker ? "over" : totalAmps > safe ? "warn" : "ok";
    setResult({ totalWatts: totalW, totalAmps, breaker, wire, safe, status });
  }

  const statusColor = result?.status === "over" ? "#ef4444" : result?.status === "warn" ? "#f59e0b" : "#22c55e";
  const statusLabel = result?.status === "over" ? "⚠ Overloaded" : result?.status === "warn" ? "⚡ Near limit" : "✓ Safe";

  return (
    <Card>
      <CardTitle>Circuit Load Calculator</CardTitle>

      {/* Voltage */}
      <div className="flex rounded-xl overflow-hidden border mb-4" style={{ borderColor: "var(--card-border)" }}>
        {(["120", "240"] as const).map((v) => (
          <button
            key={v}
            onClick={() => { setVoltage(v); setResult(null); }}
            className="flex-1 py-2 text-sm font-medium transition-colors"
            style={{
              background: voltage === v ? "var(--accent)" : "var(--muted)",
              color: voltage === v ? "#fff" : "var(--muted-foreground)",
            }}
          >
            {v}V
          </button>
        ))}
      </div>

      {/* Device list */}
      <div className="space-y-2 mb-3">
        {devices.map((d) => (
          <div key={d.id} className="flex gap-2 items-center">
            <input
              value={d.name}
              onChange={(e) => update(d.id, "name", e.target.value)}
              placeholder="Device name"
              className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
              style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
            />
            <input
              type="number"
              value={d.watts}
              onChange={(e) => update(d.id, "watts", e.target.value)}
              placeholder="Watts"
              className="w-20 rounded-xl border px-3 py-2 text-sm outline-none"
              style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
            />
            <input
              type="number"
              value={d.qty}
              onChange={(e) => update(d.id, "qty", e.target.value)}
              placeholder="Qty"
              className="w-12 rounded-xl border px-3 py-2 text-sm outline-none text-center"
              style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
            />
            <button onClick={() => removeDevice(d.id)} className="p-1.5 rounded-lg shrink-0 transition-opacity hover:opacity-70">
              <Trash2 size={14} style={{ color: "#ef4444" }} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={addDevice}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border transition-opacity hover:opacity-70"
          style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--accent)" }}
        >
          <Plus size={13} /> Add device
        </button>
        <p className="text-xs self-center" style={{ color: "var(--muted-foreground)" }}>
          {devices.length} device{devices.length !== 1 ? "s" : ""}
        </p>
      </div>

      <Button onClick={calculate} className="w-full">Calculate Load</Button>

      {result && (
        <ResultBox>
          {/* Status banner */}
          <div
            className="rounded-xl px-4 py-2 mb-3 text-center text-sm font-bold"
            style={{ background: statusColor + "22", color: statusColor }}
          >
            {statusLabel}
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {[
              { label: "Total Watts",    value: `${result.totalWatts.toLocaleString()} W` },
              { label: "Total Amps",     value: `${result.totalAmps.toFixed(1)} A` },
              { label: "Safe Load (80%)",value: `${result.safe} A` },
              { label: "Min Breaker",    value: `${result.breaker} A`, accent: true },
              { label: "Min Wire Gauge", value: result.wire, full: true },
            ].map(({ label, value, accent, full }) => (
              <div key={label} className={full ? "col-span-2" : ""}>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</p>
                <p
                  className="font-mono font-bold text-base"
                  style={{ color: accent ? "var(--accent)" : "var(--result-text)" }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          <p className="text-[10px] mt-3" style={{ color: "var(--muted-foreground)" }}>
            NEC 80% rule applied. Wire gauge based on copper conductors at 60°C. Consult a licensed electrician for actual installations.
          </p>
        </ResultBox>
      )}
    </Card>
  );
}
