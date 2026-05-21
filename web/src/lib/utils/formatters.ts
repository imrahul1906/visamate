/**
 * Shared formatters for strings, currency, and other simple display values.
 */

/** Format a numeric amount with currency prefix, using Indian locale for INR-style grouping. */
export function fmtCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString("en-IN")}`;
}

/** Convert a SCREAMING_SNAKE or SCREAMING-SNAKE string to Title Case for display. */
export function toTitleCase(str?: string | null): string {
  if (!str) return "—";
  return str
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Capitalise only the first letter (for centre/place names). */
export function toProperCase(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
