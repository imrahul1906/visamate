// visamate/scripts/generate/types/index.ts
// ─────────────────────────────────────────────────────────────
// types/index.ts
// These types mirror the exact shape consumed by itineraryService.ts
// ─────────────────────────────────────────────────────────────

export type PlaceType =
  | "Temple"
  | "Shrine"
  | "Museum"
  | "Park"
  | "Market"
  | "District"
  | "Castle"
  | "Landmark"
  | "Shopping"
  | "Garden"
  | "Memorial"
  | "Theme Park"
  | "Nature"
  | "Beach"
  | "Palace"
  | "Historic Site"
  | "Religious Site"
  | "Viewpoint"
  | "Zoo"
  | "Aquarium";

export interface Place {
  id: string;         // deterministic slug e.g. "sensoji"
  name: string;       // display name e.g. "Senso-ji Temple, Asakusa"
  type: PlaceType;
  duration: string;   // e.g. "2h" | "1.5h"
}

export interface City {
  name: string;
  places: Place[];
}

export type CityMap = Record<string, City>; // key = city slug e.g. "tokyo"

export interface CountryData {
  countryCode: string;       // ISO 3166-1 alpha-2 e.g. "JP"
  countryName: string;
  cities: CityMap;
  typeColors: Record<PlaceType, string>;
}

// ─── Raw Wikidata result row ───────────────────────────────────
export interface WikidataPlace {
  wikidataId: string;   // e.g. "Q243623"
  name: string;
  wikidataType: string; // raw P31 label
  wikipedia: string;    // en wikipedia title
  sitelinkCount: number;
}

// ─── Internal enriched place before final output ──────────────
export interface EnrichedPlace {
  wikidataId: string;
  name: string;
  wikipedia: string;
  sitelinkCount: number;
  pageviews: number;
  mappedType: PlaceType;
  duration: string;
  id: string;
}
