// src/app/wizard/steps/StepVisaType.tsx
//
// Now uses shared <SelectCard> from "@/app/shared/ToggleChip" instead of
// the bespoke clickable-card JSX that used to live here.
// All icon and description logic is preserved — just the card rendering is shared.

"use client";

import React, { useEffect, useState } from "react";
import { getVisaTypes } from "@/lib/data/repository";
import type { VisaType } from "@/lib/data/types";
import { SelectCard } from "@/components/shared/ToggleChip";

interface Props {
  countryCode: string | null;
  selectedVisa: string | null;
  onSelect: (visa: string | null, name: string | null) => void;
  compact?: boolean;
}

// ─── Icon map ─────────────────────────────────────────────────

const VISA_ICONS: Record<string, React.ReactNode> = {
  TOURIST: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  ),
  BUSINESS: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  TRANSIT: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  ),
  STUDENT: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  WORK: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75m-7.5 6h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v12A2.25 2.25 0 004.5 21z" />
  </svg>
);

const VISA_DESCRIPTIONS: Record<string, string> = {
  TOURIST:  "Tourism, sightseeing, visiting family",
  BUSINESS: "Meetings, conferences, trade",
  TRANSIT:  "Passing through the country",
  STUDENT:  "Studying in educational institutions",
  WORK:     "Employment in the country",
};

// ─── Component ────────────────────────────────────────────────

export default function StepVisaType({ countryCode, selectedVisa, onSelect, compact }: Props) {
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    if (!countryCode) { setVisaTypes([]); return; }
    setLoading(true);
    getVisaTypes(countryCode)
      .then(setVisaTypes)
      .catch(err => {
        console.error(`[StepVisaType] Failed to load visa types for ${countryCode}:`, err);
      })
      .finally(() => setLoading(false));
  }, [countryCode]);

  const emptyStyle: React.CSSProperties = {
    padding:   "28px 0",
    textAlign: "center",
    color:     "rgba(255,255,255,0.3)",
    fontSize:  12,
    fontFamily: "'DM Sans', sans-serif",
  };

  if (!countryCode) return <div style={emptyStyle}>Please select a country first.</div>;
  if (loading)      return <div style={emptyStyle}>Loading visa types…</div>;
  if (visaTypes.length === 0) return <div style={emptyStyle}>No visa types found for the selected country.</div>;

  return (
    <div>
      {!compact && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginBottom: 2 }}>Step 2</div>
          <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 500, margin: 0 }}>Select Visa Type</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 4 }}>What type of visa do you need?</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visaTypes.map((option) => {
          const isActive    = selectedVisa === option.code;
          const icon        = VISA_ICONS[option.code.toUpperCase()] ?? DEFAULT_ICON;
          const description =
            VISA_DESCRIPTIONS[option.code.toUpperCase()] ??
            option.category?.replace(/_/g, " ").toLowerCase() ??
            "";

          return (
            <SelectCard
              key={option.id}
              id={option.code}
              label={option.name}
              description={description}
              icon={icon}
              selected={isActive}
              onSelect={(code) => onSelect(isActive ? null : code, isActive ? null : option.name)}
            />
          );
        })}
      </div>
    </div>
  );
}