/**
 * Shared date formatting and calculation utilities
 */

const DATE_LOCALE = "en-GB";
const DATE_FORMAT_OPTIONS = {
    day: "numeric" as const,
    month: "long" as const,
    year: "numeric" as const,
};

/**
 * Format an ISO date string (YYYY-MM-DD) as "1 March 2025"
 * Fallback: "[date]" if not provided or invalid
 */
export function fmtDate(dateStr?: string | null, fallback = "[date]"): string {
    if (!dateStr) return fallback;
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr; // Return original if parse fails
    return d.toLocaleDateString(DATE_LOCALE, DATE_FORMAT_OPTIONS);
}

/**
 * Format DOB with specific fallback
 */
export function fmtDob(dateStr?: string | null): string {
    return fmtDate(dateStr, "[DOB]");
}

/**
 * Add (days - 1) to an ISO date string and format the result
 * Example: fmtDateEnd("2025-03-01", 5) = "4 March 2025"
 */
export function fmtDateEnd(iso: string | undefined, days: number): string {
    if (!iso) return "[date]";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    d.setDate(d.getDate() + days - 1);
    return d.toLocaleDateString(DATE_LOCALE, DATE_FORMAT_OPTIONS);
}

/**
 * Today's date formatted as "10 May 2026"
 */
export function today(): string {
    return new Date().toLocaleDateString(DATE_LOCALE, DATE_FORMAT_OPTIONS);
}

/**
 * Format a "YYYY-MM" month string as "June 2025"
 * Returns empty string if input is blank or invalid
 */
export function fmtMonthYear(ym: string): string {
    if (!ym) return "";
    const [year, month] = ym.split("-");
    const y = Number(year);
    const m = Number(month);
    // Guard: both parts must be valid numbers
    if (!year || !month || isNaN(y) || isNaN(m) || m < 1 || m > 12) return "";
    const d = new Date(y, m - 1, 1);
    return d.toLocaleDateString(DATE_LOCALE, { month: "long", year: "numeric" });
}
