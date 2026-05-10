"use client";

// app/documents/UploadSlot.tsx

import { useRef, useState } from "react";
import type { UploadsMap } from "./types";

// ─────────────────────────────────────────────────────────────
// UploadSlot — drag-and-drop / click file upload for a document
// ─────────────────────────────────────────────────────────────

export default function UploadSlot({
  docId,
  docName,
  color,
  uploads,
  onUpload,
  onRemove,
}: {
  docId: string;
  docName: string;
  color: string;
  uploads: UploadsMap;
  onUpload: (docId: string, file: File) => void;
  onRemove: (docId: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const uploaded = uploads[docId];

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    onUpload(docId, file);
  };

  return (
    <div
      onClick={e => e.stopPropagation()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      style={{
        marginTop: 10,
        border: uploaded
          ? `1.5px solid #22c55e`
          : dragging
            ? `1.5px dashed ${color}`
            : `1.5px dashed ${color}50`,
        borderRadius: 9,
        background: uploaded ? "#f0fdf4" : dragging ? `${color}08` : "#fafafa",
        padding: "10px 12px",
        transition: "all 180ms ease",
      }}
    >
      {uploaded ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: "#dcfce7",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", margin: 0 }}>File uploaded ✓</p>
            <p style={{ fontSize: 10, color: "#6b7280", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {uploaded.name} ({(uploaded.size / 1024).toFixed(0)} KB)
            </p>
          </div>
          <button
            onClick={() => onRemove(docId)}
            style={{
              border: "none", background: "#fee2e2", borderRadius: 6,
              padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 600, color: "#dc2626",
            }}
          >Remove</button>
        </div>
      ) : (
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => inputRef.current?.click()}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: `${color}14`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="14" height="14" fill="none" stroke={color} strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color, margin: 0 }}>Upload digital copy</p>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
              Optional — click or drag &amp; drop (PDF, JPG, PNG)
            </p>
          </div>
        </div>
      )}
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