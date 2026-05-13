// visa-overview/utils.ts
//
// Pure formatting and parsing helpers.
// No React, no imports — safe to use anywhere (components, hooks, tests).

/** Format a numeric amount with currency prefix, using Indian locale for INR-style grouping. */
export function fmtCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString("en-IN")}`;
}

/**
 * Derive refundability from a note string.
 * Returns true  → explicitly refundable
 *         false → non-refundable
 *         null  → unclear / not mentioned
 */
export function parseRefundability(note?: string | null): boolean | null {
  if (!note) return null;
  const lower = note.toLowerCase();
  if (
    lower.includes("non-refundable") ||
    lower.includes("not refundable") ||
    lower.includes("non refundable")
  )
    return false;
  if (lower.includes("refund")) return true;
  return null;
}

/** Convert a SCREAMING_SNAKE or SCREAMING-SNAKE string to Title Case for display. */
export function toTitleCase(str?: string | null): string {
  if (!str) return "—";
  return str
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Capitalise only the first letter (for centre names). */
export function toProperCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
