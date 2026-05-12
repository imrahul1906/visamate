"use client";

import { useRef, useEffect } from "react";

/**
 * coverLetterComponents.tsx
 *
 * Reusable UI components for the cover letter builder.
 * These are presentation components with no business logic.
 */

/* ─────────────────────────── INLINE TEXT FIELD ─────────────────────────── */
/** Single-line editable field that looks like plain letter text until focused */
export function InlineField({
  value,
  onChange,
  placeholder = "Click to edit",
  style = {},
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}) {
  return (
    <input
      className="cl-inline-field"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={style}
      title="Click to edit"
    />
  );
}

/* ─────────────────────────── INLINE TEXTAREA ─────────────────────────── */
/** Multi-line editable paragraph — always editable, styled like letter text */
export function InlinePara({
  value,
  onChange,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      className="cl-inline-para"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      title="Click to edit paragraph"
    />
  );
}

/* ─────────────────────────── CONTACT ROW ─────────────────────────── */
export interface Contact {
  name: string;
  rel: string;
  phone: string;
  email: string;
}

export function ContactRow({
  contact,
  idx,
  onChange,
  onRemove,
}: {
  contact: Contact;
  idx: number;
  onChange: (c: Contact) => void;
  onRemove: () => void;
}) {
  return (
    <div className="cl-contact-row">
      <span className="cl-contact-num">{idx + 1}</span>
      <input
        className="cl-input cl-contact-field"
        placeholder="Full name"
        value={contact.name}
        onChange={(e) => onChange({ ...contact, name: e.target.value })}
      />
      <input
        className="cl-input cl-contact-field"
        placeholder="Relationship"
        value={contact.rel}
        onChange={(e) => onChange({ ...contact, rel: e.target.value })}
      />
      <input
        className="cl-input cl-contact-field"
        placeholder="+91 XXXXX XXXXX"
        value={contact.phone}
        onChange={(e) => onChange({ ...contact, phone: e.target.value })}
      />
      <input
        className="cl-input cl-contact-field"
        placeholder="email@example.com"
        value={contact.email}
        onChange={(e) => onChange({ ...contact, email: e.target.value })}
      />
      <button
        className="cl-icon-btn cl-icon-btn--remove"
        onClick={onRemove}
        title="Remove"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
