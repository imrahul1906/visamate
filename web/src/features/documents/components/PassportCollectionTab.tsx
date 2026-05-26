"use client";

import React, { useState } from "react";
import { T, font } from "@/lib/theme";

interface CollectionItem {
  id: string;
  title: string;
  desc: string;
  required: boolean;
}

const PASSPORT_COLLECTION_CHECKLIST: CollectionItem[] = [
  {
    id: "icr",
    title: "Original Invoice Cum Receipt (ICR)",
    desc: "The physical receipt stamped and handed to you by the agent at the VFS Global center during submission.",
    required: true,
  },
  {
    id: "id_proof",
    title: "Government-Issued Photo ID",
    desc: "A valid photo ID (e.g. Driver's License or National ID Card) to prove your identity at the counter.",
    required: true,
  },
  {
    id: "bio_copy",
    title: "Passport Bio-Page Photocopy",
    desc: "A printed black-and-white photocopy of your passport's photo page. Useful for verification.",
    required: true,
  },
  {
    id: "auth_letter",
    title: "Signed Authorization Letter",
    desc: "Only required if authorizing a representative to collect on your behalf. Must contain both signatures.",
    required: false,
  },
  {
    id: "rep_id",
    title: "Representative's Government ID",
    desc: "Only required if a representative is collecting on your behalf. They must bring their original ID.",
    required: false,
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
  const [purging, setPurging] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [trackingNumber, setTrackingNumber] = useState("");

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fileIds = Object.keys(uploads);
  const fileCount = fileIds.length;
  const totalSizeBytes = Object.values(uploads).reduce((sum, file) => sum + file.size, 0);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handlePurge = () => {
    setPurging(true);
    setTimeout(() => {
      onClearSession();
      setPurging(false);
    }, 800);
  };

  // Derive dynamic status step index based on progress
  const isDocsComplete = requiredTotal > 0 && requiredDone === requiredTotal;
  const requiredCollectionItems = PASSPORT_COLLECTION_CHECKLIST.filter((item) => item.required);
  const isCollectionReady = requiredCollectionItems.every((item) => checkedItems[item.id]);

  let currentStep = 0;
  if (isCollectionReady) {
    currentStep = 3;
  } else if (Object.keys(checkedItems).length > 0) {
    currentStep = 2;
  } else if (isDocsComplete) {
    currentStep = 1;
  }

  const steps = [
    { label: "Document Prep", desc: "Gathering files" },
    { label: "VFS Submission", desc: "Paperwork review" },
    { label: "Consulate Review", desc: "Embassy processing" },
    { label: "Passport Collection", desc: "Ready to pick up" },
  ];

  const premiumCardShadow = "0 10px 30px -10px rgba(108, 92, 231, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02), 0 0 0 1px var(--vm-border)";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 24,
      padding: "36px 0 24px",
      animation: "floatUp 450ms cubic-bezier(0.16, 1, 0.3, 1) both",
    }}>
      
      {/* ── Dynamic Visa lifecycle stepper ── */}
      <div style={{
        background: "var(--vm-surface)",
        border: "1px solid var(--vm-border)",
        borderRadius: 12,
        padding: "24px 28px",
        boxShadow: premiumCardShadow,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}>
        <div>
          <span style={{
            fontSize: 9.5,
            fontWeight: 700,
            color: "var(--vm-indigo-light)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: font.sans,
          }}>
            Real-Time Visa Lifecycle
          </span>
          <h3 style={{
            fontFamily: font.sans,
            fontSize: 16,
            fontWeight: 700,
            color: "var(--vm-text)",
            margin: "4px 0 0",
            letterSpacing: "-0.01em",
          }}>
            Passport Tracking Dashboard
          </h3>
        </div>

        {/* Stepper visualization */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          width: "100%",
          padding: "0 10px",
          marginTop: 10,
        }}>
          {/* Progress bar line */}
          <div style={{
            position: "absolute",
            left: "12%",
            right: "12%",
            top: 14,
            height: 2,
            background: "var(--vm-border)",
            zIndex: 1,
          }} />
          <div style={{
            position: "absolute",
            left: "12%",
            width: `${(currentStep / 3) * 76}%`,
            top: 14,
            height: 2,
            background: "var(--vm-indigo)",
            zIndex: 2,
            transition: "width 400ms ease",
          }} />

          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            return (
              <div key={idx} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 3,
                flex: 1,
              }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: isCompleted || isActive ? "var(--vm-indigo)" : "var(--vm-surface)",
                  border: isCompleted || isActive ? "2px solid var(--vm-indigo)" : "2px solid var(--vm-border)",
                  color: isCompleted || isActive ? "#fff" : "var(--vm-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  transition: "all 300ms ease",
                  boxShadow: isActive ? "0 0 12px var(--vm-indigo-glow)" : "none",
                }}>
                  {isCompleted ? (
                    <svg width="12" height="12" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span style={{
                  fontSize: 10.5,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--vm-text)" : "var(--vm-muted)",
                  marginTop: 8,
                  fontFamily: font.sans,
                  textAlign: "center",
                }}>
                  {step.label}
                </span>
                <span style={{
                  fontSize: 9,
                  color: "var(--vm-muted)",
                  opacity: 0.8,
                  marginTop: 2,
                  fontFamily: font.sans,
                  textAlign: "center",
                }}>
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Grid Layout: Collection checklist & Tracking form ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 24,
        alignItems: "start",
      }}>
        {/* Column 1: Collection Day Checklist */}
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
              fontSize: 12.5,
              color: "var(--vm-text)",
              opacity: 0.72,
              margin: 0,
              fontFamily: font.sans,
              lineHeight: 1.5,
            }}>
              What to bring to the VFS Global center or Consulate to pick up your processed passport.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PASSPORT_COLLECTION_CHECKLIST.map((item) => {
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

        {/* Column 2: Tracking Form & Sandbox Manager */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Tracking integration card */}
          <div style={{
            background: "var(--vm-surface)",
            border: "1px solid var(--vm-border)",
            borderRadius: 12,
            padding: 24,
            boxShadow: premiumCardShadow,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--vm-muted-2)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: font.sans }}>
                Quick Actions
              </span>
              <h4 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans }}>
                Embassy Tracking Integration
              </h4>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="VFS Receipt Reference (e.g. BEBR/120526/0045/01)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  style={{
                    width: "100%",
                    background: "var(--vm-trans-white-03)",
                    border: "1px solid var(--vm-border)",
                    borderRadius: 8,
                    padding: "10px 12px 10px 32px",
                    fontSize: 12,
                    color: "var(--vm-text)",
                    fontFamily: font.sans,
                    outline: "none",
                    transition: "border-color 150ms ease",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--vm-indigo)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--vm-border)")}
                />
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12 }}>🔍</span>
              </div>

              <a
                href="https://www.vfsglobal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="vm-btn vm-btn--primary"
                style={{ justifyContent: "center", padding: "10px" }}
              >
                Track Passport on VFS Portal
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>

          {/* Secure Sandbox Panel */}
          <div style={{
            background: "var(--vm-surface)",
            border: "1px solid var(--vm-border)",
            borderRadius: 12,
            padding: 24,
            boxShadow: premiumCardShadow,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--vm-muted-2)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: font.sans }}>
                Diagnostics Panel
              </span>
              <h4 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans }}>
                Memory & Security Auditor
              </h4>
            </div>

            <div style={{
              background: "var(--vm-trans-white-02)",
              border: "1px solid var(--vm-border)",
              borderRadius: 10,
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11.5, color: "var(--vm-text)", opacity: 0.7, fontFamily: font.sans }}>
                  RAM Sandbox:
                </span>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span className="vm-beacon" style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--vm-green)",
                    boxShadow: "0 0 8px var(--vm-green)",
                    animation: "badge-pulse 1.8s infinite ease-in-out",
                  }} />
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: "var(--vm-green)", fontFamily: font.sans, textTransform: "uppercase" }}>
                    Active
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11.5, color: "var(--vm-text)", opacity: 0.7, fontFamily: font.sans }}>
                  Files in RAM:
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans }}>
                  {fileCount} {fileCount === 1 ? "file" : "files"} ({formatBytes(totalSizeBytes)})
                </span>
              </div>

              <div style={{ height: 1, background: "var(--vm-border)" }} />

              <button
                onClick={handlePurge}
                disabled={purging || fileCount === 0}
                className="vm-btn"
                style={{
                  width: "100%",
                  background: fileCount === 0 ? "var(--vm-trans-white-05)" : purging ? "var(--vm-trans-white-10)" : "var(--vm-red-bg)",
                  color: fileCount === 0 ? "var(--vm-trans-white-35)" : purging ? "var(--vm-trans-white-55)" : "var(--vm-red)",
                  border: fileCount === 0 ? "1px solid var(--vm-trans-white-08)" : `1px solid var(--vm-red-border)`,
                  cursor: fileCount === 0 || purging ? "default" : "pointer",
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 11.5,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "background 180ms ease, transform 150ms ease",
                }}
              >
                {purging ? "Wiping memory buffer..." : "Secure Purge Memory Cache"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
