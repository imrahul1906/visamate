// src/app/shared/ToggleChip.tsx
//
// Two complementary components extracted from StepDetails + StepVisaType:
//
//  <ToggleChip>   — compact pill toggle (StepDetails sponsorship / profile chips)
//  <SelectCard>   — larger card with icon + description + radio dot (StepVisaType rows)
//
// Both work as controlled components. Parent owns `selected` state.
//
// Usage — ToggleChip:
//   <ToggleChip
//     id="self"
//     label="Self-sponsored"
//     icon={<SomeIcon />}
//     selected={selected === "self"}
//     onSelect={() => setSelected(selected === "self" ? null : "self")}
//   />
//
// Usage — SelectCard:
//   <SelectCard
//     id="TOURIST"
//     label="Tourist Visa"
//     description="Tourism, sightseeing, visiting family"
//     icon={<SomeIcon />}
//     selected={selected === "TOURIST"}
//     onSelect={() => onSelect(selected === "TOURIST" ? null : "TOURIST")}
//   />
//
// Usage — ToggleGroup (convenience wrapper):
//   <ToggleGroup
//     label="Trip sponsorship"
//     options={[{ id, label, icon }]}
//     selected={selected}
//     onSelect={setSelected}
//   />

"use client";

import React, { useState } from "react";
import { T, font } from "@/components/shared/theme";

// ─────────────────────────────────────────────────────────────
// ToggleChip — compact pill button (from StepDetails)
// ─────────────────────────────────────────────────────────────

interface ToggleChipProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function ToggleChip({ id, label, icon, selected, onSelect, disabled }: ToggleChipProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 13px",
        borderRadius: 10,
        border: selected
          ? `0.5px solid ${T.purpleBorder}`
          : hovered
            ? `0.5px solid ${T.purpleBorderSoft}`
            : `0.5px solid ${T.border}`,
        background: selected
          ? T.purpleBg
          : hovered
            ? "rgba(255,255,255,0.07)"
            : "rgba(255,255,255,0.04)",
        color: selected ? T.purpleSoft : hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.5)",
        fontSize: 12,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
        fontFamily: font.sans,
        whiteSpace: "nowrap",
      }}
    >
      {icon && (
        <span style={{ color: selected ? T.purpleSoft : T.muted, display: "flex", alignItems: "center" }}>
          {icon}
        </span>
      )}
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// ToggleGroup — wraps multiple ToggleChips under a label
// Mirrors the existing ToggleGroup in StepDetails exactly,
// but now lives here so any step can import it.
// ─────────────────────────────────────────────────────────────

interface ToggleGroupOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface ToggleGroupProps {
  label: string;
  options: ToggleGroupOption[];
  selected: string | null;
  /** Receives the id. If toggling off is supported, parent can clear by comparing. */
  onSelect: (id: string | null) => void;
  /** Allow toggling the already-selected chip off. Defaults to true. */
  allowDeselect?: boolean;
}

export function ToggleGroup({
  label,
  options,
  selected,
  onSelect,
  allowDeselect = true,
}: ToggleGroupProps) {
  return (
    <div>
      <div
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: 11,
          fontWeight: 500,
          marginBottom: 10,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontFamily: font.sans,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <ToggleChip
              key={opt.id}
              id={opt.id}
              label={opt.label}
              icon={opt.icon}
              selected={isSelected}
              disabled={opt.disabled}
              onSelect={(id) => {
                if (isSelected && allowDeselect) {
                  onSelect(null);
                } else {
                  onSelect(id);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SelectCard — larger clickable card with radio dot (from StepVisaType)
// ─────────────────────────────────────────────────────────────

interface SelectCardProps {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  badge?: string;
}

export function SelectCard({
  id,
  label,
  description,
  icon,
  selected,
  onSelect,
  disabled,
  badge,
}: SelectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      onClick={() => !disabled && onSelect(id)}
      onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) onSelect(id); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 14px",
        borderRadius: 12,
        border: selected
          ? `0.5px solid ${T.purpleBorder}`
          : hovered && !disabled
            ? `0.5px solid ${T.purpleBorderSoft}`
            : `0.5px solid ${T.border}`,
        background: selected
          ? T.purpleBgMuted
          : hovered && !disabled
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.03)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
        outline: "none",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Icon box */}
        {icon && (
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: selected ? T.purpleIconBg : "rgba(255,255,255,0.07)",
              color: selected ? T.purpleSoft : "rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          >
            {icon}
          </div>
        )}

        {/* Text */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                color: selected ? T.text : "rgba(255,255,255,0.75)",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: font.sans,
              }}
            >
              {label}
            </span>
            {badge && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.muted,
                  background: "rgba(255,255,255,0.06)",
                  padding: "1px 6px",
                  borderRadius: 6,
                  fontFamily: font.sans,
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {description && (
            <div
              style={{
                color: T.muted,
                fontSize: 11,
                marginTop: 2,
                fontFamily: font.sans,
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>

      {/* Radio dot */}
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          flexShrink: 0,
          border: selected ? "none" : `1.5px solid ${T.border2}`,
          background: selected ? T.purple : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
          boxShadow: selected ? `0 2px 8px ${T.purpleShadow}` : "none",
        }}
      >
        {selected && (
          <div
            style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }}
          />
        )}
      </div>
    </div>
  );
}