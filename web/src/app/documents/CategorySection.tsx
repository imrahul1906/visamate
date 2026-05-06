"use client";

// app/documents/CategorySection.tsx

import type { DocumentCategory, UploadsMap } from "./types";
import type { ItineraryPlacesData } from "@/lib/data/types";
import CategoryIcon from "./CategoryIcon";
import DocumentRow from "./DocumentRow";

// ─────────────────────────────────────────────────────────────
// CategorySection — groups DocumentRows under a labelled header
// with a mini progress bar
// ─────────────────────────────────────────────────────────────

export default function CategorySection({
  category,
  checked,
  onToggle,
  startDelay,
  uploads,
  onUpload,
  onRemove,
  onItineraryReady,
  itineraryData,
}: {
  category: DocumentCategory;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  startDelay: number;
  uploads: UploadsMap;
  onUpload: (docId: string, file: File) => void;
  onRemove: (docId: string) => void;
  onItineraryReady: (docId: string, file: File) => void;
  itineraryData?: ItineraryPlacesData | null;
}) {
  const total = category.documents.length;
  const done  = category.documents.filter(d => checked[d.id]).length;
  const pct   = total ? (done / total) * 100 : 0;

  return (
    <section style={{ marginBottom: 32 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: `${category.color}14`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <CategoryIcon type={category.icon} color={category.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{category.label}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: category.color,
              background: `${category.color}14`, padding: "2px 8px", borderRadius: 20,
            }}>{done}/{total}</span>
          </div>
          <div style={{ height: 3, background: "#f1f1ef", borderRadius: 2, marginTop: 5, width: 120, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: category.color, borderRadius: 2,
              transition: "width 400ms ease",
            }} />
          </div>
        </div>
      </div>

      {/* Document rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {category.documents.map((doc, i) => (
          <DocumentRow
            key={doc.id}
            doc={doc}
            checked={!!checked[doc.id]}
            onToggle={() => onToggle(doc.id)}
            color={category.color}
            animDelay={startDelay + i * 60}
            uploads={uploads}
            onUpload={onUpload}
            onRemove={onRemove}
            onItineraryReady={onItineraryReady}
            itineraryData={itineraryData}
          />
        ))}
      </div>
    </section>
  );
}