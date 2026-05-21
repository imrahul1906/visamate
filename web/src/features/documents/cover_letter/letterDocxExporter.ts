/**
 * letterDocxExporter.ts
 *
 * Builds a .docx Blob from the editable cover letter preview state.
 * No React, no hooks — pure data-in, Blob-out.
 *
 * Consumed by: CoverLetterBuilder (handleDownload)
 */

import type { Contact } from "./LetterFormFields";
import { isSponsored } from "./letterValidation";
import {
  LETTER_PAGE_SIZE,
  LETTER_MARGIN,
  createPara,
  createMultiPara,
} from "@/lib/utils/docx";

// ─────────────────────────────────────────────────────────────
// Input shape
// ─────────────────────────────────────────────────────────────

export interface CoverLetterDocxData {
  // Letter content
  lHeading: string;
  lToBlock: string;
  lDate: string;
  lSubject: string;
  lSalutation: string;
  lIntro: string;
  lBullets: string[];
  lSecDocs: string;
  lSecDocsIntro: string;
  lDocRows: string[];
  lSecPurpose: string;
  lSecPurposeIntro: string;
  lPurposeDetail: string;
  lFlightPara: string;
  lSecOverstay: string;
  lSecOverstayIntro: string;
  lSecImmigration: string;
  lImmigration: string;
  lSecFamily: string;
  lFamilyTies: string;
  lSecEconomic: string;
  lEconomicTies: string;
  lSecFinance: string;
  lSecFinanceIntro: string;
  lSecIncome: string;
  lFinance: string;
  lSecSponsor: string;
  lSponsor: string;
  lSecDependant: string;
  lDependant: string;
  lSecContacts: string;
  lContactsNote: string;
  lContacts: Contact[];
  lClosing: string;
  lSigName: string;
  lSigPassport: string;
  // Context
  sponsorshipType: string;
  hasDependant?: string;
}

// ─────────────────────────────────────────────────────────────
// Builder
// ─────────────────────────────────────────────────────────────

export async function buildCoverLetterDocx(data: CoverLetterDocxData): Promise<Blob> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    AlignmentType,
    BorderStyle,
    WidthType,
    ShadingType,
    LevelFormat,
  } = await import("docx");

  const isSpon = isSponsored(data.sponsorshipType);
  const hasDep = data.hasDependant === "yes";

  // ── Paragraph helpers ──────────────────────────────────────

  const para = (text: string, opts?: { bold?: boolean; size?: number; spacing?: number }) =>
    createPara(text, {
      bold: opts?.bold,
      size: opts?.size,
      spacingAfter: opts?.spacing,
    });

  const sectionHeading = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: "Times New Roman" })],
      spacing: { before: 200, after: 80 },
    });

  const subHeading = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 24, font: "Times New Roman", underline: {} })],
      spacing: { before: 160, after: 80 },
    });

  const bulletPara = (text: string) =>
    new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      children: [new TextRun({ text, size: 24, font: "Times New Roman" })],
      spacing: { after: 60 },
    });

  /** Split a multi-line string into separate Paragraphs (never use \n in TextRun) */
  const multiPara = (text: string, spacing = 120) =>
    createMultiPara(text, { spacingAfter: spacing });

  // ── Table helpers ──────────────────────────────────────────

  const borderDef = { style: BorderStyle.SINGLE, size: 4, color: "999999" };
  const cellBorders = { top: borderDef, bottom: borderDef, left: borderDef, right: borderDef };

  const headerCell = (text: string) =>
    new TableCell({
      borders: cellBorders,
      shading: { fill: "EEEEEE", type: ShadingType.CLEAR },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      width: { size: 2200, type: WidthType.DXA },
      children: [
        new Paragraph({
          children: [new TextRun({ text, bold: true, size: 20, font: "Times New Roman" })],
        }),
      ],
    });

  const dataCell = (text: string) =>
    new TableCell({
      borders: cellBorders,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      width: { size: 2200, type: WidthType.DXA },
      children: [
        new Paragraph({
          children: [new TextRun({ text, size: 20, font: "Times New Roman" })],
        }),
      ],
    });

  const contactsTable = new Table({
    width: { size: 8800, type: WidthType.DXA },
    columnWidths: [2200, 2200, 2200, 2200],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          headerCell("Name"),
          headerCell("Relationship"),
          headerCell("Phone"),
          headerCell("Email"),
        ],
      }),
      ...data.lContacts
        .filter((c) => c.name.trim())
        .map(
          (c) =>
            new TableRow({
              children: [
                dataCell(c.name),
                dataCell(c.rel || "—"),
                dataCell(c.phone || "—"),
                dataCell(c.email || "—"),
              ],
            })
        ),
    ],
  });

  // ── Document children ──────────────────────────────────────

  const docRowParas = data.lDocRows.map((r) =>
    new Paragraph({
      numbering: { reference: "numbers", level: 0 },
      children: [new TextRun({ text: r, size: 24, font: "Times New Roman" })],
      spacing: { after: 60 },
    })
  );

  const children = [
    // Heading (centred, bold)
    new Paragraph({
      children: [new TextRun({ text: data.lHeading, bold: true, size: 28, font: "Times New Roman" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),

    // To block + date
    ...multiPara(data.lToBlock, 60),
    para(""),
    para(data.lDate),
    para(""),

    // Subject
    new Paragraph({
      children: [
        new TextRun({ text: "Subject: ", bold: true, size: 24, font: "Times New Roman" }),
        new TextRun({ text: data.lSubject, bold: true, size: 24, font: "Times New Roman" }),
      ],
      spacing: { after: 160 },
    }),

    // Salutation
    para(data.lSalutation, { spacing: 160 }),

    // Intro
    ...multiPara(data.lIntro),

    // Bullets (optional)
    ...(data.lBullets.length ? [para(""), ...data.lBullets.map(bulletPara)] : []),

    para(""),

    // Documents section
    sectionHeading(data.lSecDocs),
    ...multiPara(data.lSecDocsIntro),
    ...docRowParas,

    para(""),

    // Purpose section
    sectionHeading(data.lSecPurpose),
    ...multiPara(data.lSecPurposeIntro),
    ...multiPara(data.lPurposeDetail),
    ...(data.lFlightPara ? multiPara(data.lFlightPara) : []),

    para(""),

    // Overstay section
    sectionHeading(data.lSecOverstay),
    ...multiPara(data.lSecOverstayIntro),

    para(""),

    // Immigration history
    subHeading(data.lSecImmigration),
    ...multiPara(data.lImmigration),

    para(""),

    // Family ties
    subHeading(data.lSecFamily),
    ...multiPara(data.lFamilyTies),

    para(""),

    // Economic ties
    subHeading(data.lSecEconomic),
    ...multiPara(data.lEconomicTies),

    para(""),

    // Dependant section (only when hasDependant = "yes")
    ...(hasDep && data.lDependant
      ? [
        sectionHeading(data.lSecDependant),
        ...multiPara(data.lDependant),
        para(""),
      ]
      : []),

    // Finance section
    sectionHeading(data.lSecFinance),
    ...(!isSpon
      ? [
        ...multiPara(data.lSecFinanceIntro),
        para(""),
        subHeading(data.lSecIncome),
        ...multiPara(data.lFinance),
      ]
      : [
        ...multiPara(data.lFinance),
        para(""),
        subHeading(data.lSecSponsor),
        ...multiPara(data.lSponsor),
      ]),

    para(""),

    // Contacts section
    sectionHeading(data.lSecContacts),
    ...multiPara(data.lContactsNote),
    para(""),
    contactsTable,

    para(""),

    // Closing
    ...multiPara(data.lClosing),

    para(""),

    // Signature block
    new Paragraph({
      children: [
        new TextRun({ text: data.lSigName, size: 24, font: "Times New Roman" }),
        new TextRun({
          text: `  (Passport No. — ${data.lSigPassport})`,
          size: 24,
          font: "Times New Roman",
        }),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "_____________________", size: 24, font: "Times New Roman" })],
      spacing: { after: 60 },
    }),
    para("Signature"),
  ];

  // ── Assemble document ──────────────────────────────────────

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
        {
          reference: "numbers",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
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