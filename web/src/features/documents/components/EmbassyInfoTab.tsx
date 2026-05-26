"use client";

import React, { useState } from "react";
import { T, font } from "@/lib/theme";

// ─────────────────────────────────────────────────────────────
// Types & Data Structures
// ─────────────────────────────────────────────────────────────

interface FAQItem {
  id: string;
  category: "doc_prep" | "biometrics" | "submission" | "processing" | "consular";
  question: string;
  answer: string;
}

const FAQ_DATABASE: FAQItem[] = [
  {
    id: "fq1",
    category: "doc_prep",
    question: "What documents are mandatory for the embassy submission?",
    answer: "You must submit your printed VisaMate dossier containing your signed visa application form, travel itinerary, cover letter, and proof of funds (bank statements/ITRs). Keep them stacked neatly as per the checklist.",
  },
  {
    id: "fq2",
    category: "doc_prep",
    question: "Do I need to carry physical photocopies of my passport?",
    answer: "Yes, you must bring A4-size photocopies of the first (bio-data) and last page of your current passport. If you are submitting old passports, carry copies of their bio-data pages as well.",
  },
  {
    id: "fq3",
    category: "biometrics",
    question: "How does the biometrics collection work at the visa center?",
    answer: "At the center, officers will scan your fingerprints (all 10 fingers) and capture a digital photo of your face. Ensure your hands are clean and free of henna or cuts.",
  },
  {
    id: "fq4",
    category: "submission",
    question: "What should I expect at the visa center on submission day?",
    answer: "Arrive 15 minutes before your slot. Security will check your appointment letter. Inside, VFS staff will verify your physical dossier, collect any remaining fees, register biometrics, and issue a tracking invoice.",
  },
  {
    id: "fq5",
    category: "processing",
    question: "How long does the embassy take to make a decision?",
    answer: "Standard visa processing takes 10 to 15 working days, but can increase during peak travel seasons. Always track your passport using the official portal.",
  },
  {
    id: "fq6",
    category: "consular",
    question: "What tips should I follow if a consular officer asks questions?",
    answer: "Keep your answers brief, clear, and confident. Never guess; match your answers exactly to your printed itinerary and cover letter.",
  },
];

interface AppointmentItem {
  id: string;
  title: string;
  desc: string;
  required: boolean;
  icon: string;
}

const APPOINTMENT_CHECKLIST: AppointmentItem[] = [
  { 
    id: "passport", 
    title: "Original Passports", 
    desc: "Physical booklets of your current passport (valid for 6 months) and any expired old passports.", 
    required: true,
    icon: "🛂"
  },
  { 
    id: "printed_docs", 
    title: "VisaMate Printed Dossier", 
    desc: "All files prepared in Tab 1 (Visa form, itinerary, cover letter, financial records) printed on clean A4 sheets.", 
    required: true,
    icon: "📂"
  },
  { 
    id: "appointment_letter", 
    title: "VFS Appointment Letter", 
    desc: "Printed confirmation receipt of your scheduled slot at the submission center.", 
    required: true,
    icon: "✉️"
  },
  { 
    id: "payment", 
    title: "Fee Payment Method", 
    desc: "Cash, Demand Draft, or credit card as specified by your visa center's local rules.", 
    required: true,
    icon: "💳"
  },
];

interface EmbassyInfoTabProps {
  countryName?: string;
  visaTypeName?: string;
}

export default function EmbassyInfoTab({ countryName = "", visaTypeName = "" }: EmbassyInfoTabProps) {
  // Suitcase Checklist checked state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const premiumCardShadow = "0 10px 30px -10px rgba(108, 92, 231, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02), 0 0 0 1px var(--vm-border)";

  const packedCount = APPOINTMENT_CHECKLIST.filter(item => checkedItems[item.id]).length;
  const isCompleted = packedCount === APPOINTMENT_CHECKLIST.length;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 20,
      padding: "24px 20px",
      animation: "floatUp 450ms cubic-bezier(0.16, 1, 0.3, 1) both",
      alignItems: "center",
    }}>
      
      {/* ── Checklist Container ── */}
      <div style={{
        background: "var(--vm-surface)",
        border: "1px solid var(--vm-border)",
        borderRadius: 12,
        padding: 24,
        boxShadow: premiumCardShadow,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        maxWidth: 620,
        width: "100%"
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
            <span style={{ fontSize: 9.5 }}>📋</span>
            <span style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: "var(--vm-purple-soft)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: font.sans,
            }}>
              Checklist
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
            What to Carry
          </h3>
          <p style={{
            fontSize: 12,
            color: "var(--vm-text)",
            opacity: 0.72,
            margin: 0,
            fontFamily: font.sans,
            lineHeight: 1.5,
          }}>
            These are the things you need to take with you on your visa appointment day. Check them off as you pack.
          </p>
        </div>

        {/* 3D Glassmorphic Card Fan Deck Container */}
        <div style={{
          background: "linear-gradient(135deg, var(--vm-purple-bg-muted) 0%, var(--vm-indigo-glow) 100%)",
          borderRadius: 10,
          border: "1px solid var(--vm-border)",
          padding: "20px 12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minHeight: 180,
          transition: "all 0.4s ease",
          overflow: "hidden",
          boxShadow: isCompleted 
            ? "0 0 30px rgba(16, 185, 129, 0.08), inset 0 1px 1px rgba(255,255,255,0.4)" 
            : "inset 0 1px 1px rgba(255,255,255,0.2)"
        }}>
          
          {/* Centered bounding box */}
          <div style={{
            position: "relative",
            width: 275,
            height: 135,
            margin: "0 auto",
            overflow: "visible"
          }}>
            
            {/* Card 1: Passport (Orange/Gold Glow) */}
            <div 
              className={`vm-glass-card vm-card-passport ${checkedItems.passport ? "vm-checked" : ""}`}
              style={{
                position: "absolute",
                width: 90,
                height: 125,
                borderRadius: 10,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "flex",
                flexDirection: "column",
                padding: "8px 6px",
                left: 0,
                top: 10,
                color: "var(--vm-text)",
                transform: checkedItems.passport
                  ? "rotate(-13deg) translateY(-10px) scale(1.05)"
                  : "rotate(-13deg)",
                zIndex: checkedItems.passport ? 10 : 1,
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 8.5, fontWeight: 700, fontFamily: font.sans }}>Passport</span>
                <span style={{ fontSize: 10 }}>🛂</span>
              </div>
              {/* Photo Simulation */}
              <div style={{
                flex: 1,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 5,
                padding: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyContent: "center",
                alignItems: "center"
              }}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8
                }}>
                  👤
                </div>
                <span style={{ fontSize: 5.5, color: "var(--vm-text)", opacity: 0.6, fontFamily: font.sans, textAlign: "center" }}>
                  Original
                </span>
              </div>
              {checkedItems.passport && (
                <div className="vm-checked-badge">
                  <svg width="8" height="8" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
            </div>

            {/* Card 2: Dossier (Green/Emerald Glow) */}
            <div 
              className={`vm-glass-card vm-card-dossier ${checkedItems.printed_docs ? "vm-checked" : ""}`}
              style={{
                position: "absolute",
                width: 90,
                height: 125,
                borderRadius: 10,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "flex",
                flexDirection: "column",
                padding: "8px 6px",
                left: 60,
                top: 5,
                color: "var(--vm-text)",
                transform: checkedItems.printed_docs
                  ? "rotate(-4deg) translateY(-10px) scale(1.05)"
                  : "rotate(-4deg)",
                zIndex: checkedItems.printed_docs ? 10 : 2,
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 8.5, fontWeight: 700, fontFamily: font.sans }}>Dossier</span>
                <span style={{ fontSize: 10 }}>📂</span>
              </div>
              {/* Details */}
              <div style={{
                flex: 1,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 5,
                padding: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyContent: "center"
              }}>
                <div style={{ height: 2, background: "rgba(255,255,255,0.4)", width: "70%" }} />
                <div style={{ height: 2, background: "rgba(255,255,255,0.4)", width: "85%" }} />
                <div style={{ height: 2, background: "rgba(255,255,255,0.4)", width: "50%" }} />
              </div>
              {checkedItems.printed_docs && (
                <div className="vm-checked-badge">
                  <svg width="8" height="8" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
            </div>

            {/* Card 3: Letter (Cyan/Blue Glow) */}
            <div 
              className={`vm-glass-card vm-card-letter ${checkedItems.appointment_letter ? "vm-checked" : ""}`}
              style={{
                position: "absolute",
                width: 90,
                height: 125,
                borderRadius: 10,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "flex",
                flexDirection: "column",
                padding: "8px 6px",
                left: 120,
                top: 5,
                color: "var(--vm-text)",
                transform: checkedItems.appointment_letter
                  ? "rotate(4deg) translateY(-10px) scale(1.05)"
                  : "rotate(4deg)",
                zIndex: checkedItems.appointment_letter ? 10 : 3,
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 8.5, fontWeight: 700, fontFamily: font.sans }}>Letter</span>
                <span style={{ fontSize: 10 }}>✉️</span>
              </div>
              {/* Details */}
              <div style={{
                flex: 1,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 5,
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2
              }}>
                <span style={{ fontSize: 10 }}>📅</span>
              </div>
              {checkedItems.appointment_letter && (
                <div className="vm-checked-badge">
                  <svg width="8" height="8" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
            </div>

            {/* Card 4: Payment (Magenta/Purple Glow) */}
            <div 
              className={`vm-glass-card vm-card-payment ${checkedItems.payment ? "vm-checked" : ""}`}
              style={{
                position: "absolute",
                width: 90,
                height: 125,
                borderRadius: 10,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "flex",
                flexDirection: "column",
                padding: "8px 6px",
                left: 180,
                top: 10,
                color: "var(--vm-text)",
                transform: checkedItems.payment
                  ? "rotate(13deg) translateY(-10px) scale(1.05)"
                  : "rotate(13deg)",
                zIndex: checkedItems.payment ? 10 : 4,
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 8.5, fontWeight: 700, fontFamily: font.sans }}>Payment</span>
                <span style={{ fontSize: 10 }}>💳</span>
              </div>
              {/* Credit card Simulation */}
              <div style={{
                flex: 1,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 5,
                padding: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyContent: "space-between"
              }}>
                <div style={{ width: 8, height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 1 }} />
                <div style={{ height: 2, background: "rgba(255,255,255,0.4)", width: "65%" }} />
              </div>
              {checkedItems.payment && (
                <div className="vm-checked-badge">
                  <svg width="8" height="8" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
            </div>

          </div>

          {/* Completion Banner */}
          <div style={{
            marginTop: 10,
            textAlign: "center",
            minHeight: 18,
            zIndex: 3
          }}>
            {isCompleted ? (
              <div style={{
                animation: "scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                fontSize: 12,
                fontWeight: 700,
                color: "#10b981",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.15)"
              }}>
                ALL PACKED! YOU&apos;RE READY! 🌟
              </div>
            ) : (
              <div style={{ fontSize: 11, color: "var(--vm-text)", opacity: 0.65, fontFamily: font.sans }}>
                Packed: <b>{packedCount}</b> of <b>{APPOINTMENT_CHECKLIST.length}</b> items
              </div>
            )}
          </div>
        </div>

        {/* Interactive Pack checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {APPOINTMENT_CHECKLIST.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`vm-floating-item ${isChecked ? "vm-item-checked" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 18px",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 20, filter: isChecked ? "none" : "grayscale(0.7)", opacity: isChecked ? 1.0 : 0.65, transition: "all 0.2s", flexShrink: 0 }}>
                  {item.icon}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: isChecked ? "#10b981" : "var(--vm-text)",
                    textDecoration: isChecked ? "line-through" : "none",
                    fontFamily: font.sans,
                    display: "block",
                    marginBottom: 2
                  }}>
                    {item.title}
                  </span>
                  <p style={{
                    fontSize: 10.5,
                    color: "var(--vm-text)",
                    opacity: isChecked ? 0.45 : 0.65,
                    margin: 0,
                    fontFamily: font.sans,
                    lineHeight: 1.45,
                  }}>
                    {item.desc}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCheck(item.id);
                  }}
                  style={{
                    background: isChecked ? "#10b981" : "rgba(255,255,255,0.06)",
                    border: isChecked ? "1px solid #10b981" : "1px solid var(--vm-border)",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: isChecked ? "#ffffff" : "var(--vm-text)",
                    cursor: "pointer",
                    fontFamily: font.sans,
                    transition: "all 150ms ease",
                    flexShrink: 0
                  }}
                >
                  {isChecked ? "Packed" : "Pack"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Row: Official Resources Links ── */}
      <div style={{
        background: "var(--vm-surface)",
        border: "1px solid var(--vm-border)",
        borderRadius: 12,
        padding: "16px 24px",
        boxShadow: premiumCardShadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        maxWidth: 620,
        width: "100%"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🗓️</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans }}>
              Schedule Your Appointment
            </h4>
            <p style={{ margin: 0, fontSize: 10.5, color: "var(--vm-text)", opacity: 0.65, fontFamily: font.sans, marginTop: 3 }}>
              Book your slot directly on VFS Global to submit your printed checklist.
            </p>
          </div>
        </div>

        <a
          href="https://www.vfsglobal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="vm-btn vm-btn--primary"
          style={{ padding: "8px 16px", fontSize: 11 }}
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
