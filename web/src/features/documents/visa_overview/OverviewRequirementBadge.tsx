// visa-overview/OverviewRequirementBadge.tsx
//
// Renders a single boolean process requirement as a scannable pill badge.
//
// Design rationale:
//   "Not required: Biometrics" forces users to read the negation first.
//   "Biometrics · Not Required" is instantly scannable — subject then status.
//   Green check = good news (not required); red cross = heads-up (required).

import { PALETTE } from "./overviewPalette";
import { CheckIcon, CrossIcon, InfoIcon } from "./OverviewIcons";

interface OverviewRequirementBadgeProps {
  label: string;
  required: boolean;
  status?: "required" | "optional" | "not_required" | "walk_in";
}

export function OverviewRequirementBadge({ label, required, status }: OverviewRequirementBadgeProps) {
  // Resolve resolvedStatus to map old required prop if status is missing
  const resolvedStatus = status ?? (required ? "required" : "not_required");

  let palette: { readonly text: string; readonly bg: string; readonly border: string } = PALETTE.green;
  let IconComponent = CheckIcon;
  let statusText = "Not Required";

  if (resolvedStatus === "required") {
    palette = PALETTE.red;
    IconComponent = CrossIcon;
    statusText = "Required";
  } else if (resolvedStatus === "walk_in") {
    palette = PALETTE.yellow;
    IconComponent = InfoIcon;
    statusText = "Walk-in";
  } else if (resolvedStatus === "optional") {
    palette = PALETTE.yellow;
    IconComponent = InfoIcon;
    statusText = "Optional";
  }

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
        <IconComponent />
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
        · {statusText}
      </span>
    </span>
  );
}
