/**
 * coverLetterUtils.ts
 *
 * Utility functions for the cover letter builder.
 * Includes date formatting, profile checks, and local state seeding logic.
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
} from "@/features/documents/cover_letter/coverLetterService";
import { COVER_LETTER_TEMPLATES } from "./coverLetterTemplates";

// Re-export date helpers and profile checks so existing importers of
// coverLetterUtils don't need to change their import paths.
export { fmtDate, fmtDateEnd, today, isEmployed, isStudent, isSponsored };

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

  const familyParts: string[] = [];
  if (inputs.married === "yes") familyParts.push("spouse");
  if (inputs.parentsInIndia === "yes") familyParts.push("parents");
  if (inputs.hasChildren === "yes") familyParts.push("children");

  // Build doc rows
  const docRows = [
    "Copy of my passport",
    "Travel itinerary",
    `Financial evidence ${!isSponsored(inputs.sponsorshipType) ? "(bank statements)" : "(sponsor's financial records)"}`,
  ];
  if (isEmployed(inputs.applicantProfile))
    docRows.push("No Objection Certificate (NOC) from employer");
  if (isStudent(inputs.applicantProfile))
    docRows.push("No Objection Certificate (NOC) from institution");
  if (isSponsored(inputs.sponsorshipType))
    docRows.push(
      `Letter of consent and sponsorship from my ${inputs.sponsorRel || "sponsor"} and his/her financial evidence`
    );
  docRows.push("Onward and Return Air tickets");
  docRows.push("Hotel Bookings");

  // Build bullet items
  const bullets = [
    "A list of the supporting documents that I am submitting to support my application",
    "The purpose of my visit",
    "The reasons why I will comply with the terms of my visa and why I will not overstay",
    "My ability to adequately maintain myself during my intended trip",
  ];
  if (isSponsored(inputs.sponsorshipType)) {
    bullets.push("Information relating to my sponsor");
  }
  bullets.push("Contact details of other relevant persons you may wish to contact");

  return {
    lHeading: COVER_LETTER_TEMPLATES.heading,
    lToBlock: COVER_LETTER_TEMPLATES.toBlock,
    lDate: today(),
    lSubject: `Application for Japan Temporary Visitor Visa (Tourism) — ${ctx.applicantName || "[Name]"}`,
    lSalutation: COVER_LETTER_TEMPLATES.salutation,
    lIntro: `My name is ${ctx.applicantName || "[Name]"} and I am from India. I am applying from India and I am applying for a Temporary Visitor Visa for Tourism.\nIn discussing that I am a genuine and credible applicant for a Japan Tourism Visa, this letter will cover;`,
    lPurposeDetail:
      `To explore the beautiful country including ${citiesStr} and visit the tourist spots. ${inputs.purpose || ""}` +
      (inputs.travellingWith === "with" && inputs.companion
        ? `\nTo accompany my ${inputs.companion} who will also be travelling on the same dates and has applied for a tourist visa.`
        : ""),
    lFlightPara:
      `I will fly from ${inputs.departureCity || "[Departure City]"}, India on ${fmtDate(ctx.travelStartDate)} and land in ${flightCity} on ${fmtDate(ctx.travelStartDate)}. I will explore the country for ${ctx.travelDuration} days and leave on ${fmtDateEnd(ctx.travelStartDate, ctx.travelDuration)} for India.\n\nComplete travel itinerary has been attached.`,
    lImmigration: buildImmigrationParag(inputs),
    lFamilyTies:
      familyParts.length > 0
        ? `I have my ${familyParts.join(", ")} back home in India, which is another indication that I will return to my home country prior to my visa expiring.`
        : "I have family back home in India which is another indication that I will return to my home country prior to my visa expiring.",
    lEconomicTies:
      isEmployed(inputs.applicantProfile)
        ? `I am currently employed as ${inputs.designation || "[Designation]"} at ${inputs.companyName || "[Company Name]"}. My employment is a strong tie to India and demonstrates my intention to return. A No Objection Certificate from my employer confirming my leave approval is enclosed.`
        : isStudent(inputs.applicantProfile)
          ? `I am currently enrolled as a student at ${inputs.institutionName || "[Institution Name]"}. My studies are a strong tie to India and demonstrate my intention to return. A No Objection Certificate from my institution is enclosed.`
          : "I have strong financial and economic ties to India which demonstrate my intention to return.",
    lFinance:
      !isSponsored(inputs.sponsorshipType)
        ? `My bank account reflects a balance of ${inputs.bankBalance || "[₹X,XX,XXX]"}, which is sufficient to cover all travel, accommodation, and living expenses during my stay. I will be staying at ${inputs.hotelName || "[Hotel Name]"} during my visit. Relevant bank statements are enclosed for your reference.`
        : `I confirm that my ${inputs.sponsorRel || "[Relationship]"} ${inputs.sponsorAccompanying === "accompanying" ? "who is accompanying me in this trip " : ""}will sponsor and bear all the cost incurred in this trip. I have attached the consent letter from them. I have also attached their financial records.`,
    lSponsor: `My ${inputs.sponsorRel || "[Relationship]"}, ${inputs.sponsorName || "[Sponsor Name]"}, is sponsoring this trip. ${inputs.sponsorAccompanying === "accompanying" ? `${inputs.sponsorName} will be accompanying me on this trip.` : `${inputs.sponsorName} will remain in India during my travel.`} Copies of their passport, bank statements, and sponsorship letter are enclosed.`,
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
    lSecSponsor: COVER_LETTER_TEMPLATES.secSponsor,
    lSecContacts: COVER_LETTER_TEMPLATES.secContacts,
    lContactsNote: COVER_LETTER_TEMPLATES.contactsNote,
    lClosing: COVER_LETTER_TEMPLATES.closing,
    lDocRows: docRows,
    lBullets: bullets,
  };
}

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