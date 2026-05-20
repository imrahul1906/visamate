/**
 * sponsorConsentDocx.ts
 *
 * Builds a .docx Blob from the editable sponsor consent letter state.
 * No React, no hooks — pure data-in, Blob-out.
 * Mirrors coverLetterDocx.ts architecture exactly.
 */

import { stripHints } from "../util/textFormatting";

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
    BorderStyle,
    WidthType,
  } = await import("docx");

  const clean = (s: string) => stripHints(s);

  // ── Paragraph helpers ──────────────────────────────────────

  const para = (text: string, opts?: { bold?: boolean; size?: number; spacing?: number; align?: typeof AlignmentType[keyof typeof AlignmentType] }) =>
    new Paragraph({
      children: [
        new TextRun({
          text: clean(text),
          bold: opts?.bold,
          size: opts?.size ?? 24,
          font: "Times New Roman",
        }),
      ],
      alignment: opts?.align,
      spacing: { after: opts?.spacing ?? 120 },
    });

  /** Split multi-line strings into separate Paragraphs */
  const multiPara = (text: string, spacing = 120) =>
    clean(text)
      .split("\n")
      .map(
        (line) =>
          new Paragraph({
            children: [new TextRun({ text: line, size: 24, font: "Times New Roman" })],
            spacing: { after: spacing },
          })
      );

  const sigLine = (label: string, value: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 24, font: "Times New Roman" }),
        new TextRun({ text: clean(value), size: 24, font: "Times New Roman" }),
      ],
      spacing: { after: 80 },
    });

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
            size: { width: 12240, height: 15840 }, // US Letter
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}