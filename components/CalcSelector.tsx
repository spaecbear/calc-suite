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
  TrendingUp,
  Sigma,
  Zap,
  FlaskConical,
  Activity,
  Clock,
  MonitorPlay,
  CircuitBoard,
  ChevronDown,
  Lock,
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
  TrendingUp,
  Sigma,
  Zap,
  FlaskConical,
  Activity,
  Clock,
  MonitorPlay,
  CircuitBoard,
};

interface CalcSelectorProps {
  active: CalcId;
  onChange: (id: CalcId) => void;
  isPro?: boolean;
}

export function CalcSelector({ active, onChange, isPro = false }: CalcSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeItem = NAV_ITEMS.find((i) => i.id === active)!;
  const ActiveIcon = ICON_MAP[activeItem.icon];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const select = (id: CalcId) => { onChange(id); setOpen(false); };

  const freeItems = NAV_ITEMS.filter((i) => !i.isPro);
  const proItems  = NAV_ITEMS.filter((i) => i.isPro);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all hover:opacity-80"
        style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
      >
        <ActiveIcon size={15} style={{ color: "var(--accent)" }} />
        <span>{activeItem.label}</span>
        {activeItem.isPro && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md" style={{ background: "var(--accent)", color: "#fff" }}>PRO</span>
        )}
        <ChevronDown size={13} className="transition-transform" style={{ color: "var(--muted-foreground)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 w-72 rounded-2xl border shadow-lg overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
        >
          {/* Free section */}
          <div className="px-3 pt-2.5 pb-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Free</p>
          </div>
          {freeItems.map((item) => <DropdownRow key={item.id} item={item} active={active} onSelect={select} isPro={false} />)}

          {/* Pro section */}
          <div className="px-3 pt-3 pb-1 border-t mt-1" style={{ borderColor: "var(--card-border)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Pro</p>
          </div>
          {proItems.map((item) => <DropdownRow key={item.id} item={item} active={active} onSelect={select} isPro={isPro} />)}
        </div>
      )}
    </div>
  );
}

function DropdownRow({ item, active, onSelect, isPro }: {
  item: typeof NAV_ITEMS[0];
  active: CalcId;
  onSelect: (id: CalcId) => void;
  isPro: boolean;
}) {
  const Icon = ICON_MAP[item.icon];
  const isActive = item.id === active;
  const locked = item.isPro && !isPro;

  return (
    <button
      onClick={() => onSelect(item.id)}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:opacity-80"
      style={{
        background: isActive ? "var(--accent)" : "transparent",
        color: isActive ? "#fff" : locked ? "var(--muted-foreground)" : "var(--foreground)",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      <Icon size={15} className="shrink-0" />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm font-medium">{item.label}</span>
        <span className="text-xs truncate opacity-60">{item.description}</span>
      </div>
      {locked && <Lock size={12} className="shrink-0" style={{ color: "var(--accent)" }} />}
      {item.isPro && !locked && !isActive && (
        <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ background: "var(--accent)", color: "#fff" }}>PRO</span>
      )}
    </button>
  );
}
