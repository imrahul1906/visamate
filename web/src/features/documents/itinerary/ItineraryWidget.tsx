"use client";

import React from "react";
import type { ItineraryCityMap } from "@/lib/data/types";
import { useItineraryState } from "./useItineraryState";
import ItinerarySelect from "./ItinerarySelect";
import ItineraryBuilder from "./ItineraryBuilder";
import ItineraryPreview from "./ItineraryPreview";
import { styles } from "./itineraryStyles";

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
  const state = useItineraryState({
    countryName,
    cities,
    onDocxReady,
  });

  const { mode, handleDownloadOfficialPdf, setMode } = state;

  return (
    <>
      <style>{styles}</style>

      {mode === "select" && (
        <ItinerarySelect
          countryName={countryName}
          onDownloadBlank={handleDownloadOfficialPdf}
          onStartBuilder={() => setMode("helper")}
        />
      )}

      {mode === "helper" && (
        <ItineraryBuilder
          countryName={countryName}
          cities={cities}
          typeColors={typeColors}
          state={state}
        />
      )}

      {mode === "preview" && (
        <ItineraryPreview countryName={countryName} state={state} />
      )}
    </>
  );
}