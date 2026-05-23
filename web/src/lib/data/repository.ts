/**
 * repository.ts — Data Access Layer
 *
 * Single source of truth for all data access in the app.
 * All reads go through this file. When you move from JSON → DB,
 * only replace the implementations here — component code stays the same.
 *
 * Pattern:
 *   JSON phase  → dynamic import() + Object.values(...).find(...)
 *   DB phase    → replace function bodies with: await db.table.findFirst(...)
 *
 * All functions are async. Even though data is static JSON right now,
 * async signatures ensure call sites need zero changes on DB migration.
 *
 * ─── VisaOverviewPanel data flow ──────────────────────────────────────────────
 *
 * VisaOverviewPanel is a pure display component — it never touches this file.
 * The parent (DocumentsContent or equivalent) is responsible for fetching:
 *
 *   const visaType = await getVisaType(countryCode, visaTypeCode);
 *   <VisaOverviewPanel visaType={visaType} countryName={...} visaTypeName={...} />
 *
 * This keeps the component fully portable: it works the same whether the
 * data comes from JSON today or a DB query tomorrow.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import type {
  CountryInfo,
  CountryVisaTypes,
  VisaType,
  RoutingEntry,
  VfsCenterInfo,
  RequirementsData,
  ItineraryPlacesData,
} from "./types";

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1 — UI CATALOG DATA
// Visual/display metadata only. Never mixes with structured DB-like data.
// ═══════════════════════════════════════════════════════════════════════════

export interface CountryCatalogEntry {
  code: string;
  name: string;
  photo: string;
  supported: boolean; // false → show as "coming soon"
}

export interface LocationCatalogEntry {
  code: string;  // uppercase; must match the locationCode in VFS_CENTER_STORE
  city: string;  // display name (e.g. "New Delhi")
  photo: string;
}

const COUNTRY_CATALOG: CountryCatalogEntry[] = [
  {
    code: "JP",
    name: "Japan",
    photo: "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=800",
    supported: true,
  },
  {
    code: "KR",
    name: "South Korea",
    photo: "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800",
    supported: false,
  },
  {
    code: "US",
    name: "United States",
    photo: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800",
    supported: false,
  },
  {
    code: "AU",
    name: "Australia",
    photo: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800",
    supported: false,
  },
  {
    code: "UK",
    name: "United Kingdom",
    photo: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=800",
    supported: false,
  },
  {
    code: "SG",
    name: "Singapore",
    photo: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800",
    supported: false,
  },
];

const LOCATION_CATALOG: LocationCatalogEntry[] = [
  {
    code: "DELHI",
    city: "New Delhi",
    photo: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800",
  },
  {
    code: "MUMBAI",
    city: "Mumbai",
    photo: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800",
  },
  {
    code: "BENGALURU",
    city: "Bengaluru",
    photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800",
  },
  {
    code: "CHENNAI",
    city: "Chennai",
    photo: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800",
  },
  {
    code: "KOLKATA",
    city: "Kolkata",
    photo: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=800",
  },
  {
    code: "HYDERABAD",
    city: "Hyderabad",
    photo: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=800",
  },
];

// Statically define the active VFS codes to avoid bundler bloating.
const ACTIVE_VFS_CODES = new Set(["DELHI", "MUMBAI", "BENGALURU", "CHENNAI", "KOLKATA"]);

interface FormFieldsJsonRaw {
  key: string;
  meta?: Record<string, unknown>;
  sections: Array<{
    id: string;
    label: string;
    icon?: string;
    fields: Array<{
      id: string;
      label: string;
      hint: string;
      example: string;
      warning?: string | null;
      formRef?: string | null;
    }>;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2 — KEY & VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function normalizeCode(code: string | undefined | null): string {
  if (!code || code.trim() === "") return "";
  return code.trim().toUpperCase();
}

function assertParam(value: string | undefined | null, name: string): void {
  if (!value || value.trim() === "") {
    throw new Error(`[repository] Missing required parameter: "${name}"`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3 — PUBLIC API
// All functions are async. Signatures are stable — components never change.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Full list of countries for the country picker.
 */
export async function getAllCountries(): Promise<CountryCatalogEntry[]> {
  return COUNTRY_CATALOG;
}

/**
 * Single country catalog entry by code.
 */
export async function getCountryCatalogEntry(
  code: string
): Promise<CountryCatalogEntry | null> {
  assertParam(code, "code");

  const result = COUNTRY_CATALOG.find(
    (c) => c.code === normalizeCode(code)
  ) ?? null;

  if (!result) {
    console.warn(`[repository] getCountryCatalogEntry: no entry found for code="${code}"`);
  }

  return result;
}

/**
 * Structured country info (from JSON / future DB).
 */
export async function getCountryInfo(
  countryCode: string
): Promise<CountryInfo | null> {
  assertParam(countryCode, "countryCode");
  const cc = normalizeCode(countryCode);
  if (cc === "JP") {
    return (await import("../../data/countries/japan/info.json")).default as CountryInfo;
  }

  console.warn(`[repository] getCountryInfo: no data found for countryCode="${countryCode}"`);
  return null;
}

/**
 * Visa types available for a given country.
 */
export async function getVisaTypes(countryCode: string): Promise<VisaType[]> {
  const record = await getCountryVisaTypes(countryCode);
  return record?.visaTypes ?? [];
}

/**
 * Full CountryVisaTypes record.
 */
export async function getCountryVisaTypes(
  countryCode: string
): Promise<CountryVisaTypes | null> {
  assertParam(countryCode, "countryCode");
  const cc = normalizeCode(countryCode);
  if (cc === "JP") {
    return (await import("../../data/countries/japan/visa-types.json")).default as CountryVisaTypes;
  }

  console.warn(`[repository] getCountryVisaTypes: no record found for countryCode="${countryCode}"`);
  return null;
}

/**
 * All locations that have real VFS center data.
 */
export async function getAllLocations(): Promise<LocationCatalogEntry[]> {
  return LOCATION_CATALOG.filter(
    (loc) => ACTIVE_VFS_CODES.has(normalizeCode(loc.code))
  );
}

/**
 * Locations valid for a given country.
 */
export async function getLocationsForCountry(
  countryCode: string
): Promise<LocationCatalogEntry[]> {
  assertParam(countryCode, "countryCode");

  const cc = normalizeCode(countryCode);
  const info = await getCountryInfo(countryCode);
  let allowedVfs: Set<string> | null = null;

  const fromInfo = info?.supportedVfsLocationCodes;
  if (fromInfo?.length) {
    allowedVfs = new Set(fromInfo.map((c) => normalizeCode(c)));
  }

  if (!allowedVfs) {
    // Fallback to JP active centers if not explicitly configured
    if (cc === "JP") {
      allowedVfs = new Set(["DELHI", "MUMBAI", "BENGALURU", "CHENNAI", "KOLKATA"]);
    } else {
      allowedVfs = new Set();
    }
  }

  const validLocations = LOCATION_CATALOG.filter(
    (loc) => {
      const code = normalizeCode(loc.code);
      return allowedVfs!.has(code) && ACTIVE_VFS_CODES.has(code);
    }
  );

  if (validLocations.length === 0) {
    console.warn(
      `[repository] getLocationsForCountry: no VFS centers found in VFS_CENTER_STORE for countryCode="${countryCode}".`
    );
  }

  return validLocations;
}

/**
 * VFS center details for a given location code.
 */
export async function getVfsCenterInfo(
  locationCode: string
): Promise<VfsCenterInfo | null> {
  assertParam(locationCode, "locationCode");
  const lc = normalizeCode(locationCode);

  switch (lc) {
    case "DELHI":
      return (await import("../../data/vfs_center/delhi.json")).default as VfsCenterInfo;
    case "MUMBAI":
      return (await import("../../data/vfs_center/mumbai.json")).default as VfsCenterInfo;
    case "BENGALURU":
      return (await import("../../data/vfs_center/bengaluru.json")).default as VfsCenterInfo;
    case "CHENNAI":
      return (await import("../../data/vfs_center/chennai.json")).default as VfsCenterInfo;
    case "KOLKATA":
      return (await import("../../data/vfs_center/kolkata.json")).default as VfsCenterInfo;
    default:
      console.warn(
        `[repository] getVfsCenterInfo: no VFS center found for locationCode="${locationCode}"`
      );
      return null;
  }
}

/**
 * Routing entry for a country + location pair.
 */
export async function getRoutingEntry(
  countryCode: string,
  locationCode: string
): Promise<RoutingEntry | null> {
  assertParam(countryCode, "countryCode");
  assertParam(locationCode, "locationCode");

  const cc = normalizeCode(countryCode);
  const lc = normalizeCode(locationCode);

  if (cc === "JP" && lc === "DELHI") {
    return (await import("../../data/countries/japan/routing/delhi.json")).default as RoutingEntry;
  }

  console.warn(
    `[repository] getRoutingEntry: no routing found for countryCode="${countryCode}", locationCode="${locationCode}"`
  );
  return null;
}

/**
 * Document requirements for a specific country + visa type + location.
 */
export async function getRequirementsData(
  countryCode: string,
  visaTypeCode: string,
  locationCode: string
): Promise<RequirementsData | null> {
  assertParam(countryCode, "countryCode");
  assertParam(visaTypeCode, "visaTypeCode");
  assertParam(locationCode, "locationCode");

  const cc = normalizeCode(countryCode);
  const vc = normalizeCode(visaTypeCode);
  const lc = normalizeCode(locationCode);

  if (cc === "JP" && vc === "TOURIST") {
    switch (lc) {
      case "DELHI":
        return (await import("../../data/requirements/japan-tourist-delhi.json")).default as RequirementsData;
      case "MUMBAI":
        return (await import("../../data/requirements/japan-tourist-mumbai.json")).default as RequirementsData;
      case "BENGALURU":
        return (await import("../../data/requirements/japan-tourist-bengaluru.json")).default as RequirementsData;
      case "CHENNAI":
        return (await import("../../data/requirements/japan-tourist-chennai.json")).default as RequirementsData;
      case "KOLKATA":
        return (await import("../../data/requirements/japan-tourist-kolkata.json")).default as RequirementsData;
    }
  }

  console.warn(
    `[repository] getRequirementsData: no requirements found for countryCode="${countryCode}", visaTypeCode="${visaTypeCode}", locationCode="${locationCode}"`
  );
  return null;
}

/**
 * Cities and attractions for the itinerary builder, keyed by country.
 */
export async function getItineraryPlaces(
  countryCode: string
): Promise<ItineraryPlacesData | null> {
  assertParam(countryCode, "countryCode");
  const cc = normalizeCode(countryCode);

  const countryKeys: Record<string, string> = {
    JP: "japan",
    FR: "france",
    IN: "india",
    TH: "thailand",
    IT: "italy",
    US: "usa",
    AE: "uae",
  };

  const key = countryKeys[cc];
  if (!key) {
    console.warn(`[repository] getItineraryPlaces: unsupported countryCode="${countryCode}"`);
    return null;
  }

  try {
    switch (key) {
      case "japan":
        return (await import("../../data/countries/japan/itinerary-places.json")).default as ItineraryPlacesData;
      case "france":
        return (await import("../../data/countries/france/itinerary-places.json")).default as ItineraryPlacesData;
      case "india":
        return (await import("../../data/countries/india/itinerary-places.json")).default as ItineraryPlacesData;
      case "thailand":
        return (await import("../../data/countries/thailand/itinerary-places.json")).default as ItineraryPlacesData;
      case "italy":
        return (await import("../../data/countries/italy/itinerary-places.json")).default as ItineraryPlacesData;
      case "usa":
        return (await import("../../data/countries/usa/itinerary-places.json")).default as ItineraryPlacesData;
      case "uae":
        return (await import("../../data/countries/uae/itinerary-places.json")).default as ItineraryPlacesData;
      default:
        return null;
    }
  } catch (err) {
    console.warn(`[repository] getItineraryPlaces: failed to import data for country="${key}":`, err);
    return null;
  }
}

// ─── Form Fill Field Types ─────────────────────────────────────────────────

export interface FormFillField {
  id: string;
  section: string;
  label: string;
  hint: string;
  example: string;
  warning: string | null;
  formRef: string | null;
}

/**
 * Flat list of form-fill fields for a given data key.
 */
export async function getFormFillFields(
  dataKey: string | null | undefined
): Promise<FormFillField[]> {
  if (!dataKey || dataKey.trim() === "") return [];

  const key = dataKey.trim();
  let record: FormFieldsJsonRaw | null = null;

  if (key === "JP_TOURIST_VISA_FORM_FIELDS_V1") {
    record = (await import("../../data/countries/japan/jp-tourist-visa-form-fields.json")).default as FormFieldsJsonRaw;
  }

  if (!record) {
    console.warn(
      `[repository] getFormFillFields: no form fields found for dataKey="${dataKey}".`
    );
    return [];
  }

  // Flatten sections → FormFillField[]
  return record.sections.flatMap((sec) =>
    sec.fields.map((f) => ({
      id: f.id,
      section: sec.label,
      label: f.label,
      hint: f.hint,
      example: f.example,
      warning: f.warning ?? null,
      formRef: f.formRef ?? null,
    }))
  );
}

/**
 * A single visa type for a given country + visa type code.
 */
export async function getVisaType(
  countryCode: string,
  visaTypeCode: string
): Promise<VisaType | null> {
  assertParam(countryCode, "countryCode");
  assertParam(visaTypeCode, "visaTypeCode");

  const cc = normalizeCode(countryCode);
  const vc = normalizeCode(visaTypeCode);

  const record = await getCountryVisaTypes(cc);
  if (!record) return null;

  const found =
    record.visaTypes.find(
      (v) => normalizeCode(v.code) === vc
    ) ?? null;

  if (!found) {
    console.warn(
      `[repository] getVisaType: no visa type "${visaTypeCode}" found for countryCode="${countryCode}"`
    );
  }

  return found;
}

/**
 * All visa types for a country filtered by category.
 */
export async function getVisaTypesByCategory(
  countryCode: string,
  category: string
): Promise<VisaType[]> {
  assertParam(countryCode, "countryCode");
  assertParam(category, "category");

  const all = await getVisaTypes(countryCode);
  const normalizedCategory = normalizeCode(category);

  return all.filter(
    (v) => normalizeCode(v.category) === normalizedCategory
  );
}