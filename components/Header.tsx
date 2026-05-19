"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Calculator } from "lucide-react";
import { useEffect, useState } from "react";
import { CalcSelector } from "@/components/CalcSelector";
import { type CalcId } from "@/lib/navItems";

interface HeaderProps {
  active: CalcId;
  onChange: (id: CalcId) => void;
  isPro?: boolean;
}

export function Header({ active, onChange, isPro = false }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header
      className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b"
      style={{
        background: "var(--card)",
        borderColor: "var(--card-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "var(--accent)" }}
        >
          <Calculator size={16} className="text-white" />
        </div>
        <span className="font-bold text-base tracking-tight hidden sm:block" style={{ color: "var(--foreground)" }}>
          CalcSuite
        </span>
      </div>

      {/* Calculator selector — grows to fill space */}
      <div className="flex-1">
        <CalcSelector active={active} onChange={onChange} isPro={isPro} />
      </div>

      {/* Theme toggle */}
      <button
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center border transition-colors hover:opacity-80"
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
