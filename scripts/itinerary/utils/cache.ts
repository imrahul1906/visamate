// visamate/scripts/itinerary/utils/cache.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// One level up from utils, then into .cache
const CACHE_DIR = join(__dirname, "..", ".cache");

function getCachePath(key: string): string {
  const safeName = key.replace(/[^a-z0-9]/gi, "_").slice(0, 100);
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return join(CACHE_DIR, `${safeName}_${Math.abs(hash)}.json`);
}

export function getCachedData<T>(key: string, maxAgeMs: number = 24 * 60 * 60 * 1000): T | null {
  try {
    const cachePath = getCachePath(key);
    if (!existsSync(cachePath)) return null;

    const stats = statSync(cachePath);
    const age = Date.now() - stats.mtimeMs;
    if (age > maxAgeMs) return null; // Cache expired

    const raw = readFileSync(cachePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  try {
    const cachePath = getCachePath(key);
    mkdirSync(dirname(cachePath), { recursive: true });
    writeFileSync(cachePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("  ⚠️ Failed to write cache:", err);
  }
}
