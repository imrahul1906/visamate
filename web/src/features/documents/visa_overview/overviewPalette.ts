// visa-overview/overviewPalette.ts
//
// Semantic colour tokens used across all VisaOverviewPanel sub-components.
// No visa-specific knowledge lives here — purely design tokens.

import { T } from "@/components/shared/theme";

export const PALETTE = {
  indigo:  { text: "#818cf8", bg: "rgba(99,102,241,0.08)",   border: "rgba(99,102,241,0.2)"  },
  violet:  { text: "#a78bfa", bg: "rgba(139,92,246,0.08)",   border: "rgba(139,92,246,0.2)"  },
  emerald: { text: "#34d399", bg: "rgba(52,211,153,0.08)",   border: "rgba(52,211,153,0.2)"  },
  amber:   { text: "#fb923c", bg: "rgba(251,146,60,0.08)",   border: "rgba(251,146,60,0.2)"  },
  green:   { text: "#4ade80", bg: "rgba(74,222,128,0.06)",   border: "rgba(74,222,128,0.18)" },
  red:     { text: "#f87171", bg: "rgba(248,113,113,0.06)",  border: "rgba(248,113,113,0.18)"},
  blue:    { text: "#60a5fa", bg: "rgba(59,130,246,0.06)",   border: "rgba(59,130,246,0.15)" },
  yellow:  { text: "#fbbf24", bg: "rgba(251,191,36,0.06)",   border: "rgba(251,191,36,0.22)" },
  ghost:   { text: T.muted,   bg: "rgba(255,255,255,0.03)",  border: "rgba(255,255,255,0.08)"},
} as const;

export type PaletteKey = keyof typeof PALETTE;
