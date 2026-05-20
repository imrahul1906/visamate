"use client";

// app/documents/UploadSlot.tsx

import { useRef, useState, useEffect } from "react";
import type { UploadsMap } from "../../../types/document";

// ─────────────────────────────────────────────────────────────
// UploadSlot — premium, attention-commanding upload CTA.
// Lives flush inside the "What You Need" card.
// ─────────────────────────────────────────────────────────────

export default function UploadSlot({
  docId,
  uploads,
  onUpload,
  onRemove,
}: {
  docId: string;
  docName?: string;
  color?: string;
  uploads: UploadsMap;
  onUpload: (docId: string, file: File) => void;
  onRemove: (docId: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const uploaded = uploads[docId];

  // Entry animation trigger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    onUpload(docId, file);
  };

  // ── Uploaded state ────────────────────────────────────────
  if (uploaded) {
    return (
      <div
        onClick={e => e.stopPropagation()}
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          animation: "uploadSuccess 400ms cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`
          @keyframes uploadSuccess {
            from { opacity: 0; transform: scale(0.95) translateY(4px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes pulseRing {
            0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
            70%  { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
            100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
          }
          @keyframes floatUp {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes iconBounce {
            0%   { transform: translateY(0); }
            30%  { transform: translateY(-3px); }
            60%  { transform: translateY(1px); }
            100% { transform: translateY(0); }
          }
        `}</style>

        {/* Green file icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "rgba(74,222,128,0.1)",
          border: "1px solid rgba(74,222,128,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 12px rgba(74,222,128,0.15)",
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
            color: "#4ade80", fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.01em",
          }}>
            ✓ File ready to submit
          </p>
          <p style={{
            fontSize: 10.5, margin: 0, fontFamily: "'DM Sans', sans-serif",
            color: "rgba(255,255,255,0.35)",
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
      onClick={e => e.stopPropagation()}
      style={{
        marginTop: 12,
        paddingTop: 12,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 380ms ease, transform 380ms cubic-bezier(0.34,1.2,0.64,1)",
      }}
    >
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.35); }
          70%  { box-shadow: 0 0 0 7px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-2px); }
        }
        @keyframes uploadSuccess {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

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
            ? "1px solid rgba(99,102,241,0.7)"
            : isActive
              ? "1px solid rgba(99,102,241,0.45)"
              : "1px solid rgba(99,102,241,0.22)",
          background: dragging
            ? "rgba(99,102,241,0.13)"
            : isActive
              ? "rgba(99,102,241,0.09)"
              : "rgba(99,102,241,0.05)",
          boxShadow: isActive
            ? "0 0 0 3px rgba(99,102,241,0.1), 0 4px 20px rgba(99,102,241,0.12)"
            : "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {/* Shimmer sweep on hover */}
        {isActive && (
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(105deg, transparent 30%, rgba(165,180,252,0.06) 50%, transparent 70%)",
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
            ? "rgba(99,102,241,0.2)"
            : "rgba(99,102,241,0.1)",
          border: isActive
            ? "1px solid rgba(99,102,241,0.5)"
            : "1px solid rgba(99,102,241,0.25)",
          animation: !isActive ? "pulseRing 2.4s ease-out infinite" : "none",
          boxShadow: isActive ? "0 0 16px rgba(99,102,241,0.25)" : "none",
        }}>
          <svg
            width="15" height="15" fill="none"
            stroke={isActive ? "#c7d2fe" : "#818cf8"}
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
            color: isActive ? "#e0e7ff" : "rgba(255,255,255,0.88)",
            transition: "color 220ms ease",
            letterSpacing: "-0.01em",
          }}>
            {dragging ? "Drop it here" : "Got a digital copy? Attach it"}
          </p>
          <p style={{
            fontSize: 11, margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            color: isActive ? "rgba(165,180,252,0.7)" : "rgba(255,255,255,0.38)",
            transition: "color 220ms ease",
          }}>
            {dragging ? "Release to attach your file" : "Optional · PDF, JPG, PNG · Drag & drop or click"}
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
            ? "rgba(99,102,241,0.25)"
            : "rgba(99,102,241,0.12)",
          border: isActive
            ? "1px solid rgba(99,102,241,0.5)"
            : "1px solid rgba(99,102,241,0.2)",
          color: isActive ? "#c7d2fe" : "#818cf8",
          whiteSpace: "nowrap",
        }}>
          {dragging ? "Drop" : "Browse"}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        style={{ display: "none" }}
        onChange={e => handleFile(e.target.files?.[0])}
      />
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
          ? "1px solid rgba(239,68,68,0.4)"
          : "1px solid rgba(239,68,68,0.18)",
        background: hovered
          ? "rgba(239,68,68,0.14)"
          : "rgba(239,68,68,0.06)",
        borderRadius: 7,
        padding: "5px 12px",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        color: hovered ? "#fca5a5" : "rgba(239,68,68,0.55)",
        transition: "all 160ms ease",
        letterSpacing: "0.01em",
      }}
    >
      Remove
    </button>
  );
}