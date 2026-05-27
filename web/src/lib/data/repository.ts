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
  visaTypeLabel?: string;
  folder?: string;
}

export interface LocationCatalogEntry {
  code: string;  // uppercase; must match the locationCode in VFS_CENTER_STORE
  city: string;  // display name (e.g. "New Delhi")
  photo: string;
  active?: boolean;
}

import COUNTRY_CATALOG_JSON from "../../data/countries-catalog.json";
import LOCATION_CATALOG_JSON from "../../data/locations-catalog.json";

const COUNTRY_CATALOG = COUNTRY_CATALOG_JSON as CountryCatalogEntry[];
const LOCATION_CATALOG = LOCATION_CATALOG_JSON as LocationCatalogEntry[];

// Dynamically define active VFS codes from the catalog configurations
const ACTIVE_VFS_CODES = new Set(
  LOCATION_CATALOG.filter((loc) => loc.active).map((loc) => normalizeCode(loc.code))
);

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

function getCountryFolder(cc: string): string {
  const code = normalizeCode(cc);
  const country = COUNTRY_CATALOG.find((c) => c.code === code);
  return country?.folder ?? code.toLowerCase();
}

function getCountryNameSlug(cc: string): string {
  const code = normalizeCode(cc);
  const country = COUNTRY_CATALOG.find((c) => c.code === code);
  return country?.folder ?? code.toLowerCase();
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
  const folder = getCountryFolder(cc);
  try {
    return (await import(`../../data/countries/${folder}/info.json`)).default as CountryInfo;
  } catch (err) {
    console.warn(`[repository] getCountryInfo: failed to load countryCode="${countryCode}" at folder="${folder}":`, err);
    return null;
  }
}

/**
 * Visa types available for a given country.
 */
export async function getVisaTypes(countryCode: string): Promise<VisaType[]> {
  const record = await getCountryVisaTypes(countryCode);
  if (!record) return [];
  return record.visaTypes.map((v) => ({
    ...v,
    process: {
      default: v.process?.default ?? record.process?.default,
      centerOverrides: v.process?.centerOverrides ?? record.process?.centerOverrides ?? [],
      paymentInstructions: v.process?.paymentInstructions ?? record.process?.paymentInstructions ?? [],
    },
  }));
}

/**
 * Full CountryVisaTypes record.
 */
export async function getCountryVisaTypes(
  countryCode: string
): Promise<CountryVisaTypes | null> {
  assertParam(countryCode, "countryCode");
  const cc = normalizeCode(countryCode);
  const folder = getCountryFolder(cc);
  try {
    return (await import(`../../data/countries/${folder}/visa-types.json`)).default as CountryVisaTypes;
  } catch (err) {
    console.warn(`[repository] getCountryVisaTypes: failed to load countryCode="${countryCode}" at folder="${folder}":`, err);
    return null;
  }
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

  try {
    return (await import(`../../data/vfs_center/${lc.toLowerCase()}.json`)).default as VfsCenterInfo;
  } catch (err) {
    console.warn(`[repository] getVfsCenterInfo: failed to load locationCode="${locationCode}":`, err);
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
  const folder = getCountryFolder(cc);

  try {
    return (await import(`../../data/countries/${folder}/routing/${lc.toLowerCase()}.json`)).default as RoutingEntry;
  } catch (err) {
    console.warn(
      `[repository] getRoutingEntry: failed to load routing for countryCode="${countryCode}" at folder="${folder}", locationCode="${locationCode}":`,
      err
    );
    return null;
  }
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
  const countrySlug = getCountryNameSlug(cc);

  const fileVc = (cc === "VN" && vc === "TOURIST_MULTI") ? "TOURIST" : vc;

  try {
    const data = (await import(`../../data/requirements/${countrySlug}-${fileVc.toLowerCase()}-${lc.toLowerCase()}.json`)).default;
    if (cc === "VN" && vc === "TOURIST_MULTI") {
      return {
        ...data,
        visaTypeCode: vc,
        visaTypeId: "VISA_VN_TOURIST_MULTI_001",
      } as RequirementsData;
    }
    return data as RequirementsData;
  } catch (err) {
    console.warn(
      `[repository] getRequirementsData: failed to load requirements for countryCode="${countryCode}", visaTypeCode="${visaTypeCode}", locationCode="${locationCode}":`,
      err
    );
    return null;
  }
}

/**
 * Cities and attractions for the itinerary builder, keyed by country.
 */
export async function getItineraryPlaces(
  countryCode: string
): Promise<ItineraryPlacesData | null> {
  assertParam(countryCode, "countryCode");
  const cc = normalizeCode(countryCode);
  const folder = getCountryFolder(cc);

  try {
    return (await import(`../../data/countries/${folder}/itinerary-places.json`)).default as ItineraryPlacesData;
  } catch (err) {
    console.warn(`[repository] getItineraryPlaces: failed to import data for countryCode="${countryCode}" at folder="${folder}":`, err);
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
  const parts = key.split("_");
  const cc = parts[0];
  const folder = getCountryFolder(cc);
  const fileStem = parts.slice(0, -1).join("-").toLowerCase();

  try {
    const record = (await import(`../../data/countries/${folder}/${fileStem}.json`)).default as FormFieldsJsonRaw;

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
  } catch (err) {
    console.warn(
      `[repository] getFormFillFields: no form fields found for dataKey="${dataKey}" inside folder="${folder}", fileStem="${fileStem}":`,
      err
    );
    return [];
  }
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
    return null;
  }

  return {
    ...found,
    process: {
      default: found.process?.default ?? record.process?.default,
      centerOverrides: found.process?.centerOverrides ?? record.process?.centerOverrides ?? [],
      paymentInstructions: found.process?.paymentInstructions ?? record.process?.paymentInstructions ?? [],
    },
  };
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