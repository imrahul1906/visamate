"use client";

// web/src/features/documents/components/UploadSlot.tsx

import { useRef, useState, useEffect } from "react";
import type { UploadsMap, AiAuditResult } from "@/types/document";

// ─────────────────────────────────────────────────────────────
// UploadSlot — premium, attention-commanding upload CTA.
// Lives flush inside the "What You Need" card.
// ─────────────────────────────────────────────────────────────

export default function UploadSlot({
  docId,
  color,
  uploads,
  aiResult,
  onUpload,
  onRemove,
  noBorder = false,
  acceptedFormats,
  maxSizeBytes,
}: {
  docId: string;
  docName?: string;
  color?: string;
  uploads: UploadsMap;
  aiResult?: AiAuditResult;
  onUpload: (docId: string, file: File) => void;
  onRemove: (docId: string) => void;
  noBorder?: boolean;
  acceptedFormats?: string[];
  maxSizeBytes?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const uploaded = uploads[docId];

  const formatLabel = acceptedFormats && acceptedFormats.length > 0
    ? acceptedFormats.join(", ").toUpperCase()
    : "PDF, JPG, PNG";

  const acceptAttr = acceptedFormats && acceptedFormats.length > 0
    ? acceptedFormats.map(ext => ext.startsWith(".") ? ext : `.${ext}`).join(",")
    : ".pdf,.jpg,.jpeg,.png,.webp";

  // Entry animation trigger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setValidationError(null);

    // 1. File format validation
    if (acceptedFormats && acceptedFormats.length > 0) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const normalizedFormats = acceptedFormats.map((f) => f.toLowerCase().replace(".", ""));
      if (!normalizedFormats.includes(ext)) {
        setValidationError(`Invalid file format. Accepted: ${acceptedFormats.join(", ").toUpperCase()}`);
        return;
      }
    }

    // 2. File size validation
    if (maxSizeBytes && file.size > maxSizeBytes) {
      const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      setValidationError(`File size exceeds limit of ${sizeMb}MB.`);
      return;
    }

    onUpload(docId, file);
  };

  // ── Uploaded state ────────────────────────────────────────
  if (uploaded) {
    const removeBtn = <RemoveButton onClick={() => onRemove(docId)} />;

    // 1. AI Analysis Loading State
    if (aiResult?.loading) {
      return (
        <div
          key="ai-loading"
          onClick={e => e.stopPropagation()}
          style={{
            marginTop: noBorder ? 0 : 12,
            padding: "12px 14px",
            background: "var(--vm-trans-white-03)",
            border: "1px dashed var(--vm-border)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation: "vm-pulse-ring 2.4s ease-out infinite"
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes vm-spin {
              to { transform: rotate(360deg); }
            }
            @keyframes vm-sweep {
              0% { left: -100%; }
              100% { left: 200%; }
            }
            @keyframes vm-pulse-ring {
              0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.2); }
              70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
              100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
            }
          `}} />
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            border: "2.5px solid var(--vm-indigo)",
            borderTopColor: "transparent",
            animation: "vm-spin 0.8s linear infinite",
            flexShrink: 0
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 12, fontWeight: 700, margin: "0 0 4px",
              color: "var(--vm-indigo)", fontFamily: "'DM Sans', sans-serif",
            }}>
              AI Doctor is auditing your file...
            </p>
            <div style={{
              height: 4, background: "var(--vm-trans-white-05)", borderRadius: 2, overflow: "hidden", position: "relative"
            }}>
              <div style={{
                position: "absolute", top: 0, bottom: 0, left: 0, width: "35%", background: "var(--vm-indigo)",
                borderRadius: 2, animation: "vm-sweep 1.4s infinite ease-in-out"
              }} />
            </div>
          </div>
          {removeBtn}
        </div>
      );
    }

    // 2. AI Analysis Failed / Warning State
    if (aiResult && !aiResult.passed && !aiResult.error) {
      return (
        <div
          key="ai-failed"
          onClick={e => e.stopPropagation()}
          style={{
            marginTop: noBorder ? 0 : 12,
            paddingTop: noBorder ? 0 : 12,
            borderTop: noBorder ? "none" : "1px solid var(--vm-border)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Orange caution icon */}
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "var(--vm-amber-bg)",
              border: "1px solid var(--vm-amber-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" fill="none" stroke="var(--vm-amber)" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 12, fontWeight: 700, margin: "0 0 2px",
                color: "var(--vm-amber)", fontFamily: "'DM Sans', sans-serif",
              }}>
                ⚠ AI Doctor Audit Warnings
              </p>
              <p style={{
                fontSize: 10.5, margin: 0, fontFamily: "'DM Sans', sans-serif",
                color: "var(--vm-trans-white-45)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {uploaded.name} · {(uploaded.size / 1024).toFixed(0)} KB
              </p>
            </div>
            {removeBtn}
          </div>

          <div style={{
            background: "var(--vm-amber-bg)",
            border: "1px solid var(--vm-amber-border)",
            borderRadius: 8,
            padding: "9px 12px",
            fontSize: 11.5,
            color: "var(--vm-amber)",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.45
          }}>
            <strong>Recommendation:</strong> {aiResult.reason || "We found compliance issues with this file."}
          </div>

          {aiResult.checks && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 8,
              background: "var(--vm-trans-white-02)",
              border: "1px solid var(--vm-border)",
              borderRadius: 8,
              padding: "8px 10px"
            }}>
              {Object.entries(aiResult.checks).map(([checkKey, checkVal]) => {
                const label = checkKey
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, str => str.toUpperCase());
                return (
                  <div key={checkKey} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {checkVal ? (
                      <svg width="12" height="12" fill="none" stroke="var(--vm-green-dark)" strokeWidth={2.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" fill="none" stroke="var(--vm-red)" strokeWidth={2.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: checkVal ? "var(--vm-green-dark)" : "var(--vm-red)",
                      fontFamily: "'DM Sans', sans-serif"
                    }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // 3. AI Analysis Success State
    if (aiResult && aiResult.passed) {
      return (
        <div
          key="ai-passed"
          onClick={e => e.stopPropagation()}
          style={{
            marginTop: noBorder ? 0 : 12,
            paddingTop: noBorder ? 0 : 12,
            borderTop: noBorder ? "none" : "1px solid var(--vm-border)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Green verified icon */}
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "var(--vm-green-bg)",
              border: "1px solid var(--vm-green-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" fill="none" stroke="#4ade80" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 12, fontWeight: 700, margin: "0 0 2px",
                color: "var(--vm-green-dark)", fontFamily: "'DM Sans', sans-serif",
              }}>
                ✓ AI Doctor Approved
              </p>
              <p style={{
                fontSize: 10.5, margin: 0, fontFamily: "'DM Sans', sans-serif",
                color: "var(--vm-trans-white-45)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {uploaded.name} · {(uploaded.size / 1024).toFixed(0)} KB
              </p>
            </div>
            {removeBtn}
          </div>

          <div style={{
            background: "var(--vm-green-bg)",
            border: "1px solid var(--vm-green-border)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 11,
            color: "var(--vm-green-dark)",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.45
          }}>
            {aiResult.reason || "This document meets all format, quality, and validity checks."}
          </div>
        </div>
      );
    }

    // 4. AI Analysis Error/Bypassed State
    if (aiResult?.error) {
      return (
        <div
          key="ai-error"
          onClick={e => e.stopPropagation()}
          style={{
            marginTop: noBorder ? 0 : 12,
            paddingTop: noBorder ? 0 : 12,
            borderTop: noBorder ? "none" : "1px solid var(--vm-border)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "var(--vm-trans-white-05)",
              border: "1px solid var(--vm-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" fill="none" stroke="var(--vm-text-muted)" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 12, fontWeight: 700, margin: "0 0 2px",
                color: "var(--vm-text)", fontFamily: "'DM Sans', sans-serif",
              }}>
                AI Verification Bypassed
              </p>
              <p style={{
                fontSize: 10.5, margin: 0, fontFamily: "'DM Sans', sans-serif",
                color: "var(--vm-trans-white-45)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {uploaded.name} · {(uploaded.size / 1024).toFixed(0)} KB
              </p>
            </div>
            {removeBtn}
          </div>

          <div style={{
            background: "var(--vm-trans-white-03)",
            border: "1px solid var(--vm-border)",
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 10.5,
            color: "var(--vm-trans-white-45)",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.4
          }}>
            AI review was bypassed ({aiResult.error}). Your file is still attached and ready for download.
          </div>
        </div>
      );
    }

    // 5. Default Fallback Uploaded State (e.g. if aiResult is not defined yet, but file is uploaded)
    return (
      <div
        key="uploaded-fallback"
        onClick={e => e.stopPropagation()}
        style={{
          marginTop: noBorder ? 0 : 12,
          paddingTop: noBorder ? 0 : 12,
          borderTop: noBorder ? "none" : "1px solid var(--vm-border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          animation: "uploadSuccess 400ms cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Green file icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "var(--vm-green-bg)",
          border: "1px solid var(--vm-green-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="15" height="15" fill="none" stroke="#4ade80" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>

        {/* File details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 12, fontWeight: 700, margin: "0 0 2px",
            color: "var(--vm-green-dark)", fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.01em",
          }}>
            ✓ File ready to submit
          </p>
          <p style={{
            fontSize: 10.5, margin: 0, fontFamily: "'DM Sans', sans-serif",
            color: "var(--vm-trans-white-45)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {uploaded.name}
            <span style={{ marginLeft: 6, opacity: 0.6 }}>
              · {(uploaded.size / 1024).toFixed(0)} KB
            </span>
          </p>
        </div>
        {removeBtn}
      </div>
    );
  }

  // ── Empty / drag state ────────────────────────────────────
  const isActive = dragging || hovered;

  return (
    <div
      key="empty"
      onClick={e => e.stopPropagation()}
      style={{
        marginTop: noBorder ? 0 : 12,
        paddingTop: noBorder ? 0 : 12,
        borderTop: noBorder ? "none" : "1px solid var(--vm-border)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 380ms ease, transform 380ms cubic-bezier(0.34,1.2,0.64,1)",
      }}
    >


      <div
        role="button"
        tabIndex={0}
        aria-label="Attach digital copy"
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault(); setDragging(false); setHovered(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "13px 16px",
          borderRadius: 12,
          cursor: "pointer",
          userSelect: "none",
          position: "relative",
          overflow: "hidden",
          transition: "all 220ms cubic-bezier(0.4,0,0.2,1)",
          border: dragging
            ? `1px solid ${color ?? "var(--vm-purple)"}`
            : isActive
              ? `1px solid ${color ?? "var(--vm-purple)"}`
              : "1px solid var(--vm-border)",
          background: dragging
            ? "var(--vm-purple-bg)"
            : isActive
              ? "var(--vm-purple-bg-muted)"
              : "var(--vm-trans-white-02)",
          boxShadow: isActive ? "var(--vm-card-shadow)" : "none",
        }}
      >
        {/* Shimmer sweep on hover */}
        {isActive && (
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(105deg, transparent 30%, var(--vm-trans-white-05) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s linear infinite",
          }} />
        )}

        {/* Animated upload icon */}
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 220ms ease",
          background: isActive
            ? "var(--vm-purple-bg)"
            : "var(--vm-purple-bg-muted)",
          border: isActive
            ? "1px solid var(--vm-purple-border)"
            : "1px solid var(--vm-purple-border-soft)",
          animation: !isActive ? "pulseRing 2.4s ease-out infinite" : "none",
          boxShadow: isActive ? "0 0 16px var(--vm-purple-shadow)" : "none",
        }}>
          <svg
            width="15" height="15" fill="none"
            stroke={color ?? "var(--vm-indigo)"}
            strokeWidth={1.75} viewBox="0 0 24 24"
            style={{
              transition: "stroke 220ms ease",
              animation: isActive ? "iconFloat 1s ease-in-out infinite" : "none",
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        {/* Label block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 700, margin: "0 0 3px",
            fontFamily: "'DM Sans', sans-serif",
            color: isActive ? "var(--vm-indigo-mid)" : "var(--vm-text)",
            transition: "color 220ms ease",
            letterSpacing: "-0.01em",
          }}>
            {dragging ? "Drop it here" : "Got a digital copy? Attach it"}
          </p>
          <p style={{
            fontSize: 11, margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            color: isActive ? "var(--vm-indigo-mid)" : "var(--vm-trans-white-45)",
            transition: "color 220ms ease",
          }}>
            {dragging
              ? "Release to attach your file"
              : acceptedFormats && acceptedFormats.length > 0
                ? "Optional (only used to help validate format & size) · Drag & drop or click"
                : `Optional (only used to help validate format & size) · ${formatLabel} · Drag & drop or click`}
          </p>
        </div>

        {/* Right CTA chip */}
        <div style={{
          flexShrink: 0,
          padding: "5px 11px",
          borderRadius: 7,
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.02em",
          transition: "all 220ms ease",
          background: isActive
            ? "var(--vm-purple-bg)"
            : "var(--vm-purple-bg-muted)",
          border: isActive
            ? "1px solid var(--vm-purple-border)"
            : "1px solid var(--vm-purple-border-soft)",
          color: color ?? "var(--vm-indigo)",
          whiteSpace: "nowrap",
        }}>
          {dragging ? "Drop" : "Browse"}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        style={{ display: "none" }}
        onChange={e => handleFile(e.target.files?.[0])}
      />

      {validationError && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 8,
          paddingLeft: 4,
        }}>
          <svg width="12" height="12" fill="none" stroke="var(--vm-red)" strokeWidth={2.2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" />
          </svg>
          <span style={{ fontSize: 10.5, color: "var(--vm-red)", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            {validationError}
          </span>
        </div>
      )}

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        marginTop: 6,
        paddingLeft: 4,
        opacity: isActive ? 0.85 : 0.5,
        transition: "opacity 220ms ease"
      }}>
        <svg width="10.5" height="10.5" fill="none" stroke="var(--vm-trans-white-65)" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span style={{ fontSize: 9.5, color: "var(--vm-trans-white-55)", fontFamily: "'DM Sans', sans-serif" }}>
          In-browser processing · Zero server storage · Your data stays local
        </span>
      </div>
    </div>
  );
}

// ─── Remove button ────────────────────────────────────────────
function RemoveButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        border: hovered
          ? "1px solid var(--vm-red)"
          : "1px solid var(--vm-red-border)",
        background: hovered
          ? "var(--vm-red-bg)"
          : "var(--vm-trans-white-02)",
        borderRadius: 7,
        padding: "5px 12px",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        color: hovered ? "var(--vm-red)" : "var(--vm-trans-white-55)",
        transition: "all 160ms ease",
        letterSpacing: "0.01em",
      }}
    >
      Remove
    </button>
  );
}
