// src/types/document.ts
//
// Central type definitions for the document checklist feature.
// UI-layer types only. Raw JSON shapes live in lib/data/types.ts.
// mapRequirements.ts bridges the two.

export interface FormFillField {
  id: string;
  section: string;
  label: string;
  hint: string;
  example: string;
  warning?: string | null;
}

export interface VisaFormInfo {
  /** "DOWNLOADABLE" → PDF to download + print. "ONLINE" → portal URL. */
  type: "DOWNLOADABLE" | "ONLINE";
  downloadUrl?: string | null;
  onlineUrl?: string | null;
  requiresPrint?: boolean;
  formFillDataKey?: string | null;
}

/**
 * Named union for all special widget types.
 * Extend this when you add a new embedded tool — the compiler will
 * then flag every exhaustive switch that needs updating.
 */
export type SpecialWidget =
  | "photo_spec"
  | "visa_form"
  | "itinerary"
  | "cover_letter"
  | "document_checklist"
  | "sponsor_consent";

export interface DocumentItem {
  id: string;
  name: string;
  description?: string;
  status: "required" | "optional";
  category: string;
  tips?: string[];
  format?: string;
  notes?: string;
  form?: VisaFormInfo;
  acceptedFormats?: string[];
  noUpload?: boolean;
  specialWidget?: SpecialWidget;
  photoSpecRef?: string;
  // FIX: added to carry the PDF download URL for the document_checklist widget.
  // Populated by mapRequirements from doc.check_list_download_Url in the JSON.
  checkListDownloadUrl?: string;
}

export interface DocumentCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  documents: DocumentItem[];
}

export interface DocumentData {
  country: string;
  visaType: string;
  location: string;
  categories: DocumentCategory[];
}

// Uploaded files store: docId → File
export type UploadsMap = Record<string, File>;