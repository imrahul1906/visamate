"use client";

// web/src/features/documents/components/DocHelper.tsx

import type { DocumentItem, UploadsMap } from "@/types/document";
import type { ItineraryPlacesData } from "@/lib/data/types";
import PhotoSpecWidget from "../PhotoSpecWidget";
import VisaFormWidget from "../visa_form/VisaFormWidget";
import UploadSlot from "./UploadSlot";
import ItineraryWidget from "../itinerary/ItineraryWidget";
import CoverLetterBuilder from "../cover_letter/CoverLetterBuilder";
import SponsorConsentWidget from "../sponsor_consent/SponsorConsentWidget";
import DocumentChecklistWidget from "../DocumentChecklistWidget";

// ─────────────────────────────────────────────────────────────
// PhotoSpec — mirrors the shape in the requirements JSON.
// Keep in sync with RequirementsData["photoSpecifications"][key].
// ─────────────────────────────────────────────────────────────

export interface PhotoSpec {
  widthMm: number;
  heightMm: number;
  background?: string;
  colorFormat?: string;
  faceVisibilityPercent?: string;
  quality?: string;
  maxAgeMonths?: number;
}

// ─────────────────────────────────────────────────────────────
// DocHelper — renders the appropriate helper for a single doc.
// ─────────────────────────────────────────────────────────────

export interface DocHelperProps {
  doc: DocumentItem;
  color: string;
  uploads: UploadsMap;
  /** Photo spec pulled from RequirementsData.photoSpecifications */
  photoSpec?: PhotoSpec | null;
  /** Called with the File — caller is responsible for docId binding */
  onUpload: (file: File) => void;
  onRemove: () => void;
  onItineraryReady: (file: File) => void;
  onCoverLetterReady: (file: File) => void;
  onSponsorConsentReady: (file: File) => void;
  itineraryData?: ItineraryPlacesData | null;
  /** Pre-filled sponsor consent inputs sourced from the wizard/cover letter context */
  sponsorConsentPrefill?: Record<string, string>;
  /** Suppress the UploadSlot — used when the parent renders it inside a card instead */
  hideUpload?: boolean;
  onHelperToggle?: (isOpen: boolean) => void;
}

export function DocHelper({
  doc,
  color,
  uploads,
  photoSpec,
  onUpload,
  onRemove,
  onItineraryReady,
  onCoverLetterReady,
  onSponsorConsentReady,
  itineraryData,
  hideUpload,
  onHelperToggle,
}: DocHelperProps) {
  const wrappedUploads: UploadsMap = uploads;

  const handleUploadBridge = (docId: string, file: File) => {
    if (docId === doc.id) onUpload(file);
  };
  const handleRemoveBridge = (docId: string) => {
    if (docId === doc.id) onRemove();
  };

  return (
    <>
      {/* Photo spec widget — uses the spec referenced by the doc (photoSpecRef),
          falling back gracefully to defaults when no spec is provided. */}
      {doc.specialWidget === "photo_spec" && (
        <PhotoSpecWidget color={color} photoSpec={photoSpec ?? undefined} />
      )}

      {/* Visa form widget */}
      {doc.specialWidget === "visa_form" && (
        <VisaFormWidget doc={doc} color={color} onHelperToggle={onHelperToggle} />
      )}

      {/* Document checklist widget */}
      {doc.specialWidget === "document_checklist" && (
        <DocumentChecklistWidget doc={doc} />
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
        <CoverLetterBuilder onDocxReady={file => onCoverLetterReady(file)} />
      )}

      {/* Sponsor consent letter builder */}
      {doc.specialWidget === "sponsor_consent" && (
        <SponsorConsentWidget
          color={color}
          onDocxReady={file => onSponsorConsentReady(file)}
        />
      )}

      {/* Upload slot — not shown for hardcopy-only docs or when parent renders it */}
      {!doc.noUpload && !hideUpload && (
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
