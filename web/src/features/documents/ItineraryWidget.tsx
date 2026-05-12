"use client";

// ItineraryWidget.tsx — Japan Visa Itinerary Builder
// Props-driven, zero hardcoded country data.
// Reads applicantName, passportNo, travelStartDate, travelDuration from ApplicantContext.
// Writes them back on every change so CoverLetterWidget stays in sync.
//
// Flow: select → builder → preview → download .docx
// Preview mirrors CoverLetterWidget's white-paper sheet pattern.

import { useMemo, useState, useEffect } from "react";
import type { ItineraryCityMap } from "@/lib/data/types";
import { useApplicant } from "@/lib/context/ApplicantContext";
import {
  dateForDay,
  fmtDateLong,
  addPlace as addPlaceFn,
  addCustomActivity as addCustomActivityFn,
  removePlace as removePlaceFn,
  moveUp as moveUpFn,
  moveDown as moveDownFn,
  getUniqueCityNames,
  downloadOfficialPdf,
  validateItinerary,
} from "@/services/itineraryService";
import {
  buildItineraryRows,
  buildItineraryDocxBlob,
  downloadDocxBlob,
} from "@/services/itineraryDocxService";
import type { ItineraryRowData } from "@/services/itineraryDocxService";

export default function ItineraryWidget({
  color,
  countryName,
  cities,
  typeColors,
  onDocxReady,
}: {
  color: string;
  countryName: string;
  cities: ItineraryCityMap;
  typeColors: Record<string, string>;
  /** Called after a .docx Blob is generated so the parent can track documents. */
  onDocxReady?: (file: File) => void;
}) {
  const cityKeys = Object.keys(cities);

  /* ── Context ── */
  const { ctx, update } = useApplicant();

  /* ── Mode ── */
  const [mode, setMode] = useState<"select" | "helper" | "preview">("select");

  /* ── Destination picker ── */
  const [selectedCity, setSelectedCity] = useState<string>(cityKeys[0] ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDay, setActiveDay] = useState(1);

  /* ── Download state ── */
  const [docxGenerated, setDocxGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [addedPlaceId, setAddedPlaceId] = useState<string | null>(null);
  const [customActivityInput, setCustomActivityInput] = useState("");

  /* ── Context-backed fields (local state to avoid swallowed keystrokes) ── */
  const [applicantName, setApplicantName] = useState<string>(ctx.applicantName ?? "");
  const [passportNo, setPassportNo] = useState<string>(ctx.passportNo ?? "");
  const [startDate, setStartDate] = useState<string>(ctx.travelStartDate ?? "");
  const [days, setDaysLocal] = useState<number>(ctx.travelDuration || 5);
  const [daysInput, setDaysInput] = useState<string>(
    ctx.travelDuration ? String(ctx.travelDuration) : "5"
  );
  const setDays = (v: number) => { setDaysLocal(v); update({ travelDuration: v }); };

  /* ── Itinerary & accommodation state ── */
  const [itinerary, setItinerary] = useState<
    { city: string; placeId: string; day: number; order: number; customName?: string }[]
  >([]);
  const [accommodations, setAccommodations] = useState<
    Record<number, { hotelName: string; hotelContact: string }>
  >({});

  /* ── Validation ── */
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);

  /* ── Sync unique city names → context ── */
  useEffect(() => {
    update({ cities: getUniqueCityNames(itinerary, cities) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary]);

  /* ── Derived ── */
  const cityPlaces = cities[selectedCity]?.places ?? [];
  const filteredPlaces = useMemo(
    () => cityPlaces.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [cityPlaces, searchQuery]
  );
  const allDaysList = Array.from({ length: days }, (_, i) => i + 1);
  const accomForDay = (d: number) => accommodations[d] ?? { hotelName: "", hotelContact: "" };
  const setAccom = (d: number, field: "hotelName" | "hotelContact", value: string) => {
    setAccommodations((prev) => ({ ...prev, [d]: { ...accomForDay(d), [field]: value } }));
  };
  const dateForDayLocal = (d: number) => dateForDay(startDate, d);
  const dayItems = itinerary.filter((x) => x.day === activeDay).sort((a, b) => a.order - b.order);
  const totalActivities = itinerary.length;

  /* ── Preview rows (derived, memoised) ── */
  const previewRows: ItineraryRowData[] = useMemo(
    () => buildItineraryRows(allDaysList, itinerary, accommodations, cities, startDate),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itinerary, accommodations, startDate, days]
  );

  /* ── Editable preview state ── */
  const [editableRows, setEditableRows] = useState<ItineraryRowData[]>([]);
  const [editableTitle, setEditableTitle] = useState("Travel Itinerary");
  const [editableApplicant, setEditableApplicant] = useState(applicantName);
  const [editablePassport, setEditablePassport] = useState(passportNo);
  const [editableDateRange, setEditableDateRange] = useState("");
  const [editableSponsor, setEditableSponsor] = useState(ctx.sponsorName ?? "");
  const [editingCell, setEditingCell] = useState<string | null>(null);

  // Derived: is this applicant sponsored?
  // sponsorshipType is null by default (ApplicantContext). The wizard sets it to a string
  // when any sponsorship type is selected. We also guard on sponsorName being present
  // so the field never shows for self-funded applicants even if wizard sets a stale value.
  const isSponsored = !!ctx.sponsorshipType && ctx.sponsorshipType !== "self" && ctx.sponsorshipType !== "none" && ctx.sponsorshipType !== "self-funded";

  // Sync editable rows when entering preview
  useEffect(() => {
    if (mode === "preview") {
      setEditableRows(previewRows.map(r => ({ ...r, activities: [...r.activities] })));
      setEditableApplicant(applicantName);
      setEditablePassport(passportNo);
      setEditableDateRange(travelDateRange);
      // Sync sponsor from context — only matters if sponsored
      if (ctx.sponsorshipType) {
        setEditableSponsor(ctx.sponsorName ?? "");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const updateEditableRow = (idx: number, field: keyof ItineraryRowData, value: string | string[] | boolean) => {
    setEditableRows(rows => rows.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const updateActivity = (rowIdx: number, actIdx: number, value: string) => {
    setEditableRows(rows => rows.map((r, i) => {
      if (i !== rowIdx) return r;
      const acts = [...r.activities];
      acts[actIdx] = value;
      return { ...r, activities: acts };
    }));
  };

  const addActivityToRow = (rowIdx: number) => {
    setEditableRows(rows => rows.map((r, i) =>
      i === rowIdx ? { ...r, activities: [...r.activities, ""] } : r
    ));
  };

  const removeActivityFromRow = (rowIdx: number, actIdx: number) => {
    setEditableRows(rows => rows.map((r, i) =>
      i === rowIdx ? { ...r, activities: r.activities.filter((_, ai) => ai !== actIdx) } : r
    ));
  };

  /* ── Actions ── */
  const addPlace = (placeId: string) => {
    const updated = addPlaceFn(itinerary, activeDay, selectedCity, placeId);
    if (updated === itinerary) return;
    setItinerary(updated);
    setAddedPlaceId(placeId);
    setTimeout(() => setAddedPlaceId(null), 1200);
  };

  const addCustomActivity = (name: string) => {
    const [updated] = addCustomActivityFn(itinerary, activeDay, name);
    if (updated !== itinerary) { setItinerary(updated); setCustomActivityInput(""); }
  };

  const removePlace = (placeId: string, day: number) =>
    setItinerary(removePlaceFn(itinerary, placeId, day));

  const moveUp = (placeId: string) => setItinerary(moveUpFn(itinerary, activeDay, placeId));
  const moveDown = (placeId: string) => setItinerary(moveDownFn(itinerary, activeDay, placeId));

  const handleDownloadOfficialPdf = () => downloadOfficialPdf(countryName);

  /* ── Validate and move to preview ── */
  const handlePreview = () => {
    setAttempted(true);
    const errs = validateItinerary(itinerary, startDate, allDaysList, accommodations);
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setMode("preview");
  };

  /* ── Generate and download .docx ── */
  const handleDownloadDocx = async () => {
    setDownloading(true);
    try {
      const blob = await buildItineraryDocxBlob(
        editableRows,
        editableApplicant,
        editablePassport,
        editableDateRange,
        countryName,
        editableTitle,
        isSponsored ? editableSponsor : ""
      );
      downloadDocxBlob(blob, countryName);
      const filename = `${countryName.toLowerCase().replace(/\s+/g, "_")}_travel_itinerary.docx`;
      onDocxReady?.(new File([blob], filename, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }));
      setDocxGenerated(true);
      setMode("helper");
    } catch (e) {
      console.error("DOCX generation error:", e);
    } finally {
      setDownloading(false);
    }
  };

  /* ── Travel date range string for preview header ── */
  const travelDateRange = startDate
    ? (() => {
        const end = new Date(startDate + "T00:00:00");
        end.setDate(end.getDate() + days - 1);
        return `${fmtDateLong(startDate)} – ${end.toLocaleDateString("en-GB", {
          day: "numeric", month: "long", year: "numeric",
        })}`;
      })()
    : "";

  /* ═══════════════════════════ RENDER ═══════════════════════════ */
  return (
    <>
      <style>{styles}</style>

      {/* ─────────────── SELECT SCREEN ─────────────── */}
      {mode === "select" && (
        <div className="iw-select">
          <div className="iw-select-inner">
            <p className="iw-select-eyebrow">{countryName} Visa · Travel Document</p>
            <h2 className="iw-select-title">Travel Itinerary</h2>
            <p className="iw-select-sub">
              Prepare your official itinerary for your {countryName} visa application.
            </p>
            <div className="iw-options">
              <button className="iw-opt iw-opt--light" onClick={(e) => { e.stopPropagation(); handleDownloadOfficialPdf(); }}>
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

              <button className="iw-opt iw-opt--dark" onClick={(e) => { e.stopPropagation(); setMode("helper"); }}>
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
                    <span className="iw-opt-desc">
                      Plan day-by-day, add destinations and hotels. Preview and download an editable Word document.
                    </span>
                  </div>
                </div>
                <svg className="iw-opt-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────── BUILDER SCREEN ─────────────── */}
      {mode === "helper" && (
        <div className="iw-builder" onClick={(e) => e.stopPropagation()}>

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
              <span className="iw-stat"><strong>{totalActivities}</strong> activities</span>
              <span className="iw-stat"><strong>{days}</strong> days</span>
            </div>
          </div>

          {/* Global validation strip */}
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
                  <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="iw-city-select">
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
                <input className="iw-search" placeholder="Search places…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="iw-places">
                {filteredPlaces.length === 0 && <p className="iw-no-results">No results found.</p>}
                {filteredPlaces.map((place) => {
                  const alreadyAdded = itinerary.some((x) => x.day === activeDay && x.placeId === place.id);
                  return (
                    <button
                      key={place.id}
                      className={`iw-place ${alreadyAdded ? "iw-place--added" : ""}`}
                      disabled={alreadyAdded}
                      onClick={() => { if (!alreadyAdded) addPlace(place.id); }}
                    >
                      <div className="iw-place-info">
                        <span className="iw-place-name">{place.name}</span>
                        <span className="iw-place-type" style={{ color: typeColors[place.type] || "#888" }}>{place.type}</span>
                      </div>
                      <span className="iw-place-action">
                        {alreadyAdded
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        }
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Right: Day planner ── */}
            <div className="iw-right">
              {/* Applicant + passport */}
              <div className="iw-config-row">
                <div className="iw-config-field">
                  <label className="iw-label">Applicant Name</label>
                  <input type="text" className="iw-input" placeholder="e.g. Rahul Yadav" value={applicantName}
                    onChange={(e) => { setApplicantName(e.target.value); update({ applicantName: e.target.value }); }}
                    onBlur={() => update({ applicantName })} />
                </div>
                <div className="iw-config-field">
                  <label className="iw-label">Passport Number</label>
                  <input type="text" className="iw-input" placeholder="e.g. A1234567" value={passportNo}
                    onChange={(e) => { setPassportNo(e.target.value); update({ passportNo: e.target.value }); }}
                    onBlur={() => update({ passportNo })} />
                </div>
              </div>

              {/* Start date + duration */}
              <div className="iw-config-row">
                <div className="iw-config-field">
                  <label className="iw-label">Start Date</label>
                  <input type="date" className="iw-input iw-input--date" value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); update({ travelStartDate: e.target.value }); }} />
                </div>
                <div className="iw-config-field iw-config-field--sm">
                  <label className="iw-label">Duration (days)</label>
                  <input type="number" className="iw-input" value={daysInput} placeholder="e.g. 7" min={1} max={30}
                    onChange={(e) => {
                      setDaysInput(e.target.value);
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v) && v >= 1 && v <= 30) { setDays(v); if (activeDay > v) setActiveDay(v); }
                    }}
                    onBlur={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (isNaN(v) || v < 1) { setDaysInput("1"); setDays(1); setActiveDay(1); }
                      else if (v > 30) { setDaysInput("30"); setDays(30); }
                      else { setDaysInput(String(v)); }
                    }} />
                </div>
              </div>

              {/* Day tabs */}
              <div className="iw-day-tabs">
                {allDaysList.map((d) => {
                  const hasErr = attempted && (!!fieldErrors[`day_${d}_hotel`] || !!fieldErrors[`day_${d}_contact`]);
                  return (
                    <button key={d}
                      className={`iw-day-tab ${activeDay === d ? "iw-day-tab--active" : ""} ${hasErr ? "iw-day-tab--error" : ""}`}
                      onClick={() => setActiveDay(d)}>
                      {hasErr && <span className="iw-tab-dot" />}
                      {startDate ? (
                        <><span className="iw-day-tab-num">Day {d}</span><span className="iw-day-tab-date">{dateForDayLocal(d)}</span></>
                      ) : `Day ${d}`}
                    </button>
                  );
                })}
              </div>

              {/* Day content */}
              <div className="iw-day-panel">
                <div className="iw-day-header">
                  <div>
                    <p className="iw-day-label">Day {activeDay}</p>
                    <h3 className="iw-day-date">{dateForDayLocal(activeDay)}</h3>
                  </div>
                  <span className="iw-day-count">{dayItems.length} {dayItems.length === 1 ? "activity" : "activities"}</span>
                </div>

                {/* Hotel row */}
                <div className="iw-hotel-row">
                  <div className="iw-hotel-field">
                    <label className="iw-label">
                      Hotel / Accommodation
                      {attempted && fieldErrors[`day_${activeDay}_hotel`] && (
                        <span className="iw-field-err">{fieldErrors[`day_${activeDay}_hotel`]}</span>
                      )}
                    </label>
                    {activeDay > 1 && (
                      <label className="iw-same-checkbox-label">
                        <input
                          type="checkbox"
                          className="iw-same-checkbox"
                          checked={
                            accomForDay(activeDay).hotelName !== "" &&
                            accomForDay(activeDay).hotelName === accomForDay(activeDay - 1).hotelName
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const prev = accomForDay(activeDay - 1);
                              setAccommodations(a => ({ ...a, [activeDay]: { ...accomForDay(activeDay), hotelName: prev.hotelName } }));
                            } else {
                              setAccommodations(a => ({ ...a, [activeDay]: { ...accomForDay(activeDay), hotelName: "" } }));
                            }
                            if (attempted) setFieldErrors(p => { const n = {...p}; delete n[`day_${activeDay}_hotel`]; return n; });
                          }}
                        />
                        <span>Same as above</span>
                      </label>
                    )}
                    <input
                      className={`iw-input ${attempted && fieldErrors[`day_${activeDay}_hotel`] ? "iw-input--error" : ""}`}
                      placeholder="e.g. APA Hotel Shinjuku"
                      value={accomForDay(activeDay).hotelName}
                      onChange={(e) => { setAccom(activeDay, "hotelName", e.target.value); if (attempted) setFieldErrors(p => { const n = {...p}; delete n[`day_${activeDay}_hotel`]; return n; }); }}
                    />
                  </div>
                  <div className="iw-hotel-field">
                    <label className="iw-label">
                      Contact / Phone
                      {attempted && fieldErrors[`day_${activeDay}_contact`] && (
                        <span className="iw-field-err">{fieldErrors[`day_${activeDay}_contact`]}</span>
                      )}
                    </label>
                    {activeDay > 1 && (
                      <label className="iw-same-checkbox-label">
                        <input
                          type="checkbox"
                          className="iw-same-checkbox"
                          checked={
                            accomForDay(activeDay).hotelContact !== "" &&
                            accomForDay(activeDay).hotelContact === accomForDay(activeDay - 1).hotelContact
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const prev = accomForDay(activeDay - 1);
                              setAccommodations(a => ({ ...a, [activeDay]: { ...accomForDay(activeDay), hotelContact: prev.hotelContact } }));
                            } else {
                              setAccommodations(a => ({ ...a, [activeDay]: { ...accomForDay(activeDay), hotelContact: "" } }));
                            }
                            if (attempted) setFieldErrors(p => { const n = {...p}; delete n[`day_${activeDay}_contact`]; return n; });
                          }}
                        />
                        <span>Same as above</span>
                      </label>
                    )}
                    <input
                      className={`iw-input ${attempted && fieldErrors[`day_${activeDay}_contact`] ? "iw-input--error" : ""}`}
                      placeholder="e.g. +81 3 1234 5678"
                      value={accomForDay(activeDay).hotelContact}
                      onChange={(e) => { setAccom(activeDay, "hotelContact", e.target.value); if (attempted) setFieldErrors(p => { const n = {...p}; delete n[`day_${activeDay}_contact`]; return n; }); }}
                    />
                  </div>
                </div>

                {/* Activities */}
                <div className="iw-activity-section">
                  <p className="iw-activity-label">Activities</p>
                  <div className="iw-activity-list">
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
                        const placeName = isCustom ? item.customName! : cities[item.city]?.places.find((p) => p.id === item.placeId)?.name;
                        const placeType = isCustom ? "Custom" : cities[item.city]?.places.find((p) => p.id === item.placeId)?.type;
                        if (!placeName) return null;
                        return (
                          <div key={item.placeId} className="iw-activity-item">
                            <span className="iw-activity-num">{idx + 1}</span>
                            <div className="iw-activity-info">
                              <span className="iw-activity-name">{placeName}</span>
                              <span className="iw-activity-type" style={{ color: isCustom ? "#7c6f9f" : (typeColors[placeType ?? ""] || "#888") }}>{placeType}</span>
                            </div>
                            <div className="iw-activity-actions">
                              <button className="iw-icon-btn" onClick={() => moveUp(item.placeId)} disabled={idx === 0} title="Move up">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                              </button>
                              <button className="iw-icon-btn" onClick={() => moveDown(item.placeId)} disabled={idx === dayItems.length - 1} title="Move down">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                              </button>
                              <button className="iw-icon-btn iw-icon-btn--remove" onClick={() => removePlace(item.placeId, activeDay)} title="Remove">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Custom activity */}
                <div className="iw-custom-activity-row">
                  <input className="iw-input iw-custom-activity-input" placeholder="Add your own activity…"
                    value={customActivityInput} onChange={(e) => setCustomActivityInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addCustomActivity(customActivityInput); }} />
                  <button className="iw-custom-activity-btn" onClick={() => addCustomActivity(customActivityInput)} disabled={!customActivityInput.trim()}>
                    + Add
                  </button>
                </div>

                {/* Preview button */}
                <div className="iw-save-row">
                  <p className="iw-save-hint">
                    Complete all days, then preview your itinerary before downloading.
                  </p>
                  <button className="iw-save-btn" onClick={handlePreview}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                    Preview Itinerary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────── PREVIEW SCREEN ─────────────── */}
      {mode === "preview" && (
        <div className="iw-builder" onClick={(e) => e.stopPropagation()}>

          {/* Topbar */}
          <div className="iw-topbar">
            <button className="iw-back" onClick={() => setMode("helper")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Builder
            </button>
            <div className="iw-topbar-center">
              <span className="iw-topbar-title">Itinerary Preview</span>
              <span className="iw-topbar-sub">Click any field to edit inline</span>
            </div>
            <div className="iw-topbar-stats">
              <span className="iw-stat"><strong>{totalActivities}</strong> activities</span>
              <span className="iw-stat"><strong>{days}</strong> days</span>
            </div>
          </div>

          {/* Preview body */}
          <div className="iw-preview-body">

            {/* Info strip */}
            <div className="iw-preview-info-strip">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>
                <strong>Click any field to edit it directly</strong> — title, applicant info, dates, activities, hotel names and contacts are all editable right here before downloading.
              </span>
            </div>

            {/* White-paper preview sheet */}
            <div className="iw-letter-sheet">

              {/* Editable document heading */}
              <input
                className="iw-preview-heading-input"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                onFocus={() => setEditingCell("title")}
                onBlur={() => setEditingCell(null)}
                title="Click to edit document title"
              />

              {/* Editable meta block */}
              <div className="iw-letter-meta">
                <div className="iw-preview-meta-row">
                  <span className="iw-preview-meta-label">Applicant:</span>
                  <input
                    className="iw-preview-meta-input"
                    value={editableApplicant}
                    placeholder="Applicant name"
                    onChange={(e) => setEditableApplicant(e.target.value)}
                    onFocus={() => setEditingCell("applicant")}
                    onBlur={() => setEditingCell(null)}
                    title="Click to edit applicant name"
                  />
                  <span className="iw-preview-meta-sep">·</span>
                  <span className="iw-preview-meta-label">Passport:</span>
                  <input
                    className="iw-preview-meta-input iw-preview-meta-input--sm"
                    value={editablePassport}
                    placeholder="Passport no."
                    onChange={(e) => setEditablePassport(e.target.value)}
                    onFocus={() => setEditingCell("passport")}
                    onBlur={() => setEditingCell(null)}
                    title="Click to edit passport number"
                  />
                </div>
                <div className="iw-preview-meta-row" style={{ marginTop: 4 }}>
                  <span className="iw-preview-meta-label">Travel Dates:</span>
                  <input
                    className="iw-preview-meta-input"
                    value={editableDateRange}
                    placeholder="e.g. 1 June 2025 – 10 June 2025"
                    onChange={(e) => setEditableDateRange(e.target.value)}
                    onFocus={() => setEditingCell("dates")}
                    onBlur={() => setEditingCell(null)}
                    title="Click to edit travel dates"
                    style={{ minWidth: 220 }}
                  />
                </div>
                {isSponsored && (
                  <div className="iw-preview-meta-row" style={{ marginTop: 4 }}>
                    <span className="iw-preview-meta-label">Sponsor:</span>
                    <input
                      className="iw-preview-meta-input"
                      value={editableSponsor}
                      placeholder="Name (Passport No: XXXXXXX)"
                      onChange={(e) => setEditableSponsor(e.target.value)}
                      onFocus={() => setEditingCell("sponsor")}
                      onBlur={() => setEditingCell(null)}
                      title="Click to edit sponsor details"
                      style={{ minWidth: 280 }}
                    />
                  </div>
                )}
                <p className="iw-letter-meta-line iw-letter-meta-intro">
                  The travel itinerary of the visa applicant(s) is as follows:
                </p>
              </div>

              {/* Itinerary table — fully editable */}
              <div className="iw-preview-table-wrap">
                <table className="iw-preview-table">
                  <thead>
                    <tr>
                      <th className="iw-preview-th iw-col-date">Date</th>
                      <th className="iw-preview-th iw-col-activity">Activity Plan</th>
                      <th className="iw-preview-th iw-col-contact">Contact</th>
                      <th className="iw-preview-th iw-col-accom">Accommodation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableRows.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "" : "iw-preview-row-alt"}>

                        {/* Date cell */}
                        <td className="iw-preview-td iw-preview-td--edit">
                          <input
                            className="iw-cell-input"
                            value={row.date}
                            onChange={(e) => updateEditableRow(idx, "date", e.target.value)}
                            onFocus={() => setEditingCell(`date-${idx}`)}
                            onBlur={() => setEditingCell(null)}
                            title="Click to edit date"
                          />
                        </td>

                        {/* Activities cell */}
                        <td className="iw-preview-td iw-preview-td--edit">
                          {row.activities.length > 0 ? (
                            <ul className="iw-preview-activities iw-preview-activities--edit">
                              {row.activities.map((act, ai) => (
                                <li key={ai} className="iw-activity-edit-row">
                                  <input
                                    className="iw-cell-input iw-cell-input--activity"
                                    value={act}
                                    onChange={(e) => updateActivity(idx, ai, e.target.value)}
                                    onFocus={() => setEditingCell(`act-${idx}-${ai}`)}
                                    onBlur={() => setEditingCell(null)}
                                    title="Click to edit activity"
                                  />
                                  <button
                                    className="iw-cell-remove-btn"
                                    onClick={() => removeActivityFromRow(idx, ai)}
                                    title="Remove activity"
                                  >
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="iw-preview-empty-cell">—</span>
                          )}
                          <button
                            className="iw-cell-add-btn"
                            onClick={() => addActivityToRow(idx)}
                            title="Add activity to this day"
                          >
                            + Add activity
                          </button>
                        </td>

                        {/* Contact cell */}
                        <td className="iw-preview-td iw-preview-td--edit">
                          {row.contactSameAsAbove ? (
                            <div className="iw-same-toggle-wrap">
                              <span className="iw-preview-same">Same as above</span>
                              <button className="iw-same-override-btn" onClick={() => updateEditableRow(idx, "contactSameAsAbove", false)} title="Override with custom value">Edit</button>
                            </div>
                          ) : (
                            <input
                              className="iw-cell-input"
                              value={row.contact || ""}
                              placeholder="e.g. +81 3 1234 5678"
                              onChange={(e) => updateEditableRow(idx, "contact", e.target.value)}
                              onFocus={() => setEditingCell(`contact-${idx}`)}
                              onBlur={() => setEditingCell(null)}
                              title="Click to edit contact"
                            />
                          )}
                        </td>

                        {/* Accommodation cell */}
                        <td className="iw-preview-td iw-preview-td--edit">
                          {row.accommodationSameAsAbove ? (
                            <div className="iw-same-toggle-wrap">
                              <span className="iw-preview-same">Same as above</span>
                              <button className="iw-same-override-btn" onClick={() => updateEditableRow(idx, "accommodationSameAsAbove", false)} title="Override with custom value">Edit</button>
                            </div>
                          ) : (
                            <input
                              className="iw-cell-input"
                              value={row.accommodation || ""}
                              placeholder="e.g. APA Hotel Shinjuku"
                              onChange={(e) => updateEditableRow(idx, "accommodation", e.target.value)}
                              onFocus={() => setEditingCell(`accom-${idx}`)}
                              onBlur={() => setEditingCell(null)}
                              title="Click to edit accommodation"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Download row */}
            <div className="iw-dl-row">
              <p className="iw-save-hint">
                {docxGenerated
                  ? "✓ Itinerary downloaded. It will be included with your document pack."
                  : "All edits above are saved automatically. Download when ready."}
              </p>
              <button className="iw-save-btn" onClick={handleDownloadDocx} disabled={downloading}>
                {downloading ? (
                  <><span className="iw-spinner" /> Generating…</>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {docxGenerated ? "Download Again" : "Download .docx"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   STYLES
   All existing builder/select styles preserved verbatim.
   New preview-specific classes added at the bottom.
════════════════════════════════════════════════════════════════ */
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
    font-family: var(--iw-ff-body); font-weight: 400;
    background: transparent; padding: 28px 20px;
    min-height: 280px; display: flex; align-items: center; justify-content: center;
  }
  .iw-select * { font-weight: inherit; }
  .iw-select-inner { max-width: 560px; width: 100%; }
  .iw-select-eyebrow { margin: 0 0 8px; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--iw-indigo-lt); }
  .iw-select-title { font-size: 22px; font-weight: 600; color: var(--iw-text); margin: 0 0 8px; font-family: var(--iw-ff-body); }
  .iw-select-sub { font-size: 13px; color: var(--iw-muted2); margin: 0 0 24px; line-height: 1.6; }
  .iw-options { display: flex; flex-direction: column; gap: 10px; }
  .iw-opt { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 18px; border-radius: var(--iw-radius); border: 1px solid var(--iw-border); cursor: pointer; text-align: left; width: 100%; transition: border-color 150ms, background 150ms, transform 120ms; background: rgba(255,255,255,0.03); }
  .iw-opt:active { transform: scale(0.99); }
  .iw-opt--light { color: var(--iw-muted2); }
  .iw-opt--light:hover { border-color: var(--iw-border2); background: rgba(255,255,255,0.05); }
  .iw-opt--dark { background: var(--iw-indigo-glow); border-color: rgba(99,102,241,0.35); color: var(--iw-text); }
  .iw-opt--dark:hover { background: rgba(99,102,241,0.22); border-color: rgba(99,102,241,0.55); box-shadow: 0 4px 24px rgba(99,102,241,0.15); }
  .iw-opt-left { display: flex; align-items: center; gap: 14px; flex: 1; }
  .iw-opt-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .iw-opt-icon--light { background: rgba(255,255,255,0.06); color: var(--iw-muted2); border: 1px solid var(--iw-border); }
  .iw-opt-icon--dark { background: rgba(99,102,241,0.2); color: var(--iw-indigo-lt); border: 1px solid rgba(99,102,241,0.3); }
  .iw-opt-text { display: flex; flex-direction: column; gap: 3px; }
  .iw-opt-title { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; line-height: 1; color: var(--iw-text); }
  .iw-opt-badge { font-size: 9px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: 3px 8px; border-radius: 99px; background: rgba(99,102,241,0.2); color: var(--iw-indigo-lt); border: 1px solid rgba(99,102,241,0.35); }
  .iw-opt-desc { font-size: 12px; color: var(--iw-muted2); line-height: 1.5; }
  .iw-opt-arrow { flex-shrink: 0; color: var(--iw-muted); }
  .iw-opt--dark .iw-opt-arrow { color: var(--iw-indigo-lt); }

  /* ─── Builder / Preview shared shell ─── */
  .iw-builder { font-family: var(--iw-ff-body); background: transparent; display: flex; flex-direction: column; font-weight: 400; overflow: visible; }
  .iw-builder * { font-weight: inherit; }
  .iw-builder b, .iw-builder strong { font-weight: 600; }

  /* Topbar */
  .iw-topbar { display: flex; align-items: center; gap: 16px; background: var(--iw-surface); border: 1px solid var(--iw-border); border-radius: 10px 10px 0 0; color: var(--iw-text); padding: 12px 16px; }
  .iw-back { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.06); border: 1px solid var(--iw-border); color: var(--iw-muted2); border-radius: 8px; padding: 7px 12px; font-size: 12px; font-weight: 500; cursor: pointer; font-family: var(--iw-ff-body); flex-shrink: 0; transition: background 120ms, color 120ms, border-color 120ms; }
  .iw-back:hover { background: rgba(255,255,255,0.1); border-color: var(--iw-border2); color: var(--iw-text); }
  .iw-topbar-center { flex: 1; display: flex; flex-direction: column; }
  .iw-topbar-title { font-size: 13px; font-weight: 600; line-height: 1; color: var(--iw-text); }
  .iw-topbar-sub { font-size: 10px; color: var(--iw-muted); margin-top: 3px; letter-spacing: .05em; text-transform: uppercase; }
  .iw-topbar-stats { display: flex; gap: 12px; flex-shrink: 0; }
  .iw-stat { font-size: 11px; color: var(--iw-muted); background: rgba(255,255,255,0.04); border: 1px solid var(--iw-border); border-radius: 7px; padding: 4px 10px; }
  .iw-stat strong { font-weight: 600; color: var(--iw-indigo-lt); }

  /* Error strips */
  .iw-error-strip { display: flex; gap: 16px; align-items: center; padding: 8px 16px; background: var(--iw-error-bg); border-bottom: 1px solid rgba(248,113,113,0.2); font-size: 12px; color: var(--iw-error); font-weight: 500; }
  .iw-field-err { margin-left: 8px; font-size: 11px; font-weight: 500; color: var(--iw-error); font-style: normal; }
  .iw-input--error { border-color: rgba(248,113,113,0.5) !important; background: rgba(248,113,113,0.06) !important; }
  .iw-input--error:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.12) !important; }
  .iw-day-tab--error { border-color: rgba(248,113,113,0.4) !important; color: var(--iw-error) !important; }
  .iw-tab-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--iw-error); margin-right: 4px; vertical-align: middle; flex-shrink: 0; }
  .iw-day-tab--error.iw-day-tab--active { background: rgba(248,113,113,0.15) !important; border-color: rgba(248,113,113,0.5) !important; color: var(--iw-error) !important; }

  /* Builder body */
  .iw-body { display: grid; grid-template-columns: 268px 1fr; gap: 12px; padding: 12px; background: var(--iw-surface); border: 1px solid var(--iw-border); border-top: none; align-items: start; border-radius: 0 0 10px 10px; }
  .iw-left { background: var(--iw-surface2); border-radius: var(--iw-radius); border: 1px solid var(--iw-border); display: flex; flex-direction: column; overflow: hidden; }
  .iw-left-head { padding: 12px 12px 10px; border-bottom: 1px solid var(--iw-border); display: flex; flex-direction: column; gap: 8px; }
  .iw-panel-title { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--iw-indigo-lt); margin: 0; }
  .iw-city-select-wrap { position: relative; }
  .iw-city-select { width: 100%; border: 1px solid var(--iw-border); border-radius: 7px; padding: 7px 10px; font-size: 12px; font-family: var(--iw-ff-body); color: var(--iw-text); background: var(--iw-surface); appearance: none; cursor: pointer; outline: none; transition: border-color 150ms; }
  .iw-city-select:focus { border-color: var(--iw-indigo); box-shadow: 0 0 0 3px var(--iw-indigo-glow); }
  .iw-search-wrap { position: relative; padding: 8px 10px; border-bottom: 1px solid var(--iw-border); }
  .iw-search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--iw-muted); pointer-events: none; }
  .iw-search { width: 100%; box-sizing: border-box; border: 1px solid var(--iw-border); border-radius: 7px; padding: 7px 10px 7px 30px; font-size: 12px; font-family: var(--iw-ff-body); color: var(--iw-text); outline: none; background: var(--iw-surface); transition: border-color 150ms; }
  .iw-search::placeholder { color: var(--iw-muted); }
  .iw-search:focus { border-color: var(--iw-indigo); box-shadow: 0 0 0 3px var(--iw-indigo-glow); }
  .iw-places { flex: 1; overflow-y: auto; padding: 6px; display: flex; flex-direction: column; gap: 3px; scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.35) transparent; }
  .iw-places::-webkit-scrollbar { width: 4px; }
  .iw-places::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.35); border-radius: 2px; }
  .iw-no-results { font-size: 12px; color: var(--iw-muted); text-align: center; padding: 16px; margin: 0; }
  .iw-place { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; border-radius: 8px; border: 1px solid transparent; background: transparent; cursor: pointer; text-align: left; font-family: var(--iw-ff-body); transition: background 100ms, border-color 100ms; width: 100%; }
  .iw-place:hover:not(:disabled) { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.25); }
  .iw-place--added { opacity: .4; cursor: default; }
  .iw-place-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .iw-place-name { font-size: 11px; font-weight: 400; color: var(--iw-text); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .iw-place-type { font-size: 10px; font-weight: 400; }
  .iw-place-action { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.06); color: var(--iw-muted); flex-shrink: 0; border: 1px solid var(--iw-border); }
  .iw-place:not(.iw-place--added):hover .iw-place-action { background: var(--iw-indigo); color: white; border-color: var(--iw-indigo); }

  /* Right panel */
  .iw-right { display: flex; flex-direction: column; gap: 10px; scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.35) transparent; }
  .iw-config-row { background: var(--iw-surface2); border: 1px solid var(--iw-border); border-radius: var(--iw-radius); padding: 12px 14px; display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
  .iw-config-field { flex: 1; min-width: 150px; display: flex; flex-direction: column; gap: 5px; }
  .iw-config-field--sm { flex: 0 0 110px; min-width: auto; }
  .iw-label { font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--iw-indigo-lt); }
  .iw-input { border: 1px solid var(--iw-border); border-radius: 7px; padding: 7px 10px; font-size: 12px; font-family: var(--iw-ff-body); color: var(--iw-text); background: var(--iw-surface); outline: none; width: 100%; box-sizing: border-box; transition: border-color 150ms, box-shadow 150ms; }
  .iw-input::placeholder { color: var(--iw-muted); }
  .iw-input:focus { border-color: var(--iw-indigo); box-shadow: 0 0 0 3px var(--iw-indigo-glow); }
  .iw-input--date { color-scheme: dark; cursor: pointer; }
  .iw-input--date::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) saturate(2) hue-rotate(200deg); cursor: pointer; opacity: 0.8; }
  .iw-input--date::-webkit-calendar-picker-indicator:hover { opacity: 1; }
  .iw-input[type="number"]::-webkit-outer-spin-button,
  .iw-input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .iw-input[type="number"] { -moz-appearance: textfield; }

  /* Day tabs */
  .iw-day-tabs { display: flex; gap: 5px; flex-wrap: wrap; }
  .iw-day-tab { border: 1px solid var(--iw-border); background: var(--iw-surface2); border-radius: 8px; padding: 6px 11px; cursor: pointer; font-size: 11px; font-family: var(--iw-ff-body); color: var(--iw-muted2); font-weight: 500; display: flex; flex-direction: column; align-items: center; gap: 1px; transition: all 100ms; line-height: 1; }
  .iw-day-tab-num { font-size: 11px; font-weight: 600; }
  .iw-day-tab-date { font-size: 9px; opacity: .7; }
  .iw-day-tab:hover:not(.iw-day-tab--active) { border-color: var(--iw-border2); color: var(--iw-text); background: rgba(255,255,255,0.05); }
  .iw-day-tab--active { background: var(--iw-indigo-glow); border-color: rgba(99,102,241,0.45); color: var(--iw-indigo-lt); }

  /* Day panel */
  .iw-day-panel { background: var(--iw-surface2); border: 1px solid var(--iw-border); border-radius: var(--iw-radius); padding: 16px; display: flex; flex-direction: column; gap: 14px; }
  .iw-day-header { display: flex; align-items: flex-end; justify-content: space-between; }
  .iw-day-label { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--iw-indigo-lt); margin: 0 0 3px; }
  .iw-day-date { font-size: 18px; font-weight: 600; color: var(--iw-text); margin: 0; font-family: var(--iw-ff-body); }
  .iw-day-count { font-size: 11px; color: var(--iw-muted2); background: rgba(255,255,255,0.05); border: 1px solid var(--iw-border); border-radius: 99px; padding: 4px 10px; font-weight: 500; }
  .iw-same-btn { background: transparent; border: 1px dashed var(--iw-border); border-radius: 6px; padding: 4px 10px; font-size: 11px; font-family: var(--iw-ff-body); color: var(--iw-muted); cursor: pointer; transition: all 100ms; white-space: nowrap; }
  .iw-same-btn:hover { border-color: rgba(99,102,241,0.4); color: var(--iw-indigo-lt); background: var(--iw-indigo-glow); }
  .iw-hotel-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .iw-hotel-field { display: flex; flex-direction: column; gap: 5px; }
  .iw-activity-section { display: flex; flex-direction: column; gap: 8px; }
  .iw-activity-label { font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--iw-indigo-lt); margin: 0; }
  .iw-activity-list { display: flex; flex-direction: column; gap: 5px; }
  .iw-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 90px; border: 1.5px dashed var(--iw-border); border-radius: 9px; font-size: 12px; color: var(--iw-muted); text-align: center; padding: 16px; }
  .iw-activity-item { display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,0.03); border: 1px solid var(--iw-border); border-radius: 8px; padding: 8px 10px; transition: border-color 100ms; }
  .iw-activity-item:hover { border-color: var(--iw-border2); }
  .iw-activity-num { width: 20px; height: 20px; border-radius: 50%; background: var(--iw-indigo); color: white; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .iw-activity-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .iw-activity-name { font-size: 11px; font-weight: 400; color: var(--iw-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .iw-activity-type { font-size: 10px; font-weight: 400; }
  .iw-activity-actions { display: flex; gap: 2px; flex-shrink: 0; }
  .iw-icon-btn { width: 24px; height: 24px; border: 1px solid var(--iw-border); background: rgba(255,255,255,0.04); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--iw-muted); transition: all 100ms; }
  .iw-icon-btn:hover:not(:disabled) { border-color: var(--iw-border2); color: var(--iw-text); background: rgba(255,255,255,0.09); }
  .iw-icon-btn:disabled { opacity: .25; cursor: default; }
  .iw-icon-btn--remove:hover:not(:disabled) { border-color: rgba(248,113,113,0.4); color: var(--iw-error); background: var(--iw-error-bg); }
  .iw-custom-activity-row { display: flex; gap: 8px; align-items: center; }
  .iw-custom-activity-input { flex: 1; }
  .iw-custom-activity-btn { background: rgba(255,255,255,0.06); border: 1px solid var(--iw-border); border-radius: 7px; padding: 7px 14px; font-size: 12px; font-weight: 600; font-family: var(--iw-ff-body); color: var(--iw-muted2); cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 100ms; }
  .iw-custom-activity-btn:hover:not(:disabled) { background: var(--iw-indigo-glow); border-color: rgba(99,102,241,0.35); color: var(--iw-indigo-lt); }
  .iw-custom-activity-btn:disabled { opacity: .35; cursor: default; }

  .iw-same-checkbox-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: var(--iw-muted2); cursor: pointer;
    font-family: var(--iw-ff-body); user-select: none;
    margin-bottom: 4px;
  }
  .iw-same-checkbox-label span { line-height: 1; }
  .iw-same-checkbox {
    width: 14px; height: 14px; cursor: pointer;
    accent-color: var(--iw-indigo);
    flex-shrink: 0;
  }

  /* Save row */
  .iw-save-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 12px; border-top: 1px solid var(--iw-border); }
  .iw-save-hint { font-size: 12px; color: var(--iw-muted); margin: 0; line-height: 1.5; flex: 1; }
  .iw-save-btn { background: linear-gradient(135deg, #6366f1, #818cf8); color: white; border: none; border-radius: 8px; padding: 9px 20px; font-size: 12px; font-weight: 600; font-family: var(--iw-ff-body); cursor: pointer; flex-shrink: 0; transition: opacity 150ms, box-shadow 150ms; white-space: nowrap; box-shadow: 0 2px 12px rgba(99,102,241,0.3); display: flex; align-items: center; gap: 7px; }
  .iw-save-btn:hover:not(:disabled) { opacity: 0.88; box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
  .iw-save-btn:disabled { opacity: 0.5; cursor: default; }

  /* Spinner */
  .iw-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: iw-spin 0.7s linear infinite; display: inline-block; }
  @keyframes iw-spin { to { transform: rotate(360deg); } }

  /* ─── Preview screen ─── */
  .iw-preview-body {
    background: var(--iw-surface);
    border: 1px solid var(--iw-border);
    border-top: none;
    border-radius: 0 0 10px 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Info strip */
  .iw-preview-info-strip {
    display: flex; align-items: flex-start; gap: 10px;
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.22);
    border-radius: 8px; padding: 11px 14px;
    font-size: 12px; color: var(--iw-muted2); line-height: 1.55;
  }
  .iw-preview-info-strip strong { color: var(--iw-indigo-lt); }
  .iw-preview-info-strip svg { color: var(--iw-indigo-lt); }

  /* White-paper sheet */
  .iw-letter-sheet {
    background: #fff;
    border-radius: 8px;
    padding: 36px 40px;
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 2px 20px rgba(0,0,0,0.28);
    display: flex;
    flex-direction: column;
    gap: 0;
    font-family: 'Times New Roman', Times, Georgia, serif;
    color: #1a1a1a;
    /* A4 proportions — max 794px wide (96dpi A4 width) */
    max-width: 794px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  .iw-letter-heading {
    font-size: 22px; font-weight: 700; text-align: center;
    letter-spacing: .06em;
    margin: 0 0 18px; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
  }

  .iw-letter-meta { margin-bottom: 16px; }
  .iw-letter-meta-line {
    font-size: 13px; line-height: 1.8; color: #1a1a1a; margin: 0 0 3px;
    font-family: 'Times New Roman', Times, serif;
  }
  .iw-letter-meta-intro { margin-top: 10px; font-style: italic; }

  /* Table wrapper: horizontal scroll on small screens */
  .iw-preview-table-wrap {
    overflow-x: auto;
    margin-bottom: 0;
    width: 100%;
  }

  .iw-preview-table {
    width: 100%; border-collapse: collapse;
    font-family: 'Times New Roman', Times, serif;
    font-size: 12px;
    table-layout: fixed;
  }

  .iw-preview-th {
    background: #1a1a35; color: #fff;
    border: 1px solid #444; padding: 10px 14px;
    font-size: 12px; font-weight: 700; text-align: left;
    font-family: 'Times New Roman', Times, serif;
    white-space: nowrap;
    vertical-align: middle;
  }

  /* Column proportions matching docx: 14 | 37 | 20 | 29 */
  .iw-col-date     { width: 14%; }
  .iw-col-activity { width: 37%; }
  .iw-col-contact  { width: 20%; }
  .iw-col-accom    { width: 29%; }

  .iw-preview-td {
    border: 1px solid #ccc;
    padding: 10px 14px;
    vertical-align: middle;
    text-align: left;
    line-height: 1.7;
    color: #1a1a1a;
  }

  .iw-preview-row-alt .iw-preview-td {
    background: #f7f7fb;
  }

  .iw-preview-activities {
    margin: 0; padding: 0 0 0 16px;
    list-style: disc;
    color: #1a1a1a;
  }
  .iw-preview-activities li { margin-bottom: 2px; }

  .iw-preview-same {
    color: #1a1a1a;
    font-style: normal;
    font-size: 12px;
    font-family: 'Times New Roman', Times, serif;
  }

  .iw-preview-empty-cell { color: #bbb; }

  /* Download row */
  .iw-dl-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding-top: 12px; border-top: 1px solid var(--iw-border);
  }

  /* ─── Responsive ─── */
  @media (max-width: 860px) {
    .iw-body { grid-template-columns: 1fr; }
    .iw-left { max-height: 300px; }
    .iw-hotel-row { grid-template-columns: 1fr; }
    .iw-topbar-stats { display: none; }
    .iw-letter-sheet { padding: 24px 16px; }
  }
  @media (max-width: 480px) {
    .iw-config-field--sm { flex: 1; min-width: 100px; }
    .iw-day-tab { padding: 5px 8px; font-size: 10px; }
    .iw-dl-row { flex-direction: column; align-items: flex-start; }
  }

  /* ─── Inline-editable preview ─── */

  /* Editable heading replaces <h2> */
  .iw-preview-heading-input {
    font-size: 22px; font-weight: 700; text-align: center;
    letter-spacing: .06em; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    width: 100%; border: none; outline: none;
    background: transparent; margin: 0 0 18px;
    padding: 4px 6px; border-radius: 4px;
    transition: background 120ms, box-shadow 120ms;
    box-sizing: border-box;
  }
  .iw-preview-heading-input:hover { background: rgba(99,102,241,0.06); }
  .iw-preview-heading-input:focus { background: rgba(99,102,241,0.1); box-shadow: 0 0 0 2px rgba(99,102,241,0.35); }

  /* Meta row (applicant / passport / dates) */
  .iw-preview-meta-row {
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    margin-bottom: 4px;
  }
  .iw-preview-meta-label {
    font-size: 13px; font-weight: 700; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif; white-space: nowrap;
  }
  .iw-preview-meta-sep { color: #999; font-size: 13px; }
  .iw-preview-meta-input {
    font-size: 13px; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent;
    border-bottom: 1.5px dashed #bbb;
    padding: 2px 4px; min-width: 120px;
    transition: border-color 120ms, background 120ms;
    border-radius: 3px 3px 0 0;
  }
  .iw-preview-meta-input--sm { min-width: 90px; }
  .iw-preview-meta-input:hover { border-bottom-color: #6366f1; background: rgba(99,102,241,0.04); }
  .iw-preview-meta-input:focus { border-bottom-color: #6366f1; background: rgba(99,102,241,0.08); box-shadow: none; }
  .iw-preview-meta-input::placeholder { color: #bbb; font-style: italic; }

  /* Editable table cells */
  .iw-preview-td--edit { padding: 8px 10px !important; vertical-align: middle !important; text-align: left !important; }

  .iw-cell-input {
    width: 100%; border: none; outline: none; background: transparent;
    font-family: 'Times New Roman', Times, serif; font-size: 12px;
    color: #1a1a1a; padding: 3px 5px; border-radius: 4px;
    transition: background 100ms, box-shadow 100ms;
    box-sizing: border-box;
  }
  .iw-cell-input:hover { background: rgba(99,102,241,0.06); }
  .iw-cell-input:focus { background: rgba(99,102,241,0.1); box-shadow: 0 0 0 2px rgba(99,102,241,0.3); }
  .iw-cell-input::placeholder { color: #bbb; font-style: italic; }

  /* Activity list editable */
  .iw-preview-activities--edit { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 3px; }
  .iw-activity-edit-row { display: flex; align-items: center; gap: 4px; }
  .iw-activity-edit-row::before { content: "•"; color: #1a1a1a; font-size: 12px; flex-shrink: 0; padding-left: 2px; }
  .iw-cell-input--activity { flex: 1; min-width: 0; }

  .iw-cell-remove-btn {
    width: 18px; height: 18px; border-radius: 50%; border: 1px solid #e0e0e0;
    background: #f5f5f5; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #999; flex-shrink: 0; transition: all 100ms; padding: 0;
  }
  .iw-cell-remove-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }

  .iw-cell-add-btn {
    margin-top: 5px; font-size: 10px; font-weight: 600; color: #6366f1;
    background: rgba(99,102,241,0.07); border: 1px dashed rgba(99,102,241,0.35);
    border-radius: 4px; padding: 3px 8px; cursor: pointer;
    font-family: 'Times New Roman', Times, serif;
    transition: background 100ms, border-color 100ms;
    display: block; width: 100%; text-align: left;
  }
  .iw-cell-add-btn:hover { background: rgba(99,102,241,0.14); border-color: rgba(99,102,241,0.6); }

  /* "Same as above" toggle */
  .iw-same-toggle-wrap { display: flex; align-items: center; gap: 8px; }
  .iw-same-override-btn {
    font-size: 10px; font-weight: 600; color: #6366f1; background: transparent;
    border: 1px solid rgba(99,102,241,0.35); border-radius: 4px; padding: 2px 7px;
    cursor: pointer; font-family: 'Times New Roman', Times, serif;
    transition: background 100ms;
  }
  .iw-same-override-btn:hover { background: rgba(99,102,241,0.1); }
`;