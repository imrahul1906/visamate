"use client";

// app/documents/DocumentsContent.tsx
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getRequirementsData, getItineraryPlaces } from "@/lib/data/repository";
import type { ItineraryPlacesData } from "@/lib/data/types";

import type { DocumentData, DocumentItem, UploadsMap } from "@/types/document";
import { mapRequirementsToDocumentData } from "./mapRequirements";
import { downloadAllFiles } from "./downloadAllFiles";
import { DocHelper } from "./CategorySection";
import Badge from "@/app/shared/Badge";
import { T, font, scrollbarCSS } from "@/app/shared/theme";

// ─────────────────────────────────────────────────────────────
// Theme tokens imported from shared theme — no local redeclaration.
// Use T.* for colors (e.g. T.indigo, T.green, T.muted) and
// font.sans for the DM Sans font stack.
// Previously declared as const C = { ... } locally.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Props — all optional. When provided they take priority over
// URL search-params, so the component works both as a standalone
// page AND embedded inside WizardAccordion without navigation.
// ─────────────────────────────────────────────────────────────

export interface DocumentsContentProps {
  /** When truthy the "Edit selections" back-button is hidden */
  embedded?: boolean;
  // Selection values injected from the wizard
  country?: string;
  countryName?: string;
  visaType?: string;
  visaTypeName?: string;
  location?: string;
  locationName?: string;
  sponsorship?: string;
  profile?: string;
  // Applicant context for CoverLetterWidget
  applicantName?: string;
  passportNo?: string;
  travelStartDate?: string;
  travelDuration?: number;
  cities?: string[];
}

export default function DocumentsContent(props: DocumentsContentProps = {}) {
  const params = useSearchParams();
  const router = useRouter();

  // Prefer injected props, fall back to URL params
  const country      = props.country      ?? params.get("country")      ?? "";
  const countryName  = props.countryName  ?? params.get("countryName")  ?? params.get("country") ?? "—";
  const visaType     = props.visaType     ?? params.get("visaType")     ?? "";
  const visaTypeName = props.visaTypeName ?? params.get("visaTypeName") ?? params.get("visaType") ?? "—";
  const location     = props.location     ?? params.get("location")     ?? "";
  const locationName = props.locationName ?? params.get("locationName") ?? params.get("location") ?? "—";
  const sponsorship  = props.sponsorship  ?? params.get("sponsorship")  ?? "SELF";
  const profile      = props.profile      ?? params.get("profile")      ?? "";

  // ── Applicant context passed down to CoverLetterWidget ───────
  const coverLetterContext = {
    applicantName:    props.applicantName   ?? "",
    passportNo:       props.passportNo      ?? "",
    sponsorshipType:  sponsorship.toLowerCase() === "sponsored" ? "sponsored" as const : "self" as const,
    applicantProfile: (
      profile.toLowerCase() === "student"       ? "student" :
      profile.toLowerCase() === "self-employed" ? "self-employed" :
      "employed"
    ) as "employed" | "student" | "self-employed",
    travelStartDate:  props.travelStartDate ?? "",
    travelDuration:   props.travelDuration  ?? 14,
    cities:           props.cities          ?? [],
  };

  const [data, setData]                     = useState<DocumentData | null>(null);
  const [itineraryData, setItineraryData]   = useState<ItineraryPlacesData | null>(null);
  const [checked, setChecked]               = useState<Record<string, boolean>>({});
  const [uploads, setUploads]               = useState<UploadsMap>({});
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);

  // ── NEW: focus drawer state ──────────────────────────────────
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isMobile, setIsMobile]       = useState(false);

  // ── Data fetching ────────────────────────────────────────────
  useEffect(() => {
    if (!country || !visaType || !location) {
      setError("Missing required parameters (country, visaType, location).");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([
      getRequirementsData(country, visaType, location),
      getItineraryPlaces(country),
    ])
      .then(([req, itin]) => {
        if (!req) {
          setError(`No requirements found for ${countryName} · ${visaTypeName} · ${locationName}.`);
          setLoading(false);
          return;
        }
        setData(mapRequirementsToDocumentData(req, countryName, visaTypeName, locationName, sponsorship));
        setItineraryData(itin);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load document requirements.");
        setLoading(false);
      });
  }, [country, visaType, location, sponsorship, countryName, visaTypeName, locationName]);

  // ── Mobile detection ─────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Auto-open first unchecked required doc on load ────────────
  useEffect(() => {
    if (data && !activeDocId) {
      const allD = data.categories.flatMap(c => c.documents);
      const first = allD.find(d => !checked[d.id] && d.status === "required");
      if (first) setActiveDocId(first.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // ── Keyboard navigation ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!data) return;
      const allD = data.categories.flatMap(c => c.documents);
      if (e.key === "Escape") {
        setActiveDocId(null);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const idx = allD.findIndex(d => d.id === activeDocId);
        const next = allD[idx + 1];
        if (next) setActiveDocId(next.id);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const idx = allD.findIndex(d => d.id === activeDocId);
        const prev = allD[idx - 1];
        if (prev) setActiveDocId(prev.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data, activeDocId]);

  // ── Handlers ────────────────────────────────────────────────
  const toggleDoc = useCallback((id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleDocAndAdvance = useCallback((id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      // If we just checked it, auto-advance to next unchecked required
      if (next[id] && data) {
        const allD = data.categories.flatMap(c => c.documents);
        const currentIdx = allD.findIndex(d => d.id === id);
        const nextDoc = allD.slice(currentIdx + 1).find(d => !next[d.id] && d.status === "required");
        if (nextDoc) {
          // Use setTimeout to let state settle before updating activeDocId
          setTimeout(() => setActiveDocId(nextDoc.id), 0);
        }
      }
      return next;
    });
  }, [data]);

  const handleUpload = useCallback((docId: string, file: File) => {
    setUploads(prev => ({ ...prev, [docId]: file }));
  }, []);

  const handleRemove = useCallback((docId: string) => {
    setUploads(prev => { const n = { ...prev }; delete n[docId]; return n; });
  }, []);

  const handleItineraryReady = useCallback((docId: string, file: File) => {
    setUploads(prev => ({ ...prev, [docId]: file }));
  }, []);

  const handleDownloadAll = async () => {
    setDownloadingZip(true);
    const allDocs = data?.categories.flatMap(c => c.documents) ?? [];
    await downloadAllFiles(uploads, allDocs);
    setDownloadingZip(false);
  };

  // ── Derived stats ────────────────────────────────────────────
  const allDocs         = data?.categories.flatMap(c => c.documents) ?? [];
  const requiredDocs    = allDocs.filter(d => d.status === "required");
  const totalDone       = allDocs.filter(d => checked[d.id]).length;
  const requiredDone    = requiredDocs.filter(d => checked[d.id]).length;
  const overallPct      = allDocs.length ? (totalDone / allDocs.length) * 100 : 0;
  const uploadCount     = Object.keys(uploads).length;
  const uploadableCount = allDocs.filter(d => !d.noUpload).length;

  // ── Active doc derived ───────────────────────────────────────
  const activeDoc      = allDocs.find(d => d.id === activeDocId) ?? null;
  const activeDocIndex = allDocs.findIndex(d => d.id === activeDocId);
  const activeCategory = activeDoc
    ? data?.categories.find(c => c.documents.some(d => d.id === activeDoc.id))
    : null;

  // ── Helper to get badge label for a doc ─────────────────────
  const getDocBadge = (doc: DocumentItem): string | null => {
    if ((doc.specialWidget === "itinerary") || (doc.specialWidget === "cover_letter")) return "Builder";
    if (doc.specialWidget === "photo_spec") return "Spec";
    if (doc.specialWidget === "visa_form") return "Form";
    if (!doc.noUpload) return "Upload";
    return null;
  };

  // ── Loading state ────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        background: "transparent",
        minHeight: props.embedded ? 200 : "calc(100vh - 56px)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.08)",
            borderTopColor: "#818cf8",
            margin: "0 auto 14px",
            animation: "spin 0.7s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
            Loading your document checklist…
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────
  if (error) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        background: "transparent", padding: 24,
        minHeight: props.embedded ? 200 : "calc(100vh - 56px)",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16,
          border: "1px solid rgba(239,68,68,0.3)",
          padding: "28px 24px", maxWidth: 400, textAlign: "center",
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>
            Could not load documents
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>
            {error}
          </p>
          {!props.embedded && (
            <button
              onClick={() => router.push("/wizard")}
              style={{
                fontSize: 13, fontWeight: 600, color: "#fff",
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────
  const drawerOpen = activeDocId !== null;
const leftWidth = isMobile ? "100%" : drawerOpen ? "280px" : "340px";

  return (
    <div style={{
      background: "transparent",
      paddingTop: props.embedded ? 0 : 72,
      paddingBottom: 80,
      ...(props.embedded ? { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 } : { minHeight: "calc(100vh - 56px)" }),
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }

        ${scrollbarCSS}

        .vm-back-btn {
          display: flex; align-items: center; gap: 6px;
          background: transparent; border: none; cursor: pointer;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.4);
          padding: 0 0 24px;
          transition: color 150ms ease;
          font-family: 'DM Sans', sans-serif;
        }
        .vm-back-btn:hover { color: rgba(255,255,255,0.9); }

        .vm-dl-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.1);
          color: #fff; border: 1px solid rgba(255,255,255,0.2);
          border-radius: 9px; padding: 6px 14px; cursor: pointer;
          font-size: 11px; font-weight: 700;
          backdrop-filter: blur(4px);
          transition: background 200ms ease, border-color 200ms ease;
          font-family: 'DM Sans', sans-serif;
        }
        .vm-dl-btn:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.35);
        }

        .vm-doc-row {
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.02);
  padding: 10px 12px;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;

  display: flex;
  align-items: flex-start;
  gap: 10px;

  min-width: 0;
}
        .vm-doc-row:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.13);
        }
        .vm-doc-row.vm-active {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.45);
        }
        .vm-doc-row.vm-done {
          background: rgba(74,222,128,0.04);
          border-color: rgba(74,222,128,0.2);
        }
        .vm-doc-row.vm-active.vm-done {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.45);
        }
        .vm-doc-row.vm-optional {
          border-style: dashed;
          opacity: 0.72;
        }
        .vm-doc-row.vm-optional:hover {
          opacity: 1;
        }

        .vm-checkbox-btn {
          width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.2);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 160ms ease;
        }
        .vm-checkbox-btn.vm-checked {
          border-color: #6366f1;
          background: #6366f1;
        }

        /* .vm-badge removed — replaced by <Badge> component */

        .vm-drawer-close-btn {
          width: 28px; height: 28px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: background 150ms ease;
          color: rgba(255,255,255,0.5);
        }
        .vm-drawer-close-btn:hover {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.9);
        }

        .vm-mark-done-btn {
          display: inline-flex; align-items: center; gap: 6px;
          border-radius: 8px; padding: 7px 14px; cursor: pointer;
          font-size: 12px; font-weight: 600;
          transition: all 150ms ease;
          font-family: 'DM Sans', sans-serif;
        }
        .vm-mark-done-btn.vm-undone {
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8;
        }
        .vm-mark-done-btn.vm-undone:hover {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.5);
        }
        .vm-mark-done-btn.vm-is-done {
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.3);
          color: #4ade80;
        }
        .vm-mark-done-btn.vm-is-done:hover {
          background: rgba(74,222,128,0.18);
        }

        .vm-nav-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 8px; padding: 7px 13px;
          font-size: 12px; font-weight: 500; cursor: pointer;
          color: rgba(255,255,255,0.55);
          transition: all 150ms ease;
          font-family: 'DM Sans', sans-serif;
        }
        .vm-nav-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.9);
        }
        .vm-nav-btn:disabled {
          opacity: 0.3; cursor: default;
        }

        .vm-stat-card {
          transition: border-color 200ms ease, transform 200ms ease;
        }
        .vm-stat-card:hover {
          border-color: rgba(129,140,248,0.35) !important;
          transform: translateY(-1px);
        }

        @media (max-width: 767px) {
          .vm-two-panel { flex-direction: column !important; }
          .vm-left-panel { width: 100% !important; }
          .vm-right-panel-overlay {
            position: fixed !important;
            top: 0; right: 0;
            width: 100% !important;
            height: 100% !important;
            z-index: 100;
          }
        }
      `}</style>

<div
  style={{
    width: "100%",
    maxWidth: props.embedded ? "1400px" : "1200px",
    margin: "0 auto",
    padding: props.embedded ? "0 32px" : "0 16px",
  }}
>

        {/* ── Back button ── */}
        {!props.embedded && (
          <button className="vm-back-btn" onClick={() => router.push("/wizard")}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Edit selections
          </button>
        )}

        {/* ── Hero header ── */}
        <div style={{
          background: "linear-gradient(135deg, rgba(30,27,75,0.9) 0%, rgba(49,46,129,0.85) 60%, rgba(67,56,202,0.8) 100%)",
          borderRadius: props.embedded ? 14 : 20,
          padding: props.embedded ? "20px 20px 18px" : "28px 28px 24px",
          marginBottom: 16,
          position: "relative", overflow: "hidden",
          border: "1px solid rgba(129,140,248,0.25)",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(129,140,248,0.15) 0%, transparent 70%)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Breadcrumb pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {[
                { icon: "🌏", label: countryName },
                { icon: "📋", label: visaTypeName },
                { icon: "📍", label: locationName },
              ].map(({ icon, label }) => (
                <span key={label} style={{
                  fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)",
                  background: "rgba(255,255,255,0.1)",
                  padding: "4px 12px", borderRadius: 20,
                  display: "flex", alignItems: "center", gap: 5,
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {icon} {label}
                </span>
              ))}
            </div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: props.embedded ? 20 : 26,
              fontWeight: 400, color: "#fff", margin: "0 0 6px", lineHeight: 1.2,
            }}>
              Your Document Checklist
            </h1>
            <p style={{
              fontSize: 13, color: "rgba(255,255,255,0.5)",
              margin: "0 0 20px", lineHeight: 1.5,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {allDocs.length} documents for your {visaTypeName} to {countryName}
            </p>
            {/* Progress bar */}
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "14px 16px",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
                  Overall Progress
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", fontFamily: "'DM Sans', sans-serif" }}>
                  {totalDone} / {allDocs.length} ready
                </span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${overallPct}%`,
                  background: "linear-gradient(90deg, #6366f1, #a5b4fc)",
                  borderRadius: 3, transition: "width 500ms ease",
                  boxShadow: "0 0 10px rgba(99,102,241,0.6)",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                  ✅ {requiredDone}/{requiredDocs.length} required · 📎 {uploadCount}/{uploadableCount} uploaded
                </span>
                {uploadCount > 0 && (
                  <button
                    className="vm-dl-btn"
                    onClick={handleDownloadAll}
                    disabled={downloadingZip}
                    style={{ opacity: downloadingZip ? 0.6 : 1, cursor: downloadingZip ? "default" : "pointer" }}
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    {downloadingZip ? "Preparing…" : `Download All (${uploadCount})`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat strip ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[
            { label: "Required", value: requiredDocs.length,                  accent: "#818cf8", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)" },
            { label: "Optional", value: allDocs.length - requiredDocs.length, accent: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)" },
            { label: "Uploaded", value: uploadCount,                           accent: "#4ade80", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
          ].map(s => (
            <div key={s.label} className="vm-stat-card" style={{
              background: s.bg, borderRadius: 12, padding: "14px 16px",
              border: `1px solid ${s.border}`,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.accent, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{
                fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginTop: 5,
                fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em",
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Upload progress banner ── */}
        {uploadCount > 0 && (
          <div style={{
            background: "rgba(34,197,94,0.08)", borderRadius: 12,
            border: "1px solid rgba(34,197,94,0.2)",
            padding: "12px 16px", marginBottom: 12,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, background: "rgba(34,197,94,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              border: "1px solid rgba(34,197,94,0.25)",
            }}>
              <span style={{ fontSize: 16 }}>📁</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#4ade80", fontFamily: "'DM Sans', sans-serif" }}>
                  Document Folder Ready
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
                  {uploadCount} of {uploadableCount} uploaded
                </span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${(uploadCount / uploadableCount) * 100}%`,
                  background: "linear-gradient(90deg, #22c55e, #4ade80)",
                  borderRadius: 2, transition: "width 400ms ease",
                }} />
              </div>
            </div>
            <button
              onClick={handleDownloadAll}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(22,163,74,0.8)", color: "#fff", border: "1px solid rgba(74,222,128,0.3)",
                borderRadius: 8, padding: "7px 14px", cursor: "pointer",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <svg width="12" height="12" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download ZIP
            </button>
          </div>
        )}

        {/* ── Completion banner ── */}
        {requiredDone === requiredDocs.length && requiredDocs.length > 0 && (
          <div style={{
            background: "rgba(34,197,94,0.08)", border: "1px solid rgba(110,231,183,0.25)",
            borderRadius: 12, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
          }}>
            <span style={{ fontSize: 20 }}>🎉</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                All required documents ready!
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "2px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
                You're ready to submit your visa application.
              </p>
            </div>
          </div>
        )}

        {/* ── TWO-PANEL SHELL ── */}
        <div
  className="vm-two-panel"
  style={{
    display: "flex",
    gap: 0,
    width: "100%",                    // ← always fill parent
    minHeight: props.embedded ? 560 : "calc(100vh - 420px)",
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    border: `1px solid ${T.border}`,
    background: T.surface,
  }}
>
          {/* ── LEFT PANEL — Checklist ── */}
          <div
            className="vm-left-panel"
            style={{
              width: leftWidth,
              flexShrink: 0,
              transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
              borderRight: `1px solid ${T.border}`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              // On mobile, hide left panel when drawer is open
              ...(isMobile && drawerOpen ? { display: "none" } : {}),
            }}
          >
            {/* Compact progress bar */}
            <div style={{
              padding: "14px 14px 10px",
              borderBottom: `1px solid ${T.border}`,
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'DM Sans', sans-serif" }}>
                  Checklist
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.indigoLight, fontFamily: "'DM Sans', sans-serif" }}>
                  {totalDone}/{allDocs.length} ready
                </span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${overallPct}%`,
                  background: `linear-gradient(90deg, ${T.indigo}, ${T.indigoLight})`,
                  borderRadius: 2, transition: "width 400ms ease",
                }} />
              </div>
            </div>

            {/* Scrollable doc list */}
            <div style={{
              flex: 1, overflowY: "auto", padding: "10px 10px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(99,102,241,0.35) transparent",
            }}
              className="vm-left-scroll"
            >
              {data?.categories.map(cat => {
                const catDone  = cat.documents.filter(d => checked[d.id]).length;
                const catTotal = cat.documents.length;
                return (
                  <div key={cat.id} style={{ marginBottom: 18 }}>
                    {/* Category label */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 7, marginBottom: 6,
                    }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: cat.color,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {cat.label}
                      </span>
                      <div style={{ flex: 1, height: 1, background: `${cat.color}25` }} />
                      <span style={{
                        fontSize: 9, fontWeight: 600, color: T.muted,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {catDone}/{catTotal}
                      </span>
                    </div>

                    {/* Doc rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {cat.documents.map(doc => {
                        const isActive  = activeDocId === doc.id;
                        const isDone    = !!checked[doc.id];
                        const isOptional = doc.status !== "required";
                        const badge     = getDocBadge(doc);
                        const isUploaded = !!uploads[doc.id];

                        let rowClass = "vm-doc-row";
                        if (isActive)   rowClass += " vm-active";
                        if (isDone)     rowClass += " vm-done";
                        if (isOptional) rowClass += " vm-optional";

                        return (
                          <div
                            key={doc.id}
                            className={rowClass}
                            onClick={() => setActiveDocId(doc.id)}
                          >
                            {/* Checkbox */}
                            <button
                              className={`vm-checkbox-btn${isDone ? " vm-checked" : ""}`}
                              onClick={e => { e.stopPropagation(); toggleDoc(doc.id); }}
                              aria-label={isDone ? "Mark as not ready" : "Mark as ready"}
                            >
                              {isDone && (
                                <svg width="9" height="9" fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </button>

                            {/* Name */}
                            <span
  style={{
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    fontWeight: 500,
    color: isDone ? T.muted : T.text,
    textDecoration: isDone ? "line-through" : "none",
    lineHeight: 1.3,
    fontFamily: "'DM Sans', sans-serif",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    wordBreak: "break-word",
    paddingRight: 4,
  }}
>
                              {doc.name}
                            </span>

                            {/* Badges */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                              {isUploaded && (
                                <Badge variant="uploaded" theme="dark" />
                              )}
                              {badge && !isUploaded && (
                                <Badge
                                  variant={
                                    badge === "Builder"   ? "builder"
                                    : badge === "Spec"    ? "spec"
                                    : badge === "Form"    ? "form"
                                    : "uploadable"
                                  }
                                  theme="dark"
                                />
                              )}
                            </div>

                            {/* Chevron */}
                            <svg
                              width="12" height="12" fill="none" stroke={isActive ? T.indigoLight : T.muted}
                              strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Footer tip (compact) */}
              <div style={{
                marginTop: 10, padding: "10px 12px",
                background: "rgba(251,191,36,0.06)",
                border: "1px solid rgba(251,191,36,0.15)",
                borderLeft: `3px solid ${T.amber}`,
                borderRadius: 8,
              }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.amber, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>
                  💡 Pro Tip
                </p>
                <p style={{ fontSize: 10, color: T.muted, margin: 0, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                  All photocopies must be on A4 size only. Upload digital copies to create a ready-to-send document folder.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL — Focus Drawer ── */}
          <div
            className={isMobile && drawerOpen ? "vm-right-panel-overlay" : ""}
            style={{
              flex: 1,
minWidth: 0,          // ← prevents flex overflow
  minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              background: isMobile && drawerOpen ? T.surface : "transparent",
            }}
          >
            {!activeDoc ? (
              // Empty state
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                opacity: 0.35, padding: 24, textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
                <p style={{
                  fontSize: 15, fontWeight: 600, color: T.text, margin: "0 0 8px",
                  fontFamily: "'DM Serif Display', serif",
                }}>
                  Select a document
                </p>
                <p style={{
                  fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.7,
                  maxWidth: 260, fontFamily: "'DM Sans', sans-serif",
                }}>
                  Click any item on the left to view details, upload files, or use built-in tools like the itinerary builder.
                </p>
              </div>
            ) : (
              // Drawer content
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

                {/* DRAWER HEADER */}
                <div style={{
                  flexShrink: 0,
                  padding: "16px 18px 14px",
                  borderBottom: `1px solid ${T.border}`,
                  background: T.surface2,
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    {/* Mobile back / Desktop close */}
                    <button
                      className="vm-drawer-close-btn"
                      onClick={() => setActiveDocId(null)}
                      aria-label="Close drawer"
                    >
                      {isMobile ? (
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                      ) : (
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Category label */}
                      {activeCategory && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <div style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: activeCategory.color, flexShrink: 0,
                          }} />
                          <span style={{
                            fontSize: 10, fontWeight: 700,
                            color: activeCategory.color,
                            textTransform: "uppercase", letterSpacing: "0.07em",
                            fontFamily: "'DM Sans', sans-serif",
                          }}>
                            {activeCategory.label}
                          </span>
                        </div>
                      )}
                      {/* Doc title */}
                      <h2 style={{
                        fontSize: 16, fontWeight: 700, color: T.text,
                        margin: "0 0 4px", lineHeight: 1.3,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {activeDoc.name}
                      </h2>
                      {/* Doc description */}
                      <p style={{
                        fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.5,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {activeDoc.description}
                      </p>
                    </div>

                    {/* Mark done button */}
                    <button
                      className={`vm-mark-done-btn ${checked[activeDoc.id] ? "vm-is-done" : "vm-undone"}`}
                      onClick={() => toggleDocAndAdvance(activeDoc.id)}
                      style={{ flexShrink: 0 }}
                    >
                      {checked[activeDoc.id] ? (
                        <>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Done
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" />
                          </svg>
                          Mark done
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tags row */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {(activeDoc.noUpload) && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: "#92400e",
                        background: "#fef3c708", border: "1px solid rgba(251,191,36,0.3)",
                        padding: "3px 9px", borderRadius: 20,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        📌 Hardcopy only
                      </span>
                    )}
                    {!activeDoc.noUpload && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: T.indigoLight,
                        background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
                        padding: "3px 9px", borderRadius: 20,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        📎 Uploadable
                      </span>
                    )}
                    {activeDoc.status !== "required" && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: T.muted,
                        background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`,
                        padding: "3px 9px", borderRadius: 20,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        Optional
                      </span>
                    )}
                    {uploads[activeDoc.id] && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: T.green,
                        background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)",
                        padding: "3px 9px", borderRadius: 20,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        ✓ File uploaded
                      </span>
                    )}
                  </div>
                </div>

                {/* DRAWER BODY */}
                <div
                  className="vm-right-scroll"
                  style={{
                    flex: 1, overflowY: "auto", padding: "18px 18px 12px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(99,102,241,0.35) transparent",
                  }}
                >
                  {/* What you need */}
                  {(activeDoc.notes || activeDoc.tips?.length) && (
                    <div style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${T.border}`,
                      borderRadius: 10, padding: "12px 14px", marginBottom: 16,
                    }}>
                      <p style={{
                        fontSize: 10, fontWeight: 700, color: T.indigoLight,
                        textTransform: "uppercase", letterSpacing: "0.07em",
                        margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif",
                      }}>
                        What you need
                      </p>
                      {activeDoc.notes && (
                        <p style={{ fontSize: 12, color: T.muted2, margin: "0 0 8px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                          ℹ️ {activeDoc.notes}
                        </p>
                      )}
                      {activeDoc.tips?.map((tip, i) => (
                        <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5, alignItems: "flex-start" }}>
                          <span style={{ color: T.indigoLight, marginTop: 1, flexShrink: 0, fontSize: 12 }}>→</span>
                          <span style={{ fontSize: 12, color: T.muted2, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                            {tip}
                          </span>
                        </div>
                      ))}
                      {activeDoc.acceptedFormats && activeDoc.acceptedFormats.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: T.indigoLight, margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'DM Sans', sans-serif" }}>
                            Accepted formats
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {activeDoc.acceptedFormats.map((fmt, i) => (
                              <span key={i} style={{
                                fontSize: 11, color: T.muted2,
                                background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`,
                                padding: "2px 8px", borderRadius: 6,
                                fontFamily: "'DM Sans', sans-serif",
                              }}>
                                {fmt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* THE HELPER — DocHelper handles all specialWidget types */}
                  <DocHelper
                    doc={activeDoc}
                    color={activeCategory?.color ?? T.indigo}
                    uploads={uploads}
                    onUpload={(file) => handleUpload(activeDoc.id, file)}
                    onRemove={() => handleRemove(activeDoc.id)}
                    onItineraryReady={(file) => handleItineraryReady(activeDoc.id, file)}
                    itineraryData={itineraryData}
                    applicantContext={coverLetterContext}
                  />
                </div>

                {/* DRAWER FOOTER — prev/next navigation */}
                <div style={{
                  flexShrink: 0,
                  padding: "12px 18px",
                  borderTop: `1px solid ${T.border}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: T.surface,
                }}>
                  <button
                    className="vm-nav-btn"
                    disabled={activeDocIndex <= 0}
                    onClick={() => {
                      const prev = allDocs[activeDocIndex - 1];
                      if (prev) setActiveDocId(prev.id);
                    }}
                  >
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Previous
                  </button>

                  <span style={{ fontSize: 11, color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>
                    {activeDocIndex + 1} / {allDocs.length}
                  </span>

                  <button
                    className="vm-nav-btn"
                    disabled={activeDocIndex >= allDocs.length - 1}
                    onClick={() => {
                      const next = allDocs[activeDocIndex + 1];
                      if (next) setActiveDocId(next.id);
                    }}
                  >
                    Next
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}