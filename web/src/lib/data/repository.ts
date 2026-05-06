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
    code: "CA",
    name: "Canada",
    photo: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800",
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
    code: "FR",
    name: "France",
    photo: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
    supported: false,
  },
  {
    code: "DE",
    name: "Germany",
    photo: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800",
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
// Each entry wraps the raw JSON with an EXPLICIT `locationCode`.
//
// Why explicit? The JSON files may use any internal field name for their
// location identifier. By wrapping here, we guarantee that the rest of
// this file always has a reliable, normalized key to match against
// LOCATION_CATALOG — regardless of what the JSON calls it internally.
//
// This store is also the SINGLE place that controls which cities are live.
// Only cities listed here will be returned by getAllLocations() and
// getLocationsForCountry(). The LOCATION_CATALOG entry provides the
// display data (city name, photo); this store says whether it exists.
//
// To add a new city:
//   1. Import its JSON:  import mumbaiVfsCenter from "../../data/vfs_center/mumbai.json";
//   2. Add a store entry: { locationCode: "MUMBAI", data: mumbaiVfsCenter as VfsCenterInfo }
//   That's it. No other changes needed anywhere.
//
// On DB migration: replace with: await db.vfsCenter.findMany()
// ──────────────────────────────────────────────────────────────────────────
interface VfsCenterStoreEntry {
  locationCode: string;  // uppercase; must match LOCATION_CATALOG code exactly
  data: VfsCenterInfo;
}

const VFS_CENTER_STORE: VfsCenterStoreEntry[] = [
  { locationCode: "DELHI", data: delhiVfsCenter as VfsCenterInfo },
  // Uncomment as JSON files are added:
  // { locationCode: "MUMBAI",    data: mumbaiVfsCenter as VfsCenterInfo },
  //  { locationCode: "BENGALURU", data: bengaluruVfsCenter as VfsCenterInfo },
  // { locationCode: "CHENNAI",   data: chennaiVfsCenter as VfsCenterInfo },
  // { locationCode: "KOLKATA",   data: kolkataVfsCenter as VfsCenterInfo },
  // { locationCode: "HYDERABAD", data: hyderabadVfsCenter as VfsCenterInfo },
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
 *
 * DB equivalent:
 *   return await db.country.findMany({ orderBy: { name: "asc" } });
 */
export async function getAllCountries(): Promise<CountryCatalogEntry[]> {
  return COUNTRY_CATALOG;
}

/**
 * Single country catalog entry by code.
 *
 * DB equivalent:
 *   return await db.country.findFirst({ where: { code } });
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
 *
 * DB equivalent:
 *   return await db.countryInfo.findFirst({ where: { countryCode } });
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
 *
 * DB equivalent:
 *   const record = await db.countryVisaTypes.findFirst({ where: { countryCode } });
 *   return record?.visaTypes ?? [];
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
 *
 * DB equivalent:
 *   return await db.countryVisaTypes.findFirst({ where: { countryCode } });
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
 *
 * VFS_CENTER_STORE is the source of truth for what's live.
 * LOCATION_CATALOG provides display metadata (city name, photo).
 * Only the intersection is returned.
 *
 * Right now: only "DELHI" is in VFS_CENTER_STORE → only New Delhi is returned.
 * Add more entries to VFS_CENTER_STORE as JSON files land → more cities appear.
 *
 * DB equivalent:
 *   const activeCodes = (await db.vfsCenter.findMany({ select: { locationCode: true } }))
 *     .map(v => v.locationCode);
 *   return await db.location.findMany({ where: { code: { in: activeCodes } } });
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
 *
 * Source of truth: VFS_CENTER_STORE.
 * A location is shown if and only if its JSON file has been imported
 * and added to VFS_CENTER_STORE — regardless of routing data.
 *
 * Routing data (ROUTING_STORE) contains appointment/submission details
 * per country+location. It is NOT used to gate which locations appear,
 * because routing field names in JSON vary and would cause silent failures.
 *
 * To add a new city: import its JSON and add to VFS_CENTER_STORE.
 *
 * DB equivalent:
 *   const activeCodes = (await db.vfsCenter.findMany({ select: { locationCode: true } }))
 *     .map(v => v.locationCode);
 *   return await db.location.findMany({ where: { code: { in: activeCodes } } });
 */
export async function getLocationsForCountry(
  countryCode: string
): Promise<LocationCatalogEntry[]> {
  assertParam(countryCode, "countryCode");

  // VFS_CENTER_STORE is the single source of truth for available locations.
  // It already contains only cities that have real data files imported.
  const activeCodes = new Set(
    VFS_CENTER_STORE.map((entry) => normalizeCode(entry.locationCode))
  );

  const validLocations = LOCATION_CATALOG.filter(
    (loc) => activeCodes.has(normalizeCode(loc.code))
  );

  if (validLocations.length === 0) {
    console.warn(
      `[repository] getLocationsForCountry: no VFS centers found in VFS_CENTER_STORE for countryCode="${countryCode}". Add entries to VFS_CENTER_STORE to show locations.`
    );
  }

  return validLocations;
}

/**
 * VFS center details for a given location code.
 *
 * DB equivalent:
 *   return await db.vfsCenter.findFirst({ where: { locationCode } });
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
 *
 * DB equivalent:
 *   return await db.routing.findFirst({ where: { countryCode, locationCode } });
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
 * This is the main query for StepDocuments.
 *
 * DB equivalent:
 *   return await db.requirements.findFirst({
 *     where: { countryCode, visaTypeCode, locationCode }
 *   });
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

// ─────────────────────────────────────────────────────────────
// ADD TO repository.ts
// ─────────────────────────────────────────────────────────────
// These are the ONLY changes needed in repository.ts.
// Everything else in your existing file stays exactly the same.
// ─────────────────────────────────────────────────────────────

// 1. Add this import at the top of the file (with your other imports):
import type { ItineraryPlacesData } from "./types";

// 2. Add this import near your other static JSON imports:
import japanItineraryPlaces from "../../data/countries/japan/itinerary-places.json";

// 3. Add this store (near your other *_STORE arrays, e.g. after REQUIREMENTS_STORE):
const ITINERARY_PLACES_STORE: ItineraryPlacesData[] = [
  japanItineraryPlaces as ItineraryPlacesData,
  // When you add France:
  // franceItineraryPlaces as ItineraryPlacesData,
];

// 4. Add this function to the Public API section (Section 4):

/**
 * Cities and attractions for the itinerary builder, keyed by country.
 *
 * DB equivalent:
 *   return await db.itineraryPlaces.findFirst({ where: { countryCode } });
 */
export async function getItineraryPlaces(
  countryCode: string
): Promise<ItineraryPlacesData | null> {
  assertParam(countryCode, "countryCode");

  const result = ITINERARY_PLACES_STORE.find(
    (p) => normalizeCode(p.countryCode) === normalizeCode(countryCode)
  ) ?? null;

  if (!result) {
    // Not an error — some countries may not have itinerary builder support yet.
    console.warn(
      `[repository] getItineraryPlaces: no data found for countryCode="${countryCode}". ` +
      `Add an entry to ITINERARY_PLACES_STORE to enable the itinerary builder for this country.`
    );
  }

  return result;
}