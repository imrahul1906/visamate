/**
 * itineraryDocxService.ts
 *
 * Builds a .docx Travel Itinerary document from structured data.
 * Runs entirely in the browser via the `docx` npm package (dynamic import).
 * No React, no hooks, no JSX — fully unit-testable.
 *
 * Consumed by: ItineraryWidget.tsx
 *
 * Key design decisions vs the old pdf-lib approach:
 *  - No manual coordinate math, no wrapText, no resolveRepeatedValue.
 *  - Word handles all layout, pagination, and text wrapping natively.
 *  - Output is fully editable — users can adjust hotel names, dates, etc.
 *  - `buildItineraryRows` is a pure data transform usable for both the
 *    HTML preview table and the docx table, keeping a single source of truth.
 */

import type { ItineraryCityMap } from "@/lib/data/types";
import type { ItineraryItem, AccommodationMap } from "./itineraryService";
import { dateForDay } from "./itineraryService";

// ─────────────────────────────────────────────────────────────
// Shared data types
// ─────────────────────────────────────────────────────────────

export interface ItineraryRowData {
  /** Formatted calendar date, e.g. "01/06/2025" */
  date: string;
  /** Ordered activity names for this day */
  activities: string[];
  /** Hotel phone / contact */
  contact: string;
  /** Hotel / accommodation name */
  accommodation: string;
  /**
   * When true the contact value is identical to the previous day's.
   * The preview and docx both render "Same as above" for deduplication.
   */
  contactSameAsAbove: boolean;
  /**
   * When true the accommodation value is identical to the previous day's.
   */
  accommodationSameAsAbove: boolean;
}

// ─────────────────────────────────────────────────────────────
// Pure data transform — shared by preview HTML and docx builder
// ─────────────────────────────────────────────────────────────

/**
 * Transforms raw widget state into one `ItineraryRowData` per day.
 * This is the single source of truth for both the HTML preview table
 * and the generated .docx table.
 */
export function buildItineraryRows(
  allDays: number[],
  itinerary: ItineraryItem[],
  accommodations: AccommodationMap,
  cities: ItineraryCityMap,
  startDate: string
): ItineraryRowData[] {
  const rows: ItineraryRowData[] = [];

  for (let i = 0; i < allDays.length; i++) {
    const d = allDays[i];

    const activities = itinerary
      .filter((x) => x.day === d)
      .sort((a, b) => a.order - b.order)
      .map((item) => {
        if (item.customName) return item.customName;
        const city = cities[item.city];
        return city?.places.find((p) => p.id === item.placeId)?.name ?? "";
      })
      .filter(Boolean);

    const accom = accommodations[d] ?? { hotelName: "", hotelContact: "" };
    const prev = i > 0 ? (accommodations[allDays[i - 1]] ?? { hotelName: "", hotelContact: "" }) : null;

    const contact = accom.hotelContact || "";
    const accommodation = accom.hotelName || "";

    const contactSameAsAbove =
      prev !== null &&
      contact.trim() !== "" &&
      contact === prev.hotelContact;

    const accommodationSameAsAbove =
      prev !== null &&
      accommodation.trim() !== "" &&
      accommodation === prev.hotelName;

    rows.push({
      date: dateForDay(startDate, d),
      activities,
      contact,
      accommodation,
      contactSameAsAbove,
      accommodationSameAsAbove,
    });
  }

  return rows;
}

// ─────────────────────────────────────────────────────────────
// docx builder — dynamically imported to keep initial bundle small
// ─────────────────────────────────────────────────────────────

/**
 * Builds and returns a Blob for a .docx Travel Itinerary.
 * Dynamically imports `docx` so this file is tree-shaken from the
 * initial bundle when the widget has not been opened yet.
 *
 * @param rows         Output of `buildItineraryRows`
 * @param applicantName  e.g. "Rahul Yadav"
 * @param passportNo   e.g. "A1234567"
 * @param dateRange    Formatted travel date range string, e.g. "1 June 2025 – 10 June 2025"
 * @param countryName  e.g. "Japan"
 * @param title        Document heading, e.g. "Travel Itinerary"
 */
export async function buildItineraryDocxBlob(
  rows: ItineraryRowData[],
  applicantName: string,
  passportNo: string,
  dateRange: string,
  countryName: string,
  title = "Travel Itinerary",
  sponsorName = ""
): Promise<Blob> {
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
    VerticalAlign,
    HeadingLevel,
    LevelFormat,
  } = await import("docx");

  // ── Page geometry (A4, 20 mm margins) ──
  // A4: 11906 x 16838 DXA  |  margin 1134 DXA ≈ 20 mm
  // Content width = 11906 - 2 × 1134 = 9638 DXA
  const PAGE_W = 11906;
  const MARGIN = 1134;
  const CONTENT_W = PAGE_W - MARGIN * 2; // 9638

  // ── Column widths (must sum to CONTENT_W = 9638) ──
  // Mirrors the old pdf-lib proportions: 14% date | 37% activity | 20% contact | 29% accom
  const COL_DATE  = Math.round(CONTENT_W * 0.14); // 1349
  const COL_ACT   = Math.round(CONTENT_W * 0.37); // 3566
  const COL_CON   = Math.round(CONTENT_W * 0.20); // 1928
  const COL_ACCOM = CONTENT_W - COL_DATE - COL_ACT - COL_CON; // remainder → 2795

  // ── Borders ──
  const border = { style: BorderStyle.SINGLE, size: 4, color: "333333" };
  const borders = { top: border, bottom: border, left: border, right: border };
  // ITableCellMarginOptions: marginUnitType + top/bottom/left/right in DXA units
  // 170 DXA ≈ 3mm top/bottom | 226 DXA ≈ 4mm left/right
  const cellMargins = {
    marginUnitType: WidthType.DXA,
    top: 170,
    bottom: 170,
    left: 226,
    right: 226,
  };

  // ── Header row style ──
  const headerRunProps = { bold: true, color: "000000", font: "Times New Roman", size: 20 };

  function headerCell(text: string, width: number): typeof TableCell.prototype {
    return new TableCell({
      borders,
      width: { size: width, type: WidthType.DXA },
      margins: cellMargins,
      verticalAlign: VerticalAlign.CENTER,
      children: [
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [new TextRun({ text, ...headerRunProps })],
        }),
      ],
    });
  }

  // ── Data cell factory ──
  function dataCell(
    children: InstanceType<typeof Paragraph>[],
    width: number,
    shadingFill = "FFFFFF"
  ): typeof TableCell.prototype {
    return new TableCell({
      borders,
      width: { size: width, type: WidthType.DXA },
      shading: { fill: shadingFill, type: ShadingType.CLEAR },
      margins: cellMargins,
      verticalAlign: VerticalAlign.CENTER,
      children,
    });
  }

  // ── Build table rows ──
  const dataRows = rows.map((row, idx) =>
    new TableRow({
      children: [
        // Date
        dataCell(
          [
            new Paragraph({
              children: [
                new TextRun({
                  text: row.date,
                  font: "Times New Roman",
                  size: 18,
                }),
              ],
            }),
          ],
          COL_DATE,
          idx % 2 === 0 ? "FFFFFF" : "F7F7FB"
        ),

        // Activity Plan — one paragraph per activity, using docx numbered/bulleted list
        dataCell(
          row.activities.length > 0
            ? row.activities.map(
                (act) =>
                  new Paragraph({
                    numbering: { reference: "activity-bullets", level: 0 },
                    children: [
                      new TextRun({ text: act, font: "Times New Roman", size: 18 }),
                    ],
                  })
              )
            : [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "—",
                      font: "Times New Roman",
                      size: 18,
                      color: "AAAAAA",
                    }),
                  ],
                }),
              ],
          COL_ACT,
          idx % 2 === 0 ? "FFFFFF" : "F7F7FB"
        ),

        // Contact
        dataCell(
          [
            new Paragraph({
              children: [
                new TextRun({
                  text: row.contactSameAsAbove ? "Same as above" : (row.contact || "—"),
                  font: "Times New Roman",
                  size: 18,
                  color: "000000",
                }),
              ],
            }),
          ],
          COL_CON,
          idx % 2 === 0 ? "FFFFFF" : "F7F7FB"
        ),

        // Accommodation
        dataCell(
          [
            new Paragraph({
              children: [
                new TextRun({
                  text: row.accommodationSameAsAbove ? "Same as above" : (row.accommodation || "—"),
                  font: "Times New Roman",
                  size: 18,
                  color: "000000",
                }),
              ],
            }),
          ],
          COL_ACCOM,
          idx % 2 === 0 ? "FFFFFF" : "F7F7FB"
        ),
      ],
    })
  );

  // ── Document ──
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "activity-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 360, hanging: 220 } },
                run: { font: "Times New Roman", size: 18 },
              },
            },
          ],
        },
      ],
    },

    styles: {
      default: {
        document: {
          run: { font: "Times New Roman", size: 20 },
        },
      },
    },

    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_W, height: 16838 },
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },

        children: [
          // ── Title ──
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: title,
                bold: true,
                font: "Times New Roman",
                size: 36,
              }),
            ],
          }),

          // ── Applicant info ──
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: "Applicant: ",
                bold: true,
                font: "Times New Roman",
                size: 20,
              }),
              new TextRun({
                text: [
                  applicantName || "[Applicant Name]",
                  passportNo ? `(Passport No: ${passportNo})` : "",
                ]
                  .filter(Boolean)
                  .join(" "),
                font: "Times New Roman",
                size: 20,
              }),
            ],
          }),

          // ── Travel dates ──
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: "Travel Dates: ",
                bold: true,
                font: "Times New Roman",
                size: 20,
              }),
              new TextRun({
                text: dateRange || "[Travel Dates]",
                font: "Times New Roman",
                size: 20,
              }),
            ],
          }),

          // ── Sponsor (only when provided) ──
          ...(sponsorName
            ? [
                new Paragraph({
                  spacing: { after: 80 },
                  children: [
                    new TextRun({
                      text: "Sponsor: ",
                      bold: true,
                      font: "Times New Roman",
                      size: 20,
                    }),
                    new TextRun({
                      text: sponsorName,
                      font: "Times New Roman",
                      size: 20,
                    }),
                  ],
                }),
              ]
            : []),

          // ── Intro sentence ──
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `The travel itinerary of the visa applicant(s) is as follows:`,
                font: "Times New Roman",
                size: 20,
              }),
            ],
          }),

          // ── Itinerary table ──
          new Table({
            width: { size: CONTENT_W, type: WidthType.DXA },
            columnWidths: [COL_DATE, COL_ACT, COL_CON, COL_ACCOM],
            rows: [
              // Header
              new TableRow({
                tableHeader: true,
                children: [
                  headerCell("Date", COL_DATE),
                  headerCell("Activity Plan", COL_ACT),
                  headerCell("Contact", COL_CON),
                  headerCell("Accommodation", COL_ACCOM),
                ],
              }),
              ...dataRows,
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

// ─────────────────────────────────────────────────────────────
// Download trigger
// ─────────────────────────────────────────────────────────────

/** Triggers a browser download of the generated .docx blob. */
export function downloadDocxBlob(blob: Blob, countryName: string): void {
  const filename = `${countryName.toLowerCase().replace(/\s+/g, "_")}_travel_itinerary.docx`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}