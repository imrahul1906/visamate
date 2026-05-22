import { useState, useEffect, useMemo } from "react";
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
} from "./itineraryService";
import type { ItineraryItem, AccommodationMap } from "./itineraryService";
import {
  buildItineraryRows,
  buildItineraryDocxBlob,
  downloadDocxBlob,
} from "./itineraryDocxService";
import type { ItineraryRowData } from "./itineraryDocxService";
import { validators } from "@/lib/utils/validators";

export function useItineraryState({
  countryName,
  cities,
  onDocxReady,
}: {
  countryName: string;
  cities: ItineraryCityMap;
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
  const [customActivityInput, setCustomActivityInput] = useState("");

  /* ── Context-backed fields ── */
  const [applicantName, setApplicantName] = useState<string>(ctx.applicantName ?? "");
  const [passportNo, setPassportNo] = useState<string>(ctx.passportNo ?? "");
  const [startDate, setStartDate] = useState<string>(ctx.travelStartDate ?? "");
  const [days, setDaysLocal] = useState<number>(ctx.travelDuration || 5);
  const [daysInput, setDaysInput] = useState<string>(
    ctx.travelDuration ? String(ctx.travelDuration) : "5"
  );

  const setDays = (v: number) => {
    setDaysLocal(v);
    update({ travelDuration: v });
  };

  /* ── Itinerary & accommodation state ── */
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationMap>({});

  /* ── Validation ── */
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passportError, setPassportError] = useState<string | null>(null);
  const [phoneErrors, setPhoneErrors] = useState<Record<number, string | null>>({});

  const setPhoneError = (day: number, err: string | null) =>
    setPhoneErrors((p) => ({ ...p, [day]: err }));

  /* ── Sync unique city names → context ── */
  useEffect(() => {
    update({ cities: getUniqueCityNames(itinerary, cities) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary]);

  /* ── Derived ── */
  const filteredPlaces = useMemo(() => {
    const cityPlaces = cities[selectedCity]?.places ?? [];
    return cityPlaces.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cities, selectedCity, searchQuery]);

  const allDaysList = useMemo(() => {
    return Array.from({ length: days }, (_, i) => i + 1);
  }, [days]);

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

  const dateForDayLocal = (d: number) => dateForDay(startDate, d);
  const dayItems = itinerary
    .filter((x) => x.day === activeDay)
    .sort((a, b) => a.order - b.order);
  const totalActivities = itinerary.length;

  /* ── Preview rows (derived, memoised) ── */
  const previewRows: ItineraryRowData[] = useMemo(
    () =>
      buildItineraryRows(
        allDaysList,
        itinerary,
        accommodations,
        cities,
        startDate
      ),
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
  const [prevMode, setPrevMode] = useState(mode);

  const isSponsored = ctx.sponsorshipType === "sponsored";

  const updateEditableRow = (
    idx: number,
    field: keyof ItineraryRowData,
    value: string | string[] | boolean
  ) => {
    setEditableRows((rows) =>
      rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );
  };

  const updateActivity = (rowIdx: number, actIdx: number, value: string) => {
    setEditableRows((rows) =>
      rows.map((r, i) => {
        if (i !== rowIdx) return r;
        const acts = [...r.activities];
        acts[actIdx] = value;
        return { ...r, activities: acts };
      })
    );
  };

  const addActivityToRow = (rowIdx: number) => {
    setEditableRows((rows) =>
      rows.map((r, i) =>
        i === rowIdx ? { ...r, activities: [...r.activities, ""] } : r
      )
    );
  };

  const removeActivityFromRow = (rowIdx: number, actIdx: number) => {
    setEditableRows((rows) =>
      rows.map((r, i) =>
        i === rowIdx
          ? {
              ...r,
              activities: r.activities.filter((_, ai) => ai !== actIdx),
            }
          : r
      )
    );
  };

  /* ── Actions ── */
  const addPlace = (placeId: string) => {
    const updated = addPlaceFn(itinerary, activeDay, selectedCity, placeId);
    if (updated === itinerary) return;
    setItinerary(updated);
  };

  const addCustomActivity = (name: string) => {
    const [updated] = addCustomActivityFn(itinerary, activeDay, name);
    if (updated !== itinerary) {
      setItinerary(updated);
      setCustomActivityInput("");
    }
  };

  const removePlace = (placeId: string, day: number) =>
    setItinerary(removePlaceFn(itinerary, placeId, day));

  const moveUp = (placeId: string) =>
    setItinerary(moveUpFn(itinerary, activeDay, placeId));
  const moveDown = (placeId: string) =>
    setItinerary(moveDownFn(itinerary, activeDay, placeId));

  const handleDownloadOfficialPdf = () => downloadOfficialPdf(countryName);

  /* ── Validate and move to preview ── */
  const handlePreview = () => {
    setAttempted(true);
    const errs = validateItinerary(
      itinerary,
      startDate,
      allDaysList,
      accommodations
    );
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
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
      const filename = `${countryName
        .toLowerCase()
        .replace(/\s+/g, "_")}_travel_itinerary.docx`;
      onDocxReady?.(
        new File([blob], filename, {
          type:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        })
      );
      setDocxGenerated(true);
      setMode("helper");
    } catch (e) {
      console.error("DOCX generation error:", e);
    } finally {
      setDownloading(false);
    }
  };

  /* ── Travel date range string for preview header ── */
  const travelDateRange = useMemo(() => {
    if (!startDate) return "";
    const end = new Date(startDate + "T00:00:00");
    end.setDate(end.getDate() + days - 1);
    return `${fmtDateLong(startDate)} – ${end.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  }, [startDate, days]);

  if (prevMode !== mode) {
    setPrevMode(mode);
    if (mode === "preview") {
      setEditableRows(
        previewRows.map((r) => ({ ...r, activities: [...r.activities] }))
      );
      setEditableApplicant(applicantName);
      setEditablePassport(passportNo);
      setEditableDateRange(travelDateRange);
      if (ctx.sponsorshipType) {
        setEditableSponsor(ctx.sponsorName ?? "");
      }
    }
  }

  return {
    ctx,
    update,
    mode,
    setMode,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    activeDay,
    setActiveDay,
    docxGenerated,
    setDocxGenerated,
    downloading,
    setDownloading,
    customActivityInput,
    setCustomActivityInput,
    applicantName,
    setApplicantName,
    passportNo,
    setPassportNo,
    startDate,
    setStartDate,
    days,
    setDays,
    daysInput,
    setDaysInput,
    itinerary,
    setItinerary,
    accommodations,
    setAccommodations,
    fieldErrors,
    setFieldErrors,
    attempted,
    setAttempted,
    nameError,
    setNameError,
    passportError,
    setPassportError,
    phoneErrors,
    setPhoneError,
    filteredPlaces,
    allDaysList,
    accomForDay,
    setAccom,
    dateForDayLocal,
    dayItems,
    totalActivities,
    previewRows,
    editableRows,
    setEditableRows,
    editableTitle,
    setEditableTitle,
    editableApplicant,
    setEditableApplicant,
    editablePassport,
    setEditablePassport,
    editableDateRange,
    setEditableDateRange,
    editableSponsor,
    setEditableSponsor,
    isSponsored,
    updateEditableRow,
    updateActivity,
    addActivityToRow,
    removeActivityFromRow,
    addPlace,
    addCustomActivity,
    removePlace,
    moveUp,
    moveDown,
    handleDownloadOfficialPdf,
    handlePreview,
    handleDownloadDocx,
    travelDateRange,
  };
}

export type ItineraryState = ReturnType<typeof useItineraryState>;
