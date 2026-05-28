import { useRef, useEffect, useState } from "react";
import { T } from "@/lib/theme";
import type { DocumentItem, UploadsMap, DocumentCategory, AiAuditResult } from "../../../types/document";
import type { ItineraryPlacesData } from "@/lib/data/types";
import { DocHelper } from "./DocHelper";
import type { PhotoSpec } from "./DocHelper";
import UploadSlot from "./UploadSlot";
import Badge from "@/components/shared/Badge";

function getCategoryStyles(id?: string) {
  switch (id) {
    case "COMMON":
      return {
        color: "var(--vm-indigo)",
        bg: "var(--vm-indigo-glow)",
        border: "var(--vm-border)",
      };
    case "SELF_SPONSORED":
      return {
        color: "var(--vm-green-dark)",
        bg: "var(--vm-green-bg)",
        border: "var(--vm-green-border)",
      };
    case "SPONSORED":
      return {
        color: "var(--vm-blue)",
        bg: "var(--vm-blue-bg)",
        border: "var(--vm-blue-border)",
      };
    default:
      return {
        color: "var(--vm-amber)",
        bg: "var(--vm-amber-bg)",
        border: "var(--vm-amber-border)",
      };
  }
}

interface FocusDrawerProps {
  visibleDoc: DocumentItem;
  activeCategory: DocumentCategory | null | undefined;
  uploads: UploadsMap;
  aiResult?: AiAuditResult;
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
  aiResult,
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
  const [helperActive, setHelperActive] = useState(false);

  // Reset helper active state when switching documents
  useEffect(() => {
    setHelperActive(false);
  }, [visibleDoc.id]);

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
      <div style={{ flexShrink: 0, padding: "12px 14px 0", background: "var(--vm-detail-header-bg, var(--vm-surface2))" }}>
        <div
          className="vm-doc-identity-header"
          style={{
            position: "relative",
            borderRadius: 13,
            border: "1px solid var(--vm-detail-header-card-border, var(--vm-border))",
            background: "var(--vm-detail-header-card-bg, var(--vm-trans-white-02))",
            isolation: "isolate",
            boxShadow: "var(--vm-detail-header-card-shadow, none)",
            overflow: "hidden",
          }}
        >
          {/* dot grid */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            backgroundImage: "radial-gradient(var(--vm-detail-grid-color, var(--vm-trans-white-05)) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            borderRadius: 13,
          }} />

          {/* radial category glow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            background: `radial-gradient(ellipse 55% 120% at 0% 50%, ${getCategoryStyles(activeCategory?.id).bg} 0%, transparent 70%)`,
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
              background: getCategoryStyles(activeCategory?.id).bg,
              border: `1px solid ${getCategoryStyles(activeCategory?.id).border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke={getCategoryStyles(activeCategory?.id).color}
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
                  textTransform: "uppercase", color: getCategoryStyles(activeCategory?.id).color,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
                  {activeCategory.label}
                </div>
              )}

              {/* title + pills */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h2 className="vm-detail-doc-title" style={{
                  fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px",
                  color: "var(--vm-text)", margin: 0, lineHeight: 1.3,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {visibleDoc.name}
                </h2>

                {visibleDoc.noUpload && <Badge variant="hardcopy" />}
                {!visibleDoc.noUpload && <Badge variant="uploadable" />}
                {visibleDoc.specialWidget && <Badge variant="builder" />}
                {visibleDoc.status !== "required" && <Badge variant="optional" />}
                {uploads[visibleDoc.id] && <Badge variant="uploaded" />}
              </div>

              {/* description */}
              {visibleDoc.description && (
                <p style={{
                  fontSize: 11.5, color: "var(--vm-detail-desc-color, var(--vm-trans-white-65))", margin: "4px 0 0",
                  fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4,
                  whiteSpace: "normal",
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
              borderTop: "1px solid var(--vm-border)",
              padding: "7px 14px",
              display: "flex", alignItems: "center", gap: 7,
              background: "var(--vm-detail-hint-bg, var(--vm-indigo-glow))",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="var(--vm-indigo)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
              <span style={{
                fontSize: 11, color: "var(--vm-trans-white-65)",
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
        className={helperActive ? "" : "vm-right-scroll"}
        style={helperActive ? {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: 0,
        } : {
          flex: 1,
          overflowY: "auto",
          padding: "18px 18px 12px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(99,102,241,0.35) transparent",
        }}
      >
        {/* Privacy reassurance banner */}
        {!helperActive && (
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 9,
            background: "var(--vm-trans-white-03)",
            border: `1px solid ${T.border}`,
            padding: "10px 12px",
            borderRadius: 10,
            marginBottom: 16,
          }}>
            <svg width="14" height="14" fill="none" stroke="var(--vm-indigo)" strokeWidth={2} viewBox="0 0 24 24" style={{ marginTop: 1, flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <div style={{ fontSize: "11px", color: "var(--vm-trans-white-55)", lineHeight: 1.45, fontFamily: "'DM Sans', sans-serif" }}>
              <strong>100% In-Browser Privacy:</strong> Your details and files remain in local memory. Nothing is sent to or stored on a database.
            </div>
          </div>
        )}

        {/* DocHelper handles all specialWidget types — upload slot suppressed here */}
        {visibleDoc.specialWidget && (
          <div style={{ marginBottom: helperActive ? 0 : 20, flex: helperActive ? 1 : undefined, display: helperActive ? "flex" : undefined, flexDirection: helperActive ? "column" : undefined }}>
            <DocHelper
              doc={visibleDoc}
              color={getCategoryStyles(activeCategory?.id).color}
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
              onHelperToggle={setHelperActive}
            />
          </div>
        )}

        {/* What you need */}
        {!helperActive && (visibleDoc.notes || visibleDoc.tips?.length) && (
          <div style={{ marginBottom: 20 }}>
            {/* Eyebrow row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "var(--vm-trans-white-05)",
                border: "1px solid var(--vm-trans-white-15)",
                padding: "4px 11px", borderRadius: 20,
              }}>
                <div style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "var(--vm-purple)", flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "var(--vm-purple-soft)",
                  textTransform: "uppercase", letterSpacing: "0.09em",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  What you need
                </span>
              </div>
              <div style={{ flex: 1, height: "1px", background: "var(--vm-border)" }} />
            </div>

            {/* Floating card */}
            <div style={{
              background: "var(--vm-surface)",
              border: "1px solid var(--vm-border2)",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "var(--vm-card-shadow)",
              isolation: "isolate",
            }}>
              {/* Callout for notes */}
              {visibleDoc.notes && (
                <div style={{
                  padding: "11px 16px 11px 14px",
                  borderBottom: "1px solid var(--vm-border)",
                  display: "flex", gap: 10, alignItems: "flex-start",
                  background: "var(--vm-trans-white-02)",
                  borderLeft: `2.5px solid ${getCategoryStyles(activeCategory?.id).color}`,
                }}>
                  <i className="ti ti-info-circle" aria-hidden="true" style={{ fontSize: 14, color: getCategoryStyles(activeCategory?.id).color, flexShrink: 0, marginTop: 2 }} />
                  <span style={{
                    fontSize: 12, color: "var(--vm-text)",
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
                      badge = { label: "Alternative", color: "var(--vm-badge-builder-color)", bg: "var(--vm-badge-builder-bg)", border: "var(--vm-badge-builder-border)" };
                      tipText = tip.slice(5).trimStart();
                    } else if (tip.startsWith("[WARN]")) {
                      badge = { label: "Hardcopy", color: "var(--vm-badge-hardcopy-color)", bg: "var(--vm-badge-hardcopy-bg)", border: "var(--vm-badge-hardcopy-border)" };
                      tipText = tip.slice(6).trimStart();
                    } else if (tip.startsWith("[REQ]")) {
                      badge = { label: "Required", color: "var(--vm-badge-uploaded-color)", bg: "var(--vm-badge-uploaded-bg)", border: "var(--vm-badge-uploaded-border)" };
                      tipText = tip.slice(5).trimStart();
                    }
                    return (
                      <div
                        key={i}
                        className="vm-what-you-need-step"
                      >
                        {/* Left: number + connector */}
                        <div style={{
                          display: "flex", flexDirection: "column", alignItems: "center",
                          width: 30, flexShrink: 0, paddingTop: 13,
                        }}>
                          <div className="step-num">
                            {i + 1}
                          </div>
                          <div
                            className="step-connector"
                            style={{
                              background: isLast ? "transparent" : undefined,
                            }}
                          />
                        </div>

                        {/* Right: text + optional badge */}
                        <div style={{
                          flex: 1, padding: "11px 0 11px 10px",
                          borderBottom: isLast ? "none" : "1px solid var(--vm-border)",
                          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10,
                        }}>
                          <span className="step-tip-text">
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
                              border: `1px solid ${badge.border}`,
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

              {/* Upload slot — inside the card, below the tips */}
              {!visibleDoc.noUpload && !helperActive && (
                <div style={{ padding: "14px" }}>
                  {isOnline && (
                    <div style={{
                      display: "flex", gap: 7, alignItems: "flex-start",
                      background: "var(--vm-trans-white-03)",
                      border: `1px solid ${T.border}`,
                      padding: "8px 10px", borderRadius: 8, marginBottom: 10,
                    }}>
                      <svg width="12" height="12" fill="none" stroke="var(--vm-indigo)" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span style={{ fontSize: 9.5, color: "var(--vm-trans-white-55)", lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}>
                        <strong>Sandbox Validator:</strong> Uploading here checks formatting and file size rules. You must upload this file again on the official government website.
                      </span>
                    </div>
                  )}
                  <UploadSlot
                    docId={visibleDoc.id}
                    docName={visibleDoc.name}
                    color={getCategoryStyles(activeCategory?.id).color}
                    uploads={uploads}
                    aiResult={aiResult}
                    onUpload={(...args) => onUpload(args[1])}
                    onRemove={() => onRemove()}
                    acceptedFormats={visibleDoc.acceptedFormats}
                    maxSizeBytes={visibleDoc.maxSizeBytes}
                  />
                </div>
              )}

              {/* Accepted formats row — bottom banner of the card */}
              {visibleDoc.acceptedFormats && visibleDoc.acceptedFormats.length > 0 && (
                <div style={{
                  display: "flex", alignItems: "center",
                  borderTop: "1px solid var(--vm-border)",
                  padding: "10px 16px 10px 14px",
                  background: "var(--vm-trans-white-02)",
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "var(--vm-trans-white-35)",
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
                          background: "var(--vm-trans-white-04)",
                          border: "1px solid var(--vm-trans-white-10)",
                          padding: "3px 9px", borderRadius: 6,
                        }}>
                          <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 12, color: "var(--vm-trans-white-35)" }} />
                          <span style={{
                            fontSize: 10.5, fontWeight: 600,
                            color: "var(--vm-trans-white-55)",
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

        {/* Upload slot — standalone card for docs with no What You Need section */}
        {!helperActive && !(visibleDoc.notes || visibleDoc.tips?.length) && !visibleDoc.noUpload && (
          <div style={{
            background: "var(--vm-surface)",
            border: "1px solid var(--vm-border2)",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "var(--vm-card-shadow)",
            isolation: "isolate",
          }}>
            <div style={{ padding: "14px" }}>
              {isOnline && (
                <div style={{
                  display: "flex", gap: 7, alignItems: "flex-start",
                  background: "var(--vm-trans-white-03)",
                  border: `1px solid ${T.border}`,
                  padding: "8px 10px", borderRadius: 8, marginBottom: 10,
                }}>
                  <svg width="12" height="12" fill="none" stroke="var(--vm-indigo)" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span style={{ fontSize: 9.5, color: "var(--vm-trans-white-55)", lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}>
                    <strong>Sandbox Validator:</strong> Uploading here checks formatting and file size rules. You must upload this file again on the official government website.
                  </span>
                </div>
              )}
              <UploadSlot
                docId={visibleDoc.id}
                docName={visibleDoc.name}
                color={getCategoryStyles(activeCategory?.id).color}
                uploads={uploads}
                aiResult={aiResult}
                onUpload={(...args) => onUpload(args[1])}
                onRemove={() => onRemove()}
                noBorder
                acceptedFormats={visibleDoc.acceptedFormats}
                maxSizeBytes={visibleDoc.maxSizeBytes}
              />
            </div>

            {/* Accepted formats row — bottom banner of the card */}
            {visibleDoc.acceptedFormats && visibleDoc.acceptedFormats.length > 0 && (
              <div style={{
                display: "flex", alignItems: "center",
                borderTop: "1px solid var(--vm-border)",
                padding: "10px 16px 10px 14px",
                background: "var(--vm-trans-white-02)",
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "var(--vm-trans-white-35)",
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
                        background: "var(--vm-trans-white-04)",
                        border: "1px solid var(--vm-trans-white-10)",
                        padding: "3px 9px", borderRadius: 6,
                      }}>
                        <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 12, color: "var(--vm-trans-white-35)" }} />
                        <span style={{
                          fontSize: 10.5, fontWeight: 600,
                          color: "var(--vm-trans-white-55)",
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