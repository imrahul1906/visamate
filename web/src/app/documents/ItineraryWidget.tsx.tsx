"use client";

// ItineraryWidget.tsx — Production-ready Japan visa itinerary builder
// Props-driven, zero hardcoded country data. Pass any country via props.

import { useMemo, useState } from "react";
import type { ItineraryCityMap } from "@/lib/data/types";

export default function ItineraryWidget({
  color,
  countryName,
  cities,
  typeColors,
  onPdfReady,
}: {
  color: string;
  countryName: string;
  cities: ItineraryCityMap;
  typeColors: Record<string, string>;
  onPdfReady: (file: File) => void;
}) {
  const cityKeys = Object.keys(cities);

  /* ── State ── */
  const [mode, setMode] = useState<"select" | "helper">("select");
  const [selectedCity, setSelectedCity] = useState<string>(cityKeys[0] ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [days, setDays] = useState(5);
  const [activeDay, setActiveDay] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [addedPlaceId, setAddedPlaceId] = useState<string | null>(null); // inline indicator, no toast
  const [customActivityInput, setCustomActivityInput] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [passportNo, setPassportNo] = useState("");

  const [itinerary, setItinerary] = useState<
    { city: string; placeId: string; day: number; order: number; customName?: string }[]
  >([]);

  const [accommodations, setAccommodations] = useState<
    Record<number, { hotelName: string; hotelContact: string }>
  >({});

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);

  /* ── Derived ── */
  const cityPlaces = cities[selectedCity]?.places ?? [];

  const filteredPlaces = useMemo(
    () =>
      cityPlaces.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [cityPlaces, searchQuery]
  );

  const allDaysList = Array.from({ length: days }, (_, i) => i + 1);

  const accomForDay = (d: number) =>
    accommodations[d] ?? { hotelName: "", hotelContact: "" };

  const setAccom = (
    d: number,
    field: "hotelName" | "hotelContact",
    value: string
  ) => {
    setAccommodations((prev) => ({
      ...prev,
      [d]: { ...accomForDay(d), [field]: value },
    }));
  };

  const dateForDay = (d: number): string => {
    if (!startDate) return `Day ${d}`;
    const dt = new Date(startDate + "T00:00:00");
    dt.setDate(dt.getDate() + d - 1);
    // Format: DD/MM/YYYY to match the official reference format
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const dayItems = itinerary
    .filter((x) => x.day === activeDay)
    .sort((a, b) => a.order - b.order);

  const totalActivities = itinerary.length;

  /* ── Actions ── */
  const addPlace = (placeId: string) => {
    if (itinerary.some((x) => x.day === activeDay && x.placeId === placeId))
      return;
    const maxOrder = Math.max(
      0,
      ...itinerary.filter((x) => x.day === activeDay).map((x) => x.order)
    );
    setItinerary((prev) => [
      ...prev,
      { city: selectedCity, placeId, day: activeDay, order: maxOrder + 1 },
    ]);
    // show inline checkmark on the card briefly, no toast that shifts layout
    setAddedPlaceId(placeId);
    setTimeout(() => setAddedPlaceId(null), 1200);
  };

  const addCustomActivity = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const customId = `custom_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const maxOrder = Math.max(
      0,
      ...itinerary.filter((x) => x.day === activeDay).map((x) => x.order)
    );
    setItinerary((prev) => [
      ...prev,
      { city: "", placeId: customId, day: activeDay, order: maxOrder + 1, customName: trimmed },
    ]);
    setCustomActivityInput("");
  };

  const removePlace = (placeId: string, day: number) => {
    setItinerary((prev) =>
      prev.filter((x) => !(x.placeId === placeId && x.day === day))
    );
  };

  const moveUp = (placeId: string) => {
    setItinerary((prev) => {
      // Deep-copy items for this day so we never mutate state objects
      const items = prev
        .filter((x) => x.day === activeDay)
        .sort((a, b) => a.order - b.order)
        .map((x) => ({ ...x }));
      const idx = items.findIndex((x) => x.placeId === placeId);
      if (idx <= 0) return prev;
      const n = [...items];
      [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]];
      n.forEach((x, i) => { x.order = i + 1; });
      return [...prev.filter((x) => x.day !== activeDay), ...n];
    });
  };

  const moveDown = (placeId: string) => {
    setItinerary((prev) => {
      // Deep-copy items for this day so we never mutate state objects
      const items = prev
        .filter((x) => x.day === activeDay)
        .sort((a, b) => a.order - b.order)
        .map((x) => ({ ...x }));
      const idx = items.findIndex((x) => x.placeId === placeId);
      if (idx >= items.length - 1) return prev;
      const n = [...items];
      [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]];
      n.forEach((x, i) => { x.order = i + 1; });
      return [...prev.filter((x) => x.day !== activeDay), ...n];
    });
  };

  /* ── Download blank official format ── */
  const downloadOfficialPdf = () => {
    const url = "https://www.mofa.go.jp/files/000262548.pdf";
    const a = document.createElement("a");
    a.href = url;
    a.download = `${countryName.toLowerCase().replace(/\s+/g, "_")}_official_itinerary_format.pdf`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  /* ── Generate editable PDF in official Japan format (pdf-lib) ── */
  const generatePdf = async () => {
    setAttempted(true);
    const errs: Record<string, string> = {};
    if (totalActivities === 0) errs["activities"] = "Add at least one activity.";
    if (!startDate) errs["date"] = "Start date is required.";
    allDaysList.forEach((d) => {
      if (!(accommodations[d]?.hotelName ?? "").trim())
        errs[`day_${d}_hotel`] = "Hotel name required";
      if (!(accommodations[d]?.hotelContact ?? "").trim())
        errs[`day_${d}_contact`] = "Contact / phone required";
    });

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    try {
      // Dynamically import pdf-lib for editable PDF with form fields
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();
      const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      // A4 in points: 595.28 x 841.89
      const pageW = 595.28;
      const pageH = 841.89;
      const margin = 56; // ~20mm

      const page = pdfDoc.addPage([pageW, pageH]);

      // pdf-lib coords: (0,0) = bottom-left, y grows UP
      const topY = pageH - margin; // top content line

      // ── Top-right date section ──
      // Three separate underlined boxes: Year | Month | Day
      const dateY = topY - 6; // baseline for the date numbers
      const labelY = dateY - 14; // baseline for (Year)/(Month)/(Day)

      // Column positions (x) for each date field
      const yrX = 380; const yrW = 44;
      const moX = 436; const moW = 36;
      const dyX = 484; const dyW = 36;

      const submissionDate = new Date();
      const yr = String(submissionDate.getFullYear());
      const mo = String(submissionDate.getMonth() + 1).padStart(2, "0");
      const dy = String(submissionDate.getDate()).padStart(2, "0");

      page.setFont(timesRoman);
      page.setFontSize(10);

      // Draw underlines under each date field
      const underlineY = dateY - 2;
      page.drawLine({ start: { x: yrX, y: underlineY }, end: { x: yrX + yrW, y: underlineY }, thickness: 0.8, color: rgb(0, 0, 0) });
      page.drawLine({ start: { x: moX, y: underlineY }, end: { x: moX + moW, y: underlineY }, thickness: 0.8, color: rgb(0, 0, 0) });
      page.drawLine({ start: { x: dyX, y: underlineY }, end: { x: dyX + dyW, y: underlineY }, thickness: 0.8, color: rgb(0, 0, 0) });

      // Date values centered above underlines
      page.drawText(yr, { x: yrX + yrW / 2 - timesRoman.widthOfTextAtSize(yr, 10) / 2, y: dateY, size: 10, font: timesRoman });
      page.drawText(mo, { x: moX + moW / 2 - timesRoman.widthOfTextAtSize(mo, 10) / 2, y: dateY, size: 10, font: timesRoman });
      page.drawText(dy, { x: dyX + dyW / 2 - timesRoman.widthOfTextAtSize(dy, 10) / 2, y: dateY, size: 10, font: timesRoman });

      // Labels below underlines
      page.drawText("(Year)", { x: yrX + yrW / 2 - timesRoman.widthOfTextAtSize("(Year)", 9) / 2, y: labelY, size: 9, font: timesRoman });
      page.drawText("(Month)", { x: moX + moW / 2 - timesRoman.widthOfTextAtSize("(Month)", 9) / 2, y: labelY, size: 9, font: timesRoman });
      page.drawText("(Day)", { x: dyX + dyW / 2 - timesRoman.widthOfTextAtSize("(Day)", 9) / 2, y: labelY, size: 9, font: timesRoman });

      // ── Bold font ──
      const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      // ── Title — normal weight, large serif, centered ──
      const titleText = "Travel Itinerary";
      const titleSize = 22;
      const titleW = timesRoman.widthOfTextAtSize(titleText, titleSize);
      page.drawText(titleText, {
        x: pageW / 2 - titleW / 2,
        y: topY - 48,
        size: titleSize,
        font: timesRoman,
      });

      // ── Applicant Info ──
      const infoY = topY - 74;
      if (applicantName || passportNo) {
        page.drawText("Applicant", { x: margin, y: infoY, size: 10, font: timesRomanBold });
        const applicantVal = `: ${applicantName}${passportNo ? ` (Passport No: ${passportNo})` : ""}`;
        page.drawText(applicantVal, { x: margin + timesRomanBold.widthOfTextAtSize("Applicant", 10), y: infoY, size: 10, font: timesRoman });
      }

      // ── Travel dates line ──
      const travelDatesY = (applicantName || passportNo) ? infoY - 14 : infoY;
      if (startDate) {
        const endDateObj = new Date(startDate);
        endDateObj.setDate(endDateObj.getDate() + days - 1);
        const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
        const startFmt = fmtDate(new Date(startDate + "T00:00:00"));
        const endFmt = fmtDate(endDateObj);
        page.drawText("Travel Dates", { x: margin, y: travelDatesY, size: 10, font: timesRomanBold });
        page.drawText(`: ${startFmt} \u2013 ${endFmt}`, { x: margin + timesRomanBold.widthOfTextAtSize("Travel Dates", 10), y: travelDatesY, size: 10, font: timesRoman });
      }

      // ── Intro sentence ──
      const hasInfoBlock = applicantName || passportNo || startDate;
      const introY = hasInfoBlock ? travelDatesY - 16 : topY - 74;
      page.drawText("The travel itinerary of the visa applicant(s) is as follows:", {
        x: margin,
        y: introY,
        size: 10,
        font: timesRoman,
      });

      // ── Table layout ──
      // Columns: Date | Activity Plan | Contact | Accommodation
      // All widths sum to pageW - 2*margin = 483.28, use exact proportions from official format
      const tableLeft = margin;
      const tableRight = pageW - margin;
      const tableWidth = tableRight - tableLeft;

      // Column widths — Contact needs more room for phone numbers, Activity slightly less
      const colWidths = [
        tableWidth * 0.14, // Date
        tableWidth * 0.37, // Activity Plan
        tableWidth * 0.20, // Contact (wider to fit phone on one line)
        tableWidth * 0.29, // Accommodation
      ];
      const colXs = [
        tableLeft,
        tableLeft + colWidths[0],
        tableLeft + colWidths[0] + colWidths[1],
        tableLeft + colWidths[0] + colWidths[1] + colWidths[2],
      ];

      const headerH = 22; // pts
      const baseRowH = 30;
      const fontSize = 9;
      const lineH = fontSize * 1.5;
      const cellPadV = 5;
      const totalDataRows = allDaysList.length;
      const tableTopY = introY - 12;

      const lineColor = rgb(0.1, 0.1, 0.1);
      const lineThick = 0.7;
      const pad = 4; // cell padding pts
      const innerWs = colWidths.map(w => w - pad * 2);

      // ── Pre-compute per-row content and heights ──
      type RowData = {
        dateLines: string[];
        actLines: string[];
        conLines: string[];
        accLines: string[];
        rowH: number;
      };

      // Word-wrap helper: split text into lines fitting maxWidth
      const wrapText = (text: string, maxW: number, size: number): string[] => {
        if (!text) return [""];
        const words = text.split(" ");
        const lines: string[] = [];
        let cur = "";
        for (const w of words) {
          const test = cur ? cur + " " + w : w;
          if (timesRoman.widthOfTextAtSize(test, size) <= maxW) {
            cur = test;
          } else {
            if (cur) lines.push(cur);
            cur = w;
          }
        }
        if (cur) lines.push(cur);
        return lines.length ? lines : [""];
      };

      const rowsData: RowData[] = allDaysList.map((d, idx) => {
        const places = itinerary
          .filter((x) => x.day === d)
          .sort((a, b) => a.order - b.order)
          .map((item) => {
            if (item.customName) return item.customName;
            const city = cities[item.city];
            return city?.places.find((p) => p.id === item.placeId)?.name ?? "";
          })
          .filter(Boolean);

        const accom = accomForDay(d);
        const dateVal = dateForDay(d);

        // Activities as bullet lines
        const actLines: string[] = [];
        for (const place of places) {
          const wrapped = wrapText(place, innerWs[1] - 8, fontSize);
          wrapped.forEach((line, li) => {
            actLines.push(li === 0 ? `\u2022 ${line}` : `  ${line}`);
          });
        }
        if (actLines.length === 0) actLines.push("");

        // "Same as above" logic for contact and accommodation
        const prevAccom = idx > 0 ? accomForDay(d - 1) : null;
        const sameContact = prevAccom && accom.hotelContact === prevAccom.hotelContact && accom.hotelContact.trim() !== "";
        const sameAccom = prevAccom && accom.hotelName === prevAccom.hotelName && accom.hotelName.trim() !== "";

        const conVal = sameContact ? "Same as above" : (accom.hotelContact || "");
        const accVal = sameAccom ? "Same as above" : (accom.hotelName || "");

        const dateLines = wrapText(dateVal, innerWs[0], fontSize);
        const conLines = wrapText(conVal, innerWs[2], fontSize);
        const accLines = wrapText(accVal, innerWs[3], fontSize);

        const maxLines = Math.max(dateLines.length, actLines.length, conLines.length, accLines.length);
        const rowH = Math.max(baseRowH, maxLines * lineH + cellPadV * 2);

        return { dateLines, actLines, conLines, accLines, rowH };
      });

      // Total table height
      const totalDataH = rowsData.reduce((sum, r) => sum + r.rowH, 0);
      const totalTableH = headerH + totalDataH;
      const tableBottomY = tableTopY - totalTableH;

      // ── Outer border ──
      page.drawRectangle({
        x: tableLeft,
        y: tableBottomY,
        width: tableWidth,
        height: totalTableH,
        borderColor: lineColor,
        borderWidth: lineThick,
        color: rgb(1, 1, 1),
        opacity: 1,
        borderOpacity: 1,
      });

      // ── Vertical column dividers (full height) ──
      for (let c = 1; c < colXs.length; c++) {
        page.drawLine({
          start: { x: colXs[c], y: tableTopY },
          end: { x: colXs[c], y: tableBottomY },
          thickness: lineThick,
          color: lineColor,
        });
      }

      // ── Header row bottom line ──
      page.drawLine({
        start: { x: tableLeft, y: tableTopY - headerH },
        end: { x: tableRight, y: tableTopY - headerH },
        thickness: lineThick,
        color: lineColor,
      });

      // ── Header labels (bold, 10pt to match reference) ──
      const headers = ["Date", "Activity Plan", "Contact", "Accommodation"];
      for (let c = 0; c < headers.length; c++) {
        const textW = timesRomanBold.widthOfTextAtSize(headers[c], 10);
        page.drawText(headers[c], {
          x: colXs[c] + colWidths[c] / 2 - textW / 2,
          y: tableTopY - headerH + 7,
          size: 10,
          font: timesRomanBold,
        });
      }

      // ── Data rows: draw text + bottom border line + editable overlay ──
      let curY = tableTopY - headerH;

rowsData.forEach((row) => {
  const rH = row.rowH;
  const rowBottom = curY - rH;

  // horizontal row border
  page.drawLine({
    start: { x: tableLeft, y: rowBottom },
    end: { x: tableRight, y: rowBottom },
    thickness: lineThick,
    color: lineColor,
  });

  const drawCellText = (
    lines: string[],
    colIndex: number
  ) => {
    const startX = colXs[colIndex] + pad;
    const startY = curY - cellPadV - fontSize;

    lines.forEach((line, i) => {
      page.drawText(line, {
        x: startX,
        y: startY - i * lineH,
        size: fontSize,
        font: timesRoman,
        color: rgb(0, 0, 0),
      });
    });
  };

  drawCellText(row.dateLines, 0);
  drawCellText(row.actLines, 1);
  drawCellText(row.conLines, 2);
  drawCellText(row.accLines, 3);

  curY = rowBottom;
});

      // ── Save ──
      const filename = `${countryName.toLowerCase().replace(/\s+/g, "_")}_travel_itinerary.pdf`;
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const file = new File([blob], filename, { type: "application/pdf" });
      onPdfReady(file);
      setPdfGenerated(true);
    } catch (e) {
      console.error("PDF generation error:", e);
    }
  };

  /* ── Render ── */
  return (
    <>
      <style>{styles}</style>

      {mode === "select" ? (
        /* ─────────────── SELECTION SCREEN ─────────────── */
        <div className="iw-select">
          <div className="iw-select-inner">
            <p className="iw-select-eyebrow">{countryName} Visa · Travel Document</p>
            <h2 className="iw-select-title">Travel Itinerary</h2>
            <p className="iw-select-sub">
              Prepare your official itinerary for your {countryName} visa application.
            </p>

            <div className="iw-options">
              {/* Option A — blank template */}
              <button
                className="iw-opt iw-opt--light"
                onClick={(e) => { e.stopPropagation(); downloadOfficialPdf(); }}
              >
                <div className="iw-opt-left">
                  <div className="iw-opt-icon iw-opt-icon--light">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div className="iw-opt-text">
                    <span className="iw-opt-title">Download Blank Format</span>
                    <span className="iw-opt-desc">Official {countryName} itinerary template. Fill it manually and attach to your documents.</span>
                  </div>
                </div>
                <svg className="iw-opt-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              {/* Option B — interactive builder */}
              <button
                className="iw-opt iw-opt--dark"
                onClick={(e) => { e.stopPropagation(); setMode("helper"); }}
              >
                <div className="iw-opt-left">
                  <div className="iw-opt-icon iw-opt-icon--dark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <line x1="8" y1="14" x2="16" y2="14" />
                      <line x1="8" y1="18" x2="13" y2="18" />
                    </svg>
                  </div>
                  <div className="iw-opt-text">
                    <span className="iw-opt-title">
                      Itinerary Builder
                      <span className="iw-opt-badge">Recommended</span>
                    </span>
                    <span className="iw-opt-desc">Plan day-by-day, add destinations and hotels. We generate the official PDF automatically.</span>
                  </div>
                </div>
                <svg className="iw-opt-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────── BUILDER SCREEN ─────────────── */
        <div className="iw-builder" style={{ overflow: "visible" }} onClick={(e) => e.stopPropagation()}>

          {/* Topbar */}
          <div className="iw-topbar">
            <button className="iw-back" onClick={() => setMode("select")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            <div className="iw-topbar-center">
              <span className="iw-topbar-title">{countryName} Itinerary Builder</span>
              <span className="iw-topbar-sub">Official travel document</span>
            </div>
            <div className="iw-topbar-stats">
              <span className="iw-stat">
                <strong>{totalActivities}</strong> activities
              </span>
              <span className="iw-stat">
                <strong>{days}</strong> days
              </span>
            </div>
          </div>

          {/* Global errors: no date / no activities — shown as slim strip */}
          {attempted && (fieldErrors["activities"] || fieldErrors["date"]) && (
            <div className="iw-error-strip">
              {fieldErrors["date"] && <span>📅 {fieldErrors["date"]}</span>}
              {fieldErrors["activities"] && <span>📍 {fieldErrors["activities"]}</span>}
            </div>
          )}

          <div className="iw-body">
            {/* ── Left: Destination picker ── */}
            <div className="iw-left">
              <div className="iw-left-head">
                <h3 className="iw-panel-title">Destinations</h3>
                <div className="iw-city-select-wrap">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="iw-city-select"
                  >
                    {Object.entries(cities).map(([k, city]) => (
                      <option key={k} value={k}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="iw-search-wrap">
                <svg className="iw-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className="iw-search"
                  placeholder="Search places…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="iw-places">
                {filteredPlaces.length === 0 && (
                  <p className="iw-no-results">No results found.</p>
                )}
                {filteredPlaces.map((place) => {
                  const alreadyAdded = itinerary.some(
                    (x) => x.day === activeDay && x.placeId === place.id
                  );
                  const justAdded = addedPlaceId === place.id;
                  return (
                    <button
                      key={place.id}
                      className={`iw-place ${alreadyAdded ? "iw-place--added" : ""}`}
                      disabled={alreadyAdded}
                      onClick={() => { if (!alreadyAdded) addPlace(place.id); }}
                    >
                      <div className="iw-place-info">
                        <span className="iw-place-name" style={{ fontWeight: 400, fontSize: "11px" }}>{place.name}</span>
                        <span
                          className="iw-place-type"
                          style={{ fontWeight: 400, fontSize: "10px", color: typeColors[place.type] || "#888" }}
                        >
                          {place.type}
                        </span>
                      </div>
                      <span className="iw-place-action">
                        {alreadyAdded ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Right: Day planner ── */}
            <div className="iw-right" style={{ overflowY: "auto" }}>
              {/* Date + Days config row */}
              <div className="iw-config-row">
                <div className="iw-config-field">
                  <label className="iw-label">Applicant Name</label>
                  <input
                    type="text"
                    className="iw-input"
                    placeholder="e.g. Rahul Yadav"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                  />
                </div>
                <div className="iw-config-field">
                  <label className="iw-label">Passport Number</label>
                  <input
                    type="text"
                    className="iw-input"
                    placeholder="e.g. A1234567"
                    value={passportNo}
                    onChange={(e) => setPassportNo(e.target.value)}
                  />
                </div>
              </div>
              <div className="iw-config-row">
                <div className="iw-config-field">
                  <label className="iw-label">Start Date</label>
                  <input
                    type="date"
                    className="iw-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="iw-config-field iw-config-field--sm">
                  <label className="iw-label">Duration (days)</label>
                  <input
                    type="number"
                    className="iw-input"
                    value={days}
                    min={1}
                    max={30}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setDays(v);
                      if (activeDay > v) setActiveDay(v);
                    }}
                  />
                </div>
              </div>

              {/* Day tabs */}
              <div className="iw-day-tabs">
                {allDaysList.map((d) => {
                  const hasErr = attempted && (!!fieldErrors[`day_${d}_hotel`] || !!fieldErrors[`day_${d}_contact`]);
                  return (
                    <button
                      key={d}
                      className={`iw-day-tab ${activeDay === d ? "iw-day-tab--active" : ""} ${hasErr ? "iw-day-tab--error" : ""}`}
                      onClick={() => setActiveDay(d)}
                    >
                      {hasErr && <span className="iw-tab-dot" />}
                      {startDate ? (
                        <>
                          <span className="iw-day-tab-num">Day {d}</span>
                          <span className="iw-day-tab-date">{dateForDay(d)}</span>
                        </>
                      ) : (
                        `Day ${d}`
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Day content */}
              <div className="iw-day-panel">
                <div className="iw-day-header">
                  <div>
                    <p className="iw-day-label">Day {activeDay}</p>
                    <h3 className="iw-day-date">{dateForDay(activeDay)}</h3>
                  </div>
                  <span className="iw-day-count">{dayItems.length} {dayItems.length === 1 ? "activity" : "activities"}</span>
                </div>

                {/* Accommodation row */}
                {activeDay > 1 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: -4 }}>
                    <button
                      className="iw-same-btn"
                      onClick={() => {
                        const prev = accomForDay(activeDay - 1);
                        setAccommodations(a => ({ ...a, [activeDay]: { ...prev } }));
                        setFieldErrors(prev => {
                          const n = { ...prev };
                          delete n[`day_${activeDay}_hotel`];
                          delete n[`day_${activeDay}_contact`];
                          return n;
                        });
                      }}
                    >
                      ↑ Same hotel &amp; contact as Day {activeDay - 1}
                    </button>
                  </div>
                )}
                <div className="iw-hotel-row">
                  <div className="iw-hotel-field">
                    <label className="iw-label">
                      Hotel / Accommodation
                      {attempted && fieldErrors[`day_${activeDay}_hotel`] && (
                        <span className="iw-field-err">{fieldErrors[`day_${activeDay}_hotel`]}</span>
                      )}
                    </label>
                    <input
                      className={`iw-input ${attempted && fieldErrors[`day_${activeDay}_hotel`] ? "iw-input--error" : ""}`}
                      placeholder="e.g. Shinjuku Granbell Hotel"
                      value={accomForDay(activeDay).hotelName}
                      onChange={(e) => {
                        setAccom(activeDay, "hotelName", e.target.value);
                        if (e.target.value.trim()) {
                          setFieldErrors((prev) => {
                            const next = { ...prev };
                            delete next[`day_${activeDay}_hotel`];
                            return next;
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="iw-hotel-field">
                    <label className="iw-label">
                      Contact / Phone
                      {attempted && fieldErrors[`day_${activeDay}_contact`] && (
                        <span className="iw-field-err">{fieldErrors[`day_${activeDay}_contact`]}</span>
                      )}
                    </label>
                    <input
                      className={`iw-input ${attempted && fieldErrors[`day_${activeDay}_contact`] ? "iw-input--error" : ""}`}
                      placeholder="e.g. +81-3-5291-1900"
                      value={accomForDay(activeDay).hotelContact}
                      onChange={(e) => {
                        setAccom(activeDay, "hotelContact", e.target.value);
                        if (e.target.value.trim()) {
                          setFieldErrors((prev) => {
                            const next = { ...prev };
                            delete next[`day_${activeDay}_contact`];
                            return next;
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Activity list — fixed min-height so layout never shifts */}
                <div className="iw-activity-section">
                  <p className="iw-activity-label">Activities</p>
                  <div className="iw-activity-list" style={{ maxHeight: "none", overflow: "visible" }}>
                    {dayItems.length === 0 ? (
                      <div className="iw-empty">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c0bbb4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>Select destinations from the left to add activities</span>
                      </div>
                    ) : (
                      dayItems.map((item, idx) => {
                        const isCustom = !!item.customName;
                        const placeName = isCustom
                          ? item.customName!
                          : cities[item.city]?.places.find((p) => p.id === item.placeId)?.name;
                        const placeType = isCustom
                          ? "Custom"
                          : cities[item.city]?.places.find((p) => p.id === item.placeId)?.type;
                        if (!placeName) return null;
                        return (
                          <div key={item.placeId} className="iw-activity-item" style={{ fontWeight: 400 }}>
                            <span className="iw-activity-num">{idx + 1}</span>
                            <div className="iw-activity-info">
                              <span className="iw-activity-name" style={{ fontWeight: 400, fontSize: "11px" }}>{placeName}</span>
                              <span
                                className="iw-activity-type"
                                style={{ fontWeight: 400, fontSize: "10px", color: isCustom ? "#7c6f9f" : (typeColors[placeType ?? ""] || "#888") }}
                              >
                                {placeType}
                              </span>
                            </div>
                            <div className="iw-activity-actions">
                              <button
                                className="iw-icon-btn"
                                onClick={() => moveUp(item.placeId)}
                                disabled={idx === 0}
                                title="Move up"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="18 15 12 9 6 15" />
                                </svg>
                              </button>
                              <button
                                className="iw-icon-btn"
                                onClick={() => moveDown(item.placeId)}
                                disabled={idx === dayItems.length - 1}
                                title="Move down"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="6 9 12 15 18 9" />
                                </svg>
                              </button>
                              <button
                                className="iw-icon-btn iw-icon-btn--remove"
                                onClick={() => removePlace(item.placeId, activeDay)}
                                title="Remove"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Custom activity input */}
                <div className="iw-custom-activity-row">
                  <input
                    className="iw-input iw-custom-activity-input"
                    placeholder="Add your own activity…"
                    value={customActivityInput}
                    onChange={(e) => setCustomActivityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { addCustomActivity(customActivityInput); }
                    }}
                  />
                  <button
                    className="iw-custom-activity-btn"
                    onClick={() => addCustomActivity(customActivityInput)}
                    disabled={!customActivityInput.trim()}
                  >
                    + Add
                  </button>
                </div>

                {/* Save button — generates PDF, no download in header */}
                <div className="iw-save-row">
                  <p className="iw-save-hint">
                    {pdfGenerated
                      ? "✓ Itinerary saved. It will be included with your documents."
                      : "Complete all days, then save. Your PDF will be added to your document pack."}
                  </p>
                  <button className="iw-save-btn" onClick={generatePdf}>
                    {pdfGenerated ? "Update Itinerary" : "Save Itinerary"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────── STYLES ─────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  :root {
    --iw-bg:          #0d0d1f;
    --iw-surface:     #13132a;
    --iw-surface2:    #1a1a35;
    --iw-border:      rgba(255,255,255,0.08);
    --iw-border2:     rgba(255,255,255,0.14);
    --iw-indigo:      #6366f1;
    --iw-indigo-lt:   #818cf8;
    --iw-indigo-glow: rgba(99,102,241,0.18);
    --iw-text:        #f1f5f9;
    --iw-muted:       rgba(255,255,255,0.38);
    --iw-muted2:      rgba(255,255,255,0.55);
    --iw-green:       #4ade80;
    --iw-green-bg:    rgba(74,222,128,0.1);
    --iw-amber:       #fbbf24;
    --iw-error:       #f87171;
    --iw-error-bg:    rgba(248,113,113,0.1);
    --iw-radius:      10px;
    --iw-ff-body:     'DM Sans', sans-serif;
  }

  /* ─── Select screen ─── */
  .iw-select {
    font-family: var(--iw-ff-body);
    font-weight: 400;
    background: transparent;
    padding: 28px 20px;
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .iw-select * { font-weight: inherit; }

  .iw-select-inner {
    max-width: 560px;
    width: 100%;
  }

  .iw-select-eyebrow {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--iw-indigo-lt);
  }

  .iw-select-title {
    font-size: 22px;
    font-weight: 600;
    color: var(--iw-text);
    margin: 0 0 8px;
    font-family: var(--iw-ff-body);
  }

  .iw-select-sub {
    font-size: 13px;
    color: var(--iw-muted2);
    margin: 0 0 24px;
    line-height: 1.6;
  }

  .iw-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .iw-opt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 18px;
    border-radius: var(--iw-radius);
    border: 1px solid var(--iw-border);
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: border-color 150ms ease, background 150ms ease, transform 120ms ease;
    background: rgba(255,255,255,0.03);
  }

  .iw-opt:active { transform: scale(0.99); }

  .iw-opt--light {
    color: var(--iw-muted2);
  }

  .iw-opt--light:hover {
    border-color: var(--iw-border2);
    background: rgba(255,255,255,0.05);
  }

  .iw-opt--dark {
    background: var(--iw-indigo-glow);
    border-color: rgba(99,102,241,0.35);
    color: var(--iw-text);
  }

  .iw-opt--dark:hover {
    background: rgba(99,102,241,0.22);
    border-color: rgba(99,102,241,0.55);
    box-shadow: 0 4px 24px rgba(99,102,241,0.15);
  }

  .iw-opt-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
  }

  .iw-opt-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .iw-opt-icon--light {
    background: rgba(255,255,255,0.06);
    color: var(--iw-muted2);
    border: 1px solid var(--iw-border);
  }

  .iw-opt-icon--dark {
    background: rgba(99,102,241,0.2);
    color: var(--iw-indigo-lt);
    border: 1px solid rgba(99,102,241,0.3);
  }

  .iw-opt-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .iw-opt-title {
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1;
    color: var(--iw-text);
  }

  .iw-opt-badge {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 99px;
    background: rgba(99,102,241,0.2);
    color: var(--iw-indigo-lt);
    border: 1px solid rgba(99,102,241,0.35);
  }

  .iw-opt-desc {
    font-size: 12px;
    color: var(--iw-muted2);
    line-height: 1.5;
  }

  .iw-opt-arrow {
    flex-shrink: 0;
    color: var(--iw-muted);
  }

  .iw-opt--dark .iw-opt-arrow {
    color: var(--iw-indigo-lt);
  }

  /* ─── Builder ─── */
  .iw-builder {
    font-family: var(--iw-ff-body);
    background: transparent;
    display: flex;
    flex-direction: column;
    font-weight: 400;
    overflow: visible;
  }

  .iw-builder * { font-weight: inherit; }
  .iw-builder b, .iw-builder strong { font-weight: 600; }

  /* Topbar */
  .iw-topbar {
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--iw-surface);
    border: 1px solid var(--iw-border);
    border-radius: 10px 10px 0 0;
    color: var(--iw-text);
    padding: 12px 16px;
    margin-bottom: 0;
  }

  .iw-back {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--iw-border);
    color: var(--iw-muted2);
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: var(--iw-ff-body);
    flex-shrink: 0;
    transition: background 120ms, color 120ms, border-color 120ms;
  }

  .iw-back:hover {
    background: rgba(255,255,255,0.1);
    border-color: var(--iw-border2);
    color: var(--iw-text);
  }

  .iw-topbar-center {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .iw-topbar-title {
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    color: var(--iw-text);
  }

  .iw-topbar-sub {
    font-size: 10px;
    color: var(--iw-muted);
    margin-top: 3px;
    letter-spacing: .05em;
    text-transform: uppercase;
  }

  .iw-topbar-stats {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
  }

  .iw-stat {
    font-size: 11px;
    color: var(--iw-muted);
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--iw-border);
    border-radius: 7px;
    padding: 4px 10px;
  }

  .iw-stat strong {
    font-weight: 600;
    color: var(--iw-indigo-lt);
  }

  /* Compact global error strip */
  .iw-error-strip {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 8px 16px;
    background: var(--iw-error-bg);
    border-bottom: 1px solid rgba(248,113,113,0.2);
    font-size: 12px;
    color: var(--iw-error);
    font-weight: 500;
  }

  /* Field-level inline error label */
  .iw-field-err {
    margin-left: 8px;
    font-size: 11px;
    font-weight: 500;
    color: var(--iw-error);
    font-style: normal;
  }

  /* Input error state */
  .iw-input--error {
    border-color: rgba(248,113,113,0.5) !important;
    background: rgba(248,113,113,0.06) !important;
  }

  .iw-input--error:focus {
    box-shadow: 0 0 0 3px rgba(248,113,113,0.12) !important;
  }

  /* Day tab error */
  .iw-day-tab--error {
    border-color: rgba(248,113,113,0.4) !important;
    color: var(--iw-error) !important;
  }

  .iw-tab-dot {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--iw-error);
    margin-right: 4px;
    vertical-align: middle;
    flex-shrink: 0;
  }

  .iw-day-tab--error.iw-day-tab--active {
    background: rgba(248,113,113,0.15) !important;
    border-color: rgba(248,113,113,0.5) !important;
    color: var(--iw-error) !important;
  }

  /* Body */
  .iw-body {
    display: grid;
    grid-template-columns: 268px 1fr;
    gap: 12px;
    padding: 12px;
    background: var(--iw-surface);
    border: 1px solid var(--iw-border);
    border-top: none;
    align-items: start;
    border-radius: 0 0 10px 10px;
  }

  /* Left panel */
  .iw-left {
    background: var(--iw-surface2);
    border-radius: var(--iw-radius);
    border: 1px solid var(--iw-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .iw-left-head {
    padding: 12px 12px 10px;
    border-bottom: 1px solid var(--iw-border);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .iw-panel-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--iw-indigo-lt);
    margin: 0;
  }

  .iw-city-select-wrap { position: relative; }

  .iw-city-select {
    width: 100%;
    border: 1px solid var(--iw-border);
    border-radius: 7px;
    padding: 7px 10px;
    font-size: 12px;
    font-family: var(--iw-ff-body);
    color: var(--iw-text);
    background: var(--iw-surface);
    appearance: none;
    cursor: pointer;
    outline: none;
    transition: border-color 150ms;
  }

  .iw-city-select:focus {
    border-color: var(--iw-indigo);
    box-shadow: 0 0 0 3px var(--iw-indigo-glow);
  }

  .iw-search-wrap {
    position: relative;
    padding: 8px 10px;
    border-bottom: 1px solid var(--iw-border);
  }

  .iw-search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--iw-muted);
    pointer-events: none;
  }

  .iw-search {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--iw-border);
    border-radius: 7px;
    padding: 7px 10px 7px 30px;
    font-size: 12px;
    font-family: var(--iw-ff-body);
    color: var(--iw-text);
    outline: none;
    background: var(--iw-surface);
    transition: border-color 150ms;
  }

  .iw-search::placeholder { color: var(--iw-muted); }

  .iw-search:focus {
    border-color: var(--iw-indigo);
    box-shadow: 0 0 0 3px var(--iw-indigo-glow);
  }

  .iw-places {
    flex: 1;
    overflow-y: auto;
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    scrollbar-width: thin;
    scrollbar-color: rgba(99,102,241,0.35) transparent;
  }

  .iw-places::-webkit-scrollbar { width: 4px; }
  .iw-places::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.35); border-radius: 2px; }

  .iw-no-results {
    font-size: 12px;
    color: var(--iw-muted);
    text-align: center;
    padding: 16px;
    margin: 0;
  }

  .iw-place {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    text-align: left;
    font-family: var(--iw-ff-body);
    transition: background 100ms, border-color 100ms;
    width: 100%;
  }

  .iw-place:hover:not(:disabled) {
    background: rgba(99,102,241,0.08);
    border-color: rgba(99,102,241,0.25);
  }

  .iw-place--added {
    opacity: .4;
    cursor: default;
  }

  .iw-place-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .iw-place-name {
    font-size: 11px;
    font-weight: 400 !important;
    color: var(--iw-text);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .iw-place-type { font-size: 10px; font-weight: 400; }

  .iw-place-action {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.06);
    color: var(--iw-muted);
    flex-shrink: 0;
    border: 1px solid var(--iw-border);
  }

  .iw-place:not(.iw-place--added):hover .iw-place-action {
    background: var(--iw-indigo);
    color: white;
    border-color: var(--iw-indigo);
  }

  /* Right panel */
  .iw-right {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .iw-config-row {
    background: var(--iw-surface2);
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius);
    padding: 12px 14px;
    display: flex;
    gap: 12px;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .iw-config-field {
    flex: 1;
    min-width: 150px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .iw-config-field--sm {
    flex: 0 0 110px;
    min-width: auto;
  }

  .iw-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: var(--iw-indigo-lt);
  }

  .iw-input {
    border: 1px solid var(--iw-border);
    border-radius: 7px;
    padding: 7px 10px;
    font-size: 12px;
    font-family: var(--iw-ff-body);
    color: var(--iw-text);
    background: var(--iw-surface);
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 150ms, box-shadow 150ms;
  }

  .iw-input::placeholder { color: var(--iw-muted); }

  .iw-input:focus {
    border-color: var(--iw-indigo);
    box-shadow: 0 0 0 3px var(--iw-indigo-glow);
  }

  /* Day tabs */
  .iw-day-tabs {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }

  .iw-day-tab {
    border: 1px solid var(--iw-border);
    background: var(--iw-surface2);
    border-radius: 8px;
    padding: 6px 11px;
    cursor: pointer;
    font-size: 11px;
    font-family: var(--iw-ff-body);
    color: var(--iw-muted2);
    font-weight: 500;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    transition: all 100ms;
    line-height: 1;
  }

  .iw-day-tab-num { font-size: 11px; font-weight: 600; }
  .iw-day-tab-date { font-size: 9px; opacity: .7; }

  .iw-day-tab:hover:not(.iw-day-tab--active) {
    border-color: var(--iw-border2);
    color: var(--iw-text);
    background: rgba(255,255,255,0.05);
  }

  .iw-day-tab--active {
    background: var(--iw-indigo-glow);
    border-color: rgba(99,102,241,0.45);
    color: var(--iw-indigo-lt);
  }

  /* Day panel */
  .iw-day-panel {
    background: var(--iw-surface2);
    border: 1px solid var(--iw-border);
    border-radius: var(--iw-radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .iw-day-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .iw-day-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--iw-indigo-lt);
    margin: 0 0 3px;
  }

  .iw-day-date {
    font-size: 18px;
    font-weight: 600;
    color: var(--iw-text);
    margin: 0;
    font-family: var(--iw-ff-body);
  }

  .iw-day-count {
    font-size: 11px;
    color: var(--iw-muted2);
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--iw-border);
    border-radius: 99px;
    padding: 4px 10px;
    font-weight: 500;
  }

  .iw-same-btn {
    background: transparent;
    border: 1px dashed var(--iw-border);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 11px;
    font-family: var(--iw-ff-body);
    color: var(--iw-muted);
    cursor: pointer;
    transition: all 100ms;
    white-space: nowrap;
  }

  .iw-same-btn:hover {
    border-color: rgba(99,102,241,0.4);
    color: var(--iw-indigo-lt);
    background: var(--iw-indigo-glow);
  }

  .iw-hotel-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .iw-hotel-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  /* Activity list */
  .iw-activity-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .iw-activity-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: var(--iw-indigo-lt);
    margin: 0;
  }

  .iw-activity-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .iw-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 90px;
    border: 1.5px dashed var(--iw-border);
    border-radius: 9px;
    font-size: 12px;
    color: var(--iw-muted);
    text-align: center;
    padding: 16px;
  }

  .iw-activity-item {
    display: flex;
    align-items: center;
    gap: 9px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--iw-border);
    border-radius: 8px;
    padding: 8px 10px;
    transition: border-color 100ms;
  }

  .iw-activity-item:hover {
    border-color: var(--iw-border2);
  }

  .iw-activity-num {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--iw-indigo);
    color: white;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .iw-activity-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .iw-activity-name {
    font-size: 11px;
    font-weight: 400 !important;
    color: var(--iw-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .iw-activity-type {
    font-size: 10px;
    font-weight: 400;
  }

  .iw-activity-actions {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
  }

  .iw-icon-btn {
    width: 24px;
    height: 24px;
    border: 1px solid var(--iw-border);
    background: rgba(255,255,255,0.04);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--iw-muted);
    transition: all 100ms;
  }

  .iw-icon-btn:hover:not(:disabled) {
    border-color: var(--iw-border2);
    color: var(--iw-text);
    background: rgba(255,255,255,0.09);
  }

  .iw-icon-btn:disabled {
    opacity: .25;
    cursor: default;
  }

  .iw-icon-btn--remove:hover:not(:disabled) {
    border-color: rgba(248,113,113,0.4);
    color: var(--iw-error);
    background: var(--iw-error-bg);
  }

  /* Custom activity row */
  .iw-custom-activity-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .iw-custom-activity-input { flex: 1; }

  .iw-custom-activity-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--iw-border);
    border-radius: 7px;
    padding: 7px 14px;
    font-size: 12px;
    font-weight: 600;
    font-family: var(--iw-ff-body);
    color: var(--iw-muted2);
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 100ms;
  }

  .iw-custom-activity-btn:hover:not(:disabled) {
    background: var(--iw-indigo-glow);
    border-color: rgba(99,102,241,0.35);
    color: var(--iw-indigo-lt);
  }

  .iw-custom-activity-btn:disabled {
    opacity: .35;
    cursor: default;
  }

  /* Save row */
  .iw-save-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--iw-border);
  }

  .iw-save-hint {
    font-size: 12px;
    color: var(--iw-muted);
    margin: 0;
    line-height: 1.5;
    flex: 1;
  }

  .iw-save-btn {
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 9px 20px;
    font-size: 12px;
    font-weight: 600;
    font-family: var(--iw-ff-body);
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity 150ms, box-shadow 150ms;
    white-space: nowrap;
    box-shadow: 0 2px 12px rgba(99,102,241,0.3);
  }

  .iw-save-btn:hover {
    opacity: 0.88;
    box-shadow: 0 4px 20px rgba(99,102,241,0.4);
  }

  /* ─── Scrollbars inside the widget ─── */
  .iw-right {
    scrollbar-width: thin;
    scrollbar-color: rgba(99,102,241,0.35) transparent;
  }

  /* ─── Responsive ─── */
  @media (max-width: 860px) {
    .iw-body {
      grid-template-columns: 1fr;
    }
    .iw-left {
      max-height: 300px;
    }
    .iw-hotel-row {
      grid-template-columns: 1fr;
    }
    .iw-topbar-stats {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .iw-config-field--sm {
      flex: 1;
      min-width: 100px;
    }
    .iw-day-tab {
      padding: 5px 8px;
      font-size: 10px;
    }
  }
`;