// visamate/scripts/itinerary/pipeline/wikidata.ts
//
// Fetches tourist places per city using Wikipedia Category API
// + MediaWiki Action API (batch page props + langlinks).

import type { WikidataPlace } from "../types/index.js";
import { getCachedData, setCachedData } from "../utils/cache.js";

const WP_API = "https://en.wikipedia.org/w/api.php";

// Delays — tuned to stay well under Wikipedia's anonymous rate limit
const DELAY_BETWEEN_CATEGORIES_MS = 500;   // between each category GET
const DELAY_BETWEEN_DETAIL_BATCHES_MS = 800;  // between each 50-title POST

// Category name patterns tried in order for each city
const CATEGORY_PATTERNS: ((c: string) => string)[] = [
  (c) => `Tourist_attractions_in_${c}`,
  (c) => `Visitor_attractions_in_${c}`,
  (c) => `Tourist_attractions_in_${c}_Prefecture`,
  (c) => `Temples_in_${c}`,
  (c) => `Shinto_shrines_in_${c}`,
  (c) => `Shrines_in_${c}`,
  (c) => `Museums_in_${c}`,
  (c) => `Parks_in_${c}`,
  (c) => `Gardens_in_${c}`,
  (c) => `Castles_in_${c}`,
  (c) => `Castles_in_${c}_Prefecture`,
  (c) => `Amusement_parks_in_${c}`,
  (c) => `Zoos_in_${c}`,
  (c) => `Aquaria_in_${c}`,
  (c) => `Monuments_and_memorials_in_${c}`,
  (c) => `Historic_sites_in_${c}`,
  (c) => `Beaches_in_${c}`,
];

const TITLE_BLACKLIST = [
  "list of", "(disambiguation)", "railway station", " station",
  " line ", "airport", "ward, ", " ward)", "municipality",
  "prefecture)", " expressway", "highway", "route ",
];

export async function fetchWikidataPlaces(
  cityName: string,
  _wikidataId?: string,
  _regionQId?: string,
  _minSiteLinks?: number
): Promise<WikidataPlace[]> {

  const cacheKey = `wiki_places_${cityName.toLowerCase().replace(/\s+/g, "_")}`;
  const cached = getCachedData<WikidataPlace[]>(cacheKey);
  if (cached) {
    console.log(`  [wiki] Loaded ${cached.length} places from cache for ${cityName}`);
    return cached;
  }

  // Strip parenthetical suffix, e.g. "Hokkaido (Sapporo)" → "Sapporo"
  const citySlug = cityName
    .replace(/\s*\(.*?\)\s*/g, "")
    .trim()
    .replace(/ /g, "_");

  // ── Step 1: collect page titles from all matching categories ──
  const titleSet = new Map<string, true>();

  for (const pattern of CATEGORY_PATTERNS) {
    const cat = pattern(citySlug);
    const titles = await fetchCategoryMembers(cat);
    for (const t of titles) {
      if (!isBlacklisted(t)) titleSet.set(t, true);
    }
    // Mandatory pause between category requests to avoid 429
    await sleep(DELAY_BETWEEN_CATEGORIES_MS);
  }

  const allTitles = [...titleSet.keys()];

  if (allTitles.length === 0) {
    console.warn(`  [wiki] No category pages found for ${cityName}`);
    return [];
  }

  console.log(`  [wiki] ${allTitles.length} candidate pages for ${cityName}`);

  // ── Step 2: resolve page details in batches ───────────────────
  const places = await fetchPageDetails(allTitles);

  console.log(`  [wiki] ${places.length} places resolved for ${cityName}`);
  setCachedData(cacheKey, places);
  return places;
}

async function fetchCategoryMembers(category: string): Promise<string[]> {
  const params = new URLSearchParams({
    action: "query",
    list: "categorymembers",
    cmtitle: `Category:${category}`,
    cmlimit: "100",
    cmtype: "page",
    cmnamespace: "0",
    format: "json",
    origin: "*",
  });

  const url = `${WP_API}?${params}`;

  try {
    const res = await fetchWithRetry(url, "GET", undefined, 12_000);
    if (!res.ok) {
      console.warn(`    [wiki] Category:${category} → HTTP ${res.status}`);
      return [];
    }
    const json = (await res.json()) as WikipediaCategoryResponse;
    const members = json.query?.categorymembers ?? [];
    if (members.length > 0) {
      console.log(`    [wiki] Category:${category} → ${members.length} pages`);
    }
    return members.map((m) => m.title);
  } catch (err) {
    console.warn(`    [wiki] Category:${category} failed:`, (err as Error).message);
    return [];
  }
}

async function fetchPageDetails(titles: string[]): Promise<WikidataPlace[]> {
  const results: WikidataPlace[] = [];
  const BATCH = 50;

  for (let i = 0; i < titles.length; i += BATCH) {
    const chunk = titles.slice(i, i + BATCH);
    const batch = await fetchPageDetailsBatch(chunk);
    results.push(...batch);
    if (i + BATCH < titles.length) {
      await sleep(DELAY_BETWEEN_DETAIL_BATCHES_MS);
    }
  }

  return results;
}

async function fetchPageDetailsBatch(titles: string[]): Promise<WikidataPlace[]> {
  const body = new URLSearchParams({
    action: "query",
    titles: titles.join("|"),
    prop: "pageprops|extracts|langlinks",
    ppprop: "wikibase_item",
    lllimit: "max",
    exintro: "1",
    exsentences: "2",
    explaintext: "1",
    exlimit: "max",
    format: "json",
    origin: "*",
  });

  try {
    const res = await fetchWithRetry(WP_API, "POST", body, 15_000);
    if (!res.ok) {
      console.warn(`    [wiki] fetchPageDetailsBatch HTTP ${res.status} for ${titles.length} titles`);
      return [];
    }

    const json = (await res.json()) as WikipediaQueryResponse;
    const pages = Object.values(json.query?.pages ?? {});

    return pages
      .filter((p) => {
        if (p.missing !== undefined) return false;
        if (p.pageid !== undefined && p.pageid < 0) return false;
        return true;
      })
      .map((p): WikidataPlace => {
        const wikipedia = p.title.replace(/ /g, "_");
        const description = (p.extract ?? "").slice(0, 300);
        const wikidataId = p.pageprops?.wikibase_item ?? `wp:${wikipedia}`;

        const otherLanguages = p.langlinks?.length ?? 0;
        const sitelinkCount = otherLanguages + 1;

        return {
          wikidataId,
          name: p.title,
          wikidataType: description,
          wikipedia,
          sitelinkCount,
        };
      });
  } catch (err) {
    console.warn(`    [wiki] fetchPageDetailsBatch failed:`, (err as Error).message);
    return [];
  }
}

// ── fetchWithRetry with Backoff ─────────────────────────────────────────────

async function fetchWithRetry(
  url: string,
  method: "GET" | "POST",
  body: URLSearchParams | undefined,
  timeoutMs: number,
  maxRetries = 4
): Promise<Response> {
  let attempt = 0;

  while (true) {
    attempt++;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response;
    try {
      res = await fetch(url, {
        method,
        headers: {
          "User-Agent": "visamate-generator/2.0 (travel itinerary app; mailto:admin@visamate.com)",
          "Accept": "application/json",
          ...(method === "POST"
            ? { "Content-Type": "application/x-www-form-urlencoded" }
            : {}),
        },
        body: method === "POST" ? body?.toString() : undefined,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    // Success or permanent 4xx (not 429) — return immediately
    if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) {
      return res;
    }

    // 429 or 5xx — retry with backoff if attempts remain
    if (attempt >= maxRetries) {
      console.warn(`    [wiki-fetch] Giving up after ${attempt} attempts (last status ${res.status})`);
      return res;
    }

    // Honour Retry-After if present; otherwise exponential backoff capped at 16s
    const retryAfter = res.headers.get("retry-after");
    const waitMs = retryAfter
      ? Math.ceil(parseFloat(retryAfter)) * 1000
      : Math.min(1000 * 2 ** attempt, 16_000);

    console.warn(
      `    [wiki-fetch] HTTP ${res.status} — attempt ${attempt}/${maxRetries}, retrying in ${waitMs}ms…`
    );
    await sleep(waitMs);
  }
}

function isBlacklisted(title: string): boolean {
  const lower = title.toLowerCase();
  return TITLE_BLACKLIST.some((term) => lower.includes(term));
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Response types ─────────────────────────────────────────────────────────

interface WikipediaCategoryResponse {
  query?: { categorymembers: Array<{ title: string; pageid: number }> };
}

interface WikipediaQueryResponse {
  query?: { pages: Record<string, WikipediaPage> };
}

interface WikipediaPage {
  pageid?: number;
  title: string;
  missing?: string;
  extract?: string;
  pageprops?: { wikibase_item?: string };
  langlinks?: Array<{ lang: string; '*': string }>;
}