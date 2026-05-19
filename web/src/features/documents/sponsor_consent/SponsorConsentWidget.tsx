/**
 * SponsorConsentWidget.tsx  (FIXED)
 *
 * Mirrors CoverLetterWidget architecture exactly:
 *   Step "select" — context strip + single "Build" option (same cl-* CSS classes)
 *   Step "builder" — editable letter preview → download .docx
 *
 * Reads live applicant context via useApplicant() so pre-filled values
 * always reflect whatever the user typed in the wizard.
 */

"use client";

import React, { useState, useCallback, useRef } from "react";
import { useApplicant } from "@/lib/context/ApplicantContext";
import {
  seedConsentState,
  type SponsorConsentInputs,
  type SeededConsentState,
  today,
  fmtDate,
} from "./sponsorConsentService";
import { buildSponsorConsentDocx } from "./sponsorConsentDocx";
import {
  SponsorConsentPreview,
  type ConsentPreviewState,
} from "./SponsorConsentPreview";
import { STYLES } from "../cover_letter/coverLetterStyles";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

export interface SponsorConsentWidgetProps {
  onDocxReady?: (file: File) => void;
  color?: string;
}

// ─────────────────────────────────────────────────────────────
// Widget
// ─────────────────────────────────────────────────────────────

export default function SponsorConsentWidget({
  onDocxReady,
  color = "#6366f1",
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

  // ── Build SponsorConsentInputs from live context ─────────

  function makeInputs(): SponsorConsentInputs {
    // Derive travelEndDate from start + duration
    let travelEndDate = "";
    if (ctx.travelStartDate && ctx.travelDuration) {
      const d = new Date(ctx.travelStartDate + "T00:00:00");
      d.setDate(d.getDate() + ctx.travelDuration - 1);
      travelEndDate = d.toISOString().slice(0, 10);
    }

    return {
      sponsorName:          ctx.sponsorName          || "",
      sponsorCity:          ctx.sponsorCity           || ctx.departureCity || "",
      sponsorPassport:      ctx.sponsorPassport       || "",
      sponsorDob:           ctx.sponsorDob            || "",
      sponsorMobile:        ctx.sponsorMobile         || "",
      sponsorAddress:       ctx.sponsorAddress        || "",
      sponsorRelationship:  ctx.sponsorRel            || "",
      applicantName:        ctx.applicantName         || "",
      applicantPassport:    ctx.passportNo            || "",
      applicantDob:         ctx.applicantDob          || "",
      destination:          ctx.country               || "",
      travelStartDate:      ctx.travelStartDate       || "",
      travelEndDate,
      travelDuration:       ctx.travelDuration ? String(ctx.travelDuration) : "",
      purposeOfVisit:       ctx.purpose               || "",
      sponsorAccompanying:  (ctx.sponsorAccompanying as any) === "accompanying"
                              ? "accompanying"
                              : "not_accompanying",
      sponsorshipReason:    ctx.sponsorshipReason     || "",
    };
  }

  // ── Preview state ─────────────────────────────────────────

  const [previewState, setPreviewState] = useState<ConsentPreviewState | null>(null);

  const patchPreview = useCallback((patch: Partial<ConsentPreviewState>) => {
    setPreviewState((prev) => prev ? { ...prev, ...patch } : prev);
  }, []);

  function handleOpenBuilder() {
    // Always re-seed from current context when opening the builder
    const inputs = makeInputs();
    const seeded = seedConsentState(inputs);
    setPreviewState(seeded as ConsentPreviewState);
    gotoStep("builder");
  }

  // ── Derived display values ────────────────────────────────

  const hasMissing = !ctx.applicantName || !ctx.passportNo || !ctx.sponsorName || !ctx.travelStartDate;

  const travelEndDisplay = (() => {
    if (!ctx.travelStartDate || !ctx.travelDuration) return "";
    const d = new Date(ctx.travelStartDate + "T00:00:00");
    d.setDate(d.getDate() + ctx.travelDuration - 1);
    return fmtDate(d.toISOString().slice(0, 10));
  })();

  // ── Download handler ──────────────────────────────────────

  const triggerDownload = async (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  };

  const handleBuilderDownload = async () => {
    if (!previewState) return;
    setBuilding(true);
    try {
      const blob = await buildSponsorConsentDocx(previewState);
      const label = previewState.lSigName
        ? `_${previewState.lSigName.replace(/\s+/g, "_")}`
        : ctx.applicantName
          ? `_${ctx.applicantName.replace(/\s+/g, "_")}`
          : "";
      const filename = `Sponsor_Consent_Letter${label}.docx`;
      await triggerDownload(blob, filename);
      onDocxReady?.(new File([blob], filename, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }));
      setDone(true);
      gotoStep("select");
    } catch (e) {
      console.error("Consent docx build failed:", e);
    } finally {
      setBuilding(false);
    }
  };

  // ── RENDER ────────────────────────────────────────────────

  return (
    <>
      <style>{STYLES}</style>
      <style>{`@keyframes cl-spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── SELECT SCREEN ── */}
      {step === "select" && (
        <div className="cl-select">
          <div className="cl-select-inner">
            <p className="cl-select-sub">
              We'll pre-fill everything we already know — sponsor, applicant, destination, dates — and insert{" "}
              <span style={{ color: "var(--iw-amber)" }}>amber hint callouts</span> for anything missing.
            </p>

            {/* Context summary strip */}
            <div className="cl-context-strip">
              <div className="cl-context-item">
                <span className="cl-context-label">Applicant</span>
                <span className={`cl-context-val${!ctx.applicantName ? " cl-context-val--empty" : ""}`}>
                  {ctx.applicantName || "Not filled yet"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Applicant Passport</span>
                <span className={`cl-context-val${!ctx.passportNo ? " cl-context-val--empty" : ""}`}>
                  {ctx.passportNo || "Not filled yet"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Sponsor Name</span>
                <span className={`cl-context-val${!ctx.sponsorName ? " cl-context-val--empty" : ""}`}>
                  {ctx.sponsorName || "Not provided — add in builder"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Sponsor Passport</span>
                <span className={`cl-context-val${!ctx.sponsorPassport ? " cl-context-val--empty" : ""}`}>
                  {ctx.sponsorPassport || "Not provided — add in builder"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Destination</span>
                <span className={`cl-context-val${!ctx.country ? " cl-context-val--empty" : ""}`}>
                  {ctx.country || "Not filled yet"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Travel Period</span>
                <span className={`cl-context-val${!ctx.travelStartDate ? " cl-context-val--empty" : ""}`}>
                  {ctx.travelStartDate
                    ? `${fmtDate(ctx.travelStartDate)} → ${travelEndDisplay}`
                    : "Not filled yet"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Relationship</span>
                <span className={`cl-context-val${!ctx.sponsorRel ? " cl-context-val--empty" : ""}`}>
                  {ctx.sponsorRel || "Not provided — add in builder"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Sponsor Accompanying</span>
                <span className="cl-context-val">
                  {ctx.sponsorAccompanying === "accompanying"
                    ? "Yes — travelling together"
                    : "No — applicant travels alone"}
                </span>
              </div>
            </div>

            {hasMissing && (
              <p className="cl-context-hint">
                ⚠ Some fields are missing above — fill them in the Itinerary and Trip Details steps first.
                You can still continue and the letter will use placeholders.
              </p>
            )}

            {done && (
              <p style={{
                fontSize: 12, color: "var(--iw-green)",
                background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: 8, padding: "9px 14px", marginBottom: 12,
                fontFamily: "var(--iw-ff-body)",
              }}>
                ✓ Sponsor consent letter downloaded and attached.
              </p>
            )}

            <div className="cl-options">
              <button className="cl-opt cl-opt--dark" onClick={handleOpenBuilder}>
                <div className="cl-opt-left">
                  <div className="cl-opt-icon cl-opt-icon--dark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                      Preview and edit the pre-filled letter directly here, then download a polished .docx.
                    </span>
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>
                <strong>Click any text to edit it directly.</strong>{" "}
                <span style={{ color: "var(--iw-amber)" }}>Amber callouts</span> mark fields that still need your attention.
              </span>
            </div>

            {/* Letter sheet */}
            <SponsorConsentPreview
              state={previewState}
              onChange={patchPreview}
            />

            {/* Download row */}
            <div className="cl-dl-row">
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--iw-text)", fontFamily: "var(--iw-ff-body)" }}>
                  Ready to download?
                </div>
                <div style={{ fontSize: 11, color: "var(--iw-muted)", fontFamily: "var(--iw-ff-body)", marginTop: 2 }}>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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