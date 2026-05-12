"use client";

// app/documents/CategorySection.tsx

import type { DocumentCategory, DocumentItem, UploadsMap } from "./types";
import type { ItineraryPlacesData } from "@/lib/data/types";
import CategoryIcon from "./CategoryIcon";
import DocumentRow from "./DocumentRow";
import PhotoSpecWidget from "./PhotoSpecWidget";
import VisaFormWidget from "./visa_form/VisaFormWidget";
import UploadSlot from "./UploadSlot";
import ItineraryWidget from "./itinerary/ItineraryWidget";
import CoverLetterWidget from "./cover_letter/CoverLetterWidget";

// ─────────────────────────────────────────────────────────────
// DocHelper — renders the appropriate helper for a single doc.
//
// Extracted from DocumentRow's expanded panel so the new focus
// drawer in DocumentsContent can render it directly without
// duplicating the conditional widget logic.
//
// Props use flat callbacks (no docId) so the caller controls
// which docId these actions apply to.
// ─────────────────────────────────────────────────────────────

export interface DocHelperProps {
  doc: DocumentItem;
  color: string;
  uploads: UploadsMap;
  /** Called with the File — caller is responsible for docId binding */
  onUpload: (file: File) => void;
  onRemove: () => void;
  onItineraryReady: (file: File) => void;
  itineraryData?: ItineraryPlacesData | null;
  applicantContext?: {
    applicantName: string;
    passportNo: string;
    sponsorshipType: "self" | "sponsored";
    applicantProfile: "employed" | "student" | "self-employed";
    travelStartDate: string;
    travelDuration: number;
    cities: string[];
  };
}

export function DocHelper({
  doc,
  color,
  uploads,
  onUpload,
  onRemove,
  onItineraryReady,
  itineraryData,
  applicantContext,
}: DocHelperProps) {
  // Wrap the flat callbacks back into the docId-keyed signatures
  // that each widget / UploadSlot expects.
  const wrappedUploads: UploadsMap = uploads;

  const handleUploadBridge = (docId: string, file: File) => {
    if (docId === doc.id) onUpload(file);
  };
  const handleRemoveBridge = (docId: string) => {
    if (docId === doc.id) onRemove();
  };

  return (
    <>
      {/* Photo spec widget */}
      {doc.specialWidget === "photo_spec" && (
        <PhotoSpecWidget color={color} />
      )}

      {/* Visa form widget */}
      {doc.specialWidget === "visa_form" && (
        <VisaFormWidget doc={doc} color={color} />
      )}

      {/* Itinerary builder */}
      {doc.specialWidget === "itinerary" && itineraryData && (
        <ItineraryWidget
          color={color}
          countryName={itineraryData.countryName}
          cities={itineraryData.cities}
          typeColors={itineraryData.typeColors}
          onPdfReady={file => onItineraryReady(file)}
        />
      )}

      {/* Cover letter builder */}
      {doc.specialWidget === "cover_letter" && (
        <CoverLetterWidget applicantContext={applicantContext} />
      )}

      {/* Upload slot — not shown for hardcopy-only docs */}
      {!doc.noUpload && (
        <div style={{ marginTop: doc.specialWidget ? 14 : 0 }}>
          <UploadSlot
            docId={doc.id}
            docName={doc.name}
            color={color}
            uploads={wrappedUploads}
            onUpload={handleUploadBridge}
            onRemove={handleRemoveBridge}
          />
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// CategorySection — groups DocumentRows under a labelled header
// with a mini progress bar.
//
// Unchanged from original — still used as a fallback / for any
// non-drawer views. DocumentRow continues to use its own inline
// helper rendering for the accordion expand UX.
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
  const done = category.documents.filter(d => checked[d.id]).length;
  const pct = total ? (done / total) * 100 : 0;

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