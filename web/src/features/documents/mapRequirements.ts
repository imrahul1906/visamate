// web\src\features\documents\mapRequirements.ts
//
// Maps raw RequirementsData from the repository into the UI-ready DocumentData shape.

import type { RequirementsData } from "@/lib/data/types";
import type { DocumentData, DocumentCategory, DocumentItem, VisaFormInfo, SpecialWidget } from "../../types/document";

// ─────────────────────────────────────────────────────────────
// Section metadata
// ─────────────────────────────────────────────────────────────

export const SECTION_META: Record<string, { icon: string; color: string }> = {
  COMMON: { icon: "passport", color: "#6366f1" },
  SELF_SPONSORED: { icon: "finance", color: "#10b981" },
  SPONSORED: { icon: "finance", color: "#0ea5e9" },
};

// Doc codes that must NOT have an upload slot.
export const NO_UPLOAD_CODES = new Set([
  "PASSPORT",
  "PHOTOGRAPH",
  "VISA_APPLICATION_FORM",
]);

// Doc codes → special widget type.
// Keep in sync with the SpecialWidget union in types/document.ts.
// IMPORTANT: keys must exactly match the `code` field in the JSON data.
export const SPECIAL_WIDGETS: Record<string, SpecialWidget> = {
  PHOTOGRAPH:             "photo_spec",
  VISA_APPLICATION_FORM:  "visa_form",
  JAPAN_ITINERARY:        "itinerary",
  FRANCE_ITINERARY:       "itinerary",
  COVER_LETTER:           "cover_letter",
  // FIX: was "DOCUMENT_CHECKLIST" but JSON uses code "DOC_CHECKLIST"
  DOC_CHECKLIST:          "document_checklist",
};

// ─────────────────────────────────────────────────────────────
// Mapper
// ─────────────────────────────────────────────────────────────

export function mapRequirementsToDocumentData(
  req: RequirementsData,
  countryName: string,
  visaTypeName: string,
  locationName: string,
  sponsorship: string,
): DocumentData {
  const categories: DocumentCategory[] = req.documentSections
    .filter(section => {
      if (!section.applicableWhen) return true;
      if (section.applicableWhen.sponsorship)
        return section.applicableWhen.sponsorship === sponsorship.toUpperCase();
      return true;
    })
    .map(section => {
      const meta = SECTION_META[section.sectionId] ?? { icon: "personal", color: "#f59e0b" };

      const documents: DocumentItem[] = section.documents.map(doc => {
        const tips: string[] = [];
        if (doc.requirements) tips.push(...doc.requirements);
        if (doc.alternativeDocuments) tips.push(...doc.alternativeDocuments);

        const formInfo: VisaFormInfo | undefined = doc.form
          ? {
            type: (doc.form.type === "ONLINE" ? "ONLINE" : "DOWNLOADABLE") as "DOWNLOADABLE" | "ONLINE",
            downloadUrl: doc.form.downloadUrl ?? null,
            onlineUrl: doc.form.onlineUrl ?? null,
            requiresPrint: doc.form.requiresPrint ?? false,
            formFillDataKey: doc.form.formFillDataKey ?? null,
          }
          : undefined;

        return {
          id: doc.id,
          name: doc.name,
          description: doc.description,
          status: doc.optionality === "required" ? "required" : "optional",
          category: section.sectionId,
          notes: doc.notes ?? undefined,
          tips: tips.length > 0 ? tips : undefined,
          format: doc.acceptedFormats?.join(", ") ?? undefined,
          acceptedFormats: doc.acceptedFormats ?? undefined,
          form: formInfo,
          noUpload: NO_UPLOAD_CODES.has(doc.code),
          specialWidget: SPECIAL_WIDGETS[doc.code] ?? undefined,
          photoSpecRef: doc.photoSpecRef ?? undefined,
          // FIX: carry through the checklist download URL from the raw JSON doc
          checkListDownloadUrl: doc.check_list_download_Url ?? undefined,
        };
      });

      return {
        id: section.sectionId,
        label: section.title,
        icon: meta.icon,
        color: meta.color,
        documents,
      };
    });

  return { country: countryName, visaType: visaTypeName, location: locationName, categories };
}