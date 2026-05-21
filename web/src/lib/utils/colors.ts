/**
 * Convert a hex color to "r,g,b" string representation for use inside rgba() CSS rules.
 */
export function hexToRgb(hex: string): string {
  const fallback = "99,102,241"; // Indigo default fallback
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) {
    return fallback;
  }
  const clean = hex.replace("#", "");
  if (clean.length !== 3 && clean.length !== 6) {
    return fallback;
  }
  if (clean.length === 3) {
    const [r, g, b] = clean.split("").map((c) => parseInt(c + c, 16));
    if (isNaN(r) || isNaN(g) || isNaN(b)) return fallback;
    return `${r},${g},${b}`;
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return fallback;
  return `${r},${g},${b}`;
}
