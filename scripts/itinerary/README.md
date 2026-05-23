# visamate/scripts/itinerary — Place Generator

Generates `itinerary-places.json`-compatible data for any country
using **Wikipedia Categories** (quality filter) + **Wikipedia Pageviews API** (popularity ranking).
Zero cost, no API keys needed.

---

## File Structure

```
visamate/
├── scripts/
│   ├── itinerary/
│   │   ├── generate.ts             ← CLI entry point
│   │   ├── types/
│   │   │   └── index.ts            ← shared types (Place, City, etc.)
│   │   ├── config/
│   │   │   ├── countries.ts        ← cities + Wikidata Q-IDs
│   │   │   ├── typeMap.ts          ← Wikidata Q-ID → PlaceType
│   │   │   ├── durations.ts        ← PlaceType → visit duration
│   │   │   └── typeColors.ts       ← PlaceType → hex color
│   │   ├── utils/
│   │   │   ├── slug.ts             ← deterministic ID generator
│   │   │   └── cache.ts            ← filesystem cache utility
│   │   └── pipeline/
│   │       ├── wikidata.ts         ← Wikipedia category fetcher
│   │       ├── pageviews.ts        ← Wikipedia pageviews ranker
│   │       ├── typeResolver.ts     ← description → PlaceType resolver
│   │       └── enricher.ts         ← combines everything
```

---

## Setup

Add to your root `package.json` scripts:

```json
{
  "scripts": {
    "generate": "tsx scripts/itinerary/generate.ts"
  },
  "devDependencies": {
    "tsx": "^4.0.0"
  }
}
```

Install tsx if not already present:
```bash
pnpm add -D tsx
```

---

## Usage

```bash
# Generate one country
pnpm approve-builds esbuild
pnpm generate japan
pnpm generate france
pnpm generate india

# Generate all countries sequentially
pnpm generate all
```

Output lands at `web/src/data/countries/{country}/itinerary-places.json`.

---

## Pipeline Flow

```
pnpm generate japan
  │
  ├─ For each city in countries.ts (Tokyo, Kyoto, Osaka...)
  │    │
  │    ├─ wikidata.ts  → Category API query → up to 60 candidates
  │    │                  Filter: 5+ Wikipedia language links
  │    │
  │    ├─ pageviews.ts → Wikipedia API → monthly views per article
  │    │                  Senso-ji: ~200k/mo | random shrine: ~400/mo
  │    │
  │    ├─ enricher.ts  → deduplicate → sort by pageviews → top 12
  │    │
  │    └─ typeResolver.ts → Description/name heuristic → PlaceType
  │
  └─ Write web/src/data/countries/japan/itinerary-places.json
```

---

## Tuning

| Constant in `generate.ts`  | Default | Effect |
|---------------------------|---------|--------|
| `PLACES_PER_CITY`         | 12      | More/fewer places per city |
| `MIN_SITELINKS`           | 5       | Lower for thin-coverage cities (India tier-2) |
| `CITY_DELAY_MS`           | 1500    | Polite rate limiting |

---

## Manual Overrides

For cities where Wikidata coverage is thin (small Indian cities, rural Vietnam, etc.),
create a manual override file:

```
visamate/scripts/itinerary/overrides/<country>.ts
```

```ts
// visamate/scripts/itinerary/overrides/india.ts
export const OVERRIDES: Record<string, Place[]> = {
  varanasi: [
    { id: "ghats_varanasi", name: "Dashashwamedh Ghat", type: "Religious Site", duration: "2h" },
    // ...
  ],
};
```

The enricher will merge overrides after the pipeline runs,
filling cities that came back with fewer than ~6 results.

---

## Known Limitations

- **Wikidata coverage**: Famous landmarks always present.
  Tier-2 cities in India/Vietnam/Morocco may return only 5–8 places.
  Use manual overrides (see above) to pad gaps.
- **Type accuracy**: Wikidata P31 labels are sometimes wrong or too generic.
  The name heuristics in `typeResolver.ts` catch most cases. Add more
  entries to `LABEL_TYPE_MAP` or `nameHeuristics` when you spot errors.
- **Wikipedia title mismatch**: A few places have English Wikipedia articles
  under unexpected titles. Their pageviews will come back 0; they'll still
  appear but ranked lower (sitelinks break the tie).
