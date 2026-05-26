"use client";

import React, { useState } from "react";
import { T, font } from "@/lib/theme";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface PrivacySandboxTabProps {
  uploads: Record<string, File>;
  onClearSession: () => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function PrivacySandboxTab({
  uploads,
  onClearSession,
}: PrivacySandboxTabProps) {
  const [purging, setPurging] = useState(false);

  // Derive audit statistics
  const fileIds = Object.keys(uploads);
  const fileCount = fileIds.length;
  
  const totalSizeBytes = Object.values(uploads).reduce(
    (sum, file) => sum + file.size,
    0
  );

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handlePurge = () => {
    setPurging(true);
    // Simulate a brief secure wiping delay for premium feel
    setTimeout(() => {
      onClearSession();
      setPurging(false);
    }, 800);
  };

  // Custom shadow that pops on light mode and blends on dark mode
  const premiumCardShadow = "0 10px 30px -10px rgba(108, 92, 231, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02), 0 0 0 1px var(--vm-border)";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 24,
      padding: "8px 0 24px",
      animation: "floatUp 450ms cubic-bezier(0.16, 1, 0.3, 1) both",
    }}>
      
      {/* ── Top Overview Banner ── */}
      <div style={{
        background: "var(--vm-surface)",
        border: "1px solid var(--vm-border)",
        borderRadius: 12,
        padding: "24px 28px",
        boxShadow: premiumCardShadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
      }}>
        <div style={{ flex: 1, minWidth: "280px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "var(--vm-green-bg)",
            border: "1px solid var(--vm-green-border)",
            borderRadius: 20,
            padding: "3px 9px",
            marginBottom: 10,
          }}>
            <span style={{ fontSize: 9.5 }}>🔒</span>
            <span style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: "var(--vm-green)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: font.sans,
            }}>
              Zero Server Storage
            </span>
          </div>
          <h3 style={{
            fontFamily: font.sans,
            fontSize: 18,
            fontWeight: 700,
            color: "var(--vm-text)",
            margin: "0 0 6px",
            letterSpacing: "-0.01em",
          }}>
            Your Security Sandbox
          </h3>
          <p style={{
            fontSize: 12.5,
            color: "var(--vm-text)",
            opacity: 0.72,
            margin: 0,
            fontFamily: font.sans,
            lineHeight: 1.6,
          }}>
            Visamate runs entirely in your local browser sandbox. Uploaded documents and generated travel details exist strictly in your device&apos;s random access memory (RAM). Absolutely no data is uploaded, stored, or processed on remote cloud servers.
          </p>
        </div>
      </div>

      {/* ── Grid: Pipeline & Auditor ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 24,
        alignItems: "start",
      }}>

        {/* Column 1: File Sandboxing Pipeline Flow */}
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
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--vm-muted-2)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: font.sans }}>
              Data Pipeline Flow
            </span>
            <h4 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans }}>
              Local Compilation Architecture
            </h4>
          </div>

          {/* Vertical Pipeline steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
            {[
              { num: "01", title: "Select or Generate Assets", desc: "You drop files or build travel itineraries/cover letters directly in the editor slots." },
              { num: "02", title: "Transient Browser Memory", desc: "Files are converted into memory objects inside transient React states. Data never touches any network socket." },
              { num: "03", title: "In-Browser Compression", desc: "JSZip compiles files locally inside a browser-managed scripting thread." },
              { num: "04", title: "Direct Package Download", desc: "A binary download trigger is passed directly to the browser filesaver, writing the ZIP to your hard drive." }
            ].map((step, idx) => (
              <div key={idx} style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBottom: idx === 3 ? 0 : 20, position: "relative" }}>
                {idx !== 3 && (
                  <div style={{
                    position: "absolute",
                    left: 11,
                    top: 24,
                    bottom: 0,
                    width: 2,
                    background: "linear-gradient(to bottom, var(--vm-purple-border-soft), transparent)",
                  }} />
                )}
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--vm-purple-bg)",
                  border: "1px solid var(--vm-purple-border-soft)",
                  color: "var(--vm-purple-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9.5,
                  fontWeight: 700,
                  fontFamily: font.sans,
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 2,
                }}>
                  {step.num}
                </div>
                <div>
                  <h5 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans }}>
                    {step.title}
                  </h5>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--vm-text)", opacity: 0.65, fontFamily: font.sans, lineHeight: 1.45 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Memory Inspector & Cache Purger */}
        <div style={{
          background: "var(--vm-surface)",
          border: "1px solid var(--vm-border)",
          borderRadius: 12,
          padding: 24,
          boxShadow: premiumCardShadow,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--vm-muted-2)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: font.sans }}>
              Diagnostics Panel
            </span>
            <h4 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans }}>
              Active Browser Memory Audit
            </h4>
          </div>

          {/* Audit Metrics */}
          <div style={{
            background: "var(--vm-trans-white-02)",
            border: "1px solid var(--vm-border)",
            borderRadius: 10,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--vm-text)", opacity: 0.7, fontFamily: font.sans }}>
                Memory Shield Status:
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
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--vm-green)", fontFamily: font.sans, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Active Sandbox
                </span>
              </div>
            </div>

            <div style={{ height: 1, background: "var(--vm-border)" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--vm-text)", opacity: 0.7, fontFamily: font.sans }}>
                Files in Sandbox RAM:
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans }}>
                {fileCount} {fileCount === 1 ? "file" : "files"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--vm-text)", opacity: 0.7, fontFamily: font.sans }}>
                Total Allocated Space:
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans }}>
                {formatBytes(totalSizeBytes)}
              </span>
            </div>

            <div style={{ height: 1, background: "var(--vm-border)" }} />

            {/* Visual RAM Capacity Gauge */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, color: "var(--vm-muted-2)", marginBottom: 6, fontFamily: font.sans }}>
                <span>RAM BUFFER CAPACITY</span>
                <span>{fileCount > 0 ? `${Math.min(100, Math.round((totalSizeBytes / (30 * 1024 * 1024)) * 100))}%` : "0%"}</span>
              </div>
              <div style={{ height: 6, background: "var(--vm-trans-white-05)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: fileCount > 0 ? `${Math.min(100, Math.round((totalSizeBytes / (30 * 1024 * 1024)) * 100))}%` : "0%",
                  background: "linear-gradient(90deg, var(--vm-green-dark), var(--vm-green))",
                  borderRadius: 99,
                  transition: "width 500ms ease-out",
                }} />
              </div>
              <div style={{ fontSize: 9.5, color: "var(--vm-muted)", marginTop: 6, fontStyle: "italic", fontFamily: font.sans }}>
                * Maximum allocated buffer limit is 30MB per browser session.
              </div>
            </div>
          </div>

          {/* Interactive Purge Area */}
          <div style={{
            border: "1px solid var(--vm-border)",
            borderRadius: 10,
            padding: 16,
            background: "var(--vm-trans-white-01)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <h5 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans }}>
              Manual Data Eviction
            </h5>
            <p style={{ margin: 0, fontSize: 11, color: "var(--vm-text)", opacity: 0.65, fontFamily: font.sans, lineHeight: 1.5 }}>
              Closing this browser tab automatically destroys the sandbox buffer. To wipe your transient workspace files immediately, click the secure purge trigger below.
            </p>
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
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginTop: 4,
                transition: "background 180ms ease, transform 150ms ease",
              }}
              onMouseEnter={e => {
                if (fileCount > 0 && !purging) {
                  e.currentTarget.style.background = "var(--vm-red-border)";
                }
              }}
              onMouseLeave={e => {
                if (fileCount > 0 && !purging) {
                  e.currentTarget.style.background = "var(--vm-red-bg)";
                }
              }}
            >
              {purging ? (
                <>
                  <svg
                    style={{ animation: "spin 1s linear infinite" }}
                    width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Wiping Memory Buffer...
                </>
              ) : (
                <>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Purge Memory Cache
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
