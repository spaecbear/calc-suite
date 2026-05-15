export type CalcId =
  | "basic"
  | "unit"
  | "tip"
  | "loan"
  | "date"
  | "discount"
  | "fuel"
  | "split";

export interface NavItem {
  id: CalcId;
  label: string;
  icon: string;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "basic",
    label: "Calculator",
    icon: "Hash",
    description: "Standard calculator with keyboard support",
  },
  {
    id: "unit",
    label: "Unit Convert",
    icon: "Ruler",
    description: "Convert length, weight, temp & more",
  },
  {
    id: "tip",
    label: "Tip",
    icon: "UtensilsCrossed",
    description: "Calculate tip & per-person share",
  },
  {
    id: "loan",
    label: "Loan",
    icon: "Landmark",
    description: "Monthly payments & total interest",
  },
  {
    id: "date",
    label: "Date",
    icon: "CalendarDays",
    description: "Date difference & add/subtract days",
  },
  {
    id: "discount",
    label: "Discount",
    icon: "Tag",
    description: "Final price after discount or markup",
  },
  {
    id: "fuel",
    label: "Fuel Cost",
    icon: "Fuel",
    description: "Trip fuel cost & efficiency",
  },
  {
    id: "split",
    label: "Split Bill",
    icon: "Users",
    description: "Divide expenses among a group",
  },
];
