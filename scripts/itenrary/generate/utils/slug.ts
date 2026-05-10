// visamate/scripts/generate/utils/slug.ts
// ─────────────────────────────────────────────────────────────
// utils/slug.ts
// Generates stable, deterministic slugs/IDs for place names.
// Same input → same output every run.
// ─────────────────────────────────────────────────────────────

/**
 * Converts a place name to a stable slug ID.
 * "Senso-ji Temple, Asakusa" → "sensoji_temple"
 * "Osaka Castle"             → "osaka_castle"
 * "teamLab Borderless"       → "teamlab_borderless"
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    // Remove content in parentheses e.g. "(Golden Pavilion)"
    .replace(/\(.*?\)/g, "")
    // Remove common filler words that don't add ID uniqueness
    .replace(/\b(the|a|an|and|of|&)\b/g, "")
    // Remove special chars, keep letters, numbers, spaces, hyphens
    .replace(/[^\w\s-]/g, "")
    // Collapse hyphens and spaces → underscore
    .replace(/[\s-]+/g, "_")
    // Remove leading/trailing underscores
    .replace(/^_+|_+$/g, "")
    // Collapse double underscores
    .replace(/__+/g, "_");
}

/**
 * Shortens long slugs for readability (max 24 chars).
 * Cuts on word boundary.
 */
export function shortenSlug(slug: string, maxLen = 24): string {
  if (slug.length <= maxLen) return slug;
  const cut = slug.slice(0, maxLen);
  const lastUnderscore = cut.lastIndexOf("_");
  return lastUnderscore > 8 ? cut.slice(0, lastUnderscore) : cut;
}

/** Full pipeline: name → short stable slug */
export function makeId(name: string): string {
  return shortenSlug(toSlug(name));
}
