"use client";

import { type ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-colors ${className}`}
      style={{
        background: "var(--card)",
        borderColor: "var(--card-border)",
      }}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
      {children}
    </h2>
  );
}

export function ResultBox({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 mt-4 border"
      style={{
        background: "var(--result-bg)",
        borderColor: "var(--result-border)",
        color: "var(--result-text)",
      }}
    >
      {children}
    </div>
  );
}
