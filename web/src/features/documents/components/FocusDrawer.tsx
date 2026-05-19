import { T } from "@/components/shared/theme";
import Badge from "@/components/shared/Badge";
import type { DocumentItem, UploadsMap } from "../../../types/document";
import type { ItineraryPlacesData } from "@/lib/data/types";
import { DocHelper } from "../DocumentHelper";
import type { PhotoSpec } from "../DocumentHelper";

interface FocusDrawerProps {
  visibleDoc: DocumentItem;
  activeCategory: { label: string; color: string } | null | undefined;
  checked: Record<string, boolean>;
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
  onToggleDone: (id: string) => void;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onItineraryReady: (file: File) => void;
  onCoverLetterReady: (file: File) => void;
  onSponsorConsentReady: (file: File) => void;
  onPrev: () => void;
  onNext: () => void;
  /** Pre-filled sponsor consent inputs sourced from the wizard/cover letter context */
  sponsorConsentPrefill?: Record<string, string>;
}

export function FocusDrawer({
  visibleDoc,
  activeCategory,
  checked,
  uploads,
  activeDocIndex,
  totalDocs,
  isMobile,
  drawerOpacity,
  drawerTranslateY,
  itineraryData,
  photoSpec,
  onClose,
  onToggleDone,
  onUpload,
  onRemove,
  onItineraryReady,
  onCoverLetterReady,
  onSponsorConsentReady,
  onPrev,
  onNext,
  sponsorConsentPrefill,
}: FocusDrawerProps) {
  const isDone = !!checked[visibleDoc.id];

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      opacity: drawerOpacity,
      transform: `translateY(${drawerTranslateY}px)`,
      transition: "opacity 200ms cubic-bezier(0.4,0,0.2,1), transform 220ms cubic-bezier(0.4,0,0.2,1)",
      willChange: "opacity, transform",
    }}>

      {/* DRAWER HEADER */}
      <div style={{
        flexShrink: 0,
        padding: "16px 18px 14px",
        borderBottom: `1px solid ${T.border}`,
        background: T.surface2,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
          {/* Mobile back / Desktop close */}
          <button className="vm-drawer-close-btn" onClick={onClose} aria-label="Close drawer">
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
              {visibleDoc.name}
            </h2>
            {/* Doc description */}
            <p style={{
              fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.5,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {visibleDoc.description}
            </p>
          </div>
        </div>

        {/* Tags row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {visibleDoc.noUpload && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: "#92400e",
              background: "#fef3c708", border: "1px solid rgba(251,191,36,0.3)",
              padding: "3px 9px", borderRadius: 20,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              📌 Hardcopy only
            </span>
          )}
          {!visibleDoc.noUpload && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: T.indigoLight,
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
              padding: "3px 9px", borderRadius: 20,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              📎 Uploadable
            </span>
          )}
          {visibleDoc.status !== "required" && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: T.muted,
              background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`,
              padding: "3px 9px", borderRadius: 20,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Optional
            </span>
          )}
          {uploads[visibleDoc.id] && (
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
            </div>
          </div>
        )}

        {/* DocHelper handles all specialWidget types */}
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