"use client";

// web/src/features/documents/components/UploadSlot.tsx

import { useRef, useState, useEffect } from "react";
import type { UploadsMap } from "@/types/document";

// ─────────────────────────────────────────────────────────────
// UploadSlot — premium, attention-commanding upload CTA.
// Lives flush inside the "What You Need" card.
// ─────────────────────────────────────────────────────────────

export default function UploadSlot({
  docId,
  color,
  uploads,
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
    return (
      <div
        key="uploaded"
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

        <RemoveButton onClick={() => onRemove(docId)} />
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
