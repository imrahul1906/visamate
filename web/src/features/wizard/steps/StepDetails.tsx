// src/app/wizard/steps/StepDetails.tsx
//
// Writes sponsorshipType + applicantProfile into ApplicantContext on every selection.
// No longer needs onSelect prop — context is the source of truth.
// Kept onSelect as optional for backwards compatibility if a parent still passes it.
//
// Now uses shared <ToggleGroup> from "@/app/shared/ToggleChip" instead of
// the local ToggleGroup / button copy that used to live here.

"use client";

import React from "react";
import { useApplicant } from "@/lib/context/ApplicantContext";
import { T, font } from "@/lib/theme";
import { ToggleGroup } from "@/components/shared/ToggleChip";

interface Props {
  sponsorship?: string | null;
  profile?: string | null;
  compact?: boolean;
  onSelect?: (sponsorship: string | null, profile: string | null) => void;
}

// ─── Icon helpers ─────────────────────────────────────────────

const SelfIcon = (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const SponsoredIcon = (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const EmployedIcon = (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const StudentIcon = (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm-4 6v-7.5l4-2.222" />
  </svg>
);

const SelfEmployedIcon = (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

const sponsorshipOptions = [
  { id: "self",      label: "Self-sponsored",       icon: SelfIcon },
  { id: "sponsored", label: "Sponsored by someone", icon: SponsoredIcon },
];

const profileOptions = [
  { id: "employed",      label: "Employed",       icon: EmployedIcon },
  { id: "student",       label: "Student",        icon: StudentIcon },
  { id: "self-employed", label: "Self-Employed",  icon: SelfEmployedIcon },
];

// ─── Component ────────────────────────────────────────────────

export default function StepDetails({ sponsorship, profile, compact, onSelect }: Props) {
  const { ctx, update } = useApplicant();

  const activeSponsor = sponsorship !== undefined ? sponsorship : ctx.sponsorshipType;
  const activeProfile = profile !== undefined ? profile : ctx.applicantProfile;

  const handleSponsor = (id: string | null) => {
    update({ sponsorshipType: id as typeof ctx.sponsorshipType });
    onSelect?.(id, activeProfile);
  };

  const handleProfile = (id: string | null) => {
    update({ applicantProfile: id as typeof ctx.applicantProfile });
    onSelect?.(activeSponsor, id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {!compact && (
        <div style={{ marginBottom: 4 }}>
          <div style={{ color: T.muted, fontSize: 10, marginBottom: 2 }}>Step 4</div>
          <h2 style={{ color: T.text, fontSize: 16, fontWeight: 500, margin: 0 }}>Tell us about your trip</h2>
          <p style={{ color: T.muted2, fontSize: 12, marginTop: 4 }}>A few more details to find your documents</p>
        </div>
      )}

      <ToggleGroup
        label="Trip sponsorship"
        options={sponsorshipOptions}
        selected={activeSponsor}
        onSelect={handleSponsor}
      />

      <ToggleGroup
        label="Your profile"
        options={profileOptions}
        selected={activeProfile}
        onSelect={handleProfile}
      />

      {(!activeSponsor || !activeProfile) && (
        <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 11, margin: 0, fontFamily: font.sans }}>
          Select both options above to continue
        </p>
      )}
    </div>
  );
}