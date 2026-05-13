"use client";

/**
 * VisaFormWidget.tsx
 *
 * Root compositor. Owns no state of its own — delegates entirely to
 * useVisaFormState and composes the four feature sub-components.
 *
 * Layout structure:
 *   ┌─ FormStepBanner   (Step 1 — download / online CTA)
 *   └─ Step 2 wrapper (only when formFillDataKey is present)
 *        ├─ HelperHeader  (title, progress, search, toggles)
 *        ├─ Loading spinner
 *        ├─ Two-column grid
 *        │    ├─ FieldList   (left panel)
 *        │    └─ FieldDetail (right panel)
 *        └─ All-done banner
 */

import type { DocumentItem } from "@/types/document";
import { T, font } from "@/components/shared/theme";
import { useVisaFormState } from "./useVisaFormState";
import FormStepBanner from "./FormStepBanner";
import HelperHeader from "./HelperHeader";
import FieldList from "./FieldList";
import FieldDetail from "./FieldDetail";

export default function VisaFormWidget({
  doc,
  color,
}: {
  doc: DocumentItem;
  color: string;
}) {
  const state = useVisaFormState(doc);
  const accentColor = color || T.indigo;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: T.surface,
        borderTop: `1px solid ${T.border}`,
        fontFamily: font.sans,
      }}
    >
      {/* Scrollbar styles */}
      <style>{`
        .vfw-left-scroll::-webkit-scrollbar { width: 4px; }
        .vfw-left-scroll::-webkit-scrollbar-track { background: rgba(99,102,241,0.05); border-radius: 2px; }
        .vfw-left-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 2px; }
        .vfw-left-scroll::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.65); }

        .vfw-right-scroll::-webkit-scrollbar { width: 4px; }
        .vfw-right-scroll::-webkit-scrollbar-track { background: rgba(99,102,241,0.05); border-radius: 2px; }
        .vfw-right-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 2px; }
        .vfw-right-scroll::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.65); }
      `}</style>

      {/* ── Step 1: Download / Online banner ── */}
      <FormStepBanner
        doc={doc}
        accentColor={accentColor}
        isDownloadable={state.isDownloadable}
      />

      {/* ── Step 2: Form Fill Helper ── */}
      {doc.form?.formFillDataKey && (
        <div>
          <HelperHeader
            isDownloadable={state.isDownloadable}
            fieldsLoading={state.fieldsLoading}
            helperOpen={state.helperOpen}
            setHelperOpen={state.setHelperOpen}
            sections={state.sections}
            totalFields={state.totalFields}
            doneCount={state.doneCount}
            donePct={state.donePct}
            searchQuery={state.searchQuery}
            setSearchQuery={state.setSearchQuery}
            searchRef={state.searchRef}
            collapsedSections={state.collapsedSections}
            setCollapsedSections={state.setCollapsedSections}
            accentColor={accentColor}
          />

          {/* Loading spinner */}
          {state.fieldsLoading && (
            <div
              style={{
                padding: "28px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                color: T.muted,
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke={T.indigoLight}
                strokeWidth={2}
                viewBox="0 0 24 24"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span style={{ fontSize: 12, fontFamily: font.sans }}>Loading form fields…</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Two-column helper body */}
          {!state.fieldsLoading && state.helperOpen && state.totalFields > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                minHeight: 360,
                maxHeight: 500,
              }}
            >
              {/* Left: field list */}
              <div
                className="vfw-left-scroll"
                style={{
                  borderRight: `1px solid ${T.border}`,
                  overflowY: "auto",
                  background: T.surface,
                  scrollbarWidth: "thin",
                  scrollbarColor: `rgba(99,102,241,0.35) transparent`,
                }}
              >
                <FieldList
                  sections={state.sections}
                  searchQuery={state.searchQuery}
                  activeFieldId={state.activeFieldId}
                  doneFields={state.doneFields}
                  collapsedSections={state.collapsedSections}
                  accentColor={accentColor}
                  onSelectField={state.setActiveFieldId}
                  onToggleDone={state.toggleDone}
                  onToggleSection={state.toggleSection}
                />
              </div>

              {/* Right: field detail */}
              <div
                className="vfw-right-scroll"
                style={{
                  overflowY: "auto",
                  background: T.surface,
                  scrollbarWidth: "thin",
                  scrollbarColor: `rgba(99,102,241,0.35) transparent`,
                }}
              >
                <FieldDetail
                  activeField={state.activeField}
                  allFields={state.allFields}
                  doneFields={state.doneFields}
                  copiedId={state.copiedId}
                  accentColor={accentColor}
                  onToggleDone={state.toggleDone}
                  onSelectField={state.setActiveFieldId}
                  onCopyExample={state.copyExample}
                />
              </div>
            </div>
          )}

          {/* All-done banner */}
          {!state.fieldsLoading && state.allDone && (
            <div
              style={{
                margin: "0 16px 16px",
                background: T.greenBg,
                border: `1px solid ${T.greenBorder}`,
                borderRadius: 8,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 16 }}>🎉</span>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.green,
                  margin: 0,
                  fontFamily: font.sans,
                }}
              >
                All {state.totalFields} fields marked as filled! Your form is ready to submit.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
