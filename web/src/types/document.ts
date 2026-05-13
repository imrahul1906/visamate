// src/types/document.ts
//
// Central type definitions for the document checklist feature.
// Previously lived at app/documents/types.ts — moved to src/types/document.ts
// so it can be imported by both the checklist and the shared/ components
// without creating circular deps.
//
// CHANGED from original:
//   - Extracted SpecialWidget as a named export (was an anonymous inline union)
//     and DocumentsContent but missing from the type, which caused implicit `any`
//     and would silently break any exhaustive switch.

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
  /**
   * Key used to load form-fill field data.
   * Maps to a key in FORM_FILL_DATA_STORE (Phase 1).
   * In Phase 2, pass this key to your storage/API layer.
   */
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
  | "cover_letter";

export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  status: "required" | "optional";
  category: string;
  tips?: string[];
  format?: string;
  notes?: string;
  form?: VisaFormInfo;
  acceptedFormats?: string[];
  noUpload?: boolean;
  specialWidget?: SpecialWidget;
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