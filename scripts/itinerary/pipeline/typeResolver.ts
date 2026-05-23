// visamate/scripts/itinerary/pipeline/typeResolver.ts
//
// Resolves a Wikipedia article description → our PlaceType.
//
// Input is now a full English description like:
//   "Buddhist temple in Asakusa, Tokyo"
//   "Shinto shrine in Fushimi, Kyoto"
//   "Theme park in Osaka, Japan"
//   "Public park in Sapporo"
//
// This is richer than Wikidata type labels, so we match on
// description keywords first, then fall back to name heuristics.

import type { PlaceType } from "../types/index.js";
import { LABEL_TYPE_MAP } from "../config/typeMap.js";

/**
 * Resolves a Wikipedia article description + name to PlaceType.
 * description = json.description from Wikipedia REST summary API
 * name        = article title
 */
export function resolveType(description: string): PlaceType {
  const lower = description.toLowerCase();

  // ── Description keyword matching (ordered, most-specific first) ──
  const descriptionMap: Array<[string, PlaceType]> = [
    // Theme parks before park
    ["theme park",          "Theme Park"],
    ["amusement park",      "Theme Park"],
    ["universal studios",   "Theme Park"],
    ["disneyland",          "Theme Park"],
    // Specific religious
    ["shinto shrine",       "Shrine"],
    ["shinto complex",      "Shrine"],
    ["buddhist temple",     "Temple"],
    ["hindu temple",        "Temple"],
    ["cathedral",           "Temple"],
    ["basilica",            "Temple"],
    ["mosque",              "Religious Site"],
    ["synagogue",           "Religious Site"],
    ["religious",           "Religious Site"],
    // Castles / palaces
    ["castle",              "Castle"],
    ["palace",              "Palace"],
    ["royal residence",     "Palace"],
    // Museums
    ["art museum",          "Museum"],
    ["art gallery",         "Museum"],
    ["science museum",      "Museum"],
    ["museum",              "Museum"],
    // Gardens / parks / nature
    ["botanical garden",    "Garden"],
    ["japanese garden",     "Garden"],
    ["zen garden",          "Garden"],
    ["garden",              "Garden"],
    ["national park",       "Park"],
    ["public park",         "Park"],
    ["urban park",          "Park"],
    ["park",                "Park"],
    ["bamboo grove",        "Nature"],
    ["bamboo forest",       "Nature"],
    ["forest",              "Nature"],
    ["mountain",            "Nature"],
    ["waterfall",           "Nature"],
    ["lake",                "Nature"],
    ["island",              "Nature"],
    // Markets
    ["fish market",         "Market"],
    ["market",              "Market"],
    // Memorial
    ["memorial",            "Memorial"],
    ["monument",            "Memorial"],
    ["peace",               "Memorial"],
    // Shopping
    ["shopping",            "Shopping"],
    // Landmarks
    ["observation deck",    "Viewpoint"],
    ["observation tower",   "Viewpoint"],
    ["viewpoint",           "Viewpoint"],
    ["tower",               "Landmark"],
    ["bridge",              "Landmark"],
    ["landmark",            "Landmark"],
    ["tourist attraction",  "Landmark"],
    // Historic
    ["world heritage",      "Historic Site"],
    ["archaeological",      "Historic Site"],
    ["historic district",   "Historic Site"],
    ["historic",            "Historic Site"],
    // Beach
    ["beach",               "Beach"],
    ["seaside",             "Beach"],
    // Zoo / aquarium
    ["zoo",                 "Zoo"],
    ["zoological",          "Zoo"],
    ["aquarium",            "Aquarium"],
    // Shrine / temple generic (after specific ones)
    ["shrine",              "Shrine"],
    ["temple",              "Temple"],
  ];

  for (const [keyword, type] of descriptionMap) {
    if (lower.includes(keyword)) return type;
  }

  // ── Fallback: LABEL_TYPE_MAP from config ──────────────────────
  for (const [keyword, type] of LABEL_TYPE_MAP) {
    if (lower.includes(keyword)) return type;
  }

  return "Landmark";
}

/**
 * Name-based heuristic override.
 * Catches places whose Wikipedia description is too generic.
 */
export function applyNameHeuristics(
  name: string,
  current: PlaceType
): PlaceType {
  const lower = name.toLowerCase();

  const nameMap: Array<[string, PlaceType]> = [
    ["shrine",        "Shrine"],
    ["jinja",         "Shrine"],
    ["taisha",        "Shrine"],
    ["jingu",         "Shrine"],
    ["temple",        "Temple"],
    ["-dera",         "Temple"],
    ["-ji",           "Temple"],
    ["castle",        "Castle"],
    ["-jo",           "Castle"],
    ["palace",        "Palace"],
    ["garden",        "Garden"],
    ["park",          "Park"],
    ["market",        "Market"],
    ["ichiba",        "Market"],
    ["museum",        "Museum"],
    ["memorial",      "Memorial"],
    ["peace",         "Memorial"],
    ["tower",         "Landmark"],
    ["crossing",      "Landmark"],
    ["teamlab",       "Museum"],
    ["universal studios", "Theme Park"],
    ["bamboo",        "Nature"],
    ["beach",         "Beach"],
    ["zoo",           "Zoo"],
    ["aquarium",      "Aquarium"],
    ["onsen",         "Nature"],
  ];

  for (const [keyword, type] of nameMap) {
    if (lower.includes(keyword)) return type;
  }

  return current;
}