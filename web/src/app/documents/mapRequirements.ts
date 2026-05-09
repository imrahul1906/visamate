// app/documents/mapRequirements.ts

import type { RequirementsData } from "@/lib/data/types";
import type { DocumentData, DocumentCategory, DocumentItem, VisaFormInfo } from "./types";

// ─────────────────────────────────────────────────────────────
// Section metadata
// ─────────────────────────────────────────────────────────────

export const SECTION_META: Record<string, { icon: string; color: string }> = {
  COMMON:         { icon: "passport", color: "#6366f1" },
  SELF_SPONSORED: { icon: "finance",  color: "#10b981" },
  SPONSORED:      { icon: "finance",  color: "#0ea5e9" },
};

// Doc codes that must NOT have upload.
// VISA_APPLICATION_FORM is downloaded → printed → filled by hand → signed → photo pasted.
// There is nothing digital for the user to upload back; the widget handles download + fill guidance.
export const NO_UPLOAD_CODES = new Set(["PASSPORT", "PHOTOGRAPH", "VISA_APPLICATION_FORM"]);

// Doc codes → special widget
export const SPECIAL_WIDGETS: Record<string, DocumentItem["specialWidget"]> = {
  PHOTOGRAPH:            "photo_spec",
  VISA_APPLICATION_FORM: "visa_form",
  JAPAN_ITINERARY:       "itinerary",  // generic, not japan-specific
  FRANCE_ITINERARY:      "itinerary",  // future: same widget, different data
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