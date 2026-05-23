// visamate/scripts/itinerary/pipeline/enricher.ts
//
// Combines WikidataPlace[] + pageview counts into EnrichedPlace[].
// Deduplicates, ranks by Wikipedia pageviews, resolves types.

import type { WikidataPlace, EnrichedPlace } from "../types/index.js";
import { DURATIONS } from "../config/durations.js";
import { makeId } from "../utils/slug.js";
import { resolveType, applyNameHeuristics } from "./typeResolver.js";
import { fetchPageviewsBatch } from "./pageviews.js";

/**
 * Takes raw Wikipedia category results for one city and returns
 * the top N enriched places, ranked by Wikipedia pageviews.
 */
export async function enrichPlaces(
  wikidataPlaces: WikidataPlace[],
  cityName: string,
  topN = 12
): Promise<EnrichedPlace[]> {
  if (wikidataPlaces.length === 0) {
    console.warn(`  [enricher] No results for ${cityName}`);
    return [];
  }

  // Deduplicate by Wikidata Q-ID
  const seen = new Set<string>();
  const unique = wikidataPlaces.filter((p) => {
    if (seen.has(p.wikidataId)) return false;
    seen.add(p.wikidataId);
    return true;
  });

  // Pre-filter: Sort by real sitelinkCount descending and take top 25 candidates
  unique.sort((a, b) => b.sitelinkCount - a.sitelinkCount);
  const candidates = unique.slice(0, 25);

  console.log(
    `  [enricher] Filtered down to ${candidates.length} top candidates for ${cityName} (from ${unique.length} unique), fetching pageviews...`
  );

  // Fetch pageviews only for the pre-filtered candidates
  const titles = candidates.map((p) => p.wikipedia).filter(Boolean);
  const pageviewMap = await fetchPageviewsBatch(titles, 6);

  // Attach pageviews
  const withViews = candidates.map((p) => ({
    ...p,
    pageviews: pageviewMap.get(p.wikipedia) ?? 0,
  }));

  // Sort: pageviews desc, then sitelinks desc as tiebreak
  withViews.sort((a, b) =>
    b.pageviews !== a.pageviews
      ? b.pageviews - a.pageviews
      : b.sitelinkCount - a.sitelinkCount
  );

  // Take top N and resolve types
  return withViews.slice(0, topN).map((p): EnrichedPlace => {
    // wikidataType now holds the full Wikipedia description string
    // e.g. "Buddhist temple in Asakusa, Tokyo"
    const rawType = resolveType(p.wikidataType);
    const mappedType = applyNameHeuristics(p.name, rawType);
    const duration = DURATIONS[mappedType];
    const id = makeId(p.name);

    return {
      wikidataId: p.wikidataId,
      name: p.name,
      wikipedia: p.wikipedia,
      sitelinkCount: p.sitelinkCount,
      pageviews: p.pageviews,
      mappedType,
      duration,
      id,
    };
  });
}

/** Strips internal fields, returns final Place[] shape */
export function toPlaceOutput(enriched: EnrichedPlace[]) {
  return enriched.map((p) => ({
    id: p.id,
    name: p.name,
    type: p.mappedType,
    duration: p.duration,
  }));
}