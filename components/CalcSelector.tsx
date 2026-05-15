"use client";

import { useState, useRef, useEffect } from "react";
import {
  Hash,
  Ruler,
  UtensilsCrossed,
  Landmark,
  CalendarDays,
  Tag,
  Fuel,
  Users,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { NAV_ITEMS, type CalcId } from "@/lib/navItems";

const ICON_MAP: Record<string, LucideIcon> = {
  Hash,
  Ruler,
  UtensilsCrossed,
  Landmark,
  CalendarDays,
  Tag,
  Fuel,
  Users,
};

interface CalcSelectorProps {
  active: CalcId;
  onChange: (id: CalcId) => void;
}

export function CalcSelector({ active, onChange }: CalcSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeItem = NAV_ITEMS.find((i) => i.id === active)!;
  const ActiveIcon = ICON_MAP[activeItem.icon];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const select = (id: CalcId) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all hover:opacity-80"
        style={{
          background: "var(--muted)",
          borderColor: "var(--card-border)",
          color: "var(--foreground)",
        }}
      >
        <ActiveIcon size={15} style={{ color: "var(--accent)" }} />
        <span>{activeItem.label}</span>
        <ChevronDown
          size={13}
          className="transition-transform"
          style={{
            color: "var(--muted-foreground)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 w-64 rounded-2xl border shadow-lg overflow-hidden"
          style={{
            background: "var(--card)",
            borderColor: "var(--card-border)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                onClick={() => select(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:opacity-80"
                style={{
                  background: isActive ? "var(--accent)" : "transparent",
                  color: isActive ? "#fff" : "var(--foreground)",
                  borderBottom: "1px solid var(--card-border)",
                }}
              >
                <Icon size={15} className="shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span
                    className="text-xs truncate"
                    style={{ color: isActive ? "rgba(255,255,255,0.7)" : "var(--muted-foreground)" }}
                  >
                    {item.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
