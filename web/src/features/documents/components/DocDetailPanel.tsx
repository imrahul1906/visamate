import { useRef, useEffect } from "react";
import { T } from "@/lib/theme";
import type { DocumentItem, UploadsMap } from "../../../types/document";
import type { ItineraryPlacesData } from "@/lib/data/types";
import { DocHelper } from "./DocHelper";
import type { PhotoSpec } from "./DocHelper";
import UploadSlot from "./UploadSlot";

interface FocusDrawerProps {
  visibleDoc: DocumentItem;
  activeCategory: { label: string; color: string } | null | undefined;
  uploads: UploadsMap;
  activeDocIndex: number;
  totalDocs: number;
  isMobile: boolean;
  drawerOpacity: number;
  drawerTranslateY: number;
  itineraryData: ItineraryPlacesData | null;
  /** Photo spec for the current doc — resolved from RequirementsData by the parent */
  photoSpec?: PhotoSpec | null;
  onClose: () => void;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onItineraryReady: (file: File) => void;
  onCoverLetterReady: (file: File) => void;
  onSponsorConsentReady: (file: File) => void;
  onPrev: () => void;
  onNext: () => void;
  /** Pre-filled sponsor consent inputs sourced from the wizard/cover letter context */
  sponsorConsentPrefill?: Record<string, string>;
  isOnline?: boolean;
}

export function DocDetailPanel({
  visibleDoc,
  activeCategory,
  uploads,
  activeDocIndex,
  totalDocs,
  isMobile,
  drawerOpacity,
  drawerTranslateY,
  itineraryData,
  photoSpec,
  onClose,
  onUpload,
  onRemove,
  onItineraryReady,
  onCoverLetterReady,
  onSponsorConsentReady,
  onPrev,
  onNext,
  sponsorConsentPrefill,
  isOnline = false,
}: FocusDrawerProps) {
  const shimmerRef = useRef<HTMLDivElement>(null);

  // Fire the border shimmer each time a new document is selected
  useEffect(() => {
    const el = shimmerRef.current;
    if (!el) return;
    el.classList.remove("vm-header-shimmer-run");
    void el.offsetWidth;
    el.classList.add("vm-header-shimmer-run");
  }, [visibleDoc.id]);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      opacity: drawerOpacity,
      transform: `translateY(${drawerTranslateY}px)`,
      transition: "opacity 200ms cubic-bezier(0.4,0,0.2,1), transform 220ms cubic-bezier(0.4,0,0.2,1)",
      willChange: "opacity, transform",
    }}>

      {/* DRAWER HEADER — identity block */}
      <div style={{ flexShrink: 0, padding: "12px 14px 0", background: T.surface2 }}>
        <div
          className="vm-doc-identity-header"
          style={{
            position: "relative",
            borderRadius: 13,
            border: "0.5px solid rgba(255,255,255,0.09)",
            background: "rgba(255,255,255,0.025)",
            isolation: "isolate",
          }}
        >
          {/* dot grid */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            backgroundImage: "linear-gradient(rgba(99,102,241,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.045) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            borderRadius: 13,
          }} />

          {/* radial category glow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            background: `radial-gradient(ellipse 55% 120% at 0% 50%, ${activeCategory?.color ?? "rgba(99,102,241,1)"}12 0%, transparent 70%)`,
            borderRadius: 13,
          }} />

          {/* border shimmer pseudo-element — driven by CSS animation class */}
          <div ref={shimmerRef} className="vm-header-shimmer-border" style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
            borderRadius: 13,
          }} />

          {/* close btn */}
          <button
            className="vm-drawer-close-btn"
            onClick={onClose}
            aria-label="Close drawer"
            style={{ position: "absolute", top: 9, right: 10, zIndex: 3 }}
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

          {/* identity row */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", alignItems: "center", gap: 13,
            padding: "12px 42px 12px 14px",
          }}>
            {/* doc icon */}
            <div style={{
              width: 40, height: 40, borderRadius: 11, flexShrink: 0,
              background: `${activeCategory?.color ?? "rgba(99,102,241,1)"}1a`,
              border: `1px solid ${activeCategory?.color ?? "rgba(99,102,241,1)"}38`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke={activeCategory?.color ?? "rgba(129,140,248,0.9)"}
                strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h6.586a1 1 0 01.707.293l4.414 4.414A1 1 0 0119 8.414V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            {/* text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* crumb */}
              {activeCategory && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 5, marginBottom: 3,
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.07em",
                  textTransform: "uppercase", color: activeCategory.color,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
                  {activeCategory.label}
                </div>
              )}

              {/* title + pills */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h2 style={{
                  fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px",
                  color: "rgba(255,255,255,0.96)", margin: 0, lineHeight: 1,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {visibleDoc.name}
                </h2>

                {visibleDoc.noUpload && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                    color: "rgba(251,191,36,0.9)", background: "rgba(251,191,36,0.1)",
                    border: "1px solid rgba(251,191,36,0.25)", lineHeight: 1,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Hardcopy</span>
                )}
                {!visibleDoc.noUpload && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                    color: "rgba(129,140,248,0.9)", background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.25)", lineHeight: 1,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Uploadable</span>
                )}
                {visibleDoc.specialWidget && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                    color: "rgba(251,146,60,0.9)", background: "rgba(251,146,60,0.1)",
                    border: "1px solid rgba(251,146,60,0.25)", lineHeight: 1,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Builder</span>
                )}
                {visibleDoc.status !== "required" && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                    color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)",
                    border: "0.5px solid rgba(255,255,255,0.12)", lineHeight: 1,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Optional</span>
                )}
                {uploads[visibleDoc.id] && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                    color: "rgba(74,222,128,0.9)", background: "rgba(74,222,128,0.1)",
                    border: "1px solid rgba(74,222,128,0.25)", lineHeight: 1,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>✓ Uploaded</span>
                )}
              </div>

              {/* description */}
              {visibleDoc.description && (
                <p style={{
                  fontSize: 11.5, color: "rgba(255,255,255,0.55)", margin: "4px 0 0",
                  fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {visibleDoc.description}
                </p>
              )}
            </div>
          </div>

          {/* hint strip */}
          {visibleDoc.notes && (
            <div style={{
              position: "relative", zIndex: 2,
              borderTop: "1px solid rgba(99,102,241,0.1)",
              padding: "7px 14px",
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(99,102,241,0.03)",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="rgba(99,102,241,0.65)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
              <span style={{
                fontSize: 11, color: "rgba(255,255,255,0.52)",
                fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4,
              }}>
                {visibleDoc.notes}
              </span>
            </div>
          )}
        </div>

        {/* spacing below identity block, before body */}
        <div style={{ height: 12 }} />
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
        {/* Privacy reassurance banner */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 9,
          background: "rgba(99, 102, 241, 0.05)",
          border: "1px solid rgba(99, 102, 241, 0.15)",
          padding: "10px 12px",
          borderRadius: 10,
          marginBottom: 16,
        }}>
          <svg width="14" height="14" fill="none" stroke="#818cf8" strokeWidth={2} viewBox="0 0 24 24" style={{ marginTop: 1, flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.55)", lineHeight: 1.45, fontFamily: "'DM Sans', sans-serif" }}>
            <strong>100% In-Browser Privacy:</strong> Your details and files remain in local memory. Nothing is sent to or stored on a database.
          </div>
        </div>

        {/* DocHelper handles all specialWidget types — upload slot suppressed here */}
        {visibleDoc.specialWidget && (
          <div style={{ marginBottom: 20 }}>
            <DocHelper
              doc={visibleDoc}
              color={activeCategory?.color ?? T.indigo}
              uploads={uploads}
              photoSpec={photoSpec}
              onUpload={onUpload}
              onRemove={onRemove}
              onItineraryReady={onItineraryReady}
              onCoverLetterReady={onCoverLetterReady}
              onSponsorConsentReady={onSponsorConsentReady}
              itineraryData={itineraryData}
              sponsorConsentPrefill={sponsorConsentPrefill}
              hideUpload
            />
          </div>
        )}

        {/* What you need */}
        {(visibleDoc.notes || visibleDoc.tips?.length) && (
          <div style={{ marginBottom: 20 }}>
            {/* Eyebrow row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(125,211,184,0.08)",
                border: "0.5px solid rgba(125,211,184,0.22)",
                padding: "4px 11px", borderRadius: 20,
              }}>
                <div style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "#5eead4", flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "#5eead4",
                  textTransform: "uppercase", letterSpacing: "0.09em",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  What you need
                </span>
              </div>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Floating card */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.11)",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0,0,0,0.25), 0 12px 28px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.06) inset",
            }}>
              {/* Callout for notes */}
              {visibleDoc.notes && (
                <div style={{
                  padding: "11px 16px 11px 14px",
                  borderBottom: "0.5px solid rgba(255,255,255,0.07)",
                  display: "flex", gap: 10, alignItems: "flex-start",
                  background: "rgba(94,234,212,0.05)",
                  borderLeft: "2.5px solid rgba(94,234,212,0.45)",
                }}>
                  <i className="ti ti-info-circle" aria-hidden="true" style={{ fontSize: 14, color: "#5eead4", flexShrink: 0, marginTop: 2 }} />
                  <span style={{
                    fontSize: 12, color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {visibleDoc.notes}
                  </span>
                </div>
              )}

              {/* Numbered steps */}
              {visibleDoc.tips && visibleDoc.tips.length > 0 && (
                <div style={{ padding: "4px 0" }}>
                  {visibleDoc.tips.map((tip, i) => {
                    const isLast = i === (visibleDoc.tips?.length ?? 0) - 1;
                    let badge: { label: string; color: string; bg: string; border: string } | null = null;
                    let tipText = tip;
                    if (tip.startsWith("[ALT]")) {
                      badge = { label: "Alternative", color: "#c4b5fd", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)" };
                      tipText = tip.slice(5).trimStart();
                    } else if (tip.startsWith("[WARN]")) {
                      badge = { label: "Hardcopy", color: "#fcd34d", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.22)" };
                      tipText = tip.slice(6).trimStart();
                    } else if (tip.startsWith("[REQ]")) {
                      badge = { label: "Required", color: "#6ee7b7", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.22)" };
                      tipText = tip.slice(5).trimStart();
                    }
                    return (
                      <div
                        key={i}
                        className="vm-what-you-need-step"
                        style={{
                          display: "flex", alignItems: "flex-start",
                          padding: "0 16px 0 14px",
                          cursor: "default",
                          transition: "background 160ms ease",
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLDivElement).style.background = "rgba(94,234,212,0.04)";
                          const num = e.currentTarget.querySelector(".step-num") as HTMLElement | null;
                          if (num) {
                            num.style.background = "rgba(94,234,212,0.12)";
                            num.style.borderColor = "rgba(94,234,212,0.4)";
                            num.style.color = "#5eead4";
                          }
                          const conn = e.currentTarget.querySelector(".step-connector") as HTMLElement | null;
                          if (conn) conn.style.background = "rgba(94,234,212,0.2)";
                          const txt = e.currentTarget.querySelector(".step-tip-text") as HTMLElement | null;
                          if (txt) txt.style.color = "rgba(255,255,255,0.95)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.background = "transparent";
                          const num = e.currentTarget.querySelector(".step-num") as HTMLElement | null;
                          if (num) {
                            num.style.background = "rgba(255,255,255,0.05)";
                            num.style.borderColor = "rgba(255,255,255,0.12)";
                            num.style.color = "rgba(255,255,255,0.4)";
                          }
                          const conn = e.currentTarget.querySelector(".step-connector") as HTMLElement | null;
                          if (conn) conn.style.background = "rgba(255,255,255,0.08)";
                          const txt = e.currentTarget.querySelector(".step-tip-text") as HTMLElement | null;
                          if (txt) txt.style.color = "rgba(255,255,255,0.75)";
                        }}
                      >
                        {/* Left: number + connector */}
                        <div style={{
                          display: "flex", flexDirection: "column", alignItems: "center",
                          width: 30, flexShrink: 0, paddingTop: 13,
                        }}>
                          <div
                            className="step-num"
                            style={{
                              width: 22, height: 22, borderRadius: "50%",
                              background: "rgba(255,255,255,0.05)",
                              border: "0.5px solid rgba(255,255,255,0.12)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)",
                              flexShrink: 0,
                              transition: "background 160ms ease, border-color 160ms ease, color 160ms ease",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {i + 1}
                          </div>
                          <div
                            className="step-connector"
                            style={{
                              width: "0.5px", flex: 1, minHeight: 14,
                              background: isLast ? "transparent" : "rgba(255,255,255,0.08)",
                              marginTop: 4,
                              transition: "background 160ms ease",
                            }}
                          />
                        </div>

                        {/* Right: text + optional badge */}
                        <div style={{
                          flex: 1, padding: "11px 0 11px 10px",
                          borderBottom: isLast ? "none" : "0.5px solid rgba(255,255,255,0.05)",
                          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10,
                        }}>
                          <span
                            className="step-tip-text"
                            style={{
                              fontSize: 12.5, color: "rgba(255,255,255,0.75)",
                              lineHeight: 1.6, flex: 1,
                              transition: "color 160ms ease",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {tipText}
                          </span>
                          {badge && (
                            <span style={{
                              flexShrink: 0, marginTop: 2,
                              fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em",
                              padding: "2px 8px", borderRadius: 5,
                              whiteSpace: "nowrap",
                              color: badge.color,
                              background: badge.bg,
                              border: `0.5px solid ${badge.border}`,
                              fontFamily: "'DM Sans', sans-serif",
                            }}>
                              {badge.label}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Accepted formats row */}
              {visibleDoc.acceptedFormats && visibleDoc.acceptedFormats.length > 0 && (
                <div style={{
                  display: "flex", alignItems: "center",
                  borderTop: "0.5px solid rgba(255,255,255,0.07)",
                  padding: "10px 16px 10px 14px",
                  background: "rgba(0,0,0,0.1)",
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase", letterSpacing: "0.09em",
                    marginRight: 10, fontFamily: "'DM Sans', sans-serif",
                    flexShrink: 0,
                  }}>
                    Formats
                  </span>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {visibleDoc.acceptedFormats.map((fmt, i) => {
                      const iconMap: Record<string, string> = {
                        pdf: "ti-file-type-pdf",
                        jpg: "ti-photo", jpeg: "ti-photo",
                        png: "ti-photo",
                        doc: "ti-file-type-doc", docx: "ti-file-type-doc",
                        xls: "ti-file-type-xls", xlsx: "ti-file-type-xls",
                      };
                      const icon = iconMap[fmt.toLowerCase()] ?? "ti-file";
                      return (
                        <div key={i} style={{
                          display: "flex", alignItems: "center", gap: 4,
                          background: "rgba(255,255,255,0.05)",
                          border: "0.5px solid rgba(255,255,255,0.12)",
                          padding: "3px 9px", borderRadius: 6,
                        }}>
                          <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }} />
                          <span style={{
                            fontSize: 10.5, fontWeight: 600,
                            color: "rgba(255,255,255,0.5)",
                            letterSpacing: "0.04em",
                            fontFamily: "'DM Sans', sans-serif",
                          }}>
                            {fmt.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upload slot — flush bottom of card, hairline divider only */}
              {!visibleDoc.noUpload && (
                <div style={{ padding: "0 14px 14px", marginTop: -12 }}>
                  {isOnline && (
                    <div style={{
                      display: "flex", gap: 7, alignItems: "flex-start",
                      background: "rgba(99, 102, 241, 0.05)",
                      border: "1px solid rgba(99, 102, 241, 0.15)",
                      padding: "8px 10px", borderRadius: 8, marginBottom: 10,
                    }}>
                      <svg width="12" height="12" fill="none" stroke="#818cf8" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span style={{ fontSize: 9.5, color: "rgba(255, 255, 255, 0.5)", lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}>
                        <strong>Sandbox Validator:</strong> Uploading here checks formatting and file size rules. You must upload this file again on the official government website.
                      </span>
                    </div>
                  )}
                  <UploadSlot
                    docId={visibleDoc.id}
                    docName={visibleDoc.name}
                    color={activeCategory?.color ?? T.indigo}
                    uploads={uploads}
                    onUpload={(...args) => onUpload(args[1])}
                    onRemove={() => onRemove()}
                    acceptedFormats={visibleDoc.acceptedFormats}
                    maxSizeBytes={visibleDoc.maxSizeBytes}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload slot — standalone card for docs with no What You Need section */}
        {!(visibleDoc.notes || visibleDoc.tips?.length) && !visibleDoc.noUpload && (
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(255,255,255,0.11)",
            borderRadius: 14,
            overflow: "hidden",
            padding: "14px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.25), 0 12px 28px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.06) inset",
          }}>
            {isOnline && (
              <div style={{
                display: "flex", gap: 7, alignItems: "flex-start",
                background: "rgba(99, 102, 241, 0.05)",
                border: "1px solid rgba(99, 102, 241, 0.15)",
                padding: "8px 10px", borderRadius: 8, marginBottom: 10,
              }}>
                <svg width="12" height="12" fill="none" stroke="#818cf8" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span style={{ fontSize: 9.5, color: "rgba(255, 255, 255, 0.5)", lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}>
                  <strong>Sandbox Validator:</strong> Uploading here checks formatting and file size rules. You must upload this file again on the official government website.
                </span>
              </div>
            )}
            <UploadSlot
              docId={visibleDoc.id}
              docName={visibleDoc.name}
              color={activeCategory?.color ?? T.indigo}
              uploads={uploads}
              onUpload={(...args) => onUpload(args[1])}
              onRemove={() => onRemove()}
              noBorder
              acceptedFormats={visibleDoc.acceptedFormats}
              maxSizeBytes={visibleDoc.maxSizeBytes}
            />
          </div>
        )}
      </div>

      {/* DRAWER FOOTER — prev/next navigation */}
      <div style={{
        flexShrink: 0,
        padding: "12px 18px",
        borderTop: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: T.surface,
      }}>
        <button className="vm-nav-btn" disabled={activeDocIndex <= 0} onClick={onPrev}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Previous
        </button>

        <span style={{ fontSize: 11, color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>
          {activeDocIndex + 1} / {totalDocs}
        </span>

        <button className="vm-nav-btn" disabled={activeDocIndex >= totalDocs - 1} onClick={onNext}>
          Next
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}