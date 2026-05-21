/**
 * itineraryService.ts
 *
 * Pure business logic for the Japan Visa Itinerary builder.
 * No React, no hooks, no JSX — fully unit-testable.
 *
 * Consumed by: ItineraryWidget.tsx
 *
 * Changes vs previous version:
 *  - Removed: wrapText, resolveRepeatedValue (pdf-lib layout helpers — no longer needed)
 *  - Removed: downloadOfficialPdf, buildPdfFilename (moved to itineraryDocxService.ts)
 *  - All state-mutation helpers (addPlace, moveUp/Down, etc.) are unchanged.
 */

import type { ItineraryCityMap } from "@/lib/data/types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface ItineraryItem {
  city: string;
  placeId: string;
  day: number;
  order: number;
  customName?: string;
}

export interface Accommodation {
  hotelName: string;
  hotelContact: string;
}

export type AccommodationMap = Record<number, Accommodation>;

export interface ValidationErrors {
  [key: string]: string;
}

// ─────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────

/**
 * Returns the calendar date for a given day number, formatted as DD/MM/YYYY
 * (official Japan itinerary format). Falls back to "Day N" when no start date
 * is available.
 */
export function dateForDay(startDate: string, dayNumber: number): string {
  if (!startDate) return `Day ${dayNumber}`;
  const dt = new Date(startDate + "T00:00:00");
  if (isNaN(dt.getTime())) return `Day ${dayNumber}`;
  dt.setDate(dt.getDate() + dayNumber - 1);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Formats a date string as "1 March 2025" for document headers.
 */
export function fmtDateLong(iso: string): string {
  if (!iso) return "[Date]";
  const dt = new Date(iso + "T00:00:00");
  if (isNaN(dt.getTime())) return iso;
  return dt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─────────────────────────────────────────────────────────────
// Itinerary item mutations
// (Return new arrays — never mutate the existing state array)
// ─────────────────────────────────────────────────────────────

/**
 * Adds a place to a given day. No-ops if the place is already on that day.
 */
export function addPlace(
  itinerary: ItineraryItem[],
  activeDay: number,
  selectedCity: string,
  placeId: string
): ItineraryItem[] {
  const alreadyAdded = itinerary.some(
    (x) => x.day === activeDay && x.placeId === placeId
  );
  if (alreadyAdded) return itinerary;

  const maxOrder = Math.max(
    0,
    ...itinerary.filter((x) => x.day === activeDay).map((x) => x.order)
  );

  return [
    ...itinerary,
    { city: selectedCity, placeId, day: activeDay, order: maxOrder + 1 },
  ];
}

/**
 * Adds a custom (free-text) activity to a given day.
 * Returns [updatedItinerary, generatedId].
 */
export function addCustomActivity(
  itinerary: ItineraryItem[],
  activeDay: number,
  name: string
): [ItineraryItem[], string] {
  const trimmed = name.trim();
  if (!trimmed) return [itinerary, ""];

  const customId = `custom_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const maxOrder = Math.max(
    0,
    ...itinerary.filter((x) => x.day === activeDay).map((x) => x.order)
  );

  const updated = [
    ...itinerary,
    { city: "", placeId: customId, day: activeDay, order: maxOrder + 1, customName: trimmed },
  ];

  return [updated, customId];
}

/** Removes a specific place from a specific day. */
export function removePlace(
  itinerary: ItineraryItem[],
  placeId: string,
  day: number
): ItineraryItem[] {
  return itinerary.filter((x) => !(x.placeId === placeId && x.day === day));
}

/** Moves a place one position up within its day. */
export function moveUp(
  itinerary: ItineraryItem[],
  activeDay: number,
  placeId: string
): ItineraryItem[] {
  const items = itinerary
    .filter((x) => x.day === activeDay)
    .sort((a, b) => a.order - b.order)
    .map((x) => ({ ...x }));

  const idx = items.findIndex((x) => x.placeId === placeId);
  if (idx <= 0) return itinerary;

  [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
  items.forEach((x, i) => { x.order = i + 1; });

  return [...itinerary.filter((x) => x.day !== activeDay), ...items];
}

/** Moves a place one position down within its day. */
export function moveDown(
  itinerary: ItineraryItem[],
  activeDay: number,
  placeId: string
): ItineraryItem[] {
  const items = itinerary
    .filter((x) => x.day === activeDay)
    .sort((a, b) => a.order - b.order)
    .map((x) => ({ ...x }));

  const idx = items.findIndex((x) => x.placeId === placeId);
  if (idx >= items.length - 1) return itinerary;

  [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
  items.forEach((x, i) => { x.order = i + 1; });

  return [...itinerary.filter((x) => x.day !== activeDay), ...items];
}

// ─────────────────────────────────────────────────────────────
// Derived selectors
// ─────────────────────────────────────────────────────────────

/** Returns items for a given day, sorted by order. */
export function getDayItems(
  itinerary: ItineraryItem[],
  day: number
): ItineraryItem[] {
  return itinerary
    .filter((x) => x.day === day)
    .sort((a, b) => a.order - b.order);
}

/** Returns the accommodation record for a day, with empty-string defaults. */
export function getAccomForDay(
  accommodations: AccommodationMap,
  day: number
): Accommodation {
  return accommodations[day] ?? { hotelName: "", hotelContact: "" };
}

/**
 * Extracts the unique city display-names that appear in the itinerary.
 * Used to sync back to ApplicantContext so CoverLetterBuilder can read them.
 */
export function getUniqueCityNames(
  itinerary: ItineraryItem[],
  cities: ItineraryCityMap
): string[] {
  const uniqueKeys = [...new Set(itinerary.map((x) => x.city).filter(Boolean))];
  return uniqueKeys
    .map((k) => cities[k]?.name)
    .filter((n): n is string => !!n);
}

/** Resolves the display name of a place (custom activity or city place). */
export function resolvePlaceName(
  item: ItineraryItem,
  cities: ItineraryCityMap
): string {
  if (item.customName) return item.customName;
  const city = cities[item.city];
  return city?.places.find((p) => p.id === item.placeId)?.name ?? "";
}

// ─────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────

export function validateItinerary(
  itinerary: ItineraryItem[],
  startDate: string,
  allDays: number[],
  accommodations: AccommodationMap
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (itinerary.length === 0) {
    errors["activities"] = "Add at least one activity.";
  }
  if (!startDate) {
    errors["date"] = "Start date is required.";
  }

  allDays.forEach((d) => {
    if (!(accommodations[d]?.hotelName ?? "").trim()) {
      errors[`day_${d}_hotel`] = "Hotel name required";
    }
    if (!(accommodations[d]?.hotelContact ?? "").trim()) {
      errors[`day_${d}_contact`] = "Contact / phone required";
    }
  });

  return errors;
}

// ─────────────────────────────────────────────────────────────
// Official blank PDF download
// ─────────────────────────────────────────────────────────────

/** Triggers a browser download of the official Japan itinerary blank PDF. */
export function downloadOfficialPdf(countryName: string): void {
  const url = "https://www.mofa.go.jp/files/000262548.pdf";
  const a = document.createElement("a");
  a.href = url;
  a.download = `${countryName.toLowerCase().replace(/\s+/g, "_")}_official_itinerary_format.pdf`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}