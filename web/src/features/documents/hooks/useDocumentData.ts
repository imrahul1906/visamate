import { useEffect, useState } from "react";
import { getRequirementsData, getItineraryPlaces, getVisaType } from "@/lib/data/repository";
import type { ItineraryPlacesData, VisaType } from "@/lib/data/types";
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
  const [data, setData] = useState<DocumentData | null>(null);
  const [itineraryData, setItineraryData] = useState<ItineraryPlacesData | null>(null);
  const [visaTypeData, setVisaTypeData] = useState<VisaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!country || !visaType || !location) {
      setError("Missing required parameters (country, visaType, location).");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

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

  return { data, itineraryData, visaTypeData, loading, error };
}
