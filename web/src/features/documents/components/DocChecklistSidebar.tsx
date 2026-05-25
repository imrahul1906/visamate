import { T } from "@/lib/theme";
import type { DocumentData, UploadsMap } from "../../../types/document";
import { DocChecklistRow, getDocBadge } from "./DocChecklistRow";

interface ChecklistPanelProps {
  data: DocumentData;
  activeDocId: string | null;
  checked: Record<string, boolean>;
  uploads: UploadsMap;
  totalDone: number;
  totalDocs: number;
  overallPct: number;
  uploadCount: number;
  uploadableCount: number;
  onSelectDoc: (id: string) => void;
  onToggleDoc: (id: string) => void;
  onDownloadAll: () => void;
}

export function DocChecklistSidebar({
  data,
  activeDocId,
  checked,
  uploads,
  totalDone,
  totalDocs,
  overallPct,
  uploadCount,
  uploadableCount,
  onSelectDoc,
  onToggleDoc,
  onDownloadAll,
}: ChecklistPanelProps) {
  // Default: deep cyan-slate premium look. Progress states shift to traffic-light colors.
  const progressColor = overallPct === 0
    ? {
      bar: "linear-gradient(90deg, var(--vm-blue), var(--vm-indigo-light))",
      accent: "var(--vm-blue)",
      bg: "var(--vm-blue-bg)",
      border: "var(--vm-blue-border)",
      dotColor: "var(--vm-blue)",
      dotGlow: "0 0 8px var(--vm-blue)",
      shimmer: "linear-gradient(90deg, transparent, var(--vm-blue), transparent)",
      isDefault: true,
    }
    : overallPct < 40
      ? { bar: "linear-gradient(90deg, var(--vm-red), var(--vm-amber))", accent: "var(--vm-red)", bg: "var(--vm-red-bg)", border: "var(--vm-red-border)", dotColor: "var(--vm-red)", dotGlow: "0 0 8px var(--vm-red)", shimmer: "none", isDefault: false }
      : overallPct < 75
        ? { bar: "linear-gradient(90deg, var(--vm-amber), var(--vm-amber))", accent: "var(--vm-amber)", bg: "var(--vm-amber-bg)", border: "var(--vm-amber-border)", dotColor: "var(--vm-amber)", dotGlow: "0 0 8px var(--vm-amber)", shimmer: "none", isDefault: false }
        : { bar: "linear-gradient(90deg, var(--vm-green), var(--vm-green))", accent: "var(--vm-green)", bg: "var(--vm-green-bg)", border: "var(--vm-green-border)", dotColor: "var(--vm-green)", dotGlow: "0 0 8px var(--vm-green)", shimmer: "none", isDefault: false };

  return (
    <>
      {/* Checklist header strip */}
      <div style={{
        padding: "13px 14px 11px",
        borderBottom: `1px solid ${progressColor.border}`,
        flexShrink: 0,
        background: progressColor.bg,
        boxShadow: progressColor.isDefault
          ? "inset 0 1px 0 var(--vm-trans-white-12), 0 2px 12px var(--vm-trans-white-05)"
          : "none",
        transition: "background 600ms ease, border-color 600ms ease, box-shadow 600ms ease",
        position: "relative",
      }}>
        {/* Shimmer line */}
        {progressColor.isDefault && (
          <div style={{
            position: "absolute", top: 0, left: "8%", right: "8%", height: 1,
            background: progressColor.shimmer,
            pointerEvents: "none",
          }} />
        )}

        {/* Row 1: label + count */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Glowing dot */}
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: progressColor.dotColor,
              boxShadow: progressColor.dotGlow,
              transition: "background 600ms ease, box-shadow 600ms ease",
            }} />
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: progressColor.isDefault ? "var(--vm-blue)" : "var(--vm-muted-2)",
              textTransform: "uppercase", letterSpacing: "0.09em",
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 600ms ease",
            }}>
              Checklist
            </span>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: progressColor.accent,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.01em",
            transition: "color 600ms ease",
          }}>
            {totalDone}/{totalDocs} ready
          </span>
        </div>

        {/* Row 2: checklist progress bar */}
        <div style={{
          height: 4,
          background: "var(--vm-trans-white-07)",
          borderRadius: 99, overflow: "hidden",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
        }}>
          <div style={{
            height: "100%",
            width: overallPct === 0 ? "100%" : `${overallPct}%`,
            background: progressColor.bar,
            borderRadius: 99,
            opacity: overallPct === 0 ? 0.35 : 1,
            transition: "width 400ms ease, background 600ms ease, opacity 600ms ease",
          }} />
        </div>

        {/* Row 3: upload progress + ZIP — only when files uploaded */}
        {uploadCount > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginTop: 10, paddingTop: 10,
            borderTop: "1px solid var(--vm-border)",
          }}>
            {/* Mini upload bar */}
            <div style={{ height: 3, flex: 1, background: "var(--vm-trans-white-07)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(uploadCount / uploadableCount) * 100}%`,
                background: "linear-gradient(90deg, var(--vm-green-dark), var(--vm-green))",
                borderRadius: 99, transition: "width 400ms ease",
              }} />
            </div>

            {/* Upload count */}
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--vm-green)", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
              {uploadCount}/{uploadableCount} uploaded
            </span>

            {/* ZIP button */}
            <button
              onClick={onDownloadAll}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "var(--vm-green-bg)", color: "var(--vm-green)",
                border: "1px solid var(--vm-green-border)",
                borderRadius: 6, padding: "4px 9px",
                cursor: "pointer", flexShrink: 0,
                fontSize: 10, fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 200ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--vm-green-border)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--vm-green-bg)")}
            >
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              ZIP
            </button>
          </div>
        )}
      </div>

      {/* Scrollable doc list */}
      <div
        className="vm-left-scroll"
        style={{
          flex: 1, overflowY: "auto", padding: "10px 10px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(99,102,241,0.35) transparent",
        }}
      >
        {data.categories.map(cat => {
          const catDone = cat.documents.filter(d => checked[d.id]).length;
          const catTotal = cat.documents.length;

          return (
            <div key={cat.id} style={{ marginBottom: 18 }}>
              {/* Category label */}
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: cat.color,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {cat.label}
                </span>
                <div style={{ flex: 1, height: 1, background: cat.color, opacity: 0.15 }} />
                <span style={{ fontSize: 9, fontWeight: 600, color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>
                  {catDone}/{catTotal}
                </span>
              </div>

              {/* Doc rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {cat.documents.map(doc => (
                  <DocChecklistRow
                    key={doc.id}
                    doc={doc}
                    isActive={activeDocId === doc.id}
                    isDone={!!checked[doc.id]}
                    isUploaded={!!uploads[doc.id]}
                    badge={getDocBadge(doc)}
                    onSelect={() => onSelectDoc(doc.id)}
                    onToggle={(e) => { e.stopPropagation(); onToggleDoc(doc.id); }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}