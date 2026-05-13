/**
 * FieldDetail.tsx
 *
 * The right-hand detail panel. When no field is selected it shows an empty
 * state prompt; otherwise it renders the field's full guidance: section
 * breadcrumb, label, form reference, hint, example with copy button,
 * optional warning, mark-as-done button, and "next unfilled" shortcut.
 *
 * Purely presentational — all actions are passed in as callbacks.
 */

import { T, font } from "@/components/shared/theme";
import type { FormFillField } from "../../../lib/data/repository";
import SectionIcon from "./SectionIcon";

interface Props {
  activeField: FormFillField | null;
  allFields: FormFillField[];
  doneFields: Set<string>;
  copiedId: string | null;
  accentColor: string;
  onToggleDone: (id: string) => void;
  onSelectField: (id: string) => void;
  onCopyExample: (example: string, id: string) => void;
}

export default function FieldDetail({
  activeField,
  allFields,
  doneFields,
  copiedId,
  accentColor,
  onToggleDone,
  onSelectField,
  onCopyExample,
}: Props) {
  if (!activeField) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "40px 20px",
        }}
      >
        <svg width="32" height="32" fill="none" stroke={T.border2} strokeWidth={1.2} viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5"
          />
        </svg>
        <p
          style={{
            fontSize: 12,
            textAlign: "center",
            color: T.muted,
            margin: 0,
            lineHeight: 1.6,
            fontFamily: font.sans,
          }}
        >
          Select a field on the left
          <br />
          <span style={{ color: T.muted, fontSize: 11 }}>to see how to fill it</span>
        </p>
      </div>
    );
  }

  const isDone = doneFields.has(activeField.id);
  const isCopied = copiedId === activeField.id;
  const nextUnfilled = allFields.find(
    (f) => !doneFields.has(f.id) && f.id !== activeField.id
  );

  return (
    <div style={{ padding: "18px 18px 14px" }}>
      {/* Section breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: T.muted,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontFamily: font.sans,
          }}
        >
          <SectionIcon section={activeField.section} />
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: T.muted,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontFamily: font.sans,
          }}
        >
          {activeField.section}
        </span>
      </div>

      {/* Field title */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: T.text,
          margin: "0 0 12px",
          lineHeight: 1.3,
          fontFamily: font.sans,
        }}
      >
        {activeField.label}
      </h3>

      {/* Divider */}
      <div style={{ height: 1, background: T.border, marginBottom: 14 }} />

      {/* Form reference */}
      {activeField.formRef && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 7,
            marginBottom: 12,
            padding: "8px 12px",
            background: T.surface2,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
          }}
        >
          <svg
            width="11"
            height="11"
            fill="none"
            stroke={T.muted}
            strokeWidth={1.8}
            viewBox="0 0 24 24"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <span style={{ fontSize: 10, color: T.muted, lineHeight: 1.5, fontFamily: font.sans }}>
            <span style={{ fontWeight: 600, color: T.muted2 }}>On the form: </span>
            {activeField.formRef}
          </span>
        </div>
      )}

      {/* What to write */}
      <div
        style={{
          background: `${accentColor}0d`,
          borderLeft: `3px solid ${accentColor}`,
          borderRadius: "0 8px 8px 0",
          padding: "12px 14px",
          marginBottom: 12,
        }}
      >
        <p
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: accentColor,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 5px",
            fontFamily: font.sans,
          }}
        >
          What to write
        </p>
        <p style={{ fontSize: 12, color: T.muted2, margin: 0, lineHeight: 1.65, fontFamily: font.sans }}>
          {activeField.hint}
        </p>
      </div>

      {/* Example + copy */}
      <div
        style={{
          background: T.surface2,
          border: `1px solid ${T.border2}`,
          borderRadius: 8,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: T.muted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 3px",
              fontFamily: font.sans,
            }}
          >
            Example
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: 0, fontFamily: "monospace" }}>
            {activeField.example}
          </p>
        </div>
        <button
          onClick={() => onCopyExample(activeField.example, activeField.id)}
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 10px",
            borderRadius: 7,
            border: isCopied ? `1px solid ${T.green}` : `1px solid ${T.border2}`,
            background: isCopied ? T.greenBg : "transparent",
            fontSize: 11,
            fontWeight: 600,
            color: isCopied ? T.green : T.muted2,
            cursor: "pointer",
            transition: "all 150ms",
            fontFamily: font.sans,
          }}
        >
          {isCopied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Warning */}
      {activeField.warning && (
        <div
          style={{
            background: T.amberBg,
            border: `1px solid ${T.amberBorder}`,
            borderRadius: 8,
            padding: "10px 12px",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <svg
            width="13"
            height="13"
            fill="none"
            stroke={T.amber}
            strokeWidth={2}
            viewBox="0 0 24 24"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p style={{ fontSize: 11, color: T.amber, margin: 0, lineHeight: 1.6, fontFamily: font.sans }}>
            {activeField.warning}
          </p>
        </div>
      )}

      {/* Mark as done */}
      <button
        onClick={() => onToggleDone(activeField.id)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          padding: "9px 16px",
          borderRadius: 8,
          cursor: "pointer",
          border: isDone ? `1.5px solid ${accentColor}` : `1.5px solid ${T.border2}`,
          background: isDone ? `${accentColor}18` : "transparent",
          fontSize: 12,
          fontWeight: 600,
          color: isDone ? accentColor : T.muted2,
          transition: "all 150ms",
          fontFamily: font.sans,
        }}
      >
        {isDone ? "✓ Marked as filled — click to undo" : "Mark this field as filled"}
      </button>

      {/* Next unfilled shortcut */}
      {nextUnfilled && (
        <button
          onClick={() => onSelectField(nextUnfilled.id)}
          style={{
            width: "100%",
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "7px 16px",
            borderRadius: 8,
            cursor: "pointer",
            border: "none",
            background: "transparent",
            fontSize: 11,
            fontWeight: 500,
            color: T.muted,
            transition: "color 150ms",
            fontFamily: font.sans,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = T.muted2)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = T.muted)}
        >
          Next unfilled field →
        </button>
      )}
    </div>
  );
}
