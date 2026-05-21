// visa-overview/OverviewPrimitives.tsx
//
// Tiny reusable display atoms: SectionLabel, Tag, StatCard.
// No business logic — pure presentational components.

import { T } from "@/lib/theme";
import { PALETTE, type PaletteKey } from "./overviewPalette";

// ── SectionLabel ──────────────────────────────────────────────────────────────

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: T.muted,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        margin: "0 0 10px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {children}
    </p>
  );
}

// ── Tag ───────────────────────────────────────────────────────────────────────

export function Tag({ label, colorKey }: { label: string; colorKey: PaletteKey }) {
  const c = PALETTE[colorKey];
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        color: c.text,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 4,
        padding: "1px 5px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────

export interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  colorKey: PaletteKey;
  /** Optional secondary value shown as a badge below the main value. */
  subValue?: string;
  /** Label for the subValue badge — defaults to "Express". */
  subLabel?: string;
}

export function StatCard({ icon, label, value, colorKey, subValue, subLabel }: StatCardProps) {
  const c = PALETTE[colorKey];
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: c.text,
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.1,
        }}
      >
        {value}
      </span>
      {subValue && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            alignSelf: "flex-start",
            fontSize: 9,
            fontWeight: 700,
            color: PALETTE.emerald.text,
            background: PALETTE.emerald.bg,
            border: `1px solid ${PALETTE.emerald.border}`,
            borderRadius: 4,
            padding: "1px 5px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ⚡ {subLabel ?? "Express"}: {subValue}
        </span>
      )}
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: T.muted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {label}
      </span>
    </div>
  );
}