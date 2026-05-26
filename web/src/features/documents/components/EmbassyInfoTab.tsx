"use client";

import React, { useState } from "react";
import { T, font } from "@/lib/theme";

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATABASE: FAQItem[] = [
  {
    question: "What if I need to make corrections on my printed form?",
    answer: "If you spot a minor typo (e.g. spelling of a street), VFS staff can usually mark the correction on the spot or assist you in printing an updated sheet. However, major details (like passport number or travel dates) should be correct on your barcode, or you may need to re-generate the form.",
  },
  {
    question: "How do I track the status of my passport after submission?",
    answer: "You can track your application online using the official VFS tracking portal. You'll need your receipt reference number and your date of birth. You can also opt-in for paid SMS notifications at the counter during your appointment.",
  },
  {
    question: "Will I be interviewed at the VFS Global Center?",
    answer: "No, VFS Global is an outsourced processing agency. Staff will only verify your paperwork checklist, collect your fees, and register your biometrics (fingerprints/photos). Any decision-making interview, if requested, will be scheduled directly with the Embassy or Consulate at a later date.",
  },
  {
    question: "Can someone else submit my visa application on my behalf?",
    answer: "Generally, personal appearance is mandatory for biometrics collection. If you have registered biometrics for a Schengen or similar visa within the last 59 months, you may be exempt, allowing a representative with an authorization letter to submit your files. Check local embassy exemptions first.",
  },
  {
    question: "What is the refund policy for visa and VFS service fees?",
    answer: "All visa fees and VFS service charges are strictly non-refundable, even if your visa is rejected or if you withdraw your application after submission.",
  },
  {
    question: "What are VFS opening hours and drop-off guidelines?",
    answer: "Operating hours vary by city, but most centers accept passport submissions Monday through Friday from 08:00 to 15:00. You can review your specific center's address and timing rules in the selection drawer by clicking the location badge in the header.",
  },
];

interface AppointmentItem {
  id: string;
  title: string;
  desc: string;
  required: boolean;
}

const APPOINTMENT_CHECKLIST: AppointmentItem[] = [
  { id: "passport", title: "Original Passport", desc: "Current passport valid for at least 3-6 months past return date, with at least 2 blank pages.", required: true },
  { id: "old_passport", title: "Old Passports (if any)", desc: "Carry all previous expired passports to show your travel history to visa officers.", required: false },
  { id: "appointment_letter", title: "VFS Appointment Letter", desc: "Printed copy of your VFS appointment confirmation receipt showing booking slot details.", required: true },
  { id: "visa_form", title: "Printed & Signed Visa Form", desc: "Completed visa form with barcodes. Do not sign until VFS staff ask you to at the counter.", required: true },
  { id: "photos", title: "2 Passport-spec Photos", desc: "Physical photos conforming to embassy specifications. Carry them loose; do not staple to the form.", required: true },
  { id: "printed_docs", title: "Printed Visamate Package", desc: "All files generated/compiled via the Visamate ZIP package printed on standard A4 white paper.", required: true },
  { id: "payment", title: "Fee Payment Method", desc: "Cash, Demand Draft, or credit card as specified by your VFS center's payment rules.", required: true },
];

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function EmbassyInfoTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Custom checked state for appointment day checklist items
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFAQs = FAQ_DATABASE.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Custom shadow that pops on light mode and blends on dark mode
  const premiumCardShadow = "0 10px 30px -10px rgba(108, 92, 231, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02), 0 0 0 1px var(--vm-border)";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 24,
      padding: "36px 0 24px",
      animation: "floatUp 450ms cubic-bezier(0.16, 1, 0.3, 1) both",
    }}>
      
      {/* ── Grid: Two Columns (Checklist & FAQs) ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 24,
        alignItems: "start",
      }}>

        {/* Column 1: Appointment Day Checklist */}
        <div style={{
          background: "var(--vm-surface)",
          border: "1px solid var(--vm-border)",
          borderRadius: 12,
          padding: 24,
          boxShadow: premiumCardShadow,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "var(--vm-purple-bg)",
              border: "1px solid var(--vm-purple-border-soft)",
              borderRadius: 20,
              padding: "3px 9px",
              marginBottom: 10,
            }}>
              <span style={{ fontSize: 9.5 }}>💼</span>
              <span style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: "var(--vm-purple-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: font.sans,
              }}>
                Appointment Pack
              </span>
            </div>
            <h3 style={{
              fontFamily: font.sans,
              fontSize: 16,
              fontWeight: 700,
              color: "var(--vm-text)",
              margin: "0 0 6px",
              letterSpacing: "-0.01em",
            }}>
              What to Bring
            </h3>
            <p style={{
              fontSize: 12.5,
              color: "var(--vm-text)",
              opacity: 0.72,
              margin: 0,
              fontFamily: font.sans,
              lineHeight: 1.5,
            }}>
              Carry these physical items in a clear folder to the VFS Global center on your appointment day.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {APPOINTMENT_CHECKLIST.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: isChecked ? "1px solid var(--vm-green-border)" : "1px solid var(--vm-border)",
                    background: isChecked ? "var(--vm-green-bg)" : "var(--vm-trans-white-02)",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCheck(item.id);
                    }}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      border: isChecked ? "1px solid var(--vm-green)" : "1px solid var(--vm-trans-white-20)",
                      background: isChecked ? "var(--vm-green)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      flexShrink: 0,
                      marginTop: 2,
                      transition: "all 150ms ease",
                    }}
                  >
                    {isChecked && (
                      <svg width="8" height="8" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 2,
                    }}>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: isChecked ? "var(--vm-green)" : "var(--vm-text)",
                        textDecoration: isChecked ? "line-through" : "none",
                        fontFamily: font.sans,
                      }}>
                        {item.title}
                      </span>
                      {item.required ? (
                        <span style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "var(--vm-badge-required-color)",
                          background: "var(--vm-badge-required-bg)",
                          border: "1px solid var(--vm-badge-required-border)",
                          borderRadius: 4,
                          padding: "1px 5px",
                        }}>
                          Required
                        </span>
                      ) : (
                        <span style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "var(--vm-badge-optional-color)",
                          background: "var(--vm-badge-optional-bg)",
                          border: "1px solid var(--vm-badge-optional-border)",
                          borderRadius: 4,
                          padding: "1px 5px",
                        }}>
                          Optional
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontSize: 11,
                      color: isChecked ? "var(--vm-text)" : "var(--vm-text)",
                      opacity: isChecked ? 0.55 : 0.65,
                      margin: 0,
                      fontFamily: font.sans,
                      lineHeight: 1.45,
                    }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Searchable FAQs */}
        <div style={{
          background: "var(--vm-surface)",
          border: "1px solid var(--vm-border)",
          borderRadius: 12,
          padding: 24,
          boxShadow: premiumCardShadow,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "var(--vm-purple-bg)",
              border: "1px solid var(--vm-purple-border-soft)",
              borderRadius: 20,
              padding: "3px 9px",
              marginBottom: 10,
            }}>
              <span style={{ fontSize: 9.5 }}>🗣️</span>
              <span style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: "var(--vm-purple-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: font.sans,
              }}>
                Embassy FAQs
              </span>
            </div>
            <h3 style={{
              fontFamily: font.sans,
              fontSize: 16,
              fontWeight: 700,
              color: "var(--vm-text)",
              margin: "0 0 6px",
              letterSpacing: "-0.01em",
            }}>
              Procedural Guidelines
            </h3>
            <p style={{
              fontSize: 12.5,
              color: "var(--vm-text)",
              opacity: 0.72,
              margin: 0,
              fontFamily: font.sans,
              lineHeight: 1.5,
            }}>
              Common questions about submission, tracking, and biometrics.
            </p>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "var(--vm-trans-white-03)",
                border: "1px solid var(--vm-border)",
                borderRadius: 8,
                padding: "8px 12px 8px 32px",
                fontSize: 12,
                color: "var(--vm-text)",
                fontFamily: font.sans,
                outline: "none",
                transition: "border-color 150ms ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--vm-indigo)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--vm-border)")}
            />
            <svg
              width="13" height="13" fill="none" stroke="var(--vm-trans-white-45)" strokeWidth={2} viewBox="0 0 24 24"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* FAQ list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    style={{
                      border: "1px solid var(--vm-border)",
                      borderRadius: 8,
                      background: "var(--vm-trans-white-01)",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--vm-text)",
                        fontFamily: font.sans,
                        lineHeight: 1.4,
                      }}>
                        {faq.question}
                      </span>
                      <svg
                        width="12" height="12" fill="none" stroke="var(--vm-trans-white-45)" strokeWidth={2} viewBox="0 0 24 24"
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 200ms ease",
                          flexShrink: 0,
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    <div style={{
                      maxHeight: isOpen ? 160 : 0,
                      opacity: isOpen ? 1 : 0,
                      overflow: "hidden",
                      transition: "all 250ms ease-in-out",
                      background: "var(--vm-trans-white-02)",
                    }}>
                      <p style={{
                        fontSize: 11,
                        color: "var(--vm-text)",
                        opacity: 0.7,
                        margin: 0,
                        padding: "10px 14px 14px",
                        lineHeight: 1.55,
                        fontFamily: font.sans,
                      }}>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{
                textAlign: "center",
                padding: "24px 0",
                fontSize: 12,
                color: "var(--vm-muted)",
                fontStyle: "italic",
                fontFamily: font.sans,
              }}>
                No matching FAQs found.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Row: Official Resources Links ── */}
      <div style={{
        background: "var(--vm-surface)",
        border: "1px solid var(--vm-border)",
        borderRadius: 12,
        padding: "20px 24px",
        boxShadow: premiumCardShadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🗓️</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans }}>
              Schedule Your Appointment
            </h4>
            <p style={{ margin: 0, fontSize: 11, color: "var(--vm-text)", opacity: 0.65, fontFamily: font.sans, marginTop: 3 }}>
              Book your slot directly on VFS Global to submit your printed checklist.
            </p>
          </div>
        </div>

        <a
          href="https://www.vfsglobal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="vm-btn vm-btn--primary"
        >
          Book VFS Appointment
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>

    </div>
  );
}
