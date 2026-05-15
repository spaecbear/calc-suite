"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Calculator } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b"
      style={{
        background: "var(--card)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "var(--accent)" }}
        >
          <Calculator size={16} className="text-white" />
        </div>
        <span className="font-bold text-base tracking-tight" style={{ color: "var(--foreground)" }}>
          CalcSuite
        </span>
      </div>

      <button
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors hover:opacity-80"
        style={{
          borderColor: "var(--card-border)",
          background: "var(--muted)",
          color: "var(--foreground)",
        }}
      >
        {mounted ? (
          theme === "dark" ? <Sun size={16} /> : <Moon size={16} />
        ) : (
          <Moon size={16} />
        )}
      </button>
    </header>
  );
}
