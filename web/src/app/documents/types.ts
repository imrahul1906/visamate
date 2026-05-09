// app/documents/types.ts

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
  specialWidget?: "photo_spec" | "visa_form" | "itinerary";
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