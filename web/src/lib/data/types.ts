// lib/data/types.ts

export interface CountryInfo {
  id: string;
  code: string;
  name: string;
  description?: string;
  officialWebsite?: string;
  supportedVfsLocationCodes?: string[];
  vfs?: {
    website?: string;
    appointmentUrl?: string;
    appointmentVerificationUrl?: string;
  };
  metadata: {
    createdAt: string;
    lastUpdated: string;
    status: string;
  };
}

export interface VisaVariant {
  id: string;
  type: string;
  maxStayDays?: number;
  validityMonths?: number;
}

// ── VFS Charges ──────────────────────────────────────────────────────────────

export interface VfsChargeItem {
  charge: number;
  currency?: string;
  /** Free-text note, e.g. "Non-refundable" */
  note?: string;
  /** Explicitly set in JSON; takes precedence over note parsing */
  refundable?: boolean;
}

export interface VfsCourierCharge extends VfsChargeItem {
  optional?: boolean;
}

export interface VfsCharges {
  serviceCharge?: VfsChargeItem;
  courierCharges?: VfsCourierCharge;
}

// ── Process ───────────────────────────────────────────────────────────────────

export interface PaymentDraftRule {
  type: string;
  amount?: number;
  currency?: string;
  optional?: boolean;
  separateDraftRequired?: boolean;
  refundable?: boolean;
}

export interface PaymentInstruction {
  /**
   * The VFS centre this instruction belongs to.
   * Must match the locationCode used in VFS_CENTER_STORE, e.g. "DELHI".
   * This is the filter key — dropOffOffices is display-only context.
   */
  vfsCenterCode: string;
  /**
   * Drop-off offices within the VFS centre that have this exception,
   * e.g. ["GURUGRAM", "CHANDIGARH", "LUCKNOW"].
   * Used for display only — never used as a filter key.
   */
  dropOffOffices?: string[];
  paymentMode?: string;
  payableTo?: string;
  rules?: PaymentDraftRule[];
  notes?: string[];
}

export interface VisaProcess {
  /** Default process settings (applies to all centres unless overridden) */
  default?: {
    applicationMode?: string;
    biometricRequired?: boolean;
    interviewRequired?: boolean;
  };
  /** Centre-specific payment rules — only shown when the selected centre matches */
  paymentInstructions: PaymentInstruction[];
}

// ── VisaType ──────────────────────────────────────────────────────────────────

export interface VisaType {
  id: string;
  code: string;
  name: string;
  category?: string;
  variants?: VisaVariant[];

  /** Government visa fee (e.g. 500 for INR 500) */
  fees?: number;
  /** ISO currency code for fees, e.g. "INR" */
  currency?: string;
  /** Free-text note on the visa fee, used to derive refundability */
  note?: string;

  maxStayDays?: number;
  processingTime?: string | null;

  vfsCharges?: VfsCharges;
  process?: VisaProcess;

  metadata?: {
    status?: string;
    lastUpdated?: string;
    [key: string]: unknown;
  };
}

// ── Country / Catalog ─────────────────────────────────────────────────────────

export interface CountryVisaTypes {
  countryId: string;
  countryCode?: string;
  countryName?: string;
  visaTypes: VisaType[];
}

export interface RoutingEntry {
  id: string;
  locationId: string;
  locationCode?: string;
  countryCode?: string;
  destinationCountryId: string;
  authorityLabel?: string;
  states?: unknown[];
  description?: string;
  metadata?: Record<string, unknown>;
}

// ── VFS Center ────────────────────────────────────────────────────────────────

export interface OperatingHoursEntry {
  days: string;
  time: string;
  note?: string;
}

export interface OperatingHours {
  submissionIndividual: OperatingHoursEntry;
  submissionAgent: OperatingHoursEntry;
  passportCollection: OperatingHoursEntry;
}

export interface SecurityInfo {
  cctvSurveillance: boolean;
  mobilePhone: string;
  photography: string;
  itemsNotAllowed: string[];
  cloakingFacility: string;
}

export interface VfsCenterDetail {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  operatingHours: OperatingHours;
  security: SecurityInfo;
}

export interface VfsCenterInfo {
  id: string;
  code: string;
  name: string;
  state?: string;
  vfsCenter: VfsCenterDetail;
  metadata?: Record<string, unknown>;
}

// ── Requirements ──────────────────────────────────────────────────────────────

export interface PhotoSpec {
  widthMm: number;
  heightMm: number;
  background: string;
  colorFormat: string;
  faceVisibilityPercent: string;
  quality: string;
  maxAgeMonths: number;
  requirements: string[];
}

export interface DocumentItem {
  order: number;
  id: string;
  code: string;
  name: string;
  isRequired: boolean;
  optionality: string;
  description?: string;
  notes?: string;
  requirements?: string[];
  acceptedFormats?: string[];
  alternativeDocuments?: string[];
  applicableWhen?: {
    sponsorship?: string;
    applicantRolesAnyOf?: string[];
    accompaniedByDependent?: boolean;
  };
  photoSpecRef?: string;
  formUrl?: string;
}

export interface DocumentSection {
  sectionId: string;
  title: string;
  applicableWhen?: { sponsorship?: string };
  documents: DocumentItem[];
}

export interface RequirementsData {
  schemaVersion?: number;
  id: string;
  countryId: string;
  countryCode?: string;
  visaTypeId: string;
  visaTypeCode?: string;
  visaVariantId?: string;
  locationId: string;
  locationCode?: string;
  processingDays?: number | string | null;
  processingDaysExpress?: number | string | null;
  fees?: Record<string, unknown>;
  photoSpecifications?: PhotoSpec;
  documentSections?: DocumentSection[];
  importantNotes?: unknown[];
  metadata?: Record<string, unknown>;
}

// ── Itinerary ─────────────────────────────────────────────────────────────────

export interface ItineraryPlace {
  id: string;
  name: string;
  type: string;
  duration: string;
}

export interface ItineraryCity {
  name: string;
  places: ItineraryPlace[];
}

/** keyed by cityId, e.g. "tokyo", "paris" */
export type ItineraryCityMap = Record<string, ItineraryCity>;

export interface ItineraryPlacesData {
  /** ISO country code matching COUNTRY_CATALOG, e.g. "JP" */
  countryCode: string;
  /** Human-readable name passed straight to ItineraryWidget as `countryName` */
  countryName: string;
  cities: ItineraryCityMap;
  /** Maps place.type → hex colour, e.g. { Temple: "#8b5cf6" } */
  typeColors: Record<string, string>;
}