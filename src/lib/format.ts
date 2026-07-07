import { CURRENCY } from "./constants";

/** Format a whole-rupee integer as a PKR price string, e.g. 2500 -> "Rs 2,500". */
export function formatPrice(amount: number): string {
  const formatted = new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(amount);
  return CURRENCY === "PKR" ? `Rs ${formatted}` : `${CURRENCY} ${formatted}`;
}

/** Short month label, e.g. "Jul 2026". */
export function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
