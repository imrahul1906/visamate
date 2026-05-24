import * as fs from "fs";
import * as path from "path";
import puppeteer from "puppeteer";

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
 * Extract form fields from DOM using Puppeteer
 */
async function extractFormFieldsFromDOM(page: any): Promise<FormField[]> {
  const fields: FormField[] = await page.evaluate(() => {
    const extractedFields: any[] = [];
    const fieldIds = new Set<string>();

    // Pattern 1: Find all input elements
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input: any) => {
      const name = input.name || input.id || input.getAttribute("data-field");
      if (name && !fieldIds.has(name)) {
        fieldIds.add(name);

        let label =
          input.placeholder ||
          input.title ||
          input.getAttribute("aria-label") ||
          name;

        // Try to find associated label - look in multiple ways
        let associatedLabel = document.querySelector(
          `label[for="${input.id}"]`
        );
        if (!associatedLabel && input.parentElement) {
          associatedLabel = input.parentElement.querySelector("label");
        }
        if (associatedLabel) {
          label = associatedLabel.textContent?.trim() || label;
        }

        // Skip hidden inputs unless they have meaningful names
        if (input.type === "hidden" && !name.match(/csrf|token|nonce/i)) {
          return;
        }

        extractedFields.push({
          id: name.toLowerCase().replace(/\s+/g, "_"),
          label: label.trim(),
          hint: `Field: ${label.trim()}`,
          example: "",
          warning: null,
          formRef: name,
          fieldType: input.type || "text",
          required: input.required,
          placeholder: input.placeholder,
        });
      }
    });

    // Pattern 2: Find all select elements
    const selects = document.querySelectorAll("select[name], select[id]");
    selects.forEach((select: any) => {
      const name = select.name || select.id || select.getAttribute("data-field");
      if (name && !fieldIds.has(name)) {
        fieldIds.add(name);

        let label =
          select.title ||
          select.getAttribute("aria-label") ||
          select.getAttribute("data-label") ||
          name;

        // Try to find associated label
        const associatedLabel = document.querySelector(
          `label[for="${select.id}"]`
        );
        if (associatedLabel) {
          label = associatedLabel.textContent || label;
        }

        extractedFields.push({
          id: name.toLowerCase().replace(/\s+/g, "_"),
          label: label.trim(),
          hint: `Field: ${label.trim()}`,
          example: "",
          warning: null,
          formRef: name,
          fieldType: "select",
          required: select.required,
          options: Array.from(select.querySelectorAll("option"))
            .map((opt: any) => opt.textContent)
            .filter((t) => t),
        });
      }
    });

    // Pattern 3: Find all textarea elements
    const textareas = document.querySelectorAll("textarea[name], textarea[id]");
    textareas.forEach((textarea: any) => {
      const name = textarea.name || textarea.id || textarea.getAttribute("data-field");
      if (name && !fieldIds.has(name)) {
        fieldIds.add(name);

        let label =
          textarea.placeholder ||
          textarea.title ||
          textarea.getAttribute("aria-label") ||
          name;

        // Try to find associated label
        const associatedLabel = document.querySelector(
          `label[for="${textarea.id}"]`
        );
        if (associatedLabel) {
          label = associatedLabel.textContent || label;
        }

        extractedFields.push({
          id: name.toLowerCase().replace(/\s+/g, "_"),
          label: label.trim(),
          hint: `Field: ${label.trim()}`,
          example: "",
          warning: null,
          formRef: name,
          fieldType: "textarea",
          required: textarea.required,
          placeholder: textarea.placeholder,
        });
      }
    });

    // Pattern 4: Find all radio buttons and checkboxes
    const radioCheckboxGroups = new Map<string, any>();

    const radioCheckboxes = document.querySelectorAll(
      "input[type='radio'], input[type='checkbox']"
    );
    radioCheckboxes.forEach((input: any) => {
      const name = input.name;
      if (name && !fieldIds.has(name)) {
        if (!radioCheckboxGroups.has(name)) {
          radioCheckboxGroups.set(name, {
            name,
            type: input.type,
            values: [],
          });
        }

        const group = radioCheckboxGroups.get(name);
        const label =
          input.getAttribute("aria-label") ||
          document.querySelector(`label[for="${input.id}"]`)?.textContent ||
          input.title ||
          input.value;

        if (label) {
          group.values.push(label.trim());
        }
      }
    });

    // Add radio/checkbox groups to fields
    radioCheckboxGroups.forEach((group, name) => {
      if (!fieldIds.has(name)) {
        fieldIds.add(name);
        extractedFields.push({
          id: name.toLowerCase().replace(/\s+/g, "_"),
          label: name.replace(/_/g, " "),
          hint: `Field: ${name.replace(/_/g, " ")} (${group.type})`,
          example: "",
          warning: null,
          formRef: name,
          fieldType: group.type,
          values: group.values,
        });
      }
    });

    // Pattern 5: Find button elements
    const buttons = document.querySelectorAll(
      'button[type="submit"], input[type="submit"], input[type="button"]'
    );
    buttons.forEach((button: any) => {
      const name = button.name || button.id;
      const label = button.textContent || button.value || "Submit";

      if (name && label && !fieldIds.has(name)) {
        fieldIds.add(name);
        extractedFields.push({
          id: name.toLowerCase().replace(/\s+/g, "_"),
          label: label.trim(),
          hint: `Field: ${label.trim()}`,
          example: "",
          warning: null,
          formRef: name,
          fieldType: button.type || "button",
        });
      }
    });

    return extractedFields;
  });

  return fields;
}

/**
 * Categorize fields into sections
 */
function categorizeFields(fields: FormField[]): FormSection[] {
  const sections: { [key: string]: FormField[] } = {};

  const categoryKeywords: { [key: string]: string[] } = {
    personal_details: ["name", "surname", "given", "family", "nationality", "date_of_birth", "gender", "age"],
    passport_info: ["passport", "number", "issue", "expiry", "document", "id_number"],
    contact: ["email", "phone", "telephone", "mobile", "address", "city", "country", "postal", "zip"],
    visa_details: ["visa", "type", "category", "purpose", "duration", "stay"],
    employment: [
      "company",
      "employer",
      "employment",
      "job",
      "occupation",
      "position",
      "department",
    ],
    travel_info: [
      "destination",
      "arrival",
      "departure",
      "date",
      "duration",
      "flight",
      "hotel",
      "itinerary",
    ],
    document_upload: ["upload", "file", "document", "attachment", "certificate", "proof"],
    education: ["education", "school", "university", "degree", "qualification"],
    family: ["family", "spouse", "parent", "child", "guardian", "relative"],
    other_fields: [],
  };

  for (const field of fields) {
    let categorized = false;
    const fieldLower = `${field.label} ${field.formRef}`.toLowerCase();

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => fieldLower.includes(keyword))) {
        if (!sections[category]) {
          sections[category] = [];
        }
        sections[category].push(field);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      if (!sections["other_fields"]) {
        sections["other_fields"] = [];
      }
      sections["other_fields"].push(field);
    }
  }

  const iconMap: { [key: string]: string } = {
    personal_details: "user",
    passport_info: "document",
    contact: "phone",
    visa_details: "briefcase",
    employment: "briefcase",
    travel_info: "map",
    document_upload: "upload",
    education: "book",
    family: "users",
    other_fields: "document",
  };

  return Object.entries(sections)
    .filter(([_, fields]) => fields.length > 0)
    .map(([key, fields]) => ({
      id: key,
      label:
        key
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") || "Other Fields",
      icon: iconMap[key] || "document",
      fields,
    }));
}

/**
 * Extract metadata from page
 */
async function extractMetadata(
  page: any,
  url: string
): Promise<{ title: string; country: string }> {
  const metadata = await page.evaluate(() => {
    return {
      title: document.title || "Visa Application Form",
      h1: document.querySelector("h1")?.textContent || "",
      h2: document.querySelector("h2")?.textContent || "",
    };
  });

  let country = "Unknown";
  if (url.includes("korea") || url.includes("visa.go.kr")) {
    country = "South Korea";
  } else if (url.includes("india") || url.includes("indiavisa")) {
    country = "India";
  } else if (url.includes("japan") || url.includes("mofa.go.jp")) {
    country = "Japan";
  } else if (url.includes("usa") || url.includes("state.gov")) {
    country = "USA";
  } else if (url.includes("uk") || url.includes("gov.uk")) {
    country = "United Kingdom";
  }

  return {
    title:
      metadata.h1 ||
      metadata.h2 ||
      metadata.title ||
      "Visa Application Form",
    country,
  };
}

/**
 * Main scraping function
 */
async function scrapeVisaFormDynamic(
  url: string,
  outputFileName?: string
): Promise<void> {
  let browser;

  try {
    console.log(`🌐 Launching Chrome browser...`);
    browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    console.log(`📡 Navigating to: ${url}`);
    await page.goto(url, { 
      waitUntil: "domcontentloaded", 
      timeout: 20000 
    }).catch((err) => {
      console.log("⚠️  Page load timeout, attempting to continue with partial content...");
    });

    console.log(`⏳ Waiting for dynamic content to load...`);
    
    // Wait for initial JavaScript execution
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Try to wait for form elements, but don't fail if they don't appear
    await page
      .waitForSelector("form, input, select, textarea", { visible: false, timeout: 5000 })
      .catch(() => {
        console.log("ℹ️  No form elements found in DOM, checking for hidden forms...");
      });

    // Try to interact with the page to trigger form loading
    // Look for buttons that might open forms
    const buttons = await page.$$("button, a.btn, input[type='button']");
    console.log(`🖱️  Found ${buttons.length} interactive elements, attempting to trigger form loading...`);
    
    for (let i = 0; i < Math.min(buttons.length, 3); i++) {
      try {
        await page.evaluate((index) => {
          const btns = document.querySelectorAll("button, a.btn, input[type='button']");
          if (btns[index]) {
            (btns[index] as any).click();
          }
        }, i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        // Continue if click fails
      }
    }

    // Wait a bit more for any new content
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Wait 30 seconds for page to fully load
    console.log(`⏳ Waiting 30 seconds for page content to fully load...`);
    await new Promise(resolve => setTimeout(resolve, 30000));

    console.log(`🔍 Extracting form fields from rendered DOM...`);
    const fields = await extractFormFieldsFromDOM(page);
    console.log(`✅ Found ${fields.length} form fields`);

    // Extract metadata
    const { title, country } = await extractMetadata(page, url);

    // Categorize fields
    console.log(`📁 Categorizing fields into sections...`);
    const sections = categorizeFields(fields);

    // Create schema
    const schema: VisaFormSchema = {
      key: `VISA_FORM_${country.toUpperCase().replace(/\s+/g, "_")}_V1`,
      meta: {
        country,
        visaType: "Online Application",
        formTitle: title,
        issuingAuthority: `${country} Immigration Office`,
        formSource: url,
        requiresPrint: false,
        lastReviewed: new Date().toISOString().split("T")[0],
      },
      sections,
    };

    // Generate output filename
    const finalOutputFileName =
      outputFileName ||
      `visa-form-${country.toLowerCase().replace(/\s+/g, "-")}-fields.json`;
    const outputPath = path.join(
      path.dirname(__filename),
      finalOutputFileName
    );

    // Write to file
    fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));

    console.log(
      `\n✨ Form schema saved to: ${path.relative(process.cwd(), outputPath)}`
    );
    console.log(`📊 Total fields: ${fields.length}`);
    console.log(
      `📑 Sections: ${sections.map((s) => `${s.label} (${s.fields.length})`).join(", ")}`
    );

    if (fields.length === 0) {
      console.warn(
        "\n⚠️  No fields detected. The page may:"
      );
      console.warn("   - Require authentication");
      console.warn("   - Use hidden form elements");
      console.warn("   - Load forms dynamically via JavaScript after page load");
      console.warn(
        "   - Have forms in iframes"
      );
    }
  } catch (error) {
    console.error("❌ Error scraping form:", error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("🌐 Advanced Visa Form Web Scraper (with JavaScript Support)");
  console.log(
    "\nUsage: npx tsx scripts/visa-form-scraper-dynamic.ts <url> [output-filename]\n"
  );
  console.log(
    "Example: npx tsx scripts/visa-form-scraper-dynamic.ts https://www.visa.go.kr/openPage.do?MENU_ID=1020408"
  );
  console.log(
    "\nExample with custom output: npx tsx scripts/visa-form-scraper-dynamic.ts https://example.com korea-visa-form.json"
  );
  process.exit(0);
}

const url = args[0];
const outputFileName = args[1];

if (!url.startsWith("http://") && !url.startsWith("https://")) {
  console.error('❌ Invalid URL. Must start with "http://" or "https://"');
  process.exit(1);
}

scrapeVisaFormDynamic(url, outputFileName);
