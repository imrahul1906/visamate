// visamate/scripts/generate/config/durations.ts
// ─────────────────────────────────────────────────────────────
// config/durations.ts
// Default visit durations per place type.
// Edit here to adjust globally.
// ─────────────────────────────────────────────────────────────

import type { PlaceType } from "../types";

export const DURATIONS: Record<PlaceType, string> = {
  Temple:         "2h",
  Shrine:         "1.5h",
  Museum:         "3h",
  Park:           "2h",
  Market:         "1.5h",
  District:       "2h",
  Castle:         "2h",
  Landmark:       "1h",
  Shopping:       "2h",
  Garden:         "2h",
  Memorial:       "1.5h",
  "Theme Park":   "8h",
  Nature:         "1.5h",
  Beach:          "3h",
  Palace:         "2h",
  "Historic Site":"2h",
  "Religious Site":"1.5h",
  Viewpoint:      "1h",
  Zoo:            "3h",
  Aquarium:       "2.5h",
};
