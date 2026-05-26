"use client";

import React, { useState } from "react";
import { font } from "@/lib/theme";

// ─────────────────────────────────────────────────────────────
// Status Steps Data
// ─────────────────────────────────────────────────────────────

interface StatusStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  tip?: string;
}

const STATUS_STEPS: StatusStep[] = [
  {
    id: "submitted",
    title: "Application Submitted",
    description: "Your documents have been submitted at the visa center and a tracking receipt has been issued.",
    icon: "📤",
    tip: "Keep your tracking receipt safe — you'll need it to collect your passport later.",
  },
  {
    id: "processing",
    title: "Under Processing",
    description: "Your application is being reviewed by the embassy/consulate. This usually takes 5–15 working days.",
    icon: "⏳",
    tip: "Do not make any travel bookings until your visa has been approved.",
  },
  {
    id: "decision",
    title: "Decision Made",
    description: "The embassy has made a decision on your visa application. Check your tracking portal for the result.",
    icon: "📋",
    tip: "You'll receive an SMS or email notification when the decision is ready.",
  },
  {
    id: "dispatched",
    title: "Passport Dispatched",
    description: "Your passport has been sent back to the visa center or is being couriered to your address.",
    icon: "🚚",
    tip: "If you opted for courier delivery, track your shipment using the courier tracking ID.",
  },
  {
    id: "collected",
    title: "Passport Collected",
    description: "You've collected your passport with the visa stamped. You're all set to travel!",
    icon: "✅",
    tip: "Double-check the visa validity dates and number of entries allowed before booking flights.",
  },
];

// ─────────────────────────────────────────────────────────────
// Tracking Links Data
// ─────────────────────────────────────────────────────────────

interface TrackingLink {
  name: string;
  url: string;
  icon: string;
}

const TRACKING_LINKS: TrackingLink[] = [
  { name: "VFS Global", url: "https://www.vfsglobal.com/track-your-application", icon: "🌐" },
  { name: "BLS International", url: "https://www.blsinternational.com", icon: "🏢" },
  { name: "Embassy Direct", url: "#", icon: "🏛️" },
];

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

interface ApplicationStatusTabProps {
  countryName?: string;
  visaTypeName?: string;
}

export default function ApplicationStatusTab({ countryName = "", visaTypeName = "" }: ApplicationStatusTabProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const premiumCardShadow = "0 10px 30px -10px rgba(108, 92, 231, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02), 0 0 0 1px var(--vm-border)";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 24,
      padding: "24px 20px",
      animation: "floatUp 450ms cubic-bezier(0.16, 1, 0.3, 1) both",
    }}>

      {/* ── Grid: Two Columns ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 24,
        alignItems: "start",
      }}>

        {/* Column 1: Status Timeline */}
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
              <span style={{ fontSize: 9.5 }}>📡</span>
              <span style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: "var(--vm-purple-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: font.sans,
              }}>
                Tracker
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
              Application Status
            </h3>
            <p style={{
              fontSize: 12.5,
              color: "var(--vm-text)",
              opacity: 0.72,
              margin: 0,
              fontFamily: font.sans,
              lineHeight: 1.5,
            }}>
              Track where your visa application stands. Tap on a step to mark it as your current stage.
            </p>
          </div>

          {/* Timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STATUS_STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isFuture = index > currentStep;

              return (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  style={{
                    display: "flex",
                    gap: 14,
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {/* Timeline Line + Dot */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 28,
                    flexShrink: 0,
                  }}>
                    {/* Dot */}
                    <div style={{
                      width: isActive ? 18 : 14,
                      height: isActive ? 18 : 14,
                      borderRadius: "50%",
                      background: isCompleted
                        ? "#10b981"
                        : isActive
                          ? "var(--vm-indigo)"
                          : "var(--vm-trans-white-06)",
                      border: isActive
                        ? "3px solid rgba(99, 102, 241, 0.3)"
                        : isCompleted
                          ? "2px solid rgba(16, 185, 129, 0.3)"
                          : "2px solid var(--vm-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: isActive
                        ? "0 0 12px rgba(99, 102, 241, 0.25)"
                        : isCompleted
                          ? "0 0 8px rgba(16, 185, 129, 0.15)"
                          : "none",
                      flexShrink: 0,
                      marginTop: 2,
                    }}>
                      {isCompleted && (
                        <svg width="8" height="8" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                      {isActive && (
                        <div style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "white",
                        }} />
                      )}
                    </div>

                    {/* Connecting Line */}
                    {index < STATUS_STEPS.length - 1 && (
                      <div style={{
                        width: 2,
                        flex: 1,
                        minHeight: 20,
                        background: isCompleted
                          ? "rgba(16, 185, 129, 0.3)"
                          : "var(--vm-border)",
                        transition: "background 0.3s ease",
                      }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{
                    flex: 1,
                    paddingBottom: index < STATUS_STEPS.length - 1 ? 20 : 0,
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}>
                      <span style={{
                        fontSize: 14,
                        filter: isFuture ? "grayscale(0.8)" : "none",
                        opacity: isFuture ? 0.5 : 1,
                        transition: "all 0.2s",
                      }}>
                        {step.icon}
                      </span>
                      <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: isActive
                          ? "var(--vm-indigo-light)"
                          : isCompleted
                            ? "#10b981"
                            : "var(--vm-text)",
                        fontFamily: font.sans,
                        opacity: isFuture ? 0.5 : 1,
                        transition: "all 0.2s",
                      }}>
                        {step.title}
                      </span>
                      {isActive && (
                        <span style={{
                          fontSize: 8,
                          fontWeight: 700,
                          color: "var(--vm-indigo)",
                          background: "var(--vm-purple-bg)",
                          border: "1px solid var(--vm-purple-border-soft)",
                          borderRadius: 10,
                          padding: "2px 7px",
                          fontFamily: font.sans,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}>
                          Current
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontSize: 11.5,
                      color: "var(--vm-text)",
                      opacity: isFuture ? 0.4 : 0.68,
                      margin: 0,
                      fontFamily: font.sans,
                      lineHeight: 1.5,
                      transition: "opacity 0.2s",
                    }}>
                      {step.description}
                    </p>

                    {/* Tip (shown only for active step) */}
                    {isActive && step.tip && (
                      <div style={{
                        marginTop: 10,
                        padding: "10px 12px",
                        background: "var(--vm-purple-bg)",
                        border: "1px solid var(--vm-purple-border-soft)",
                        borderRadius: 8,
                        fontSize: 11,
                        color: "var(--vm-text)",
                        opacity: 0.85,
                        fontFamily: font.sans,
                        lineHeight: 1.5,
                        animation: "floatUp 300ms cubic-bezier(0.16, 1, 0.3, 1) both",
                      }}>
                        <span style={{ fontWeight: 700, color: "var(--vm-purple-soft)", marginRight: 4 }}>💡 Tip:</span>
                        {step.tip}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Tracking Links & Info */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {/* Track Your Application Card */}
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
                <span style={{ fontSize: 9.5 }}>🔗</span>
                <span style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: "var(--vm-purple-soft)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontFamily: font.sans,
                }}>
                  Quick Links
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
                Track Your Application
              </h3>
              <p style={{
                fontSize: 12.5,
                color: "var(--vm-text)",
                opacity: 0.72,
                margin: 0,
                fontFamily: font.sans,
                lineHeight: 1.5,
              }}>
                Use your reference number to check the latest status on the official tracking portals.
              </p>
            </div>

            {/* Tracking Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {TRACKING_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vm-floating-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{link.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "var(--vm-text)",
                      fontFamily: font.sans,
                      display: "block",
                    }}>
                      {link.name}
                    </span>
                    <span style={{
                      fontSize: 10.5,
                      color: "var(--vm-text)",
                      opacity: 0.55,
                      fontFamily: font.sans,
                    }}>
                      Track on official website
                    </span>
                  </div>
                  <svg width="12" height="12" fill="none" stroke="var(--vm-trans-white-45)" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Important Notes Card */}
          <div style={{
            background: "var(--vm-surface)",
            border: "1px solid var(--vm-border)",
            borderRadius: 12,
            padding: 24,
            boxShadow: premiumCardShadow,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <h4 style={{
                fontFamily: font.sans,
                fontSize: 14,
                fontWeight: 700,
                color: "var(--vm-text)",
                margin: 0,
              }}>
                Important Reminders
              </h4>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Do not book non-refundable flights or hotels until your visa is approved.",
                "Processing times may vary during peak seasons (summer, holidays).",
                "Check the embassy website for any public holiday closures.",
                "Keep your tracking reference number saved securely.",
              ].map((note, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}>
                  <span style={{
                    fontSize: 10,
                    color: "var(--vm-text)",
                    opacity: 0.35,
                    fontFamily: font.sans,
                    lineHeight: "18px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p style={{
                    fontSize: 12,
                    color: "var(--vm-text)",
                    opacity: 0.72,
                    margin: 0,
                    fontFamily: font.sans,
                    lineHeight: 1.5,
                  }}>
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
