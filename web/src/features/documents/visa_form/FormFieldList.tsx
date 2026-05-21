/**
 * FormFieldList.tsx
 *
 * The left-hand scrollable panel: renders collapsible section headers
 * and the individual field rows (with checkbox, label, warning dot).
 *
 * Purely presentational — all actions are passed in as callbacks.
 */

import { T, font } from "@/components/shared/theme";
import type { FormFillField } from "../../../lib/data/repository";
import type { SectionMap } from "@/features/documents/visa_form/formService";
import FormSectionIcon from "./FormSectionIcon";

interface Props {
  sections: SectionMap;
  searchQuery: string;
  activeFieldId: string | null;
  doneFields: Set<string>;
  collapsedSections: Set<string>;
  accentColor: string;
  onSelectField: (id: string) => void;
  onToggleDone: (id: string) => void;
  onToggleSection: (sectionName: string) => void;
}

export default function FormFieldList({
  sections,
  searchQuery,
  activeFieldId,
  doneFields,
  collapsedSections,
  accentColor,
  onSelectField,
  onToggleDone,
  onToggleSection,
}: Props) {
  if (Object.keys(sections).length === 0) {
    return (
      <div style={{ padding: "28px 14px", textAlign: "center", color: T.muted }}>
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          style={{ margin: "0 auto 8px", display: "block", opacity: 0.4 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <p style={{ fontSize: 11, margin: 0, fontFamily: font.sans }}>
          No fields match<br />
          <strong style={{ color: T.muted2 }}>"{searchQuery}"</strong>
        </p>
      </div>
    );
  }

  return (
    <>
      {Object.entries(sections).map(([sectionName, fields]) => {
        const isCollapsed = collapsedSections.has(sectionName);
        const allSectionDone = fields.every((f) => doneFields.has(f.id));

        return (
          <div key={sectionName}>
            {/* Section header */}
            <div
              onClick={() => onToggleSection(sectionName)}
              style={{
                padding: "8px 12px 8px 0",
                color: T.muted2,
                background: T.surface2,
                borderBottom: `1px solid ${T.border}`,
                borderLeft: `3px solid ${allSectionDone ? T.green : accentColor}`,
                position: "sticky",
                top: 0,
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                gap: 7,
                cursor: "pointer",
                userSelect: "none",
                transition: "background 120ms",
                paddingLeft: 10,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface3; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface2; }}
            >
              {/* Section icon — slightly more visible */}
              <span
                style={{
                  color: allSectionDone ? T.green : accentColor,
                  opacity: 0.85,
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <FormSectionIcon section={sectionName} />
              </span>

              {/* Section name — readable, not screaming */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: allSectionDone ? T.green : T.muted2,
                  letterSpacing: "0.02em",
                  fontFamily: font.sans,
                  flex: 1,
                  lineHeight: 1,
                }}
              >
                {sectionName}
              </span>

              {/* Chevron */}
              <svg
                width="9"
                height="9"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                style={{
                  flexShrink: 0,
                  transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                  transition: "transform 200ms ease",
                  color: T.muted,
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            {/* Field rows */}
            {!isCollapsed &&
              fields.map((field: FormFillField) => {
                const isActive = activeFieldId === field.id;
                const isDone = doneFields.has(field.id);

                return (
                  <div
                    key={field.id}
                    onClick={() => onSelectField(field.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderBottom: `1px solid ${T.border}`,
                      background: isActive ? `${accentColor}18` : "transparent",
                      borderLeft: isActive
                        ? `2.5px solid ${accentColor}`
                        : "2.5px solid transparent",
                      transition: "all 120ms ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLElement).style.background = T.surface3;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleDone(field.id);
                      }}
                      aria-label={isDone ? "Unmark" : "Mark as filled"}
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 4,
                        flexShrink: 0,
                        border: isDone
                          ? `1.5px solid ${accentColor}`
                          : `1.5px solid ${T.border2}`,
                        background: isDone ? accentColor : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 150ms",
                        padding: 0,
                      }}
                    >
                      {isDone && (
                        <svg width="8" height="8" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>

                    {/* Label */}
                    <span
                      style={{
                        fontSize: 11,
                        flex: 1,
                        lineHeight: 1.4,
                        color: isDone ? T.muted : isActive ? T.text : T.muted2,
                        textDecoration: isDone ? "line-through" : "none",
                        fontWeight: isActive ? 600 : 400,
                        fontFamily: font.sans,
                      }}
                    >
                      {field.label}
                    </span>

                    {/* Warning dot */}
                    {field.warning && !isDone && (
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: T.amber,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );
}