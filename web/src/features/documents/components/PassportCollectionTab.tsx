"use client";

import React, { useState } from "react";
import { font } from "@/lib/theme";

interface CollectionItem {
  id: string;
  title: string;
  desc: string;
  required: boolean;
  icon: string;
  downloadUrl?: string;
}

const SELF_COLLECTION_CHECKLIST: CollectionItem[] = [
  {
    id: "icr",
    title: "Original Invoice Cum Receipt (ICR)",
    desc: "The physical receipt stamped and handed to you by the agent at the VFS Global center during submission and payment.",
    required: true,
    icon: "🧾",
  },
  {
    id: "id_proof",
    title: "Government-Issued Original ID & Photocopy",
    desc: "Your valid original photo ID (e.g. Aadhaar Card, PAN Card, or Driver's License) and a clear printed photocopy.",
    required: true,
    icon: "🪪",
  },
  {
    id: "bio_copy",
    title: "Passport Bio-Page Photocopy",
    desc: "A printed black-and-white copy of your passport's first (photo/details) and last pages.",
    required: true,
    icon: "📄",
  },
  {
    id: "vfs_mail",
    title: "VFS Collection Confirmation Mail / SMS",
    desc: "The official notification email printout or SMS from VFS indicating that your passport is ready for collection.",
    required: true,
    icon: "📩",
  },
];

const DEPENDENT_COLLECTION_CHECKLIST: CollectionItem[] = [
  {
    id: "icr",
    title: "Dependent's Original Invoice Cum Receipt (ICR)",
    desc: "The physical receipt stamped and handed during submission and payment at the VFS Global center.",
    required: true,
    icon: "🧾",
  },
  {
    id: "id_proof",
    title: "Dependent's Original Government ID & Photocopy",
    desc: "The valid original photo ID of the passport holder (e.g. Aadhaar Card, PAN Card) and a printed photocopy.",
    required: true,
    icon: "🪪",
  },
  {
    id: "bio_copy",
    title: "Dependent's Passport Bio-Page Photocopy",
    desc: "A printed black-and-white copy of the passport holder's first and last pages.",
    required: true,
    icon: "📄",
  },
  {
    id: "vfs_mail",
    title: "VFS Collection Confirmation Mail / SMS",
    desc: "The official notification email printout or SMS from VFS indicating that the passport is ready for collection.",
    required: true,
    icon: "📩",
  },
  {
    id: "poa_letter",
    title: "Power of Attorney (Authorization Letter)",
    desc: "A signed authority letter from the applicant authorizing you to collect the passport. Download and fill the official template.",
    required: true,
    icon: "✍️",
    downloadUrl: "https://www.vfsglobal.com/one-pager/India/SouthAfrica/passport-services/pdf/Authorization-Letter.pdf",
  },
  {
    id: "rep_id",
    title: "Representative's Original ID & Photocopy",
    desc: "Your own valid original government-issued photo ID and a photocopy to prove your identity as the authorized representative.",
    required: true,
    icon: "🪪",
  },
];

interface PassportCollectionTabProps {
  uploads: Record<string, File>;
  onClearSession: () => void;
  requiredTotal: number;
  requiredDone: number;
}

export default function PassportCollectionTab({
  uploads,
  onClearSession,
  requiredTotal,
  requiredDone,
}: PassportCollectionTabProps) {
  const [collectionMode, setCollectionMode] = useState<"self" | "dependent">("self");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeChecklist =
    collectionMode === "self" ? SELF_COLLECTION_CHECKLIST : DEPENDENT_COLLECTION_CHECKLIST;

  const premiumCardShadow =
    "0 10px 30px -10px rgba(108, 92, 231, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02), 0 0 0 1px var(--vm-border)";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 20,
      padding: "24px 20px",
      animation: "floatUp 450ms cubic-bezier(0.16, 1, 0.3, 1) both",
      alignItems: "center",
    }}>
      
      {/* ── Collection Mode Selector ── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 9.5,
          fontWeight: 700,
          color: "var(--vm-indigo-light)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontFamily: font.sans,
        }}>
          Who is collecting the passport?
        </span>
        <div style={{
          display: "flex",
          background: "var(--vm-surface2)",
          border: "1px solid var(--vm-border)",
          borderRadius: 30,
          padding: 4,
          gap: 4,
          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
        }}>
          <button
            onClick={() => setCollectionMode("self")}
            style={{
              padding: "6px 20px",
              borderRadius: 25,
              border: "none",
              background: collectionMode === "self" ? "var(--vm-indigo)" : "transparent",
              color: collectionMode === "self" ? "#ffffff" : "var(--vm-text)",
              opacity: collectionMode === "self" ? 1 : 0.65,
              fontSize: 12,
              fontWeight: collectionMode === "self" ? 700 : 600,
              cursor: "pointer",
              transition: "all 200ms ease",
              fontFamily: font.sans,
              boxShadow: collectionMode === "self" ? "0 4px 12px var(--vm-indigo-glow)" : "none",
            }}
          >
            👤 Myself
          </button>
          <button
            onClick={() => setCollectionMode("dependent")}
            style={{
              padding: "6px 20px",
              borderRadius: 25,
              border: "none",
              background: collectionMode === "dependent" ? "var(--vm-indigo)" : "transparent",
              color: collectionMode === "dependent" ? "#ffffff" : "var(--vm-text)",
              opacity: collectionMode === "dependent" ? 1 : 0.65,
              fontSize: 12,
              fontWeight: collectionMode === "dependent" ? 700 : 600,
              cursor: "pointer",
              transition: "all 200ms ease",
              fontFamily: font.sans,
              boxShadow: collectionMode === "dependent" ? "0 4px 12px var(--vm-indigo-glow)" : "none",
            }}
          >
            👥 Dependent
          </button>
        </div>
      </div>

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
        width: "100%",
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
            <span style={{ fontSize: 9.5 }}>🎟️</span>
            <span style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: "var(--vm-purple-soft)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: font.sans,
            }}>
              Counter Collection
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
            Collection Requirements
          </h3>
          <p style={{
            fontSize: 12,
            color: "var(--vm-text)",
            opacity: 0.72,
            margin: 0,
            fontFamily: font.sans,
            lineHeight: 1.5,
          }}>
            {collectionMode === "self"
              ? "What to bring to the VFS Global center or Consulate to pick up your processed passport."
              : "What to bring to the VFS Global center or Consulate to pick up the passport on behalf of your dependent."}
          </p>
        </div>

        {/* Dynamic List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activeChecklist.map((item) => {
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
                {/* Big Scannable Emoji Icon */}
                <span style={{
                  fontSize: 20,
                  filter: isChecked ? "none" : "grayscale(0.7)",
                  opacity: isChecked ? 1.0 : 0.65,
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}>
                  {item.icon}
                </span>

                {/* Text Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: isChecked ? "var(--vm-green)" : "var(--vm-text)",
                    textDecoration: isChecked ? "line-through" : "none",
                    fontFamily: font.sans,
                    display: "block",
                    marginBottom: 2,
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

                {/* Action CTA Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                  {item.downloadUrl && (
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vm-btn vm-btn--primary"
                      style={{
                        padding: "5px 10px",
                        fontSize: 9.5,
                        fontWeight: 700,
                        fontFamily: font.sans,
                        borderRadius: 6,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span>VFS Template</span>
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </a>
                  )}
                  
                  <button
                    onClick={() => toggleCheck(item.id)}
                    style={{
                      background: isChecked ? "var(--vm-green)" : "rgba(255,255,255,0.06)",
                      border: isChecked ? "1px solid var(--vm-green)" : "1px solid var(--vm-border)",
                      borderRadius: 6,
                      padding: "5px 10px",
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: isChecked ? "#ffffff" : "var(--vm-text)",
                      cursor: "pointer",
                      fontFamily: font.sans,
                      transition: "all 150ms ease",
                    }}
                  >
                    {isChecked ? "Ready" : "Check"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}

