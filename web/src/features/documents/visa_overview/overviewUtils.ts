// visa-overview/overviewUtils.ts
//
// Pure formatting and parsing helpers.
// No React, no imports — safe to use anywhere (components, hooks, tests).

import { fmtCurrency, toTitleCase, toProperCase } from "@/lib/utils/formatters";

export { fmtCurrency, toTitleCase, toProperCase };

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
