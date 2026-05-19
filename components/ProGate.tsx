"use client";

import { useState } from "react";
import { Lock, Star, Zap, TrendingUp, FlaskConical } from "lucide-react";
import { purchasePro, restorePurchases } from "@/lib/purchases";

interface ProGateProps {
  onUnlock: () => void;
}

const FEATURES = [
  { icon: TrendingUp, label: "Derivative Calculator", desc: "Symbolic differentiation" },
  { icon: TrendingUp, label: "Compound Interest",    desc: "Growth projections & tables" },
  { icon: Zap,        label: "Ohm's Law",            desc: "Solve V, I, R, P" },
  { icon: FlaskConical, label: "Scientific Calc",    desc: "Trig, log, powers & more" },
  { icon: Star,       label: "Integral Calculator",  desc: "Definite integral & area" },
  { icon: Star,       label: "BMI Calculator",       desc: "Health categories & gauge" },
];

export function ProGate({ onUnlock }: ProGateProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePurchase() {
    setLoading(true);
    setError("");
    try {
      const ok = await purchasePro();
      if (ok) onUnlock();
      else setError("Purchase cancelled.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Purchase failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    setLoading(true);
    setError("");
    try {
      const ok = await restorePurchases();
      if (ok) onUnlock();
      else setError("No previous purchase found.");
    } catch {
      setError("Restore failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-2xl border shadow-sm overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      {/* Hero */}
      <div
        className="px-6 py-8 text-center"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
          <Lock size={28} />
        </div>
        <h2 className="text-2xl font-bold mb-1">CalcSuite Pro</h2>
        <p className="text-white/80 text-sm">Unlock advanced calculators — one-time purchase</p>
        <div className="mt-4 text-4xl font-extrabold">$2.99</div>
      </div>

      {/* Feature list */}
      <div className="px-5 py-4 space-y-3">
        {FEATURES.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--accent)", opacity: 0.15 }}
            />
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 absolute ml-0"
              style={{ background: "transparent" }}
            >
              {/* Icon overlay using position trick via flex */}
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--muted)" }}>
              <Icon size={15} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{label}</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-5 pb-6 space-y-2.5">
        {error && (
          <p className="text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>
        )}
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {loading ? "Processing…" : "Unlock Pro — $2.99"}
        </button>
        <button
          onClick={handleRestore}
          disabled={loading}
          className="w-full py-2.5 rounded-xl font-medium text-sm transition-opacity hover:opacity-70 disabled:opacity-40"
          style={{ color: "var(--muted-foreground)" }}
        >
          Restore Purchase
        </button>
      </div>
    </div>
  );
}
