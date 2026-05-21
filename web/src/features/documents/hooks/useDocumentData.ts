import { useEffect, useState } from "react";
import { getRequirementsData, getItineraryPlaces, getVisaType } from "@/lib/data/repository";
import type { ItineraryPlacesData, VisaType, RequirementsData } from "@/lib/data/types";
import type { DocumentData } from "../../../types/document";
import { mapRequirementsToDocumentData } from "../mapRequirements";

interface UseDocumentDataParams {
  country: string;
  visaType: string;
  location: string;
  sponsorship: string;
  countryName: string;
  visaTypeName: string;
  locationName: string;
}

interface UseDocumentDataResult {
  data: DocumentData | null;
  itineraryData: ItineraryPlacesData | null;
  visaTypeData: VisaType | null;
  requirementsData: RequirementsData | null; // ← exposes raw JSON including photoSpecifications
  loading: boolean;
  error: string | null;
}

export function useDocumentData({
  country,
  visaType,
  location,
  sponsorship,
  countryName,
  visaTypeName,
  locationName,
}: UseDocumentDataParams): UseDocumentDataResult {
  const hasRequiredParams = Boolean(country && visaType && location);

  const [data, setData] = useState<DocumentData | null>(null);
  const [itineraryData, setItineraryData] = useState<ItineraryPlacesData | null>(null);
  const [visaTypeData, setVisaTypeData] = useState<VisaType | null>(null);
  const [requirementsData, setRequirementsData] = useState<RequirementsData | null>(null); // ← new
  const [loading, setLoading] = useState(hasRequiredParams);
  const [error, setError] = useState<string | null>(
    hasRequiredParams ? null : "Missing required parameters (country, visaType, location)."
  );

  const [prevParams, setPrevParams] = useState({ country, visaType, location, sponsorship });

  const paramsChanged =
    prevParams.country !== country ||
    prevParams.visaType !== visaType ||
    prevParams.location !== location ||
    prevParams.sponsorship !== sponsorship;

  if (paramsChanged) {
    setPrevParams({ country, visaType, location, sponsorship });
    setData(null);
    setItineraryData(null);
    setVisaTypeData(null);
    setRequirementsData(null);
    if (!hasRequiredParams) {
      setError("Missing required parameters (country, visaType, location).");
      setLoading(false);
    } else {
      setError(null);
      setLoading(true);
    }
  }

  useEffect(() => {
    if (!country || !visaType || !location) {
      return;
    }

    Promise.all([
      getRequirementsData(country, visaType, location),
      getItineraryPlaces(country),
      getVisaType(country, visaType),
    ])
      .then(([req, itin, vt]) => {
        if (!req) {
          setError(`No requirements found for ${countryName} · ${visaTypeName} · ${locationName}.`);
          setLoading(false);
          return;
        }
        setRequirementsData(req); // ← store raw JSON so callers can access photoSpecifications etc.
        setData(mapRequirementsToDocumentData(req, countryName, visaTypeName, locationName, sponsorship));
        setItineraryData(itin);
        setVisaTypeData(vt);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load document requirements.");
        setLoading(false);
      });
  }, [country, visaType, location, sponsorship, countryName, visaTypeName, locationName]);

  return { data, itineraryData, visaTypeData, requirementsData, loading, error };
}