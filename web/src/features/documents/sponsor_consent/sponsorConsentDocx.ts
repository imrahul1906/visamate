/**
 * sponsorConsentDocx.ts
 *
 * Builds a .docx Blob from the editable sponsor consent letter state.
 * No React, no hooks — pure data-in, Blob-out.
 * Mirrors letterDocxExporter.ts architecture exactly.
 */

import { stripHints } from "../utils/textFormatting";
import {
  LETTER_PAGE_SIZE,
  LETTER_MARGIN,
  createPara,
  createMultiPara,
  createSigLine,
} from "@/lib/utils/docx";

// ─────────────────────────────────────────────────────────────
// Input shape
// ─────────────────────────────────────────────────────────────

export interface SponsorConsentDocxData {
  lHeading: string;
  lToBlock: string;
  lDate: string;
  lSalutation: string;
  lIntro: string;
  lPurpose: string;
  lSponsorship: string;
  lDocuments: string;
  lRequest: string;
  lClosing: string;
  lSigName: string;
  lSigMobile: string;
  lSigPassport: string;
}

// ─────────────────────────────────────────────────────────────
// Builder
// ─────────────────────────────────────────────────────────────

export async function buildSponsorConsentDocx(data: SponsorConsentDocxData): Promise<Blob> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
  } = await import("docx");

  const clean = (s: string) => stripHints(s);

  // ── Paragraph helpers mapping to global docx builders ─────

  const para = (
    text: string,
    opts?: {
      bold?: boolean;
      size?: number;
      spacing?: number;
      align?: typeof AlignmentType[keyof typeof AlignmentType];
    }
  ) =>
    createPara(clean(text), {
      bold: opts?.bold,
      size: opts?.size,
      spacingAfter: opts?.spacing,
      align: opts?.align,
    });

  const multiPara = (text: string, spacing = 120) =>
    createMultiPara(clean(text), { spacingAfter: spacing });

  const sigLine = (label: string, value: string) =>
    createSigLine(label, clean(value));

  // ── Document children ──────────────────────────────────────

  const children = [
    // Date (right-aligned) — appears FIRST, at the top of the letter
    new Paragraph({
      children: [new TextRun({ text: `Date: ${data.lDate}`, size: 24, font: "Times New Roman" })],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 240 },
    }),

    // To block
    ...multiPara(data.lToBlock, 60),

    // Spacer between To block and Subject
    para("", { spacing: 200 }),

    // Subject / Heading — bold, uniform space below before salutation
    new Paragraph({
      children: [new TextRun({ text: clean(data.lHeading), bold: true, size: 26, font: "Times New Roman" })],
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 280 },
    }),

    // Salutation — uniform space below before body
    new Paragraph({
      children: [new TextRun({ text: clean(data.lSalutation), size: 24, font: "Times New Roman" })],
      spacing: { after: 240 },
    }),

    // Body paragraphs
    ...multiPara(data.lIntro),
    para(""),
    ...multiPara(data.lPurpose),
    para(""),
    ...multiPara(data.lSponsorship),
    para(""),
    ...multiPara(data.lDocuments),
    para(""),
    para(data.lRequest),

    // Spacer before closing ("Yours sincerely") — generous gap
    para("", { spacing: 320 }),

    // Closing
    ...multiPara(data.lClosing, 120),
    para(""),

    // Signature block
    new Paragraph({
      children: [new TextRun({ text: "(signature)", size: 24, font: "Times New Roman", italics: true })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "_____________________", size: 24, font: "Times New Roman" })],
      spacing: { after: 160 },
    }),
    sigLine("Name", data.lSigName),
    sigLine("Mob.", data.lSigMobile),
    sigLine("Passport No.", data.lSigPassport),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: LETTER_PAGE_SIZE, // US Letter
            margin: LETTER_MARGIN, // 1 inch
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}