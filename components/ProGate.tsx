"use client";

import { useState } from "react";
import { Lock, Star, Zap, TrendingUp, FlaskConical, BanIcon, Activity, Sigma } from "lucide-react";
import { purchasePro, restorePurchases } from "@/lib/purchases";

const DEV_MODE = (process.env.NEXT_PUBLIC_REVENUECAT_KEY ?? "appl_REPLACE").startsWith("appl_REPLACE");

interface ProGateProps {
  onUnlock: () => void;
}

const FEATURES = [
  { icon: BanIcon,      label: "No Ads"          },
  { icon: TrendingUp,   label: "Derivative"       },
  { icon: Sigma,        label: "Integral"         },
  { icon: Zap,          label: "Ohm's Law"        },
  { icon: FlaskConical, label: "Scientific Calc"  },
  { icon: Activity,     label: "BMI"              },
  { icon: TrendingUp,   label: "Compound Interest"},
  { icon: Star,         label: "Future updates"   },
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
      {/* Compact hero */}
      <div
        className="px-5 py-5 flex items-center gap-4"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Lock size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold leading-tight">CalcSuite Pro</h2>
          <p className="text-white/80 text-xs mt-0.5">Remove ads &amp; unlock everything</p>
        </div>
        <div className="text-3xl font-extrabold shrink-0">$2.99</div>
      </div>

      {/* Features — 2-column grid */}
      <div className="px-4 py-3 grid grid-cols-2 gap-2">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: "var(--muted)" }}
          >
            <Icon size={13} style={{ color: "var(--accent)" }} className="shrink-0" />
            <span className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 pt-1 space-y-2">
        {error && (
          <p className="text-xs text-center" style={{ color: "#ef4444" }}>{error}</p>
        )}
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {loading ? "Processing…" : DEV_MODE ? "Unlock Pro — $2.99 (Test)" : "Unlock Pro — $2.99"}
        </button>
        <button
          onClick={handleRestore}
          disabled={loading}
          className="w-full py-2 rounded-xl font-medium text-sm transition-opacity hover:opacity-70 disabled:opacity-40"
          style={{ color: "var(--muted-foreground)" }}
        >
          Restore Purchase
        </button>
      </div>
    </div>
  );
}
