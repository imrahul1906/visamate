/**
 * SponsorConsentWidget.tsx
 *
 * Mirrors CoverLetterBuilder architecture:
 *   Step "select" — context summary strip + single "Build" action
 *   Step "builder" — inline-editable letter preview → download .docx
 *
 * All fields are sourced from ApplicantContext. The makeInputs() function
 * is the single point of truth for the context → SponsorConsentInputs mapping.
 */

"use client";

import React, { useState, useCallback, useRef } from "react";
import { useApplicant } from "@/lib/context/ApplicantContext";
import {
  seedConsentState,
  type SponsorConsentInputs,
} from "./sponsorConsentService";
import { fmtDate } from "../util/dateFormatting";
import { buildSponsorConsentDocx } from "./sponsorConsentDocx";
import {
  SponsorConsentPreview,
  type ConsentPreviewState,
} from "./SponsorConsentPreview";
import { STYLES } from "../cover_letter/letterStyles";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

export interface SponsorConsentWidgetProps {
  onDocxReady?: (file: File) => void;
  color?: string;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Derive ISO end date from start date + duration (inclusive). */
function deriveEndDate(startDate: string, durationDays: number): string {
  if (!startDate || !durationDays) return "";
  const d = new Date(startDate + "T00:00:00");
  d.setDate(d.getDate() + durationDays - 1);
  return d.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────
// Widget
// ─────────────────────────────────────────────────────────────

export default function SponsorConsentWidget({
  onDocxReady,
}: SponsorConsentWidgetProps) {
  const { ctx } = useApplicant();

  const [step, setStep] = useState<"select" | "builder">("select");
  const stepRef = useRef<string>("select");
  function gotoStep(s: "select" | "builder") {
    stepRef.current = s;
    setStep(s);
  }

  const [building, setBuilding] = useState(false);
  const [done, setDone] = useState(false);

  // ── Map context → SponsorConsentInputs ───────────────────

  function makeInputs(): SponsorConsentInputs {
    return {
      // Sponsor
      sponsorName: ctx.sponsorName,
      sponsorCity: ctx.sponsorCity || ctx.departureCity,
      sponsorPassport: ctx.sponsorPassport,
      sponsorDob: ctx.sponsorDob,
      sponsorMobile: ctx.sponsorMobile,
      sponsorRelationship: ctx.sponsorRel,
      sponsorAccompanying: ctx.sponsorAccompanying === "accompanying"
        ? "accompanying"
        : "not_accompanying",
      sponsorshipReason: ctx.sponsorshipReason,

      // Applicant
      applicantName: ctx.applicantName,
      applicantPassport: ctx.passportNo,
      applicantDob: ctx.applicantDob,

      // Trip
      destination: ctx.country,
      visaTypeName: ctx.visaTypeName,
      travelStartDate: ctx.travelStartDate,
      travelEndDate: deriveEndDate(ctx.travelStartDate, ctx.travelDuration),
      travelDuration: ctx.travelDuration ? String(ctx.travelDuration) : "",
      purposeOfVisit: ctx.purpose,
    };
  }

  // ── Preview state ─────────────────────────────────────────

  const [previewState, setPreviewState] = useState<ConsentPreviewState | null>(null);

  const patchPreview = useCallback((patch: Partial<ConsentPreviewState>) => {
    setPreviewState((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  function handleOpenBuilder() {
    // Always re-seed from current context so changes in the wizard are reflected
    const seeded = seedConsentState(makeInputs());
    setPreviewState(seeded as ConsentPreviewState);
    gotoStep("builder");
  }

  // ── Derived display values ────────────────────────────────

  const hasMissing =
    !ctx.applicantName ||
    !ctx.passportNo ||
    !ctx.sponsorName ||
    !ctx.travelStartDate;

  const travelEndDisplay = ctx.travelStartDate && ctx.travelDuration
    ? fmtDate(deriveEndDate(ctx.travelStartDate, ctx.travelDuration))
    : "";

  // ── Download handler ──────────────────────────────────────

  async function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }

  async function handleBuilderDownload() {
    if (!previewState) return;
    setBuilding(true);
    try {
      const blob = await buildSponsorConsentDocx(previewState);
      const safeName = (previewState.lSigName || ctx.applicantName || "")
        .replace(/\s+/g, "_");
      const filename = `Sponsor_Consent_Letter${safeName ? `_${safeName}` : ""}.docx`;
      await triggerDownload(blob, filename);
      onDocxReady?.(
        new File([blob], filename, {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        })
      );
      setDone(true);
      gotoStep("select");
    } catch (e) {
      console.error("Consent docx build failed:", e);
    } finally {
      setBuilding(false);
    }
  }

  // ── RENDER ────────────────────────────────────────────────

  return (
    <>
      <style>{STYLES}</style>

      {/* ── SELECT SCREEN ── */}
      {step === "select" && (
        <div className="cl-select">
          <div className="cl-select-inner">
            <p className="cl-select-sub">
              We&apos;ll pre-fill everything we already know — sponsor, applicant, destination, dates — and
              insert{" "}
              <span style={{ color: "var(--iw-amber)" }}>amber hint callouts</span> wherever
              information is still missing.
            </p>

            {/* Context summary strip */}
            <div className="cl-context-strip">
              <ContextItem label="Applicant" value={ctx.applicantName} />
              <ContextItem label="Applicant Passport" value={ctx.passportNo} />
              <ContextItem label="Sponsor Name" value={ctx.sponsorName} fallback="Not provided — add in builder" />
              <ContextItem label="Sponsor Passport" value={ctx.sponsorPassport} fallback="Not provided — add in builder" />
              <ContextItem label="Relationship" value={ctx.sponsorRel} fallback="Not provided — add in builder" />
              <ContextItem label="Destination" value={ctx.country} />
              <ContextItem label="Visa Type" value={ctx.visaTypeName} fallback="Not provided" />
              <ContextItem
                label="Travel Period"
                value={
                  ctx.travelStartDate
                    ? `${fmtDate(ctx.travelStartDate)} → ${travelEndDisplay}`
                    : ""
                }
              />
              <ContextItem
                label="Sponsor Accompanying"
                value={
                  ctx.sponsorAccompanying === "accompanying"
                    ? "Yes — travelling together"
                    : ctx.sponsorAccompanying === "staying"
                      ? "No — sponsor stays behind"
                      : ""
                }
              />
            </div>

            {hasMissing && (
              <p className="cl-context-hint">
                ⚠ Some required fields are missing above — fill them in the Itinerary and Trip
                Details steps first. You can still continue; placeholders will be used.
              </p>
            )}

            {done && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--iw-green)",
                  background: "rgba(74,222,128,0.07)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  borderRadius: 8,
                  padding: "9px 14px",
                  marginBottom: 12,
                  fontFamily: "var(--iw-ff-body)",
                }}
              >
                ✓ Sponsor consent letter downloaded and attached.
              </p>
            )}

            <div className="cl-options">
              <button className="cl-opt cl-opt--dark" onClick={handleOpenBuilder}>
                <div className="cl-opt-left">
                  <div className="cl-opt-icon cl-opt-icon--dark">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div className="cl-opt-text">
                    <span className="cl-opt-title">
                      Build Consent Letter
                      <span className="cl-opt-badge">Recommended</span>
                    </span>
                    <span className="cl-opt-desc">
                      Preview and edit the pre-filled letter directly here, then download a
                      polished .docx.
                    </span>
                  </div>
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BUILDER SCREEN ── */}
      {step === "builder" && previewState && (
        <div className="cl-builder">
          {/* Topbar */}
          <div className="cl-topbar">
            <button className="cl-back" onClick={() => gotoStep("select")}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Overview
            </button>
            <div className="cl-topbar-center">
              <span className="cl-topbar-title">Sponsor Consent Letter Preview</span>
              <span className="cl-topbar-sub">Click any field to edit inline</span>
            </div>
          </div>

          {/* Letter body */}
          <div className="cl-letter-body">
            {/* Info strip */}
            <div className="cl-preview-info-strip">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>
                <strong>Click any text to edit it directly.</strong>{" "}
                <span style={{ color: "var(--iw-amber)" }}>Amber callouts</span> mark fields that
                still need your attention.
              </span>
            </div>

            {/* Letter sheet */}
            <SponsorConsentPreview state={previewState} onChange={patchPreview} />

            {/* Download row */}
            <div className="cl-dl-row">
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--iw-text)",
                    fontFamily: "var(--iw-ff-body)",
                  }}
                >
                  Ready to download?
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--iw-muted)",
                    fontFamily: "var(--iw-ff-body)",
                    marginTop: 2,
                  }}
                >
                  All edits are saved above. Click generate to get your .docx.
                </div>
              </div>
              <button
                className="cl-save-btn"
                onClick={handleBuilderDownload}
                disabled={building}
              >
                {building ? (
                  <>
                    <span className="cl-spinner" />
                    Generating…
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download .docx
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Small helper component — avoids repeating the empty-state logic
// ─────────────────────────────────────────────────────────────

function ContextItem({
  label,
  value,
  fallback = "Not filled yet",
}: {
  label: string;
  value: string;
  fallback?: string;
}) {
  const isEmpty = !value;
  return (
    <div className="cl-context-item">
      <span className="cl-context-label">{label}</span>
      <span className={`cl-context-val${isEmpty ? " cl-context-val--empty" : ""}`}>
        {isEmpty ? fallback : value}
      </span>
    </div>
  );
}