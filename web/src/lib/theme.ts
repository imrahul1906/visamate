// src/lib/theme.ts
//
// Single source of truth for all design tokens used across the app.
// Import this wherever you need colors, typography, or spacing — never
// redeclare the palette locally again.
//
// Usage:
//   import { T, font, radius, shadow } from "@/lib/theme";
//   style={{ background: T.surface, color: T.text }}

// ─────────────────────────────────────────────────────────────
// Core palette — dark navy
// ─────────────────────────────────────────────────────────────

export const T = {
  // Backgrounds
  bg: "var(--vm-bg)",
  surface: "var(--vm-surface)",
  surface2: "var(--vm-surface2)",
  surface3: "var(--vm-surface3)",

  // Borders
  border: "var(--vm-border)",
  border2: "var(--vm-border2)",

  // Brand — indigo
  indigo: "var(--vm-indigo)",
  indigoLight: "var(--vm-indigo-light)",
  indigoMid: "var(--vm-indigo-mid)",
  indigoGlow: "var(--vm-indigo-glow)",

  // Accent — purple (wizard / button gradient)
  purple: "var(--vm-purple)",
  purpleLight: "var(--vm-purple-light)",
  purpleSoft: "var(--vm-purple-soft)",
  purpleBg: "var(--vm-purple-bg)",
  purpleBgMuted: "var(--vm-purple-bg-muted)",
  purpleBorder: "var(--vm-purple-border)",
  purpleBorderSoft: "var(--vm-purple-border-soft)",
  purpleIconBg: "var(--vm-purple-icon-bg)",
  purpleShadow: "var(--vm-purple-shadow)",
  purpleGradient: "var(--vm-purple-gradient)",
  purpleGradientLight: "var(--vm-purple-gradient-light)",

  // Text
  text: "var(--vm-text)",
  muted: "var(--vm-muted)",
  muted2: "var(--vm-muted-2)",

  // Semantic — green (success / uploaded)
  green: "var(--vm-green)",
  greenDark: "var(--vm-green-dark)",
  greenBg: "var(--vm-green-bg)",
  greenBorder: "var(--vm-green-border)",

  // Semantic — amber (warning / tips)
  amber: "var(--vm-amber)",
  amberBg: "var(--vm-amber-bg)",
  amberBorder: "var(--vm-amber-border)",

  // Semantic — blue (info / zip)
  blue: "var(--vm-blue)",
  blueBg: "var(--vm-blue-bg)",
  blueBorder: "var(--vm-blue-border)",

  // Semantic — red (error / remove)
  red: "var(--vm-red)",
  redBg: "var(--vm-red-bg)",
  redBorder: "var(--vm-red-border)",
} as const;

// ─────────────────────────────────────────────────────────────
// Typography
// ─────────────────────────────────────────────────────────────

export const font = {
  sans: "var(--font-dm-sans), 'DM Sans', sans-serif",
  serif: "var(--font-dm-serif-display), 'DM Serif Display', serif",
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
  ::-webkit-scrollbar-thumb { background: var(--vm-scrollbar-thumb); border-radius: 2px; }

  .vm-scroll-indigo::-webkit-scrollbar-track { background: rgba(99,102,241,0.05); border-radius: 2px; }
  .vm-scroll-indigo::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 2px; }
  .vm-scroll-indigo::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.65); }
  .vm-scroll-indigo { scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.35) transparent; }

  .vm-scroll-hidden::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
  .vm-scroll-hidden { scrollbar-width: none !important; -ms-overflow-style: none !important; }
`;
