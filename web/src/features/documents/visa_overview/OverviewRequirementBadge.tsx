// visa-overview/OverviewRequirementBadge.tsx
//
// Renders a single boolean process requirement as a scannable pill badge.
//
// Design rationale:
//   "Not required: Biometrics" forces users to read the negation first.
//   "Biometrics · Not Required" is instantly scannable — subject then status.
//   Green check = good news (not required); red cross = heads-up (required).

import { PALETTE } from "./overviewPalette";
import { CheckIcon, CrossIcon } from "./OverviewIcons";

interface OverviewRequirementBadgeProps {
  label: string;
  required: boolean;
}

export function OverviewRequirementBadge({ label, required }: OverviewRequirementBadgeProps) {
  const palette = required ? PALETTE.red : PALETTE.green;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        color: palette.text,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 20,
        padding: "4px 10px",
        fontFamily: "'DM Sans', sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>
        {required ? <CrossIcon /> : <CheckIcon />}
      </span>
      {label}
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: 0.75,
        }}
      >
        · {required ? "Required" : "Not Required"}
      </span>
    </span>
  );
}
