/**
 * SponsorConsentPreview.tsx
 *
 * Inline-editable letter preview for the Sponsor Consent Letter.
 * Uses the same cl-* CSS classes and white "letter sheet" as coverLetterPreview.tsx.
 *
 * [[HINT: ...]] tokens appear as plain text in each textarea so the user
 * knows exactly what to replace — identical to how coverLetterPreview handles it.
 * They are stripped before .docx export via sponsorConsentService.stripHints().
 */

"use client";

import React, { useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// Auto-resize textarea — same pattern as LetterFormFields.tsx
// ─────────────────────────────────────────────────────────────

function InlinePara({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      className="cl-inline-para"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      title="Click to edit"
    />
  );
}

// ─────────────────────────────────────────────────────────────
// State shape
// ─────────────────────────────────────────────────────────────

export interface ConsentPreviewState {
  lHeading: string;
  lToBlock: string;
  lDate: string;
  lSalutation: string;
  lIntro: string;
  lPurpose: string;
  lSponsorship: string;
  lDocuments: string;
  lRequest: string;
  lClosing: string;
  lSigName: string;
  lSigMobile: string;
  lSigPassport: string;
}

// ─────────────────────────────────────────────────────────────
// Shared style constant
// ─────────────────────────────────────────────────────────────

const sigLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: "#777",
  fontFamily: "'DM Sans', sans-serif",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 2,
};

// ─────────────────────────────────────────────────────────────
// Preview component
// ─────────────────────────────────────────────────────────────

interface SponsorConsentPreviewProps {
  state: ConsentPreviewState;
  onChange: (patch: Partial<ConsentPreviewState>) => void;
}

export function SponsorConsentPreview({ state, onChange }: SponsorConsentPreviewProps) {
  const set = (key: keyof ConsentPreviewState) =>
    (v: string) => onChange({ [key]: v });

  return (
    <div className="cl-letter-sheet">

      {/* Address block + Date */}
      <div className="cl-addr-block">
        <textarea
          className="cl-addr-textarea"
          value={state.lToBlock}
          onChange={(e) => set("lToBlock")(e.target.value)}
          rows={4}
          title="Click to edit address"
        />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 13, fontFamily: "'Times New Roman', serif", color: "#1a1a1a", whiteSpace: "nowrap" }}>
            Date:
          </span>
          <input
            className="cl-date-input"
            value={state.lDate}
            onChange={(e) => set("lDate")(e.target.value)}
            title="Click to edit date"
          />
        </div>
      </div>

      {/* Subject / Heading */}
      <input
        className="cl-letter-heading-input"
        value={state.lHeading}
        onChange={(e) => set("lHeading")(e.target.value)}
        title="Click to edit subject"
        style={{ textAlign: "left", fontSize: 13, marginBottom: 12 }}
      />

      {/* Salutation */}
      <input
        className="cl-inline-field cl-inline-field--salutation"
        value={state.lSalutation}
        onChange={(e) => set("lSalutation")(e.target.value)}
        title="Click to edit"
      />

      {/* Body paragraphs — each is one editable textarea, no duplicate overlays */}
      <InlinePara value={state.lIntro} onChange={set("lIntro")} rows={4} />
      <InlinePara value={state.lPurpose} onChange={set("lPurpose")} rows={3} />
      <InlinePara value={state.lSponsorship} onChange={set("lSponsorship")} rows={3} />
      <InlinePara value={state.lDocuments} onChange={set("lDocuments")} rows={3} />
      <InlinePara value={state.lRequest} onChange={set("lRequest")} rows={1} />
      <InlinePara value={state.lClosing} onChange={set("lClosing")} rows={2} />

      {/* Signature block */}
      <div className="cl-sig-block">

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={sigLabelStyle}>Name:</span>
            <input
              className="cl-inline-field cl-inline-field--sig"
              value={state.lSigName}
              onChange={(e) => set("lSigName")(e.target.value)}
              style={{ flex: 1 }}
              title="Click to edit"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={sigLabelStyle}>Mobile:</span>
            <input
              className="cl-inline-field cl-inline-field--sig"
              value={state.lSigMobile}
              onChange={(e) => set("lSigMobile")(e.target.value)}
              style={{ flex: 1 }}
              title="Click to edit"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={sigLabelStyle}>Passport No:</span>
            <input
              className="cl-inline-field cl-inline-field--sig"
              value={state.lSigPassport}
              onChange={(e) => set("lSigPassport")(e.target.value)}
              style={{ flex: 1 }}
              title="Click to edit"
            />
          </div>

        </div>
      </div>
    </div>
  );
}