"use client";

// web/src/app/documents/VisaFormWidget.tsx
import { useState } from "react";
import type { DocumentItem } from "./types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface FormFillField {
  id: string;
  section: string;
  label: string;
  hint: string;
  example: string;
  warning?: string | null;
}

// ─────────────────────────────────────────────────────────────
// Form Fill Data Store
//
// Phase 1 (now): field data lives here as a keyed constant.
// Phase 2 (later): replace getFormFillFields() with a storage/API call.
//   Components call getFormFillFields(key) — nothing else changes.
// ─────────────────────────────────────────────────────────────

const FORM_FILL_DATA_STORE: Record<string, FormFillField[]> = {
  JP_TOURIST_VISA_FORM_FIELDS_V1: [
    // ── Personal details ─────────────────────────────────────
    { id: "surname",       section: "Personal details",  label: "Surname / family name",      hint: "Enter exactly as in your passport — all capitals.",                              example: "SHARMA",                         warning: null },
    { id: "given",         section: "Personal details",  label: "Given name(s)",               hint: "First and middle names as printed on your passport.",                           example: "RAHUL KUMAR",                    warning: null },
    { id: "nationality",   section: "Personal details",  label: "Nationality",                 hint: "Your current nationality as shown in the passport.",                            example: "Indian",                         warning: null },
    { id: "dob",           section: "Personal details",  label: "Date of birth",               hint: "Use the format DD/MM/YYYY — same as on your passport.",                         example: "15/08/1990",                     warning: null },
    { id: "pob",           section: "Personal details",  label: "Place of birth",              hint: "City and country where you were born.",                                         example: "New Delhi, India",               warning: null },
    { id: "sex",           section: "Personal details",  label: "Sex",                         hint: "Circle or tick the option that matches your passport.",                         example: "Male",                           warning: null },
    // ── Passport info ────────────────────────────────────────
    { id: "passport_no",   section: "Passport info",     label: "Passport number",             hint: "Alphanumeric code on the bio-data page.",                                       example: "P1234567",                       warning: null },
    { id: "issue_date",    section: "Passport info",     label: "Passport issue date",         hint: "DD/MM/YYYY format.",                                                            example: "10/03/2020",                     warning: null },
    { id: "expiry_date",   section: "Passport info",     label: "Passport expiry date",        hint: "Must be valid for at least 6 months beyond your travel date.",                  example: "09/03/2030",                     warning: "Passport must have minimum 6 months validity from the date you enter Japan." },
    { id: "issue_place",   section: "Passport info",     label: "Place of issue",              hint: "City where the passport was issued.",                                           example: "New Delhi",                      warning: null },
    // ── Work & address ───────────────────────────────────────
    { id: "occupation",    section: "Work & address",    label: "Occupation",                  hint: "Your current job title, or 'Student' / 'Homemaker' / 'Self-Employed'.",         example: "Software Engineer",              warning: null },
    { id: "employer",      section: "Work & address",    label: "Employer / school name",      hint: "Full registered name of your current employer or institution.",                  example: "Infosys Ltd.",                   warning: null },
    { id: "address",       section: "Work & address",    label: "Address in home country",     hint: "Your full residential address as it would appear on mail.",                     example: "12 MG Road, New Delhi 110001",   warning: null },
    { id: "phone",         section: "Work & address",    label: "Phone number",                hint: "Include country code. Embassy may call for confirmation.",                      example: "+91 98765 43210",                warning: null },
    { id: "email",         section: "Work & address",    label: "Email address",               hint: "An email you check regularly — all correspondence may go here.",                example: "rahul@email.com",                warning: null },
    // ── Travel details ───────────────────────────────────────
    { id: "japan_address", section: "Travel details",    label: "Address in Japan",            hint: "Hotel name and full address for your first night of stay.",                     example: "Shinjuku Granbell Hotel, Tokyo", warning: null },
    { id: "purpose",       section: "Travel details",    label: "Purpose of visit",            hint: "Select the closest option: Tourism / Business / Transit / Other.",              example: "Tourism",                        warning: null },
    { id: "entry_date",    section: "Travel details",    label: "Intended date of entry",      hint: "DD/MM/YYYY — your flight arrival date into Japan.",                             example: "01/10/2025",                     warning: null },
    { id: "stay_days",     section: "Travel details",    label: "Length of stay (days)",       hint: "Total number of nights you plan to be in Japan.",                               example: "10",                             warning: null },
    { id: "funds",         section: "Travel details",    label: "Estimated travel funds (¥)",  hint: "Total funds available for the trip, in Japanese Yen.",                          example: "¥200,000",                       warning: null },
    // ── Additional info ──────────────────────────────────────
    { id: "prev_japan",    section: "Additional info",   label: "Previous visit to Japan",     hint: "Yes or No. If Yes, state the year and purpose of last visit.",                  example: "No",                             warning: null },
    { id: "guarantor",     section: "Additional info",   label: "Guarantor in Japan (if any)", hint: "Leave blank or write N/A if you are a self-funded tourist.",                    example: "N/A",                            warning: null },
  ],
};

/**
 * Data-access function for form fill fields.
 *
 * Phase 1 (now): reads from FORM_FILL_DATA_STORE constant above.
 * Phase 2 (storage): replace the body with:
 *   return await db.formFillFields.findMany({ where: { dataKey } })
 *   or:   return await fetch(`/api/form-fill-fields/${dataKey}`).then(r => r.json())
 *
 * Components only call this function — no other changes needed on migration.
 */
export function getFormFillFields(dataKey: string | null | undefined): FormFillField[] {
  if (!dataKey) return [];
  return FORM_FILL_DATA_STORE[dataKey] ?? [];
}

// ─────────────────────────────────────────────────────────────
// VisaFormWidget
// ─────────────────────────────────────────────────────────────

export default function VisaFormWidget({ doc, color }: { doc: DocumentItem; color: string }) {
  const formInfo = doc.form;
  const isDownloadable = !formInfo || formInfo.type === "DOWNLOADABLE";

  const allFields = getFormFillFields(formInfo?.formFillDataKey);

  const [searchQuery, setSearchQuery]     = useState("");
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [doneFields, setDoneFields]       = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId]           = useState<string | null>(null);

  const filteredFields = allFields.filter(f =>
    !searchQuery ||
    f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sections = filteredFields.reduce<Record<string, FormFillField[]>>((acc, f) => {
    (acc[f.section] ??= []).push(f);
    return acc;
  }, {});

  const activeField = allFields.find(f => f.id === activeFieldId) ?? null;
  const totalFields = allFields.length;
  const doneCount   = doneFields.size;
  const donePct     = totalFields > 0 ? Math.round((doneCount / totalFields) * 100) : 0;

  const toggleDone = (id: string) => {
    setDoneFields(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyExample = (example: string, id: string) => {
    navigator.clipboard.writeText(example).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(c => (c === id ? null : c)), 1800);
  };

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{ borderTop: `1px solid ${color}18`, background: `${color}03` }}
    >
      {/* ── Step 1: Download or Online ── */}
      <div style={{
        padding: "16px 18px",
        borderBottom: `1px solid ${color}12`,
        display: "flex", alignItems: "flex-start", gap: 14,
        background: isDownloadable ? "#EFF6FF" : "#ECFDF5",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: isDownloadable ? "#DBEAFE" : "#D1FAE5",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {isDownloadable ? (
            <svg width="18" height="18" fill="none" stroke="#1D4ED8" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" stroke="#065F46" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: isDownloadable ? "#1E40AF" : "#065F46", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Step 1 — {isDownloadable ? "Download the form" : "Fill the form online"}
          </p>
          <p style={{ fontSize: 12, color: isDownloadable ? "#3B82F6" : "#10B981", margin: "0 0 12px" }}>
            {isDownloadable
              ? "Download the official PDF, print it, and fill it by hand."
              : "Click below to open the official application portal."}
          </p>

          {isDownloadable && formInfo?.downloadUrl && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <a
                href={formInfo.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "#1D4ED8", color: "#fff", fontSize: 12, fontWeight: 600,
                  padding: "8px 16px", borderRadius: 8, textDecoration: "none",
                  boxShadow: "0 1px 4px rgba(29,78,216,0.3)",
                }}
              >
                <svg width="13" height="13" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download official form (PDF)
              </a>
              {formInfo.requiresPrint && (
                <span style={{ fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
                  Print required
                </span>
              )}
            </div>
          )}

          {!isDownloadable && formInfo?.onlineUrl && (
            <a
              href={formInfo.onlineUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "#059669", color: "#fff", fontSize: 12, fontWeight: 600,
                padding: "8px 16px", borderRadius: 8, textDecoration: "none",
                boxShadow: "0 1px 4px rgba(5,150,105,0.3)",
              }}
            >
              <svg width="13" height="13" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Open application portal
            </a>
          )}
        </div>
      </div>

      {/* ── Step 2: Form Fill Helper ── */}
      {allFields.length > 0 && (
        <div>
          <div style={{
            padding: "14px 18px 12px",
            borderBottom: `1px solid ${color}12`,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <svg width="16" height="16" fill="none" stroke={color} strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>
                  {isDownloadable ? "Step 2 — " : ""}Form fill helper
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: "2px 8px", borderRadius: 20,
                  background: doneCount === totalFields ? "#dcfce7" : `${color}14`,
                  color: doneCount === totalFields ? "#16a34a" : color,
                }}>
                  {doneCount}/{totalFields} filled
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 160, height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 2, transition: "width 400ms ease",
                    width: `${donePct}%`,
                    background: doneCount === totalFields ? "#22c55e" : color,
                  }} />
                </div>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>{donePct}%</span>
              </div>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 8,
              padding: "6px 10px", minWidth: 180,
            }}>
              <svg width="12" height="12" fill="none" stroke="#9ca3af" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                placeholder="Search fields…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, color: "#111827", flex: 1 }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: 380 }}>
            {/* Left: field list */}
            <div style={{ borderRight: `1px solid ${color}12`, overflowY: "auto", maxHeight: 460 }}>
              {Object.keys(sections).length === 0 ? (
                <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", padding: "24px 14px" }}>
                  No fields match "{searchQuery}"
                </p>
              ) : (
                Object.entries(sections).map(([sectionName, fields]) => (
                  <div key={sectionName}>
                    <div style={{
                      padding: "7px 14px", fontSize: 9, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.08em",
                      color: "#9ca3af", background: "#f9fafb",
                      borderBottom: "1px solid #f1f5f9",
                      position: "sticky", top: 0, zIndex: 1,
                    }}>
                      {sectionName}
                    </div>
                    {fields.map((field) => {
                      const isActive = activeFieldId === field.id;
                      const isDone   = doneFields.has(field.id);
                      return (
                        <div
                          key={field.id}
                          onClick={() => setActiveFieldId(field.id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 9,
                            padding: "9px 14px", cursor: "pointer",
                            borderBottom: "1px solid #f9fafb",
                            background: isActive ? `${color}10` : "#fff",
                            borderLeft: isActive ? `2.5px solid ${color}` : "2.5px solid transparent",
                            transition: "all 120ms ease",
                          }}
                          onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                          onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                        >
                          <button
                            onClick={e => { e.stopPropagation(); toggleDone(field.id); }}
                            aria-label={isDone ? "Unmark" : "Mark as filled"}
                            style={{
                              width: 17, height: 17, borderRadius: 4, flexShrink: 0,
                              border: isDone ? `1.5px solid ${color}` : "1.5px solid #d1d5db",
                              background: isDone ? color : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", transition: "all 150ms", padding: 0,
                            }}
                          >
                            {isDone && (
                              <svg width="9" height="9" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </button>
                          <span style={{
                            fontSize: 12, flex: 1, lineHeight: 1.4,
                            color: isDone ? "#9ca3af" : isActive ? color : "#374151",
                            textDecoration: isDone ? "line-through" : "none",
                            fontWeight: isActive ? 600 : 400,
                          }}>
                            {field.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Right: detail panel */}
            <div style={{ padding: "20px 20px 16px", overflowY: "auto", maxHeight: 460 }}>
              {!activeField ? (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "#9ca3af", paddingTop: 40 }}>
                  <svg width="32" height="32" fill="none" stroke="#d1d5db" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
                  </svg>
                  <p style={{ fontSize: 12, textAlign: "center" }}>Click any field on the left<br />to see what to write</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 5px" }}>
                    {activeField.section}
                  </p>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px", lineHeight: 1.3 }}>
                    {activeField.label}
                  </h3>
                  <div style={{ height: 1, background: "#f1f5f9", marginBottom: 14 }} />

                  <div style={{ background: "#f8faff", borderLeft: `3px solid ${color}`, borderRadius: "0 8px 8px 0", padding: "12px 14px", marginBottom: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 5px" }}>What to write</p>
                    <p style={{ fontSize: 12, color: "#374151", margin: 0, lineHeight: 1.65 }}>{activeField.hint}</p>
                  </div>

                  <div style={{
                    background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12,
                  }}>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px" }}>Example</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, fontFamily: "monospace" }}>{activeField.example}</p>
                    </div>
                    <button
                      onClick={() => copyExample(activeField.example, activeField.id)}
                      style={{
                        flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "5px 10px", borderRadius: 7,
                        border: copiedId === activeField.id ? "1px solid #22c55e" : "1px solid #e5e7eb",
                        background: copiedId === activeField.id ? "#f0fdf4" : "#fff",
                        fontSize: 11, fontWeight: 600,
                        color: copiedId === activeField.id ? "#16a34a" : "#6b7280",
                        cursor: "pointer", transition: "all 150ms",
                      }}
                    >
                      {copiedId === activeField.id ? "✓ Copied" : "Copy"}
                    </button>
                  </div>

                  {activeField.warning && (
                    <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "10px 12px", display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 12 }}>
                      <svg width="14" height="14" fill="none" stroke="#d97706" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <p style={{ fontSize: 11, color: "#92400e", margin: 0, lineHeight: 1.6 }}>{activeField.warning}</p>
                    </div>
                  )}

                  <button
                    onClick={() => toggleDone(activeField.id)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      padding: "9px 16px", borderRadius: 8, cursor: "pointer",
                      border: doneFields.has(activeField.id) ? `1.5px solid ${color}` : "1.5px solid #e5e7eb",
                      background: doneFields.has(activeField.id) ? `${color}0f` : "#fff",
                      fontSize: 12, fontWeight: 600,
                      color: doneFields.has(activeField.id) ? color : "#6b7280",
                      transition: "all 150ms",
                    }}
                  >
                    {doneFields.has(activeField.id) ? "✓ Marked as filled — click to undo" : "Mark this field as filled"}
                  </button>

                  {(() => {
                    const nextUnfilled = allFields.find(f => !doneFields.has(f.id) && f.id !== activeField.id);
                    return nextUnfilled ? (
                      <button
                        onClick={() => setActiveFieldId(nextUnfilled.id)}
                        style={{
                          width: "100%", marginTop: 6,
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          padding: "7px 16px", borderRadius: 8, cursor: "pointer",
                          border: "none", background: "transparent",
                          fontSize: 11, fontWeight: 500, color: "#9ca3af", transition: "color 150ms",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#374151")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                      >
                        Next unfilled field →
                      </button>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>

          {doneCount === totalFields && totalFields > 0 && (
            <div style={{ margin: "0 16px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🎉</span>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#16a34a", margin: 0 }}>
                All {totalFields} fields marked as filled! Your form is ready to submit.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}