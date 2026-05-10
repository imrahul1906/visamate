/**
 * visaFormService.ts
 *
 * Pure business logic for the Visa Form Fill Helper.
 * No React, no hooks, no JSX — fully unit-testable.
 *
 * Consumed by: VisaFormWidget.tsx
 */

import type { FormFillField } from "../../lib/data/repository";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

/** Sections map: section name → fields belonging to it. */
export type SectionMap = Record<string, FormFillField[]>;

// ─────────────────────────────────────────────────────────────
// Section grouping
// ─────────────────────────────────────────────────────────────

/**
 * Groups a flat list of fields into an ordered section map.
 * Preserves the insertion order of sections as they appear in the fields array.
 */
export function groupFieldsBySection(fields: FormFillField[]): SectionMap {
  return fields.reduce<SectionMap>((acc, field) => {
    (acc[field.section] ??= []).push(field);
    return acc;
  }, {});
}

// ─────────────────────────────────────────────────────────────
// Search / filtering
// ─────────────────────────────────────────────────────────────

/**
 * Filters fields by a search query, matching against label, section, and hint.
 * Returns all fields when the query is empty.
 */
export function filterFields(
  fields: FormFillField[],
  query: string
): FormFillField[] {
  if (!query.trim()) return fields;
  const q = query.toLowerCase();
  return fields.filter(
    (f) =>
      f.label.toLowerCase().includes(q) ||
      f.section.toLowerCase().includes(q) ||
      f.hint.toLowerCase().includes(q)
  );
}

// ─────────────────────────────────────────────────────────────
// Section collapse state initialisation
// ─────────────────────────────────────────────────────────────

/**
 * Returns the initial set of collapsed sections — everything except the first
 * section, so the user lands with the first section open and the rest folded.
 */
export function getInitialCollapsedSections(
  fields: FormFillField[]
): Set<string> {
  const uniqueSections = [...new Set(fields.map((f) => f.section))];
  return new Set(uniqueSections.slice(1));
}

/**
 * Toggles a section's collapsed state immutably.
 */
export function toggleSection(
  collapsed: Set<string>,
  sectionName: string
): Set<string> {
  const next = new Set(collapsed);
  next.has(sectionName) ? next.delete(sectionName) : next.add(sectionName);
  return next;
}

// ─────────────────────────────────────────────────────────────
// Progress tracking
// ─────────────────────────────────────────────────────────────

/**
 * Marks a field as done / not-done, returning the new Set immutably.
 */
export function toggleDone(done: Set<string>, id: string): Set<string> {
  const next = new Set(done);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
}

export interface ProgressStats {
  totalFields: number;
  doneCount: number;
  donePct: number;
  allDone: boolean;
}

/**
 * Computes progress statistics from the current done-set and total field count.
 */
export function getProgressStats(
  totalFields: number,
  doneFields: Set<string>
): ProgressStats {
  const doneCount = doneFields.size;
  const donePct = totalFields > 0 ? Math.round((doneCount / totalFields) * 100) : 0;
  const allDone = doneCount === totalFields && totalFields > 0;
  return { totalFields, doneCount, donePct, allDone };
}

// ─────────────────────────────────────────────────────────────
// Clipboard helper
// ─────────────────────────────────────────────────────────────

/**
 * Copies an example value to the clipboard and invokes a callback so the
 * caller can manage the "copied" flash state. Returns a cleanup timeout ID
 * so the caller can cancel it if the component unmounts.
 */
export function copyExample(
  example: string,
  onCopied: () => void,
  resetDelay = 1800
): ReturnType<typeof setTimeout> {
  navigator.clipboard.writeText(example).catch(() => { });
  onCopied();
  return setTimeout(onCopied, resetDelay);
}

// ─────────────────────────────────────────────────────────────
// Form type helpers
// ─────────────────────────────────────────────────────────────

/**
 * Returns true when the document requires the user to download and print
 * the form (as opposed to filling it online).
 */
export function isDownloadableForm(formType: string | undefined): boolean {
  return !formType || formType === "DOWNLOADABLE";
}