#!/usr/bin/env tsx
// visamate/scripts/itenrary/generate/generate.ts
//
// Usage:
//   pnpm generate japan
//   pnpm generate all

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { COUNTRIES } from "./config/countries.js";
import { TYPE_COLORS } from "./config/typeColors.js";
import { fetchWikidataPlaces } from "./pipeline/wikidata.js";
import { enrichPlaces, toPlaceOutput } from "./pipeline/enricher.js";
import type { CountryData, CityMap } from "./types/index.js";

const PLACES_PER_CITY = 12;
const MIN_SITELINKS   = 5;
const CITY_DELAY_MS   = 1500;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "..", "..", "web", "src", "data", "countries");

async function generateCountry(countryKey: string): Promise<void> {
  const config = COUNTRIES[countryKey];
  if (!config) {
    console.error(`Unknown country: "${countryKey}". Available: ${Object.keys(COUNTRIES).join(", ")}`);
    process.exit(1);
  }

  console.log(`\n🌏 Generating ${config.countryName}...`);
  console.log(`   Cities: ${config.cities.map((c) => c.name).join(", ")}\n`);

  const cities: CityMap = {};

  for (const cityConfig of config.cities) {
    console.log(`\n📍 ${cityConfig.name}`);
    try {
      // categoryCity overrides the name used for Wikipedia category lookups.
      // e.g. "Hokkaido (Sapporo)" → use "Sapporo" for the category search.
      const lookupName = cityConfig.categoryCity ?? cityConfig.name;

      const rawPlaces = await fetchWikidataPlaces(
        lookupName,
        cityConfig.wikidataId,
        cityConfig.regionQId,
        MIN_SITELINKS
      );

      const enriched = await enrichPlaces(rawPlaces, cityConfig.name, PLACES_PER_CITY);
      const places   = toPlaceOutput(enriched);

      cities[cityConfig.slug] = { name: cityConfig.name, places };

      if (places.length === 0) {
        console.warn(`  ⚠️  0 places — add to overrides file or lower MIN_SITELINKS`);
      } else {
        console.log(`  ✅ ${places.length} places: ${places.map((p) => p.name).join(", ")}`);
      }
    } catch (err) {
      console.error(`  ❌ Failed for ${cityConfig.name}:`, err);
      cities[cityConfig.slug] = { name: cityConfig.name, places: [] };
    }

    if (cityConfig !== config.cities[config.cities.length - 1]) {
      await sleep(CITY_DELAY_MS);
    }
  }

  const output: CountryData = {
    countryCode: config.countryCode,
    countryName: config.countryName,
    cities,
    typeColors: TYPE_COLORS,
  };

  const countryDir = join(OUTPUT_DIR, countryKey);
  mkdirSync(countryDir, { recursive: true });
  const outPath = join(countryDir, "itinerary-places.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`\n✅ Written to ${outPath}`);
  printSummary(output);
}

async function generateAll(): Promise<void> {
  for (const key of Object.keys(COUNTRIES)) {
    await generateCountry(key);
    await sleep(3000);
  }
}

const arg = process.argv[2]?.toLowerCase();
if (!arg) {
  console.error("Usage: pnpm generate <country|all>");
  process.exit(1);
}

if (arg === "all") {
  generateAll().catch((err) => { console.error(err); process.exit(1); });
} else {
  generateCountry(arg).catch((err) => { console.error(err); process.exit(1); });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function printSummary(data: CountryData): void {
  console.log("\n── Summary ────────────────────────────────────────");
  for (const [slug, city] of Object.entries(data.cities)) {
    const types = [...new Set(city.places.map((p) => p.type))].join(", ");
    console.log(`  ${slug.padEnd(15)} ${city.places.length} places  [${types}]`);
  }
  console.log("────────────────────────────────────────────────────");
}