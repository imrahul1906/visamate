// Type definitions generated from JSON schemas

export interface CountryInfo {
  id: string;
  code: string;
  name: string;
  description?: string;
  officialWebsite?: string;
  supportedVfsLocationCodes?: string[],
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

export interface VisaType {
  id: string;
  code: string;
  name: string;
  category?: string;
  variants?: VisaVariant[];
  process?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

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
  processingDays?: number | null;
  processingDaysExpress?: number | null;
  fees?: Record<string, unknown>;
  photoSpecifications?: PhotoSpec;
  documentSections?: DocumentSection[];
  importantNotes?: unknown[];
  metadata?: Record<string, unknown>;
}

// lib/data/types.ts
// ─────────────────────────────────────────────────────────────
// Add the four itinerary types below to your existing types.ts.
// Everything above this comment is your existing file — unchanged.
// ─────────────────────────────────────────────────────────────

// ── Itinerary types ──────────────────────────────────────────
// Used by ItineraryWidget (generic) and repository.getItineraryPlaces().
// Shape mirrors what was in japanData.ts, now generic across countries.

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
