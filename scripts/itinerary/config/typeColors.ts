// visamate/scripts/generate/config/typeColors.ts
// ─────────────────────────────────────────────────────────────
// config/typeColors.ts
// Matches the typeColors already in itinerary-places.json
// ─────────────────────────────────────────────────────────────

import type { PlaceType } from "../types";

export const TYPE_COLORS: Record<PlaceType, string> = {
  Temple:         "#8b5cf6",
  Shrine:         "#ec4899",
  Nature:         "#10b981",
  District:       "#f59e0b",
  Market:         "#ef4444",
  Museum:         "#3b82f6",
  Park:           "#22c55e",
  Shopping:       "#f97316",
  Castle:         "#6366f1",
  Landmark:       "#14b8a6",
  Memorial:       "#64748b",
  "Theme Park":   "#e11d48",
  Garden:         "#16a34a",
  Beach:          "#0ea5e9",
  Palace:         "#a855f7",
  "Historic Site":"#78716c",
  "Religious Site":"#f43f5e",
  Viewpoint:      "#06b6d4",
  Zoo:            "#84cc16",
  Aquarium:       "#2dd4bf",
};
