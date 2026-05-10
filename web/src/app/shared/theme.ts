// src/app/shared/theme.ts
//
// Single source of truth for all design tokens used across the app.
// Import this wherever you need colors, typography, or spacing — never
// redeclare the palette locally again.
//
// Usage:
//   import { T, font, radius, shadow } from "@/app/shared/theme";
//   style={{ background: T.surface, color: T.text }}

// ─────────────────────────────────────────────────────────────
// Core palette — dark navy
// ─────────────────────────────────────────────────────────────

export const T = {
  // Backgrounds
  bg: "#0d0d1f",
  surface: "#13132a",
  surface2: "#1a1a35",
  surface3: "#20203e",

  // Borders
  border: "rgba(255,255,255,0.08)",
  border2: "rgba(255,255,255,0.14)",

  // Brand — indigo
  indigo: "#6366f1",
  indigoLight: "#818cf8",
  indigoMid: "#a5b4fc",
  indigoGlow: "rgba(99,102,241,0.18)",

  // Accent — purple (wizard / button gradient)
  purple: "#6c5ce7",
  purpleLight: "#8b7cf6",
  purpleSoft: "#a89cef",

  // Text
  text: "#f1f5f9",
  muted: "rgba(255,255,255,0.38)",
  muted2: "rgba(255,255,255,0.55)",

  // Semantic — green (success / uploaded)
  green: "#4ade80",
  greenDark: "#22c55e",
  greenBg: "rgba(74,222,128,0.1)",
  greenBorder: "rgba(74,222,128,0.25)",

  // Semantic — amber (warning / tips)
  amber: "#fbbf24",
  amberBg: "rgba(251,191,36,0.1)",
  amberBorder: "rgba(251,191,36,0.3)",

  // Semantic — red (error / remove)
  red: "#ef4444",
  redBg: "rgba(239,68,68,0.1)",
  redBorder: "rgba(239,68,68,0.3)",
} as const;

// ─────────────────────────────────────────────────────────────
// Typography
// ─────────────────────────────────────────────────────────────

export const font = {
  sans: "'DM Sans', sans-serif",
  serif: "'DM Serif Display', serif",
  // Google Fonts import string — paste inside <style> once per page
  googleImport: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap",
} as const;

// ─────────────────────────────────────────────────────────────
// Radii
// ─────────────────────────────────────────────────────────────

export const radius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

// ─────────────────────────────────────────────────────────────
// Shadows
// ─────────────────────────────────────────────────────────────

export const shadow = {
  indigoBtnIdle: "0 0 0 1px rgba(108,92,231,0.5), 0 3px 14px rgba(108,92,231,0.4)",
  indigoBtnHover: "0 0 0 1px rgba(108,92,231,0.6), 0 6px 22px rgba(108,92,231,0.52)",
  checkmark: "0 2px 8px rgba(108,92,231,0.5)",
  green: "0 0 10px rgba(99,102,241,0.6)",
} as const;

// ─────────────────────────────────────────────────────────────
// Scrollbar CSS — inject once in a <style> tag at the page level
// ─────────────────────────────────────────────────────────────

export const scrollbarCSS = `
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

  .vm-scroll-indigo::-webkit-scrollbar-track { background: rgba(99,102,241,0.05); border-radius: 2px; }
  .vm-scroll-indigo::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 2px; }
  .vm-scroll-indigo::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.65); }
  .vm-scroll-indigo { scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.35) transparent; }

  .vm-scroll-hidden::-webkit-scrollbar { display: none; }
  .vm-scroll-hidden { scrollbar-width: none; -ms-overflow-style: none; }
`;