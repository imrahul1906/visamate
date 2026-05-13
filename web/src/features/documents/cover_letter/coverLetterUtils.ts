/**
 * coverLetterUtils.ts
 *
 * Utility functions for the cover letter builder.
 * Includes date formatting, profile checks, and local state seeding logic.
 *
 * ── Editorial hints ──────────────────────────────────────────────────────────
 * Strings like [[HINT: Add more details here]] are rendered in the preview as
 * amber-coloured italic callouts so the user knows what to fill in.
 * They are stripped automatically before the .docx is built (see stripHints in
 * coverLetterService.ts).
 */

import {
  CoverLetterInputs,
  ApplicantContext,
  fmtDate,
  fmtDateEnd,
  today,
  isEmployed,
  isSponsored,
  isStudent,
  isNocNeeded,
} from "@/features/documents/cover_letter/coverLetterService";
import { COVER_LETTER_TEMPLATES } from "./coverLetterTemplates";

// Re-export date helpers and profile checks so existing importers of
// coverLetterUtils don't need to change their import paths.
export { fmtDate, fmtDateEnd, today, isEmployed, isStudent, isSponsored, isNocNeeded };

/** Wrap an editorial note in the hint marker syntax. */
const hint = (msg: string) => `[[HINT: ${msg}]]`;

// ─────────────────────────────────────────────────────────────
// Seed function
// ─────────────────────────────────────────────────────────────

/**
 * Seed editable letter state based on inputs and context.
 * Returns a map of field names to their initial values for the preview step.
 */
export function seedLetterState(
  inputs: CoverLetterInputs,
  ctx: ApplicantContext
): {
  [key: string]: string | string[];
} {
  const citiesStr = (ctx.cities || []).join(", ") || "[Cities]";
  const flightCity = (ctx.cities && ctx.cities[0]) || "[City]";
  const visaTypeName = ctx.visaTypeName || "[Visa Type Name]";
  const country = ctx.country || "[Country]";
  const vfsCenter = ctx.vfsCenter || "";

  // Build doc rows
  const docRows = [
    "Copy of my passport",
    "Travel itinerary",
    `Financial evidence ${!isSponsored(inputs.sponsorshipType) ? "(bank statements)" : "(sponsor's financial records)"}`,
  ];
  if (isEmployed(inputs.applicantProfile) && isNocNeeded(vfsCenter))
    docRows.push("No Objection Certificate (NOC) from employer");
  if (isStudent(inputs.applicantProfile))
    docRows.push("No Objection Certificate (NOC) from institution");
  if (isSponsored(inputs.sponsorshipType))
    docRows.push(
      `Letter of consent and sponsorship from my ${inputs.sponsorRel || "sponsor"} and his/her financial evidence`
    );
  if (inputs.hasDependant === "yes")
    docRows.push("Copy of marriage/relationship certificate (for accompanying dependant)");
  docRows.push("Onward and Return Air tickets");
  docRows.push("Hotel Bookings");

  // Build bullet items
  const bullets = [
    "A list of the supporting documents that I am submitting to support my application",
    "The purpose of my visit",
    "The reasons why I will comply with the terms of my visa and why I will not overstay",
    "My ability to adequately maintain myself during my intended trip",
  ];
  if (inputs.hasDependant === "yes") {
    bullets.push("Information relating to the dependants applying with me");
  }
  if (isSponsored(inputs.sponsorshipType)) {
    bullets.push("Information relating to my sponsor");
  }
  bullets.push("Contact details of other relevant persons you may wish to contact");

  return {
    lHeading: COVER_LETTER_TEMPLATES.heading,
    lToBlock: COVER_LETTER_TEMPLATES.toBlock,
    lDate: today(),
    lSubject: `Request for issuing Temporary Visitor Visa for Tourism`,
    lSalutation: COVER_LETTER_TEMPLATES.salutation,
    lIntro:
      `My name is ${ctx.applicantName || "[Name]"} and I am Indian. I am applying from India and I am applying for a Temporary ${visaTypeName} Visa. In discussing that I am a genuine and credible applicant for ${country} ${visaTypeName} Visa, this letter will cover:`,
    lPurposeDetail:
      `To explore the beautiful country including cities like ${citiesStr} and visit the tourist spots.` +
      (inputs.travellingWith === "with" && inputs.companion
        ? `\nTo accompany my ${inputs.companion} who will also be travelling on the same dates and has applied for a ${visaTypeName} visa.`
        : ""),
    lFlightPara:
      `I will fly from ${inputs.departureCity || "[Departure City]"}, India on ${fmtDate(ctx.travelStartDate)} and land in ${flightCity} on ${fmtDate(ctx.travelStartDate)}. I will explore the country for ${ctx.travelDuration} days and leave on ${fmtDateEnd(ctx.travelStartDate, ctx.travelDuration)} for India.\n\nComplete travel itinerary has been attached.`,
    lImmigration: buildImmigrationParag(inputs),
    lFamilyTies:
      `I have family back home in India which is another indication that I will return to my home country prior to my visa expiring.\n` +
      hint(
        "Add more details about your family here — e.g. if you have a spouse, children, or dependents who rely on you for medical or other support, mention them. The more specific, the stronger this section."
      ),
    lEconomicTies: buildEconomicTiesSection(inputs, country, vfsCenter),
    lDependant: buildDependantSection(inputs),
    lSecDependant: "Information Relating to the Dependants Applying with Me",
    lFinance: buildFinanceSection(inputs, country),
    lSponsor:
      `My ${inputs.sponsorRel || "[Relationship]"}, ${inputs.sponsorName || "[Sponsor Name]"}, is sponsoring this trip. ` +
      (inputs.sponsorAccompanying === "accompanying"
        ? `${inputs.sponsorName || "[Sponsor Name]"} will be accompanying me on this trip.`
        : `${inputs.sponsorName || "[Sponsor Name]"} will remain in India during my travel.`) +
      ` Copies of their passport, bank statements, and sponsorship letter are enclosed.`,
    lSigName: ctx.applicantName || "[Name]",
    lSigPassport: ctx.passportNo || "[Passport No]",
    lSecDocs: COVER_LETTER_TEMPLATES.secDocs,
    lSecDocsIntro: COVER_LETTER_TEMPLATES.secDocsIntro,
    lSecPurpose: COVER_LETTER_TEMPLATES.secPurpose,
    lSecPurposeIntro: COVER_LETTER_TEMPLATES.secPurposeIntro,
    lSecOverstay: COVER_LETTER_TEMPLATES.secOverstay,
    lSecOverstayIntro: COVER_LETTER_TEMPLATES.secOverstayIntro,
    lSecImmigration: COVER_LETTER_TEMPLATES.secImmigration,
    lSecFamily: COVER_LETTER_TEMPLATES.secFamily,
    lSecEconomic: COVER_LETTER_TEMPLATES.secEconomic,
    lSecFinance: COVER_LETTER_TEMPLATES.secFinance,
    lSecFinanceIntro: COVER_LETTER_TEMPLATES.secFinanceIntro,
    lSecIncome: COVER_LETTER_TEMPLATES.secIncome,
    lIncomeContent: buildIncomeSection(inputs, country, vfsCenter),
    lSecAssets: COVER_LETTER_TEMPLATES.secAssets,
    lAssetsContent: buildFinanceSection(inputs, country),
    lSecSponsor: COVER_LETTER_TEMPLATES.secSponsor,
    lSecContacts: COVER_LETTER_TEMPLATES.secContacts,
    lContactsNote: COVER_LETTER_TEMPLATES.contactsNote,
    lClosing: COVER_LETTER_TEMPLATES.closing,
    lDocRows: docRows,
    lBullets: bullets,
  };
}

// ─────────────────────────────────────────────────────────────
// Section builders
// ─────────────────────────────────────────────────────────────

/** Helper function to build immigration paragraph */
function buildImmigrationParag(inputs: CoverLetterInputs): string {
  const hasCountries = inputs.countriesVisited.trim().length > 0;

  if (!hasCountries) {
    return (
      `I have maintained a clean immigration record and have not travelled internationally in the ` +
      `last five years. I have no history of visa refusals or overstays in any country.`
    );
  }

  return (
    `In the last five years, I have travelled to the following countries: ${inputs.countriesVisited}. ` +
    `I have maintained a clean immigration record with no history of visa refusals or overstays.`
  );
}

/** Build the economic ties paragraph */
function buildEconomicTiesSection(
  inputs: CoverLetterInputs,
  country: string,
  vfsCenter: string
): string {
  const depPhrase =
    inputs.hasDependant === "yes" && inputs.dependantName
      ? `myself and my dependant (${inputs.dependantName})`
      : "myself";

  let text =
    `My financial and economic ties to my home country are a key factor that strongly suggests that I have no reason to trade my life in my home country for a life as an illegal alien in ${country}. ` +
    `My assets and my income are highlighted in more detail below under the sub heading "My ability to adequately maintain ${depPhrase} in ${country}". `;

  if (isEmployed(inputs.applicantProfile)) {
    text +=
      `I have a fixed employment with one of renowned organisation, ${inputs.companyName || "[Company Name]"} as "${inputs.designation || "[Designation]"}".` +
      (isNocNeeded(vfsCenter)
        ? ` A No Objection Certificate from my employer confirming my leave approval is enclosed.`
        : "");
  } else if (isStudent(inputs.applicantProfile)) {
    text +=
      `I am currently enrolled as a student at ${inputs.institutionName || "[Institution Name]"}. My studies are a strong tie to India and demonstrate my intention to return. A No Objection Certificate from my institution is enclosed.`;
  } else {
    text += `I have strong financial and economic ties to India which demonstrate my intention to return.`;
  }

  return text;
}

/** Build the dependant section text (empty string if no dependant) */
export function buildDependantSection(inputs: CoverLetterInputs): string {
  if (inputs.hasDependant !== "yes") return "";

  const rel = inputs.dependantRelationship || "[Relationship]";
  const name = inputs.dependantName || "[Full Name]";
  const dob = inputs.dependantDob
    ? inputs.dependantDob
    : hint("Add date of birth (e.g. 15 April 1990)");
  const passport = inputs.dependantPassport
    ? inputs.dependantPassport
    : hint("Add passport number");

  const relCapital = rel.charAt(0).toUpperCase() + rel.slice(1);

  return (
    `My ${rel} is accompanying me on this trip, and their details are provided below for reference.\n\n` +
    `• Full Name: ${name}\n` +
    `• Date of Birth: ${dob}\n` +
    `• Nationality: Indian\n` +
    `• Passport Number: ${passport}\n` +
    `• Relationship: ${relCapital}\n\n` +
    hint(
      `If you have a marriage certificate or other proof of relationship, mention it here — e.g. "A copy of our marriage certificate has been attached for your kind reference."`
    )
  );
}

/** Helper function to build income section */
function buildIncomeSection(
  inputs: CoverLetterInputs,
  country: string,
  _vfsCenter: string
): string {
  if (isEmployed(inputs.applicantProfile)) {
    return (
      `I have a permanent salaried Job in ${inputs.companyName || "[Company Name]"} company as ${inputs.designation || "[Designation]"}. ` +
      `Its salary is my source of income. It will be continued whilst I am in ${country} as I will be on Paid leaves.`
    );
  }

  if (isStudent(inputs.applicantProfile)) {
    return (
      `I am currently enrolled as a student at ${inputs.institutionName || "[Institution Name]"}. ` +
      `My studies are my primary source of support and also my source of commitment to return.`
    );
  }

  return `I have multiple sources of income that support my daily expenses in my home country.`;
}

/** Helper function to build financial/assets section */
function buildFinanceSection(inputs: CoverLetterInputs, country: string): string {
  if (!isSponsored(inputs.sponsorshipType)) {
    return (
      `Over the Years of my Job, I have invested in mutual funds, PPFs etc. and managed to have enough assets. The detail of my assets is as follow:\n` +
      `Money in Account: I have approximately ${inputs.bankBalance || "[₹X,XX,XXX]"} in my accounts as of ` +
      hint("Add the date you took the balance certificate from your bank") +
      `\n` +
      hint(
        "Add more details about your financial situation here — e.g. other assets, investments, fixed deposits, or property. The more evidence you provide, the better."
      ) +
      `\nI Can easily afford below mentioned:\n` +
      `• the cost of travelling to and from ${country}\n` +
      `• All expenses of ${country} as per my itinerary.`
    );
  }

  return (
    `I confirm that my ${inputs.sponsorRel || "[Relationship]"} ` +
    (inputs.sponsorAccompanying === "accompanying"
      ? "who is accompanying me in this trip "
      : "") +
    `will sponsor and bear all the cost incurred in this trip. I have attached the consent letter from them. I have also attached their financial records.`
  );
}