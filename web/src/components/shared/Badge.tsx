// src/app/shared/Badge.tsx
//
// <Badge> — unified pill/chip label used throughout the app.
//
// Replaces the repeated inline badge JSX in:
//   - DocumentsContent.tsx
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
// The `theme` prop switches between "dark" (default, matches DocumentsContent)

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
  // dark theme
  dark: { color: string; bg: string; border: string };
  // light theme
  light: { color: string; bg: string; border: string };
}

const PRESETS: Record<PresetVariant, PresetConfig> = {
  uploaded: {
    label: "✓ Uploaded",
    dark: { color: "#4ade80", bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.25)" },
    light: { color: "#16a34a", bg: "#dcfce7", border: "transparent" },
  },
  uploadable: {
    label: "📎 Uploadable",
    dark: { color: "#818cf8", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)" },
    light: { color: "#6366f1", bg: "rgba(99,102,241,0.08)", border: "transparent" },
  },
  hardcopy: {
    label: "📌 Hardcopy only",
    dark: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.3)" },
    light: { color: "#92400e", bg: "#fef3c7", border: "transparent" },
  },
  optional: {
    label: "Optional",
    dark: { color: "rgba(255,255,255,0.38)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.08)" },
    light: { color: "#9ca3af", bg: "#f3f4f6", border: "transparent" },
  },
  required: {
    label: "Required",
    dark: { color: "#818cf8", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)" },
    light: { color: "#6366f1", bg: "rgba(99,102,241,0.08)", border: "transparent" },
  },
  builder: {
    label: "Builder",
    dark: { color: "#818cf8", bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.25)" },
    light: { color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "transparent" },
  },
  form: {
    label: "Form",
    dark: { color: "#818cf8", bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.25)" },
    light: { color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "transparent" },
  },
  spec: {
    label: "Spec",
    dark: { color: "#818cf8", bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.25)" },
    light: { color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "transparent" },
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
  theme = "dark",
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
    const t = theme === "light" ? preset.light : preset.dark;
    resolvedColor = t.color;
    resolvedBg = t.bg;
    resolvedBorder = t.border;
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