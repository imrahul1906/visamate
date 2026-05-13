/**
 * HelperHeader.tsx
 *
 * The sticky header bar for the Form Fill Helper (Step 2).
 * Shows: title, field/section count, progress bar, search input,
 * collapse-all toggle, and expand/collapse chevron button.
 *
 * Purely presentational — all state is threaded via props.
 */

import { T, font } from "@/components/shared/theme";
import type { SectionMap } from "@/features/documents/visa_form/visaFormService";

interface Props {
  isDownloadable: boolean;
  fieldsLoading: boolean;
  helperOpen: boolean;
  setHelperOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sections: SectionMap;
  totalFields: number;
  doneCount: number;
  donePct: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchRef: React.RefObject<HTMLInputElement>;
  collapsedSections: Set<string>;
  setCollapsedSections: React.Dispatch<React.SetStateAction<Set<string>>>;
  accentColor: string;
}

export default function HelperHeader({
  isDownloadable,
  fieldsLoading,
  helperOpen,
  setHelperOpen,
  sections,
  totalFields,
  doneCount,
  donePct,
  searchQuery,
  setSearchQuery,
  searchRef,
  collapsedSections,
  setCollapsedSections,
  accentColor,
}: Props) {
  const sectionNames = Object.keys(sections);
  const allCollapsed = sectionNames.length > 0 && sectionNames.every((s) => collapsedSections.has(s));

  return (
    <div
      style={{
        padding: "12px 18px",
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
        background: T.surface2,
      }}
    >
      {/* Left: title + progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
        {/* Icon + labels */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: T.indigoGlow,
              border: `1px solid rgba(99,102,241,0.25)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" fill="none" stroke={T.indigoLight} strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.text, margin: 0 }}>
              {isDownloadable ? "Step 2 — " : ""}Form Fill Helper
            </p>
            {!fieldsLoading && (
              <p style={{ fontSize: 10, color: T.muted, margin: 0 }}>
                {totalFields} fields across {sectionNames.length || "—"} sections
              </p>
            )}
          </div>
        </div>

        {/* Progress bar + percentage */}
        {!fieldsLoading && totalFields > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 100,
                height: 5,
                background: T.border2,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${donePct}%`,
                  background: accentColor,
                  borderRadius: 3,
                  transition: "width 300ms ease",
                }}
              />
            </div>
            <span style={{ fontSize: 10, color: T.muted, fontFamily: font.sans, whiteSpace: "nowrap" }}>
              {doneCount}/{totalFields}
            </span>
          </div>
        )}
      </div>

      {/* Right: search + toggles */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Search input */}
        {!fieldsLoading && helperOpen && totalFields > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              borderRadius: 7,
              border: `1px solid ${T.border2}`,
              background: T.surface,
            }}
          >
            <svg width="11" height="11" fill="none" stroke={T.muted} strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fields…"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 11,
                color: T.text,
                width: 110,
                fontFamily: font.sans,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: T.muted,
                  fontSize: 14,
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Collapse all sections toggle */}
        {!fieldsLoading && helperOpen && sectionNames.length > 1 && (
          <button
            onClick={() =>
              setCollapsedSections(allCollapsed ? new Set() : new Set(sectionNames))
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              borderRadius: 7,
              border: `1px solid ${T.border2}`,
              background: "transparent",
              color: T.muted2,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: font.sans,
              transition: "all 150ms",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = T.surface3;
              (e.currentTarget as HTMLButtonElement).style.color = T.text;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = T.muted2;
            }}
          >
            {allCollapsed ? "↕ Expand all" : "↕ Collapse all"}
          </button>
        )}

        {/* Helper open/close chevron */}
        <button
          onClick={() => setHelperOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 10px",
            borderRadius: 7,
            border: `1px solid ${T.border2}`,
            background: "transparent",
            color: T.muted2,
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: font.sans,
            transition: "all 150ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = T.surface3;
            (e.currentTarget as HTMLButtonElement).style.color = T.text;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = T.muted2;
          }}
        >
          <svg
            width="11"
            height="11"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            style={{
              transform: helperOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms",
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
          {helperOpen ? "Collapse" : "Expand"}
        </button>
      </div>
    </div>
  );
}
