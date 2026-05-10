#!/usr/bin/env tsx
// visamate/scripts/itenrary/generate/pipeline/debug.ts
// Run this ONCE to diagnose what the API is actually returning.
// Usage: tsx scripts/itenrary/generate/pipeline/debug.ts

const WP_API = "https://en.wikipedia.org/w/api.php";

async function main() {
  // ── Test 1: Category fetch for Osaka (known to have 42 pages) ──
  console.log("\n=== TEST 1: Category fetch for Osaka ===");
  const cat1 = new URLSearchParams({
    action: "query",
    list: "categorymembers",
    cmtitle: "Category:Tourist_attractions_in_Osaka",
    cmlimit: "10",
    cmtype: "page",
    cmnamespace: "0",
    format: "json",
    origin: "*",
  });
  const url1 = `${WP_API}?${cat1}`;
  console.log("URL:", url1);
  try {
    const res = await fetch(url1, { headers: { "User-Agent": "visamate-debug/1.0" } });
    console.log("Status:", res.status, res.statusText);
    const text = await res.text();
    console.log("Response (first 500 chars):", text.slice(0, 500));
  } catch (e) { console.error("FETCH ERROR:", e); }

  // ── Test 2: Category fetch WITHOUT origin=* ──────────────────
  console.log("\n=== TEST 2: Same but WITHOUT origin=* ===");
  const cat2 = new URLSearchParams({
    action: "query",
    list: "categorymembers",
    cmtitle: "Category:Tourist_attractions_in_Osaka",
    cmlimit: "10",
    cmtype: "page",
    format: "json",
  });
  const url2 = `${WP_API}?${cat2}`;
  console.log("URL:", url2);
  try {
    const res = await fetch(url2, { headers: { "User-Agent": "visamate-debug/1.0" } });
    console.log("Status:", res.status, res.statusText);
    const text = await res.text();
    console.log("Response (first 500 chars):", text.slice(0, 500));
  } catch (e) { console.error("FETCH ERROR:", e); }

  // ── Test 3: Kyoto page details batch ─────────────────────────
  console.log("\n=== TEST 3: pageprops for known Kyoto pages ===");
  const titles = ["Kinkaku-ji", "Fushimi_Inari-taisha", "Arashiyama", "Gion", "Kiyomizudera"];
  const cat3 = new URLSearchParams({
    action: "query",
    titles: titles.join("|"),
    prop: "pageprops|extracts",
    ppprop: "wikibase_item",
    exintro: "1",
    exsentences: "2",
    explaintext: "1",
    exlimit: "max",
    format: "json",
  });
  const url3 = `${WP_API}?${cat3}`;
  console.log("URL:", url3.slice(0, 200) + "...");
  try {
    const res = await fetch(url3, { headers: { "User-Agent": "visamate-debug/1.0" } });
    console.log("Status:", res.status, res.statusText);
    const json = await res.json() as any;
    const pages = Object.values(json.query?.pages ?? {}) as any[];
    console.log(`Got ${pages.length} pages`);
    for (const p of pages) {
      console.log(`  - ${p.title}: wikibase_item=${p.pageprops?.wikibase_item ?? "MISSING"}, extract="${(p.extract ?? "").slice(0,80)}"`);
    }
  } catch (e) { console.error("FETCH ERROR:", e); }

  // ── Test 4: Kyoto category — what does it actually return? ───
  console.log("\n=== TEST 4: Kyoto category members raw ===");
  const cat4 = new URLSearchParams({
    action: "query",
    list: "categorymembers",
    cmtitle: "Category:Tourist_attractions_in_Kyoto",
    cmlimit: "5",
    format: "json",
  });
  try {
    const res = await fetch(`${WP_API}?${cat4}`, { headers: { "User-Agent": "visamate-debug/1.0" } });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text.slice(0, 600));
  } catch (e) { console.error("FETCH ERROR:", e); }
}

main();