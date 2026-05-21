import { Paragraph, TextRun, AlignmentType } from "docx";

// ─────────────────────────────────────────────────────────────
// Page Geometry Constants (in DXA units)
// 1 inch = 1440 DXA | 20 mm ≈ 1134 DXA
// ─────────────────────────────────────────────────────────────

/** US Letter page dimensions: 8.5 x 11 inches */
export const LETTER_PAGE_SIZE = { width: 12240, height: 15840 };

/** Standard 1-inch (1440 DXA) margins */
export const LETTER_MARGIN = { top: 1440, right: 1440, bottom: 1440, left: 1440 };

/** A4 page dimensions */
export const A4_PAGE_SIZE = { width: 11906, height: 16838 };

/** Standard A4 margins (approx. 20mm / 1134 DXA) */
export const A4_MARGIN = { top: 1134, right: 1134, bottom: 1134, left: 1134 };

/** Default font run configuration */
export const DEFAULT_FONT = "Times New Roman";

// ─────────────────────────────────────────────────────────────
// Shared Paragraph & Run Builders
// ─────────────────────────────────────────────────────────────

interface ParagraphOptions {
  bold?: boolean;
  italics?: boolean;
  size?: number; // half-points (e.g. 24 = 12pt, 20 = 10pt)
  spacingAfter?: number;
  spacingBefore?: number;
  align?: typeof AlignmentType[keyof typeof AlignmentType];
  font?: string;
}

/**
 * Creates a standard Paragraph containing a single TextRun.
 */
export function createPara(text: string, opts?: ParagraphOptions): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: opts?.bold,
        italics: opts?.italics,
        size: opts?.size ?? 24, // 12pt
        font: opts?.font ?? DEFAULT_FONT,
      }),
    ],
    alignment: opts?.align,
    spacing: {
      after: opts?.spacingAfter ?? 120,
      before: opts?.spacingBefore ?? 0,
    },
  });
}

/**
 * Splits a multi-line string into separate Paragraphs (to avoid \n in TextRun).
 */
export function createMultiPara(
  text: string,
  opts?: {
    spacingAfter?: number;
    size?: number;
    font?: string;
  }
): Paragraph[] {
  const spacing = opts?.spacingAfter ?? 120;
  const size = opts?.size ?? 24;
  const font = opts?.font ?? DEFAULT_FONT;

  return text.split("\n").map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line, size, font })],
        spacing: { after: spacing },
      })
  );
}

/**
 * Creates a signature line: "Label: Value", bolding the label.
 */
export function createSigLine(
  label: string,
  value: string,
  opts?: {
    size?: number;
    font?: string;
    spacingAfter?: number;
  }
): Paragraph {
  const size = opts?.size ?? 24;
  const font = opts?.font ?? DEFAULT_FONT;

  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size, font }),
      new TextRun({ text: value, size, font }),
    ],
    spacing: { after: opts?.spacingAfter ?? 80 },
  });
}
