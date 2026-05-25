// visa-overview/overviewPalette.ts
//
// Semantic colour tokens used across all VisaOverviewPanel sub-components.
// No visa-specific knowledge lives here — purely design tokens.


export const PALETTE = {
  indigo:  { text: "var(--vm-indigo)", bg: "var(--vm-indigo-glow)",   border: "var(--vm-border)"  },
  violet:  { text: "var(--vm-purple-soft)", bg: "var(--vm-purple-bg)",   border: "var(--vm-purple-border-soft)"  },
  emerald: { text: "var(--vm-green-dark)", bg: "var(--vm-green-bg)",   border: "var(--vm-green-border)"  },
  amber:   { text: "var(--vm-amber)", bg: "var(--vm-amber-bg)",   border: "var(--vm-amber-border)"  },
  green:   { text: "var(--vm-green-dark)", bg: "var(--vm-green-bg)",   border: "var(--vm-green-border)" },
  red:     { text: "var(--vm-red)", bg: "var(--vm-red-bg)",  border: "var(--vm-red-border)"},
  blue:    { text: "var(--vm-blue)", bg: "var(--vm-blue-bg)",   border: "var(--vm-blue-border)" },
  yellow:  { text: "var(--vm-amber)", bg: "var(--vm-amber-bg)",   border: "var(--vm-amber-border)" },
  ghost:   { text: "var(--vm-muted)",   bg: "var(--vm-trans-white-03)",  border: "var(--vm-trans-white-08)"},
} as const;

export type PaletteKey = keyof typeof PALETTE;
