// ─────────────────────────────────────────────────────────────
// visamate/scripts/generate/pipeline/pageviews.ts
//
// Fetches monthly Wikipedia pageview counts for a list of articles.
// Used to rank places by real-world tourist popularity.
//
// API: https://wikimedia.org/api/rest_v1/metrics/pageviews
// Free, no auth needed, rate limit: 100 req/s (we stay well under).
// ─────────────────────────────────────────────────────────────

const PAGEVIEWS_BASE =
  "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents";

/**
 * Returns the total pageviews for the last full month for a single
 * Wikipedia article title (e.g. "Senso-ji").
 * Returns 0 on any error (missing article, 404, etc.).
 */
export async function fetchPageviews(wikipediaTitle: string): Promise<number> {
  if (!wikipediaTitle) return 0;

  const { year, month } = lastFullMonth();
  const mm = String(month).padStart(2, "0");
  // API granularity: monthly. Format: YYYYMMDD00 (day = "00" for monthly)
  const start = `${year}${mm}0100`;
  const end   = `${year}${mm}0100`;

  const url = [
    PAGEVIEWS_BASE,
    encodeURIComponent(wikipediaTitle),
    "monthly",
    start,
    end,
  ].join("/");

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "visamate-generator/1.0 (travel itinerary app)",
      },
    });

    if (!res.ok) return 0; // 404 = article not found or too new

    const json = (await res.json()) as PageviewsResponse;
    return json.items?.[0]?.views ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Fetches pageviews for a batch of articles concurrently.
 * Throttles to avoid hammering the API.
 *
 * @param titles  Array of Wikipedia article titles
 * @param concurrency  Max simultaneous requests (default 5)
 * @returns Map of title → pageview count
 */
export async function fetchPageviewsBatch(
  titles: string[],
  concurrency = 5
): Promise<Map<string, number>> {
  const result = new Map<string, number>();

  // Process in chunks to respect rate limits
  for (let i = 0; i < titles.length; i += concurrency) {
    const chunk = titles.slice(i, i + concurrency);
    const results = await Promise.all(
      chunk.map(async (title) => {
        const views = await fetchPageviews(title);
        return [title, views] as const;
      })
    );
    for (const [title, views] of results) {
      result.set(title, views);
    }
    // Small delay between batches to be a polite API citizen
    if (i + concurrency < titles.length) {
      await sleep(200);
    }
  }

  return result;
}

// ── Helpers ────────────────────────────────────────────────────

/** Returns the previous full calendar month */
function lastFullMonth(): { year: number; month: number } {
  const now = new Date();
  let month = now.getMonth(); // 0-indexed, so this IS the previous month
  let year  = now.getFullYear();
  if (month === 0) {
    month = 12;
    year -= 1;
  }
  return { year, month };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── API response type (internal) ───────────────────────────────

interface PageviewsResponse {
  items?: Array<{
    views: number;
  }>;
}
