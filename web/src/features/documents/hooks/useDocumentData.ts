import { useEffect, useState } from "react";
import { getRequirementsData, getItineraryPlaces, getVisaType, getCountryInfo } from "@/lib/data/repository";
import type { ItineraryPlacesData, VisaType, RequirementsData, CountryInfo } from "@/lib/data/types";
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
  countryInfo: CountryInfo | null;
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
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState(hasRequiredParams);
  const [error, setError] = useState<string | null>(
    hasRequiredParams ? null : "Missing required parameters (country, visaType, location)."
  );

  useEffect(() => {
    setData(null);
    setItineraryData(null);
    setVisaTypeData(null);
    setRequirementsData(null);
    setCountryInfo(null);

    if (!country || !visaType || !location) {
      setError("Missing required parameters (country, visaType, location).");
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);

    Promise.all([
      getRequirementsData(country, visaType, location),
      getItineraryPlaces(country),
      getVisaType(country, visaType),
      getCountryInfo(country),
    ])
      .then(([req, itin, vt, ci]) => {
        if (!req) {
          setError(`No requirements found for ${countryName} · ${visaTypeName} · ${locationName}.`);
          setLoading(false);
          return;
        }
        setRequirementsData(req); // ← store raw JSON so callers can access photoSpecifications etc.
        setData(mapRequirementsToDocumentData(req, countryName, visaTypeName, locationName, sponsorship));
        setItineraryData(itin);
        setVisaTypeData(vt);
        setCountryInfo(ci);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load document requirements.");
        setLoading(false);
      });
  }, [country, visaType, location, sponsorship, countryName, visaTypeName, locationName]);

  return { data, itineraryData, visaTypeData, requirementsData, countryInfo, loading, error };
}