// visamate/scripts/generate/config/typeMap.ts
// ─────────────────────────────────────────────────────────────
// config/typeMap.ts
//
// Maps Wikidata P31 (instance of) Q-IDs → our PlaceType.
// Add more entries here as you encounter new Wikidata types.
// Order matters: first match wins.
// ─────────────────────────────────────────────────────────────

import type { PlaceType } from "../types";

// [wikidataQId, ourType]
export const WIKIDATA_TYPE_MAP: Array<[string, PlaceType]> = [
  // ── Theme Parks (before Park — more specific) ──────────────
  ["Q194195",   "Theme Park"],   // amusement park
  ["Q11897880", "Theme Park"],   // theme park

  // ── Temples ───────────────────────────────────────────────
  ["Q44613",    "Temple"],       // Buddhist temple
  ["Q334383",   "Temple"],       // Shinto shrine (some are typed temple)
  ["Q163687",   "Temple"],       // Hindu temple
  ["Q16970",    "Temple"],       // church/cathedral — fallback temple bucket

  // ── Shrines ───────────────────────────────────────────────
  ["Q868557",   "Shrine"],       // Shinto shrine
  ["Q1549591",  "Shrine"],       // shinto complex

  // ── Castles ───────────────────────────────────────────────
  ["Q23413",    "Castle"],       // castle
  ["Q1137365",  "Castle"],       // fortification
  ["Q1329623",  "Castle"],       // palace-castle

  // ── Palaces ───────────────────────────────────────────────
  ["Q16560",    "Palace"],       // palace
  ["Q3184121",  "Palace"],       // royal residence

  // ── Museums ───────────────────────────────────────────────
  ["Q33506",    "Museum"],       // museum
  ["Q207694",   "Museum"],       // art museum
  ["Q3542116",  "Museum"],       // science museum
  ["Q18674739", "Museum"],       // exhibition

  // ── Parks ─────────────────────────────────────────────────
  ["Q22698",    "Park"],         // park
  ["Q6566952",  "Park"],         // nature park
  ["Q179049",   "Park"],         // national park

  // ── Gardens ───────────────────────────────────────────────
  ["Q1107656",  "Garden"],       // botanical garden
  ["Q1335137",  "Garden"],       // Japanese garden
  ["Q28510673", "Garden"],       // public garden

  // ── Markets ───────────────────────────────────────────────
  ["Q131734",   "Market"],       // marketplace
  ["Q330284",   "Market"],       // market
  ["Q1448114",  "Market"],       // fish market

  // ── Districts / Neighbourhoods ─────────────────────────────
  ["Q123705",   "District"],     // neighbourhood
  ["Q1093829",  "District"],     // city district
  ["Q856584",   "District"],     // shopping district

  // ── Shopping ──────────────────────────────────────────────
  ["Q11315",    "Shopping"],     // shopping mall
  ["Q57660343", "Shopping"],     // commercial complex

  // ── Landmarks / Towers / Observation ──────────────────────
  ["Q12518",    "Landmark"],     // tower
  ["Q1076486",  "Landmark"],     // observation deck
  ["Q570116",   "Landmark"],     // tourist attraction (generic)
  ["Q473972",   "Landmark"],     // building (generic fallback)

  // ── Memorials ─────────────────────────────────────────────
  ["Q4989906",  "Memorial"],     // monument
  ["Q5003624",  "Memorial"],     // memorial
  ["Q174782",   "Memorial"],     // memorial

  // ── Nature / Scenic ───────────────────────────────────────
  ["Q35509",    "Nature"],       // forest
  ["Q131681",   "Nature"],       // bamboo grove
  ["Q23397",    "Nature"],       // lake
  ["Q8502",     "Nature"],       // mountain
  ["Q35872",    "Nature"],       // waterfall

  // ── Beaches ───────────────────────────────────────────────
  ["Q40080",    "Beach"],        // beach

  // ── Historic Sites ────────────────────────────────────────
  ["Q839954",   "Historic Site"],// archaeological site
  ["Q15243209", "Historic Site"],// historic district
  ["Q1260047",  "Historic Site"],// world heritage site

  // ── Religious Sites (generic) ─────────────────────────────
  ["Q1497375",  "Religious Site"],// religious complex

  // ── Viewpoints ────────────────────────────────────────────
  ["Q1078765",  "Viewpoint"],    // observation point

  // ── Zoos / Aquariums ──────────────────────────────────────
  ["Q43501",    "Zoo"],
  ["Q14562633", "Aquarium"],
];

// Label-based fallback (when Q-ID mapping misses)
// Matches against Wikidata's P31 English label (lowercase)
export const LABEL_TYPE_MAP: Array<[string, PlaceType]> = [
  ["theme park",        "Theme Park"],
  ["amusement park",    "Theme Park"],
  ["buddhist temple",   "Temple"],
  ["hindu temple",      "Temple"],
  ["cathedral",         "Temple"],
  ["shinto shrine",     "Shrine"],
  ["shrine",            "Shrine"],
  ["castle",            "Castle"],
  ["palace",            "Palace"],
  ["museum",            "Museum"],
  ["art gallery",       "Museum"],
  ["aquarium",          "Aquarium"],
  ["zoo",               "Zoo"],
  ["botanical garden",  "Garden"],
  ["garden",            "Garden"],
  ["national park",     "Park"],
  ["park",              "Park"],
  ["market",            "Market"],
  ["beach",             "Beach"],
  ["memorial",          "Memorial"],
  ["monument",          "Memorial"],
  ["shopping",          "Shopping"],
  ["mall",              "Shopping"],
  ["neighbourhood",     "District"],
  ["district",          "District"],
  ["tower",             "Landmark"],
  ["landmark",          "Landmark"],
  ["forest",            "Nature"],
  ["mountain",          "Nature"],
  ["waterfall",         "Nature"],
  ["viewpoint",         "Viewpoint"],
  ["observation",       "Viewpoint"],
  ["historic",          "Historic Site"],
  ["archaeological",    "Historic Site"],
  ["religious",         "Religious Site"],
];
