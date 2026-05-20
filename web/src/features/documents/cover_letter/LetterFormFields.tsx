"use client";

import { useRef, useEffect } from "react";

/**
 * LetterFormFields.tsx
 *
 * Reusable UI components for the cover letter builder.
 * These are presentation components with no business logic.
 */


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

/* ─────────────────────────── COUNTRY VISIT ROW ─────────────────────────── */
export interface CountryVisit {
  country: string;
  /**
   * Stored as "YYYY-MM" e.g. "2024-06" so fmtMonthYear() can parse it.
   * The UI collects month + year via two separate selects.
   */
  month: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * A single row in the "Countries visited in last 5 years" section.
 * Layout: [num] [country — flex] [Month select] [Year select] [✕]
 * The column headers in coverLetterInputs.tsx must use the same 5-column grid.
 */
export function CountryVisitRow({
  visit,
  idx,
  onChange,
  onRemove,
}: {
  visit: CountryVisit;
  idx: number;
  onChange: (v: CountryVisit) => void;
  onRemove: () => void;
}) {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 5;

  // Parse stored "YYYY-MM"
  const [storedYear, storedMonth] = visit.month ? visit.month.split("-") : ["", ""];

  function handleMonthSelect(newMonth: string) {
    const yr = storedYear || String(currentYear);
    onChange({ ...visit, month: newMonth ? `${yr}-${newMonth}` : "" });
  }

  function handleYearSelect(newYear: string) {
    const mo = storedMonth || "01";
    onChange({ ...visit, month: newYear ? `${newYear}-${mo}` : "" });
  }

  const yearOptions: number[] = [];
  for (let y = currentYear; y >= minYear; y--) yearOptions.push(y);

  return (
    <div className="cl-contact-row cl-country-visit-row">
      <span className="cl-contact-num">{idx + 1}</span>

      <input
        className="cl-input cl-country-visit-field--country"
        placeholder="e.g. Japan"
        value={visit.country}
        onChange={(e) => onChange({ ...visit, country: e.target.value })}
        aria-label="Country name"
      />

      <select
        className="cl-select-pill"
        value={storedMonth || ""}
        onChange={(e) => handleMonthSelect(e.target.value)}
        aria-label="Month of visit"
      >
        <option value="">Month</option>
        {MONTH_NAMES.map((name, i) => {
          const val = String(i + 1).padStart(2, "0");
          return <option key={val} value={val}>{name}</option>;
        })}
      </select>

      <select
        className="cl-select-pill"
        value={storedYear || ""}
        onChange={(e) => handleYearSelect(e.target.value)}
        aria-label="Year of visit"
      >
        <option value="">Year</option>
        {yearOptions.map((y) => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>

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