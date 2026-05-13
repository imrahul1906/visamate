/**
 * coverLetterTemplates.ts
 *
 * All static template texts for the Japan Visa Cover Letter.
 * Single source of truth for headings, intro texts, defaults.
 */

export const COVER_LETTER_TEMPLATES = {
  // Main sections
  heading: "COVER LETTER",
  toBlock: "To,\nThe Visa Officer,\nEmbassy of Japan,\nDelhi, India",
  salutation: "Dear Sir/Madam",
  closing:
    "Finally, I can confirm that the information provided above is true to the best of my knowledge and belief.\n\n" +
    "If you would like to contact any other individuals or organisations and I have not provided their contact details, please feel free to get in touch and I will be more than happy to provide them for you.\n\nYour faithfully, ",

  // Section headings
  secDocs: "List of Supporting Documents",
  secDocsIntro:
    "In support of my temporary visitor visa for tourism application, I have included the following documents",
  secPurpose: "The Purpose of my Visit",
  secPurposeIntro: "The purpose of my visit:",
  secOverstay:
    "Why I will not overstay the temporary visitor visa for tourism",
  secOverstayIntro:
    "I fully intend to return to India before my Japan visitor visa expires. I have a good life back home and have no reason or intention to overstay. The following are the reasons that I would like you to consider when deciding my application:",
  secImmigration: "My good immigration history",
  secFamily: "Family ties to my home country",
  secEconomic: "Financial and economic ties to my home country",
  secFinance: "My ability to adequately maintain myself during my visit to Japan",
  secFinanceIntro: "I confirm that I have sufficient financial means to support myself and my dependent during our stay in Japan. My sources of income and financial assets are highlighted below:",
  secIncome: "My sources of income",
  secAssets: "My assets and/or cash savings",
  secSponsor: "My sponsor",
  secContacts: "Relevant contact details",

  // Contact note
  contactsNote:
    "It is appreciated that you may want to contact my family and friends in order to verify my intentions. If you would like to do so, the following are some useful contact details:",

  // Default bullet items
  defaultBullets: [
    "A list of the supporting documents that I am submitting to support my application",
    "The purpose of my visit",
    "The reasons why I will comply with the terms of my visa and why I will not overstay",
    "My ability to adequately maintain myself during my intended trip",
  ],

  // Default supporting documents
  defaultDocuments: [
    "Copy of my passport",
    "Travel itinerary",
    "Financial evidence (bank statements)",
  ],
};

export type CoverLetterTemplate = typeof COVER_LETTER_TEMPLATES;
