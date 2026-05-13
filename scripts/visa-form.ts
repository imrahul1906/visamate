import * as fs from "fs";
import * as path from "path";
import PDFParser from "pdf2json";

interface FormField {
  id: string;
  label: string;
  hint: string;
  example: string;
  warning: null | string;
  formRef: string;
  fieldType?: string;
}

interface FormSection {
  id: string;
  label: string;
  icon: string;
  fields: FormField[];
}

interface VisaFormSchema {
  key: string;
  meta: {
    country: string;
    visaType: string;
    formTitle: string;
    issuingAuthority: string;
    formSource: string;
    requiresPrint: boolean;
    lastReviewed: string;
  };
  sections: FormSection[];
}

/**
 * Extract form fields from a PDF file
 */
async function extractPDFFormFields(pdfPath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser(null, true);

      pdfParser.on("pdfParser_dataError", (data: any) => {
        console.error("PDF parser error:", data);
        resolve([]);
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        const fields: any[] = [];

        try {
          // Extract text from pages
          const pages = pdfData.Pages || [];

          for (const page of pages) {
            const texts = page.Texts || [];

            for (const textItem of texts) {
              if (textItem.R && textItem.R[0] && textItem.R[0].T) {
                const decodedText = decodeURIComponent(textItem.R[0].T);
                const text = decodedText.trim();

                // Look for field-like patterns
                if (
                  text.length > 2 &&
                  text.length < 100 &&
                  (text.includes(":") ||
                    text.match(/^\d+\./) ||
                    text.match(
                      /name|surname|date|passport|email|phone|address|signature|visa|country/i
                    ))
                ) {
                  fields.push({
                    name: text.replace(/[\s:_\.]+$/, "").trim(),
                    type: "text",
                    value: "",
                  });
                }
              }
            }
          }

          // Remove duplicates
          const uniqueFields = Array.from(
            new Map(fields.map((f) => [f.name, f])).values()
          );
          resolve(uniqueFields);
        } catch (error) {
          console.error("Error processing PDF data:", error);
          resolve([]);
        }
      });

      pdfParser.loadPDF(pdfPath);
    } catch (error) {
      console.error("Error reading PDF file:", error);
      resolve([]);
    }
  });
}

/**
 * Normalize field name to a valid ID
 */
function normalizeId(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .substring(0, 50);
}

/**
 * Auto-categorize fields into sections based on their labels
 */
function categorizeSections(fields: any[]): FormSection[] {
  const sectionMap: Map<string, FormField[]> = new Map();

  // Define section patterns
  const sectionPatterns = {
    personal_details: [
      "name",
      "surname",
      "given",
      "dob",
      "date of birth",
      "place of birth",
      "sex",
      "gender",
      "marital",
      "nationality",
    ],
    passport_info: [
      "passport",
      "document",
      "visa",
      "national id",
      "travel",
    ],
    contact: [
      "phone",
      "email",
      "address",
      "street",
      "city",
      "postal",
      "zip",
      "country",
    ],
    employment: [
      "employer",
      "occupation",
      "job",
      "company",
      "employment",
      "position",
    ],
    travel_details: [
      "destination",
      "purpose",
      "duration",
      "arrival",
      "departure",
      "stay",
      "accommodation",
    ],
    financial: [
      "salary",
      "income",
      "bank",
      "fund",
      "financial",
      "sponsor",
      "payment",
    ],
    declaration: [
      "declare",
      "confirm",
      "signature",
      "sign",
      "agree",
      "certify",
      "dated",
    ],
  };

  const sectionIcons = {
    personal_details: "person",
    passport_info: "passport",
    contact: "phone",
    employment: "briefcase",
    travel_details: "map",
    financial: "dollar",
    declaration: "checkmark",
  };

  for (const field of fields) {
    const label = field.name || field.label || "";
    let assignedSection = "other_fields";

    for (const [sectionId, patterns] of Object.entries(sectionPatterns)) {
      if (
        patterns.some(
          (pattern) =>
            label.toLowerCase().includes(pattern) ||
            label.toLowerCase().startsWith(pattern)
        )
      ) {
        assignedSection = sectionId;
        break;
      }
    }

    if (!sectionMap.has(assignedSection)) {
      sectionMap.set(assignedSection, []);
    }

    const formField: FormField = {
      id: normalizeId(label),
      label: label
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      hint: `Field: ${label}`,
      example: "",
      warning: null,
      formRef: label,
      fieldType: field.type || "text",
    };

    sectionMap.get(assignedSection)!.push(formField);
  }

  // Convert map to sections array
  const sections: FormSection[] = [];
  for (const [sectionId, fields] of sectionMap) {
    sections.push({
      id: sectionId,
      label: sectionId
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      icon: sectionIcons[sectionId as keyof typeof sectionIcons] || "document",
      fields: fields,
    });
  }

  return sections;
}

/**
 * Main function to extract and convert PDF to JSON schema
 */
async function extractVisaFormToJSON(
  pdfPath: string,
  outputPath?: string
): Promise<void> {
  console.log(`📄 Extracting form fields from: ${pdfPath}`);

  if (!fs.existsSync(pdfPath)) {
    console.error(`❌ File not found: ${pdfPath}`);
    process.exit(1);
  }

  // Extract fields from PDF
  const extractedFields = await extractPDFFormFields(pdfPath);

  if (extractedFields.length === 0) {
    console.warn("⚠️  No form fields found in PDF. Using empty template.");
  }

  console.log(`✅ Found ${extractedFields.length} fields`);

  // Get file info from path
  const fileName = path.basename(pdfPath);
  const match = fileName.match(/^([a-z]+)[-_]?([a-z]+)?/i);
  const country = match ? match[1].toUpperCase() : "UNKNOWN";
  const visaType = match && match[2] ? match[2].toUpperCase() : "VISA";

  // Categorize fields into sections
  const sections = categorizeSections(extractedFields);

  // Create the visa form schema
  const schema: VisaFormSchema = {
    key: `${country}_${visaType}_FORM_FIELDS_V1`,
    meta: {
      country: country,
      visaType: `${visaType} Visa`,
      formTitle: `Visa Application Form - ${country}`,
      issuingAuthority: `Government of ${country}`,
      formSource: pdfPath,
      requiresPrint: true,
      lastReviewed: new Date().toISOString().split("T")[0],
    },
    sections: sections,
  };

  // Determine output path
  const output =
    outputPath ||
    path.join(
      path.dirname(pdfPath),
      `${country.toLowerCase()}-visa-form-fields.json`
    );

  // Write to file
  fs.writeFileSync(output, JSON.stringify(schema, null, 2));
  console.log(`✅ JSON schema saved to: ${output}`);
  console.log(`📊 Generated schema with ${sections.length} sections`);
}

// CLI interface
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
Usage: npx ts-node scripts/visa-form.ts <pdf-path> [output-path]

Examples:
  npx ts-node scripts/visa-form.ts korea-visa-form.pdf
  npx ts-node scripts/visa-form.ts korea-visa-form.pdf ./output.json
  npx ts-node scripts/visa-form.ts ./forms/india-visa.pdf web/src/data/countries/india/visa-form-fields.json
  `);
  process.exit(0);
}

const pdfPath = args[0];
const outputPath = args[1];

extractVisaFormToJSON(pdfPath, outputPath).catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
