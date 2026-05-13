import { T } from "@/components/shared/theme";
import Badge from "@/components/shared/Badge";
import type { DocumentItem, UploadsMap } from "../../../types/document";
import type { ItineraryPlacesData } from "@/lib/data/types";
import { DocHelper } from "../DocumentHelper";

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
  onClose: () => void;
  onToggleDone: (id: string) => void;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onItineraryReady: (file: File) => void;
  onPrev: () => void;
  onNext: () => void;
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
  onClose,
  onToggleDone,
  onUpload,
  onRemove,
  onItineraryReady,
  onPrev,
  onNext,
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

          {/* Mark done button */}
          <button
            className={`vm-mark-done-btn ${isDone ? "vm-is-done" : "vm-undone"}`}
            onClick={() => onToggleDone(visibleDoc.id)}
            style={{ flexShrink: 0 }}
          >
            {isDone ? (
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
            {visibleDoc.notes && (
              <p style={{ fontSize: 12, color: T.muted2, margin: "0 0 8px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                ℹ️ {visibleDoc.notes}
              </p>
            )}
            {visibleDoc.tips?.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5, alignItems: "flex-start" }}>
                <span style={{ color: T.indigoLight, marginTop: 1, flexShrink: 0, fontSize: 12 }}>→</span>
                <span style={{ fontSize: 12, color: T.muted2, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                  {tip}
                </span>
              </div>
            ))}
            {visibleDoc.acceptedFormats && visibleDoc.acceptedFormats.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.indigoLight, margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'DM Sans', sans-serif" }}>
                  Accepted formats
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {visibleDoc.acceptedFormats.map((fmt, i) => (
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

        {/* DocHelper handles all specialWidget types */}
        <DocHelper
          doc={visibleDoc}
          color={activeCategory?.color ?? T.indigo}
          uploads={uploads}
          onUpload={onUpload}
          onRemove={onRemove}
          onItineraryReady={onItineraryReady}
          itineraryData={itineraryData}
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
