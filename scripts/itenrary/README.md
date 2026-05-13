# visamate/scripts/itenrary — Itinerary Place Generator

## Overview

The **itenrary** module generates tourist place data for travel itineraries using **Wikipedia + Wikidata APIs**. It automatically discovers, enriches, and ranks tourist attractions in configurable cities without requiring any API keys.

The module:
- 🌍 Fetches tourist places from **Wikipedia categories** (100% free)
- 📊 Ranks them by **real-world popularity** using Wikipedia pageviews
- 🏷️ Classifies places into **20 categories** (Temple, Museum, Park, etc.)
- 📝 Assigns **visit durations** based on place type
- 💾 Outputs **JSON** consumable by the frontend itinerary service

---

## Architecture Overview

```
itenrary/
├── generate/                          ← CLI entry point & orchestration
│   ├── generate.ts                    ← Main script (pnpm generate <country|all>)
│   ├── config/                        ← Static configuration
│   │   ├── countries.ts               ← Cities, Wikidata Q-IDs, display names
│   │   ├── typeMap.ts                 ← Wikidata Q-ID → PlaceType mapping
│   │   ├── durations.ts               ← PlaceType → visit duration
│   │   └── typeColors.ts              ← PlaceType → hex color code
│   ├── pipeline/                      ← Data processing pipeline
│   │   ├── wikidata.ts                ← Wikipedia API integration (fetch candidates)
│   │   ├── pageviews.ts               ← Pageviews ranking (popularity)
│   │   ├── typeResolver.ts            ← Classification logic (Q-ID → PlaceType)
│   │   └── enricher.ts                ← Deduplication, ranking, type resolution
│   ├── types/
│   │   └── index.ts                   ← Shared TypeScript interfaces
│   └── utils/
│       └── slug.ts                    ← Deterministic ID generator
└── README.md                          ← This file
```

---

## File Information

### Entry Point & Orchestration

#### [generate.ts](generate/generate.ts)
- **Purpose**: CLI entry point and country-level orchestration
- **Usage**: `pnpm generate <country>` or `pnpm generate all`
- **Key Functions**:
  - `generateCountry(countryKey)` — Orchestrates full pipeline for one country
  - `generateAll()` — Generates all configured countries sequentially
  - `printSummary(data)` — Displays results in console
- **Output**: `web/src/data/countries/{countryKey}/itinerary-places.json`

---

### Configuration Files

#### [countries.ts](generate/config/countries.ts)
- **Purpose**: Defines countries, cities, and Wikidata mappings
- **Key Interfaces**:
  - `CityConfig` — slug, name, wikidataId, regionQId (optional), categoryCity (optional)
  - `CountryConfig` — countryCode, countryName, cities[]
- **Example**:
  ```typescript
  japan: {
    countryCode: "JP",
    countryName: "Japan",
    cities: [
      { slug: "tokyo", name: "Tokyo", wikidataId: "Q1490" },
      {
        slug: "hokkaido",
        name: "Hokkaido (Sapporo)",
        wikidataId: "Q37951",
        categoryCity: "Sapporo"  // Override for Wikipedia category lookup
      }
    ]
  }
  ```

#### [typeMap.ts](generate/config/typeMap.ts)
- **Purpose**: Maps Wikidata P31 (instance-of) Q-IDs to PlaceType
- **Usage**: `resolveType()` falls back to this mapping if keyword matching fails
- **Example Mappings**:
  - `Q44613` → Temple (Buddhist temple)
  - `Q868557` → Shrine (Shinto shrine)
  - `Q23413` → Castle
  - `Q194195` → Theme Park

#### [durations.ts](generate/config/durations.ts)
- **Purpose**: Default visit duration per place type
- **Type**: `Record<PlaceType, string>` e.g. "2h", "3h", "8h"
- **Used by**: `enricher.ts` during type resolution

#### [typeColors.ts](generate/config/typeColors.ts)
- **Purpose**: Hex color codes per place type for UI rendering
- **Type**: `Record<PlaceType, string>` e.g. `"#FF6B6B"`
- **Included in**: Output JSON for frontend consumption

---

### Pipeline (Data Processing)

#### [wikidata.ts](generate/pipeline/wikidata.ts)
- **Purpose**: Fetches candidate places from Wikipedia categories
- **Entry Function**: `fetchWikidataPlaces(cityName, wikidataId?, regionQId?, minSitelinks?)`
- **Algorithm**:
  1. Try 17 category name patterns in order (e.g., "Tourist_attractions_in_Tokyo", "Temples_in_Tokyo", ...)
  2. Collect all page titles, filter via blacklist (exclude "station", "airport", etc.)
  3. Fetch page details in batches (wikibase_item Q-ID, description)
  4. Return `WikidataPlace[]`
- **Rate Limiting**: 500ms between categories, 800ms between detail batches
- **Returns**: Raw places with wikidataId, name, wikipedia title, description

#### [pageviews.ts](generate/pipeline/pageviews.ts)
- **Purpose**: Ranks places by Wikipedia popularity
- **API**: Wikimedia REST `/metrics/pageviews/per-article/en.wikipedia`
- **Key Functions**:
  - `fetchPageviews(wikipediaTitle)` — Fetches monthly pageview count
  - `fetchPageviewsBatch(titles[], concurrency)` — Concurrent batch fetcher
- **Timeframe**: Last full calendar month
- **Return**: Map of title → pageview count
- **Rate**: 100 req/s limit (we use concurrency=5-6 for safety)

#### [typeResolver.ts](generate/pipeline/typeResolver.ts)
- **Purpose**: Classifies places into 20 PlaceTypes
- **Key Functions**:
  - `resolveType(description)` — Matches description keywords → PlaceType
  - `applyNameHeuristics(name, fallback)` — Refines type using name patterns
- **Logic**:
  1. Try exact keyword matches on Wikipedia description (e.g., "Buddhist temple" → Temple)
  2. Fall back to name heuristics if description is vague
  3. Use `typeMap.ts` Q-ID mappings as last resort
- **Output**: Definitive PlaceType for each place

#### [enricher.ts](generate/pipeline/enricher.ts)
- **Purpose**: Combines all pipeline data, ranks, and finalizes
- **Key Functions**:
  - `enrichPlaces(wikidataPlaces[], cityName, topN=12)` — Orchestrates enrichment
  - `toPlaceOutput(enriched[])` — Strips internal fields, returns final shape
- **Process**:
  1. Deduplicate by Wikidata Q-ID
  2. Fetch pageviews for all candidates
  3. Sort by pageviews (desc), then sitelinkCount (tiebreaker)
  4. Take top N (default 12)
  5. Resolve types, assign durations, generate stable IDs
  6. Return final Place[] with id, name, type, duration

---

### Utilities

#### [slug.ts](generate/utils/slug.ts)
- **Purpose**: Generates deterministic, human-readable place IDs
- **Key Functions**:
  - `toSlug(name)` — Converts name to lowercase slug with underscores
  - `shortenSlug(slug, maxLen=24)` — Caps length, cuts on word boundary
  - `makeId(name)` — Full pipeline: name → final stable ID
- **Examples**:
  - "Senso-ji Temple, Asakusa" → `sensoji_temple`
  - "Osaka Castle" → `osaka_castle`
  - "teamLab Borderless" → `teamlab_borderless`

---

### Types

#### [types/index.ts](generate/types/index.ts)
- **Purpose**: Shared TypeScript interfaces
- **Key Types**:
  - `PlaceType` — Union of 20 place categories (Temple | Shrine | Museum | Park | ...)
  - `Place` — id, name, type, duration (final output shape)
  - `City` — name, places[]
  - `CountryData` — countryCode, countryName, cities, typeColors
  - `WikidataPlace` — Raw result from Wikipedia (wikidataId, name, description, sitelinkCount)
  - `EnrichedPlace` — Intermediate: WikidataPlace + pageviews + resolved type + duration

---

## Important Method Descriptions

### Core Pipeline Methods

#### `generateCountry(countryKey: string): Promise<void>`
**Location**: [generate.ts](generate/generate.ts#L23-L88)

Orchestrates the full pipeline for a single country:
1. Load country config
2. For each city: fetch candidates → enrich → rank → resolve types
3. Write final JSON to `web/src/data/countries/{countryKey}/itinerary-places.json`

**Parameters**:
- `countryKey` — e.g. "japan", "france" (must exist in COUNTRIES config)

**Throws**: Exits with code 1 if country not found

---

#### `fetchWikidataPlaces(cityName, wikidataId?, regionQId?, minSitelinks?): Promise<WikidataPlace[]>`
**Location**: [wikidata.ts](generate/pipeline/wikidata.ts#L42-L98)

Fetches all tourist attraction pages for a city via Wikipedia categories.

**Algorithm**:
```
For each category pattern (17 total):
  → GET category members
  → Filter out blacklisted titles
  → Aggregate into titleSet

POST pageDetails for all titles (in 50-title batches):
  → Fetch wikibase_item Q-ID
  → Fetch description string
  → Return WikidataPlace[] with sitelinkCount
```

**Rate Limiting**: Built-in 500ms/800ms delays per API spec

---

#### `enrichPlaces(wikidataPlaces[], cityName, topN=12): Promise<EnrichedPlace[]>`
**Location**: [enricher.ts](generate/pipeline/enricher.ts#L13-L60)

Deduplicates, ranks by popularity, resolves types, and finalizes place data.

**Steps**:
1. **Deduplicate** by Wikidata Q-ID
2. **Fetch Pageviews** for all candidates via Wikimedia REST API
3. **Rank** by pageviews (desc), then sitelinkCount (tiebreak)
4. **Take Top N** (default 12 per city)
5. **Resolve Types** using `typeResolver`
6. **Assign Durations** from `durations.ts`
7. **Generate IDs** via `slug.ts`

**Output**: EnrichedPlace[] with type, duration, id resolved

---

#### `resolveType(description: string): PlaceType`
**Location**: [typeResolver.ts](generate/pipeline/typeResolver.ts#L24-L75)

Classifies a place via Wikipedia article description.

**Logic**:
1. Keyword match on description (e.g., "Buddhist temple" → Temple)
2. If no match, try name heuristics (e.g., "... Garden" → Garden)
3. Last resort: Q-ID mapping (see typeMap.ts)

**Example**:
```
Input:  "Buddhist temple in Asakusa, Tokyo"
Output: "Temple"
```

---

#### `fetchPageviewsBatch(titles[], concurrency=5): Promise<Map<string, number>>`
**Location**: [pageviews.ts](generate/pipeline/pageviews.ts#L49-L76)

Fetches Wikipedia pageview counts for a batch of articles.

**Concurrency Model**:
- Process `concurrency` titles in parallel
- 200ms delay between batches
- Respects Wikimedia 100 req/s rate limit

**Returns**: Map of title → monthly pageview count

---

#### `makeId(name: string): string`
**Location**: [slug.ts](generate/utils/slug.ts#L24-L33)

Generates a deterministic, stable ID for a place name.

**Process**:
1. Lowercase
2. Remove parentheticals, filler words (the, a, and, of)
3. Remove special characters (keep alphanumeric, hyphens)
4. Replace spaces/hyphens with underscores
5. Shorten to 24 chars max (cut on word boundary)

**Property**: Idempotent — same input always produces same ID

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   pnpm generate <country>                      │
│                    (generate.ts entry point)                    │
└────────────────────────────┬──────────────────────────────────┘
                             │
                    Load COUNTRIES config
                             │
                             ▼
                   ┌─────────────────────┐
                   │ For each city:      │
                   │ (sequential, ~1.5s) │
                   └──────────┬──────────┘
                              │
           ┌──────────────────┴──────────────────┐
           │ fetchWikidataPlaces()               │
           │ (wikidata.ts)                       │
           │                                     │
           │ 1. Try 17 category patterns         │
           │ 2. GET category members (500ms)    │
           │ 3. Filter blacklist                │
           │ 4. POST pageDetails (800ms)        │
           │ 5. Extract Q-ID + description      │
           │                                     │
           │ Output: WikidataPlace[] (50-100)   │
           └──────────────────┬──────────────────┘
                              │
                              ▼
           ┌──────────────────────────────────┐
           │ enrichPlaces()                   │
           │ (enricher.ts)                    │
           │                                  │
           │ 1. Deduplicate by Q-ID           │
           │ 2. fetchPageviewsBatch()         │
           │    (pageviews.ts)                │
           │    - Fetch monthly views per     │
           │      title (concurrency=6)       │
           │    - Wikimedia REST API          │
           │                                  │
           │ 3. Sort by pageviews (desc)      │
           │ 4. Take top 12                   │
           │ 5. resolveType()                 │
           │    (typeResolver.ts)             │
           │    - Match description keywords  │
           │    - Apply name heuristics       │
           │                                  │
           │ 6. Assign duration from          │
           │    durations.ts                  │
           │ 7. makeId() via slug.ts          │
           │                                  │
           │ Output: EnrichedPlace[]          │
           └──────────────────┬───────────────┘
                              │
                              ▼
           ┌──────────────────────────────────┐
           │ toPlaceOutput()                  │
           │ (enricher.ts)                    │
           │                                  │
           │ Strip internal fields:           │
           │ {id, name, type, duration}      │
           │                                  │
           │ Output: Place[]                  │
           └──────────────────┬───────────────┘
                              │
                              ▼
           ┌──────────────────────────────────┐
           │ generateCountry() continues      │
           │ Aggregate all cities             │
           └──────────────────┬───────────────┘
                              │
                              ▼
           ┌──────────────────────────────────┐
           │ Write to:                        │
           │ web/src/data/countries/{key}/    │
           │   itinerary-places.json          │
           │                                  │
           │ Contents:                        │
           │ {                                │
           │   countryCode,                   │
           │   countryName,                   │
           │   cities: {                      │
           │     slug: {name, places[]},      │
           │   },                             │
           │   typeColors: {...}              │
           │ }                                │
           └──────────────────┬───────────────┘
                              │
                              ▼
                 ✅ Console: "Written to..."
                 📊 Console: Summary table
```

---

## Entry Point

### Primary Entry Point
```bash
pnpm generate <country>
```

**File**: [generate.ts](generate/generate.ts)

**Command Examples**:
```bash
# Generate Japan only
pnpm generate japan

# Generate all configured countries
pnpm generate all

# Invalid usage (exits with code 1)
pnpm generate invalid_country
```

**Execution Flow**:
1. Parse `process.argv[2]` (country key or "all")
2. Call `generateCountry(key)` or `generateAll()`
3. For each city:
   - `fetchWikidataPlaces()` → 50-100 candidates
   - `enrichPlaces()` → rank, type-resolve, top 12
   - Accumulate to cities map
4. Write JSON output
5. Print summary to console

**Configuration Used**:
- `COUNTRIES` from [countries.ts](generate/config/countries.ts)
- `TYPE_COLORS` from [typeColors.ts](generate/config/typeColors.ts)
- `DURATIONS` from [durations.ts](generate/config/durations.ts)
- `LABEL_TYPE_MAP` from [typeMap.ts](generate/config/typeMap.ts)

---

## Exit Point

### Output Location
```
web/src/data/countries/{countryKey}/itinerary-places.json
```

**Example** (Japan):
```
web/src/data/countries/japan/itinerary-places.json
```

### Output Schema

```typescript
interface CountryData {
  countryCode: string;                    // "JP"
  countryName: string;                    // "Japan"
  cities: Record<string, City>;           // { tokyo: {...}, kyoto: {...} }
  typeColors: Record<PlaceType, string>;  // { "Temple": "#FF6B6B", ... }
}

interface City {
  name: string;          // "Tokyo"
  places: Place[];       // Top 12 places
}

interface Place {
  id: string;            // "sensoji_temple" (stable, deterministic)
  name: string;          // "Senso-ji Temple, Asakusa"
  type: PlaceType;       // "Temple"
  duration: string;      // "2h"
}
```

### Example Output

```json
{
  "countryCode": "JP",
  "countryName": "Japan",
  "cities": {
    "tokyo": {
      "name": "Tokyo",
      "places": [
        {
          "id": "sensoji_temple",
          "name": "Senso-ji Temple, Asakusa",
          "type": "Temple",
          "duration": "2h"
        },
        {
          "id": "tokyo_tower",
          "name": "Tokyo Tower",
          "type": "Landmark",
          "duration": "1h"
        }
      ]
    },
    "kyoto": {
      "name": "Kyoto",
      "places": [...]
    }
  },
  "typeColors": {
    "Temple": "#FF6B6B",
    "Museum": "#4ECDC4",
    "Park": "#95E77D"
  }
}
```

### Consumption
This JSON is consumed by the frontend at:
- [web/src/lib/data/repository.ts](../../web/src/lib/data/repository.ts) — Data loading
- Itinerary UI components for place cards, type badges, durations

---

## Constants & Configuration

| Constant | Value | Location | Purpose |
|----------|-------|----------|---------|
| `PLACES_PER_CITY` | 12 | generate.ts | Top N places per city |
| `MIN_SITELINKS` | 5 | generate.ts | Min Wikipedia cross-language links (quality filter) |
| `CITY_DELAY_MS` | 1500 | generate.ts | Delay between city processing |
| `PLACES_PER_CITY` | 12 | enricher.ts | Default topN in enrichPlaces() |
| `DELAY_BETWEEN_CATEGORIES_MS` | 500 | wikidata.ts | Courtesy delay between Category API calls |
| `DELAY_BETWEEN_DETAIL_BATCHES_MS` | 800 | wikidata.ts | Courtesy delay between pageDetails batches |
| `CONCURRENCY` | 5-6 | pageviews.ts | Parallel pageview fetches |

---

## Environment

**Required**:
- Node.js 18+
- `tsx` (TypeScript executor) in devDependencies
- Network access to Wikipedia/Wikidata APIs

**API Dependencies** (all free, no auth):
- `https://en.wikipedia.org/w/api.php` — Category + page details
- `https://wikimedia.org/api/rest_v1/metrics/pageviews` — Popularity ranking

**Rate Limits**:
- Wikipedia anonymous: ~5 req/s (we use 1-2)
- Wikimedia pageviews: 100 req/s (we use 5-6)

---

## Extending

### Add a New Country
Edit [countries.ts](generate/config/countries.ts):
```typescript
export const COUNTRIES: Record<string, CountryConfig> = {
  ...
  myCountry: {
    countryCode: "MC",
    countryName: "My Country",
    cities: [
      { slug: "city1", name: "City 1", wikidataId: "Q12345" },
      { slug: "city2", name: "City 2", wikidataId: "Q67890" },
    ],
  },
};
```

Then run:
```bash
pnpm generate mycountry
```

### Add a New Place Type
1. Update `PlaceType` union in [types/index.ts](generate/types/index.ts)
2. Add keyword to `descriptionMap` in [typeResolver.ts](generate/pipeline/typeResolver.ts)
3. Add Wikidata Q-ID mapping to [typeMap.ts](generate/config/typeMap.ts)
4. Add duration to [durations.ts](generate/config/durations.ts)
5. Add color to [typeColors.ts](generate/config/typeColors.ts)

### Troubleshoot Missing Places
1. Check console logs for city names that returned 0 places
2. Verify `categoryCity` override if Wikipedia category name ≠ display name
3. Lower `MIN_SITELINKS` threshold for less-covered regions
4. Check Wikipedia directly: `https://en.wikipedia.org/wiki/Category:Tourist_attractions_in_CityName`

---

## References

- **Wikidata**: https://www.wikidata.org/
- **Wikipedia Categories API**: https://en.wikipedia.org/w/api.php?action=help&modules=query%2Bcat
- **Wikimedia Pageviews API**: https://wikimedia.org/api/rest_v1/
- **Frontend Consumer**: [itineraryService](../../web/src/features/itinerary) (data loading & place filtering)
