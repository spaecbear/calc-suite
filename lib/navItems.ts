export type CalcId =
  // Free
  | "basic"
  | "unit"
  | "tip"
  | "loan"
  | "date"
  | "discount"
  | "fuel"
  | "split"
  // Pro
  | "derivative"
  | "integral"
  | "ohm"
  | "scientific"
  | "bmi"
  | "compound"
  | "timezone"
  | "projector"
  | "circuit";

export interface NavItem {
  id: CalcId;
  label: string;
  icon: string;
  description: string;
  isPro?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  // ── Free ──────────────────────────────────────────────
  { id: "basic",    label: "Calculator",   icon: "Hash",          description: "Standard calculator with keyboard support" },
  { id: "unit",     label: "Unit Convert", icon: "Ruler",         description: "Convert length, weight, temp & more" },
  { id: "tip",      label: "Tip",          icon: "UtensilsCrossed", description: "Calculate tip & per-person share" },
  { id: "loan",     label: "Loan",         icon: "Landmark",      description: "Monthly payments & total interest" },
  { id: "date",     label: "Date",         icon: "CalendarDays",  description: "Date difference & add/subtract days" },
  { id: "discount", label: "Discount",     icon: "Tag",           description: "Final price after discount or markup" },
  { id: "fuel",     label: "Fuel Cost",    icon: "Fuel",          description: "Trip fuel cost & efficiency" },
  { id: "split",    label: "Split Bill",   icon: "Users",         description: "Divide expenses among a group" },

  // ── Pro ───────────────────────────────────────────────
  { id: "derivative", label: "Derivative",        icon: "TrendingUp",   description: "Symbolic differentiation with rules",       isPro: true },
  { id: "integral",   label: "Integral",          icon: "Sigma",        description: "Definite integral & area under curve",      isPro: true },
  { id: "ohm",        label: "Ohm's Law",         icon: "Zap",          description: "Solve V, I, R, P from any two values",      isPro: true },
  { id: "scientific", label: "Scientific",        icon: "FlaskConical", description: "sin/cos/tan/log/ln/√ with deg & rad",        isPro: true },
  { id: "bmi",        label: "BMI",               icon: "Activity",     description: "Body mass index with health categories",    isPro: true },
  { id: "compound",   label: "Compound Interest", icon: "TrendingUp",   description: "Growth over time with compounding",         isPro: true },
  { id: "timezone",   label: "Time Zone",         icon: "Clock",        description: "Time difference & overlap between zones",   isPro: true },
  { id: "projector",  label: "Projector",         icon: "MonitorPlay",  description: "Throw ratio, screen size & image dims",     isPro: true },
  { id: "circuit",    label: "Circuit Load",      icon: "CircuitBoard", description: "Total amps, breaker size & wire gauge",     isPro: true },
];

export const FREE_IDS: CalcId[] = NAV_ITEMS.filter((i) => !i.isPro).map((i) => i.id);
export const PRO_IDS: CalcId[]  = NAV_ITEMS.filter((i) => i.isPro).map((i) => i.id);
