/**
 * repository.ts — Data Access Layer
 *
 * Single source of truth for all data access in the app.
 * All reads go through this file. When you move from JSON → DB,
 * only replace the implementations here — component code stays the same.
 *
 * Pattern:
 *   JSON phase  → static import + Object.values(...).find(...)
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
} from "./types";

// ─── Static JSON imports (replace these imports when moving to DB) ─────────
import japanInfo from "../../data/countries/japan/info.json";
import japanVisaTypes from "../../data/countries/japan/visa-types.json";
import japanRoutingDelhi from "../../data/countries/japan/routing/delhi.json";
import delhiVfsCenter from "../../data/vfs_center/delhi.json";
import japanTouristDelhi from "../../data/requirements/japan-tourist-delhi.json";
import japanItineraryPlaces from "../../data/countries/japan/itinerary-places.json";

// ── NEW: Form fill field JSON imports ──────────────────────────────────────
// Add one import per country/visa-type JSON file as they land.
// Convention: data/countries/<country>/<KEY>.json
import jpTouristVisaFormFields from "../../data/countries/japan/jp-tourist-visa-form-fields.json";

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1 — UI CATALOG DATA
// Visual/display metadata only. Never mixes with structured DB-like data.
//
// LOCATION_CATALOG = every city we may ever support (name + photo).
// It is NOT the source of truth for what's available right now.
// VFS_CENTER_STORE (below) is the gatekeeper — only cities with a real
// data file in that store are shown to users.
//
// On DB migration: replace with SELECT code, name, photo FROM locations
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

// On DB migration: seed this into a `countries` table
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

// Full catalog of cities we may support in the future.
// Adding a city here does NOT make it visible to users.
// It also needs a real entry in VFS_CENTER_STORE below.
// On DB migration: seed this into a `locations` table
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

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2 — STRUCTURED DATA STORE (JSON → DB)
// These flat arrays simulate DB table rows.
// On DB migration: replace each array with a Prisma model / table.
// ═══════════════════════════════════════════════════════════════════════════

// Simulates: SELECT * FROM country_info
const COUNTRY_INFO_STORE: CountryInfo[] = [
  japanInfo as CountryInfo,
];

// Simulates: SELECT * FROM country_visa_types
const COUNTRY_VISA_TYPES_STORE: CountryVisaTypes[] = [
  japanVisaTypes as CountryVisaTypes,
];

// Simulates: SELECT * FROM routing_entries
const ROUTING_STORE: RoutingEntry[] = [
  japanRoutingDelhi as RoutingEntry,
];

// Simulates: SELECT * FROM requirements
const REQUIREMENTS_STORE: RequirementsData[] = [
  japanTouristDelhi as RequirementsData,
];

// ─── VFS Center Store ──────────────────────────────────────────────────────
interface VfsCenterStoreEntry {
  locationCode: string;  // uppercase; must match LOCATION_CATALOG code exactly
  data: VfsCenterInfo;
}

const VFS_CENTER_STORE: VfsCenterStoreEntry[] = [
  { locationCode: "DELHI", data: delhiVfsCenter as VfsCenterInfo },
  // Uncomment as JSON files are added:
  // { locationCode: "MUMBAI",    data: mumbaiVfsCenter as VfsCenterInfo },
  // { locationCode: "BENGALURU", data: bengaluruVfsCenter as VfsCenterInfo },
  // { locationCode: "CHENNAI",   data: chennaiVfsCenter as VfsCenterInfo },
  // { locationCode: "KOLKATA",   data: kolkataVfsCenter as VfsCenterInfo },
  // { locationCode: "HYDERABAD", data: hyderabadVfsCenter as VfsCenterInfo },
];

// ─── Itinerary Places Store ────────────────────────────────────────────────
import type { ItineraryPlacesData } from "./types";

const ITINERARY_PLACES_STORE: ItineraryPlacesData[] = [
  japanItineraryPlaces as ItineraryPlacesData,
];

// ─── Form Fill Fields Store ────────────────────────────────────────────────
// Each entry is the raw JSON for one form-fill data key.
// The `key` field in each JSON file is the lookup handle — it must match
// exactly what the document's `formFillDataKey` field contains.
//
// To add a new form:
//   1. Drop the JSON file at data/countries/<country>/<KEY>.json
//   2. Add an import above (near the other form field imports)
//   3. Push it into this array — that's it.
//
// On DB migration:
//   return await db.formFields.findFirst({ where: { key: dataKey } });

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

const FORM_FIELDS_STORE: FormFieldsJsonRaw[] = [
  jpTouristVisaFormFields as FormFieldsJsonRaw,
  // Add more as you create them:
  // krTouristVisaFormFields as FormFieldsJsonRaw,
];

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3 — KEY & VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function normalizeCode(code: string | undefined | null): string {
  if (!code || code.trim() === "") return "";
  return code.trim().toUpperCase();
}

function buildRoutingKey(countryCode: string, locationCode: string): string {
  return `${normalizeCode(countryCode)}_${normalizeCode(locationCode)}`;
}

function buildRequirementKey(
  countryCode: string,
  visaTypeCode: string,
  locationCode: string
): string {
  return `${normalizeCode(countryCode)}_${normalizeCode(visaTypeCode)}_${normalizeCode(locationCode)}`;
}

function assertParam(value: string | undefined | null, name: string): void {
  if (!value || value.trim() === "") {
    throw new Error(`[repository] Missing required parameter: "${name}"`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4 — PUBLIC API
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

  const result = COUNTRY_INFO_STORE.find(
    (c) => normalizeCode(c.countryCode) === normalizeCode(countryCode)
  ) ?? null;

  if (!result) {
    console.warn(`[repository] getCountryInfo: no data found for countryCode="${countryCode}"`);
  }

  return result;
}

/**
 * Visa types available for a given country.
 */
export async function getVisaTypes(countryCode: string): Promise<VisaType[]> {
  assertParam(countryCode, "countryCode");

  const record = COUNTRY_VISA_TYPES_STORE.find(
    (c) => normalizeCode(c.countryCode) === normalizeCode(countryCode)
  );

  if (!record) {
    console.warn(`[repository] getVisaTypes: no visa types found for countryCode="${countryCode}"`);
    return [];
  }

  return record.visaTypes;
}

/**
 * Full CountryVisaTypes record.
 */
export async function getCountryVisaTypes(
  countryCode: string
): Promise<CountryVisaTypes | null> {
  assertParam(countryCode, "countryCode");

  const result = COUNTRY_VISA_TYPES_STORE.find(
    (c) => normalizeCode(c.countryCode) === normalizeCode(countryCode)
  ) ?? null;

  if (!result) {
    console.warn(`[repository] getCountryVisaTypes: no record found for countryCode="${countryCode}"`);
  }

  return result;
}

/**
 * All locations that have real VFS center data.
 */
export async function getAllLocations(): Promise<LocationCatalogEntry[]> {
  const activeCodes = new Set(
    VFS_CENTER_STORE.map((entry) => normalizeCode(entry.locationCode))
  );

  return LOCATION_CATALOG.filter(
    (loc) => activeCodes.has(normalizeCode(loc.code))
  );
}

/**
 * Locations valid for a given country.
 */
export async function getLocationsForCountry(
  countryCode: string
): Promise<LocationCatalogEntry[]> {
  assertParam(countryCode, "countryCode");

  const activeCodes = new Set(
    VFS_CENTER_STORE.map((entry) => normalizeCode(entry.locationCode))
  );

  const validLocations = LOCATION_CATALOG.filter(
    (loc) => activeCodes.has(normalizeCode(loc.code))
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

  const entry = VFS_CENTER_STORE.find(
    (e) => normalizeCode(e.locationCode) === normalizeCode(locationCode)
  );

  if (!entry) {
    console.warn(
      `[repository] getVfsCenterInfo: no VFS center found for locationCode="${locationCode}"`
    );
    return null;
  }

  return entry.data;
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

  const key = buildRoutingKey(countryCode, locationCode);

  const result = ROUTING_STORE.find(
    (r) => buildRoutingKey(r.countryCode, r.locationCode) === key
  ) ?? null;

  if (!result) {
    console.warn(
      `[repository] getRoutingEntry: no routing found for countryCode="${countryCode}", locationCode="${locationCode}"`
    );
  }

  return result;
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

  const key = buildRequirementKey(countryCode, visaTypeCode, locationCode);

  const result = REQUIREMENTS_STORE.find(
    (r) =>
      buildRequirementKey(r.countryCode, r.visaTypeCode, r.locationCode) === key
  ) ?? null;

  if (!result) {
    console.warn(
      `[repository] getRequirementsData: no requirements found for countryCode="${countryCode}", visaTypeCode="${visaTypeCode}", locationCode="${locationCode}"`
    );
  }

  return result;
}

/**
 * Cities and attractions for the itinerary builder, keyed by country.
 */
export async function getItineraryPlaces(
  countryCode: string
): Promise<ItineraryPlacesData | null> {
  assertParam(countryCode, "countryCode");

  const result = ITINERARY_PLACES_STORE.find(
    (p) => normalizeCode(p.countryCode) === normalizeCode(countryCode)
  ) ?? null;

  if (!result) {
    console.warn(
      `[repository] getItineraryPlaces: no data found for countryCode="${countryCode}".`
    );
  }

  return result;
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
 *
 * The `dataKey` must exactly match the `key` field at the root of the JSON
 * (e.g. "JP_TOURIST_VISA_FORM_FIELDS_V1"). This is what `doc.form.formFillDataKey`
 * should contain.
 *
 * Returns [] when the key is not found — never throws — so the widget
 * degrades gracefully instead of crashing.
 *
 * DB equivalent:
 *   const record = await db.formFields.findFirst({ where: { key: dataKey } });
 *   return record ? flattenSections(record.sections) : [];
 *
 * To add a new form:
 *   1. Import the JSON at the top of this file
 *   2. Push it into FORM_FIELDS_STORE
 *   Done — no other changes needed anywhere.
 */
export async function getFormFillFields(
  dataKey: string | null | undefined
): Promise<FormFillField[]> {
  if (!dataKey || dataKey.trim() === "") return [];

  const record = FORM_FIELDS_STORE.find((r) => r.key === dataKey.trim());

  if (!record) {
    console.warn(
      `[repository] getFormFillFields: no form fields found for dataKey="${dataKey}". ` +
      `Import the JSON and add it to FORM_FIELDS_STORE.`
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
 *
 * Primary data source for VisaOverviewPanel.
 *
 * Usage in parent component:
 *   const visaType = await getVisaType(countryCode, visaTypeCode);
 *   <VisaOverviewPanel visaType={visaType} countryName={...} visaTypeName={...} />
 *
 * Returns null when not found — panel handles this gracefully with EmptyState.
 *
 * DB equivalent:
 *   return await db.visaTypes.findFirst({
 *     where: { countryCode, code: visaTypeCode }
 *   });
 */
export async function getVisaType(
  countryCode: string,
  visaTypeCode: string
): Promise<VisaType | null> {
  assertParam(countryCode, "countryCode");
  assertParam(visaTypeCode, "visaTypeCode");

  const record = COUNTRY_VISA_TYPES_STORE.find(
    (c) => normalizeCode(c.countryCode) === normalizeCode(countryCode)
  );

  if (!record) return null;

  const found =
    record.visaTypes.find(
      (v) => normalizeCode(v.code) === normalizeCode(visaTypeCode)
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
 *
 * Useful for future category-filter UI (e.g. "Show only SHORT_STAY visas").
 * Category matching is case-insensitive and normalised.
 *
 * Example:
 *   const shortStay = await getVisaTypesByCategory("JP", "SHORT_STAY");
 *
 * DB equivalent:
 *   return await db.visaTypes.findMany({
 *     where: { countryCode, category }
 *   });
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