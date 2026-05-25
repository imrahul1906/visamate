// src/app/shared/Badge.tsx
//
// <Badge> — unified pill/chip label used throughout the app.
//
// Usage:
//   <Badge variant="uploaded" />
//   <Badge variant="optional" />
//   <Badge variant="hardcopy" />
//   <Badge variant="uploadable" />
//   <Badge variant="builder" />
//   <Badge variant="form" />
//   <Badge variant="spec" />
//   <Badge variant="custom" color="#22c55e" bg="rgba(34,197,94,0.1)" border="rgba(34,197,94,0.25)">
//     My label
//   </Badge>
//
// The `theme` prop switches between "dark" (default) and "light".

"use client";

import React from "react";

// ─────────────────────────────────────────────────────────────
// Preset variant definitions
// ─────────────────────────────────────────────────────────────

type PresetVariant =
  | "uploaded"
  | "uploadable"
  | "hardcopy"
  | "optional"
  | "required"
  | "builder"
  | "form"
  | "spec";

interface PresetConfig {
  label: string;
  dark: { color: string; bg: string; border: string };
  light: { color: string; bg: string; border: string };
}

const PRESETS: Record<PresetVariant, PresetConfig> = {
  // ✓ Uploaded — fresh lime green (done / success)
  uploaded: {
    label: "✓ Uploaded",
    dark:  { color: "#a3e635", bg: "rgba(163,230,53,0.12)",  border: "rgba(163,230,53,0.28)"  },
    light: { color: "#3f6212", bg: "rgba(163,230,53,0.15)",  border: "transparent"             },
  },

  // 📎 Uploadable — warm cyan/mint (action / possible)
  uploadable: {
    label: "📎 Uploadable",
    dark:  { color: "#34d399", bg: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.25)"  },
    light: { color: "#065f46", bg: "rgba(52,211,153,0.12)",  border: "transparent"             },
  },

  // 📌 Hardcopy — golden amber (physical / attention)
  hardcopy: {
    label: "📌 Hardcopy only",
    dark:  { color: "#fbbf24", bg: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.30)"  },
    light: { color: "#92400e", bg: "#fef3c7",                border: "transparent"             },
  },

  // Optional — warm stone (low emphasis)
  optional: {
    label: "Optional",
    dark:  { color: "rgba(255,255,255,0.35)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.08)" },
    light: { color: "#9ca3af",                bg: "#f3f4f6",                border: "transparent"            },
  },

  // Required — vivid rose red (urgent / must-have)
  required: {
    label: "Required",
    dark:  { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.28)" },
    light: { color: "#b91c1c", bg: "rgba(254,226,226,0.8)",  border: "transparent"            },
  },

  // Builder — bright orange (creative / build)
  builder: {
    label: "Builder",
    dark:  { color: "#fb923c", bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.28)"  },
    light: { color: "#c2410c", bg: "rgba(254,215,170,0.5)",  border: "transparent"             },
  },

  // Form — hot pink/fuchsia (interactive / fill)
  form: {
    label: "Form",
    dark:  { color: "#f472b6", bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.28)" },
    light: { color: "#9d174d", bg: "rgba(252,231,243,0.8)",  border: "transparent"            },
  },

  // Spec — warm yellow (technical / reference)
  spec: {
    label: "Spec",
    dark:  { color: "#facc15", bg: "rgba(250,204,21,0.10)",  border: "rgba(250,204,21,0.25)"  },
    light: { color: "#854d0e", bg: "rgba(254,249,195,0.8)",  border: "transparent"            },
  },
};

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

type BadgeProps =
  | {
      variant: PresetVariant;
      theme?: "dark" | "light";
      children?: never;
      color?: never;
      bg?: never;
      border?: never;
      className?: string;
      style?: React.CSSProperties;
    }
  | {
      variant: "custom";
      theme?: "dark" | "light";
      children: React.ReactNode;
      color: string;
      bg: string;
      border: string;
      className?: string;
      style?: React.CSSProperties;
    };

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function Badge({
  variant,
  theme: _theme = "dark",
  children,
  color,
  bg,
  border,
  className,
  style,
}: BadgeProps) {
  let resolvedColor: string;
  let resolvedBg: string;
  let resolvedBorder: string;
  let resolvedLabel: React.ReactNode;

  if (variant === "custom") {
    resolvedColor = color;
    resolvedBg = bg;
    resolvedBorder = border;
    resolvedLabel = children;
  } else {
    const preset = PRESETS[variant];
    resolvedColor = `var(--vm-badge-${variant}-color)`;
    resolvedBg = `var(--vm-badge-${variant}-bg)`;
    resolvedBorder = `var(--vm-badge-${variant}-border)`;
    resolvedLabel = preset.label;
  }

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 10,
        fontWeight: 700,
        lineHeight: 1,
        padding: "3px 9px",
        borderRadius: 20,
        border: `1px solid ${resolvedBorder}`,
        background: resolvedBg,
        color: resolvedColor,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        flexShrink: 0,
        ...style,
      }}
    >
      {resolvedLabel}
    </span>
  );
}