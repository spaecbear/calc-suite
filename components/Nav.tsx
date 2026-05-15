"use client";

import {
  Ruler,
  UtensilsCrossed,
  Landmark,
  CalendarDays,
  Tag,
  Fuel,
  Users,
  type LucideIcon,
} from "lucide-react";
import { NAV_ITEMS, type CalcId } from "@/lib/navItems";

const ICON_MAP: Record<string, LucideIcon> = {
  Ruler,
  UtensilsCrossed,
  Landmark,
  CalendarDays,
  Tag,
  Fuel,
  Users,
};

interface NavProps {
  active: CalcId;
  onChange: (id: CalcId) => void;
}

/* Desktop sidebar */
export function Sidebar({ active, onChange }: NavProps) {
  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 border-r pt-4 pb-6 gap-1 overflow-y-auto"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.icon];
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-left transition-all"
            style={{
              background: isActive ? "var(--accent)" : "transparent",
              color: isActive ? "#fff" : "var(--foreground)",
            }}
          >
            <Icon size={16} className="shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{item.label}</span>
              {!isActive && (
                <span
                  className="text-xs truncate"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {item.description}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </aside>
  );
}

/* Mobile bottom navigation */
export function BottomNav({ active, onChange }: NavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex items-center justify-around px-1 py-1"
      style={{
        background: "var(--card)",
        borderColor: "var(--card-border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.icon];
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl min-w-0 transition-all"
            style={{ color: isActive ? "var(--accent)" : "var(--muted-foreground)" }}
          >
            <Icon size={18} className="shrink-0" />
            <span className="text-[10px] font-medium truncate max-w-[48px] text-center">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
