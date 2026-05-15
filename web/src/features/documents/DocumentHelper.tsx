"use client";

import type { DocumentItem, UploadsMap } from "../../types/document";
import type { ItineraryPlacesData } from "@/lib/data/types";
import PhotoSpecWidget from "./PhotoSpecWidget";
import VisaFormWidget from "./visa_form/VisaFormWidget";
import UploadSlot from "./util/UploadSlot";
import ItineraryWidget from "./itinerary/ItineraryWidget";
import CoverLetterWidget from "./cover_letter/CoverLetterWidget";

// ─────────────────────────────────────────────────────────────
// DocHelper — renders the appropriate helper for a single doc.
// ─────────────────────────────────────────────────────────────

export interface DocHelperProps {
  doc: DocumentItem;
  color: string;
  uploads: UploadsMap;
  /** Called with the File — caller is responsible for docId binding */
  onUpload: (file: File) => void;
  onRemove: () => void;
  onItineraryReady: (file: File) => void;
  onCoverLetterReady: (file: File) => void;
  itineraryData?: ItineraryPlacesData | null;
}

export function DocHelper({
  doc,
  color,
  uploads,
  onUpload,
  onRemove,
  onItineraryReady,
  onCoverLetterReady,
  itineraryData,
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
          onDocxReady={file => onItineraryReady(file)}
        />
      )}

      {/* Cover letter builder */}
      {doc.specialWidget === "cover_letter" && (
        <CoverLetterWidget onDocxReady={file => onCoverLetterReady(file)} />
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